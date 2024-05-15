import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import bookingDetailsModel from '@/models/bookings'
import sendEmail from "@/utils/mailer";
import mongoose from "mongoose";
import campaignsModel from "@/models/campaigns";
import campaignDetailModel from "@/models/campaignDetail";
import userModel from "@/models/users";
import emailNotificationModel from "@/models/emailNotification";

//registartions page list of bookings

export async function POST(request) {
  try {
    const token = await getToken({ req: request });
    const data = await request.json();

    let showTrash = data.showTrash ? 1 : 0;
    let getpage = data.page ? data.page : 1;
    let limit = data.listPerPage ? data.listPerPage : 10;
    let campaignType = data.type ? data.type : 'booking';
    let campaignId = data.campaignId ? data.campaignId : null;
    let paymentMode = data.paymentMode ? data.paymentMode : null;
    let user = data.user ? data.user : null;
    let bookingdate = data.date ? data.date : null;
    let paymentStatus = data.paymentStatus ? data.paymentStatus : null;
    let appointmentStatus = (data.appointmentStatus == 0 || data.appointmentStatus == 1) ? data.appointmentStatus : null;

    let where = {};
    where.parentUserId = new mongoose.Types.ObjectId(token.sub);
    if(data.showTrash)
    {
      where.trash = showTrash;
    }
    else{
      where.campaignType = campaignType;
      where.trash = showTrash;
    }

    let campaigndocs = await campaignsModel.find({ 'userId': token.sub, 'type': campaignType, 'trash': 0 });

    let campaignlist = campaigndocs.map((item) => {
      let data = {
        label: item.title,
        value: item._id
      }
      return data;
    })

    if (campaignId) {
      where.campaignId = new mongoose.Types.ObjectId(campaignId);
    }
    if (paymentMode) {
      if (paymentMode == 'free') {
        where["Details.registrationType"] = paymentMode;
      }
      else {
        where["Details.paymentMode"] = paymentMode;
      }
    }
    if (user) {
      where.$or = [
        { "Details.userInfo.Name": { $regex: user, $options: "i" } },
        { "Details.userInfo.Email": { $regex: user, $options: "i" } }
      ];
    }
    if (bookingdate) {
      if (campaignType == 'appointment') {
        where["Details.appointmentDate"] = bookingdate;
      }
      else if (campaignType == 'booking') {
        where["Details.bookingDate"] = bookingdate;
      }
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    if (campaignType == 'appointment' && appointmentStatus != null) {
      where.status = appointmentStatus;
    }

    const page = parseInt(getpage);
    const skip = (page - 1) * parseInt(limit);

    let registrationsDetail = await bookingDetailsModel.aggregate([
      { $match: where },
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaignId',
          pipeline: [
            {
              $project: {
                'title': 1,
                'trash': 1,
              }
            }
          ],
        }
      },
      {
        $unwind: '$campaignId'
      },
      {
        $match: {
          'campaignId.trash': 0
        }
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    let totalregistrations = await bookingDetailsModel.aggregate([
      { $match: where },
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaignId',
          pipeline: [
            {
              $project: {
                'title': 1,
                'trash': 1,
              }
            }
          ],
        }
      },
      {
        $unwind: '$campaignId'
      },
      {
        $match: {
          'campaignId.trash': 0
        }
      },
      { $count: 'totalDocuments' },
    ]);

    const totalRecords = totalregistrations.length > 0 ? totalregistrations[0].totalDocuments : 0;

    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({ registrationsDetail, campaignlist, totalPages, totalRecords, status: 1 });

  }
  catch (error) {
    return NextResponse.json({ message: error.message, status: 0 });
  }
}

//Decline appointment mail 

export async function PUT(request) {

  try {
    const token = await getToken({ req: request })
    const declineReason = await request.json();
    let id = request.nextUrl.searchParams.get("id");

    if (token && token.role == 0) {
      const isExist = await bookingDetailsModel.findOne({ '_id': id });
      
      if (isExist) {
        let booking = await bookingDetailsModel.findByIdAndUpdate(id,
          { $set: { status: 0 } });


        let smtpDetails;
        //get the smtp details 
        let cDetail = await campaignDetailModel.findOne({ 'campaignId': booking.campaignId });
        if (cDetail && cDetail.Details.smtpDetails) {
          smtpDetails = cDetail.Details.smtpDetails;
        }
        else {
          let parentUser = await userModel.findById(booking.parentUserId);

          if (parentUser.smtpDetails) {
            smtpDetails = parentUser.smtpDetails;
          }
        }


        let whereCustom, whereDefault;
        whereCustom = {
          'default': 1, 'emailBy': 0, 'type': 'appointmentDecline'
        }
        whereDefault = {
          'default': 0, 'emailBy': 0, 'type': 'appointmentDecline'
        }
        let emailContent;
        emailContent = await emailNotificationModel.findOne({ ...whereCustom });
        if (!emailContent) {
          emailContent = await emailNotificationModel.findOne({ ...whereDefault });
        }
        let emailDetail = emailContent?.Details;

        let campaignD = await campaignsModel.findById(booking.campaignId).lean();

        await sendEmail({ email: declineReason.userEmail, emailType: 'declineMail', userInfo: declineReason.reason, appointmentDetail: { ...campaignD, ...declineReason.appointmentDetail }, smtpDetails, emailDetail });
        return NextResponse.json({ message: 'Successfully status updated.', status: 1 });
      } else {
        return NextResponse.json({ message: 'Record not found.', status: 0 });
      }
    }
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 });
  }
}

export async function DELETE(request) {
  try {

    let id = request.nextUrl.searchParams.get("id");
    if (id) {
      const isExist = await bookingDetailsModel.findOneAndDelete({ '_id': id });
      return NextResponse.json({ message: "Deleted sucessfully.", status: 1 });
    }
    return NextResponse.json({ message: "Unauthorized user.", status: 0 });
  } catch (error) {
    return NextResponse.json({ message: error.message, status: 0 });
  }
}