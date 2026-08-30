import { Router } from "express";

import {
  getAllProblems,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
  updateProblemProgress,
} from "../controllers/problem.controller.js";

import {
  addBookmark,
  removeBookmark,
} from "../controllers/bookmark.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// ====================
// PUBLIC ROUTES
// ====================

router.get("/", getAllProblems);

// ====================
// AUTHENTICATED USER ROUTES
// ====================

router.post(
  "/:id/bookmark",
  authenticate,
  addBookmark
);

router.delete(
  "/:id/bookmark",
  authenticate,
  removeBookmark
);

router.post(
  "/:id/progress",
  authenticate,
  updateProblemProgress
);

// ====================
// ADMIN ROUTES
// ====================

router.post(
  "/",
  authenticate,
  requireAdmin,
  createProblem
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateProblem
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteProblem
);

// ====================
// PUBLIC SINGLE PROBLEM
// ====================

// Keep generic parameter route last
router.get(
  "/:slug",
  getProblemBySlug
);

export default router;