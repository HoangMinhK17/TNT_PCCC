import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/db.js";
import apiRouter from "./routes/api.js";
import cors from "cors";
import * as useragent from 'express-useragent';
import requestIp from 'request-ip';
import { initSocket } from "./config/socket.js";

dotenv.config();
connectDB();

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(cors({ origin: "*" }));
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
app.get("/", (req, res) => {
    res.status(200).send("TNT-PCCC Backend is active and awake!");
});
app.use("/api/tnt", apiRouter);

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});