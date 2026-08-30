import { Router } from "express";

import {
  getAllSheets,
  getSheetBySlug,
  createSheet,
  updateSheet,
  deleteSheet,
} from "../controllers/sheet.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// ====================
// PUBLIC ROUTES
// ====================

router.get("/", getAllSheets);
router.get("/:slug", getSheetBySlug);

// ====================
// ADMIN ROUTES
// ====================

router.post("/", authenticate, requireAdmin, createSheet);

router.put("/:id", authenticate, requireAdmin, updateSheet);

router.delete("/:id", authenticate, requireAdmin, deleteSheet);

export default router;
