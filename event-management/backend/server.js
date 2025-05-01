const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MySQL setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'vivek@987', // change if you have one
  database: 'event_management'
});

// ✅ Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); // Correct path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ✅ Upload route
app.post('/events', upload.single('image'), (req, res) => {
  const { title, description, date, location } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;

  db.query(
    'INSERT INTO events (title, description, date, location, image) VALUES (?, ?, ?, ?, ?)',
    [title, description, date, location, image],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Event added' });
    }
  );
});

// ✅ Fetch all events
app.get('/events', (req, res) => {
  db.query('SELECT * FROM events ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ DELETE event
app.delete('/events/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM events WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Event deleted' });
  });
});

// ✅ UPDATE event (with optional image)
app.put('/events/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;
  const { title, description, date, location } = req.body;
  let image = req.file ? '/uploads/' + req.file.filename : null;

  const sql = image
    ? 'UPDATE events SET title=?, description=?, date=?, location=?, image=? WHERE id=?'
    : 'UPDATE events SET title=?, description=?, date=?, location=? WHERE id=?';

  const params = image
    ? [title, description, date, location, image, id]
    : [title, description, date, location, id];

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Event updated' });
  });
});


// ✅ Start server
app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
