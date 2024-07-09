-- Add new columns to the temporary table
ALTER TABLE requests ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS repository_name TEXT DEFAULT null;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS repository_location TEXT DEFAULT null;

-- Update the autoincrement sequence
SELECT SETVAL('status_id_seq', (SELECT MAX(id) FROM status));

-- Create a new unassigned status
INSERT INTO status (name) SELECT ('Unassigned')
    WHERE NOT EXISTS (
        SELECT name from status WHERE name = 'Unassigned'
    );

-- Create a backup
CREATE TABLE IF NOT EXISTS requests_prospective_temp as SELECT * FROM requests_prospective;

-- Insert all of the requests_prospective into the requests_temp table
INSERT INTO requests (original_title, citation, user_id, referrer, referrer_data, created_at, repository_name, repository_location, deleted, status_id)
SELECT 
    title as original_title, 
    description as citation, 
    user_id, referrer, referrer_data, 
    created_at, repository_name, repository_location,
    deleted, (SELECT id FROM status WHERE name = 'Unassigned')
FROM requests_prospective;

-- Clear Prospectives
TRUNCATE requests_prospective;