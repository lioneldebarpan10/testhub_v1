import type {
  Request,
  Response,
  NextFunction,
} from "express";

import prisma from "../config/prisma.js";
import { createSlug } from "../utils/slug.js";
import { AppError } from "../utils/AppError.js";

// ====================
// GET ALL COURSES
// ====================

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            modules: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// GET COURSE BY SLUG
// ====================

export const getCourseBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    if (typeof slug !== "string") {
      throw new AppError("Invalid course slug", 400);
    }

    const course = await prisma.course.findUnique({
      where: {
        slug,
      },
      include: {
        modules: {
          orderBy: {
            order: "asc",
          },
          include: {
            lessons: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    if (!course || !course.published) {
      throw new AppError("Course not found", 404);
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// CREATE COURSE
// ====================

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      thumbnail,
      published = false,
    } = req.body ?? {};

    if (
      !title ||
      typeof title !== "string" ||
      !title.trim()
    ) {
      throw new AppError(
        "Course title is required",
        400
      );
    }

    if (typeof published !== "boolean") {
      throw new AppError(
        "Published must be a boolean value",
        400
      );
    }

    const cleanTitle = title.trim();
    const slug = createSlug(cleanTitle);

    const existingCourse = await prisma.course.findFirst({
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

    if (existingCourse) {
      throw new AppError(
        "Course already exists",
        409
      );
    }

    const course = await prisma.course.create({
      data: {
        title: cleanTitle,
        slug,
        description,
        thumbnail,
        published,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// UPDATE COURSE
// ====================

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      thumbnail,
      published,
    } = req.body ?? {};

    if (typeof id !== "string") {
      throw new AppError(
        "Invalid course id",
        400
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!existingCourse) {
      throw new AppError(
        "Course not found",
        404
      );
    }

    const data: {
      title?: string;
      slug?: string;
      description?: string | null;
      thumbnail?: string | null;
      published?: boolean;
    } = {};

    // UPDATE TITLE
    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        throw new AppError(
          "Course title cannot be empty",
          400
        );
      }

      const cleanTitle = title.trim();
      const slug = createSlug(cleanTitle);

      const duplicate = await prisma.course.findFirst({
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
          "Another course already uses this title",
          409
        );
      }

      data.title = cleanTitle;
      data.slug = slug;
    }

    // UPDATE DESCRIPTION
    if (description !== undefined) {
      data.description = description;
    }

    // UPDATE THUMBNAIL
    if (thumbnail !== undefined) {
      data.thumbnail = thumbnail;
    }

    // UPDATE PUBLISHED STATUS
    if (published !== undefined) {
      if (typeof published !== "boolean") {
        throw new AppError(
          "Published must be a boolean value",
          400
        );
      }

      data.published = published;
    }

    const course = await prisma.course.update({
      where: {
        id,
      },
      data,
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// DELETE COURSE
// ====================

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      throw new AppError(
        "Invalid course id",
        400
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!existingCourse) {
      throw new AppError(
        "Course not found",
        404
      );
    }

    await prisma.course.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};