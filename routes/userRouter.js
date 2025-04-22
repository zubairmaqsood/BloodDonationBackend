import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import {getUserProfile, updateProfile} from "../controller/userController.js"
const router = Router()


router.get("/profile",isLoggedIn,getUserProfile)
router.put("/update",isLoggedIn,updateProfile)

export default router