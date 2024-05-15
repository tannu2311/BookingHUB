import subscriptionPlanModel from "@/models/subscriptionPlans";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import paymentMethodModel from "@/models/paymentMethods";
import { getAccessToken } from "@/utils/backendhelper";
import Stripe from "stripe";
import userModel from "@/models/users";
import connectToDatabase from '@/utils/dbconfig'

connectToDatabase();

//create paypal webhook

const createWebhookendpoints = async (token) => {
try {
    let endpointUrl = `${process.env.API_URL}webhooks/paypal`;

    const apiUrl = `${process.env.PAYPAL_URL}/v1/notifications/webhooks`;

    let endpoints = {
        url: endpointUrl,
        event_types: [
          {
            name: 'BILLING.PLAN.DEACTIVATED',
          },
          {
            name: 'BILLING.SUBSCRIPTION.EXPIRED',
          },
          {
            name: 'BILLING.SUBSCRIPTION.CANCELLED',
          },
          {
            name: 'BILLING.SUBSCRIPTION.SUSPENDED',
          },
          {
            name: 'PAYMENT.SALE.COMPLETED',
          },
          {
            name: 'BILLING.SUBSCRIPTION.ACTIVATED',
          },
        ],
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`,
        },
        body: JSON.stringify(endpoints)
    });
    let res = await response.json();

    return response;

} catch (error) {
    throw error
}
}

//create product 
const createPaypalProduct = async (data, token) => {
    try {
        const apiUrl = `${process.env.PAYPAL_URL}/v1/catalogs/products`;

        let productdata = {
            "name": data.planname,
            "description": data.description,
            "type": "SERVICE"
        }
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization : `Bearer ${token}`,
            },
            body: JSON.stringify(productdata)
        });

        let res = await response.json();
        return res.id;

    } catch (error) {
        throw error
    }
}

const createStripeProduct = async (data, stripe) => {
    try {
        const product = await stripe.products.create({
            'name': data.planname,
            'description': data.description
        });

        return product.id;
    } catch (error) {
        throw error
    }
}

//create billing subscription 
const createPaypalPlan = async (data, token, productId) => {
    try {
  
        let billingCycles;
        if (data.allowFreeTrial) {
            billingCycles = [
                {
                    "frequency": {
                        "interval_unit": "DAY",
                        "interval_count": data.freeTrialPeriod
                    },
                    "tenure_type": "TRIAL",
                    "sequence": 1,
                    "total_cycles": 1,
                },
                {
                    "frequency": {
                        "interval_unit": data.paymentPeriod,
                        "interval_count": 1
                    },
                    "tenure_type": "REGULAR",
                    "sequence": 2,
                    "total_cycles": 0,
                    "pricing_scheme": {
                        "fixed_price": {
                            "value": data.price,
                            "currency_code": "USD"
                        }
                    }
                }]
        }
        else {
            billingCycles = [{
                "frequency": {
                    "interval_unit": data.paymentPeriod,
                    "interval_count": 1
                },
                "tenure_type": "REGULAR",
                "sequence": 1,
                "total_cycles": 0,
                "pricing_scheme": {
                    "fixed_price": {
                        "value": data.price,
                        "currency_code": "USD"
                    }
                }
            }]
        }

        let plandata = {
            "product_id": productId,
            "name": data.planname,
            "description": data.description,
            "status": "ACTIVE",
            "billing_cycles": billingCycles,
            "payment_preferences": {
                "auto_bill_outstanding": true,
                "setup_fee": { "value": "0", "currency_code": "USD" },
                "setup_fee_failure_action": "CONTINUE",
                "payment_failure_threshold": 2
            }
        }

        const apiUrl = `${process.env.PAYPAL_URL}/v1/billing/plans`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization : `Bearer ${token}`,
            },
            body: JSON.stringify(plandata)
        });

        let res = await response.json();
        return res.id;

    } catch (error) {
        throw error
    }
}

const createStripePrice = async (data, stripe, productId) => {
    try {
      
        const price = await stripe.prices.create({
            currency: 'usd',
            unit_amount: (data.price) * 100,
            recurring: {
                interval: (data.paymentPeriod).toLowerCase(),
            },
            product: productId,
        });

        return price.id;
    } catch (error) {
        throw error
    }
}

//create plan in paypal and stripe
export async function POST(request) {
    try {
        const token = await getToken({ req: request });
        let id = request.nextUrl.searchParams.get("id");
        const plandata = await request.json();

        if (token && token.role == 1) {

            if (id) {
                if (!plandata.allowFreeTrial) {
                    let plan = await subscriptionPlanModel.findById(id);
                    if (plan.freeTrialPeriod) {
                        await subscriptionPlanModel.updateOne({ '_id': id }, { $unset: { 'freeTrialPeriod': '' } })
                    }
                }

                await subscriptionPlanModel.findByIdAndUpdate(id,
                    { $set: plandata });
                return NextResponse.json({ message: "Successfully updated plan.", status: 1 })
            }
            else {
                let isexsist = await subscriptionPlanModel.findOne({ 'planname': plandata.planname })

                if (isexsist) {
                    return NextResponse.json({ message: "Plan already exists.", status: 0 })
                }

                let paypalAccount = await paymentMethodModel.findOne({ 'userId': token.sub, 'paymentMethod': 'paypal','status' : 1 });
                let stripeAccount = await paymentMethodModel.findOne({ 'userId': token.sub, 'paymentMethod': 'stripe','status' : 1});
                if (!paypalAccount && !stripeAccount) {
                    return NextResponse.json({ message: "Integrate atleast one payment account.", status: 0 });
                }
                let paypalplan = {};
                let stripeplan = {};

                if (paypalAccount) {
                    const credentials = `${paypalAccount.publicKey}:${paypalAccount.secretKey}`;
                    const base64Credentials = Buffer.from(credentials).toString('base64');
                    const accessToken = await getAccessToken(base64Credentials);

                    let productId = await createPaypalProduct(plandata, accessToken);

                    let planId = await createPaypalPlan(plandata, accessToken, productId);
                    let webhook = await createWebhookendpoints(accessToken);
                    paypalplan = {
                        productId : productId,
                        planId: planId
                    };

                }
                if (stripeAccount) {
                    const stripe = new Stripe(stripeAccount.secretKey);

                    let endpointUrl = `${process.env.API_URL}webhooks/stripe`
                    const webhookEndpoints = await stripe.webhookEndpoints.list({
                        limit: 1,
                      });
                    let list = webhookEndpoints.data.filter((d1)=>d1.url == endpointUrl)
                    if(list.length == 0)
                    {
                        const webhookEndpoint = await stripe.webhookEndpoints.create({
                            enabled_events: ['*'],
                            url: `${process.env.API_URL}webhooks/stripe`,
                        });
                    }
                    
                    let productId = await createStripeProduct(plandata, stripe);
                    let planId = await createStripePrice(plandata, stripe, productId);
                    stripeplan = {
                        productId: productId,
                        planId: planId,
                    }
                }
                let plan = {
                    ...plandata,
                    paypal: paypalplan ? paypalplan : null,
                    stripe: stripeplan ? stripeplan : null,
                }

                let planddd = await subscriptionPlanModel.create(plan);
         
                return NextResponse.json({ message: "Successfully created plan.", status: 1 })
            }

        }
        return NextResponse.json({ message: "Unauthorized user.", status: 0 })
    } catch (error) {

        return NextResponse.json({ message: error.message, status: 0 })
    }
}

//get the plan list in user and admin section AND get user specific plan

export async function GET(request) {

    try {
        let keyword = await request.nextUrl.searchParams.get('search')
        const token = await getToken({ req: request });

        let islandingpage = await request.nextUrl.searchParams.get('islandingPage');

        if(islandingpage) 
        {
            let plans = await subscriptionPlanModel.find({ 'status' : 1}).sort({ _id: -1 });
            return NextResponse.json({data : plans, status: 1 })
        }

        let planlist;
        if (token && token.role == 1) {
            if (keyword) {
                planlist = await subscriptionPlanModel.find({
                    $or: [
                        { planname: { $regex: keyword, $options: 'i' } },
                        { paymentType: { $regex: keyword, $options: 'i' } }
                    ]
                }).sort({ _id: -1 });
            }
            else {
                planlist = await subscriptionPlanModel.find().sort({ _id: -1 });
            }
            return NextResponse.json({ planlist, status: 1 })
        }
        else if (token && token.role == 0) {

            let user = await userModel.findById(token.sub);
            let userplanid = user.plan;

            let userplandetail;
            if(userplanid)
            {
                userplandetail = await subscriptionPlanModel.findOne({
                    $or: [
                        { 'paypal.planId': userplanid },
                        { 'stripe.planId': userplanid }
                    ]
                }).lean();
                if(!userplandetail)
                {
                    userplandetail = await subscriptionPlanModel.findOne({
                        $or: [
                            { '_id': userplanid },
                            { 'paypal.planId': userplanid },
                            { 'stripe.planId': userplanid }
                        ]
                    }).lean();
                }
            }

            let userplan,userplanMethod;

            if(userplandetail && (userplanid == userplandetail._id))
            {
                userplan = {
                    ...userplandetail,
                    isSubscribed : user.planStatus,
                    isPaymentRequired : user.isPaymentRequired,
                    isadmincreated : true
                }
            }

            if(userplandetail && userplandetail.stripe && (userplanid == userplandetail.stripe.planId))
            {
                userplanMethod = 'stripe';
                let admin = await userModel.findOne({ 'role': 1 });
                let stripeAccount = await paymentMethodModel.findOne({ 'userId': admin._id, 'paymentMethod': 'stripe' });
    
                let isSubscribed = false;
                if (user.plan &&
                    user.currentPeriodEnd &&
                    user.currentPeriodEnd.getTime() + 86_400_000 > Date.now()) {
                    isSubscribed = user.plan &&
                        user.currentPeriodEnd &&
                        user.currentPeriodEnd.getTime() + 86_400_000 > Date.now();
                }
                else{
                    isSubscribed = user.planStatus;
                }
    
                let isCanceled = false;
                if(stripeAccount)
                {
                    const stripe = new Stripe(stripeAccount.secretKey);
                    if (isSubscribed && user.subscriptionId) {
                        const stripePlan = await stripe.subscriptions.retrieve(
                            user.subscriptionId,
                        );
                        isCanceled = stripePlan.cancel_at_period_end;
                    }
                }
    
                userplan = {
                    ...userplandetail,
                    subscriptionId: user.subscriptionId? user.subscriptionId : null,
                    currentPeriodEnd: user.currentPeriodEnd? user.currentPeriodEnd : null,
                    stripeCustomerId: user.customerId? user.customerId : null,
                    isSubscribed,
                    isCanceled,
                }
            }
            else if( userplandetail && userplandetail.paypal && (userplanid == userplandetail.paypal.planId))
            {
                userplanMethod = 'paypal',
                userplan = {
                    ...userplandetail,
                    subscriptionId: user.subscriptionId,
                    currentPeriodEnd: user.currentPeriodEnd,
                    isSubscribed : user.planStatus,
                }
            }
           
            // Find all other plans that do not match the user plan
            if(userplandetail && (userplanid == userplandetail._id))
            {
                planlist = await subscriptionPlanModel.find({
                    'status' : 1,
                    $and: [
                        { '_id': { $ne: userplanid } },
                        { 'paypal.planId': { $ne: userplanid } },
                        { 'stripe.planId': { $ne: userplanid } }
                    ]
                }).sort({ _id: -1 });
            }
            else if(userplanid)
            {
                planlist = await subscriptionPlanModel.find({
                    'status' : 1,
                    $and: [
                        { 'paypal.planId': { $ne: userplanid } },
                        { 'stripe.planId': { $ne: userplanid } }
                    ]
                }).sort({ _id: -1 });
            }
            else{
                planlist = await subscriptionPlanModel.find({
                    'status' : 1
                }).sort({ _id: -1 });
            }
            return NextResponse.json({ planlist, userplan, userplanMethod, status: 1 })
        }
        return NextResponse.json({ message: "Unauthorized User", status: 0 })
    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

export async function PUT(request){
    try{
        const token = await getToken({ req: request });
    
        if(token.role == 1){
          const {id, status} = await request.json();
          let statusval = status ? 1 : 0 ;
          await subscriptionPlanModel.findOneAndUpdate({'_id': id}, {$set :{'status' :statusval}})
          return NextResponse.json({ message: "Successfully updated status.", status: 1 });
        }
    
      }catch(error){
        return NextResponse.json({ message: error.message, status: 1 });
      }
}