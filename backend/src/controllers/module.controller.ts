import type {
   Request,
   Response,
   NextFunction,
} from "express";

import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

// ====================
// CREATE MODULE
// ====================

export const createModule = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { title, order, courseId } = req.body ?? {};

      if (
         !title ||
         typeof title !== "string" ||
         !title.trim()
      ) {
         throw new AppError(
            "Module title is required",
            400
         );
      }

      if (
         !courseId ||
         typeof courseId !== "string"
      ) {
         throw new AppError(
            "Valid courseId is required",
            400
         );
      }

      if (
         order === undefined ||
         !Number.isInteger(order) ||
         order < 1
      ) {
         throw new AppError(
            "Order must be a positive integer",
            400
         );
      }

      // Check course exists
      const course = await prisma.course.findUnique({
         where: {
            id: courseId,
         },
      });

      if (!course) {
         throw new AppError(
            "Course not found",
            404
         );
      }

      const module = await prisma.module.create({
         data: {
            title: title.trim(),
            order,
            courseId,
         },
      });

      return res.status(201).json({
         success: true,
         message: "Module created successfully",
         data: module,
      });
   } catch (error) {
      next(error);
   }
};

// ====================
// GET MODULES BY COURSE
// ====================

export const getModulesByCourse = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { courseId } = req.params;

      if (typeof courseId !== "string") {
         throw new AppError(
            "Invalid course id",
            400
         );
      }

      const course = await prisma.course.findUnique({
         where: {
            id: courseId,
         },
      });

      if (!course) {
         throw new AppError(
            "Course not found",
            404
         );
      }

      const modules = await prisma.module.findMany({
         where: {
            courseId,
         },
         orderBy: {
            order: "asc",
         },
         include: {
            _count: {
               select: {
                  lessons: true,
               },
            },
         },
      });

      return res.status(200).json({
         success: true,
         data: modules,
      });
   } catch (error) {
      next(error);
   }
};

// ====================
// UPDATE MODULE
// ====================

export const updateModule = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { id } = req.params;
      const { title, order } = req.body ?? {};

      if (typeof id !== "string") {
         throw new AppError(
            "Invalid module id",
            400
         );
      }

      const existingModule = await prisma.module.findUnique({
         where: {
            id,
         },
      });

      if (!existingModule) {
         throw new AppError(
            "Module not found",
            404
         );
      }

      const data: {
         title?: string;
         order?: number;
      } = {};

      // UPDATE TITLE
      if (title !== undefined) {
         if (
            typeof title !== "string" ||
            !title.trim()
         ) {
            throw new AppError(
               "Module title cannot be empty",
               400
            );
         }

         data.title = title.trim();
      }

      // UPDATE ORDER
      if (order !== undefined) {
         if (
            !Number.isInteger(order) ||
            order < 1
         ) {
            throw new AppError(
               "Order must be a positive integer",
               400
            );
         }

         data.order = order;
      }

      const module = await prisma.module.update({
         where: {
            id,
         },
         data,
      });

      return res.status(200).json({
         success: true,
         message: "Module updated successfully",
         data: module,
      });
   } catch (error) {
      next(error);
   }
};

// ====================
// DELETE MODULE
// ====================

export const deleteModule = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { id } = req.params;

      if (typeof id !== "string") {
         throw new AppError(
            "Invalid module id",
            400
         );
      }

      const existingModule = await prisma.module.findUnique({
         where: {
            id,
         },
      });

      if (!existingModule) {
         throw new AppError(
            "Module not found",
            404
         );
      }

      await prisma.module.delete({
         where: {
            id,
         },
      });

      return res.status(200).json({
         success: true,
         message: "Module deleted successfully",
      });
   } catch (error) {
      next(error);
   }
};