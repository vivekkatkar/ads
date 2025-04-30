-- I. MySQL / PSM Review

-- a) Create test_table and procedure to insert 50 records
CREATE TABLE test_table (
    RecordNumber INT(3),
    CurrentDate DATE
);

DELIMITER //
CREATE PROCEDURE InsertTestRecords()
BEGIN
    DECLARE counter INT DEFAULT 1;
    WHILE counter <= 50 DO
        INSERT INTO test_table (RecordNumber, CurrentDate)
        VALUES (counter, CURDATE());
        SET counter = counter + 1;
    END WHILE;
END //
DELIMITER ;

-- b) Create products table and procedure to update prices
CREATE TABLE products (
    ProductID INT(4),
    category CHAR(3),
    detail VARCHAR(30),
    price DECIMAL(10,2),
    stock INT(5)
);

-- Insert sample data into products
INSERT INTO products VALUES
(1001, 'CAT', 'Product 1', 100.00, 50),
(1002, 'CAT', 'Product 2', 150.00, 30),
(1003, 'DOG', 'Product 3', 200.00, 20),
(1004, 'DOG', 'Product 4', 250.00, 40),
(1005, 'BIR', 'Product 5', 300.00, 25);

DELIMITER //
CREATE PROCEDURE UpdatePriceByCategory(IN X DECIMAL(5,2), IN Y CHAR(3))
BEGIN
    UPDATE products
    SET price = price * (1 + X/100)
    WHERE category = Y;
END //
DELIMITER ;

-- II. Object Relational Databases

-- a) Create Object Table with name and word count function
CREATE TYPE name_type AS OBJECT (
    name VARCHAR2(50),
    MEMBER FUNCTION countNoOfWords RETURN NUMBER
);

CREATE TYPE BODY name_type AS
    MEMBER FUNCTION countNoOfWords RETURN NUMBER IS
        v_count NUMBER := 0;
        v_name VARCHAR2(50) := TRIM(name);
    BEGIN
        IF v_name IS NULL THEN
            RETURN 0;
        END IF;
        -- Count spaces to determine words
        WHILE INSTR(v_name, ' ') > 0 LOOP
            v_count := v_count + 1;
            v_name := SUBSTR(v_name, INSTR(v_name, ' ') + 1);
        END LOOP;
        -- Add 1 for the last word
        IF LENGTH(v_name) > 0 THEN
            v_count := v_count + 1;
        END IF;
        RETURN v_count;
    END;
END;
/

CREATE TABLE name_table OF name_type;

-- Insert sample data
INSERT INTO name_table VALUES (name_type('John Doe'));
INSERT INTO name_table VALUES (name_type('Mary Jane Watson'));
INSERT INTO name_table VALUES (name_type('Peter Parker Spider Man'));

-- Demonstrate word count
SELECT t.name, t.countNoOfWords() AS word_count
FROM name_table t;

-- b) Create address type with methods
CREATE TYPE address_type AS OBJECT (
    address VARCHAR2(100),
    city VARCHAR2(50),
    state VARCHAR2(50),
    pincode VARCHAR2(10),
    MEMBER FUNCTION extractAddress(p_keyword VARCHAR2) RETURN VARCHAR2,
    MEMBER FUNCTION countWords(p_field VARCHAR2) RETURN NUMBER
);

CREATE TYPE BODY address_type AS
    MEMBER FUNCTION extractAddress(p_keyword VARCHAR2) RETURN VARCHAR2 IS
    BEGIN
        IF UPPER(address) LIKE '%' || UPPER(p_keyword) || '%' THEN
            RETURN address;
        ELSIF UPPER(city) LIKE '%' || UPPER(p_keyword) || '%' THEN
            RETURN city;
        ELSIF UPPER(state) LIKE '%' || UPPER(p_keyword) || '%' THEN
            RETURN state;
        ELSIF UPPER(pincode) LIKE '%' || UPPER(p_keyword) || '%' THEN
            RETURN pincode;
        ELSE
            RETURN NULL;
        END IF;
    END;
    
    MEMBER FUNCTION countWords(p_field VARCHAR2) RETURN NUMBER IS
        v_count NUMBER := 0;
        v_value VARCHAR2(100);
    BEGIN
        -- Get the field value
        IF UPPER(p_field) = 'ADDRESS' THEN
            v_value := TRIM(address);
        ELSIF UPPER(p_field) = 'CITY' THEN
            v_value := TRIM(city);
        ELSIF UPPER(p_field) = 'STATE' THEN
            v_value := TRIM(state);
        ELSIF UPPER(p_field) = 'PINCODE' THEN
            v_value := TRIM(pincode);
        ELSE
            RETURN 0;
        END IF;
        
        IF v_value IS NULL THEN
            RETURN 0;
        END IF;
        
        -- Count words
        WHILE INSTR(v_value, ' ') > 0 LOOP
            v_count := v_count + 1;
            v_value := SUBSTR(v_value, INSTR(v_value, ' ') + 1);
        END LOOP;
        IF LENGTH(v_value) > 0 THEN
            v_count := v_count + 1;
        END IF;
        RETURN v_count;
    END;
END;
/

CREATE TABLE address_table OF address_type;

-- Insert sample data
INSERT INTO address_table VALUES (
    address_type('123 Main Street', 'New York', 'NY', '10001')
);
INSERT INTO address_table VALUES (
    address_type('456 Park Avenue', 'Chicago', 'IL', '60601')
);

-- Demonstrate address methods
SELECT t.extractAddress('Main') AS extracted_address
FROM address_table t;

SELECT t.countWords('address') AS address_words,
       t.countWords('city') AS city_words
FROM address_table t;

-- c) Create course type and object table
CREATE TYPE course_type AS OBJECT (
    course_id VARCHAR2(10),
    description VARCHAR2(100)
);

CREATE TABLE course_table OF course_type;

-- Insert sample data
INSERT INTO course_table VALUES (
    course_type('CS101', 'Introduction to Programming')
);
INSERT INTO course_table VALUES (
    course_type('CS201', 'Data Structures and Algorithms')
);
INSERT INTO course_table VALUES (
    course_type('CS301', 'Database Management Systems')
);

-- Demonstrate course table
SELECT * FROM course_table;