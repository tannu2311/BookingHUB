import mongoose from "mongoose";

const emailNotificationSchema = new mongoose.Schema({
    default : {
        type : Number,
        default : 0   // 0 means default template and 1 means created by user 
    },

    emailBy : {
        type : Number,
        default : 0   // 1 means admin and 0 means user 
    },

    userId:  mongoose.Types.ObjectId,

    type : String,
  

    Details : {}    
},
    { timestamps: true }
)

const emailNotificationModel = mongoose.models.emailNotifications || mongoose.model('emailNotifications', emailNotificationSchema);

export default emailNotificationModel;