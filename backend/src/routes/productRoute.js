import express from "express";
import { getPublicProducts, createProduct, updateProduct, deleteProduct, getPublicProductById, getPublicProductByCategoryId, getProductByName } from "../controllers/productController.js";

const router = express.Router();

router.get("/getPublicProducts", getPublicProducts);
router.post("/createProduct", createProduct);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.get("/getPublicProductById/:id", getPublicProductById);
router.get("/getPublicProductByCategoryId/:categoryId", getPublicProductByCategoryId);
router.get("/getProductByName/:name", getProductByName);

export default router;