import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for 587 (STARTTLS)
            family: 4,     // Force IPv4, tránh lỗi ENETUNREACH trên Render
            auth: {
                user: process.env.EMAIL_USENAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USENAME,
            to,
            subject,
            text,
            html
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }

};

export default sendMail;