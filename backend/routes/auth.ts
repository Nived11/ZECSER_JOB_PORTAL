import express from "express"
import {register,generateOtp,verifyOtp,login,logout ,verifyResetOtp,resetPassword,home} from "../controllers/auth"
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();


router.post('/register',register)
router.post('/generate-otp',generateOtp)
router.post('/verify-otp',verifyOtp);
router.post("/login", login);
router.post("/logout",logout);
router.post("/verify-resetpassword-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);


router.get('/home', verifyToken, home);




export default router;