import express from "express";
import { createThemeHeader, getThemeHeader, updateThemeHeader } from "../controllers/themeHeaderController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-theme-header", getThemeHeader);
router.post("/create-theme-header", authMiddleware, createThemeHeader);
router.put("/update-theme-header/:id", authMiddleware,updateThemeHeader);

export default router;