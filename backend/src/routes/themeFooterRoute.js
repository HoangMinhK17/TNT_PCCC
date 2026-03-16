import express from "express";
import { getThemeFooter, updateThemeFooter, createThemeFooter } from "../controllers/themeFooterController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-theme-footer", getThemeFooter);
router.post("/create-theme-footer", authMiddleware, createThemeFooter);
router.put("/update-theme-footer/:id", authMiddleware, updateThemeFooter);

export default router;

