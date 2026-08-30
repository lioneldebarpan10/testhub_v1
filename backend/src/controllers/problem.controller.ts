import type {
   Request,
   Response,
   NextFunction,
} from "express";

import prisma from "../config/prisma.js";
import { createSlug } from "../utils/slug.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { AppError } from "../utils/AppError.js";

import {
   ProblemDifficulty,
   ProblemStatus,
   Prisma,
} from "../generated/prisma/client.js";

// ====================
// GET ALL PROBLEMS
// ====================

export const getAllProblems = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const {
         search,
         difficulty,
         topic,
         company,
         page = "1",
         limit = "20",
      } = req.query;

      const currentPage = Math.max(
         Number(page) || 1,
         1
      );

      const pageSize = Math.min(
         Math.max(Number(limit) || 20, 1),
         100
      );

      const where: Prisma.ProblemWhereInput = {};

      if (
         typeof search === "string" &&
         search.trim()
      ) {
         where.OR = [
            {
               title: {
                  contains: search.trim(),
                  mode: "insensitive",
               },
            },
            {
               description: {
                  contains: search.trim(),
                  mode: "insensitive",
               },
            },
         ];
      }

      if (
         typeof difficulty === "string" &&
         Object.values(ProblemDifficulty).includes(
            difficulty as ProblemDifficulty
         )
      ) {
         where.difficulty =
            difficulty as ProblemDifficulty;
      }

      if (
         typeof topic === "string" &&
         topic.trim()
      ) {
         where.topic = {
            slug: topic.trim(),
         };
      }

      if (
         typeof company === "string" &&
         company.trim()
      ) {
         where.companies = {
            some: {
               slug: company.trim(),
            },
         };
      }

      const [problems, total] = await Promise.all([
         prisma.problem.findMany({
            where,

            include: {
               topic: true,
               companies: true,
            },

            orderBy: {
               createdAt: "desc",
            },

            skip:
               (currentPage - 1) * pageSize,

            take: pageSize,
         }),

         prisma.problem.count({
            where,
         }),
      ]);

      return res.status(200).json({
         success: true,
         data: problems,

         pagination: {
            page: currentPage,
            limit: pageSize,
            total,
            totalPages:
               Math.ceil(total / pageSize),
         },
      });

   } catch (error) {
      next(error);
   }
};


// ====================
// GET PROBLEM BY SLUG
// ====================

export const getProblemBySlug = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { slug } = req.params;

      if (
         typeof slug !== "string" ||
         !slug.trim()
      ) {
         throw new AppError(
            "Invalid problem slug",
            400
         );
      }

      const problem =
         await prisma.problem.findUnique({
            where: {
               slug: slug.trim(),
            },

            include: {
               topic: true,
               companies: true,
            },
         });

      if (!problem) {
         throw new AppError(
            "Problem not found",
            404
         );
      }

      return res.status(200).json({
         success: true,
         data: problem,
      });

   } catch (error) {
      next(error);
   }
};


// ====================
// CREATE PROBLEM
// ====================

