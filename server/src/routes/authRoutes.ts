import { Router } from "express";
import { body } from "express-validator";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";
import { handleValidation } from "../middlewares/validate.js";

const router = Router();

router.post(
  "/register",
  [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 }), handleValidation],
  register
);
router.post("/login", [body("email").isEmail(), body("password").notEmpty(), handleValidation], login);
router.get("/me", requireAuth, me);

export default router;
