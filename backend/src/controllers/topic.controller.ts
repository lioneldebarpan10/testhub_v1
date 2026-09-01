import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { createSlug } from "../utils/slug.js";
import { AppError } from "../utils/AppError.js";

export const getAllTopics = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const topics = await prisma.topic.findMany({
         orderBy: {
            name: "asc",
         },
         include: {
            _count: {
               select: {
                  problems: true,
               },
            },
         },
      });

      return res.status(200).json({
         success: true,
         data: topics,
      });
   } catch (error) {
      next(error);
   }
};

export const createTopic = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { name } = req.body ?? {};

      if (
         !name ||
         typeof name !== "string" ||
         !name.trim()
      ) {
         throw new AppError("Topic name is required", 400);
      }

      const cleanName = name.trim();
      const slug = createSlug(cleanName);

      const existingTopic = await prisma.topic.findFirst({
         where: {
            OR: [
               { name: cleanName },
               { slug },
            ],
         },
      });

      if (existingTopic) {
         throw new AppError("Topic already exists", 409);
      }

      const topic = await prisma.topic.create({
         data: {
            name: cleanName,
            slug,
         },
      });

      return res.status(201).json({
         success: true,
         message: "Topic created successfully",
         data: topic,
      });
   } catch (error) {
      next(error);
   }
};

export const getTopicBySlug = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { slug } = req.params;

      if (typeof slug !== "string") {
         throw new AppError("Invalid topic slug", 400);
      }

      const topic = await prisma.topic.findFirst({
         where: {
            slug,
         },
         include: {
            _count: {
               select: {
                  problems: true,
               },
            },
         },
      });

      if (!topic) {
         throw new AppError("Topic not found", 404);
      }

      return res.status(200).json({
         success: true,
         data: topic,
      });
   } catch (error) {
      next(error);
   }
};

export const updateTopic = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { id } = req.params;
      const { name } = req.body ?? {};

      if (typeof id !== "string") {
         throw new AppError("Invalid topic id", 400);
      }

      if (
         !name ||
         typeof name !== "string" ||
         !name.trim()
      ) {
         throw new AppError("Topic name is required", 400);
      }

      const cleanName = name.trim();
      const slug = createSlug(cleanName);

      const existingTopic = await prisma.topic.findFirst({
         where: {
            OR: [
               { name: cleanName },
               { slug },
            ],
            NOT: {
               id,
            },
         },
      });

      if (existingTopic) {
         throw new AppError(
            "Another topic with this name already exists",
            409
         );
      }

      const topic = await prisma.topic.update({
         where: {
            id,
         },
         data: {
            name: cleanName,
            slug,
         },
      });

      return res.status(200).json({
         success: true,
         message: "Topic updated successfully",
         data: topic,
      });
   } catch (error) {
      next(error);
   }
};

export const deleteTopic = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { id } = req.params;

      if (typeof id !== "string") {
         throw new AppError("Invalid topic id", 400);
      }

      const existingTopic = await prisma.topic.findUnique({
         where: {
            id,
         },
      });

      if (!existingTopic) {
         throw new AppError("Topic not found", 404);
      }

      await prisma.topic.delete({
         where: {
            id,
         },
      });

      return res.status(200).json({
         success: true,
         message: "Topic deleted successfully",
      });
   } catch (error) {
      next(error);
   }
};