import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {type:String},
  email: { type: String, unique: true },
  password: {type:String},
  role: { type: String, enum: ["employee", "employer"] },
  otp: {type:String},
  otpExpires:{type:Date},
  otpVerified: {type: Boolean,default: false,
}

});

export default mongoose.model("User", userSchema);
