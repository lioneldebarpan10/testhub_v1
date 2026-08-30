import { Router } from "express";

import {
  getAllTopics,
  createTopic,
  getTopicBySlug,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public
router.get("/", getAllTopics);
router.get("/:slug", getTopicBySlug);

// Admin
router.post(
  "/",
  authenticate,
  requireAdmin,
  createTopic
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateTopic
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteTopic
);

export default router;