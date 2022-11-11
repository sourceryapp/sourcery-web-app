/** Not RPC, but triggers for request creation **/

DROP FUNCTION IF EXISTS public.create_request_clients_vendors cascade;

CREATE OR REPLACE FUNCTION public.create_request_clients_vendors() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.request_clients (request_id, label) VALUES (new.id, new.citation)
  ON CONFLICT (request_id) DO NOTHING;
  INSERT INTO public.request_vendors (request_id, label) VALUES (new.id, new.citation)
  ON CONFLICT (request_id) DO NOTHING;
  return new;
END;
$$ LANGUAGE plpgsql security definer;

drop trigger if exists create_client_vendor_on_request_create on public.requests;
create trigger create_client_vendor_on_request_create
  after insert on public.requests
  for each row execute procedure public.create_request_clients_vendors();