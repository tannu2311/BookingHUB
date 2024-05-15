import mongoose from "mongoose";
const bookedSlotsTrackSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Types.ObjectId,
        ref: 'campaigns',
        required: true,
    },
    date: Date,
    staffMember: String,
    slots: Array,
    slotTime: String,
    type: String,
    booked: Number
},
    {
        timestamps: true
    }
)
const bookedSlotsTrackModel = mongoose.models.bookedSlotsTracks || mongoose.model('bookedSlotsTracks', bookedSlotsTrackSchema);
export default bookedSlotsTrackModel;
