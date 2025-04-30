// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(bodyParser.json());

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root', 
//   password: '22510044',
//   database: 'CSE'
// });

// db.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
// });

// app.get('/companies', (req, res) => {
//   const query = 'SELECT * FROM companies';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching companies:', err);
//       return res.status(500).json({ error: 'Failed to fetch companies' });
//     }
//     res.json(results);
//   });
// });

// app.get('/companies/:id', (req, res) => {
//   const { id } = req.params;
//   const query = 'SELECT * FROM companies WHERE id = ?';
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       console.error('Error fetching company:', err);
//       return res.status(500).json({ error: 'Failed to fetch company' });
//     }
//     res.json(results[0]);
//   });
// });

// app.post('/companies', (req, res) => {
//   const { name, location, employee_count, founded_year, industry } = req.body;
//   const query = 'INSERT INTO companies (name, location, employee_count, founded_year, industry) VALUES (?, ?, ?, ?, ?)';
//   db.query(query, [name, location, employee_count, founded_year, industry], (err, results) => {
//     if (err) {
//       console.error('Error adding company:', err);
//       return res.status(500).json({ error: 'Failed to add company' });
//     }
//     res.status(201).json({ id: results.insertId, name, location, employee_count, founded_year, industry });
//   });
// });

// app.put('/companies/:id', (req, res) => {
//   const { id } = req.params;
//   const { name, location, employee_count, founded_year, industry } = req.body;
//   const query = 'UPDATE companies SET name = ?, location = ?, employee_count = ?, founded_year = ?, industry = ? WHERE id = ?';
//   db.query(query, [name, location, employee_count, founded_year, industry, id], (err, results) => {
//     if (err) {
//       console.error('Error updating company:', err);
//       return res.status(500).json({ error: 'Failed to update company' });
//     }
//     res.json({ id, name, location, employee_count, founded_year, industry });
//   });
// });

// app.delete('/companies/:id', (req, res) => {
//   const { id } = req.params;
//   const query = 'DELETE FROM companies WHERE id = ?';
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       console.error('Error deleting company:', err);
//       return res.status(500).json({ error: 'Failed to delete company' });
//     }
//     res.json({ message: 'Company deleted' });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://riteshpatil6569:ritesh6569@cluster0.v2kol0j.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

const companySchema = new mongoose.Schema({
  name: String,
  location: String,
  employee_count: Number,
  founded_year: Number,
  industry: String,
});

const Company = mongoose.model('Company', companySchema);

app.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

app.get('/companies/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

app.post('/companies', async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error adding company:', error);
    res.status(500).json({ error: 'Failed to add company' });
  }
});

app.put('/companies/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

app.delete('/companies/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json({ message: 'Company deleted' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

