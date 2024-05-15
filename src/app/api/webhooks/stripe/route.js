import { NextResponse } from "next/server";
import Stripe from "stripe";
import userModel from "@/models/users";
import paymentMethodModel from "@/models/paymentMethods";
import subscriptionPlanModel from "@/models/subscriptionPlans";
import invoiceModel from "@/models/invoiceModel";
import emailNotificationModel from "@/models/emailNotification";
import sendEmail from "@/utils/mailer";
import connectToDatabase from "@/utils/dbconfig";
connectToDatabase();

export async function POST(request) {

    try {

        let event = await request.json();

        let admin = await userModel.findOne({ 'role': 1 });
        let stripeAccount = await paymentMethodModel.findOne({ 'userId': admin._id, 'paymentMethod': 'stripe' });
        const stripe = new Stripe(stripeAccount.secretKey);

        const session = event.data.object;

        if (event.type === "checkout.session.completed") {

            const subscription = await stripe.subscriptions.retrieve(
                session.subscription,
            );
           

            let user = await userModel.findOneAndUpdate(
                {
                    'email': event.data.object.customer_email,
                },
                {
                    $set: {
                        'plan': subscription.items.data[0].price.id,
                        'subscriptionId': subscription.id,
                        'planStatus' : true,
                        'customerId': subscription.customer,
                        'currentPeriodEnd': new Date(
                            subscription.current_period_end * 1000,
                        ),
                    }
                }, { new: true });
        }

        if (event.type === "invoice.payment_succeeded") {
           
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription
            );

            let user = await userModel.findOneAndUpdate(
                {
                    'email': session.customer_email,
                },
                {
                    $set: {
                        'currentPeriodEnd': new Date(
                            subscription.current_period_end * 1000,
                        ),
                        'planStatus' : true,
                    }
                },{new:true});
      
            let planid = subscription.items.data[0].price.id;
            let plan = await subscriptionPlanModel.findOne({ 'stripe.planId': planid });

            let invoiceData = {
                subscribedfromDate: new Date(
                    subscription.current_period_start * 1000,
                ),
                subscribedToDate: new Date(
                    subscription.current_period_end * 1000,
                ),
                invoiceNumber: session.number,
                paymentDate: new Date(
                    session.created * 1000,
                ),
                amount: session.amount_paid / 100,
                planname: plan.planname,
                email: session.customer_email
            }
            let saveData = {
                userId: user._id,
                Details: invoiceData
            }
            let res = await invoiceModel.create(saveData);

            invoiceData.firstname = user?.firstname;
            invoiceData.lastname = user?.lastname;
            invoiceData.paymentMethod = 'stripe';
            invoiceData.subscriptionId = session.subscription;

            if(admin.smtpDetails)
                {
                    let smtpDetails = admin.smtpDetails;
                
                    let whereCustom, whereDefault;
                    whereCustom = {
                        'default': 1, 'emailBy': 1, 'type': 'subsciptionRenewal'
                    }
                    whereDefault = {
                        'default': 0, 'emailBy': 1, 'type': 'subsciptionRenewal'
                    }
                    let emailContent;
                    emailContent = await emailNotificationModel.findOne({ ...whereCustom });
                    if (!emailContent) {
                        emailContent = await emailNotificationModel.findOne({ ...whereDefault });
                    }
                    let emailDetail = emailContent?.Details;
                    await sendEmail({ email: user?.email, emailType: 'subsciptionRenewal', userInfo: invoiceData, smtpDetails, emailDetail });
                }
    
        }
        if(event.type === "customer.subscription.deleted")
        {
            let subscriptionId = session.id;

            let user = await userModel.findOneAndUpdate(
                { 'subscriptionId': subscriptionId },
                {
                    $set: {
                        'planStatus': false,
                    },
                    $unset: {
                        'subscriptionId': 1, 
                        'plan': 1,
                    }
                },
            );
        }

        if(event.type == "invoice.payment_failed")
        {
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription
            );
    
            let plan = await subscriptionPlanModel.findOne({ 'paypal.planId': data.resource.plan_id });

            let user = await userModel.findOne(
                { 'subscriptionId': session.subscription });

            let userSubsciptionInfo = {
                firstname : user?.firstname,
                lastname : user?.lastname,
                subscriptionId : session.subscription,
                subscriptionPlan : plan.planname,
                next_billing_time : new Date(event.nextPaymentAttemptTimestamp * 1000),
                paymentDate: new Date(
                    session.created * 1000,
                ),
                paymentMethod : 'stripe'
            }
            
                if(admin.smtpDetails)
                {
                    let smtpDetails = admin.smtpDetails;
                
                    let whereCustom, whereDefault;
                    whereCustom = {
                        'default': 1, 'emailBy': 1, 'type': 'subsciptionSuspended'
                    }
                    whereDefault = {
                        'default': 0, 'emailBy': 1, 'type': 'subsciptionSuspended'
                    }
                    let emailContent;
                    emailContent = await emailNotificationModel.findOne({ ...whereCustom });
                    if (!emailContent) {
                        emailContent = await emailNotificationModel.findOne({ ...whereDefault });
                    }
                    let emailDetail = emailContent?.Details;
                    await sendEmail({ email: user?.email, emailType: 'subsciptionSuspended', userInfo: userSubsciptionInfo, smtpDetails, emailDetail });
                }
                
        }

        return NextResponse.json(null, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message });
    }
}
