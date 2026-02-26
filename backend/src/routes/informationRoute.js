import express from "express";
import { getInformation, createInformation, updateInformation, deleteInformation } from "../controllers/informationController.js";

const router = express.Router();

router.get("/get-information", getInformation);
router.post("/create-information", createInformation);
router.put("/update-information/:id", updateInformation);
router.delete("/delete-information/:id", deleteInformation);

export default router;