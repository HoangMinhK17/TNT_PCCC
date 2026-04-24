import express from "express";
import { getAuditLogs, getAuditLogsByUser, getAuditLogsByModule } from "../controllers/auditLogController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/get-all-audit-logs", authMiddleware, getAuditLogs);
router.get("/get-audit-logs-by-user", authMiddleware, getAuditLogsByUser);
router.get("/get-audit-logs-by-module", authMiddleware, getAuditLogsByModule);

export default router;