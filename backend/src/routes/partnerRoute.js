import express from "express";
import { getPartners, createPartner, updatePartner, deletePartner } from "../controllers/partnerController.js";
const router = express.Router();

router.get("/get-partners", getPartners);
router.post("/create-partner", createPartner);
router.put("/update-partner/:id", updatePartner);
router.delete("/delete-partner/:id", deletePartner);

export default router;