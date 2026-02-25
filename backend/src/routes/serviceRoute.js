import express from "express";
import { getPublicServices, createService, getPublicServiceById } from "../controllers/serviceController.js";

const router = express.Router();

router.get("/publicService", getPublicServices);
router.post("/createService", createService);
router.get("/getPublicServiceById/:id", getPublicServiceById);

export default router;