import express from "express";
import env from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import router from "./routers";

env.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
