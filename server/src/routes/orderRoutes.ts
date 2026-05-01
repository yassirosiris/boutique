import { Router } from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/orders", requireAuth, createOrder);
router.get("/orders/mine", requireAuth, getMyOrders);

export default router;