export const createProblem = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const {
         title,
         description,
         difficulty,
         topicId,
         companyIds = [],
         constraints,
         examples,
         solution,
         videoUrl,
         externalUrl,
      } = req.body ?? {};

      if (
         !title ||
         typeof title !== "string" ||
         !title.trim() ||
         !description ||
         typeof description !== "string" ||
         !description.trim() ||
         !difficulty ||
         !topicId ||
         typeof topicId !== "string"
      ) {
         throw new AppError(
            "Title, description, difficulty and topicId are required",
            400
         );
      }

      if (
         !Object.values(ProblemDifficulty).includes(
            difficulty as ProblemDifficulty
         )
      ) {
         throw new AppError(
            "Invalid difficulty",
            400
         );
      }

      if (!Array.isArray(companyIds)) {
         throw new AppError(
            "companyIds must be an array",
            400
         );
      }

      const cleanTitle = title.trim();
      const cleanDescription =
         description.trim();

      const slug = createSlug(cleanTitle);

      const existingProblem =
         await prisma.problem.findFirst({
            where: {
               OR: [
                  {
                     title: cleanTitle,
                  },
                  {
                     slug,
                  },
               ],
            },
         });

      if (existingProblem) {
         throw new AppError(
            "Problem already exists",
            409
         );
      }

      const topic =
         await prisma.topic.findUnique({
            where: {
               id: topicId,
            },
         });

      if (!topic) {
         throw new AppError(
            "Topic not found",
            404
         );
      }

      if (companyIds.length > 0) {
         const companies =
            await prisma.company.findMany({
               where: {
                  id: {
                     in: companyIds,
                  },
               },
            });

         if (
            companies.length !==
            new Set(companyIds).size
         ) {
            throw new AppError(
               "One or more companies were not found",
               400
            );
         }
      }

      const problem =
         await prisma.problem.create({
            data: {
               title: cleanTitle,
               slug,
               description: cleanDescription,

               difficulty:
                  difficulty as ProblemDifficulty,

               constraints,

               examples:
                  examples !== undefined
                     ? examples as Prisma.InputJsonValue
                     : undefined,

               solution,
               videoUrl,
               externalUrl,

               topic: {
                  connect: {
                     id: topicId,
                  },
               },

               companies: {
                  connect: [
                     ...new Set(companyIds),
                  ].map((id: string) => ({
                     id,
                  })),
               },
            },

            include: {
               topic: true,
               companies: true,
            },
         });

      return res.status(201).json({
         success: true,
         message:
            "Problem created successfully",
         data: problem,
      });

   } catch (error) {
      next(error);
   }
};


// ====================
// UPDATE PROBLEM
// ====================

export const updateProblem = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { id } = req.params;

      const {
         title,
         description,
         difficulty,
         topicId,
         companyIds,
         constraints,
         examples,
         solution,
         videoUrl,
         externalUrl,
      } = req.body ?? {};

      if (
         typeof id !== "string" ||
         !id
      ) {
         throw new AppError(
            "Invalid problem id",
            400
         );
      }

      const existingProblem =
         await prisma.problem.findUnique({
            where: {
               id,
            },
         });

      if (!existingProblem) {
         throw new AppError(
            "Problem not found",
            404
         );
      }

      const data:
         Prisma.ProblemUpdateInput = {};

      if (title !== undefined) {
         if (
            typeof title !== "string" ||
            !title.trim()
         ) {
            throw new AppError(
               "Problem title must be a valid string",
               400
            );
         }

         const cleanTitle = title.trim();
         const slug = createSlug(cleanTitle);

         const duplicate =
            await prisma.problem.findFirst({
               where: {
                  OR: [
                     {
                        title: cleanTitle,
                     },
                     {
                        slug,
                     },
                  ],

                  NOT: {
                     id,
                  },
               },
            });

         if (duplicate) {
            throw new AppError(
               "Another problem already uses this title",
               409
            );
         }

         data.title = cleanTitle;
         data.slug = slug;
      }

      if (description !== undefined) {
         if (
            typeof description !== "string" ||
            !description.trim()
         ) {
            throw new AppError(
               "Problem description must be a valid string",
               400
            );
         }

         data.description =
            description.trim();
      }

      if (difficulty !== undefined) {
         if (
            !Object.values(
               ProblemDifficulty
            ).includes(
               difficulty as ProblemDifficulty
            )
         ) {
            throw new AppError(
               "Invalid difficulty",
               400
            );
         }

         data.difficulty =
            difficulty as ProblemDifficulty;
      }

      if (constraints !== undefined) {
         data.constraints = constraints;
      }

      if (examples !== undefined) {
         data.examples =
            examples as Prisma.InputJsonValue;
      }

      if (solution !== undefined) {
         data.solution = solution;
      }

      if (videoUrl !== undefined) {
         data.videoUrl = videoUrl;
      }

      if (externalUrl !== undefined) {
         data.externalUrl = externalUrl;
      }

      if (topicId !== undefined) {
         if (
            typeof topicId !== "string" ||
            !topicId
         ) {
            throw new AppError(
               "Invalid topic id",
               400
            );
         }

         const topic =
            await prisma.topic.findUnique({
               where: {
                  id: topicId,
               },
            });

         if (!topic) {
            throw new AppError(
               "Topic not found",
               404
            );
         }

         data.topic = {
            connect: {
               id: topicId,
            },
         };
      }

      if (companyIds !== undefined) {
         if (!Array.isArray(companyIds)) {
            throw new AppError(
               "companyIds must be an array",
               400
            );
         }

         const uniqueCompanyIds = [
            ...new Set(companyIds),
         ];

         if (
            uniqueCompanyIds.length > 0
         ) {
            const companies =
               await prisma.company.findMany({
                  where: {
                     id: {
                        in: uniqueCompanyIds,
                     },
                  },
               });

            if (
               companies.length !==
               uniqueCompanyIds.length
            ) {
               throw new AppError(
                  "One or more companies were not found",
                  400
               );
            }
         }

         data.companies = {
            set: uniqueCompanyIds.map(
               (companyId: string) => ({
                  id: companyId,
               })
            ),
         };
      }

      const problem =
         await prisma.problem.update({
            where: {
               id,
            },

            data,

            include: {
               topic: true,
               companies: true,
            },
         });

      return res.status(200).json({
         success: true,
         message:
            "Problem updated successfully",
         data: problem,
      });

   } catch (error) {
      next(error);
   }
};


