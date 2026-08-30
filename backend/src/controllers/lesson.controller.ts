import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import prisma from "../config/prisma.js";
import { createSlug } from "../utils/slug.js";

// ====================
// CREATE LESSON
// ====================

export const createLesson = async (
   req: Request,
   res: Response
) => {
   try {
      const {
         title,
         content,
         videoUrl,
         resources,
         order,
         moduleId,
      } = req.body ?? {};

      // Validate title
      if (
         !title ||
         typeof title !== "string" ||
         !title.trim()
      ) {
         return res.status(400).json({
            success: false,
            message: "Lesson title is required",
         });
      }

      // Validate moduleId
      if (!moduleId || typeof moduleId !== "string") {
         return res.status(400).json({
            success: false,
            message: "Valid moduleId is required",
         });
      }

      // Validate order
      if (
         order === undefined ||
         !Number.isInteger(order) ||
         order < 1
      ) {
         return res.status(400).json({
            success: false,
            message: "Order must be a positive integer",
         });
      }

      // Check module exists
      const module = await prisma.module.findUnique({
         where: {
            id: moduleId,
         },
      });

      if (!module) {
         return res.status(404).json({
            success: false,
            message: "Module not found",
         });
      }

      const cleanTitle = title.trim();
      const slug = createSlug(cleanTitle);

      // Check duplicate slug inside same module
      const existingLesson = await prisma.lesson.findUnique({
         where: {
            moduleId_slug: {
               moduleId,
               slug,
            },
         },
      });

      if (existingLesson) {
         return res.status(409).json({
            success: false,
            message:
               "A lesson with this title already exists in this module",
         });
      }

      const lessonData: Prisma.LessonCreateInput = {
         title: cleanTitle,
         slug,
         order,
         module: {
            connect: {
               id: moduleId,
            },
         },
      };

      // Optional content
      if (content !== undefined) {
         lessonData.content = content;
      }

      // Optional video URL
      if (videoUrl !== undefined) {
         lessonData.videoUrl = videoUrl;
      }

      // Optional resources JSON
      if (resources !== undefined) {
         lessonData.resources =
            resources === null
               ? Prisma.JsonNull
               : resources as Prisma.InputJsonValue;
      }

      const lesson = await prisma.lesson.create({
         data: lessonData,
      });

      return res.status(201).json({
         success: true,
         message: "Lesson created successfully",
         data: lesson,
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to create lesson",
      });
   }
};


// ====================
// GET LESSONS BY MODULE
// ====================

export const getLessonsByModule = async (
   req: Request,
   res: Response
) => {
   try {
      const { moduleId } = req.params;

      if (typeof moduleId !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid module id",
         });
      }

      const lessons = await prisma.lesson.findMany({
         where: {
            moduleId,
         },
         orderBy: {
            order: "asc",
         },
      });

      return res.status(200).json({
         success: true,
         data: lessons,
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to fetch lessons",
      });
   }
};


// ====================
// GET LESSON BY SLUG
// ====================

export const getLessonBySlug = async (
   req: Request,
   res: Response
) => {
   try {
      const { moduleId, slug } = req.params;

      if (
         typeof moduleId !== "string" ||
         typeof slug !== "string"
      ) {
         return res.status(400).json({
            success: false,
            message: "Invalid lesson request",
         });
      }

      const lesson = await prisma.lesson.findUnique({
         where: {
            moduleId_slug: {
               moduleId,
               slug,
            },
         },
         include: {
            module: {
               include: {
                  course: true,
               },
            },
         },
      });

      if (!lesson) {
         return res.status(404).json({
            success: false,
            message: "Lesson not found",
         });
      }

      return res.status(200).json({
         success: true,
         data: lesson,
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to fetch lesson",
      });
   }
};


// ====================
// UPDATE LESSON
// ====================

export const updateLesson = async (
   req: Request,
   res: Response
) => {
   try {
      const { id } = req.params;

      const {
         title,
         content,
         videoUrl,
         resources,
         order,
      } = req.body ?? {};

      if (typeof id !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid lesson id",
         });
      }

      const existingLesson = await prisma.lesson.findUnique({
         where: {
            id,
         },
      });

      if (!existingLesson) {
         return res.status(404).json({
            success: false,
            message: "Lesson not found",
         });
      }

      const data: Prisma.LessonUpdateInput = {};

      // Update title + slug
      if (title !== undefined) {
         if (
            typeof title !== "string" ||
            !title.trim()
         ) {
            return res.status(400).json({
               success: false,
               message: "Lesson title cannot be empty",
            });
         }

         const cleanTitle = title.trim();
         const slug = createSlug(cleanTitle);

         // Check duplicate slug in same module
         const duplicate = await prisma.lesson.findUnique({
            where: {
               moduleId_slug: {
                  moduleId: existingLesson.moduleId,
                  slug,
               },
            },
         });

         if (duplicate && duplicate.id !== id) {
            return res.status(409).json({
               success: false,
               message:
                  "Another lesson with this title already exists",
            });
         }

         data.title = cleanTitle;
         data.slug = slug;
      }

      // Update content
      if (content !== undefined) {
         data.content = content;
      }

      // Update video URL
      if (videoUrl !== undefined) {
         data.videoUrl = videoUrl;
      }

      // Update resources
      if (resources !== undefined) {
         data.resources =
            resources === null
               ? Prisma.JsonNull
               : resources as Prisma.InputJsonValue;
      }

      // Update order
      if (order !== undefined) {
         if (
            !Number.isInteger(order) ||
            order < 1
         ) {
            return res.status(400).json({
               success: false,
               message:
                  "Order must be a positive integer",
            });
         }

         data.order = order;
      }

      const lesson = await prisma.lesson.update({
         where: {
            id,
         },
         data,
      });

      return res.status(200).json({
         success: true,
         message: "Lesson updated successfully",
         data: lesson,
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to update lesson",
      });
   }
};


// ====================
// DELETE LESSON
// ====================

export const deleteLesson = async (
   req: Request,
   res: Response
) => {
   try {
      const { id } = req.params;

      if (typeof id !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid lesson id",
         });
      }

      const existingLesson = await prisma.lesson.findUnique({
         where: {
            id,
         },
      });

      if (!existingLesson) {
         return res.status(404).json({
            success: false,
            message: "Lesson not found",
         });
      }

      await prisma.lesson.delete({
         where: {
            id,
         },
      });

      return res.status(200).json({
         success: true,
         message: "Lesson deleted successfully",
      });

   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to delete lesson",
      });
   }
};