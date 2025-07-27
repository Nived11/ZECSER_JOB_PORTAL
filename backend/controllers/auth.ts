import { Request, Response } from 'express';
import User from "../models/userModel"
import crypto from "crypto"
import { sendOtp } from "../utils/sendMail"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const register = async(req: Request, res: Response)=>{
 const { name, email, password, role } = req.body;

 try {
  const existUser=await User.findOne({email})
  if (existUser) return res.status(400).json({ message: 'User already exists' });
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser= new User({ name, email,  password: hashedPassword, role, isVerified: false})
  await newUser.save();
  res.status(201).json({message:'User registered successfully'})


 } catch (error) {
  res.status(500).json({ message: 'Server Error' });
 }
}

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
  user.isVerified = true;
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

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your OTP first" });

    if (!user.password)
      return res.status(500).json({ message: "Password is missing for this user" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
