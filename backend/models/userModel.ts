import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {type:String},
  email: {type: String, required: true,unique: true,lowercase: true,  trim: true,},
  password: {type:String},
  role: { type: String, enum: ["employee", "employer", "admin", "superadmin"] },
  otp: {type:String},
  otpExpires:{type:Date},
  otpVerified: {type: Boolean,default: false},
  createdAt: {type: Date, default: Date.now,},
  updatedAt: {type: Date, default: Date.now,},
});

export default mongoose.model("User", userSchema);
