import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

// ====================
// ADMIN DASHBOARD
// ====================

export const getAdminDashboard = async (
   req: Request,
   res: Response
) => {
   try {
      const [
         totalUsers,
         totalProblems,
         totalTopics,
         totalCompanies,
         totalCourses,
         totalModules,
         totalLessons,
         totalSolvedProblems,
      ] = await Promise.all([

         prisma.user.count(),

         prisma.problem.count(),

         prisma.topic.count(),

         prisma.company.count(),

         prisma.course.count(),

         prisma.module.count(),

         prisma.lesson.count(),

         prisma.userProblemProgress.count({
            where: {
               status: "SOLVED",
            },
         }),
      ]);

      return res.status(200).json({
         success: true,

         data: {
            totalUsers,
            totalProblems,
            totalTopics,
            totalCompanies,

            totalCourses,
            totalModules,
            totalLessons,

            totalSolvedProblems,

            generatedAt: new Date(),
         },
      });

   } catch (error) {
      console.error(
         "Admin dashboard error:",
         error
      );

      return res.status(500).json({
         success: false,
         message: "Failed to fetch admin dashboard statistics",
      });
   }
};