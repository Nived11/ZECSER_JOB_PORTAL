import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Database connected :)");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

export default connectDB;
