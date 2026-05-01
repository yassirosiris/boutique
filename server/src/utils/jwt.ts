import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signJwt = (payload: object): string =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });

export const verifyJwt = <T>(token: string): T => jwt.verify(token, env.jwtSecret) as T;
