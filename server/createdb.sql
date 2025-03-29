DROP DATABASE IF EXISTS leaves_app_db;
CREATE DATABASE IF NOT EXISTS leaves_app_db;
USE leaves_app_db;
CREATE TABLE IF NOT EXISTS leaves2025(
	day SMALLINT NOT NULL CHECK (
		-- You ACTUALLY CAN check without a `TRIGGER`!:
		day BETWEEN 1 and 366
	),
	roll BIGINT UNSIGNED NOT NULL,
	reasons BIT(3) NOT NULL,
	PRIMARY KEY (day, roll)
);
-- 
-- `VIEW` for Node.js app that automatically switches tables based on the current year:
-- CREATE VIEW IF NOT EXISTS NodeView AS
-- SELECT CONCAT('leaves', YEAR(CURRENT_DATE)) AS table_name;
-- 
-- `NULL`-filled `VIEW` for the Excel folk:
CREATE VIEW IF NOT EXISTS excel2025 AS
SELECT day,
	roll,
	reasons & 0b001 AS ill,
	reasons & 0b010 AS family_issue,
	reasons & 0b100 AS family_event
FROM leaves2025;
-- `CREATE` a new `TABLE` at midnight on Jan 1 every year, starting at the current year's Jan 1 midnight:
-- 
CREATE EVENT IF NOT EXISTS new_year_table ON SCHEDULE EVERY 1 YEAR STARTS TIMESTAMP(
	CONCAT(YEAR(CURRENT_DATE) + 1, '-01-01 00:00:00')
) DO -- Variable with new `TABLE`'s name (e.g. `leaves2026`):
BEGIN
SET @new_table_stmt = CONCAT(
		-- THIS is SQL string-concat/-interp!:
		'CREATE TABLE IF NOT EXISTS leaves',
		YEAR(CURRENT_DATE) + 1,
		' LIKE leaves',
		YEAR(CURRENT_DATE)
	);
-- 
-- Now... do some SQL *statement* magic with that query:
-- 
PREPARE stmt
FROM @new_table_stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
END;
-- ...Welcome back, semii!
SELECT *
FROM leaves2025
ORDER BY day ASC,
	roll ASC;