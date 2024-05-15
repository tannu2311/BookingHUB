import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {type: String},
    lastname: {type: String},
    password: {type: String},
    email: {type: String},
    role: {type: Number, default: 0 }, //0 for user , 1 for admin, 2 for visitors
    verified: { type: Number, default: 0 },
    status: { type: String, default: "Active"}, //Active or InActive
    verificationOtp: { type: Number },
    verificationOtpExpiry: Date,
    trash: { type: Number, default: 0 }, // 1 means in trash and 0 means not in trash 
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    smtpDetails: {},
    isPaymentRequired:{type : Number,default : 1},  // 1 - Required, 0 - not required
    plan: {type: String }, 
    planStatus : {type : Boolean,default : false },  // 1 - active, 0 - inactive
    //stripe 
    customerId : String,
    subscriptionId : String,
    currentPeriodEnd : Date,

},
    { timestamps: true }
)

const userModel = mongoose.models.users || mongoose.model('users', userSchema);

export default userModel;

