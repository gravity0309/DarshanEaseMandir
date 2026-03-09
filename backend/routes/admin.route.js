

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

import {
  getDashboardAnalytics,
  getTempleStats,
  getAllUsers,
  updateUserRole,
  getAllBookings,
  getAllDonations,
  getTempleRevenue
 
} from "../controllers/admin.controller.js";

const router = express.Router();


router.get(
  "/dashboard",
  protect,
  authorizeRoles("ADMIN"),
  getDashboardAnalytics
);

router.get(
  "/temple-stats",
  protect,
  authorizeRoles("ADMIN"),
  getTempleStats
);


router.get(
  "/users",
  protect,
  authorizeRoles("ADMIN"),
  getAllUsers
);

router.patch(
  "/users/update-role/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateUserRole
);

router.get(
  "/bookings",
  protect,
  authorizeRoles("ADMIN"),
  getAllBookings
);


router.get(
  "/donations",
  protect,
  authorizeRoles("ADMIN"),
  getAllDonations
);


router.get(
  "/temple-revenue",
  protect,
  authorizeRoles("ADMIN"),
  getTempleRevenue
);

export default router;