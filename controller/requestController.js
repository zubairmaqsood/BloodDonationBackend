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
export const acceptRequest = async (req, res) => {
    try {
        //first check if user's last donaton was 1 month ago
        const nextEligible = new Date(req.user.lastDonation)
        nextEligible.setMonth(nextEligible.getMonth() + 1)
        if (nextEligible > Date.now()) {
            return res.status(403).send(`you can only donate once every month. Your next eligible date is ${nextEligible.toDateString()}.`);
        }

        const request = await requestModel.findById(req.params.id)

        //if blood group of donor and request not match. For security
        if (req.user.bloodGroup != request.bloodGroup) {
            return res.status(403).send("Blood Group Not Matched")
        }

        if (!request) {
            return res.status(404).send("Request not found");
        }

        if (request.status == DonaionRequestStatus.ACCEPTED) {
            return res.status(409).send("Donation Request is already Accepted")
        }

        request.status = DonaionRequestStatus.ACCEPTED
        request.acceptedBy = req.user._id
        await request.save()
        req.user.lastDonation = new Date()
        await req.user.save()
        const notification = await notificationModel.create({
            userId: request.requestedBy,
            requestId: req.params.id,
            message: `Your Request of ${request.bloodQty} Unit ${request.bloodGroup} Blood Group at ${request.address} ${request.city} is accepted by ${req.user.username} `
        })
        res.status(200).send("Request Accepted")


    } catch (error) {
        res.status(500).send(error.message)
    }
}

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
export const getAllRequests = async (req, res) => {
    try {
        const requests = await requestModel.find({ bloodGroup: req.user.bloodGroup, city: req.user.city, status: DonaionRequestStatus.PENDING }).sort({ createdAt: -1 })//sort for descending order

        if (requests.length === 0) return res.status(404).send("No Request Found")
        res.status(200).send(requests)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getSingleRequest = async (req, res) => {
    try {
        const request = await requestModel.findOne({ _id: req.params.id })
        if (req.user.role == UserRole.RECIPIENT) {
            if (request.requestedBy != req.user._id) {
                return res.status(403).send("This Request is not requested by this user")
            }
            return res.status(200).send(request)
        }
        if (request.bloodGroup != req.user.bloodGroup) {
            return res.status(403).send("Blood Group of Donor Not Matched with required Blood Group")
        }
        return res.status(200).send(request)

    } catch (error) {
        res.status(500).send(error.message)
    }
}
