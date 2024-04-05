
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '"public", "extensions"', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."create_pricing_summary_on_request"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.pricing_summaries (request_id, base_fee, service_fee, total) VALUES (new.id, 0, 0, 0) ON CONFLICT (request_id) DO NOTHING;
    return new;
END;
$$;

ALTER FUNCTION "public"."create_pricing_summary_on_request"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_request_clients_vendors"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.request_clients (request_id, label) VALUES (new.id, new.citation)
  ON CONFLICT (request_id) DO NOTHING;
  INSERT INTO public.request_vendors (request_id, label) VALUES (new.id, new.citation)
  ON CONFLICT (request_id) DO NOTHING;
  return new;
END;
$$;

ALTER FUNCTION "public"."create_request_clients_vendors"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_user"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.user (id, email, name, phone) VALUES (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'phone')
  ON CONFLICT (id) DO UPDATE SET email = new.email;
  return new;
END;
$$;

ALTER FUNCTION "public"."create_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."event_add_attachment"(request_id bigint, user_id uuid) RETURNS bigint
    LANGUAGE "plpgsql"
    AS $_$
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
$_$;

ALTER FUNCTION "public"."event_add_attachment"(request_id bigint, user_id uuid) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."event_add_internal"(request_id bigint, user_id uuid, message text) RETURNS bigint
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  created_id int8;
  request public.requests%rowtype;
BEGIN
    SELECT * FROM public.requests INTO request WHERE id = $1;
    INSERT INTO public.request_events (request_id, user_id, status_id, description, auto)
    SELECT $1, $2, request.status_id, $3, FALSE
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.status_id = request.status_id
        AND request_events.auto = FALSE
        AND request_events.created_at >= NOW() - INTERVAL '1 minute'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$_$;

ALTER FUNCTION "public"."event_add_internal"(request_id bigint, user_id uuid, message text) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."event_download_attachment"(request_id bigint, user_id uuid) RETURNS bigint
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  created_id int8;
  request public.requests%rowtype;
BEGIN
    SELECT * FROM public.requests INTO request WHERE id = $1;
    INSERT INTO public.request_events (request_id, user_id, status_id, description)
    SELECT $1, $2, request.status_id, '%u downloaded an attachment.'
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.status_id = request.status_id
        AND request_events.description = '%u downloaded an attachment.'
        AND request_events.created_at >= NOW() - INTERVAL '5 minutes'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$_$;

ALTER FUNCTION "public"."event_download_attachment"(request_id bigint, user_id uuid) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."event_request_edited"(request_id bigint, user_id uuid) RETURNS bigint
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  created_id int8;
  request public.requests%rowtype;
BEGIN
    SELECT * FROM public.requests INTO request WHERE id = $1;
    INSERT INTO public.request_events (request_id, user_id, status_id, description)
    SELECT $1, $2, request.status_id, '%u edited request metadata.'
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.status_id = request.status_id
        AND request_events.description = '%u edited request metadata.'
        AND request_events.created_at >= NOW() - INTERVAL '5 minutes'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$_$;

ALTER FUNCTION "public"."event_request_edited"(request_id bigint, user_id uuid) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."event_status_changed"(request_id bigint, user_id uuid) RETURNS bigint
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  created_id int8;
  request public.requests%rowtype;
BEGIN
    SELECT * FROM public.requests INTO request WHERE id = $1;
    INSERT INTO public.request_events (request_id, user_id, status_id, description)
    SELECT $1, $2, request.status_id, '%u changed request status to %s.'
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.status_id = request.status_id
        AND request_events.description = '%u changed request status to %s.'
        AND request_events.created_at >= NOW() - INTERVAL '5 minutes'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$_$;

ALTER FUNCTION "public"."event_status_changed"(request_id bigint, user_id uuid) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_average_time_for_requests"(org_id bigint) RETURNS TABLE(totalcount bigint, totaltime numeric, averagetime numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
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
$$;

