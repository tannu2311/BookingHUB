import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import userModel from "@/models/users";
import { getToken } from "next-auth/jwt";

// EDIT/UPDATE USER DETAILS FROM BOTH ADMIN AND USER ROUTE 
export async function PUT(request) {

    try {
        const token = await getToken({ req: request })

        const updateddata = await request.json();
        var hashpass;

        if (updateddata.password && !updateddata.current_password) {
            hashpass = await bcrypt.hash(updateddata.password, 10);
            updateddata.password = hashpass;
        }

        if (token.role == 1) //update by admin
        {
            let id = request.nextUrl.searchParams.get("id");  //if updating user
            if (id) {
                if (updateddata.plan) {
                    if (updateddata.isPaymentRequired == 0) {
                        updateddata.planStatus = true;
                    }
                    else if(updateddata.isPaymentRequired == 1) {
                        updateddata.planStatus = false;
                    }
                }
                await userModel.findByIdAndUpdate(id,
                    { $set: updateddata });
            } else {

                let adminid = token.sub;
                let user = await userModel.findById(adminid);
                if (updateddata?.current_password) {
                    const checkpass = await bcrypt.compare(updateddata.current_password, user.password);
                    if (!checkpass) {
                        return NextResponse.json({ message: "Current Password is wrong.", status: 0 })
                    }
                    hashpass = await bcrypt.hash(updateddata.password, 10);
                    updateddata.password = hashpass;
                    delete updateddata.current_password
                }

                await userModel.findByIdAndUpdate(adminid,
                    { $set: updateddata });
            }
        }
        else if (token.role == 0)  //update by user
        {
            let id = token.sub;
            let user = await userModel.findById(id);

            if (updateddata?.current_password) {
                const checkpass = await bcrypt.compare(updateddata.current_password, user.password);
                if (!checkpass) {
                    return NextResponse.json({ message: "Current Password is wrong.", status: 0 })
                }
                hashpass = await bcrypt.hash(updateddata.password, 10);
                updateddata.password = hashpass;
                delete updateddata.current_password
            }

            await userModel.findByIdAndUpdate(id,
                { $set: updateddata }, { new: true });
        }

        return NextResponse.json({ status: 1, message: 'Profile sucessfully updated.' });

    } catch (error) {
        return NextResponse.json({ status: 0, message: error.message });
    }
}

// GET DETAIL OF SINGLE USER/ADMIN

export async function GET(request) {
    try {
        const token = await getToken({ req: request });
        if (token) {
            const user = await userModel.findById(token.sub).select('-password -smtpDetails');

            return NextResponse.json({ status: 1, user })
        }
        return NextResponse.json({ message: "Unauthorized user", status: 0 });

    } catch (error) {
        return NextResponse.json({ status: 0, message: error.message });
    }
}

//store SMTP details 
export async function POST(request) {

    try {
        let data = await request.json();
        const token = await getToken({ req: request });
        let userid = token.sub;

        if (token) {
            const user = await userModel.findById(userid)
            if (user.smtpDetails) {
                await userModel.findByIdAndUpdate(userid,
                    { $set: { 'smtpDetails': data } })

                return NextResponse.json({ status: 1, message: "Successfully updated SMTP." });
            }
            else {
                user.smtpDetails = data;
                await user.save();

                return NextResponse.json({ status: 1, message: "Successfully added SMTP." });
            }
        }
        else {
            return NextResponse.json({ message: "Unauthorized user", status: 0 });
        }
    }
    catch (error) {
        return NextResponse.json({ status: 0, message: error.message });
    }
}

//get SMTP details 
export async function PATCH(request) {
    try {
        const token = await getToken({ req: request });
        if (token) {
            const usersmtp = await userModel.findById(token.sub).select('smtpDetails');

            return NextResponse.json({ status: 1, data: usersmtp })
        }
        return NextResponse.json({ message: "Unauthorized user", status: 0 });

    } catch (error) {
        return NextResponse.json({ status: 0, message: error.message });
    }
}