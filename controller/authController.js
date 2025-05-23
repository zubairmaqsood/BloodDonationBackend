import generateToken from "../utils/generateToken.js"
import userModel from "../model/userModel.js"
import bcrypt from "bcrypt"

export const registerUser = async (req, res) => {
    try {
        //retrieve data from request body and checking whether user already exist or not
        const { ...rest } = req.body
        const existingUser = await userModel.findOne({ email:rest.email })
        if (existingUser) return res.status(409).send("User already exist" )
        
        //making hash of password
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(rest.password,salt)

        //creating user
        const user =await userModel.create({...rest,password:hashedPassword})

        //generating token and send in cookie
        const token = generateToken(rest)
        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?"None":"Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(201).send( "User Registered Successfully" )
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        
        if (!user) return res.status(401).json({ 
            success: false,
            message: "Invalid email or password" 
        });

        const result = await bcrypt.compare(password, user.password);
        if (!result) return res.status(401).json({ 
            success: false,
            message: "Invalid email or password" 
        });

        const token = generateToken(user);
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,  // 'Donor' or 'Recipient'
                username: user.username
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

export function logoutUser(req, res) {
    try {
        //make token empty in cookies to logout the user
        res.cookie("token", "")
        res.status(200).send("Logged Out Successfully")
    } catch (error) {
        res.status(500).send(error.message)
    }
}