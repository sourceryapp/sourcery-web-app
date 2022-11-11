CREATE OR REPLACE FUNCTION public.request_printed(request_id int8, user_id uuid) RETURNS int8 AS $$
DECLARE
  created_id int8;
BEGIN
    INSERT INTO public.request_events (request_id, user_id, description)
    SELECT $1, $2, 'User printed.'
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.description = 'User printed.'
        AND request_events.created_at >= NOW() - INTERVAL '5 minutes'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$$ LANGUAGE plpgsql;