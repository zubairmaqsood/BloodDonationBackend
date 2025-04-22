import { Router } from "express";
import { acceptRequest, getSingleRequest, postRequest, getRequests, getAllRequests } from "../controller/requestController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import isDonor from "../middlewares/isDonor.js"
import isRecipient from "../middlewares/isRecipient.js"

const router = Router()

router.post("/",isLoggedIn,isRecipient,postRequest)
router.get("/getRequest",isLoggedIn,getRequests)
router.patch("/:id/accept",isLoggedIn,isDonor,acceptRequest)
router.get("/",isLoggedIn,isDonor,getAllRequests)
router.get("/:id",isLoggedIn,getSingleRequest)


export default router