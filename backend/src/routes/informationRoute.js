import express from "express";
import { getInformation, getImageInformation, createInformation, updateInformation, getContactInformation, upadateImageInformation, updateContractInformation, getAllInformation } from "../controllers/informationController.js";
import { authMiddleware } from "../middleware/auth.js";


const router = express.Router();

router.get("/get-information", getInformation);
router.get("/get-image-information", getImageInformation);
router.get("/get-contact-information", getContactInformation);
router.post("/create-information", authMiddleware, createInformation);
router.put("/update-information/:id",authMiddleware, updateInformation);
router.put("/update-image-information/:id", authMiddleware, upadateImageInformation);
router.put("/update-contract-information/:id", authMiddleware, updateContractInformation);
router.get("/get-all-information", authMiddleware, getAllInformation);


export default router;