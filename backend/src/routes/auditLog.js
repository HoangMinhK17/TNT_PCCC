import express from "express";
import { getAuditLogs } from "../controllers/auditLogController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/get-all-audit-logs", authMiddleware, getAuditLogs);

export default router;