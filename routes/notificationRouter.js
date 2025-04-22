import { Router } from "express";
import { getNotifications } from "../controller/notificationController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"
const router = Router()

router.get("/",isLoggedIn,getNotifications)

export default router