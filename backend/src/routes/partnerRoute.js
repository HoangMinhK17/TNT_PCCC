import express from "express";
import { getPartners, createPartner, updatePartner, deletePartner, getPartnerByName, getPartnersForManage } from "../controllers/partnerController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/get-partners", getPartners);
router.post("/create-partner", authMiddleware, createPartner);
router.put("/update-partner/:id", authMiddleware, updatePartner);
router.delete("/delete-partner/:id", authMiddleware, deletePartner);
router.get("/get-partner-by-name/:name", authMiddleware, getPartnerByName);
router.get("/get-partners-for-manage", authMiddleware, getPartnersForManage);

export default router;