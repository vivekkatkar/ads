create database  university_management;;
use university_management;
 
-- Classroom table
CREATE TABLE classroom (
    building VARCHAR(50),
    room_number VARCHAR(10),
    capacity INT,
    PRIMARY KEY (building, room_number)
);

INSERT INTO classroom (building, room_number, capacity) VALUES
-- CS Department (Engineering Block)
('Engineering Block', 'CS101', 60),
('Engineering Block', 'CS102', 50),

-- Electronics Department (Tech Tower)
('Tech Tower', 'EE201', 55),
('Tech Tower', 'EE202', 45),

-- Mechanical Department (Mechanical Lab)
('Mechanical Lab', 'ME301', 70),
('Mechanical Lab', 'ME302', 65),

-- Civil Department (Civil Engineering Hall)
('Civil Engineering Hall', 'CE401', 80),
('Civil Engineering Hall', 'CE402', 75),

-- IT Department (IT Building)
('IT Building', 'IT501', 50),
('IT Building', 'IT502', 55);

-- Department table
CREATE TABLE department (
    dept_name VARCHAR(50) PRIMARY KEY,
    building VARCHAR(50),
    budget DECIMAL(10,2) CHECK (budget >= 0)
);

INSERT INTO department (dept_name, building, budget)
VALUES
    ('CS', 'Engineering Block', 150000.00),
    ('Electronics', 'Tech Tower', 120000.00),
    ('Mechanical', 'Mechanical Lab', 100000.00),
    ('Civil', 'Civil Engineering Hall', 130000.00),
    ('IT', 'IT Building', 140000.00);

-- Course table
CREATE TABLE course (
    course_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100),
    dept_name VARCHAR(50),
    credits INT CHECK (credits > 0),
    FOREIGN KEY (dept_name) REFERENCES department(dept_name) ON DELETE CASCADE
);


INSERT INTO course (course_id, title, dept_name, credits) VALUES
-- First-Year Prerequisite Courses (Common for All Departments)
('FY101', 'Mathematics for Engineers', 'CS', 4),
('FY102', 'Physics for Engineers', 'Electronics', 4),
('FY103', 'Basic Electrical and Electronics Engineering', 'Mechanical', 3),
('FY104', 'Engineering Mechanics', 'Civil', 3),

-- CS Department
('CS101', 'Data Structures and Algorithms', 'CS', 4),
('CS102', 'Operating Systems', 'CS', 3),
('CS103', 'Database Management Systems', 'CS', 4),
('CS104', 'Artificial Intelligence', 'CS', 3),

-- Electronics Department
('EE201', 'Digital Signal Processing', 'Electronics', 3),
('EE202', 'Microprocessors and Microcontrollers', 'Electronics', 4),
('EE203', 'Communication Systems', 'Electronics', 3),
('EE204', 'Embedded Systems', 'Electronics', 4),

-- Mechanical Department
('ME301', 'Thermodynamics', 'Mechanical', 4),
('ME302', 'Fluid Mechanics', 'Mechanical', 3),
('ME303', 'Manufacturing Processes', 'Mechanical', 4),
('ME304', 'Machine Design', 'Mechanical', 3),

-- Civil Department
('CE401', 'Structural Analysis', 'Civil', 4),
('CE402', 'Transportation Engineering', 'Civil', 3),
('CE403', 'Hydraulics and Water Resources', 'Civil', 4),
('CE404', 'Construction Planning and Management', 'Civil', 3),

-- IT Department
('IT501', 'Web Development', 'IT', 3),
('IT502', 'Cybersecurity', 'IT', 4),
('IT503', 'Cloud Computing', 'IT', 3),
('IT504', 'Software Engineering', 'IT', 4),

-- Third-Year Courses (Require 2nd-Year Courses as Prerequisites)
-- CS Department
('CS301', 'Machine Learning', 'CS', 4),  -- Requires CS104 (AI)
('CS302', 'Advanced Database Systems', 'CS', 3),  -- Requires CS103 (DBMS)
('CS303', 'Computer Networks', 'CS', 3),  -- Requires CS102 (OS)
('CS304', 'Software Architecture', 'CS', 3),  -- Requires IT504 (Software Engg)

-- Electronics Department
('EE301', 'Wireless Communication', 'Electronics', 3),  -- Requires EE203 (Comm Systems)
('EE302', 'Robotics and Automation', 'Electronics', 4),  -- Requires EE204 (Embedded Sys)
('EE303', 'VLSI Design', 'Electronics', 4),  -- Requires EE202 (Microcontrollers)
('EE304', 'Power Electronics', 'Electronics', 3),  -- Requires EE201 (DSP)

-- Mechanical Department
('ME401', 'Automobile Engineering', 'Mechanical', 4),  -- Requires ME303 (Manufacturing)
('ME402', 'Heat Transfer', 'Mechanical', 3),  -- Requires ME301 (Thermodynamics)
('ME403', 'Computer-Aided Design', 'Mechanical', 4),  -- Requires ME304 (Machine Design)
('ME404', 'Renewable Energy Systems', 'Mechanical', 3),  -- Requires ME302 (Fluid Mechanics)

