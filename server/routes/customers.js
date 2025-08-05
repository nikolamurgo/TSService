const express = require('express')
const router = express.Router()
const db = require('../db/connection')

// get all customers
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT * FROM Customer`)
        res.json(rows)
    } catch (err) {
        console.error(err)
    }
})

module.exports = router