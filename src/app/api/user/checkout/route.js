import subscriptionPlanModel from "@/models/subscriptionPlans";
import paymentMethodModel from "@/models/paymentMethods";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import userModel from "@/models/users";
import invoiceModel from "@/models/invoiceModel";
import { getToken } from "next-auth/jwt";
import { getAccessToken } from "@/utils/backendhelper";

//get stripe client secret for checkout
export async function POST(request) {
  try {
    let { email,
      userId,
      isSubscribed,
      isCurrentPlan,
      plandetail,
      stripeCustomerId,
      stripePriceId } = await request.json();


    let admin = await userModel.findOne({ 'role': 1 });
    let stripeAccount = await paymentMethodModel.findOne({ 'userId': admin._id, 'paymentMethod': 'stripe' });
    let stripe;
    if (stripeAccount) {
      stripe = new Stripe(stripeAccount.secretKey);
    }

    const billingUrl = `${process.env.APP_URL}/user/settings`;

    if (stripeCustomerId && isCurrentPlan) {

      const configuration = await stripe.billingPortal.configurations.create({
        business_profile: {
          headline: 'BookingHub partners with Stripe for simplified billing.',
        },
        features: {
          invoice_history: {
            enabled: true,
          },
        },
      });

      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: billingUrl,
      });

      return NextResponse.json({ url: stripeSession.url, status: 1 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
      subscription_data: {
        trial_period_days: plandetail.freeTrialPeriod
      }
    });

    return NextResponse.json({ clientSecret: stripeSession.client_secret, sessionId: stripeSession.id, status: 1 });

  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 })
  }
}


// get api for billing list of user
export async function GET(request) {
  try {
    let getpage = request.nextUrl.searchParams.get("page") ? request.nextUrl.searchParams.get("page") : 1;
    let keyword = request.nextUrl.searchParams.get("search") ? request.nextUrl.searchParams.get("search") : '';
    let limit = request.nextUrl.searchParams.get("listPerPage") ? request.nextUrl.searchParams.get("listPerPage") : 10;

    const page = parseInt(getpage);
    const skip = (page - 1) * parseInt(limit);

    let invoices, totalRecords;

    const token = await getToken({ req: request });

    if (token && token.role == 0) {
      if (keyword) {
        invoices = await invoiceModel.find({
          'userId': token.sub,
          $or: [
            { 'Details.invoiceNumber': { $regex: keyword, $options: 'i' } },
            { 'Details.planname': { $regex: keyword, $options: 'i' } },
          ]
        }).sort({ _id: -1 }).skip(skip).limit(limit);

        totalRecords = await invoiceModel.countDocuments({
          'userId': token.sub,
          $or: [
            { 'Details.invoiceNumber': { $regex: keyword, $options: 'i' } },
            { 'Details.planname': { $regex: keyword, $options: 'i' } },
          ]
        })
      }
      else {
        invoices = await invoiceModel.find({ 'userId': token.sub }).sort({ _id: -1 }).skip(skip).limit(limit);

        totalRecords = await invoiceModel.countDocuments({
          'userId': token.sub,
          $or: [
            { 'Details.invoiceNumber': { $regex: keyword, $options: 'i' } },
            { 'Details.planname': { $regex: keyword, $options: 'i' } },
          ]
        })
      }
      const totalPages = Math.ceil(totalRecords / limit);

      return NextResponse.json({ data: invoices, totalPages, totalRecords, status: 1 })
    }
    else {
      return NextResponse.json({ message: "Unauthorized user.", status: 0 })
    }
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 })
  }
}


//get payment accounts keys
export async function PUT(request) {
  try {

    let planid = await request.nextUrl.searchParams.get('planId');

    let admin = await userModel.findOne({ 'role': 1 });
    let paypalAccount = await paymentMethodModel.findOne({ 'userId': admin._id, 'paymentMethod': 'paypal' });
    let stripeAccount = await paymentMethodModel.findOne({ 'userId': admin._id, 'paymentMethod': 'stripe' });

    let clientId, publickey;

    if (paypalAccount) {
      clientId = paypalAccount.publicKey
    }
    if (stripeAccount) {
      publickey = stripeAccount.publicKey
    }

    if (planid) {

      let plandetail = await subscriptionPlanModel.findOne({ '_id': planid });
      return NextResponse.json({ plandetail, publickey, clientId, status: 1 });
    }
    else {

      return NextResponse.json({ publickey, clientId, status: 1 });
    }


  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 })
  }
}

// store paypal changes after payment 
export async function PATCH(request) {
  try {
    const data = await request.json();
    const token = await getToken({ req: request });
    let userId;
    if (token) {
      userId = token.sub
    }

    else if (data.user) {
      userId = data.user.id;
    }

    let userforcancel = await userModel.findOne({'_id' : userId})

    if (userforcancel.subscriptionId) {

      let admin = await userModel.findOne({ 'role': 1 });
      let paypalAccount = await paymentMethodModel.findOne({ 'userId': admin._id, 'paymentMethod': 'paypal' });
      let stripeAccount = await paymentMethodModel.findOne({ 'userId': admin._id, 'paymentMethod': 'stripe' });
      if ((userforcancel.subscriptionId).startsWith('sub_')) {
        const stripe = new Stripe(stripeAccount.secretKey);
        const subscription = await stripe.subscriptions.cancel(
          userforcancel.subscriptionId
        );
      }
      else if ((userforcancel.subscriptionId).startsWith('I-')) {
        const credentials = `${paypalAccount.publicKey}:${paypalAccount.secretKey}`;
        const base64Credentials = Buffer.from(credentials).toString('base64');
        const accessToken = await getAccessToken(base64Credentials);

        const apiUrl = `${process.env.PAYPAL_URL}/v1/billing/subscriptions/${userforcancel.subscriptionId}/cancel`;

        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    }

    let user = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          'plan': data.planId,
          'planStatus': true,
          'subscriptionId': data.subscriptionId,
        }
      });

    return NextResponse.json({ message: "Successfully subscribed.", status: 1 })

  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 })
  }
}