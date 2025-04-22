import { UserRole } from "../utils/constants.js"

 const isRecipient =  (req, res, next) => {
    try {
        
        //checking if authenticated user is recipient 
        if (req.user.role == UserRole.RECIPIENT) {
            return next()
        }
        return res.status(403).send("Unauthorized")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export default isRecipient