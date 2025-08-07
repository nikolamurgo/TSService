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

// get all users , admin only
router.get('/', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const [users] = await db.promise().query(
            'SELECT user_id, username, email, role FROM User'
        );
        res.json(users)
    } catch (err) {
        console.error(err)
        res.json({ message: 'error getting users' })
    }
})

// delete a user, admin only
router.delete('/:id', authenticateToken, checkAdmin, async (req, res) => {
    const { id } = req.params

    try {
        await db.promise().query('DELETE FROM User WHERE user_id = ?', [id])
        res.json({ message: 'User deleted' })
    } catch (err) {
        console.error(err)
        res.json({ message: 'error deleting user' })
    }
})

module.exports = router