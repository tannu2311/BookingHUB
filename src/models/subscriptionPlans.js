import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    planname: {type: String},
    description: {type: String},
    price: {type: Number},
    status:{type: Number}, // 0 inactive and 1 active
    paymentPeriod: {
        type: String, //  ["onetime","monthly", "yearly"],
    },
    allowFreeTrial: {type: Boolean},
    isRecommended:{type: Boolean},
    freeTrialPeriod: {type: Number},
    noOfCampaigns : {type: Number},
    paypal : {},
    stripe : {}
},
{ timestamps: true }
);

const subscriptionPlanModel = mongoose.models.subscriptionPlans || mongoose.model('subscriptionPlans', planSchema);

export default subscriptionPlanModel;
