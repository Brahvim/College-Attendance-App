DROP DATABASE IF EXISTS leaves_app_db;
CREATE DATABASE IF NOT EXISTS leaves_app_db;
USE leaves_app_db;
--
-- Students `TABLE`...
--
CREATE TABLE IF NOT EXISTS students(roll BIGINT UNSIGNED NOT NULL PRIMARY KEY);
--
-- That ONE `TABLE` this app *actually* needs:
--
CREATE TABLE IF NOT EXISTS attendance2025(
day SMALLINT NOT NULL CHECK (
	-- You ACTUALLY CAN check without a `TRIGGER`!:
	day BETWEEN 1 and 366
),
roll BIGINT UNSIGNED NOT NULL,
reasons BIT(3) NOT NULL,
PRIMARY KEY (day, roll),
-- `ON DELETE RESTRICT` allows keeping entries around even if the corresponding `roll` gets deleted.
-- Default behavior is `ON DELETE CASCADE`, which *does* actually delete un-**related** entries.
FOREIGN KEY (roll) REFERENCES students(roll) ON DELETE RESTRICT -- Oh! And there's also `ON DELETE SET NULL`. LOL.
);
--
-- Fake entries for now. Ooooof course:
--
INSERT INTO students (roll)
VALUES -- First, EE folks:
	(22030040001),
	(22030040002),
	(22030040003),
	(22030040004),
	(22030040005),
	(22030040006),
	(22030040007),
	(22030040008),
	(22030040009),
	(22030040010),
	-- Now some CS folk:
	(22030050001),
	(22030050002),
	(22030050003),
	(22030050004),
	(22030050005),
	(22030050006),
	(22030050007),
	(22030050008),
	(22030050009),
	(22030050010);
--
-- `NULL`-filled `VIEW` for the Excel folk:
--
CREATE VIEW IF NOT EXISTS excel2025 AS
SELECT day AS "Day",
	roll AS "Roll Number",
	(reasons & 0b001) > 0 AS "Ill",
	(reasons & 0b010) > 0 AS "Family Issue",
	(reasons & 0b100) > 0 AS "Family Event"
FROM attendance2025;
--
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
--
-- Use this to become the almighty observer of records:
--
SELECT *
FROM attendance2025
ORDER BY day ASC,
	roll ASC;