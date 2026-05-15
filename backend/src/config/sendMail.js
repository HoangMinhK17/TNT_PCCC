import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async (to, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USENAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USENAME,
        to,
        subject,
        text,
        html
    };
    await transporter.sendMail(mailOptions);
};

export default sendMail;