import { ZodError } from "zod";
import jwt from "jsonwebtoken";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
