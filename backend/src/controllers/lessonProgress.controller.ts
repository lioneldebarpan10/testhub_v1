import type { Response } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

// ====================
// UPDATE LESSON PROGRESS
// ====================

export const updateLessonProgress = async (
   req: AuthRequest,
   res: Response
) => {
   try {
      const lessonId = Array.isArray(req.params.id)
         ? req.params.id[0]
         : req.params.id;

      const { completed } = req.body ?? {};

      // Authentication check
      if (!req.user) {
         return res.status(401).json({
            success: false,
            message: "Authentication required",
         });
      }

      // Validate lesson ID
      if (!lessonId || typeof lessonId !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid lesson id",
         });
      }

      // Validate completed value
      if (typeof completed !== "boolean") {
         return res.status(400).json({
            success: false,
            message: "Completed must be true or false",
         });
      }

      // Check lesson exists
      const lesson = await prisma.lesson.findUnique({
         where: {
            id: lessonId,
         },
      });

      if (!lesson) {
         return res.status(404).json({
            success: false,
            message: "Lesson not found",
         });
      }

      const userId = req.user.userId;

      // Create or update lesson progress
      const progress = await prisma.lessonProgress.upsert({
         where: {
            userId_lessonId: {
               userId,
               lessonId,
            },
         },
         update: {
            completed,
            completedAt: completed
               ? new Date()
               : null,
         },
         create: {
            userId,
            lessonId,
            completed,
            completedAt: completed
               ? new Date()
               : null,
         },
      });

      return res.status(200).json({
         success: true,
         message: completed
            ? "Lesson marked as completed"
            : "Lesson marked as incomplete",
         data: progress,
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to update lesson progress",
      });
   }
};


// ====================
// GET MY LESSON PROGRESS
// ====================

export const getMyLessonProgress = async (
   req: AuthRequest,
   res: Response
) => {
   try {
      // Authentication check
      if (!req.user) {
         return res.status(401).json({
            success: false,
            message: "Authentication required",
         });
      }

      const userId = req.user.userId;

      const progress =
         await prisma.lessonProgress.findMany({
            where: {
               userId,
            },
            include: {
               lesson: {
                  select: {
                     id: true,
                     title: true,
                     slug: true,
                     order: true,
                     module: {
                        select: {
                           id: true,
                           title: true,
                           order: true,
                           course: {
                              select: {
                                 id: true,
                                 title: true,
                                 slug: true,
                              },
                           },
                        },
                     },
                  },
               },
            },
            orderBy: {
               updatedAt: "desc",
            },
         });

      return res.status(200).json({
         success: true,
         data: progress,
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to fetch lesson progress",
      });
   }
};


// ====================
// GET COURSE PROGRESS
// ====================

export const getCourseProgress = async (
   req: AuthRequest,
   res: Response
) => {
   try {
      const courseId = Array.isArray(req.params.courseId)
         ? req.params.courseId[0]
         : req.params.courseId;

      // Authentication check
      if (!req.user) {
         return res.status(401).json({
            success: false,
            message: "Authentication required",
         });
      }

      // Validate course ID
      if (!courseId || typeof courseId !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid course id",
         });
      }

      const userId = req.user.userId;

      // Check course exists
      const course = await prisma.course.findUnique({
         where: {
            id: courseId,
         },
      });

      if (!course) {
         return res.status(404).json({
            success: false,
            message: "Course not found",
         });
      }

      // Run counts in parallel
      const [
         totalLessons,
         completedLessons,
      ] = await Promise.all([

         // Count total lessons
         prisma.lesson.count({
            where: {
               module: {
                  courseId,
               },
            },
         }),

         // Count completed lessons
         prisma.lessonProgress.count({
            where: {
               userId,
               completed: true,
               lesson: {
                  module: {
                     courseId,
                  },
               },
            },
         }),
      ]);

      // Calculate progress percentage
      const progressPercentage =
         totalLessons === 0
            ? 0
            : Math.round(
               (completedLessons / totalLessons) * 100
            );

      return res.status(200).json({
         success: true,
         data: {
            courseId,
            totalLessons,
            completedLessons,
            progressPercentage,
         },
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to fetch course progress",
      });
   }
};