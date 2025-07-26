import { Router } from "express";
import * as userController from "./controllers/userController";

const router=Router()

router.route("/register").post(userController.registerUser)

export default router