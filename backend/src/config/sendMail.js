import dotenv from "dotenv";
dotenv.config();

const sendMail = async (to, subject, text, html) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    email: process.env.EMAIL_USENAME,
                    name: "TNT PCCC"
                },
                to: [{ email: to }],
                subject,
                htmlContent: html || "",
                textContent: text || ""
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(JSON.stringify(errData));
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendMail;
