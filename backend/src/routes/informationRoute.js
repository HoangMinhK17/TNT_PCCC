import express from "express";
import { getInformation, getImageInformation, createInformation, updateInformation, getContactInformation, upadateImageInformation, updateContactInformation, getAllInformation, updateChatConfig } from "../controllers/informationController.js";
import { authMiddleware } from "../middleware/auth.js";


const router = express.Router();

router.get("/get-information", getInformation);
router.get("/get-image-information", getImageInformation);
router.get("/get-contact-information", getContactInformation);
router.post("/create-information", authMiddleware, createInformation);
router.put("/update-information/:id", authMiddleware, updateInformation);
router.put("/update-image-information/:id", authMiddleware, upadateImageInformation);
router.put("/update-contact-information/:id", authMiddleware, updateContactInformation);
router.get("/get-all-information", authMiddleware, getAllInformation);
router.put("/update-chat-config/:id", authMiddleware, updateChatConfig);


export default router;