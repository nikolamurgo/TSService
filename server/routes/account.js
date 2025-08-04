const express = require('express')
const router = express.Router()
const db = require('../db/connection')

// get account info
router.get('/:id', async (req,res) => {
    const userId = req.params.id
    if (!userId) return res.status(400).json({message: "Missing user_id"})

    try{
        const [rows] = await db.promise().query(
            `SELECT username, email, role FROM User WHERE user_id = ?`,
            [userId]
        )
        if(rows.length === 0){
            return res.status(404)
        }
        res.json(rows[0])
    }catch(err){
        console.log(err)
    }
})

// update account info
router.put('/:id', async (req,res) =>{
    const userId = req.params.id
    const {username, email} = req.body

    if (!userId || !username || !email){
        return res.status(400)
    }
    
    try{
        await db.promise().query(
            `UPDATE User SET username = ?, email = ? WHERE user_id = ?`,
            [username, email, userId]
        )

        res.json({message: "updated successfully"})
    }catch(err){
        console.log(err)
    }
})

module.exports = router