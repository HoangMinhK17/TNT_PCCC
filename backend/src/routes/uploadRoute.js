import express, { raw } from "express";
import { upload, uploadCV, uploadToCloudinary } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/upload-image", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Không có file nào được upload" });
        const folder = req.body.folder || "tnt_shared_uploads";
        const url = await uploadToCloudinary(req.file.buffer, folder);
        res.status(200).json({ url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/upload-cv", authMiddleware, uploadCV.single("cv"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Không có file nào được upload" });
        const folder = req.body.folder || "tnt_cv_uploads";
        const url = await uploadToCloudinary(req.file.buffer, folder, "raw");
        res.status(200).json({ url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
