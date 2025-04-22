import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    requestId:{
        type:Schema.Types.ObjectId,
        ref:"donationRequests",
        required:true
    },
    message:String,
    seen:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

export default model("notifications", notificationSchema)