import express from "express";
import {
    createContactRecruitment,
    getContactRecruitment,
    getContactRecruitmentByNameOrPhone,
    getContactRecruitmentByStatus,
    updateContactRecruitment,
    deleteContactRecruitment,
    getContactRecruitmentById
} from "../controllers/contactRecruitmentController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-contact-recruitment", createContactRecruitment);
router.get("/get-contact-recruitment", authMiddleware, getContactRecruitment);
router.get("/get-contact-recruitment-by-name-or-phone/:search", authMiddleware, getContactRecruitmentByNameOrPhone);
router.get("/get-contact-recruitment-by-status/:status", authMiddleware, getContactRecruitmentByStatus);
router.put("/update-contact-recruitment/:id", authMiddleware, updateContactRecruitment);
router.delete("/delete-contact-recruitment/:id", authMiddleware, deleteContactRecruitment);
router.get("/get-contact-recruitment-by-id/:id", authMiddleware, getContactRecruitmentById);

export default router;