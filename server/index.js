const express = require('express')
const cors = require('cors')
const app = express()
const recordRoutes = require('./routes/recordRoutes')

require('dotenv').config()
const PORT = process.env.PORT 

const db = require('./db/connection')


app.use(cors());
app.use(express.json())

// Routes
app.use('/api/records', recordRoutes)

app.get('/', (req, res) => {
  res.send('Backend is running')
})


app.listen(PORT, () => {
  console.log(`Server is running on http://88.200.63.148:${PORT}`)
});
