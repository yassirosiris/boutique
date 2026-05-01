import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
export const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        return;
    }
    next();
};
