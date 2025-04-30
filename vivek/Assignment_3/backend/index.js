const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',         
//   password: '22510044', 
//   database: 'university_management',          
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         
  password: 'vivek@987', 
  database: 'university_management',          
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connection successful.');
    connection.release();
  }
});


const query = (sql, params) =>
  new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
app.get('/students', async (req, res) => {
  try {
    const students = await query('SELECT * FROM student');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/students', async (req, res) => {
  try {
    const { ID, name, dept_name, tot_cred } = req.body;
    await query('INSERT INTO student (ID, name, dept_name, tot_cred) VALUES (?, ?, ?, ?)', [ID, name, dept_name, tot_cred]);
    res.json({ message: 'Student added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/instructors', async (req, res) => {
  try {
    const instructors = await query('SELECT * FROM instructor');
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/instructors', async (req, res) => {
  try {
    const { ID, name, dept_name, salary } = req.body;
    await query('INSERT INTO instructor (ID, name, dept_name, salary) VALUES (?, ?, ?, ?)', [ID, name, dept_name, salary]);
    res.json({ message: 'Instructor added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/courses', async (req, res) => {
  try {
    const courses = await query('SELECT * FROM course');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/courses', async (req, res) => {
  try {
    const { course_id, title, dept_name, credits } = req.body;
    await query('INSERT INTO course (course_id, title, dept_name, credits) VALUES (?, ?, ?, ?)', [course_id, title, dept_name, credits]);
    res.json({ message: 'Course added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/departments', async (req, res) => {
  try {
    const departments = await query('SELECT * FROM department');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/departments', async (req, res) => {
  try {
    const { dept_name, building, budget } = req.body;
    await query('INSERT INTO department (dept_name, building, budget) VALUES (?, ?, ?)', [dept_name, building, budget]);
    res.json({ message: 'Department added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/classrooms', async (req, res) => {
  try {
    const classrooms = await query('SELECT * FROM classroom');
    res.json(classrooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/classrooms', async (req, res) => {
  try {
    const { building, room_number, capacity } = req.body;
    await query('INSERT INTO classroom (building, room_number, capacity) VALUES (?, ?, ?)', [building, room_number, capacity]);
    res.json({ message: 'Classroom added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/advisors', async (req, res) => {
  try {
    const advisors = await query('SELECT * FROM advisor');
    res.json(advisors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/advisors', async (req, res) => {
  try {
    const { s_ID, i_ID } = req.body;
    await query('INSERT INTO advisor (s_ID, i_ID) VALUES (?, ?)', [s_ID, i_ID]);
    res.json({ message: 'Advisor added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/prereqs', async (req, res) => {
  try {
    const prereqs = await query('SELECT * FROM prereq');
    res.json(prereqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/prereqs', async (req, res) => {
  try {
    const { course_id, prereq_id } = req.body;
    await query('INSERT INTO prereq (course_id, prereq_id) VALUES (?, ?)', [course_id, prereq_id]);
    res.json({ message: 'Prerequisite added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/sections', async (req, res) => {
  try {
    const sections = await query('SELECT * FROM section');
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/sections', async (req, res) => {
  try {
    const { course_id, sec_id, semester, year, building, room_number, time_slot_id } = req.body;
    await query(
      'INSERT INTO section (course_id, sec_id, semester, year, building, room_number, time_slot_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [course_id, sec_id, semester, year, building, room_number, time_slot_id]
    );
    res.json({ message: 'Section added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/time-slots', async (req, res) => {
  try {
    const timeSlots = await query('SELECT * FROM time_slot');
    res.json(timeSlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/time-slots', async (req, res) => {
  try {
    const { time_slot_id, day, start_time, end_time } = req.body;
    await query(
      'INSERT INTO time_slot (time_slot_id, day, start_time, end_time) VALUES (?, ?, ?, ?)',
      [time_slot_id, day, start_time, end_time]
    );
    res.json({ message: 'Time slot added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/teaches', async (req, res) => {
  try {
    const teachesRecords = await query('SELECT * FROM teaches');
    res.json(teachesRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/teaches', async (req, res) => {
  try {
    const { ID, course_id, sec_id, semester, year } = req.body;
    await query(
      'INSERT INTO teaches (ID, course_id, sec_id, semester, year) VALUES (?, ?, ?, ?, ?)',
      [ID, course_id, sec_id, semester, year]
    );
    res.json({ message: 'Teaches record added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/takes', async (req, res) => {
  try {
    const takesRecords = await query('SELECT * FROM takes');
    res.json(takesRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/takes', async (req, res) => {
  try {
    const { ID, course_id, sec_id, semester, year, grade } = req.body;
    await query(
      'INSERT INTO takes (ID, course_id, sec_id, semester, year, grade) VALUES (?, ?, ?, ?, ?, ?)',
      [ID, course_id, sec_id, semester, year, grade]
    );
    res.json({ message: 'Takes record added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
