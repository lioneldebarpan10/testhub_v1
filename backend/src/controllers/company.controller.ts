import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { createSlug } from "../utils/slug.js";
import { AppError } from "../utils/AppError.js";

// ====================
// GET ALL COMPANIES
// ====================

export const getAllCompanies = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const companies = await prisma.company.findMany({
         orderBy: {
            name: "asc",
         },
      });

      return res.status(200).json({
         success: true,
         data: companies,
      });
   } catch (error) {
      next(error);
   }
};

// ====================
// CREATE COMPANY
// ====================

export const createCompany = async (
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
         throw new AppError("Company name is required", 400);
      }

      const cleanName = name.trim();
      const slug = createSlug(cleanName);

      const existingCompany = await prisma.company.findFirst({
         where: {
            OR: [
               { name: cleanName },
               { slug },
            ],
         },
      });

      if (existingCompany) {
         throw new AppError("Company already exists", 409);
      }

      const company = await prisma.company.create({
         data: {
            name: cleanName,
            slug,
         },
      });

      return res.status(201).json({
         success: true,
         message: "Company created successfully",
         data: company,
      });
   } catch (error) {
      next(error);
   }
};

// ====================
// GET COMPANY BY SLUG
// ====================

export const getCompanyBySlug = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { slug } = req.params;

      if (typeof slug !== "string") {
         throw new AppError("Invalid company slug", 400);
      }

      const company = await prisma.company.findUnique({
         where: {
            slug,
         },
      });

      if (!company) {
         throw new AppError("Company not found", 404);
      }

      return res.status(200).json({
         success: true,
         data: company,
      });
   } catch (error) {
      next(error);
   }
};

// ====================
// UPDATE COMPANY
// ====================

export const updateCompany = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { id } = req.params;
      const { name } = req.body ?? {};

      if (typeof id !== "string") {
         throw new AppError("Invalid company id", 400);
      }

      if (
         !name ||
         typeof name !== "string" ||
         !name.trim()
      ) {
         throw new AppError("Company name is required", 400);
      }

      const cleanName = name.trim();
      const slug = createSlug(cleanName);

      const existingCompany = await prisma.company.findFirst({
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

      if (existingCompany) {
         throw new AppError(
            "Another company with this name already exists",
            409
         );
      }

      const company = await prisma.company.update({
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
         message: "Company updated successfully",
         data: company,
      });
   } catch (error) {
      next(error);
   }
};

// ====================
// DELETE COMPANY
// ====================

export const deleteCompany = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { id } = req.params;

      if (typeof id !== "string") {
         throw new AppError("Invalid company id", 400);
      }

      const existingCompany = await prisma.company.findUnique({
         where: {
            id,
         },
      });

      if (!existingCompany) {
         throw new AppError("Company not found", 404);
      }

      await prisma.company.delete({
         where: {
            id,
         },
      });

      return res.status(200).json({
         success: true,
         message: "Company deleted successfully",
      });
   } catch (error) {
      next(error);
   }
};