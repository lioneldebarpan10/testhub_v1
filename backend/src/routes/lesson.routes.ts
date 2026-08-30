import { Router } from "express";

import {
  createLesson,
  getLessonsByModule,
  getLessonBySlug,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

import {
  updateLessonProgress,
} from "../controllers/lessonProgress.controller.js";

const router = Router();

// ====================
// PUBLIC ROUTES
// ====================

// Get all lessons for a module
router.get(
  "/module/:moduleId",
  getLessonsByModule
);

// Get lesson by module + slug
router.get(
  "/module/:moduleId/:slug",
  getLessonBySlug
);

// ====================
// AUTHENTICATED USER ROUTES
// ====================

// Update lesson progress
router.patch(
  "/:id/progress",
  authenticate,
  updateLessonProgress
);

// ====================
// ADMIN ROUTES
// ====================

// Create lesson
router.post(
  "/",
  authenticate,
  requireAdmin,
  createLesson
);

// Update lesson
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateLesson
);

// Delete lesson
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteLesson
);

export default router;