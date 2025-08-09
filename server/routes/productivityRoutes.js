const express = require('express')
const router = express.Router()
const db = require('../db/connection')

// get stats for productivity
router.get('/stats', async (req,res) =>{
    const {range} = req.query

    try{
        const [completedPerTechnician] = await db.promise().query(`
            SELECT u.username, COUNT(r.repair_id) as count
            FROM Repair r
            JOIN User u ON r.assigned_to = u.user_id
            WHERE r.status = 'Completed'
            GROUP BY u.username
            ORDER BY count DESC`
        )

        const [inProgressPerTechnician] = await db.promise().query(`
            SELECT u.username, COUNT(r.repair_id) as count
            FROM Repair r
            JOIN User u ON r.assigned_to = u.user_id
            WHERE r.status = 'In Progress'
            GROUP BY u.username
            ORDER BY count DESC`
        )

        const [completionsOverTime] = await db.promise().query(`
            SELECT DATE_FORMAT(end_date, '%Y-%m') as month, COUNT(repair_id) as count
            FROM Repair
            WHERE status = 'Completed' AND end_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month ASC`
        )

        res.json({completedPerTechnician,inProgressPerTechnician,completionsOverTime})
    }catch(err){
        res.json({message:'failed try in productivity'})
    }
})

module.exports = router