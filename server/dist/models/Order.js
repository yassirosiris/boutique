import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            variant: { size: String, color: String },
            qty: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 0 },
            unitPrice: { type: Number, required: true, min: 0 },
            lineTotal: { type: Number, required: true, min: 0 }
        }
    ],
    shippingAddress: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        country: String,
        postalCode: String
    },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    stripePaymentId: String,
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "eur" }
}, { timestamps: true });
export const OrderModel = mongoose.model("Order", orderSchema);
