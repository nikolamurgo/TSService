const express = require('express')
const router = express.Router()
const db = require('../db/connection')

const PDFDocument = require('pdfkit')

router.get('/:repairId', async (req, res) => {
    const {repairId} = req.params
    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM RepairAgreement WHERE repair_id = ?', [repairId]
        )
        if (rows.length === 0) return res.json({ message: 'no agreement found' })
        res.json(rows[0])
    } catch (err) {
        res.json({ message: 'error fetching agreement'})
    }
})

router.get('/:repairId/download', async (req, res) => {
    const { repairId } = req.params
    try {
        const [rows] = await db.promise().query(
            'SELECT agreement_text FROM RepairAgreement WHERE repair_id = ?',
            [repairId]
        )

        if (rows.length === 0) {
            return res.json({ message: 'Agreement not found' })
        }

        const {agreement_text} = rows[0]
        const doc = new PDFDocument({size: 'A4', margin: 50})

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers)

            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=RepairAgreement_${repairId}.pdf`,
                'Content-Length': pdfData.length
            })
            res.end(pdfData)
        })

        doc.fontSize(18).text('Repair Agreement', { align: 'center' })
        doc.moveDown(2)
        doc.fontSize(11).text(agreement_text, { align: 'left' })
        
        doc.moveDown(4)

        doc.fontSize(14).text('Terms and Conditions', {underline: true})
        doc.moveDown()
        const terms = [
            'Estimates and Authorization: The initial cost is an estimate. If further diagnosis reveals that additional parts or labor are required, all work will be paused. We will contact you with a revised estimate, and no additional work will be performed without your explicit approval.',
            'Data Loss Responsibility: We are not responsible for any loss, corruption, or breach of data on your device. The customer is solely responsible for backing up all personal and professional data before submitting the device for repair.',
            'Repair Warranty: We provide a 90-day warranty on all parts and labor for the specific repair performed. This warranty does not cover issues unrelated to the original repair, any form of physical or liquid damage occurring after the repair, software issues, or problems arising from customer misuse.',
            'Abandoned Devices: Devices must be collected within 60 days of repair completion notification. Any device not collected within this period will be considered abandoned and may be recycled or sold to recover repair and storage costs, with no further liability to you.',
            'Payment Terms: Full payment is required upon completion of the repair and before the device is returned to the customer. We reserve the right to hold the device until the balance is paid in full.',
            'Replaced Parts: All parts replaced during the repair process become the property of our service center unless a specific request to return them is made at the time of service check-in.',
            'Unrepairable Devices: In some cases, a device may be deemed unrepairable due to the extent of the damage. In such instances, a diagnostic fee may apply for the time spent on the assessment.'
        ]

        doc.fontSize(10)
        for (const term of terms) {
            doc.text(`• ${term}`, {
                indent: 15,
                paragraphGap: 5
            })
        }
    
        doc.end();

    } catch (err) {
        res.json({ message: 'Error generating pdf' });
    }
})


module.exports = router