const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        console.log(`[Email Debug] EMAIL_USER present: ${!!process.env.EMAIL_USER}`);
        console.log(`[Email Debug] EMAIL_PASS present: ${!!process.env.EMAIL_PASS}`);
        if (process.env.EMAIL_USER) console.log(`[Email Debug] User: ${process.env.EMAIL_USER}`);
        if (process.env.EMAIL_PASS) console.log(`[Email Debug] Pass length: ${process.env.EMAIL_PASS.length}`);
        console.log(`[Email Debug] Sending to: ${email}`);

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,       // Use 587 for STARTTLS
            secure: false,   // false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            logger: true,
            debug: true,
            connectionTimeout: 10000, // 10 seconds
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
