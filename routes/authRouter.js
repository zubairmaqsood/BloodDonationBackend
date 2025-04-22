import { Router } from "express";
const router = Router()
import { registerUser,loginUser, logoutUser } from "../controller/authController.js";

//to register user
router.post("/register",registerUser)

//to login user
router.post("/login",loginUser)

//to logout user
router.post("/logout",logoutUser)

export default router