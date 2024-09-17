ALTER TABLE "public"."requests" ADD COLUMN "servicer_id" uuid;
ALTER TABLE "public"."requests" ADD COLUMN "servicer_claimed_at" timestamp with time zone;
ALTER TABLE "public"."requests" ADD COLUMN "public_can_claim" boolean default FALSE;

ALTER TABLE ONLY "public"."requests" ADD CONSTRAINT "requests_servicer_id_fkey" FOREIGN KEY ("servicer_id") REFERENCES "public"."user"("id") ON DELETE SET NULL;

-- Example: enable the "pg_cron" extension
create extension pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

CREATE OR REPLACE FUNCTION public.clear_old_claims()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.requests
    SET servicer_id = NULL,
        servicer_claimed_at = NULL,
        status_id = 1
    WHERE servicer_claimed_at < NOW() - INTERVAL '48 hours'
      AND status_id = 2
      AND repository_id IS NULL
      AND public_can_claim = TRUE
      AND servicer_id IS NOT NULL;
END;
$$;

SELECT cron.schedule('clear_stale_claims', '*/5 * * * *', 'SELECT public.clear_old_claims()');

DROP POLICY IF EXISTS "Read Public Requests" ON "public"."requests";
create policy "Read Public Requests"
on "public"."requests"
as permissive
for select
to authenticated
using ((public_can_claim = true) AND (servicer_id IS NULL) AND (status_id = 1));

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
        status_id = 2
    WHERE id = input_request_id
      AND servicer_id IS NULL
      AND status_id = 1
      AND public_can_claim = TRUE;
END;
$$;

revoke execute on function public.claim_request from public;
revoke execute on function public.claim_request from anon;
grant execute on function public.claim_request to authenticated;


DROP POLICY IF EXISTS "Allow read for org owner" ON "public"."requests";
CREATE POLICY "Allow read for servicers" ON "public"."requests"
AS permissive FOR select TO authenticated
USING (auth.uid() IN (
    SELECT organizations.owner_id FROM organizations
    WHERE (organizations.id IN (
        SELECT repositories.organization_id FROM repositories
        WHERE (repositories.id = repositories.id)
    ))
) OR auth.uid() = servicer_id);

DROP POLICY IF EXISTS "Allow update for organization owner" ON "public"."requests";
CREATE POLICY "Allow update for servicers" ON "public"."requests"
AS permissive FOR update TO authenticated
USING (auth.uid() IN (
    SELECT organizations.owner_id FROM organizations
    WHERE (organizations.id IN (
        SELECT repositories.organization_id FROM repositories
        WHERE (repositories.id = repositories.id)
    ))
) OR auth.uid() = servicer_id);

DROP POLICY IF EXISTS "Allow Authenticated Read" ON "public"."request_events";
CREATE POLICY "Allow Authorized Read" ON "public"."request_events"
AS permissive FOR select TO authenticated
USING (auth.uid() IN (
    SELECT organizations.owner_id FROM organizations
    WHERE (organizations.id IN (
        SELECT repositories.organization_id FROM repositories
        WHERE (repositories.id IN (
            SELECT requests.repository_id FROM requests
            WHERE (requests.id = request_id)
        ))
    ))
) OR auth.uid() IN (
    SELECT servicer_id FROM requests
    WHERE (requests.id = request_id)
));

DROP POLICY IF EXISTS "Allow Authenticated Insert" ON "public"."request_events";
CREATE POLICY "Allow Authorized Insert" ON "public"."request_events"
AS permissive FOR insert TO authenticated
WITH CHECK (auth.uid() IN (
    SELECT organizations.owner_id FROM organizations
    WHERE (organizations.id IN (
        SELECT repositories.organization_id FROM repositories
        WHERE (repositories.id IN (
            SELECT requests.repository_id FROM requests
            WHERE (requests.id = request_id)
        ))
    ))
) OR auth.uid() IN (
    SELECT servicer_id FROM requests
    WHERE (requests.id = request_id)
));