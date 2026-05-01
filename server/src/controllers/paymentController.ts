import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import { env } from "../config/env.js";
import { OrderModel } from "../models/Order.js";
import { ProductModel } from "../models/Product.js";

const stripe = new Stripe(env.stripeSecretKey);

interface CheckoutItemInput {
  product: string;
  variant: { size: string; color: string };
  qty: number;
}

const computeAmountFromDb = async (items: CheckoutItemInput[]): Promise<{ amount: number; currency: string }> => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Checkout items are required.");
  }

  let subtotal = 0;
  let currency = "eur";

  for (const item of items) {
    if (!item.product || !item.variant?.size || !item.variant?.color || item.qty <= 0) {
      throw new Error("Invalid checkout item payload.");
    }

    const product = await ProductModel.findOne({ _id: item.product, isActive: true });
    if (!product) throw new Error(`Product not found: ${item.product}`);

    const variant = product.variants.find(
      (entry) => entry.size === item.variant.size && entry.color === item.variant.color
    );
    if (!variant) throw new Error(`Variant not found for product: ${item.product}`);

    const unitPrice = variant.priceOverride ?? product.price;
    subtotal += unitPrice * item.qty;
    currency = product.currency ?? currency;
  }

  return { amount: Math.round(subtotal * 100), currency };
};

/**
 * Create Stripe PaymentIntent for checkout.
 */
export const createCheckoutIntent = async (req: Request, res: Response): Promise<void> => {
  const { provider = "stripe", items } = req.body;
  if (provider !== "stripe") {
    res.status(StatusCodes.OK).json({
      provider,
      message: "Tunisia provider stub ready (Konnect/Paymee integration pending)."
    });
    return;
  }

  const { amount, currency } = await computeAmountFromDb(items);

  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true }
  });
  res.status(StatusCodes.OK).json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
};

/**
 * Handle Stripe webhook events.
 */
export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing Stripe signature." });
    return;
  }
  if (!env.stripeWebhookSecret) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Webhook secret not configured." });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature.";
    res.status(StatusCodes.BAD_REQUEST).json({ message });
    return;
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await OrderModel.updateMany(
      { stripePaymentId: paymentIntent.id },
      { paymentStatus: "paid", orderStatus: "processing" }
    );
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await OrderModel.updateMany({ stripePaymentId: paymentIntent.id }, { paymentStatus: "failed" });
  }

  res.status(StatusCodes.OK).json({ received: true });
};
