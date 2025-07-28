import express from "express";
import env from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import router from "./routes/auth";
import cookieParser from "cookie-parser";


env.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Your React frontend
    credentials: true,               // ✅ must send cookies
  })
);
app.use("/api", router);


const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
