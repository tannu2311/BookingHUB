import mongoose from "mongoose";

const ContactFormMsgSchema = new mongoose.Schema({
    first_name : {type: String},
    last_name: {type: String},
    email: {type: String},
    subject : {type : String},
    message: {type: String}
},
    { timestamps: true }
)

const ContactFormMsgModel = mongoose.models.contactFormMessages || mongoose.model('contactFormMessages', ContactFormMsgSchema);

export default ContactFormMsgModel;

