import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/User.js";
import { verifyJwt } from "../utils/jwt.js";
export const requireAuth = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
    }
    const token = auth.replace("Bearer ", "");
    const payload = verifyJwt(token);
    const user = await UserModel.findById(payload.userId).select("-password");
    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
        return;
    }
    req.user = user;
    next();
};
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        res.status(StatusCodes.FORBIDDEN).json({ message: "Admin access required" });
        return;
    }
    next();
};
