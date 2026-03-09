import express from "express";
import {
  createSlot,
  getSlots,
  updateSlot,
  deleteSlot,
  getSlotsByTemple
} from "../controllers/slot.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateSlot } from "../middlewares/validateSlot.middleware.js";

const router = express.Router();

router.get("/", getSlots);
// Get slots for a specific temple
router.get("/temple/:templeId", getSlotsByTemple);
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "ORGANIZER"),
  validateSlot,
  createSlot
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "ORGANIZER"),
  
  updateSlot
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteSlot
);

export default router;