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

function checkAdmin(req, res, next) {
    if (req.user.role !== 'administrator') {
        return res.json({ message: 'Forbidden: Requires administrator privileges.' })
    }
    next()
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

// add new user, admin only 
router.post('/add-user', authenticateToken, checkAdmin, async (req, res) => {
    const { username, password, email, role } = req.body

    try {
        // check if user with the same username or email already exists
        const [existingUser] = await db.promise().query(
            'SELECT * FROM User WHERE username = ? OR email = ?',
            [username, email]
        )

        if (existingUser.length > 0) {
            return res.json({ message: 'Username or email already exists' })
        }

        // insert the new user into the database
        await db.promise().query(
            'INSERT INTO User (username, password, email, role) VALUES (?, ?, ?, ?)',
            [username, password, email, role]
        )

        res.json({ message: 'User created successfully.' })

    } catch (err) {
        res.json({ message: 'error' })
    }
})

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Token is valid', user: req.user })
})

module.exports = router