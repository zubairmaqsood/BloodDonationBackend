import {Schema,model} from "mongoose";

const requestSchema = new Schema({
    requestedBy:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    acceptedBy:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    status:{
        type:String,
        enum:["pending","accepted"],
        default: "pending"
    },
    bloodGroup:{
        type:String,
        enum:['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required:true
    },
    bloodQty:{
        type:Number
    },
    city:{
        type:String
    },
    address:{
        type:String
    }
},{
    timestamps:true
})

export default model("donationRequests",requestSchema)