import { Router } from "express";

import {
  getAllCompanies,
  createCompany,
  getCompanyBySlug,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public
router.get("/", getAllCompanies);
router.get("/:slug", getCompanyBySlug);

// Admin
router.post(
  "/",
  authenticate,
  requireAdmin,
  createCompany
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  updateCompany
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteCompany
);

export default router;