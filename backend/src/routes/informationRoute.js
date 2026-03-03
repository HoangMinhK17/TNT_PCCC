import express from "express";
import { getInformation, getImageInformation, createInformation, updateInformation, deleteInformation, getContactInformation } from "../controllers/informationController.js";

const router = express.Router();

router.get("/get-information", getInformation);
router.get("/get-image-information", getImageInformation);
router.get("/get-contact-information", getContactInformation);
router.post("/create-information", createInformation);
router.put("/update-information/:id", updateInformation);
router.delete("/delete-information/:id", deleteInformation);

export default router;