
import notificationModel from "../model/notificationModel.js"

export const getNotifications = async (req, res) => {
    try {

        //checking if request query parameters have something means that time after which notifications made for user are to be send
        if (req.query.newerThan) {
            const newDate = new Date(req.query.newerThan)
            const notifications = await notificationModel.find({
                userId: req.user._id,
                createdAt: {
                    $gte: newDate
                }
            }).sort({ createdAt: -1 })//descending order based on createdAt
            return res.status(200).send(notifications)
        }

        //if not have any query parameter than send all notifications for this user
        const notifications = await notificationModel.find({ userId: req.user._id }).sort({ createdAt: -1 })

        return res.status(200).send(notifications)
    } catch (error) {
        res.status(500).send(error.message)
    }
}


export const seenNotification = async (req, res) => {
    try {
        //fetch those notifications whose id comes from request parmeter and whose userId matches with currently login user
        const notification = await notificationModel.updateOne({ _id: req.params.id, userId: req.user._id }, { seen: true })

        if (notification.matchedCount === 0) return res.status(404).send("Notification not found")

        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(error.message)
    }
}