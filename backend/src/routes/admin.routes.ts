import { Router } from "express";

import { getAdminDashboard } from "../controllers/admin.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.get(
  "/test",
  authenticate,
  requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin 👑",
    });
  }
);


router.get(
  "/dashboard",
  authenticate,
  requireAdmin,
  getAdminDashboard
);

export default router;