
import notificationModel from "../model/notificationModel.js"

export const getNotifications = async (req, res) => {
    try {

        //checking if request query parameters have something means that time after which notifications made for user are to be send
        if(req.query.newerThan){
            const newDate = new Date(req.query.newerThan)
            const notifications = await notificationModel.find({ 
                userId: req.user._id,
                createdAt:{
                    $gte:newDate
                }
            }).sort({createdAt:-1})//descending order based on createdAt
            return res.status(200).send(notifications)
        }

        //if not have any query parameter than send all notifications for this user
        const notifications = await notificationModel.find({ userId: req.user._id }).sort({ createdAt: -1 })
     
        return res.status(200).send(notifications)
    } catch (error) {
        res.status(500).send(error.message)
    }
}
