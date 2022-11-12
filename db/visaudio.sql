-- Script of commmands to execute to get to the current structure of the db.
-- Excludes any user generated data (that should be obtained via dump)
CREATE TABLE visualizations (viz_name integer);
ALTER TABLE visualizations ALTER COLUMN viz_name TYPE text;
INSERT INTO visualizations (viz_name) VALUES ('viz_1');