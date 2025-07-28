const express = require('express')
const router = express.Router()
const db = require('../db/connection')


router.post('/login', async (req,res) => {
    const {username, password} = req.body

    try{
        const [rows] = await db.promise().query(
            'SELECT * FROM User WHERE username = ? AND password = ?', [username, password]
        )

        if(rows.length === 0){

            return res.json({
            message: 'login failed, invalid credentials',
            success: false,
            })

        } else {
            const user = rows[0]

            res.json({
                message: 'login successful',
                success: true,
                user: {
                    id: user.user_id,
                    username: user.username,
                    role: user.role
                }
            })
        }


    } catch (err){
        console.error(err)
        res.status(500).json({message: 'server error'})
    }
})

module.exports = router