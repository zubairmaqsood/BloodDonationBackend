import userModel from "../model/userModel.js"
import bcrypt from "bcrypt"

export const getUserProfile = (req, res) => {
    const {password,...rest} = req.user.toObject()
    res.status(200).send(rest)
}

export const updateProfile = async (req, res) => {
    try {
        const { password, ...rest } = req.body
        if (password) {
            const salt = await bcrypt.genSalt(12)
            rest.password = await bcrypt.hash(password, salt)
        }
        const user = await userModel.findOneAndUpdate({ _id: req.user._id }, rest, { new: true, runValidators: true })
        res.status(200).send("User Updated Successfully")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

