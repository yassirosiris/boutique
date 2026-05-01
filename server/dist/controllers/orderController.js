import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { OrderModel } from "../models/Order.js";
import { ProductModel } from "../models/Product.js";
/**
 * Create a new order for authenticated user.
 */
export const createOrder = async (req, res) => {
    const { items, shippingAddress, stripePaymentId } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Order items are required." });
        return;
    }
    const session = await mongoose.startSession();
    let order;
    try {
        await session.withTransaction(async () => {
            const computedItems = [];
            let subtotal = 0;
            let currency = "eur";
            for (const item of items) {
                if (!item.product || !item.variant?.size || !item.variant?.color || item.qty <= 0) {
                    throw new Error("Invalid order item payload.");
                }
                const product = await ProductModel.findOne({ _id: item.product, isActive: true }).session(session);
                if (!product)
                    throw new Error(`Product not found: ${item.product}`);
                const variant = product.variants.find((entry) => entry.size === item.variant.size && entry.color === item.variant.color);
                if (!variant)
                    throw new Error(`Variant not found for product: ${item.product}`);
                const stockUpdate = await ProductModel.updateOne({
                    _id: item.product,
                    isActive: true,
                    variants: {
                        $elemMatch: {
                            size: item.variant.size,
                            color: item.variant.color,
                            stock: { $gte: item.qty }
                        }
                    }
                }, { $inc: { "variants.$.stock": -item.qty } }, { session });
                if (stockUpdate.modifiedCount !== 1) {
                    throw new Error(`Insufficient stock for ${product.name} (${item.variant.size}/${item.variant.color}).`);
                }
                const unitPrice = variant.priceOverride ?? product.price;
                const lineTotal = unitPrice * item.qty;
                subtotal += lineTotal;
                currency = product.currency ?? currency;
                computedItems.push({
                    product: product.id,
                    variant: { size: item.variant.size, color: item.variant.color },
                    qty: item.qty,
                    price: unitPrice,
                    unitPrice,
                    lineTotal
                });
            }
            order = await OrderModel.create([
                {
                    user: req.user?.id,
                    items: computedItems,
                    shippingAddress,
                    paymentStatus: "pending",
                    stripePaymentId,
                    subtotal,
                    total: subtotal,
                    currency
                }
            ], { session });
        });
    }
    finally {
        await session.endSession();
    }
    res.status(StatusCodes.CREATED).json(order?.[0]);
};
/**
 * List orders belonging to the current user.
 */
export const getMyOrders = async (req, res) => {
    const orders = await OrderModel.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(orders);
};
