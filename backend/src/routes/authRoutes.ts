import express, { Router } from "express";
import {
  loginUser,
  registerUser,
  resetPassword,
  confirmPasswordReset,
  checkAccessToken,
  logoutUser,
} from "../controllers/authController";
import auth from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/reset", resetPassword);
router.post("/reset-confirm", confirmPasswordReset);
router.get("/check-access-token", auth, checkAccessToken);
router.post("/logout", logoutUser);

export default router;
