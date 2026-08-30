import { Router } from "express";
import {
  createModule,
  getModulesByCourse,
  updateModule,
  deleteModule,
} from "../controllers/module.controller.js";

import {
  getLessonsByModule,
  getLessonBySlug,
} from "../controllers/lesson.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// ====================
// PUBLIC ROUTES
// ====================

router.get(
  "/:moduleId/lessons",
  getLessonsByModule
);

router.get(
  "/:moduleId/lessons/:slug",
  getLessonBySlug
);

// Get all modules of a course
router.get(
  "/course/:courseId",
  getModulesByCourse
);

// ====================
// ADMIN ROUTES
// ====================

// Create module
router.post(
  "/",
  authenticate,
  requireAdmin,
  createModule
);

// Update module
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateModule
);

// Delete module
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteModule
);

export default router;