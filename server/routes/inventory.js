const express = require('express')
const router = express.Router()
const db = require('../db/connection')

// get all inventory items
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT * FROM StockItem ORDER BY part_id DESC`);
        res.json(rows);
    } catch (err) {
        console.error(err)
    }
})

// add item to stockPart Tbi
// remove item from stockPart TBI
// update item fr example name quantity price TBI

module.exports = router;