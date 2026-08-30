import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

import {
   generateAccessToken,
   verifyRefreshToken,
} from "../utils/jwt.js";

import {
   loginUser,
   registerUser,
} from "../services/auth.service.js";

// ====================
// REGISTER
// ====================

export const register = async (
   req: Request,
   res: Response
) => {
   try {
      const {
         name,
         email,
         password,
      } = req.body ?? {};

      if (
         typeof name !== "string" ||
         typeof email !== "string" ||
         typeof password !== "string" ||
         !name.trim() ||
         !email.trim() ||
         !password.trim()
      ) {
         return res.status(400).json({
            success: false,
            message:
               "Name, email and password are required",
         });
      }

      const result = await registerUser(
         name.trim(),
         email.trim(),
         password
      );

      return res.status(201).json({
         success: true,
         message:
            "User registered successfully",
         data: result,
      });
   } catch (error) {
      const message =
         error instanceof Error
            ? error.message
            : "Registration failed";

      return res.status(400).json({
         success: false,
         message,
      });
   }
};


// ====================
// LOGIN
// ====================

export const login = async (
   req: Request,
   res: Response
) => {
   try {
      const {
         email,
         password,
      } = req.body ?? {};

      if (
         typeof email !== "string" ||
         typeof password !== "string" ||
         !email.trim() ||
         !password.trim()
      ) {
         return res.status(400).json({
            success: false,
            message:
               "Email and password are required",
         });
      }

      const result = await loginUser(
         email.trim(),
         password
      );

      return res.status(200).json({
         success: true,
         message: "Login successful",
         data: result,
      });
   } catch (error) {
      const message =
         error instanceof Error
            ? error.message
            : "Login failed";

      return res.status(401).json({
         success: false,
         message,
      });
   }
};


// ====================
// GET CURRENT USER
// ====================

export const getMe = async (
   req: AuthRequest,
   res: Response
) => {
   try {
      if (!req.user) {
         return res.status(401).json({
            success: false,
            message:
               "Authentication required",
         });
      }

      const user = await prisma.user.findUnique({
         where: {
            id: req.user.userId,
         },
         select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            createdAt: true,
         },
      });

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      return res.status(200).json({
         success: true,
         data: user,
      });
   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message:
            "Failed to fetch user",
      });
   }
};


// ====================
// REFRESH ACCESS TOKEN
// ====================

export const refreshAccessToken = async (
   req: Request,
   res: Response
) => {
   try {
      const {
         refreshToken,
      } = req.body ?? {};

      if (
         typeof refreshToken !== "string" ||
         !refreshToken.trim()
      ) {
         return res.status(401).json({
            success: false,
            message:
               "Refresh token required",
         });
      }

      const decoded =
         verifyRefreshToken(refreshToken);

      const user = await prisma.user.findUnique({
         where: {
            id: decoded.userId,
         },
      });

      if (
         !user ||
         user.refreshToken !== refreshToken
      ) {
         return res.status(401).json({
            success: false,
            message:
               "Invalid refresh token",
         });
      }

      const newAccessToken =
         generateAccessToken(
            user.id,
            user.role
         );

      return res.status(200).json({
         success: true,
         accessToken: newAccessToken,
      });
   } catch (error) {
      return res.status(401).json({
         success: false,
         message:
            "Invalid or expired refresh token",
      });
   }
};


// ====================
// LOGOUT
// ====================

export const logout = async (
   req: AuthRequest,
   res: Response
) => {
   try {
      if (!req.user) {
         return res.status(401).json({
            success: false,
            message:
               "Authentication required",
         });
      }

      await prisma.user.update({
         where: {
            id: req.user.userId,
         },
         data: {
            refreshToken: null,
         },
      });

      return res.status(200).json({
         success: true,
         message:
            "Logged out successfully",
      });
   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message:
            "Logout failed",
      });
   }
};