import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String },
  phone: { type: String },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ["signup", "reset"], required: true },
  expiresAt: { type: Date, default: Date.now, expires: 600 },
});


export const Otp = mongoose.model("Otp", otpSchema);
