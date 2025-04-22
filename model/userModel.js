import {Schema,model} from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        match:/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        unique:true
    },
    password:{
        type:String,
        required:true   
    },
    role:{
        type:String,
        enum:["Recipient","Donor"],
        required:true
    },
    bloodGroup:{
        type:String,
        enum:['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required:true
    },
    phNo:{
        type:String,
        match:/^[0-9]+$/,
        minlength: 11,  
        maxlength: 11,
        required:true
    },
    city:{
        type:String
    },
    address:{
        type:String
    },
    lastDonation:{
        type:Date
    }
},{
    timestamps:true
})

export default model("users",userSchema)