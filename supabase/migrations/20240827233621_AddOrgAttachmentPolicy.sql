DROP POLICY IF EXISTS "Allow Servicing Organization Access" ON "public"."attachments";
create policy "Allow Servicing Organization Access"
on "public"."attachments"
as permissive
for select
to public
using (
    (auth.uid() IN ( SELECT organizations.owner_id
   FROM organizations
  WHERE (organizations.id IN ( SELECT repositories.organization_id
           FROM repositories
          WHERE (repositories.id IN ( SELECT requests.repository_id
                   FROM requests
                  WHERE (requests.id = attachments.request_id)))))))
);



DROP POLICY IF EXISTS "Allow Admins All" ON "public"."attachments";
create policy "Allow Admins All"
on "public"."attachments"
as permissive
for all
to public
using (
  (auth.uid() IN ( SELECT "user".id
   FROM "user"
  WHERE ("user".admin = true)))
);