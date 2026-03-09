import express from "express";
import { register, login,logout } from "../controllers/auth.controller.js";
import { validateRegister } from "../middlewares/validateRegister.middleware.js";
import { validateLogin } from "../middlewares/validateLogin.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
 const authRouter = express.Router();

 export default authRouter;

authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);
authRouter.post("/logout", logout);

authRouter.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user, // user is already attached by protect middleware
  });
});