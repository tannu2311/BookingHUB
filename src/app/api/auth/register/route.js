import userModel from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { getToken } from "next-auth/jwt";
import sendEmail from "@/utils/mailer";
import emailNotificationModel from "@/models/emailNotification";

export async function POST(request) {

    let data = await request.json();
    let usermail = data.email;

    try {
        let existinguser = await userModel.findOne({ 'email': usermail });
        if (existinguser && (existinguser.role == 1 || existinguser.role == 0)) {
            return NextResponse.json({ message: "User Already Exist", status: 0 })
        }
        const token = await getToken({ req: request });

        let newuser;
        let password = data.password;
        let hashpass = await bcrypt.hash(password, 10);

        // IF ADMIN CREATE A USER
        if (token) {
            if (token.role == 1) {
                newuser = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    password: hashpass,
                    planStatus: 0,
                    status: data.status,
                }
                if (data.plan) {
                    newuser.plan = data.plan;
                    newuser.isPaymentRequired = data.isPaymentRequired;
                    if (data.isPaymentRequired == 0) {
                        newuser.planStatus = true;
                    }
                    if (data.isPaymentRequired == 1) {
                        newuser.planStatus = false;
                    }
                }

                let saveduser = await userModel.create(newuser);

                if (data.sendemail == true) {
                    let admin = await userModel.findById(token.sub);
                    let smtpDetails = admin.smtpDetails;
                
                    newuser.password = password;
                    let whereCustom, whereDefault;
                    whereCustom = {
                        'default': 1, 'emailBy': 1, 'type': 'accountCreation'
                    }
                    whereDefault = {
                        'default': 0, 'emailBy': 1, 'type': 'accountCreation'
                    }
                    let emailContent;
                    emailContent = await emailNotificationModel.findOne({ ...whereCustom });
                    if (!emailContent) {
                        emailContent = await emailNotificationModel.findOne({ ...whereDefault });
                    }
                    let emailDetail = emailContent?.Details;
                    await sendEmail({ email: saveduser.email, emailType: 'accountCreation', userInfo: newuser, smtpDetails, emailDetail });
                    return NextResponse.json({ message: "User added successfully, an email has been sent on user's mailid.", status: 1 })
                }

                return NextResponse.json({ message: "User added successfully.", status: 1 })
            } else {
                return NextResponse.json({ message: "Unauthorized user.", status: 1 })
            }
        }
        else {
            // NEW USER REGISTER
            let planId = request.nextUrl.searchParams.get("planId");

            if(planId)
            {
                newuser = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    password: hashpass,
                    plan : planId,
                    isPaymentRequired : 1,
                    planStatus : false
                }
            }
            else{
                newuser = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    password: hashpass,
                }
            }

            let saveduser = await userModel.create(newuser);
            let loginuser = {
                id : saveduser._id,
                email : saveduser.email
            }
            return NextResponse.json({ message: "Congrats! your account is created successfully.",user : loginuser, status: 1 })
        }


    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }

}