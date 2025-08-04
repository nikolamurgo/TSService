const express = require('express')
const router = express.Router()
const db = require('../db/connection')

// get account info
router.get('/:id', async (req,res) => {
    const userId = req.params.id
    if (!userId) return res.status(400).json({message: "Missing user_id"})

    try{
        const [rows] = await db.promise().query(
            `SELECT username, email FROM User WHERE user_id = ?`,
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
router.put('/', async (req,res) =>{
    //fetch
})

module.exports = router