import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Types.ObjectId,
        ref: 'campaigns',
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    image : String,
})

const imageModel = mongoose.models.images || mongoose.model('images', imageSchema);

export default imageModel;
