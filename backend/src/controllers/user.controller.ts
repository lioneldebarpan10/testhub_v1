import type { Response } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

// ==========================
// GET MY DSA PROGRESS
// ==========================

export const getMyProgress = async (
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

      // Run database queries in parallel
      const [
         totalProblems,
         solved,
         attempted,
         easySolved,
         mediumSolved,
         hardSolved,
      ] = await Promise.all([

         // Total problems available on platform
         prisma.problem.count(),

         // Total solved problems
         prisma.userProblemProgress.count({
            where: {
               userId,
               status: "SOLVED",
            },
         }),

         // Total attempted problems
         prisma.userProblemProgress.count({
            where: {
               userId,
               status: "ATTEMPTED",
            },
         }),

         // Easy problems solved
         prisma.userProblemProgress.count({
            where: {
               userId,
               status: "SOLVED",
               problem: {
                  difficulty: "EASY",
               },
            },
         }),

         // Medium problems solved
         prisma.userProblemProgress.count({
            where: {
               userId,
               status: "SOLVED",
               problem: {
                  difficulty: "MEDIUM",
               },
            },
         }),

         // Hard problems solved
         prisma.userProblemProgress.count({
            where: {
               userId,
               status: "SOLVED",
               problem: {
                  difficulty: "HARD",
               },
            },
         }),
      ]);

      // Fetch difficulty totals in parallel
      const [easyTotal, mediumTotal, hardTotal] = await Promise.all([
         prisma.problem.count({ where: { difficulty: "EASY" } }),
         prisma.problem.count({ where: { difficulty: "MEDIUM" } }),
         prisma.problem.count({ where: { difficulty: "HARD" } }),
      ]);

      // Problems that have not been started
      const notStarted =
         totalProblems - solved - attempted;

      // Calculate progress percentage
      const progressPercentage =
         totalProblems === 0
            ? 0
            : Math.round(
               (solved / totalProblems) * 100
            );

      return res.status(200).json({
         success: true,
         data: {
            totalProblems,

            totalSolved: solved,
            totalAttempted: attempted,
            notStarted,

            easySolved,
            mediumSolved,
            hardSolved,

            easyTotal,
            mediumTotal,
            hardTotal,

            progressPercentage,
         },
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to fetch progress",
      });
   }
};