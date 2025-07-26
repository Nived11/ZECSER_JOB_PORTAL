import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });

    if (existing) return res.status(400).json({ msg: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });

    await newUser.save();

    res.status(201).json({ msg: "User registered" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
