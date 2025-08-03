const express = require('express')
const router = express.Router()
const db = require('../db/connection')

const jwt = require('jsonwebtoken')


function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!token) return res.status(401).json({message: 'No token provided'})

    jwt.verify(token, process.env.JWT_SECRET, (err,user) =>{
        if(err) return res.status(403).json({message: 'Invalid token'})
        req.user = user
        next()
    })
}

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

            const token = jwt.sign(
                { id: user.user_id, username: user.username, role: user.role},
                process.env.JWT_SECRET,
                {expiresIn: '30m'}
            )

            res.json({
                message: 'login successful',
                success: true,
                token,
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

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Token is valid', user: req.user })
})

module.exports = router