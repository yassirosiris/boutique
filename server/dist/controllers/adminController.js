import { StatusCodes } from "http-status-codes";
import { OrderModel } from "../models/Order.js";
import { ProductModel } from "../models/Product.js";
/**
 * Return all products for admin stock management.
 */
export const adminGetProducts = async (_req, res) => {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(products);
};
/**
 * Create product with optional uploaded image.
 */
export const adminCreateProduct = async (req, res) => {
    const images = req.file ? [`/uploads/${req.file.filename}`] : req.body.images ?? [];
    const product = await ProductModel.create({ ...req.body, images });
    res.status(StatusCodes.CREATED).json(product);
};
/**
 * Update an existing product.
 */
export const adminUpdateProduct = async (req, res) => {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(StatusCodes.OK).json(product);
};
/**
 * Soft delete product by setting inactive flag.
 */
export const adminDeleteProduct = async (req, res) => {
    await ProductModel.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(StatusCodes.NO_CONTENT).send();
};
/**
 * Return all orders for admin management.
 */
export const adminGetOrders = async (_req, res) => {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.status(StatusCodes.OK).json(orders);
};
/**
 * Update order status.
 */
export const adminUpdateOrderStatus = async (req, res) => {
    const order = await OrderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(StatusCodes.OK).json(order);
};
/**
 * Return dashboard KPI metrics.
 */
export const adminDashboard = async (_req, res) => {
    const [ordersCount, activeProducts, lowStockProducts, revenueAgg] = await Promise.all([
        OrderModel.countDocuments(),
        ProductModel.countDocuments({ isActive: true }),
        ProductModel.countDocuments({ "variants.stock": { $lte: 5 }, isActive: true }),
        OrderModel.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$total" } } }])
    ]);
    res.status(StatusCodes.OK).json({
        totalRevenue: revenueAgg[0]?.total ?? 0,
        ordersCount,
        activeProducts,
        lowStockCount: lowStockProducts
    });
};
