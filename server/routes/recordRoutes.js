const express = require('express')
const router = express.Router()
const db = require('../db/connection')

// POST route to add a new repair record
router.post('/add-record', (req, res) => {
    const {
        first_name,
        last_name,
        email,
        phone_number,
        address,
        model,
        imei,
        description,
        severity_level,
        diagnosed_by,
        status,
        repair_cost,
        start_date
    } = req.body;

    // Insert customer
    const insertCustomerQuery = `
    INSERT INTO Customer (first_name, last_name, email, phone_number, address)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.query(insertCustomerQuery, [first_name, last_name, email, phone_number, address], (err, customerResult) => {
        if (err) {
            console.error("Error inserting customer:", err);
            return res.status(500).json({ error: 'Failed to insert customer' })
        }

        const customerId = customerResult.insertId;

        // Step 2: Insert device
        const insertDeviceQuery = `
      INSERT INTO Device (customer_id, model, imei)
      VALUES (?, ?, ?)
    `;

        db.query(insertDeviceQuery, [customerId, model, imei], (err, deviceResult) => {
            if (err) {
                console.error("Error inserting device:", err);
                return res.status(500).json({ error: 'Failed to insert device' });
            }

            const deviceId = deviceResult.insertId;

            // Step 3: Insert problem
            const insertProblemQuery = `
        INSERT INTO Problem (device_id, description, severity_level, diagnosed_by)
        VALUES (?, ?, ?, ?)
      `;

            db.query(insertProblemQuery, [deviceId, description, severity_level, diagnosed_by], (err, problemResult) => {
                if (err) {
                    console.error("Error inserting problem:", err);
                    return res.status(500).json({ error: 'Failed to insert problem' });
                }

                const problemId = problemResult.insertId;

                // Step 4: Insert repair
                const insertRepairQuery = `
          INSERT INTO Repair (problem_id, assigned_to, status, repair_cost, start_date)
          VALUES (?, ?, ?, ?, ?)
        `;

                db.query(insertRepairQuery, [problemId, diagnosed_by, status, repair_cost, start_date], (err, repairResult) => {
                    if (err) {
                        console.error("Error inserting repair:", err);
                        return res.status(500).json({ error: 'Failed to insert repair' })
                    }

                    res.status(200).json({ message: 'Record added successfully!' })
                })
            })
        })
    })
})

module.exports = router;
