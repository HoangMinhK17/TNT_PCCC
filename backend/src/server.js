import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import apiRouter from "./routes/api.js";
import cors from "cors";
import * as useragent from 'express-useragent';
import requestIp from 'request-ip';

dotenv.config();
connectDB();

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(cors());
app.use(useragent.express());

app.use((req, res, next) => {
    req.userInfo = {
        ip: requestIp.getClientIp(req),
        browser: req.useragent.browser,
        os: req.useragent.os,
        platform: req.useragent.platform,
        source: req.useragent.source
    };
    next();
});


app.use("/api/tnt", apiRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});