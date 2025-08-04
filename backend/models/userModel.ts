import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {type:String},
  email: {type: String, required: true,unique: true,lowercase: true,  trim: true,},
  phone:{type: Number, unique: true, sparse: true},
  password: {type:String},
  role: { type: String, enum: ["employee", "employer", "admin", "superadmin"] },
  createdAt: {type: Date, default: Date.now,},
  updatedAt: {type: Date, default: Date.now,},
});

export default mongoose.model("User", userSchema);
