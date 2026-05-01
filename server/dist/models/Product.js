import mongoose, { Schema } from "mongoose";
const variantSchema = new Schema({
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    priceOverride: { type: Number, min: 0 }
}, { _id: false });
const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ["homme", "femme", "enfant"], required: true },
    images: [{ type: String }],
    variants: [variantSchema],
    currency: { type: String, default: "eur" },
    isActive: { type: Boolean, default: true }
}, { timestamps: { createdAt: true, updatedAt: true } });
export const ProductModel = mongoose.model("Product", productSchema);
