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
                c.email,
                c.phone_number,
                c.address,
                d.model,
                d.imei,
                r.description,
                r.severity_level,
                r.status,
                r.repair_cost,
                r.repair_notes,
                r.start_date,
                r.end_date,
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
        first_name, last_name, email, phone_number, address, model, imei, description, severity_level,
        diagnosed_by, assigned_to, status, repair_notes, repair_cost, start_date, end_date
    } = req.body
    
    try{
        const [repair] = await db.promise().query(
            `SELECT d.device_id, d.customer_id 
             FROM Repair r
             JOIN Device d ON r.device_id = d.device_id
             WHERE r.repair_id = ?`,
            [repairId]
        )

        if (repair.length === 0) {
            return console.log('Record not found' )
        }

        const deviceId = repair[0].device_id;
        const customerId = repair[0].customer_id;

        // update Customer info
        await db.promise().query(
            `UPDATE Customer SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ?
            WHERE customer_id = ?`,
            [first_name, last_name, email, phone_number, address, customerId]
        )
        
        // update Device Information
        await db.promise().query(
            'UPDATE Device SET model = ?, imei = ? WHERE device_id = ?',
            [model, imei, deviceId]
        )

        // update Repair Information
        await db.promise().query(
            `UPDATE Repair
            SET description = ?, severity_level = ?, status = ?, repair_cost= ?, assigned_to = ?,
            repair_notes = ?, end_date = ?
            WHERE repair_id = ?`
            , [description, severity_level, status, repair_cost, assigned_to, repair_notes, end_date, repairId]
        )

        res.json({
            success: true,
            message: 'Record is updated'
        })
    } catch(err){
        console.log(err)
    }
})

// DELETE route for a record
router.delete('/:id', async (req, res) => {
    const repairId = req.params.id;
    try {
        // First get device_id from repair record
        const [repair] = await db.promise().query(
            'SELECT device_id FROM Repair WHERE repair_id = ?', 
            [repairId]
        );
        
        if (repair.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Record not found' 
            });
        }

        const deviceId = repair[0].device_id;

        // Get customer_id from device
        const [device] = await db.promise().query(
            'SELECT customer_id FROM Device WHERE device_id = ?',
            [deviceId]
        );
        const customerId = device[0].customer_id;

        // Delete in proper order
        await db.promise().query('DELETE FROM Repair WHERE repair_id = ?', [repairId]);
        await db.promise().query('DELETE FROM Device WHERE device_id = ?', [deviceId]);
        await db.promise().query('DELETE FROM Customer WHERE customer_id = ?', [customerId]);

        res.json({ 
            success: true, 
            message: 'Record deleted successfully' 
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
