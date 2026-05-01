import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/User.js";
import { signJwt } from "../utils/jwt.js";
/**
 * Register a new user account.
 */
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const exists = await UserModel.findOne({ email });
    if (exists) {
        res.status(StatusCodes.CONFLICT).json({ message: "Email already exists" });
        return;
    }
    const user = await UserModel.create({ name, email, password });
    const token = signJwt({ userId: user.id });
    res.status(StatusCodes.CREATED).json({ token, user: { id: user.id, name: user.name, email: user.email } });
};
/**
 * Authenticate user and return JWT token.
 */
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
        return;
    }
    const token = signJwt({ userId: user.id });
    res.status(StatusCodes.OK).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};
/**
 * Return currently authenticated user.
 */
export const me = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};
