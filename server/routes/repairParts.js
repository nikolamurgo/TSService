const express = require('express')
const router = express.Router()
const db = require('../db/connection')

router.get('/:recordId/parts', async (req,res) =>{
    const {recordId} = req.params
    try{
        const [parts] = await db.promise().query(`
            SELECT rp.rp_id, rp.quantity_used, si.part_id, si.part_name, si.unit_price
            FROM RepairPart rp
            JOIN StockItem si ON rp.part_id = si.part_id
            WHERE rp.record_id= ?`,
        [recordId])
        res.json(parts)
    }catch(err){
        res.json({message: err})
    }
})

router.post('/:recordId/parts', async(req,res) =>{
    const {recordId} = req.params
    const {part_id, quantity_used} = req.body


    const connection = await db.promise().getConnection()
    try{
        await connection.beginTransaction()

        const [stock] = await connection.query(`
            SELECT quantity_available FROM StockItem
            WHERE part_id = ?`,
        [part_id])

        if(stock.length === 0 || stock[0].quantity_available < quantity_used){
            await connection.rollback()
            return res.json({message: "Not enough stock!"})
        }

        await connection.query(`
            INSERT INTO RepairPart (record_id, part_id, quantity_used)
            VALUES (?, ?, ?)`,
        [recordId, part_id, quantity_used ])

        await connection.query(`
            UPDATE StockItem
            SET quantity_available = quantity_available - ?
            WHERE part_id = ?`,
        [quantity_used, part_id])

        await connection.commit()
        res.json({message: 'part added to repair recor'})
    }catch(err){
        res.json({message: 'failed to add part to record'})
    }finally{
        connection.release()
    }

})

module.exports = router