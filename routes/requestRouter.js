import { Router } from "express";
import {
  acceptRequest,
  getSingleRequest,
  postRequest,
  getRequests,
  getAllRequests
} from "../controller/requestController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import isDonor from "../middlewares/isDonor.js";
import isRecipient from "../middlewares/isRecipient.js";

const router = Router();

// Route to post a new blood request (Recipient only)
router.post("/",
  isLoggedIn,
  isRecipient,
  postRequest
);

// Route to get user-specific requests (for both Donor and Recipient)
router.get("/user-requests",
  isLoggedIn,
  getRequests
);

// Route to accept a request (Donor only)
router.patch("/:id/accept",
  isLoggedIn,
  isDonor,
  acceptRequest
);

// Route to get all matching requests for donors (pending status)
router.get('/donor-requests',
    isLoggedIn,
    isDonor,
    async (req, res, next) => {
      try {
        const requests = await RequestModel.find({
          status: 'pending',
          bloodGroup: req.user.bloodGroup,
          city: req.user.city
        }).sort({ createdAt: -1 });
        res.status(200).json(requests);
      } catch (error) {
        next(error);
      }
    }
  );

// Route to get single request details
router.get("/:id",
  isLoggedIn,
  getSingleRequest
);

export default router;