import express from "express";
import { getCategoryProducts, createCategoryProduct, updateCategoryProduct, deleteCategoryProduct } from "../controllers/categoryProductController.js";
const router = express.Router();

router.get("/get-category-products", getCategoryProducts);
router.post("/create-category-product", createCategoryProduct);
router.put("/update-category-product/:id", updateCategoryProduct);
router.delete("/delete-category-product/:id", deleteCategoryProduct);

export default router;