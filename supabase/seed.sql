-- Create the test user entities in the database.
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at) VALUES ('00000000-0000-0000-0000-000000000000', 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 'authenticated', 'authenticated', 'admin@sourceryapp.org', '$2a$10$VSsNOySBLy0qzxsPKc32zeYmlVAiYcTU.jWV8OcYJcgbzXTiVjrdO', '2024-01-03 16:21:43.34822+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-01-03 16:21:43.342914+00', '2024-01-03 16:21:43.348352+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at) VALUES ('00000000-0000-0000-0000-000000000000', 'c239de9b-905b-4cb0-831f-507f0b07c81c', 'authenticated', 'authenticated', 'test@sourceryapp.org', '$2a$10$d6zpdmKUuZ87FlajN.eDw.O4XxnrzOoVRiai1lZG9vzfV8hhmLdam', '2024-01-03 16:21:57.384257+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-01-03 16:21:57.380455+00', '2024-01-03 16:21:57.384486+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);



-- Create the test user auth identities in the database.
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', '{"sub": "e38cf1f9-ad23-4493-b6cc-aa9ee60081d5", "email": "admin@sourceryapp.org", "email_verified": false, "phone_verified": false}', 'email', '2024-01-03 16:21:43.345152+00', '2024-01-03 16:21:43.345189+00', '2024-01-03 16:21:43.345189+00', 'e2bd9744-b6f8-4647-a66c-124f4ea1ceea');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('c239de9b-905b-4cb0-831f-507f0b07c81c', 'c239de9b-905b-4cb0-831f-507f0b07c81c', '{"sub": "c239de9b-905b-4cb0-831f-507f0b07c81c", "email": "test@sourceryapp.org", "email_verified": false, "phone_verified": false}', 'email', '2024-01-03 16:21:57.381654+00', '2024-01-03 16:21:57.381705+00', '2024-01-03 16:21:57.381705+00', 'f774f3d9-6342-436d-a3cd-3371f5b7873d');


