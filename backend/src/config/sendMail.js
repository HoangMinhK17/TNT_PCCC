import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";
import { promisify } from "util";

dotenv.config();

const resolve4 = promisify(dns.resolve4);

const sendMail = async (to, subject, text, html) => {
    try {
        // Bắt buộc resolve ra IPv4 thay vì để OS tự chọn (tránh IPv6 trên Render)
        const addresses = await resolve4("smtp.gmail.com");
        const smtpIPv4 = addresses[0];

        const transporter = nodemailer.createTransport({
            host: smtpIPv4,   // Dùng IP IPv4 trực tiếp
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USENAME,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                servername: "smtp.gmail.com" // Cần để TLS/SNI hoạt động khi dùng IP
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