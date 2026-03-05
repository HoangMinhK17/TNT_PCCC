import express from "express";
import { getContractsForManage, getContractById, createContract, updateContract, deleteContract, findContractByNameOrPhone, filterByStatus } from "../controllers/contractController.js";
import {authMiddleware} from "../middleware/auth.js";

const router = express.Router();

router.get("/get-contract-for-manage",authMiddleware, getContractsForManage);
router.get("/get-contract-by-id/:id",authMiddleware, getContractById);
router.post("/create-contract", createContract);
router.put("/update-contract/:id", authMiddleware, updateContract);
router.delete("/delete-contract/:id", authMiddleware, deleteContract);
router.post("/find-contract-by-name-or-phone",authMiddleware, findContractByNameOrPhone);
router.post("/filter-by-status",authMiddleware, filterByStatus);

export default router;