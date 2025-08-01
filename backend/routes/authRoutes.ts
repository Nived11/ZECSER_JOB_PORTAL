import express from "express";
import { register, login,logout,resetPassword, refreshToken,} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);

export default router;