ALTER FUNCTION "public"."get_average_time_for_requests"(org_id bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_requests_with_last_comment"(user_id_input uuid) RETURNS SETOF json
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(json_build_object('request', request, 'last_comment', last_comment, 'request_vendor', request_vendor, 'request_client', request_client))
    INTO result
    FROM (
        SELECT
            row_to_json(r.*) AS request,
            row_to_json(rc.*) AS last_comment,
            row_to_json(rv.*) AS request_vendor,
            row_to_json(rc2.*) AS request_client
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
        LEFT JOIN
            request_vendors rv ON r.id = rv.request_id
        LEFT JOIN
            request_clients rc2 ON r.id = rc2.request_id
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
$$;

ALTER FUNCTION "public"."get_requests_with_last_comment"(user_id_input uuid) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."request_printed"(request_id bigint, user_id uuid) RETURNS bigint
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  created_id int8;
  request public.requests%rowtype;
BEGIN
    SELECT * FROM public.requests INTO request WHERE id = $1;
    INSERT INTO public.request_events (request_id, user_id, status_id, description)
    SELECT $1, $2, request.status_id, '%u printed.'
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.status_id = request.status_id
        AND request_events.description = '%u printed.'
        AND request_events.created_at >= NOW() - INTERVAL '5 minutes'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$_$;

ALTER FUNCTION "public"."request_printed"(request_id bigint, user_id uuid) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."sent_chat"(request_id bigint, user_id uuid) RETURNS bigint
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  created_id int8;
  request public.requests%rowtype;
BEGIN
    SELECT * FROM public.requests INTO request WHERE id = $1;
    INSERT INTO public.request_events (request_id, user_id, status_id, description)
    SELECT $1, $2, request.status_id, '%u initiated a chat.'
    WHERE NOT EXISTS(
        SELECT 1
        FROM public.request_events
        WHERE request_events.request_id = $1
        AND request_events.user_id = $2
        AND request_events.status_id = request.status_id
        AND request_events.description = '%u initiated a chat.'
        AND request_events.created_at >= NOW() - INTERVAL '5 minutes'
    ) RETURNING id into created_id;
    RETURN created_id;
END;
$_$;

ALTER FUNCTION "public"."sent_chat"(request_id bigint, user_id uuid) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."attachments" (
    "id" bigint NOT NULL,
    "request_id" bigint,
    "user_id" uuid,
    "url" text,
    "mime" text,
    "label" text,
    "pages" integer,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "size" numeric
);

ALTER TABLE "public"."attachments" OWNER TO "postgres";

ALTER TABLE "public"."attachments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."attachments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."featured_images" (
    "id" bigint NOT NULL,
    "user_id" uuid,
    "url" text,
    "label" text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE "public"."featured_images" OWNER TO "postgres";

ALTER TABLE "public"."featured_images" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."featured_images_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."institution_ingestion" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "name" character varying,
    "repository" character varying,
    "account_email" character varying,
    "website" character varying,
    "address" character varying,
    "photo_option" character varying,
    "contact_name" character varying,
    "contact_email" character varying,
    "additional_details" text
);

ALTER TABLE "public"."institution_ingestion" OWNER TO "postgres";

ALTER TABLE "public"."institution_ingestion" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."institution_ingestion_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" bigint NOT NULL,
    "to_user_id" uuid,
    "subject" text,
    "dynamic_data" json,
    "template_name" text,
    "sent" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE "public"."messages" OWNER TO "postgres";

ALTER TABLE "public"."messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."organization_users" (
    "organization_id" bigint NOT NULL,
    "user_id" uuid NOT NULL
);

ALTER TABLE "public"."organization_users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" bigint NOT NULL,
    "address" text,
    "name" text,
    "slug" text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "owner_id" uuid,
    "featured_image_id" bigint
);

ALTER TABLE "public"."organizations" OWNER TO "postgres";

