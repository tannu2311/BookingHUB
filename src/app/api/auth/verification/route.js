import userModel from "@/models/users";
import sendEmail from "@/utils/mailer";
import { NextResponse } from "next/server";
import campaignDetailModel from "@/models/campaignDetail";
import campaignsModel from "@/models/campaigns";
import emailNotificationModel from "@/models/emailNotification";

export async function POST(request) {
    const data = await request.json();
    let otp = data.otp;
    let userid = data.userId;

    try {

        let user = await userModel.findOne({'_id':userid, 'verificationOtp': otp})
    
        if (!user) {
            return NextResponse.json({ message: 'Incorrect OTP entered.', status: 0, error : 1});
        }

        if(user.verificationOtpExpiry < Date.now())
        {
            user.verificationOtp = undefined;
            user.verificationOtpExpiry = undefined;
            return NextResponse.json({ message: 'OTP has expired. Please try resend OTP.', status: 0, error : 2 });
        }

        user.verified = 1;
        user.verificationOtp = undefined;
        user.verificationOtpExpiry = undefined;

        await user.save();

        return NextResponse.json({ message: 'Email verified sucessfully.', status: 1, userId : user._id });

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 500 })
    }
}

export async function GET(request) {
    let uemail = request.nextUrl.searchParams.get("email");
    let ulevel = request.nextUrl.searchParams.get('role');
    let campaignId = request.nextUrl.searchParams.get('campaignId');
   
    let smtpDetails;
    let cDetail = await campaignDetailModel.findOne({ 'campaignId': campaignId });
    if(cDetail && cDetail.Details.smtp_type == 'campaign' && cDetail.Details.smtpDetails)
    {
       smtpDetails = cDetail.Details.smtpDetails
    }
    else{
        let campaign = await campaignsModel.findById(campaignId);
      
        let parentUser = await userModel.findById(campaign.userId);
       
        if(parentUser.smtpDetails)
        {
            smtpDetails = parentUser.smtpDetails;
        }
    }

    try {
        const userExsist = await userModel.findOne({ 'email': uemail });
        let userId ;
       
        if (userExsist && userExsist.verified == 1) {
            return NextResponse.json({ message: "Verified", status: 1, verified: 1,userId : userExsist._id });
        }
        else if(userExsist)
        {
            userId = userExsist._id;
        }
       else{
           if (ulevel == 2) {
               let newVisitor = {
                   email: uemail,
                   role: 2,
               }
               let saveduser = await userModel.create(newVisitor);
               userId = saveduser._id;
           }
       }
       let  whereCustom, whereDefault;
       whereCustom = {
            'default': 1, 'emailBy': 0 ,'type':'visitorMailVerify'
         }
         whereDefault = {
           'default': 0, 'emailBy': 0,'type':'visitorMailVerify'
         }
         let emailContent;
          emailContent = await emailNotificationModel.findOne({ ...whereCustom});
         if(!emailContent){
            emailContent = await emailNotificationModel.findOne({ ...whereDefault});
         }
        let emailDetail = emailContent?.Details; 
        await sendEmail({ email: uemail, emailType: 'VERIFY', userInfo: userId,smtpDetails ,emailDetail});

        return NextResponse.json({ message: "Verification mail has been sent, check inbox.", status: 1, verified: 0, userId : userId});
    } catch (error) {
        return NextResponse.json({ status: 0, message: error.message });
    }
}