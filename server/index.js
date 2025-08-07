const express = require('express')
const cors = require('cors')
const app = express()
const recordRoutes = require('./routes/recordRoutes')
const authRoutes = require('./routes/auth')
const accountRoutes = require('./routes/account')
const inventoryRoutes = require('./routes/inventory')
const customersRoutes = require('./routes/customers')
const usersRoutes = require('./routes/users')

require('dotenv').config()
const PORT = process.env.PORT 

const db = require('./db/connection')


app.use(cors());
app.use(express.json())

// Routes
app.use('/api/records', recordRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/customers', customersRoutes)
app.use('/api/users', usersRoutes)

app.get('/', (req, res) => {
  res.send('Backend is running')
})


app.listen(PORT, () => {
  console.log(`Server is running on http://88.200.63.148:${PORT}`)
});
