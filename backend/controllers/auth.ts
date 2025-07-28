import { Request, Response } from 'express';
import User from "../models/userModel"
import crypto from "crypto"
import { sendOtp } from "../utils/sendMail"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.otpVerified) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        // update name/password if previously unverified
        existingUser.name = name;
        existingUser.password = await bcrypt.hash(password, 10);
        await existingUser.save();

        return res.status(200).json({ message: "Updated unverified user. Now proceed with OTP." });
      }
    }

    // fresh new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      otpVerified: false,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully, proceed with OTP" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const generateOtp = async(req: Request, res: Response)=>{
  const {email}=req.body;
  try {
    const user=await User.findOne({email});
    if(!user) return res.status(400).json({message:'user not found'});
    
    const otp = crypto.randomInt(100000,999999).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtp(email,otp);
    res.status(200).json({message:"OTP sent to email"});
  } catch(error) {
    res.status(500).json({ message: 'Server Error' });
  }
}


export const verifyOtp = async(req: Request, res: Response)=>{
  const {email,otp}=req.body;
try {
  const user=await User.findOne({email})
  if(!user) return res.status(400).json({message:'user not found'});
  if ( user.otp !== otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
  return res.status(400).json({ message: "Invalid or expired OTP" });
}
  user.otp=null;
  user.otpExpires=null;
  user.otpVerified = true;
  await user.save();
  
  const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
  res.status(200).json({message:"OTP verified, logged in successfully", token});
} catch (error) {
  res.status(500).json({ message: 'Server Error' });
}
}


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.otpVerified)
      return res.status(403).json({ message: "signup not completed" });

    if (!user.password)
      return res.status(500).json({ message: "Password is missing for this user" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({ message: "Login successful", token ,userId:user._id});
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};


export const home = async (req: Request, res: Response) => {
  try {
    if(!req.user) {
      return res.status(401).json({ message: "session expired please login again" });
    }
    console.log("Accessing protected route");
    console.log("User data:", req.user);
    const _id = req.user?.id;
    console.log(_id);

    const user = await User.findOne({_id});
   res.status(200).json({ _id, name: user?.name, email: user?.email });
    
  } catch (error) {
    console.error("Home error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}