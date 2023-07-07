CREATE OR REPLACE FUNCTION get_requests_with_last_comment(user_id_input UUID)
RETURNS SETOF JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(json_build_object('request', request, 'last_comment', last_comment))
    INTO result
    FROM (
        SELECT
            row_to_json(r.*) AS request,
            row_to_json(rc.*) AS last_comment
        FROM
            requests r
        JOIN
            repositories repo ON r.repository_id = repo.id
        JOIN
            organizations org ON repo.organization_id = org.id
        JOIN (
            SELECT
                request_id,
                MAX(created_at) AS max_created_at
            FROM
                request_comments
            GROUP BY
                request_id
        ) latest_comments ON r.id = latest_comments.request_id
        LEFT JOIN
            request_comments rc ON r.id = rc.request_id AND latest_comments.max_created_at = rc.created_at
        WHERE
            r.user_id = user_id_input
            OR org.owner_id = user_id_input
            OR r.repository_id IN (
                SELECT
                    id
                FROM
                    repositories
                WHERE
                    organization_id IN (
                        SELECT
                            id
                        FROM
                            organizations
                        WHERE
                            owner_id = user_id_input
                    )
            )
        ORDER BY
            latest_comments.max_created_at DESC
    ) subquery;

    RETURN QUERY SELECT json_array_elements(result);
END;
$$ LANGUAGE plpgsql;