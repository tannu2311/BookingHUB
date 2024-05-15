import { NextResponse } from "next/server";
import paymentMethodModel from "@/models/paymentMethods";
import Stripe from "stripe";
import userModel from "@/models/users";
import { getAccessToken } from "@/utils/backendhelper";

export async function GET(request) {
  try {
    let type = request.nextUrl.searchParams.get("payType");
    let payid = request.nextUrl.searchParams.get("payid");

    if (type == 'stripe') {
      let clientSecret = request.nextUrl.searchParams.get("clientSecret");
      let cDetail = await paymentMethodModel.findOne({ '_id': payid });

      const stripe = new Stripe(cDetail.secretKey);

      const session = await stripe.checkout.sessions.retrieve(clientSecret);
      const invoice = await stripe.invoices.retrieve(session.invoice);

      const status = invoice.status_transitions.paid_at;
      let date = new Date(status * 1000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      date = day + `-` + month + `-` + year;

      let responseData = {
        invoiceNumber: invoice.number,
        name: invoice.customer_name,
        email: invoice.customer_email,
        paymentDate: date,
        price: invoice.amount_paid / 100,
        currency: session.currency,
        status: session.payment_status
      }
      return NextResponse.json({ payData: responseData, status: 1 })
    }
    else if (type == 'paypal') {
      let cDetail = await paymentMethodModel.findOne({ '_id': payid });
      return NextResponse.json({ clientId: cDetail.publicKey, status: 1 })
    }

  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 })
  }
}

//stripe checkout flow 
export async function POST(request) {
  try {
    const { total, payid, currency, email } = await request.json();

    let cDetail = await paymentMethodModel.findOne({ '_id': payid });

    const stripe = new Stripe(cDetail.secretKey);

    const amt = parseFloat(total);
    if (isNaN(amt)) {
      return NextResponse.json({ message: 'Invalid price: NaN' });
    }

    const checkoutsession = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      invoice_creation: {
        enabled: true,
      },
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: currency,
            unit_amount: amt * 100,
            product_data: {
              name: amt,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });
    let clientSecret = checkoutsession.client_secret;
    let publicKey = cDetail.publicKey;

    return NextResponse.json({ clientSecret, publicKey });

  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}

//from subscription store stripe payment 
export async function PUT(request) {
  try {
    const id = await request.json();

    let admin = await userModel.findOne({ 'role': 1 });

    let accountDetail = await paymentMethodModel.findOne({ 'userId': admin._id, 'paymentMethod': 'stripe' });

    const stripe = new Stripe(accountDetail.secretKey);

    const session = await stripe.checkout.sessions.retrieve(id);

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription,
    );

    let userforcancel = await userModel.findOne(
      {
        'email': session.customer_email,
      })

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

    let user = await userModel.findOneAndUpdate(
      {
        'email': session.customer_email,
      },
      {
        $set: {
          'plan': subscription.items.data[0].price.id,
          'subscriptionId': subscription.id,
          'planStatus': true,
          'customerId': subscription.customer,
          'currentPeriodEnd': new Date(
            subscription.current_period_end * 1000,
          ),
        }
      }, { new: true });


    return NextResponse.json({ message: "Successfully subscribed.", status: 1 });

  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 });
  }
}