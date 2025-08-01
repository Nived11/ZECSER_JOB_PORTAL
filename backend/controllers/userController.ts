import { Request, Response } from "express";
import User from "../models/userModel";

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
