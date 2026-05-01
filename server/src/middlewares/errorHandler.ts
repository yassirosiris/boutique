import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const notFound = (_req: Request, res: Response): void => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(status).json({ message: err.message || "Internal server error" });
};