// ====================
// DELETE PROBLEM
// ====================

export const deleteProblem = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { id } = req.params;

      if (
         typeof id !== "string" ||
         !id
      ) {
         throw new AppError(
            "Invalid problem id",
            400
         );
      }

      const problem =
         await prisma.problem.findUnique({
            where: {
               id,
            },
         });

      if (!problem) {
         throw new AppError(
            "Problem not found",
            404
         );
      }

      await prisma.problem.delete({
         where: {
            id,
         },
      });

      return res.status(200).json({
         success: true,
         message:
            "Problem deleted successfully",
      });

   } catch (error) {
      next(error);
   }
};


// ====================
// UPDATE PROBLEM PROGRESS
// ====================

export const updateProblemProgress = async (
   req: AuthRequest,
   res: Response,
   next: NextFunction
) => {
   try {
      const { id } = req.params;
      const { status } = req.body ?? {};

      if (!req.user) {
         throw new AppError(
            "Authentication required",
            401
         );
      }

      if (
         typeof id !== "string" ||
         !id
      ) {
         throw new AppError(
            "Invalid problem id",
            400
         );
      }

      if (
         typeof status !== "string" ||
         !Object.values(
            ProblemStatus
         ).includes(
            status as ProblemStatus
         )
      ) {
         throw new AppError(
            "Status must be NOT_STARTED, ATTEMPTED, or SOLVED",
            400
         );
      }

      const problem =
         await prisma.problem.findUnique({
            where: {
               id,
            },
         });

      if (!problem) {
         throw new AppError(
            "Problem not found",
            404
         );
      }

      const existingProgress =
         await prisma.userProblemProgress.findUnique({
            where: {
               userId_problemId: {
                  userId: req.user.userId,
                  problemId: id,
               },
            },
         });

      const solvedAt =
         status === "SOLVED"
            ? existingProgress?.solvedAt ??
              new Date()
            : null;

      const progress =
         await prisma.userProblemProgress.upsert({
            where: {
               userId_problemId: {
                  userId: req.user.userId,
                  problemId: id,
               },
            },

            update: {
               status:
                  status as ProblemStatus,

               solvedAt,
            },

            create: {
               userId: req.user.userId,
               problemId: id,

               status:
                  status as ProblemStatus,

               solvedAt,
            },
         });

      return res.status(200).json({
         success: true,
         message:
            "Problem progress updated successfully",
         data: progress,
      });

   } catch (error) {
      next(error);
   }
};