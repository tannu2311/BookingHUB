import campaignsModel from "@/models/campaigns";
import campaignDetailModel from "@/models/campaignDetail";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import paymentMethodModel from "@/models/paymentMethods";
import bookingDetailsModel from "@/models/bookings";
import bookedSlotsTrackModel from "@/models/bookedSlotsTrack";
import imageModel from "@/models/roomImages";

export async function POST(request) {

    try {
        const token = await getToken({ req: request })

        const campaignsdata = await request.json();

        if (token && token.role == 0) {
            let id = request.nextUrl.searchParams.get("id");

            if (id) {
                let campaign = await campaignsModel.findByIdAndUpdate(id,
                    { $set: campaignsdata });
                return NextResponse.json({ id: campaign._id, status: 1 })
            }
            else {
                campaignsdata.userId = token.sub;
                let campaign = await campaignsModel.create(campaignsdata);
                return NextResponse.json({ id: campaign._id, status: 1 })
            }
        }
        return NextResponse.json({ message: "Unauthorized User", status: 0 })
    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

// To store whole details of campaign
export async function PUT(request) {
    try {
        const token = await getToken({ req: request })

        const campaigndetails = await request.json();

        let id = request.nextUrl.searchParams.get("id");
        if (token && token.role == 0 && id) {
            let campaign = await campaignsModel.findOne({ '_id': id });

            if (campaign) {
                // in case someone deletes their integrated payment method, and if that payment account is associated with campaigns,
                if (campaigndetails.paymentMethod) {
                    (campaigndetails.paymentMethod).map(async (method) => {
                        if (method === 'paypal' || method === 'stripe') {
                            let payid = (method === 'stripe') ? campaigndetails.paymentAccountId.stripe : campaigndetails.paymentAccountId.paypal;
                            let campaignsOfPaymentMethod = {
                                id: campaign._id,
                                name: campaign.title,
                            };
                            let payMethod = await paymentMethodModel.findOneAndUpdate(
                                { '_id': payid, 'campaigns': { $not: { $elemMatch: { id: campaign._id } } } },
                                { $push: { campaigns: campaignsOfPaymentMethod } },
                                { new: true }
                            );
                        }
                    })
                }

                if (campaign.type == 'appointment') {
                    (campaigndetails.staff) && (campaigndetails.staff).map((item, i) => {
                        if (!item.id) { item.id = item.name + `-` + i };
                    })
                }
                else if (campaign.type == 'booking' && (campaigndetails.reservationType)) {
                    if (campaigndetails.reservationType == 'seat') {
                        (campaigndetails.seats).map((item, i) => {
                            if (!item.id) { item.id = item.name + `-` + i };
                        })
                    } else if (campaigndetails.reservationType == 'table') {
                        (campaigndetails.tables).map((item, i) => {
                            if (!item.id) { item.id = item.name + `-` + i };
                        })
                    } else if (campaigndetails.reservationType == 'room') {
                        (campaigndetails.rooms).map((item, i) => {
                            if (!item.id) { item.id = item.name + `-` + i };
                        })
                    }
                }

                let isexist = await campaignDetailModel.findOne({ 'campaignId': id });
                const data = {
                    campid: campaign._id,
                    campType: campaign.type,
                }
                if (isexist) {

                    if (campaign.type == 'event') {
                        (campaigndetails.ticket) && (campaigndetails.ticket).map((item, i) => {
                            if (item.id) {
                                const existingItem = (isexist && isexist.Details && isexist.Details.ticket) ?
                                    isexist.Details.ticket.find(existingItem => existingItem.id === item.id) : null;
                                item.booked = existingItem ? existingItem.booked : 0;
                            }
                            else {
                                item.booked = 0;
                                item.id = item.title + `-` + i;
                            }
                        })
                    }

                    isexist.Details = {
                        ...isexist.Details,
                        ...campaigndetails
                    };

                    await isexist.save();
                    return NextResponse.json({ message: "Successfully updated campaign.", status: 1, data })
                }
                else {
                    if (campaign.type == 'event') {
                        (campaigndetails.ticket) && (campaigndetails.ticket).map((item, i) => {
                            item.id = item.title + `-` + i;
                            item.booked = 0;
                        })
                    }

                    let saveCampaign = {
                        'campaignId': id,
                        'Details': campaigndetails,
                    };

                    await campaignDetailModel.create(saveCampaign);

                    return NextResponse.json({ data, message: "Successfully created campaign.", status: 1 })
                }
            }
            else {
                return NextResponse.json({ message: "First save step1.", status: 0 })
            }
        }
        return NextResponse.json({ message: "Unauthorized user.", status: 0 })
    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

export async function GET(request) {
    try {
        const token = await getToken({ req: request })

        if (token && token.role == 0) {
            let id = request.nextUrl.searchParams.get("id");

            if (id) {
                let campaign = await campaignsModel.findById(id);
                let campaignDetail = await campaignDetailModel.findOne({ 'campaignId': id }).populate('campaignId');

                if (campaignDetail) {
                    return NextResponse.json({ campaignDetail, status: 1 })
                }
                else {
                    campaignDetail = campaign;
                    return NextResponse.json({ campaignDetail, status: 1 })
                }
            }
            else {
                let keyword = await request.nextUrl.searchParams.get('search');
                let limit = await request.nextUrl.searchParams.get('row');
                let getpage = await request.nextUrl.searchParams.get('page');

                const page = parseInt(getpage);
                const skip = (page - 1) * parseInt(limit);
                let where = {
                    userId: token.sub,
                    trash: 0
                }

                let updatedCampaignsList, totalRecords;
                if (keyword) {
                    updatedCampaignsList = await campaignsModel.find({
                        ...where,
                        $or: [
                            { title: { $regex: keyword, $options: 'i' } },
                            { business: { $regex: keyword, $options: 'i' } },
                            { type: { $regex: keyword, $options: 'i' } },
                        ]
                    }).sort({ _id: -1 }).skip(skip).limit(limit);

                    totalRecords = await campaignsModel.countDocuments({
                        ...where,
                        $or: [
                            { title: { $regex: keyword, $options: 'i' } },
                            { business: { $regex: keyword, $options: 'i' } },
                            { type: { $regex: keyword, $options: 'i' } },
                        ]
                    })
                }
                else {
                    updatedCampaignsList = await campaignsModel.find(where).sort({ _id: -1 }).skip(skip).limit(limit);
                    totalRecords = await campaignsModel.countDocuments(where);
                }
                const totalPages = Math.ceil(totalRecords / limit);

                let campaignslist;


                //to add currency symbol (will change later)
                const fetchCampaignDetails = async (campaign) => {
                    let detail = await campaignDetailModel.findOne({ 'campaignId': campaign._id });

                    if (detail && detail.Details) {
                        if (detail.Details.headline) {
                            campaign = { ...campaign._doc, isCompleted: true };

                            if (detail.Details.currency) {
                              campaign.currency = detail.Details.currency;
                            }
                        }
                        else if (detail.Details.currency) {
                            campaign = { ...campaign._doc, currency: detail.Details.currency };
                        }
                        else {
                            campaign = campaign;
                        }
                    }
                    return campaign;
                };


                campaignslist = await Promise.all(updatedCampaignsList.map(fetchCampaignDetails));
                let userCampaignCount = await campaignsModel.countDocuments(where);

                return NextResponse.json({ campaignslist, totalRecords, totalPages, userCampaignCount, status: 1 })
            }
        }
        return NextResponse.json({ message: "Unauthorized user.", status: 0 })

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

export async function DELETE(request) {

    let id = request.nextUrl.searchParams.get("id");
    try {
        let campaign = await campaignsModel.findById(id);

        let campaigndetails = await campaignDetailModel.findOne({ 'campaignId': id });
        await imageModel.deleteMany({ 'campaignId': id });

        if (campaigndetails) {
            campaigndetails = await campaignDetailModel.findOneAndDelete({ 'campaignId': id });
            if (campaigndetails.Details.paymentMethod) {
                (campaigndetails.Details.paymentMethod).map(async (method) => {
                    if (method === 'paypal' || method === 'stripe') {
                        let payid = (method === 'stripe') ? campaigndetails.Details.paymentAccountId.stripe : campaigndetails.Details.paymentAccountId.paypal;

                        let payMethod = await paymentMethodModel.findOneAndUpdate(
                            { '_id': payid },
                            { $pull: { campaigns: { id: campaign._id } } },
                            { new: true }
                        );
                    }
                })
            }
        }

        //delete its bookingdetails and slots 
        let ashd = await bookingDetailsModel.deleteMany({ 'campaignId': id });
        let asd = await bookedSlotsTrackModel.deleteMany({ 'campaignId': id });

        await campaignsModel.findByIdAndDelete(id);

        return NextResponse.json({ message: "Deleted sucessfully.", status: 1 });

    } catch (error) {
        return NextResponse.json({ message: "Failed to delete.", status: 0 });
    }
}
