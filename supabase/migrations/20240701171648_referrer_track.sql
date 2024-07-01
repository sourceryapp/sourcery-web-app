ALTER TABLE "public"."requests" ADD COLUMN "referrer" text;
ALTER TABLE "public"."requests" ADD COLUMN "referrer_data" json;

ALTER TABLE "public"."requests_prospective" ADD COLUMN "referrer" text;
ALTER TABLE "public"."requests_prospective" ADD COLUMN "referrer_data" json;

CREATE OR REPLACE FUNCTION public.convert_request(prospective_request_id integer, repository_id integer)
 RETURNS SETOF requests
 LANGUAGE plpgsql
AS $function$
DECLARE
    rp RECORD;
    inserted_id INT;
BEGIN
    -- Get the prospective_request based on the passed parameter
    SELECT *
    INTO rp
    FROM requests_prospective
    WHERE id = prospective_request_id;

    INSERT INTO requests (repository_id, original_title, citation, pages, status_id, user_id, referrer, referrer_data)
    VALUES (repository_id, rp.title, rp.description, 0, 1, rp.user_id, rp.referrer, rp.referrer_data)
    RETURNING id INTO inserted_id;

    -- Return the inserted record
    UPDATE requests_prospective
    SET converted = TRUE
    WHERE id = prospective_request_id;

    RETURN query
    SELECT * FROM requests WHERE id = inserted_id;
END
$function$
;