ALTER TABLE "public"."organizations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."organizations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."payment_associations" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "stripe_access_token" character varying,
    "stripe_livemode" boolean,
    "stripe_refresh_token" character varying,
    "stripe_scope" character varying,
    "stripe_publishable_key" character varying,
    "stripe_user_id" character varying,
    "stripe_token_type" character varying,
    "stripe_customer_id" character varying,
    "user_id" uuid
);

ALTER TABLE "public"."payment_associations" OWNER TO "postgres";

ALTER TABLE "public"."payment_associations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."payment_associations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."pricing_summaries" (
    "id" bigint NOT NULL,
    "request_id" bigint,
    "base_fee" bigint,
    "service_fee" bigint,
    "total" bigint
);

ALTER TABLE "public"."pricing_summaries" OWNER TO "postgres";

ALTER TABLE "public"."pricing_summaries" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pricing_summaries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" bigint NOT NULL,
    "request_id" bigint,
    "user_id" uuid,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE "public"."reports" OWNER TO "postgres";

ALTER TABLE "public"."reports" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."reports_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."repositories" (
    "id" bigint NOT NULL,
    "name" text,
    "address1" text,
    "address2" text,
    "city" text,
    "state" text,
    "postal_code" text,
    "country_code" text,
    "geography" geography,
    "active" boolean,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "organization_id" bigint,
    "featured_image_id" bigint
);

ALTER TABLE "public"."repositories" OWNER TO "postgres";

ALTER TABLE "public"."repositories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."repositories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."request_clients" (
    "request_id" bigint NOT NULL,
    "label" text,
    "has_unread" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."request_clients" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."request_comments" (
    "id" bigint NOT NULL,
    "user_id" uuid,
    "request_id" bigint,
    "content" text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "vendor" boolean DEFAULT false
);

ALTER TABLE "public"."request_comments" OWNER TO "postgres";

ALTER TABLE "public"."request_comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."request_comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."request_events" (
    "id" bigint NOT NULL,
    "request_id" bigint,
    "user_id" uuid,
    "status_id" bigint,
    "description" text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "auto" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."request_events" OWNER TO "postgres";

ALTER TABLE "public"."request_events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."request_events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."request_vendors" (
    "request_id" bigint NOT NULL,
    "label" text,
    "has_unread" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."request_vendors" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."requests" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "repository_id" bigint,
    "citation" text,
    "pages" integer,
    "status_id" bigint,
    "user_id" uuid,
    "archive_citation" text,
    "archive_notes" text
);

ALTER TABLE "public"."requests" OWNER TO "postgres";

ALTER TABLE "public"."requests" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."requests_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."requests_prospective" (
    "id" bigint NOT NULL,
    "user_id" uuid,
    "title" text,
    "description" text,
    "repository_name" text,
    "repository_location" text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE "public"."requests_prospective" OWNER TO "postgres";

ALTER TABLE "public"."requests_prospective" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."requests_prospective_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."status" (
    "id" bigint NOT NULL,
    "name" text
);

ALTER TABLE "public"."status" OWNER TO "postgres";

ALTER TABLE "public"."status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" uuid NOT NULL,
    "email" text,
    "name" character varying,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "phone" text,
    "admin" boolean DEFAULT false NOT NULL
);

DROP FUNCTION IF EXISTS public.create_user cascade;

CREATE OR REPLACE FUNCTION public.create_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user (id, email, name, phone) VALUES (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'phone')
  ON CONFLICT (id) DO UPDATE SET email = new.email;
  return new;
END;
$$ LANGUAGE plpgsql security definer;

drop trigger if exists create_user_on_signup on auth.users;
create trigger create_user_on_signup
  after update or insert on auth.users
  for each row execute procedure public.create_user();

ALTER TABLE "public"."user" OWNER TO "postgres";

