/** Not RPC, but triggers for request creation **/

drop function if exists public.create_pricing_summary_on_request cascade;

create or replace function public.create_pricing_summary_on_request() returns trigger as $$
BEGIN
    INSERT INTO public.pricing_summaries (request_id, base_fee, service_fee, total) VALUES (new.id, 0, 0, 0) ON CONFLICT (request_id) DO NOTHING;
    return new;
END;
$$ LANGUAGE plpgsql security definer;

drop trigger if exists create_pricing_summary_on_request_create on public.requests;
create trigger create_pricing_summary_on_request_create
    after insert on public.requests
    for each row execute procedure public.create_pricing_summary_on_request();