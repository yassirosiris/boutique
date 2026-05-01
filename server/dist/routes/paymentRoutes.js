import express, { Router } from "express";
import { createCheckoutIntent, stripeWebhook } from "../controllers/paymentController.js";
const router = Router();
router.post("/cart/checkout", express.json(), createCheckoutIntent);
router.post("/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhook);
export default router;
