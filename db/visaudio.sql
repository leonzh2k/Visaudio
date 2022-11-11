CREATE TABLE visualizations (viz_name integer);
ALTER TABLE visualizations ALTER COLUMN viz_name TYPE text;
INSERT INTO visualizations (viz_name) VALUES ('viz_1');