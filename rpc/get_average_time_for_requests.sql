CREATE OR REPLACE FUNCTION public.get_average_time_for_requests(org_id int8)
  RETURNS TABLE(totalCount int8, totalTime numeric, averageTime numeric)
AS $$
BEGIN
  RETURN QUERY SELECT 
    count(*) as totalCount,
    extract(epoch from sum(updated_at - created_at)) as totalTime,
    extract(epoch from sum(updated_at - created_at) / count(*)) as averageTime
  FROM requests 
  WHERE requests.status_id in (3,4)
  AND requests.created_at != requests.updated_at
  AND requests.repository_id IN (
    SELECT id FROM repositories WHERE organization_id = org_id
  );
END;
$$ LANGUAGE plpgsql security definer;