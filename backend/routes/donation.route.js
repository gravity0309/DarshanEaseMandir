import express from "express";
import {
  createDonation,
  getMyDonations,
  getAllDonations,
  getDonationStats,
  downloadDonationReceipt
} from "../controllers/donation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, createDonation);

router.get("/my-donations", protect, getMyDonations);

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getAllDonations
);

router.get(
  "/stats",
  protect,
  authorizeRoles("ADMIN"),
  getDonationStats
);

router.get(
  "/:id/receipt",
  protect,
  downloadDonationReceipt
);
export default router;