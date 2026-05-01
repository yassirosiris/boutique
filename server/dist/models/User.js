import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
const addressSchema = new Schema({
    fullName: String,
    phone: String,
    street: String,
    city: String,
    country: String,
    postalCode: String
}, { _id: false });
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [addressSchema]
}, { timestamps: true });
userSchema.pre("save", async function hashPassword(next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};
export const UserModel = mongoose.model("User", userSchema);
