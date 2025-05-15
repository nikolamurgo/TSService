const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config()
const PORT = process.env.PORT


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
})

app.get('/api/testdb', (req,res) =>{
    db.query('SELECT 1 + 1 AS result', (err,result) =>{
        if (err) return res.status(500).json({error: err.message})
            res.json({dbTestResult: result[0].result})
    })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://88.200.63.148:${PORT}`);
});
