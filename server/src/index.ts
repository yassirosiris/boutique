import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use("/api", paymentRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on ${env.port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Database connection failed:", error);
    process.exit(1);
  });
