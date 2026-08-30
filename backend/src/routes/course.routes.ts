import { Router } from "express";

import {
  getAllCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

import { getCourseProgress } from "../controllers/lessonProgress.controller.js";

const router = Router();

// ====================
// PUBLIC ROUTES
// ====================

// Get all published courses
router.get("/", getAllCourses);

// ====================
// AUTHENTICATED USER ROUTES
// ====================

// Get course progress
router.get(
  "/:courseId/progress",
  authenticate,
  getCourseProgress
);

// ====================
// PUBLIC ROUTES
// ====================

// Get single course by slug
router.get("/:slug", getCourseBySlug);

// ====================
// ADMIN ROUTES
// ====================

// Create course
router.post(
  "/",
  authenticate,
  requireAdmin,
  createCourse
);

// Update course
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateCourse
);

// Delete course
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteCourse
);

export default router;