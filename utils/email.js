const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        console.log(`[Email Debug] EMAIL_USER present: ${!!process.env.EMAIL_USER}`);
        console.log(`[Email Debug] EMAIL_PASS present: ${!!process.env.EMAIL_PASS}`);
        if (process.env.EMAIL_USER) console.log(`[Email Debug] User: ${process.env.EMAIL_USER}`);
        if (process.env.EMAIL_PASS) console.log(`[Email Debug] Pass length: ${process.env.EMAIL_PASS.length}`);

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,       // Use 465 for secure
            secure: true,    // true for 465
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
