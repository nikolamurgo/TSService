const express = require('express')
const router = express.Router()
const db = require('../db/connection')

// get all customers
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT c1.*
            FROM Customer c1
            INNER JOIN (
                SELECT MAX(customer_id) as max_id
                FROM Customer
                GROUP BY phone_number
            ) c2 ON c1.customer_id = c2.max_id
            ORDER BY c1.last_name, c1.first_name`)
        res.json(rows)
    } catch (err) {
        console.error(err)
    }
})

// get all records for a specific customer by  phone number
router.get('/phone/:phone_number/records', async (req, res) => {
    const { phone_number } = req.params
        // console.log(`for ph num: '${phone_number}'`) //debug

    try {
        const [rows] = await db.promise().query(`
            SELECT 
                r.repair_id, 
                d.model, 
                r.status, 
                r.start_date
            FROM Repair r
            JOIN Device d ON r.device_id = d.device_id
            JOIN Customer c ON d.customer_id = c.customer_id
            WHERE c.phone_number = ?
            ORDER BY r.start_date DESC
        `, [phone_number])
        res.json(rows)
    } catch (err) {
        console.error(err)
    }
})

module.exports = router