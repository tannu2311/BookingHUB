const mongoose = require('mongoose');

const campaignsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    business: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['appointment', 'booking','event'],
    },
    
    address : String,
    phone : String,

    noOfBookings: {
        type: Number,
    },
    totalEarnings: {
        type: String,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    trash : {
        type: Number,
        default : 0  // 1 means in trash and 0 means not in trash 
    },
    
},{ timestamps: true });

const campaignsModel = mongoose.models.campaigns || mongoose.model('campaigns', campaignsSchema);

export default campaignsModel;
