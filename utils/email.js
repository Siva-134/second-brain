const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("Email sent successfully: ", info.messageId);
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

module.exports = sendEmail;
