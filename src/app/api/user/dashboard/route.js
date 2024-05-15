import userModel from "@/models/users";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import campaignsModel from "@/models/campaigns";
import bookingDetailsModel from '@/models/bookings'
import mongoose from "mongoose";

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const token = await getToken({ req: request });
    if (token && token.role == 0) {

      let parentuser = new mongoose.Types.ObjectId(token.sub);

      // Total Campaigns 
      let where = {}
      where.userId = token.sub;
      where.trash = 0;
      let totalCampaigns = 0;
      totalCampaigns = await campaignsModel.countDocuments(where);

      // Total Bookings 
      let Bookingcount = await campaignsModel.aggregate([
        {
          $match: { userId: parentuser, trash: 0 }
        },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: '$noOfBookings' }
          }
        }
      ])
      const totalBookings = (Bookingcount && Bookingcount[0] && Bookingcount[0].totalBookings) ? Bookingcount[0].totalBookings : 0;

      //Total Customers

      let Customerscount = await bookingDetailsModel.aggregate([
        {
          $match: {
            parentUserId: parentuser,
          }
        },
        {
          $group: {
            _id: "$parentUserId",
            uniqueVisitors: { $addToSet: "$visitorId" }
          }
        },
      ])

      const totalCustomers = (Customerscount && Customerscount[0] && Customerscount[0].uniqueVisitors.length) ? Customerscount[0].uniqueVisitors.length : 0;

      return NextResponse.json({ totalCampaigns, totalCustomers, totalBookings, status: 1 });
    }

    return NextResponse.json({ message: 'Unauthorized user', status: 0 });
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 })
  }
}

export async function POST(request) {
  try {
    let data = await request.json();
    let id = data.id;
    let date = new Date(data.date);


    const token = await getToken({ req: request });
    if (token && token.role == 0) 
    {
      let bookingData = await bookingDetailsModel.findByIdAndUpdate(id,
        { $set: {'paymentStatus': 'paid','Details.paymentDate' : date,'Details.paymentTime' : data.time,'Details.paymentRemark' : data.remark} },
        {new : true});
         
        let campaignId = bookingData.campaignId;

        let campaign = await campaignsModel.findById(campaignId);

        let earning = (parseFloat(campaign.totalEarnings) || 0) + parseFloat(bookingData.Details.amount);
  
        campaign.totalEarnings = parseFloat(earning.toFixed(2));
        await campaign.save();

        return NextResponse.json({ message: "Payment status updated sucessfully.", status: 1})
    }

  } 
  catch (error) {
    return NextResponse.json({ message: error.message, status: 0 })
  }
}