create or replace function public.graph_organization_requests_by_month(org_id integer)
  RETURNS TABLE(month timestamp with time zone, count bigint)
AS $$
begin
  RETURN query
  SELECT date_trunc('month', created_at) as month, count(id) from requests
  WHERE repository_id IN (
    SELECT id from repositories where organization_id = org_id
  )
  AND created_at > now() - interval '1 year'
  GROUP BY date_trunc('month', created_at);
END;
$$ LANGUAGE plpgsql security invoker;

create or replace function public.organization_user_summary(org_id integer)
  RETURNS TABLE(id uuid, email text, total_requests bigint, last_request_date timestamp with time zone)
AS $$
begin
  RETURN query
  SELECT u.id, u.email, count(r.id) as total_requests, max(r.created_at) as last_request_date
  FROM requests r
  JOIN public.user u ON r.user_id = u.id
  WHERE r.repository_id IN (
    SELECT repositories.id from repositories where organization_id = org_id
  )
  GROUP BY u.id,u.email;
END;
$$ LANGUAGE plpgsql security invoker;