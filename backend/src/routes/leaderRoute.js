import express from "express";
import {
    getAllLeaders,
    createLeader,
    updateLeader,
    deleteLeader,
    getAllLeadersForManagement,
    findLeaderByName
} from "../controllers/leaderController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-all-leaders", getAllLeaders);
router.post("/create-leader", authMiddleware, createLeader);
router.put("/update-leader/:id", authMiddleware, updateLeader);
router.delete("/delete-leader/:id", authMiddleware, deleteLeader);
router.get("/get-all-leaders-for-management", authMiddleware, getAllLeadersForManagement);
router.get("/find-leader-by-name/:name", authMiddleware, findLeaderByName);

export default router;