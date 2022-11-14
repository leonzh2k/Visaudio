-- Script of commmands to execute to get to the current structure of the db.
-- assumes there exists a database "visaudio" on the server.
-- Changes to the production db are deployed via this script.
-- Thus, any change that can modify data (table deletion/table entries) are not allowed.
CREATE TABLE visualizations (viz_name integer);
ALTER TABLE visualizations ALTER COLUMN viz_name TYPE text;
ALTER TABLE visualizations RENAME COLUMN viz_name TO song_name;
ALTER TABLE visualizations ADD COLUMN id SERIAL PRIMARY KEY;
ALTER TABLE visualizations ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE visualizations ALTER COLUMN song_name SET NOT NULL;
ALTER TABLE visualizations ADD COLUMN song_artist text NOT NULL;
ALTER TABLE visualizations ADD COLUMN song_url text NOT NULL;
ALTER TABLE visualizations ADD COLUMN graphics json NOT NULL;

