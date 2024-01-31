CREATE OR REPLACE FUNCTION convert_request(prospective_request_id INT, repository_id INT)
RETURNS SETOF requests AS $$
DECLARE
    rp RECORD;
    inserted_id INT;
BEGIN
    -- Get the prospective_request based on the passed parameter
    SELECT *
    INTO rp
    FROM requests_prospective
    WHERE id = prospective_request_id;

    INSERT INTO requests (repository_id, citation, pages, status_id, user_id)
    VALUES (repository_id, rp.title, 0, 1, rp.user_id)
    RETURNING id INTO inserted_id;

    -- Return the inserted record
    UPDATE requests_prospective
    SET converted = TRUE
    WHERE id = prospective_request_id;

    RETURN query
    SELECT * FROM requests WHERE id = inserted_id;
END
$$ LANGUAGE plpgsql;