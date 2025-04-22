import { Router } from "express";
import { acceptRequest, getSingleRequest, postRequest, getRequests, getAllRequests } from "../controller/requestController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import isDonor from "../middlewares/isDonor.js"
import isRecipient from "../middlewares/isRecipient.js"

const router = Router()

//to post a request
router.post("/",isLoggedIn,isRecipient,postRequest)

//to get requests for donor which is accepted by donor and for recipient which is requested by recipient 
router.get("/getRequest",isLoggedIn,getRequests)

//to accept request by donor
router.patch("/:id/accept",isLoggedIn,isDonor,acceptRequest)

//get all that requests for donor whose blood gruop and city matches donor's blood group and city and whose status is pending
router.get("/",isLoggedIn,isDonor,getAllRequests)

//get request's data which is clicked by user
router.get("/:id",isLoggedIn,getSingleRequest)


export default router