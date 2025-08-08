const nodemailer = require('nodemailer')

// Configure the transporter using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465 false for other ports like 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

/**
 * Sends a status update email to a customer.
 * @param {string} to - email of customer
 * @param {string} customerName - customer first name
 * @param {string} repairId - repair id of record
 * @param {string} newStatus - status of repair record
 */
const sendStatusUpdateEmail = async (to, customerName, repairId, newStatus) => {
    const subject = `Update on your repair #${repairId}`
    const text = `Hello ${customerName},\n\nThe status of your repair #${repairId} has been updated to: ${newStatus}.\n\nThank you for your patience.\n\nBest regards,\nTSService Team`
    const html = `<p>Hello ${customerName},</p><p>The status of your repair #${repairId} has been updated to: <strong>${newStatus}</strong>.</p><p>Thank you for your patience.</p><p>Best regards,<br>TSService Team</p>`

    try {
        await transporter.sendMail({
            from: `"TSService" <${process.env.EMAIL_FROM}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
        })
        console.log(`Email sent successfully to ${to}`)
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error)
    }
}

module.exports = { sendStatusUpdateEmail }