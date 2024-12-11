-- Note that if you don't have a insert value sql file here
-- Then all of you data from outside this folder will be deleted because of the line below
DROP TABLE IF EXISTS categories; 

CREATE TABLE categories ( -- If you use the line above be sure to delete the IF NOT EXISTS here as well

    -- Primary key
    category_name VARCHAR(100) PRIMARY KEY,

    -- Description is optional when inserting value
    description TEXT
);