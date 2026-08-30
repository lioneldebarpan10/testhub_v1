import { Router } from "express";

import {
  getArticleByProblemSlug,
  getArticle,
  createOrUpdateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// ====================
// PUBLIC ROUTES
// ====================

router.get("/problem/:problemSlug", getArticleByProblemSlug);

// ====================
// ADMIN ROUTES
// ====================

router.get(
  "/:problemId",
  authenticate,
  requireAdmin,
  getArticle
);

router.post(
  "/:problemId",
  authenticate,
  requireAdmin,
  createOrUpdateArticle
);

router.delete(
  "/:problemId",
  authenticate,
  requireAdmin,
  deleteArticle
);

export default router;
