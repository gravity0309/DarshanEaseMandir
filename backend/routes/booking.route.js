import express from "express";
import {
  createBooking,
  cancelBooking,
  getMyBookings,
  downloadTicket,
} from "../controllers/booking.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateBooking } from "../middlewares/validateBooking.middleware.js";
import { verifyBookingQR } from "../controllers/booking.controller.js";
const router = express.Router();

router.post("/", protect, validateBooking, createBooking);
router.put("/:id/cancel", protect, cancelBooking);

/* NEW ROUTE */
router.get("/my-bookings", protect, getMyBookings);
// router.post("/verify", verifyBookingQR);
router.get("/verify", verifyBookingQR);

router.get("/:id/ticket", downloadTicket);
export default router;