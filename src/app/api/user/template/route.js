import { NextResponse } from "next/server";
import templateModel from "@/models/template";

export const dynamic = 'force-dynamic'

export async function GET(request) {
    try {

            let type = request.nextUrl.searchParams.get("type");
 
            if (type) {
               const templateList = await templateModel.find({ 'campaign_type': type });
               return NextResponse.json({ templateList, status: 1 })
            
            }
            return NextResponse.json({ message :" Invalid campaign type.", status: 0 })

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}