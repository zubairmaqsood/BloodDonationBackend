import { Router } from "express";
import { getNotifications, seenNotification } from "../controller/notificationController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"
const router = Router()

//get notificatons for donor and recipient
router.get("/",isLoggedIn,getNotifications)

//to make seen attribute of notification true
router.patch("/:id/read",isLoggedIn,seenNotification)

export default router