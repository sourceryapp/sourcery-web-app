-- Simply add RLS, no public or authenticated access.
-- Email records will be added by a service role in edge functions.
ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

-- Organization User Table RLS
ALTER TABLE "public"."organization_users" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow User Read" ON "public"."organization_users";
create policy "Allow User Read"
on "public"."organization_users"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));

DROP POLICY IF EXISTS "Allow Admin Full Access" ON "public"."organization_users";
create policy "Allow Admin Full Access"
on "public"."organization_users"
as permissive
for all
to authenticated
using (auth.uid() IN (SELECT "user".id FROM "user" WHERE "user".admin = true));

-- Simply add RLS, no public or authenticated access.
-- Pricing summaries will be added by SECURITY DEFINER in postgres functions.
ALTER TABLE "public"."pricing_summaries" ENABLE ROW LEVEL SECURITY;


-- Report Table RLS
ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Authenticated Read" ON "public"."reports";
create policy "Allow Authenticated Read"
on "public"."reports"
as permissive
for select
to authenticated
using (true);

DROP POLICY IF EXISTS "Allow Authenticated Insert" ON "public"."reports";
create policy "Allow Authenticated Insert"
on "public"."reports"
as permissive
for insert
to authenticated
with check ((auth.uid() in (SELECT user_id FROM requests WHERE id = request_id))
    OR (auth.uid() in (SELECT owner_id FROM organizations WHERE id = (SELECT organization_id FROM repositories WHERE id = (SELECT repository_id FROM requests WHERE id = request_id)))));



-- Request Comments Table RLS
ALTER TABLE "public"."request_comments" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Authenticated Read" ON "public"."request_comments";
create policy "Allow Authenticated Read"
on "public"."request_comments"
as permissive
for select
to authenticated
using ((auth.uid() in (SELECT user_id FROM requests WHERE id = request_id))
    OR (auth.uid() in (SELECT owner_id FROM organizations WHERE id = (SELECT organization_id FROM repositories WHERE id = (SELECT repository_id FROM requests WHERE id = request_id)))));

DROP POLICY IF EXISTS "Allow Authenticated Insert" ON "public"."request_comments";
create policy "Allow Authenticated Insert"
on "public"."request_comments"
as permissive
for insert
to authenticated
with check ((auth.uid() in (SELECT user_id FROM requests WHERE id = request_id))
    OR (auth.uid() in (SELECT owner_id FROM organizations WHERE id = (SELECT organization_id FROM repositories WHERE id = (SELECT repository_id FROM requests WHERE id = request_id)))));


-- Request Events RLS
ALTER TABLE "public"."request_events" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Authenticated Read" ON "public"."request_events";
create policy "Allow Authenticated Read"
on "public"."request_events"
as permissive
for select
to authenticated
using ((auth.uid() in (SELECT user_id FROM requests WHERE id = request_id))
    OR (auth.uid() in (SELECT owner_id FROM organizations WHERE id = (SELECT organization_id FROM repositories WHERE id = (SELECT repository_id FROM requests WHERE id = request_id)))));

DROP POLICY IF EXISTS "Allow Authenticated Insert" ON "public"."request_events";
create policy "Allow Authenticated Insert"
on "public"."request_events"
as permissive
for insert
to authenticated
with check ((auth.uid() in (SELECT user_id FROM requests WHERE id = request_id))
    OR (auth.uid() in (SELECT owner_id FROM organizations WHERE id = (SELECT organization_id FROM repositories WHERE id = (SELECT repository_id FROM requests WHERE id = request_id)))));