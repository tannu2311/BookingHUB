import paymentMethodModel from "@/models/paymentMethods";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import campaignDetailModel from "@/models/campaignDetail";
import Stripe from "stripe";
import { getAccessToken } from "@/utils/backendhelper";

export async function GET(request) {
  try {
    const token = await getToken({ req: request });
    let keyword = await request.nextUrl.searchParams.get('search');

    let accountList;
    if (keyword) {
      accountList = await paymentMethodModel.find({
        userId: token.sub,
        paymentMethod: { $regex: new RegExp(keyword, 'i') },
      }).select('accountId _id').sort({ _id: -1 });

    }
    else {
      let updating = await paymentMethodModel.find({ 'userId': token.sub }).sort({ _id: -1 });

      updating.map(async (acc) => {
        let campaignlist = acc.campaigns;

        for (let i = 0; i < campaignlist.length; i++) {
          let camp = campaignlist[i];
          let cam = await campaignDetailModel.findOne({ 'campaignId': camp.id });

          if (cam) {
            if (acc.paymentMethod === 'paypal') {

              if (!acc._id.equals(cam.Details.paymentAccountId.paypal)) {
                let aa = await paymentMethodModel.updateOne(
                  { '_id': acc._id },
                  { $pull: { campaigns: { id: camp.id } } }
                );
              }
            }

            if (acc.paymentMethod === 'stripe') {

              if (!(acc._id.equals(cam.Details.paymentAccountId.stripe))) {

                let aa = await paymentMethodModel.updateOne(
                  { '_id': acc._id },
                  { $pull: { campaigns: { id: camp.id } } },
                  { new: true }
                );
              }
            }
          }
        }
      });
      accountList = await paymentMethodModel.find({ 'userId': token.sub }).sort({ _id: -1 });

    }
    return NextResponse.json({ accountList, status: 1 })

  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 })
  }
}


//User payment account Integretion
export async function POST(request) {
  try {

    const token = await getToken({ req: request });
    const userId = token.sub;
    const { paymentMethod, publicKey, secretKey, status, accountId, } = await request.json();

    if (paymentMethod == 'paypal') {

      const credentials = `${publicKey}:${secretKey}`;
      const base64Credentials = Buffer.from(credentials).toString('base64');
      const accessToken = await getAccessToken(base64Credentials);

      let checkurl = `${process.env.PAYPAL_URL}/v1/identity/openidconnect/userinfo?schema=openid`;
      const isvalid = await fetch(checkurl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      if (!isvalid.ok) {
        return NextResponse.json({ message: "Invalid account credentials.", status: 0 })
      }
    }
    else if (paymentMethod == 'stripe') {

      try {
        const stripe = new Stripe(secretKey);
        const account = await stripe.accounts.retrieve(accountId);
        const isValidPublicKey = (key) => /^pk_test_/.test(key) || /^pk_live_/.test(key);
        if (!isValidPublicKey(publicKey)) {
          return NextResponse.json({ message: "Invalid account credentials.", status: 0 })
        }
      }
      catch (error) {
        return NextResponse.json({ message: "Invalid account credentials.", status: 0 })
      }
    }


    let id = request.nextUrl.searchParams.get("id");
    if (id) {
      await paymentMethodModel.findOneAndUpdate({ accountId }, { paymentMethod, publicKey, secretKey, userId });
      return NextResponse.json({ message: "Successfully updated account.", status: 1 })
    }
    else {

      const existingPaymentMethod = await paymentMethodModel.findOne({ accountId });

      if (existingPaymentMethod && existingPaymentMethod.userId == token.sub) {
        return NextResponse.json({ message: "Account already exist.", status: 0 })
      }
      else {
       let sss =  await paymentMethodModel.create({ paymentMethod, publicKey, secretKey,status, accountId, userId });
   
        return NextResponse.json({ message: "Successfully added account.", status: 1 });
      }
    }
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 })
  }
}

//DELETE Payment Account
export async function DELETE(request) {

  let id = request.nextUrl.searchParams.get("id");
  try {
    const token = await getToken({ req: request })
    if (token) {
      await paymentMethodModel.findByIdAndDelete(id);
      return NextResponse.json({ message: "Deleted sucessfully", status: 1 });
    }
    return NextResponse.json({ message: "Unauthorized user", status: 0 });

  } catch (error) {
    return NextResponse.json({ message: "Failed to delete", status: 0 });
  }
}

export async function PUT(request){
  try{
    const token = await getToken({ req: request });

    if(token.role == 1){
      const {id, status} = await request.json();
      let statusval = status ? 1 : 0 ;
      
      await paymentMethodModel.findOneAndUpdate({'_id': id}, {$set :{'status' :statusval}})
      return NextResponse.json({ message: "Successfully updated payment status.", status: 1 });
    }
    

  }catch{

  }
}
