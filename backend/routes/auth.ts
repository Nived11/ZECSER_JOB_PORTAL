import express from "express"
import {register,generateOtp,verifyOtp,login,logout ,verifyResetOtp,resetPassword,home,refreshToken} from "../controllers/auth"
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();


router.post('/register',register)
router.post("/login", login);
router.post("/logout",logout);

router.post('/generate-otp',generateOtp)
router.post('/verify-otp',verifyOtp);

router.post("/verify-resetpassword-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

router.post("/refresh-token", refreshToken);

router.get('/home', verifyToken, home);

export default router;