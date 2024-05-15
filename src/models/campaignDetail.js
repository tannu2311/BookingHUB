import mongoose from "mongoose";

const campaignDetailSchema = new mongoose.Schema({
    campaignId : {
        type: mongoose.Types.ObjectId,
        ref: 'campaigns',
        required: true,
        unique: true,
    },

    Details : {}    
},
    { timestamps: true }
)

const campaignDetailModel = mongoose.models.campaignDetails || mongoose.model('campaignDetails', campaignDetailSchema);

export default campaignDetailModel;

