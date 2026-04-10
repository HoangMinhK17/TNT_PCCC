import express from "express";
import { getCategoryProducts, createCategoryProduct, updateCategoryProduct, deleteCategoryProduct, getCategoryProductForManage, getCategoryProductBySearch } from "../controllers/categoryProductController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/get-category-products", getCategoryProducts);
router.get("/get-category-product-for-manage", authMiddleware, getCategoryProductForManage);
router.post("/create-category-product", authMiddleware, createCategoryProduct);
router.put("/update-category-product/:id", authMiddleware, updateCategoryProduct);
router.delete("/delete-category-product/:id", authMiddleware, deleteCategoryProduct);
router.get("/search-category-product/:searchTerm", authMiddleware, getCategoryProductBySearch);

export default router;