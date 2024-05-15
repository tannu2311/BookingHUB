import subscriptionPlanModel from "@/models/subscriptionPlans";
import userModel from "@/models/users";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = 'force-dynamic'

export async function GET(request) {
    try {
        const token = await getToken({ req: request });
        if (token && token.role == 1) {
            let where = {}
            where.role = 0;
            where.trash = 0;
            const totalUsers = await userModel.countDocuments(where);
            const totalPlans = await subscriptionPlanModel.countDocuments();
            return NextResponse.json({ totalPlans, totalUsers, status: 1 });
        }
        return NextResponse.json({ message : 'Unauthorized user', status: 0 });
    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}