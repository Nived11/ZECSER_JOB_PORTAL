import { Request, Response } from "express";
import { Otp } from "../models/otpModel";
import User from "../models/userModel"
import crypto from "crypto";
import { sendOtp } from "../utils/sendMail";

// Send OTP
export const generateOtp = async (req: Request, res: Response) => {
  const { email, purpose } = req.body;

  if (!["signup", "reset"].includes(purpose)) {
    return res.status(400).json({ message: "Invalid OTP purpose" });
  }

  try {
    const user = await User.findOne({ email });
    if (purpose === "signup") {
      if (user) {
        return res.status(404).json({ message: "User already exists" });
      }
    }
    if (purpose === "reset") {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    // const expiresAt = new Date(Date.now() + 30 * 1000); //30sec

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes 


    await Otp.deleteMany({ email, purpose });
    await Otp.create({ email, otp, purpose, expiresAt });

    await sendOtp(email, otp);

    res.status(200).json({ message: "OTP sent to email", expiresAt });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp, purpose } = req.body;

  try {
    const record = await Otp.findOne({ email, otp, purpose });

    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt.getTime() < Date.now()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

