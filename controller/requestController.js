import requestModel from "../model/requestModel.js"
import userModel from "../model/userModel.js"
import notificationModel from "../model/notificationModel.js"
import { DonaionRequestStatus, UserRole } from "../utils/constants.js"

export const postRequest = async (req, res) => {
    try {
        const recipientId = req.user._id
        const { bloodGroup, bloodQty, city, address } = req.body

        //create a request 
        const createdPost = await requestModel.create({
            requestedBy: recipientId,
            bloodGroup,
            bloodQty,
            city,
            address
        })

        //count one month back date to get maatching donors whose last donation was one month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);


        //find matching donor whose blood group is same as needed by recipient and last donation was 1 month ago
        const matchingDonors = await userModel.find(
            {
                role: UserRole.DONOR,
                bloodGroup, 
                city,
                $or: [
                    { lastDonation: { $lt: oneMonthAgo } },
                    { lastDonation: null }
                ]
                
             }).select("_id")

        //creating notifications for all matching donors found 
        const notifications = matchingDonors.map(donor => ({
            userId: donor._id,
            requestId: createdPost._id,
            message: `${req.user.username} needs ${createdPost.bloodGroup} blood in ${createdPost.city}, ${createdPost.address}. Please help if you can!`
        }))

        await notificationModel.insertMany(notifications)
        res.status(201).send("Post Created Successfully")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//when donor accepts a reqeuest
// In your requestController.js
export const acceptRequest = async (req, res) => {
    try {
      const request = await RequestModel.findById(req.params.id);
      
      // Blood group check
      if (req.user.bloodGroup !== request.bloodGroup) {
        return res.status(403).json({ 
          message: "Your blood group doesn't match this request" 
        });
      }
  
      // Status check
      if (request.status === 'accepted') {
        return res.status(409).json({ 
          message: "Request already accepted" 
        });
      }
  
      // Update request
      request.status = 'accepted';
      request.acceptedBy = req.user._id;
      await request.save();
      
      res.status(200).json({ message: "Request accepted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getRequests = async (req, res) => {
    try {
        if (req.user.role == UserRole.DONOR) {
            //getting array of objects of requests accepted by donor
            const acceptedReq = await requestModel.find({ acceptedBy: req.user._id }).sort({ createdAt: -1 })
            return res.status(200).send(acceptedReq)
        }

        //getting array of objects of requests send by recipient
        const requestedBy = await requestModel.find({ requestedBy: req.user._id }).sort({ createdAt: -1 })
        res.status(200).send(requestedBy)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//when donor wants to see all requests matching with its blood group
// In your requestController.js
export const getAllRequests = async (req, res) => {
    try {
      if (!req.user.bloodGroup || !req.user.city) {
        return res.status(400).json({
          success: false,
          message: "Donor profile incomplete - blood group and city required"
        });
      }
  
      const requests = await RequestModel.find({
        status: 'pending',
        bloodGroup: req.user.bloodGroup,
        city: req.user.city
      }).sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      console.error('Error fetching donor requests:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch requests",
        error: error.message
      });
    }
};


export const getSingleRequest = async (req, res) => {
    try {
        const request = await requestModel.findOne({ _id: req.params.id })

        if (!request) {
            return res.status(404).send("Request not found");
        }

        //if user role is recipient then check if this request is requested by this recipient 
        if (req.user.role === UserRole.RECIPIENT) {
            if (request.requestedBy != req.user._id) {
                return res.status(403).send("This Request is not requested by this user")
            }
            return res.status(200).send(request)
        }

        //if user role is donor then check if user blood group map with request blood group for security so that no donor can see request which is not match with its blood group
        if (request.bloodGroup != req.user.bloodGroup) {
            return res.status(403).send("Blood Group of Donor Not Matched with required Blood Group")
        }
        
        return res.status(200).send(request)

    } catch (error) {
        res.status(500).send(error.message)
    }
}
