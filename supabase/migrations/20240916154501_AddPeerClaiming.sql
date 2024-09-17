ALTER TABLE "public"."requests" ADD COLUMN "servicer_id" uuid;
ALTER TABLE "public"."requests" ADD COLUMN "servicer_claimed_at" timestamp with time zone;
ALTER TABLE "public"."requests" ADD COLUMN "public_can_claim" boolean default FALSE;

ALTER TABLE ONLY "public"."requests" ADD CONSTRAINT "requests_servicer_id_fkey" FOREIGN KEY ("servicer_id") REFERENCES "public"."user"("id") ON DELETE SET NULL;

-- ALTER TABLE "public"."user" ADD COLUMN "can_claim" boolean default FALSE;