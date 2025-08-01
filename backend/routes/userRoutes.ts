import express from "express";
import { home } from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/home", verifyToken, home);

export default router;
