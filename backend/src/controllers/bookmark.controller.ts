import type { Response } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

// ==========================
// ADD BOOKMARK
// ==========================

export const addBookmark = async (
   req: AuthRequest,
   res: Response
) => {
   try {
      const { id: problemId } = req.params;

      // Validate problem ID
      if (typeof problemId !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid problem id",
         });
      }

      // Check authentication
      if (!req.user) {
         return res.status(401).json({
            success: false,
            message: "Authentication required",
         });
      }

      const userId = req.user.userId;

      // Check if problem exists
      const problem = await prisma.problem.findUnique({
         where: {
            id: problemId,
         },
      });

      if (!problem) {
         return res.status(404).json({
            success: false,
            message: "Problem not found",
         });
      }

      // Check if already bookmarked
      const existingBookmark = await prisma.bookmark.findUnique({
         where: {
            userId_problemId: {
               userId,
               problemId,
            },
         },
      });

      if (existingBookmark) {
         return res.status(409).json({
            success: false,
            message: "Problem already bookmarked",
         });
      }

      // Create bookmark
      const bookmark = await prisma.bookmark.create({
         data: {
            userId,
            problemId,
         },
      });

      return res.status(201).json({
         success: true,
         message: "Problem bookmarked successfully",
         data: bookmark,
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to bookmark problem",
      });
   }
};


// ==========================
// REMOVE BOOKMARK
// ==========================

export const removeBookmark = async (
   req: AuthRequest,
   res: Response
) => {
   try {
      const { id: problemId } = req.params;

      // Validate problem ID
      if (typeof problemId !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid problem id",
         });
      }

      // Check authentication
      if (!req.user) {
         return res.status(401).json({
            success: false,
            message: "Authentication required",
         });
      }

      const userId = req.user.userId;

      // Find bookmark
      const bookmark = await prisma.bookmark.findUnique({
         where: {
            userId_problemId: {
               userId,
               problemId,
            },
         },
      });

      if (!bookmark) {
         return res.status(404).json({
            success: false,
            message: "Bookmark not found",
         });
      }

      // Delete bookmark
      await prisma.bookmark.delete({
         where: {
            id: bookmark.id,
         },
      });

      return res.status(200).json({
         success: true,
         message: "Bookmark removed successfully",
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to remove bookmark",
      });
   }
};


// ==========================
// GET MY BOOKMARKS
// ==========================

export const getMyBookmarks = async (
   req: AuthRequest,
   res: Response
) => {
   try {
      // Check authentication
      if (!req.user) {
         return res.status(401).json({
            success: false,
            message: "Authentication required",
         });
      }

      const userId = req.user.userId;

      // Get user's bookmarks
      const bookmarks = await prisma.bookmark.findMany({
         where: {
            userId,
         },
         include: {
            problem: {
               include: {
                  topic: true,
                  companies: true,
               },
            },
         },
         orderBy: {
            createdAt: "desc",
         },
      });

      return res.status(200).json({
         success: true,
         data: bookmarks,
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to fetch bookmarks",
      });
   }
};