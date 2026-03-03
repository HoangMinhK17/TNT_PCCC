import express from "express";
import { getPublicProducts, createProduct, updateProduct, deleteProduct, getPublicProductById, getPublicProductByCategoryId, getProductByName, getProductForManage } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/getPublicProducts", getPublicProducts);
router.get("/getProductForManage", authMiddleware, getProductForManage);
router.post("/createProduct", authMiddleware, createProduct);
router.put("/updateProduct/:id", authMiddleware, updateProduct);
router.delete("/deleteProduct/:id", authMiddleware, deleteProduct);
router.get("/getPublicProductById/:id", getPublicProductById);
router.get("/getPublicProductByCategoryId/:categoryId", getPublicProductByCategoryId);
router.get("/getProductByName/:name", getProductByName);

export default router;