import express from "express";
import {
    getContactsForManage,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    findContactByNameOrPhone,
    filterByStatus
} from "../controllers/contactController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-contact-for-manage", authMiddleware, getContactsForManage);
router.get("/get-contact-by-id/:id", authMiddleware, getContactById);
router.post("/create-contact", createContact);
router.put("/update-contact/:id", authMiddleware, updateContact);
router.delete("/delete-contact/:id", authMiddleware, deleteContact);
router.post("/find-contact-by-name-or-phone", authMiddleware, findContactByNameOrPhone);
router.post("/filter-by-status", authMiddleware, filterByStatus);

export default router;