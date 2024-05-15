import mongoose from "mongoose";

const bookingDetailsSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Types.ObjectId,
        ref: 'campaigns',
    },
    campaignType : String,
    visitorId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    parentUserId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    paymentStatus : String,
    status : Number,    // 1 = accept and 0 for decline
    trash : {
        type: Number,
        default : 0  // 1 means in trash and 0 means not in trash 
    },
    Details : {} ,
},
{ timestamps: true }
)
const bookingDetailsModel = mongoose.models.bookings || mongoose.model('bookings', bookingDetailsSchema);
export default bookingDetailsModel;

   