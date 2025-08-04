import { Request, Response } from "express";
import { Otp } from "../models/otpModel";
import User from "../models/userModel"
import crypto from "crypto";
import { sendOtpEmail } from "../utils/sendOtpMail";
import { sendOtpSMS } from "../utils/sendOtpSMS"; 

// Send OTP
export const generateOtp = async (req: Request, res: Response) => {
  const { email, phone, purpose } = req.body;

  try {
    let user = null;

    if (purpose === "signup") {
      if (email) {
        user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });
      }

      if (phone) {
        user = await User.findOne({ phone });
        if (user) return res.status(400).json({ message: "User already exists" });
      }
    }

    if (purpose === "reset") {
      if (email) {
        user = await User.findOne({ email });
      } else if (phone) {
        user = await User.findOne({ phone });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or Phone is required" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    // const expiresAt = new Date(Date.now() + 30 * 1000); // 30 seconds


    const otpDoc = new Otp({ email, phone, otp, purpose, expiresAt });
    await otpDoc.save();

    if (email) {
      await sendOtpEmail(email, otp);
    } else if (phone) {
      await sendOtpSMS(phone, otp);
    }

    res.json({ message: "OTP sent", expiresAt });
  } catch (err) {
    console.error("OTP Generation Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



// Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, phone, otp, purpose } = req.body;

  const query: any = { otp, purpose };
  if (email) query.email = email;
  if (phone) query.phone = phone;

  console.log("OTP Verify Query:", query);

  const otpDoc = await Otp.findOne(query);
  
  console.log("Found OTP Doc:", otpDoc);

  if (!otpDoc) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if ( otpDoc.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  await Otp.deleteOne({ _id: otpDoc._id });

  res.json({ message: "OTP verified" });
};