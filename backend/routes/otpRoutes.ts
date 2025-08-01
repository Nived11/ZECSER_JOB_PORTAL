import express from "express";
import { generateOtp, verifyOtp } from "../controllers/otpController";

const router = express.Router();

router.post("/generate-otp", generateOtp);
router.post("/verify-otp", verifyOtp);

export default router;
