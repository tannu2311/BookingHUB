import { NextResponse } from "next/server";
import sendEmail from "@/utils/mailer";
import bcrypt from 'bcryptjs';
import userModel from "@/models/users";
import emailNotificationModel from "@/models/emailNotification";

export async function GET(request)
{
    let email = await request.nextUrl.searchParams.get('email');

    try {
        let user;
         user = await userModel.findOne({ 'email' : email,'role' :  0 });
          
        if(!user)
        {
            user = await userModel.findOne({ 'email' : email,'role' :  1 });
            if(!user)
            {
                return NextResponse.json({message : "Invalid email id.", status : 0})
            }
        }
        let userName ={firstname: user.firstname ,lastname:user.lastname};
        let id = user._id;
        //get the smtp details of admin
        let admin = await userModel.findOne({'role' : 1});
        let smtpDetails = admin.smtpDetails;
        let  whereCustom, whereDefault;
        whereCustom = {
            'default': 1, 'emailBy': 1 ,'type':'resetpassword'
         }
         whereDefault = {
           'default': 0, 'emailBy': 1,'type':'resetpassword'
         }
         let emailContent;
          emailContent = await emailNotificationModel.findOne({ ...whereCustom});
         if(!emailContent){
            emailContent = await emailNotificationModel.findOne({ ...whereDefault});
         }
        let emailDetail = emailContent?.Details; 

        let res = await sendEmail({email,emailType : 'RESET',userInfo : id,smtpDetails ,emailDetail,userName});

        return NextResponse.json({message : "Email has been sent for password reset, check inbox.", status : 1});
    } catch (error) {
        return NextResponse.json({message : error.message, status : 0});
    }
}

export async function POST(request)
{
    const reqbody = await request.json();
    const token = reqbody;

    try {

        let user = await userModel.findOne({ 'forgotPasswordToken': { $ne: null, $eq: token } })
        
        if(!user)
        {
            return NextResponse.json({ status : 0 });
        }

        if (user.forgotPasswordTokenExpiry <= Date.now()) 
        {
            user.forgotPasswordToken = undefined;
            user.forgotPasswordTokenExpiry = undefined;
            await user.save();
            return NextResponse.json({status: 0 });
        }

        return NextResponse.json({status : 1});
        
    } catch (error) {
        return NextResponse.json({message : error.message, status : 0})
    }
}

export async function PUT(request)
{
    let { password,token } = await request.json();

    try {

        let user = await userModel.findOne({'forgotPasswordToken' : token})

        if(!user)
        {
            return NextResponse.json({status : 0 });
        }

        if (user.forgotPasswordTokenExpiry <= Date.now()) 
        {
            user.forgotPasswordToken = undefined;
            user.forgotPasswordTokenExpiry = undefined;
            await user.save();
            return NextResponse.json({status: 0 });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        user.password = hashedpassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({status : 1});
        
    } catch (error) {
        return NextResponse.json({message : error.message, status : 0})
    }

}