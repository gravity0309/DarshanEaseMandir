import express from "express";
import {
  createTemple,
  getTemples,
  updateTemple,
  deleteTemple,
  getTempleById
} from "../controllers/temple.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateCreateTemple,
  validateUpdateTemple } from "../middlewares/validateTemple.middleware.js"; 
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

/* Public */
router.get("/", getTemples);
router.get("/:id", getTempleById);


/* Admin */
router.post("/", protect, authorizeRoles("ADMIN"), upload.single("image"),validateCreateTemple, createTemple);
router.put("/:id", protect, authorizeRoles("ADMIN"), upload.single("image"),validateUpdateTemple, updateTemple);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteTemple);

export default router;