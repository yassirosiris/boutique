import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

export interface IAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  addresses: IAddress[];
  comparePassword(candidate: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    country: String,
    postalCode: String
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [addressSchema]
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const UserModel = mongoose.model<IUser>("User", userSchema);
