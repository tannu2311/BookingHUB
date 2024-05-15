import campaignsModel from "@/models/campaigns";
import userModel from "@/models/users";
import campaignDetailModel from "@/models/campaignDetail";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import subscriptionPlanModel from "@/models/subscriptionPlans";
import bookingDetailsModel from "@/models/bookings";

// move to trash 
export async function GET(request) {
    let id = request.nextUrl.searchParams.get("id");
    let type = request.nextUrl.searchParams.get('type');

    try {
        const token = await getToken({ req: request })
        if (token && token.role == 0) {
            if (type == 'campaign') {
                let campaign = await campaignsModel.findByIdAndUpdate(id,
                    { $set: { 'trash': 1 } });

                return NextResponse.json({ message: "Moved to trash successfully.", status: 1 });
            }
            if (type == 'registration') {
                let booking = await bookingDetailsModel.findByIdAndUpdate(id,
                    { $set: { 'trash': 1 } });
                return NextResponse.json({ message: "Moved to trash successfully.", status: 1 });
            }
        }
        else if (token && token.role == 1) {
            if (type == 'user') {
                let user = await userModel.findByIdAndUpdate(id,
                    { $set: { 'trash': 1 } });

                return NextResponse.json({ message: "Moved to trash successfully.", status: 1 });
            }
        }
        else {
            return NextResponse.json({ message: "Unauthorized user.", status: 0 });
        }

    } catch (error) {

        return NextResponse.json({ message: "Failed to move to trash.", status: 0 });
    }
}

