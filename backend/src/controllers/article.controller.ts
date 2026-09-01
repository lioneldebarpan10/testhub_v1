import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

// ====================
// GET ARTICLE BY PROBLEM SLUG
// ====================

export const getArticleByProblemSlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { problemSlug } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { slug: Array.isArray(problemSlug) ? problemSlug[0] : problemSlug },
      select: { id: true },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const article = await prisma.problemArticle.findUnique({
      where: { problemId: problem.id },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found for this problem",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// CREATE OR UPDATE ARTICLE (ADMIN)
// ====================

export const createOrUpdateArticle = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { problemId } = req.params;
    const problemIdStr = Array.isArray(problemId) ? problemId[0] : problemId;
    const {
      statement,
      examples,
      bruteForce,
      betterApproach,
      optimalApproach,
      algorithm,
      code,
      complexity,
      videoUrl,
    } = req.body;

    // Check if problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemIdStr },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Check if article exists
    const existingArticle = await prisma.problemArticle.findUnique({
      where: { problemId: problemIdStr },
    });

    let article;

    if (existingArticle) {
      // Update existing article
      article = await prisma.problemArticle.update({
        where: { problemId: problemIdStr },
        data: {
          statement: statement || undefined,
          examples: examples || undefined,
          bruteForce: bruteForce || undefined,
          betterApproach: betterApproach || undefined,
          optimalApproach: optimalApproach || undefined,
          algorithm: algorithm || undefined,
          code: code || undefined,
          complexity: complexity || undefined,
          videoUrl: videoUrl || undefined,
        },
      });
    } else {
      // Create new article
      article = await prisma.problemArticle.create({
        data: {
          problemId: problemIdStr,
          statement: statement || null,
          examples: examples || null,
          bruteForce: bruteForce || null,
          betterApproach: betterApproach || null,
          optimalApproach: optimalApproach || null,
          algorithm: algorithm || null,
          code: code || null,
          complexity: complexity || null,
          videoUrl: videoUrl || null,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Article saved successfully",
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// GET ARTICLE SECTION (ADMIN - For editing)
// ====================

export const getArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { problemId } = req.params;
    const problemIdStr = Array.isArray(problemId) ? problemId[0] : problemId;

    const article = await prisma.problemArticle.findUnique({
      where: { problemId: problemIdStr },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// ====================
// DELETE ARTICLE (ADMIN)
// ====================

export const deleteArticle = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { problemId } = req.params;
    const problemIdStr = Array.isArray(problemId) ? problemId[0] : problemId;

    const article = await prisma.problemArticle.findUnique({
      where: { problemId: problemIdStr },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    await prisma.problemArticle.delete({
      where: { problemId: problemIdStr },
    });

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
