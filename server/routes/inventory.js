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
router.post('/add', async(req,res) =>{
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


// update an item
router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { part_name, unit_price, quantity_available } = req.body

    try {
        const [result] = await db.promise().query(
            'UPDATE StockItem SET part_name = ?, unit_price = ?, quantity_available = ? WHERE part_id = ?',
            [part_name, unit_price, quantity_available, id]
        );

        res.json({ message: 'Item updated successfully' })
    } catch (err) {
        console.log(err)
        alert("error, item not updated")
    }
});

// delete an item from stock
router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const [result] = await db.promise().query(
            'DELETE FROM StockItem WHERE part_id = ?',
            [id])

        res.json({ message: 'Item deleted' })
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;