-- Add the "original title" column to the requests table
alter table "public"."requests" add column if not exists "original_title" text;

-- Alter the create_request_clients_vendors trigger to use the original title as the label, instead of the citation.
CREATE OR REPLACE FUNCTION "public"."create_request_clients_vendors"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.request_clients (request_id, label)
    VALUES (new.id, new.original_title)
    ON CONFLICT (request_id) DO NOTHING;
  INSERT INTO public.request_vendors (request_id, label)
    VALUES (new.id, new.original_title)
    ON CONFLICT (request_id) DO NOTHING;
  return new;
END;
$$;

drop trigger if exists create_client_vendor_on_request_create on public.requests;
create trigger create_client_vendor_on_request_create
  after insert on public.requests
  for each row execute procedure public.create_request_clients_vendors();


alter table "public"."attachments" add column if not exists "path" text;