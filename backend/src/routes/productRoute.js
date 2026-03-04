import express from "express";
import { getPublicProducts, createProduct, updateProduct, deleteProduct, getPublicProductById, getPublicProductByCategoryId, getProductByName, getProductForManage, getProductByCategoryIdForManage, getProductByNameForManage } from "../controllers/productController.js";
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
router.get("/getProductByCategoryIdForManage/:categoryId", authMiddleware, getProductByCategoryIdForManage);
router.get("/getProductByNameForManage/:name", authMiddleware, getProductByNameForManage);

export default router;