-- Add the user entities into our user reference table in supabase (normally when users are added in the UI they have a trigger on production for this).
INSERT INTO public.user (id, email, name, phone, created_at, admin) VALUES ('e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 'admin@sourceryapp.org', 'Admin User', NULL, '2024-01-03 16:21:43.342914+00', true);
INSERT INTO public.user (id, email, name, phone, created_at, admin) VALUES ('c239de9b-905b-4cb0-831f-507f0b07c81c', 'test@sourceryapp.org', 'Test User',
NULL, '2024-01-03 16:21:57.380455+00', false);


-- Seed Statuses
INSERT INTO public.status (id, name) VALUES (1, 'Submitted');
INSERT INTO public.status (id, name) VALUES (2, 'In Progress');
INSERT INTO public.status (id, name) VALUES (3, 'Complete');
INSERT INTO public.status (id, name) VALUES (4, 'Archived');
INSERT INTO public.status (id, name) VALUES (5, 'Cancelled');


-- Seed a Test Organization
INSERT INTO public.organizations (id, address, name, slug, created_at, owner_id, featured_image_id) VALUES (1, '123 Sourcery Way, Hartford, CT 06105', 'Sourcery Organization', 'sourcery', '2024-01-03 16:21:43.342914+00', 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', NULL);


-- Seed Organization User
INSERT INTO public.organization_users (organization_id, user_id) VALUES (1, 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5');


-- Seed a Test Repository
INSERT INTO public.repositories (id, name, address1, address2, city, state, postal_code, country_code, geography, active, created_at, organization_id, featured_image_id) VALUES (1, 'Sourcery Repository', '123 Sourcery Way', NULL, 'Hartford', 'CT', '06105', 'US', NULL, TRUE, '2024-01-03 16:21:43.342914+00', 1, NULL);


-- Seed a test request from a user.
-- First a submitted request.
INSERT INTO public.requests (id, repository_id, citation, pages, status_id, user_id, archive_citation, archive_notes, created_at, updated_at) VALUES (1, 1, 'This is the contents of a test request that includes information about a document, collection, box, grouping, archive item, etc.', 0, 1, 'c239de9b-905b-4cb0-831f-507f0b07c81c', '', '', '2024-01-03 16:21:43.342914+00', '2024-01-03 16:21:43.342914+00');
-- Then an in progress request.
INSERT INTO public.requests (id, repository_id, citation, pages, status_id, user_id, archive_citation, archive_notes, created_at, updated_at) VALUES (2, 1, 'This is the contents of a test request in-progress that includes information about a document, collection, box, grouping, archive item, etc.', 0, 2, 'c239de9b-905b-4cb0-831f-507f0b07c81c', '', '', '2024-01-03 16:21:43.342914+00', '2024-01-03 16:21:43.342914+00');
-- Then a completed request.
INSERT INTO public.requests (id, repository_id, citation, pages, status_id, user_id, archive_citation, archive_notes, created_at, updated_at) VALUES (3, 1, 'This is the contents of a test request completed that includes information about a document, collection, box, grouping, archive item, etc.', 0, 3, 'c239de9b-905b-4cb0-831f-507f0b07c81c', '', 'This was completed via text.', '2024-01-03 16:21:43.342914+00', '2024-01-03 16:21:43.342914+00');
-- Then an archived request.
INSERT INTO public.requests (id, repository_id, citation, pages, status_id, user_id, archive_citation, archive_notes, created_at, updated_at) VALUES (4, 1, 'This is the contents of a test request archived that includes information about a document, collection, box, grouping, archive item, etc. as well as corrected citation and notes.', 0, 4, 'c239de9b-905b-4cb0-831f-507f0b07c81c', 'archive corrected citation 10.23.3.4', 'archive notes on how to retreive docuemnts at https://google.com.', '2024-01-03 16:21:43.342914+00', '2024-01-03 16:21:43.342914+00');
-- Then a cancelled request.
INSERT INTO public.requests (id, repository_id, citation, pages, status_id, user_id, archive_citation, archive_notes, created_at, updated_at) VALUES (5, 1, 'This is the contents of a cancelled test request that includes information about a document, collection, box, grouping, archive item, etc.', 0, 5, 'c239de9b-905b-4cb0-831f-507f0b07c81c', '', '', '2024-01-03 16:21:43.342914+00', '2024-01-03 16:21:43.342914+00');


-- Update request_clients and request_vendors. (these are created automatically from database trigger).
UPDATE public.request_clients SET label = 'Test Request' WHERE request_id = 1;
UPDATE public.request_clients SET label = 'Test In-Prog Request' WHERE request_id = 2;
UPDATE public.request_clients SET label = 'Test Complete Request' WHERE request_id = 3;
UPDATE public.request_clients SET label = 'Test Archived Request' WHERE request_id = 4;
UPDATE public.request_clients SET label = 'Test Cancelled Request' WHERE request_id = 5;

UPDATE public.request_vendors SET label = 'Test Request' WHERE request_id = 1;
UPDATE public.request_vendors SET label = 'Test In-Prog Request' WHERE request_id = 2;
UPDATE public.request_vendors SET label = 'Test Complete Request' WHERE request_id = 3;
UPDATE public.request_vendors SET label = 'Test Archived Request' WHERE request_id = 4;
UPDATE public.request_vendors SET label = 'Test Cancelled Request' WHERE request_id = 5;

-- Create some request events.
INSERT INTO public.request_events (id, request_id, user_id, status_id, description, created_at, auto) VALUES (1, 1, 'c239de9b-905b-4cb0-831f-507f0b07c81c', 1, '%u edited request metadata.', '2024-01-03 16:21:43.342914+00', TRUE);

INSERT INTO public.request_events (id, request_id, user_id, status_id, description, created_at, auto) VALUES (2, 2, 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 2, '%u changed request status to %s.', '2024-01-03 16:21:43.342914+00', TRUE);

INSERT INTO public.request_events (id, request_id, user_id, status_id, description, created_at, auto) VALUES (3, 3, 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 2, '%u changed request status to %s.', '2024-01-03 16:21:43.342914+00', TRUE);
INSERT INTO public.request_events (id, request_id, user_id, status_id, description, created_at, auto) VALUES (4, 3, 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 3, '%u changed request status to %s.', '2024-01-03 16:21:43.342914+00', TRUE);

INSERT INTO public.request_events (id, request_id, user_id, status_id, description, created_at, auto) VALUES (5, 4, 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 2, '%u changed request status to %s.', '2024-01-03 16:21:43.342914+00', TRUE);
INSERT INTO public.request_events (id, request_id, user_id, status_id, description, created_at, auto) VALUES (6, 4, 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 3, '%u changed request status to %s.', '2024-01-03 16:21:43.342914+00', TRUE);
INSERT INTO public.request_events (id, request_id, user_id, status_id, description, created_at, auto) VALUES (7, 4, 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 4, '%u changed request status to %s.', '2024-01-03 16:21:43.342914+00', TRUE);

INSERT INTO public.request_events (id, request_id, user_id, status_id, description, created_at, auto) VALUES (8, 5, 'e38cf1f9-ad23-4493-b6cc-aa9ee60081d5', 5, '%u changed request status to %s.', '2024-01-03 16:21:43.342914+00', TRUE);


-- Seed a prospective request.
INSERT INTO public.requests_prospective (id, user_id, title, description, repository_name, repository_location, created_at) VALUES (1, 'c239de9b-905b-4cb0-831f-507f0b07c81c', 'Test Prospective Request', 'This is the contents of a test prospective request that includes information about a document, collection, box, grouping, archive item, etc.', 'A New Repository', '123 Anew Way, Hartford, CT 06105', '2024-01-03 16:21:43.342914+00');