ALTER TABLE ONLY "public"."attachments"
    ADD CONSTRAINT "attachments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."featured_images"
    ADD CONSTRAINT "featured_images_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."institution_ingestion"
    ADD CONSTRAINT "institution_ingestion_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."organization_users"
    ADD CONSTRAINT "organization_users_pkey" PRIMARY KEY ("organization_id", "user_id");

ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."payment_associations"
    ADD CONSTRAINT "payment_associations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."pricing_summaries"
    ADD CONSTRAINT "pricing_summaries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."pricing_summaries"
    ADD CONSTRAINT "pricing_summaries_request_id_key" UNIQUE ("request_id");

ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."repositories"
    ADD CONSTRAINT "repositories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."request_clients"
    ADD CONSTRAINT "request_clients_pkey" PRIMARY KEY ("request_id");

ALTER TABLE ONLY "public"."request_comments"
    ADD CONSTRAINT "request_comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."request_events"
    ADD CONSTRAINT "request_events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."request_vendors"
    ADD CONSTRAINT "request_vendors_pkey" PRIMARY KEY ("request_id");

ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."requests_prospective"
    ADD CONSTRAINT "requests_prospective_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."status"
    ADD CONSTRAINT "status_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

CREATE TRIGGER create_client_vendor_on_request_create AFTER INSERT ON public.requests FOR EACH ROW EXECUTE FUNCTION create_request_clients_vendors();

CREATE TRIGGER create_pricing_summary_on_request_create AFTER INSERT ON public.requests FOR EACH ROW EXECUTE FUNCTION create_pricing_summary_on_request();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER join_us AFTER INSERT ON public.institution_ingestion FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://gvhzhuifsgdcpwmkjboy.functions.supabase.co/join-us-webhook-function', 'POST', '{"Content-type":"application/json"}', '{}', '1000');

ALTER TABLE ONLY "public"."attachments"
    ADD CONSTRAINT "attachments_request_id_fkey" FOREIGN KEY (request_id) REFERENCES requests(id);

ALTER TABLE ONLY "public"."attachments"
    ADD CONSTRAINT "attachments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."featured_images"
    ADD CONSTRAINT "featured_images_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_to_user_id_fkey" FOREIGN KEY (to_user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."organization_users"
    ADD CONSTRAINT "organization_users_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id);

ALTER TABLE ONLY "public"."organization_users"
    ADD CONSTRAINT "organization_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_featured_image_id_fkey" FOREIGN KEY (featured_image_id) REFERENCES featured_images(id);

ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."payment_associations"
    ADD CONSTRAINT "payment_associations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."pricing_summaries"
    ADD CONSTRAINT "pricing_summaries_request_id_fkey" FOREIGN KEY (request_id) REFERENCES requests(id);

ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_request_id_fkey" FOREIGN KEY (request_id) REFERENCES requests(id);

ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."repositories"
    ADD CONSTRAINT "repositories_featured_image_id_fkey" FOREIGN KEY (featured_image_id) REFERENCES featured_images(id);

ALTER TABLE ONLY "public"."repositories"
    ADD CONSTRAINT "repositories_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id);

ALTER TABLE ONLY "public"."request_clients"
    ADD CONSTRAINT "request_clients_request_id_fkey" FOREIGN KEY (request_id) REFERENCES requests(id);

ALTER TABLE ONLY "public"."request_comments"
    ADD CONSTRAINT "request_comments_request_id_fkey" FOREIGN KEY (request_id) REFERENCES requests(id);

ALTER TABLE ONLY "public"."request_comments"
    ADD CONSTRAINT "request_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."request_events"
    ADD CONSTRAINT "request_events_request_id_fkey" FOREIGN KEY (request_id) REFERENCES requests(id);

ALTER TABLE ONLY "public"."request_events"
    ADD CONSTRAINT "request_events_status_id_fkey" FOREIGN KEY (status_id) REFERENCES status(id);

ALTER TABLE ONLY "public"."request_events"
    ADD CONSTRAINT "request_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."request_vendors"
    ADD CONSTRAINT "request_vendors_request_id_fkey" FOREIGN KEY (request_id) REFERENCES requests(id);

ALTER TABLE ONLY "public"."requests_prospective"
    ADD CONSTRAINT "requests_prospective_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_repository_id_fkey" FOREIGN KEY (repository_id) REFERENCES repositories(id);

ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_status_id_fkey" FOREIGN KEY (status_id) REFERENCES status(id);

ALTER TABLE ONLY "public"."requests"
    ADD CONSTRAINT "requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id);

ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id);

