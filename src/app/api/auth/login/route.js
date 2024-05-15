import userModel from "@/models/users";
import { NextResponse } from "next/server";
import subscriptionPlanModel from "@/models/subscriptionPlans";
import bcrypt from 'bcryptjs';

export async function POST(request) {

    let { email, password } = await request.json();
    try {
        let where = {};
        where.email = email;
        where.role = 0;

        let user
        user = await userModel.findOne(where);
        if (!user) {
            let where = {};
            where.email = email;
            where.role = 1;
            user = await userModel.findOne(where);
        }

        if (user) {
            const checkpass = await bcrypt.compare(password, user.password);
            if (!checkpass) {
                return NextResponse.json({ message: "Invalid credentials.", status: 0 })
            }

            let userplandetail
            if (user.plan) {
                userplandetail = await subscriptionPlanModel.findOne({
                    $or: [
                        { 'paypal.planId': user.plan },
                        { 'stripe.planId': user.plan }
                    ]
                });
                if (!userplandetail) {
                    userplandetail = await subscriptionPlanModel.findOne({
                        $or: [
                            { '_id': user.plan },
                            { 'paypal.planId': user.plan },
                            { 'stripe.planId': user.plan }
                        ]
                    });
                }
            }

            let noOfCampaigns = (userplandetail) ? userplandetail.noOfCampaigns : 0;

            const userInfo = {
                id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                planStatus: user.planStatus,
                plan: user.plan,
                noOfCampaigns: noOfCampaigns
            }

            return NextResponse.json({ message: "Login successful.", status: 1, userInfo })
        }
        else {
            return NextResponse.json({ message: "Invalid credentials.", status: 0 })
        }

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

