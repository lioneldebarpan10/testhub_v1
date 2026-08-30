import { Router } from "express";

import { getMyProgress } from "../controllers/user.controller.js";
import { getMyBookmarks } from "../controllers/bookmark.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMyLessonProgress } from "../controllers/lessonProgress.controller.js";

const router = Router();

router.get(
  "/me/progress",
  authenticate,
  getMyProgress
);

router.get(
  "/me/bookmarks",
  authenticate,
  getMyBookmarks
);

router.get(
  "/me/lesson-progress",
  authenticate,
  getMyLessonProgress
);

export default router;