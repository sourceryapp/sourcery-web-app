CREATE OR REPLACE FUNCTION public.event_add_attachment(request_id int8, user_id uuid) RETURNS int8 AS $$
DECLARE
  created_id int8;
  request public.requests%rowtype;
BEGIN
    SELECT * FROM public.requests INTO request WHERE id = $1;
    INSERT INTO public.request_events (request_id, user_id, status_id, description)
    SELECT $1, $2, request.status_id, '%u uploaded an attachment.'
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.status_id = request.status_id
        AND request_events.description = '%u uploaded an attachment.'
        AND request_events.created_at >= NOW() - INTERVAL '5 minutes'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$$ LANGUAGE plpgsql;