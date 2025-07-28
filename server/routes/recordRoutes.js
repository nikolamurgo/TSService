const express = require('express')
const router = express.Router()
const db = require('../db/connection')

// POST route to add a new repair record
router.post('/add-record', async (req, res) => {
    const { 
        first_name, last_name, email, phone_number, address,
        model, imei, description, severity_level, diagnosed_by,
        status, repair_cost, start_date, assigned_to 
    } = req.body

    try {
        // Insert Customer
        const [customerResult] = await db.promise().query(
            `INSERT INTO Customer 
                (first_name, last_name, email, phone_number, address) 
             VALUES (?, ?, ?, ?, ?)`,
            [first_name, last_name, email, phone_number, address]
        )

        // Insert Device
        const [deviceResult] = await db.promise().query(
            `INSERT INTO Device 
                (customer_id, model, imei) 
             VALUES (?, ?, ?)`,
            [customerResult.insertId, model, imei]
        )

        // Insert Repair)
        const [repairResult] = await db.promise().query(
            `INSERT INTO Repair (
                device_id, 
                assigned_to, 
                status, 
                description, 
                severity_level, 
                diagnosed_by,
                repair_cost, 
                start_date
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                deviceResult.insertId,
                assigned_to,
                status,
                description,
                severity_level,
                diagnosed_by,
                parseFloat(repair_cost) || 0.00,
                start_date || new Date().toISOString().slice(0, 19).replace('T', ' ')
            ]
        )

        res.status(200).json({ 
            success: true,
            repairId: repairResult.insertId 
        })
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ 
            success: false,
            error: "Database operation failed",
            details: err.message 
        })
    }
})

// GET all users
router.get('/users/list', async (req,res) =>{
    try{
        const [rows] = await db.promise().query(`
            SELECT user_id, username
            FROM User`)
        res.json(rows)
    }catch (err){
        res.status(500).json({message: "Error fetcing users"})
    }
})

// GET all the records
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT 
                r.repair_id,
                c.first_name,
                c.last_name,
                d.model,
                r.status,
                r.start_date
            FROM Repair r
            JOIN Device d ON r.device_id = d.device_id
            JOIN Customer c ON d.customer_id = c.customer_id
            ORDER BY r.start_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching records' });
    }
})

// GET record by reapir_id
router.get('/:id', async (req, res) => {
    const repairId = req.params.id

    try {
        const [rows] = await db.promise().query(`
            SELECT
                r.repair_id,
                c.first_name,
                c.last_name,
                d.model,
                d.imei,
                r.description,
                r.severity_level,
                r.status,
                r.repair_cost,
                r.start_date,
                r.diagnosed_by,
                r.assigned_to,
                u.username
            FROM Repair r
            JOIN Device d ON r.device_id = d.device_id
            JOIN Customer c ON d.customer_id = c.customer_id
            JOIN User u ON r.assigned_to = u.user_id
            WHERE r.repair_id = ?
        `,[repairId])

        res.json(rows[0])
    } catch (err) {
        res.status(500).json({ message: 'Error fetching records' });
    }
})

// PUT update record
router.put('/:id', async (req,res) =>{
    const repairId = req.params.id
    const {
        model, imei, description, severity_level, status, repair_cost
    } = req.body
    
    try{
        // update Device Information
        await db.promise().query(
            'UPDATE Device SET model = ?, imei = ? WHERE device_id = (SELECT device_id FROM Repair WHERE repair_id = ?)',
            [model, imei, repairId]
        )

        // update Repair Information
        await db.promise().query(
            `UPDATE Repair
            SET description = ?, severity_level = ?, status = ?, repair_cost= ?
            WHERE repair_id = ?`
            , [description, severity_level, status, repair_cost, repairId]
        )

        res.json({
            success: true,
            message: 'Record is updated'
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message: 'error updating record',
            error: err.message
        })
    }
})

module.exports = router;
