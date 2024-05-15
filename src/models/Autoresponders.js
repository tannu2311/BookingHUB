import mongoose from "mongoose";

const autoresponderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId
    },
    autoresponder:{ type: mongoose.Schema.Types.Mixed}


})

const auotoresponderModel = mongoose.models.autoresponders || mongoose.model('autoresponders', autoresponderSchema);

export default auotoresponderModel;