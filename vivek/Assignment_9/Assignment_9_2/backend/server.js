const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cassandra = require('cassandra-driver');
const cors = require('cors');
const bodyParser = require('body-parser');
const { startSession } = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'companydb'
}); 

async function connectCassandra() {
  try {
    await client.connect();
    console.log('Cassandra connected');
  } catch (err) {
    console.error('Cassandra connection error:', err);
  }
}
connectCassandra();

app.get('/companies', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM companies');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/companies', async (req, res) => {
  const { name, location, employee_count, founded_year, industry } = req.body;
  const id = uuidv4();
  const query = `
    INSERT INTO companies (id, name, location, employee_count, founded_year, industry)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    await client.execute(query, [id, name, location, employee_count, founded_year, industry], { prepare: true });
    res.status(201).json({ id, name, location, employee_count, founded_year, industry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/companies/:id', async (req, res) => {
  const id = req.params.id;
  const { name, location, employee_count, founded_year, industry } = req.body;
  const query = `
    UPDATE companies SET name = ?, location = ?, employee_count = ?, founded_year = ?, industry = ?
    WHERE id = ?
  `;
  try {
    await client.execute(query, [name, location, employee_count, founded_year, industry, id], { prepare: true });
    res.json({ id, name, location, employee_count, founded_year, industry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/companies/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await client.execute('DELETE FROM companies WHERE id = ?', [id], { prepare: true });
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



// docker run --name cassandra -p 9042:9042 -d cassandra

// docker ps

// docker start

// docker exec -it cassandra cqlsh

// CREATE KEYSPACE IF NOT EXISTS companydb
// WITH replication = {
//   'class': 'SimpleStrategy',
//   'replication_factor': 1
// };

// CREATE TABLE IF NOT EXISTS companydb.companies (
//   id UUID PRIMARY KEY,
//   name TEXT,
//   location TEXT,
//   employee_count INT,
//   founded_year INT,
//   industry TEXT
// );