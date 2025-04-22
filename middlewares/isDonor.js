import { UserRole } from "../utils/constants.js"

 
 const isDonor =  (req, res, next) => {
    try {
        //checking if authenticated user is donor 
        if (req.user.role == UserRole.DONOR) {
            return next()
        }
        return res.status(403).send("Unauthorized")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export default isDonor