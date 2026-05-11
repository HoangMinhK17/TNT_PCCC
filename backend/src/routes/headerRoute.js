import express from "express";
import {
    createHeader,
    getAllHeader,
    getAllForManagement,
    findHeaderByName,
    updateHeader,
    getAllHeaderForShowHome
} from "../controllers/headerController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.post("/create-header", authMiddleware, createHeader);
router.get("/get-all-header", getAllHeader);
router.get("/get-all-header-for-management", authMiddleware, getAllForManagement);
router.put("/update-header/:id", authMiddleware, updateHeader);
router.get("/find-header-by-name/:name", authMiddleware, findHeaderByName);
router.get("/get-all-header-for-show-home", getAllHeaderForShowHome);

export default router;

