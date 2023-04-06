(auth.uid() IN ( SELECT organizations.owner_id
   FROM organizations
  WHERE (organizations.id IN ( SELECT repositories.organization_id
           FROM repositories
          WHERE (repositories.id IN ( SELECT requests.repository_id
                   FROM requests
                  WHERE (requests.id = request_vendors.request_id)))))))