CREATE POLICY "Allow Read for Owner" ON "public"."user" FOR SELECT USING ((auth.uid() = id));

CREATE POLICY "Allow authenticated users to insert" ON "public"."requests_prospective" FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));

CREATE POLICY "Allow client read" ON "public"."attachments" FOR SELECT USING ((auth.uid() IN ( SELECT requests.user_id
   FROM requests
  WHERE (requests.id = attachments.request_id))));

CREATE POLICY "Allow full access for admin" ON "public"."requests_prospective" USING ((auth.uid() IN ( SELECT "user".id
   FROM "user"
  WHERE ("user".admin = true))));

CREATE POLICY "Allow full read" ON "public"."organizations" FOR SELECT USING (true);

CREATE POLICY "Allow full read" ON "public"."repositories" FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated" ON "public"."featured_images" FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));

CREATE POLICY "Allow insert for authenticated" ON "public"."requests" FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));

CREATE POLICY "Allow organization owner insert" ON "public"."attachments" FOR INSERT WITH CHECK ((auth.uid() IN ( SELECT organizations.owner_id
   FROM organizations)));

CREATE POLICY "Allow owner delete" ON "public"."attachments" FOR DELETE USING ((auth.uid() = user_id));

CREATE POLICY "Allow owner edit" ON "public"."organizations" FOR UPDATE USING ((auth.uid() = owner_id));

CREATE POLICY "Allow owner read" ON "public"."attachments" FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Allow owner update" ON "public"."attachments" FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Allow read all" ON "public"."featured_images" FOR SELECT USING (true);

CREATE POLICY "Allow read for creator" ON "public"."requests" FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Allow read for creator" ON "public"."requests_prospective" FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Allow read for org owner" ON "public"."requests" FOR SELECT USING ((auth.uid() IN ( SELECT organizations.owner_id
   FROM organizations
  WHERE (organizations.id IN ( SELECT repositories.organization_id
           FROM repositories
          WHERE (repositories.id = repositories.id))))));

CREATE POLICY "Allow read for owner" ON "public"."payment_associations" FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Allow read for owner" ON "public"."request_clients" FOR SELECT USING ((auth.uid() IN ( SELECT requests.user_id
   FROM requests
  WHERE (requests.id = request_clients.request_id))));

CREATE POLICY "Allow read from owner" ON "public"."request_vendors" FOR SELECT USING ((auth.uid() IN ( SELECT organizations.owner_id
   FROM organizations
  WHERE (organizations.id IN ( SELECT repositories.organization_id
           FROM repositories
          WHERE (repositories.id IN ( SELECT requests.repository_id
                   FROM requests
                  WHERE (requests.id = request_vendors.request_id))))))));

CREATE POLICY "Allow update for creator" ON "public"."requests" FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Allow update for organization owner" ON "public"."requests" FOR UPDATE USING ((auth.uid() IN ( SELECT organizations.owner_id
   FROM organizations
  WHERE (organizations.id IN ( SELECT repositories.organization_id
           FROM repositories
          WHERE (repositories.id = repositories.id))))));

CREATE POLICY "Allow update for owner" ON "public"."payment_associations" FOR UPDATE USING ((auth.uid() = user_id));

CREATE POLICY "Allow update for owner" ON "public"."request_clients" FOR UPDATE USING ((auth.uid() IN ( SELECT requests.user_id
   FROM requests
  WHERE (requests.id = request_clients.request_id))));

