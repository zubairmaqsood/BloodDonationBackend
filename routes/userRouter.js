import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import {getUserProfile, updateProfile} from "../controller/userController.js"
const router = Router()

//to get user profile data
router.get("/profile",isLoggedIn,getUserProfile)

//to update user profile data
router.put("/update",isLoggedIn,updateProfile)

export default router