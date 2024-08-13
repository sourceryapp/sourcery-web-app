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