CREATE POLICY "Allow update for owner" ON "public"."request_vendors" FOR UPDATE USING ((auth.uid() IN ( SELECT organizations.owner_id
   FROM organizations
  WHERE (organizations.id IN ( SELECT repositories.organization_id
           FROM repositories
          WHERE (repositories.id IN ( SELECT requests.repository_id
                   FROM requests
                  WHERE (requests.id = request_vendors.request_id))))))));

CREATE POLICY "Enable insert access for all users" ON "public"."institution_ingestion" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."institution_ingestion" FOR SELECT USING (true);

CREATE POLICY "Enable read access to all users" ON "public"."status" FOR SELECT USING (true);

CREATE POLICY "Full Access for Admin" ON "public"."repositories" USING ((auth.uid() IN ( SELECT "user".id
   FROM "user"
  WHERE ("user".admin = true))));

CREATE POLICY "Full Access for Admins" ON "public"."organizations" USING ((auth.uid() IN ( SELECT "user".id
   FROM "user"
  WHERE ("user".admin = true))));

CREATE POLICY "Full Management if Admin" ON "public"."user" USING ((auth.uid() IN ( SELECT "user".id
   FROM USER user_1("user")
  WHERE ("user".admin = true))));

CREATE POLICY "Read for Authenticated" ON "public"."user" FOR SELECT TO authenticated USING ((auth.role() = 'authenticated'::text));

CREATE POLICY "Update if Owner" ON "public"."user" FOR UPDATE USING ((auth.uid() = id));

CREATE POLICY "Update if org owner" ON "public"."repositories" FOR UPDATE USING ((auth.uid() IN ( SELECT organizations.owner_id
   FROM organizations
  WHERE (organizations.id = repositories.organization_id))));

CREATE POLICY "Update if owner" ON "public"."featured_images" FOR UPDATE USING ((auth.uid() = user_id));

ALTER TABLE "public"."attachments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."featured_images" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."institution_ingestion" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."payment_associations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."repositories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."request_clients" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."request_vendors" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."requests" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."requests_prospective" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."status" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT ALL ON SCHEMA "public" TO PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_pricing_summary_on_request"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_pricing_summary_on_request"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_pricing_summary_on_request"() TO "service_role";

GRANT ALL ON FUNCTION "public"."create_request_clients_vendors"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_request_clients_vendors"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_request_clients_vendors"() TO "service_role";

GRANT ALL ON FUNCTION "public"."create_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."event_add_attachment"(request_id bigint, user_id uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."event_add_attachment"(request_id bigint, user_id uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."event_add_attachment"(request_id bigint, user_id uuid) TO "service_role";

GRANT ALL ON FUNCTION "public"."event_add_internal"(request_id bigint, user_id uuid, message text) TO "anon";
GRANT ALL ON FUNCTION "public"."event_add_internal"(request_id bigint, user_id uuid, message text) TO "authenticated";
GRANT ALL ON FUNCTION "public"."event_add_internal"(request_id bigint, user_id uuid, message text) TO "service_role";

