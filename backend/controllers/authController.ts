import { Request, Response } from 'express';
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/generateTokens";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Register User
export const register = async (req: Request, res: Response) => {
  const { name, email, password ,phone} = req.body;

  try {
    const existingemail = await User.findOne({ email });
    if (existingemail) return res.status(400).json({ message: "User already exists" });

    const existingphone = await User.findOne({ phone });
if (existingphone) {
  return res.status(409).json({ message: "User with this phone already exists" });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email,phone, password: hashedPassword, role: "employee",});

    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
    console.log(err);
    
  }
};


//  Login User
export const login = async (req: Request, res: Response) => {
  const { email,phone, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: email }, { phone: phone }],});

    if (!user) return res.status(400).json({ message: "User not found" });

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



//  Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, phone, newPassword, confirmPassword } = req.body;

  if ((!email && !phone) || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    
    const user = await User.findOne(email ? { email } : { phone });

    if (!user) return res.status(400).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//  Logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};