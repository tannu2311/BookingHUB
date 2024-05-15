import mongoose from "mongoose";

const langSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    language : {type : Object}
},
    { timestamps: true }
)

export const langModel = mongoose.models.languages || mongoose.model('languages', langSchema);