GRANT ALL ON FUNCTION "public"."event_download_attachment"(request_id bigint, user_id uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."event_download_attachment"(request_id bigint, user_id uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."event_download_attachment"(request_id bigint, user_id uuid) TO "service_role";

GRANT ALL ON FUNCTION "public"."event_request_edited"(request_id bigint, user_id uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."event_request_edited"(request_id bigint, user_id uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."event_request_edited"(request_id bigint, user_id uuid) TO "service_role";

GRANT ALL ON FUNCTION "public"."event_status_changed"(request_id bigint, user_id uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."event_status_changed"(request_id bigint, user_id uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."event_status_changed"(request_id bigint, user_id uuid) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_average_time_for_requests"(org_id bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_average_time_for_requests"(org_id bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_average_time_for_requests"(org_id bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_requests_with_last_comment"(user_id_input uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."get_requests_with_last_comment"(user_id_input uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_requests_with_last_comment"(user_id_input uuid) TO "service_role";

GRANT ALL ON FUNCTION "public"."request_printed"(request_id bigint, user_id uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."request_printed"(request_id bigint, user_id uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."request_printed"(request_id bigint, user_id uuid) TO "service_role";

GRANT ALL ON FUNCTION "public"."sent_chat"(request_id bigint, user_id uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."sent_chat"(request_id bigint, user_id uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sent_chat"(request_id bigint, user_id uuid) TO "service_role";

GRANT ALL ON TABLE "public"."attachments" TO "anon";
GRANT ALL ON TABLE "public"."attachments" TO "authenticated";
GRANT ALL ON TABLE "public"."attachments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."attachments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."attachments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."attachments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."featured_images" TO "anon";
GRANT ALL ON TABLE "public"."featured_images" TO "authenticated";
GRANT ALL ON TABLE "public"."featured_images" TO "service_role";

GRANT ALL ON SEQUENCE "public"."featured_images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."featured_images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."featured_images_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."institution_ingestion" TO "anon";
GRANT ALL ON TABLE "public"."institution_ingestion" TO "authenticated";
GRANT ALL ON TABLE "public"."institution_ingestion" TO "service_role";

GRANT ALL ON SEQUENCE "public"."institution_ingestion_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."institution_ingestion_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."institution_ingestion_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."organization_users" TO "anon";
GRANT ALL ON TABLE "public"."organization_users" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_users" TO "service_role";

GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";

GRANT ALL ON SEQUENCE "public"."organizations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."organizations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."organizations_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."payment_associations" TO "anon";
GRANT ALL ON TABLE "public"."payment_associations" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_associations" TO "service_role";

GRANT ALL ON SEQUENCE "public"."payment_associations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payment_associations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payment_associations_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."pricing_summaries" TO "anon";
GRANT ALL ON TABLE "public"."pricing_summaries" TO "authenticated";
GRANT ALL ON TABLE "public"."pricing_summaries" TO "service_role";

GRANT ALL ON SEQUENCE "public"."pricing_summaries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pricing_summaries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pricing_summaries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";

GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reports_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."repositories" TO "anon";
GRANT ALL ON TABLE "public"."repositories" TO "authenticated";
GRANT ALL ON TABLE "public"."repositories" TO "service_role";

GRANT ALL ON SEQUENCE "public"."repositories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."repositories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."repositories_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."request_clients" TO "anon";
GRANT ALL ON TABLE "public"."request_clients" TO "authenticated";
GRANT ALL ON TABLE "public"."request_clients" TO "service_role";

GRANT ALL ON TABLE "public"."request_comments" TO "anon";
GRANT ALL ON TABLE "public"."request_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."request_comments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."request_comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."request_comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."request_comments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."request_events" TO "anon";
GRANT ALL ON TABLE "public"."request_events" TO "authenticated";
GRANT ALL ON TABLE "public"."request_events" TO "service_role";

GRANT ALL ON SEQUENCE "public"."request_events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."request_events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."request_events_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."request_vendors" TO "anon";
GRANT ALL ON TABLE "public"."request_vendors" TO "authenticated";
GRANT ALL ON TABLE "public"."request_vendors" TO "service_role";

GRANT ALL ON TABLE "public"."requests" TO "anon";
GRANT ALL ON TABLE "public"."requests" TO "authenticated";
GRANT ALL ON TABLE "public"."requests" TO "service_role";

GRANT ALL ON SEQUENCE "public"."requests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."requests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."requests_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."requests_prospective" TO "anon";
GRANT ALL ON TABLE "public"."requests_prospective" TO "authenticated";
GRANT ALL ON TABLE "public"."requests_prospective" TO "service_role";

GRANT ALL ON SEQUENCE "public"."requests_prospective_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."requests_prospective_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."requests_prospective_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."status" TO "anon";
GRANT ALL ON TABLE "public"."status" TO "authenticated";
GRANT ALL ON TABLE "public"."status" TO "service_role";

GRANT ALL ON SEQUENCE "public"."status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."status_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
