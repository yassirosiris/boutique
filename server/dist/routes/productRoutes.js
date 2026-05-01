import { Router } from "express";
import { getCategories, getProduct, listProducts } from "../controllers/productController.js";
const router = Router();
router.get("/products", listProducts);
router.get("/products/:id", getProduct);
router.get("/categories", getCategories);
export default router;
