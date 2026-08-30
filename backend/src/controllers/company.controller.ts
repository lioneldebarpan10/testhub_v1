import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { createSlug } from "../utils/slug.js";

export const getAllCompanies = async (
   req: Request,
   res: Response
) => {
   try {
      const companies = await prisma.company.findMany({
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
         data: companies,
      });
   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to fetch companies",
      });
   }
};

export const createCompany = async (
   req: Request,
   res: Response
) => {
   try {
      const { name } = req.body;

      if (!name || !name.trim()) {
         return res.status(400).json({
            success: false,
            message: "Company name is required",
         });
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
         return res.status(409).json({
            success: false,
            message: "Company already exists",
         });
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
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to create company",
      });
   }
};

export const getCompanyBySlug = async (
   req: Request,
   res: Response
) => {
   try {
      const { slug } = req.params;
      if (typeof slug !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid topic slug",
         });
      }


      const company = await prisma.company.findUnique({
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

      if (!company) {
         return res.status(404).json({
            success: false,
            message: "Company not found",
         });
      }

      return res.status(200).json({
         success: true,
         data: company,
      });
   } catch (error) {
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to fetch company",
      });
   }
};

export const updateCompany = async (
   req: Request,
   res: Response
) => {
   try {
      const { id } = req.params;
      const { name } = req.body;

      if (typeof id !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid topic id",
         });
      }

      if (!name || !name.trim()) {
         return res.status(400).json({
            success: false,
            message: "Company name is required",
         });
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
         return res.status(409).json({
            success: false,
            message: "Another company with this name already exists",
         });
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
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to update company",
      });
   }
};

export const deleteCompany = async (
   req: Request,
   res: Response
) => {
   try {
      const { id } = req.params;
      
      if (typeof id !== "string") {
         return res.status(400).json({
            success: false,
            message: "Invalid topic id",
         });
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
      console.error(error);

      return res.status(500).json({
         success: false,
         message: "Failed to delete company",
      });
   }
};