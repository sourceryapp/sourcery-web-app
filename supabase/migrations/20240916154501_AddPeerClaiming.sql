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