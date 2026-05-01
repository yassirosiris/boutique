import mongoose, { Schema } from "mongoose";

export interface IProductVariant {
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  color: string;
  stock: number;
  priceOverride?: number;
}

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  category: "homme" | "femme" | "enfant";
  images: string[];
  variants: IProductVariant[];
  currency: string;
  isActive: boolean;
  createdAt: Date;
}

const variantSchema = new Schema<IProductVariant>(
  {
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    priceOverride: { type: Number, min: 0 }
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ["homme", "femme", "enfant"], required: true },
    images: [{ type: String }],
    variants: [variantSchema],
    currency: { type: String, default: "eur" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const ProductModel = mongoose.model<IProduct>("Product", productSchema);