//get the list of trash items 
export async function POST(request) {
    try {
        const data = await request.json();
        const token = await getToken({ req: request });

        let getpage = data.page ? data.page : 1;
        let keyword = data.search ? data.search : '';
        let limit = data.listPerPage ? data.listPerPage : 10;
        let type = data.type;

        if (type == 'campaign') {
            if (token && token.role == 0) {
                const page = parseInt(getpage);
                const skip = (page - 1) * parseInt(limit);
                let where = {
                    userId: token.sub,
                    trash: 1
                }

                let updatedCampaignsList, totalRecords;
                if (keyword) {
                    updatedCampaignsList = await campaignsModel.find({
                        ...where,
                        $or: [
                            { title: { $regex: keyword, $options: 'i' } },
                            { type: { $regex: keyword, $options: 'i' } },
                        ]
                    }).sort({ _id: -1 }).skip(skip).limit(limit);

                    totalRecords = await campaignsModel.countDocuments({
                        ...where,
                        $or: [
                            { title: { $regex: keyword, $options: 'i' } },
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
                        if (detail.Details.currency) {

                            campaign = { ...campaign._doc, currency: detail.Details.currency };
                        }
                        else {
                            campaign = campaign;
                        }
                    }
                    return campaign;
                };

                campaignslist = await Promise.all(updatedCampaignsList.map(fetchCampaignDetails));

                return NextResponse.json({ campaignslist, totalRecords, totalPages, status: 1 })
            }
            return NextResponse.json({ message: "Unauthorized user.", status: 0 })
        }
        else if (type == 'user') {

            if (token && token.role == 1) {
                const page = parseInt(getpage);
                const skip = (page - 1) * parseInt(limit);

                var where = {}
                where.role = 0;
                where.trash = 1;

                let users, totalRecords;

                if (keyword) {
                    users = await userModel.find({
                        ...where,
                        $or: [
                            { firstname: { $regex: keyword, $options: 'i' } },
                            { lastname: { $regex: keyword, $options: 'i' } },
                            { email: { $regex: keyword, $options: 'i' } },
                        ]
                    }).populate({ path: 'plan', select: 'planname' }).sort({ _id: -1 }).skip(skip).limit(limit);

                    totalRecords = await userModel.countDocuments({
                        ...where,
                        $or: [
                            { firstname: { $regex: keyword, $options: 'i' } },
                            { lastname: { $regex: keyword, $options: 'i' } },
                            { email: { $regex: keyword, $options: 'i' } },
                        ]
                    })
                }
                else {
                    users = await userModel.find(where).populate({ path: 'plan', select: 'planname' }).sort({ _id: -1 }).skip(skip).limit(limit);
                    totalRecords = await userModel.countDocuments(where);
                }

                const totalPages = Math.ceil(totalRecords / limit);
                return NextResponse.json({ users, totalRecords, totalPages, status: 1 });
            }
            return NextResponse.json({ message: "Unauthorized user.", status: 0 })
        }

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

// delete trash items 

async function deleteCampaign(id) {
    if (id) {
        const res = await fetch(process.env.API_URL + `/user/campaign?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let ans = await res.json();
    }
}

async function deleteRegistrations(id) {
    if (id) {
        const res = await fetch(process.env.API_URL + `/user/registration?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let ans = await res.json();
    }
}

async function deleteUser(id) {
    if (id) {

        const res = await fetch(process.env.API_URL + `/admin/users?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let ans = await res.json();
    }
}

export async function DELETE(request) {
    try {
        let type = request.nextUrl.searchParams.get('type');
        const token = await getToken({ req: request });
        if (token && token.role == 0) {
            if (type == 'campaign') {

                var where = {}
                where.userId = token.sub;
                where.trash = 1;
                let campaigns = await campaignsModel.find(where);

                for (const campaign of campaigns) {
                    await deleteCampaign(campaign._id);
                }

                return NextResponse.json({ message: "Trash successfully emptied.", status: 1 });
            }
            else if(type == 'registration')
            {
                var where = {}
                where.parentUserId = token.sub;
                where.trash = 1;
                let bookings = await bookingDetailsModel.find(where);

                for (const booking of bookings) {
                    await deleteRegistrations(booking._id);
                }
                return NextResponse.json({ message: "Trash successfully emptied.", status: 1 });
            }
        }
        if (token && token.role == 1) {
            if (type == 'user') {
                var where = {}
                where.role = 0;
                where.trash = 1;
                let users = await userModel.find(where);

                for (const user of users) {
                    await deleteUser(user._id);
                }
                return NextResponse.json({ message: "Trash successfully emptied.", status: 1 });
            }
        }
        else {
            return NextResponse.json({ message: "Unauthorized user.", status: 0 })
        }

    } catch (error) {
        return NextResponse.json({ message: 'Unable to empty trash.', status: 0 });
    }
}

// restore campaign / users 
export async function PUT(request) {

    let data = await request.json();

    let id = data.id;
    let type = data.type;

    try {
        const token = await getToken({ req: request })
        if (token && token.role == 0) {
            if (type == 'campaign') {

                let user = await userModel.findOne({ '_id': token.sub, 'role': 0 });
                let noOfCampaigns;
                if (user) {
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
                    noOfCampaigns = (userplandetail) ? userplandetail.noOfCampaigns : 0;
                }

                let userCampaignCount = await campaignsModel.countDocuments({ 'userId': token.sub, 'trash': 0 });
                if (userCampaignCount >= noOfCampaigns) {
                    return NextResponse.json({ message: `You already have ${userCampaignCount} campaigns as per your plan.`, status: 0 });
                }

                let campaign = await campaignsModel.findByIdAndUpdate(id,
                    { $set: { 'trash': 0 } });

                return NextResponse.json({ message: "Restored from trash successfully.", status: 1 });
            }
            else if (type == 'registration') {
                let campaign = await bookingDetailsModel.findByIdAndUpdate(id,
                    { $set: { 'trash': 0 } });

                return NextResponse.json({ message: "Restored from trash successfully.", status: 1 });
            }
        }
        else if (token && token.role == 1) {
            if (type == 'user') {

                let user = await userModel.findByIdAndUpdate(id,
                    { $set: { 'trash': 0 } });

                return NextResponse.json({ message: "Restored from trash successfully.", status: 1 });
            }
        }
        else {
            return NextResponse.json({ message: "Unauthorized user.", status: 0 });
        }

    } catch (error) {
        return NextResponse.json({ message: "Failed to restore from trash.", status: 0 });
    }
}