-- Civil Department
('CE501', 'Bridge Engineering', 'Civil', 4),  -- Requires CE401 (Structural Analysis)
('CE502', 'Geotechnical Engineering', 'Civil', 3),  -- Requires CE403 (Hydraulics)
('CE503', 'Urban Planning', 'Civil', 4),  -- Requires CE404 (Construction Planning)
('CE504', 'Environmental Engineering', 'Civil', 3),  -- Requires CE402 (Transportation Engg)

-- IT Department
('IT601', 'Big Data Analytics', 'IT', 4),  -- Requires IT503 (Cloud Computing)
('IT602', 'Blockchain Technology', 'IT', 3),  -- Requires IT502 (Cybersecurity)
('IT603', 'Internet of Things (IoT)', 'IT', 3),  -- Requires EE204 (Embedded Systems)
('IT604', 'Human-Computer Interaction', 'IT', 3);  -- Requires CS304 (Software Architecture)

-- Instructor table
CREATE TABLE instructor (
    ID INT PRIMARY KEY,
    name VARCHAR(100),
    dept_name VARCHAR(50),
    salary DECIMAL(10,2) CHECK (salary >= 0),
    FOREIGN KEY (dept_name) REFERENCES department(dept_name) ON DELETE SET NULL
);

-- Section table
CREATE TABLE section (
    course_id VARCHAR(10),
    sec_id VARCHAR(10),
    semester VARCHAR(10) CHECK (semester IN ('Fall', 'Spring', 'Summer', 'Winter')),
    year YEAR,
    building VARCHAR(50),
    room_number VARCHAR(10),
    time_slot_id VARCHAR(10),
    PRIMARY KEY (course_id, sec_id, semester, year),
    FOREIGN KEY (building, room_number) REFERENCES classroom(building, room_number) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);


-- Teaches table (Instructor teaches courses)
CREATE TABLE teaches (
    ID INT,
    course_id VARCHAR(10),
    sec_id VARCHAR(10),
    semester VARCHAR(10),
    year YEAR,
    PRIMARY KEY (ID, course_id, sec_id, semester, year),
    FOREIGN KEY (ID) REFERENCES instructor(ID) ON DELETE CASCADE,
    FOREIGN KEY (course_id, sec_id, semester, year) REFERENCES section(course_id, sec_id, semester, year) ON DELETE CASCADE
);

-- Student table
CREATE TABLE student (
    ID INT PRIMARY KEY,
    name VARCHAR(100),
    dept_name VARCHAR(50),
    tot_cred INT CHECK (tot_cred >= 0),
    FOREIGN KEY (dept_name) REFERENCES department(dept_name) ON DELETE SET NULL
);

-- Takes table (Student takes courses)
CREATE TABLE takes (
    ID INT,
    course_id VARCHAR(10),
    sec_id VARCHAR(10),
    semester VARCHAR(10),
    year YEAR,
    grade CHAR(2),
    PRIMARY KEY (ID, course_id, sec_id, semester, year),
    FOREIGN KEY (ID) REFERENCES student(ID) ON DELETE CASCADE,
    FOREIGN KEY (course_id, sec_id, semester, year) REFERENCES section(course_id, sec_id, semester, year) ON DELETE CASCADE
);

-- Advisor table (Mapping between student and instructor)
CREATE TABLE advisor (
    s_ID INT,
    i_ID INT,
    PRIMARY KEY (s_ID),
    FOREIGN KEY (s_ID) REFERENCES student(ID) ON DELETE CASCADE,
    FOREIGN KEY (i_ID) REFERENCES instructor(ID) ON DELETE SET NULL
);

-- Time Slot table
CREATE TABLE time_slot (
    time_slot_id VARCHAR(10),
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    start_time TIME,
    end_time TIME,
    PRIMARY KEY (time_slot_id, day, start_time)
);

INSERT INTO time_slot (time_slot_id, day, start_time, end_time) VALUES
-- 10:15 AM - 11:15 AM
('TS1', 'Monday', '10:15:00', '11:15:00'),
('TS1', 'Tuesday', '10:15:00', '11:15:00'),
('TS1', 'Wednesday', '10:15:00', '11:15:00'),
('TS1', 'Thursday', '10:15:00', '11:15:00'),
('TS1', 'Friday', '10:15:00', '11:15:00'),

-- 11:15 AM - 12:15 PM
('TS2', 'Monday', '11:15:00', '12:15:00'),
('TS2', 'Tuesday', '11:15:00', '12:15:00'),
('TS2', 'Wednesday', '11:15:00', '12:15:00'),
('TS2', 'Thursday', '11:15:00', '12:15:00'),
('TS2', 'Friday', '11:15:00', '12:15:00'),

-- 1:15 PM - 2:15 PM
('TS3', 'Monday', '13:15:00', '14:15:00'),
('TS3', 'Tuesday', '13:15:00', '14:15:00'),
('TS3', 'Wednesday', '13:15:00', '14:15:00'),
('TS3', 'Thursday', '13:15:00', '14:15:00'),
('TS3', 'Friday', '13:15:00', '14:15:00'),

