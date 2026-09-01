import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { createSlug } from "../utils/slug.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { AppError } from "../utils/AppError.js";

// ====================
// GET ALL SHEETS
// ====================

export const getAllSheets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { published = "true", page = "1", limit = "10" } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const where: any = {};
    if (published === "true") {
      where.published = true;
    }

    const [sheets, total] = await Promise.all([
      prisma.sheet.findMany({
        where,
        include: {
          topics: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              topics: true,
            },
          },
        },
        orderBy: { order: "asc" },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      }),
      prisma.sheet.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: sheets,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// GET SHEET BY SLUG
// ====================

export const getSheetBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

    const sheet = await prisma.sheet.findUnique({
      where: {
        slug,
      },

      include: {
        topics: {
          orderBy: {
            order: "asc",
          },

          include: {
            problems: {
              include: {
                topic: true,
                companies: true,
              },
            },

            modules: {
              orderBy: {
                order: "asc",
              },

              include: {
                problems: {
                  include: {
                    topic: true,
                    companies: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: "Sheet not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sheet,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// CREATE SHEET (ADMIN)
// ====================

export const createSheet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, published, order } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Sheet name is required",
      });
    }

    const slug = createSlug(name);

    const existingSheet = await prisma.sheet.findUnique({
      where: { slug },
    });

    if (existingSheet) {
      return res.status(400).json({
        success: false,
        message: "Sheet with this name already exists",
      });
    }

    const sheet = await prisma.sheet.create({
      data: {
        name,
        slug,
        description: description || null,
        published: published ?? false,
        order: order ?? 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Sheet created successfully",
      data: sheet,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// UPDATE SHEET (ADMIN)
// ====================

export const updateSheet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, description, published, order } = req.body;

    const sheet = await prisma.sheet.findUnique({
      where: { id },
    });

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: "Sheet not found",
      });
    }

    const updatedData: any = {};
    if (name && typeof name === "string") {
      updatedData.name = name;
      updatedData.slug = createSlug(name);
    }
    if (description !== undefined) updatedData.description = description;
    if (published !== undefined) updatedData.published = published;
    if (order !== undefined) updatedData.order = order;

    const updatedSheet = await prisma.sheet.update({
      where: { id },
      data: updatedData,
    });

    res.status(200).json({
      success: true,
      message: "Sheet updated successfully",
      data: updatedSheet,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// DELETE SHEET (ADMIN)
// ====================

export const deleteSheet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sheetId = Array.isArray(id) ? id[0] : id;

    const sheet = await prisma.sheet.findUnique({
      where: { id: sheetId },
    });

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: "Sheet not found",
      });
    }

    await prisma.sheet.delete({
      where: { id: sheetId },
    });

    res.status(200).json({
      success: true,
      message: "Sheet deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
