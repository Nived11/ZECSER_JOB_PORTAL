import { Request, Response } from 'express';
import User from "../models/userModel";
import crypto from "crypto";
import { sendOtp } from "../utils/sendMail";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

//  Generate Access & Refresh Tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

// Register User
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.otpVerified) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        existingUser.name = name;
        existingUser.password = await bcrypt.hash(password, 10);
        await existingUser.save();
        return res.status(200).json({ message: "OTP sent to email" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: "employee", otpVerified: false });

    await newUser.save();
    res.status(201).json({ message: "User registered. Proceed with OTP." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//  Generate OTP
export const generateOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    await sendOtp(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

//  Verify OTP and Set Cookies
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.otp !== otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    user.otpVerified = true;
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "OTP verified." });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

//  Login User
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.otpVerified) return res.status(403).json({ message: "Signup not completed" });

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//  Logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

//  Refresh Access Token
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

// ✅ Verify OTP for Reset Password
export const verifyResetOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "OTP verified. Now reset password." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword)
    return res.status(400).json({ message: "Both password fields are required" });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Protected Route: Home
export const home = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    const _id = req.user.id;
    const user = await User.findById(_id);
    res.status(200).json({ _id, name: user?.name, email: user?.email });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
