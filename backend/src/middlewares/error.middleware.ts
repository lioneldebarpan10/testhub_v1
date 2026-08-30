import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../utils/AppError.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const statusCode =
    err instanceof AppError
      ? err.statusCode
      : 500;

  const message =
    err instanceof AppError
      ? err.message
      : "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};