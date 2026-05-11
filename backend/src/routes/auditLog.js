import express from "express";
import { getAuditLogs, getModulFilter, getActionFilter } from "../controllers/auditLogController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-all-audit-logs", authMiddleware, getAuditLogs);
router.get("/get-modul-filter", authMiddleware, getModulFilter);
router.get("/get-action-filter", authMiddleware, getActionFilter);

export default router;