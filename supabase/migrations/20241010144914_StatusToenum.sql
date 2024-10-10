-- Step 1: Create the new enum type
DO $$ BEGIN
    CREATE TYPE status_enum AS ENUM (
        'STATUS_CREATED',
        'STATUS_UNPAID',
        'STATUS_PAID',
        'STATUS_COMPLETE',
        'STATUS_ARCHIVED',
        'STATUS_CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

drop trigger if exists create_notification_on_request_change_status on public.requests;
DROP POLICY IF EXISTS "Read Public Requests" ON "public"."requests";

-- Step 2: Add the new status column to the requests table
ALTER TABLE requests ADD COLUMN status status_enum;

-- Step 3: Update the status column based on the existing status_id
UPDATE requests SET status = CASE status_id
    WHEN 1 THEN 'STATUS_CREATED'::status_enum
    WHEN 2 THEN 'STATUS_PAID'::status_enum
    WHEN 3 THEN 'STATUS_COMPLETE'::status_enum
    WHEN 4 THEN 'STATUS_ARCHIVED'::status_enum
    WHEN 5 THEN 'STATUS_CANCELLED'::status_enum
    WHEN 6 THEN 'STATUS_PAID'::status_enum
END;

-- Step 4: Drop the old status_id column
ALTER TABLE requests DROP COLUMN status_id;

-- Step 6: Add the new status column to the request_events table
ALTER TABLE request_events ADD COLUMN status status_enum;

-- Step 7: Update the status column based on the existing status_id
UPDATE request_events SET status = CASE status_id
    WHEN 1 THEN 'STATUS_CREATED'::status_enum
    WHEN 2 THEN 'STATUS_PAID'::status_enum
    WHEN 3 THEN 'STATUS_COMPLETE'::status_enum
    WHEN 4 THEN 'STATUS_ARCHIVED'::status_enum
    WHEN 5 THEN 'STATUS_CANCELLED'::status_enum
    WHEN 6 THEN 'STATUS_PAID'::status_enum
END;

-- Step 8: Drop the old status_id column
ALTER TABLE request_events DROP COLUMN status_id;

-- Step 5: Drop the old status table if it's no longer needed
DROP TABLE IF EXISTS status;

-- Update the clear_old_claims 
CREATE OR REPLACE FUNCTION public.clear_old_claims()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.requests
    SET servicer_id = NULL,
        servicer_claimed_at = NULL,
        status = 'STATUS_CREATED'::status_enum
    WHERE servicer_claimed_at < NOW() - INTERVAL '48 hours'
      AND status = 'STATUS_UNPAID'
      AND repository_id IS NULL
      AND public_can_claim = TRUE
      AND servicer_id IS NOT NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_request(input_request_id bigint, input_user_id UUID)
RETURNS void LANGUAGE plpgsql security definer set search_path = 'public' AS $$
BEGIN
    UPDATE public.requests
    SET servicer_id = (
        SELECT id
        FROM public.user
        WHERE id = input_user_id
    ),
        servicer_claimed_at = NOW(),
        status = 'STATUS_PAID'::status_enum
    WHERE id = input_request_id
      AND servicer_id IS NULL
      AND status = 'STATUS_CREATED'
      AND public_can_claim = TRUE;
END;
$$;

DROP POLICY IF EXISTS "Read Public Requests" ON "public"."requests";
create policy "Read Public Requests"
on "public"."requests"
as permissive
for select
to authenticated
using ((public_can_claim = true) AND (servicer_id IS NULL) AND (status = 'STATUS_CREATED'::status_enum));

DROP FUNCTION IF EXISTS public.convert_request(prospective_request_id integer, repository_id integer);


-- Create a function to run after a request has been picked up.
CREATE OR REPLACE FUNCTION public.notification_request_changed_status() RETURNS trigger AS $$
DECLARE
  organization_user_id uuid;
  notification_json json;
BEGIN
    notification_json = jsonb_build_object(
        'request', new
    );

    organization_user_id = (
        SELECT id
        FROM public.user
        WHERE id = (
            SELECT owner_id
            FROM public.organizations
            WHERE id = (
                SELECT organization_id
                FROM public.repositories
                WHERE id = new.repository_id
            )
        )
    );

    if new.status in ('STATUS_PAID') then
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (new.user_id, 'Request Picked Up', 'request_picked_up', notification_json);
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (organization_user_id, 'Request Picked Up', 'request_picked_up', notification_json);
    ELSIF new.status = 'STATUS_COMPLETE' then
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (new.user_id, 'Request Completed', 'request_completed', notification_json);
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (organization_user_id, 'Request Completed', 'request_completed', notification_json);
    ELSIF new.status = 'STATUS_CANCELLED' then
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (new.user_id, 'Request Cancelled', 'request_cancelled', notification_json);
        INSERT INTO public.notifications (user_id, text, type, data) VALUES (organization_user_id, 'Request Cancelled', 'request_cancelled', notification_json);
    END IF;

    return new;
END;
$$ LANGUAGE plpgsql security definer;

-- Create a trigger to run the notification_new_message function after a request comment (chat message) is created.

create trigger create_notification_on_request_change_status
  after update of status on public.requests
  for each row execute procedure public.notification_request_changed_status();


DROP TABLE IF EXISTS requests_prospective;
DROP TABLE IF EXISTS requests_prospective_temp;
DROP TABLE IF EXISTS user_id;


-- Step 9: Add the new columns to the requests table
ALTER TABLE requests ADD COLUMN client_has_unread BOOLEAN DEFAULT FALSE;
ALTER TABLE requests ADD COLUMN vendor_has_unread BOOLEAN DEFAULT FALSE;
ALTER TABLE requests ADD COLUMN client_label TEXT;
ALTER TABLE requests ADD COLUMN vendor_label TEXT;

DROP FUNCTION IF EXISTS "public"."get_average_time_for_requests"(org_id bigint);

-- Step 10: Update the new columns based on the existing request_clients and request_vendors tables
UPDATE requests r
SET client_has_unread = COALESCE(rc.has_unread, FALSE),
    client_label = COALESCE(rc.label, r.original_title)
FROM request_clients rc
WHERE r.id = rc.request_id;

UPDATE requests r
SET vendor_has_unread = COALESCE(rv.has_unread, FALSE),
    vendor_label = COALESCE(rv.label, r.original_title)
FROM request_vendors rv
WHERE r.id = rv.request_id;

-- Alter the create_request_clients_vendors trigger to use the original title as the label, instead of the citation.
CREATE OR REPLACE FUNCTION "public"."create_request_clients_vendors"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE public.requests
    SET client_label = new.original_title,
        vendor_label = new.original_title,
        client_has_unread = FALSE,
        vendor_has_unread = FALSE
    WHERE id = new.id;
  return new;
END;
$$;

-- Step 11: Drop the old request_clients and request_vendors tables
DROP TABLE IF EXISTS request_clients;
DROP TABLE IF EXISTS request_vendors;
DROP TABLE IF EXISTS requests_temp;

-- Alter the sent_chat function to also update request_vendor/request_client with has_unread
CREATE OR REPLACE FUNCTION "public"."sent_chat"(request_id bigint, user_id uuid) RETURNS bigint
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  created_id int8;
  request public.requests%rowtype;
BEGIN
    SELECT * FROM public.requests INTO request WHERE id = $1;

    if request.user_id = $2 then
        UPDATE public.requests
        SET vendor_has_unread = TRUE
        WHERE id = $1;
    else
        UPDATE public.requests
        SET client_has_unread = TRUE
        WHERE id = $1;
    end if;

    INSERT INTO public.request_events (request_id, user_id, status, description)
    SELECT $1, $2, request.status, '%u initiated a chat.'
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.status = request.status
        AND request_events.description = '%u initiated a chat.'
        AND request_events.created_at >= NOW() - INTERVAL '5 minutes'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$_$;