-- 2:15 PM - 3:15 PM
('TS4', 'Monday', '14:15:00', '15:15:00'),
('TS4', 'Tuesday', '14:15:00', '15:15:00'),
('TS4', 'Wednesday', '14:15:00', '15:15:00'),
('TS4', 'Thursday', '14:15:00', '15:15:00'),
('TS4', 'Friday', '14:15:00', '15:15:00'),

-- 3:30 PM - 4:30 PM
('TS5', 'Monday', '15:30:00', '16:30:00'),
('TS5', 'Tuesday', '15:30:00', '16:30:00'),
('TS5', 'Wednesday', '15:30:00', '16:30:00'),
('TS5', 'Thursday', '15:30:00', '16:30:00'),
('TS5', 'Friday', '15:30:00', '16:30:00'),

-- 4:30 PM - 5:30 PM
('TS6', 'Monday', '16:30:00', '17:30:00'),
('TS6', 'Tuesday', '16:30:00', '17:30:00'),
('TS6', 'Wednesday', '16:30:00', '17:30:00'),
('TS6', 'Thursday', '16:30:00', '17:30:00'),
('TS6', 'Friday', '16:30:00', '17:30:00');

-- Prerequisite table (Courses that require another course as a prerequisite)
CREATE TABLE prereq (
    course_id VARCHAR(10),
    prereq_id VARCHAR(10),
    PRIMARY KEY (course_id, prereq_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (prereq_id) REFERENCES course(course_id) ON DELETE CASCADE
);

INSERT INTO prereq (course_id, prereq_id) VALUES
-- Second-Year Courses Requiring First-Year Courses

-- CS Department
('CS101', 'FY101'),  -- Data Structures requires Mathematics for Engineers
('CS102', 'FY101'),  -- Operating Systems requires Mathematics for Engineers
('CS103', 'FY101'),  -- DBMS requires Mathematics for Engineers
('CS104', 'FY101'),  -- AI requires Mathematics for Engineers

-- Electronics Department
('EE201', 'FY102'),  -- DSP requires Physics for Engineers
('EE202', 'FY103'),  -- Microcontrollers requires Basic Electrical & Electronics
('EE203', 'FY102'),  -- Communication Systems requires Physics for Engineers
('EE204', 'FY103'),  -- Embedded Systems requires Basic Electrical & Electronics

-- Mechanical Department
('ME301', 'FY104'),  -- Thermodynamics requires Engineering Mechanics
('ME302', 'FY104'),  -- Fluid Mechanics requires Engineering Mechanics
('ME303', 'FY104'),  -- Manufacturing Processes requires Engineering Mechanics
('ME304', 'FY101'),  -- Machine Design requires Mathematics for Engineers

-- Civil Department
('CE401', 'FY104'),  -- Structural Analysis requires Engineering Mechanics
('CE402', 'FY101'),  -- Transportation Engineering requires Mathematics for Engineers
('CE403', 'FY104'),  -- Hydraulics requires Engineering Mechanics
('CE404', 'FY101'),  -- Construction Planning requires Mathematics for Engineers

-- IT Department
('IT501', 'FY101'),  -- Web Development requires Mathematics for Engineers
('IT502', 'FY103'),  -- Cybersecurity requires Basic Electrical & Electronics
('IT503', 'FY101'),  -- Cloud Computing requires Mathematics for Engineers
('IT504', 'FY101'),  -- Software Engineering requires Mathematics for Engineers

-- Third-Year Courses Requiring Second-Year Courses
-- CS Department
('CS301', 'CS104'),  -- Machine Learning requires AI
('CS302', 'CS103'),  -- Advanced DB requires DBMS
('CS303', 'CS102'),  -- Computer Networks requires OS
('CS304', 'IT504'),  -- Software Architecture requires Software Engineering

-- Electronics Department
('EE301', 'EE203'),  -- Wireless Communication requires Communication Systems
('EE302', 'EE204'),  -- Robotics and Automation requires Embedded Systems
('EE303', 'EE202'),  -- VLSI Design requires Microprocessors and Microcontrollers
('EE304', 'EE201'),  -- Power Electronics requires Digital Signal Processing

-- Mechanical Department
('ME401', 'ME303'),  -- Automobile Engineering requires Manufacturing Processes
('ME402', 'ME301'),  -- Heat Transfer requires Thermodynamics
('ME403', 'ME304'),  -- CAD requires Machine Design
('ME404', 'ME302'),  -- Renewable Energy Systems requires Fluid Mechanics

-- Civil Department
('CE501', 'CE401'),  -- Bridge Engineering requires Structural Analysis
('CE502', 'CE403'),  -- Geotechnical Engineering requires Hydraulics
('CE503', 'CE404'),  -- Urban Planning requires Construction Planning
('CE504', 'CE402'),  -- Environmental Engineering requires Transportation Engineering

-- IT Department
('IT601', 'IT503'),  -- Big Data Analytics requires Cloud Computing
('IT602', 'IT502'),  -- Blockchain Technology requires Cybersecurity
('IT603', 'EE204'),  -- IoT requires Embedded Systems
('IT604', 'CS304');  -- HCI requires Software Architecture

SHOW TABLES;