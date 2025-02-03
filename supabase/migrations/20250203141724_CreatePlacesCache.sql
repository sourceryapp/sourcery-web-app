CREATE TABLE IF NOT EXISTS public.places (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.places FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select Policy"
ON public.places
AS permissive
FOR select
TO authenticated
USING ((auth.role() = 'authenticated'::text));

ALTER TABLE public.requests
ADD COLUMN place_id INTEGER,
ADD CONSTRAINT fk_place
FOREIGN KEY (place_id) REFERENCES public.places(id);