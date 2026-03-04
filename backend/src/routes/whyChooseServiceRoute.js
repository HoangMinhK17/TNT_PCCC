import express from "express";
import { createWhyChooseService, getWhyChooseService, updateWhyChooseService, deleteWhyChooseService, getWhyChooseServiceForManage, searchWhyChooseService } from "../controllers/whyChooseServiceController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-why", authMiddleware, createWhyChooseService);
router.get("/get-why", getWhyChooseService);
router.put("/update-why/:id", authMiddleware, updateWhyChooseService);
router.delete("/delete-why/:id", authMiddleware, deleteWhyChooseService);
router.get("/get-why-for-manage", authMiddleware, getWhyChooseServiceForManage);
router.get("/search-why", authMiddleware, searchWhyChooseService);

export default router;