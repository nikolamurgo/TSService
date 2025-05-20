const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config()
const PORT = process.env.PORT 

const db = require('./db/connection')


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
})

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM User', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://88.200.63.148:${PORT}`);
});
