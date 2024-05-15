import { NextResponse } from "next/server";
import userModel from "@/models/users";
import subscriptionPlanModel from "@/models/subscriptionPlans";
import invoiceModel from "@/models/invoiceModel";
import { getAccessToken } from "@/utils/backendhelper";
import paymentMethodModel from "@/models/paymentMethods";
import sendEmail from "@/utils/mailer";
import emailNotificationModel from "@/models/emailNotification";
import connectToDatabase from "@/utils/dbconfig";
connectToDatabase();

export async function POST(request) {

    let admin = await userModel.findOne({ 'role': 1 });
    let paypalAccount = await paymentMethodModel.findOne({ 'userId': admin._id, 'paymentMethod': 'paypal' });
    const credentials = `${paypalAccount.publicKey}:${paypalAccount.secretKey}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');
    const accessToken = await getAccessToken(base64Credentials);

    try {
        let data = await request.json();

        if (data.event_type == "BILLING.SUBSCRIPTION.SUSPENDED" || data.event_type == "BILLING.SUBSCRIPTION.CANCELLED" || data.event_type == "BILLING.SUBSCRIPTION.EXPIRED") {
            let subscriptionId = data.resource.id;

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
        if (data.event_type == "BILLING.SUBSCRIPTION.ACTIVATED") {
            let subscriptionId = data.resource.id;

            let user = await userModel.findOneAndUpdate(
                { 'subscriptionId': subscriptionId },
                {
                    $set: {
                        'plan': data.resource.plan_id,
                        'planStatus': true,
                        'subscriptionId': data.subscriptionId,
                        'currentPeriodEnd': data.resource.billing_info.next_billing_time,
                    }
                });

            let plan = await subscriptionPlanModel.findOne({ 'paypal.planId': data.resource.plan_id });

            let invoiceData = {
                subscribedfromDate: data?.resource?.start_time,
                subscribedToDate: data?.resource.billing_info.next_billing_time,
                paymentDate: data.resource.create_time,
                amount: data.resource.shipping_amount.value,
                planname: plan.planname,
                email: data.resource.subscriber.email_address
            }

            let saveData = {
                userId: user._id,
                Details: invoiceData
            }

            let res = await invoiceModel.create(saveData);
        }

        if (data.event_type === "PAYMENT.SALE.COMPLETED") {

            let subscriptionId = data.resource.billing_agreement_id;

            const apiUrl = `${process.env.PAYPAL_URL}/v1/billing/subscriptions/${subscriptionId}`;

            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            let subscriptionDetail = await response.json();

            let user = await userModel.findOneAndUpdate(
                { 'subscriptionId': subscriptionId },
                {
                    $set: {
                        'plan': subscriptionDetail.plan_id,
                        'planStatus': true,
                        'subscriptionId': subscriptionId,
                        'currentPeriodEnd': subscriptionDetail.billing_info.next_billing_time,
                    }
                });
                

            let plan = await subscriptionPlanModel.findOne({ 'paypal.planId': subscriptionDetail.plan_id });

            let invoiceData = {
                subscribedfromDate: subscriptionDetail?.start_time,
                subscribedToDate: subscriptionDetail?.billing_info.next_billing_time,
                paymentDate: data.resource.create_time,
                amount: subscriptionDetail.shipping_amount.value,
                invoiceNumber: data.resource.id,
                planname: plan.planname,
                email: subscriptionDetail.subscriber.email_address
            }

            let saveData = {
                userId: user._id,
                Details: invoiceData
            }

            let res = await invoiceModel.create(saveData);

            invoiceData.firstname = user?.firstname;
            invoiceData.lastname = user?.lastname;
            invoiceData.paymentMethod = 'paypal';
            invoiceData.subscriptionId = subscriptionId;

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

        if(data.event_type == "BILLING.SUBSCRIPTION.PAYMENT.FAILED")
        {
            let subscriptionId = data.resource.id;
    
            let plan = await subscriptionPlanModel.findOne({ 'paypal.planId': data.resource.plan_id });

            let user = await userModel.findOne(
                { 'subscriptionId': subscriptionId });

            let userSubsciptionInfo = {
                firstname : user?.firstname,
                lastname : user?.lastname,
                subscriptionId : subscriptionId,
                subscriptionPlan : plan.planname,
                next_billing_time : data.resource.billing_info.next_billing_time,
                paymentDate: data.resource.create_time,
                paymentMethod : 'paypal'
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

        return NextResponse.json({ message: null, status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 });
    }
}
