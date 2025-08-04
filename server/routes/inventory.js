const express = require('express')
const router = express.Router()
const db = require('../db/connection')

// get all inventory items
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT * FROM StockItem ORDER BY part_id DESC`);
        res.json(rows);
    } catch (err) {
        console.error(err)
    }
})

// add item to stockPart
router.get('/add', async(req,res) =>{
    const { part_name, unit_price, quantity_available} = req.body
    try{
        const [result] = await db.promise().query(`
            INSERT INTO StockItem (part_name, unit_price, quantity_available)
            VALUES (?,?,?)`,
        [part_name, unit_price, quantity_available]
    )
    res.json({message: 'item is added', partId: result.insertId})
            
    }catch(err){
        console.log(err)
    }
})
// remove item from stockPart TBI
// update item fr example name quantity price TBI

module.exports = router;