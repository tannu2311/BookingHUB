import campaignDetailModel from "@/models/campaignDetail";
import { NextResponse } from "next/server";
import bookingDetailsModel from '@/models/bookings'
import bookedSlotsTrackModel from "@/models/bookedSlotsTrack";
import campaignsModel from "@/models/campaigns";
import connectToDatabase from "@/utils/dbconfig";
import templateModel from "@/models/template";
import sendEmail from "@/utils/mailer";
import emailNotificationModel from "@/models/emailNotification";
import userModel from "@/models/users";
import mongoose from "mongoose";

connectToDatabase();

//add to autoresponder subscriber
async function subscribe(autoresponder, data) {

    try {
        let response = await fetch(`${process.env.APP_URL}/api/autoresponder?Autoresponder=${autoresponder}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
        let res = await response.json();

        return res;
    } catch (error) {
        return error;
    }
}

export async function GET(request) {
    try {
        let id = request.nextUrl.searchParams.get("id");
        let type = request.nextUrl.searchParams.get("type");

        let campaign = await campaignsModel.findById(id);

        let campaignIntrash = campaign.trash;
        let user = await userModel.findOne({ '_id': campaign.userId });

        let userIntrash = user.trash;

        let isSubscribed = false;
        if (user.plan &&
            user.planStatus) {
            isSubscribed = user.planStatus
        };

        let cDetail = await campaignDetailModel.findOne({ 'campaignId': id }).select('-campaignId -createdAt -updatedAt').populate('campaignId');
        if (isSubscribed) {
            if (cDetail && (!campaignIntrash && !userIntrash)) {
                let campaignDetail = cDetail.Details;
                campaignDetail.campaignID = cDetail.campaignId;

                let templateId = cDetail.Details.template_id;
                let template = await templateModel.findById(templateId).select('style template_name');

                return NextResponse.json({ campaignDetail, template, status: 1 })
            }
            else {
                return NextResponse.json({ message: 'No details Found', status: 0 })
            }
        } else {
            return NextResponse.json({ message: 'No details Found', status: 0 })
        }


    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

//save final data
export async function POST(request) {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let detail = await request.json();
        let id = detail.campaignID;
        let type = detail.campaignType;
        let visitorId = detail.visitorId;
        let data = detail.bookingDetails;

        let campaign = await campaignsModel.findOne({ '_id': id });
        let userId = campaign.userId;

        let cDetail = await campaignDetailModel.findOne({ 'campaignId': id });
        let campaignDetail = cDetail.Details;

        //to keep track of booked slots / seats,table, rooms / tickets
        if (type == 'appointment') {
            if (data.registrationType && data.registrationType == 'free') {
                let alreadyhave = await bookingDetailsModel.findOne({ 'visitorId': visitorId, 'campaignId': id, 'Details.appointmentDate': data.appointmentDate });

                if (alreadyhave) {
                    return NextResponse.json({ message: "You already have an appointment for this day.", status: 0 })
                }
            }
            let appointmentDate = new Date(data.appointmentDate);
            if (data.staff) {
                let appointmentData = await bookedSlotsTrackModel.findOneAndUpdate(
                    { 'campaignId': id, 'date': appointmentDate, 'staffMember': data.staff },
                    { $push: { slots: data.slotTime } },
                    { new: true }
                );
                const foundStaff = campaignDetail.staff.find(staffMember => staffMember.id === data.staff);
                data.staff = foundStaff.name;
            }
            else {
                let appointmentData = await bookedSlotsTrackModel.findOneAndUpdate(
                    { 'campaignId': id, 'date': appointmentDate },
                    { $push: { slots: data.slotTime } },
                    { new: true }
                );
            }
        }
        else if (type == 'booking') {

            if (data.bookingDate) // for table and seat
            {
                for (const item in data.selectedRecords) {

                    const bookedData = await bookedSlotsTrackModel.findOne({
                        'campaignId': id,
                        'date': data.bookingDate,
                        'slotTime': data.slotTime,
                        'type': item,
                    });

                    if (bookedData) {

                        const updateData = await bookedSlotsTrackModel.findOneAndUpdate(
                            {
                                'campaignId': id,
                                'date': data.bookingDate,
                                'slotTime': data.slotTime,
                                'type': item,
                            },
                            {
                                $inc: { booked: data.selectedRecords[item] } // Increment the 'booked' field with the incrementValue
                            },
                            { new: true } // Return the updated document
                        );

                    }
                    else {
                        let newData = {
                            'campaignId': id,
                            'date': data.bookingDate,
                            'slotTime': data.slotTime,
                            'type': item,
                            'booked': data.selectedRecords[item],
                        }
                        let saved = await bookedSlotsTrackModel.create(newData);

                    }

                    let foundtype;
                    if (data.bookingType == 'seat') {
                        foundtype = campaignDetail.seats.find(seat => seat.id === item);
                    } else if (data.bookingType == 'table') {
                        foundtype = campaignDetail.tables.find(table => table.id === item);
                    }
                    data.selectedRecords[foundtype.name] = {
                        price: foundtype.price,
                        selectCount: data.selectedRecords[item]
                    };

                    delete data.selectedRecords[item];
                }
            }
            // for room
            else {
                for (const item in data.selectedRecords) {

                    for (let currentDate = new Date(data.Checkindate); currentDate <= new Date(data.Checkoutdate); currentDate.setDate(currentDate.getDate() + 1)) {

                        const bookedData = await bookedSlotsTrackModel.findOne({
                            'campaignId': id,
                            'date': currentDate,
                            'type': item,
                        });

                        if (bookedData) {

                            const updateData = await bookedSlotsTrackModel.findOneAndUpdate(
                                {
                                    'campaignId': id,
                                    'date': currentDate,
                                    'type': item,
                                },
                                {
                                    $inc: { booked: data.selectedRecords[item] }
                                },
                                { new: true }
                            );

                        }
                        else {
                            let newData = {
                                'campaignId': id,
                                'date': currentDate,
                                'type': item,
                                'booked': data.selectedRecords[item],
                            }

                            const updateData = await bookedSlotsTrackModel.create(newData);
                        }
                    }

                    let foundtype = campaignDetail.rooms.find(room => room.id === item);
                    data.selectedRecords[foundtype.name] = {
                        price: foundtype.price,
                        selectCount: data.selectedRecords[item]
                    };
                    delete data.selectedRecords[item];
                }
            }

        }
        else if (type == 'event') {
            campaignDetail.ticket.forEach((ticket) => {

                if (data.selectedRecords[ticket.id] !== undefined) {
                    ticket.booked = ticket.booked + data.selectedRecords[ticket.id];
                    // to store name and price in final data store 
                    data.selectedRecords[ticket.title] = {
                        price: ticket.price,
                        selectCount: data.selectedRecords[ticket.id]
                    };

                    delete data.selectedRecords[ticket.id];
                }
            });

            let saved = await campaignDetailModel.findOneAndUpdate({ 'campaignId': id }, {
                $set: { 'Details': campaignDetail }
            });
        }

        let newBooking;

        if ((type == 'appointment' || type == 'event') && data.registrationType && data.registrationType == 'free') {
            newBooking = {
                campaignId: id,
                campaignType: type,
                parentUserId: userId,
                visitorId: visitorId,
                status: 1,
                Details: data,
            }
            let saveddetails = await bookingDetailsModel.create(newBooking);
        }
        else {
            newBooking = {
                campaignId: id,
                campaignType: type,
                parentUserId: userId,
                visitorId: visitorId,
                paymentStatus: (data.paymentMode != 'cash') ? 'paid' : 'unpaid',
                status: 1,
                Details: data,
            }
            let saveddetails = await bookingDetailsModel.create(newBooking);

            if (data.paymentMode != 'cash') {
                let earning = (parseFloat(campaign.totalEarnings) || 0) + parseFloat(data.paymentInvoice.price);
                campaign.totalEarnings = parseFloat(earning.toFixed(2));
            }

        }

        campaign.noOfBookings = (campaign.noOfBookings || 0) + 1;
        await campaign.save();

        if (campaignDetail.autoresponder && campaignDetail.autoresponder.listid && campaignDetail.autoresponder.name) {

            const emailValue = data.userInfo.Email;

            let autodata = {
                userId: userId,
                email: emailValue,
                id: campaignDetail.autoresponder.listid
            }
            let autoresponder = campaignDetail.autoresponder.name;

            let res = await subscribe(autoresponder, data = autodata);
        }

        let smtpDetails;
        if (campaignDetail && campaignDetail.smtp_type == 'campaign' && campaignDetail.smtpDetails) {
            smtpDetails = campaignDetail.smtpDetails
        }
        else {
            let parentUser = await userModel.findById(userId);
            if (parentUser.smtpDetails) {
                smtpDetails = parentUser.smtpDetails;
            }
        }

        let whereCustom, whereDefault;
        whereCustom = {
            'default': 1, 'emailBy': 0, 'type': (type == 'appointment') ? 'newAppointment' : (type == 'event') ? 'newEventRegister' : 'newBooking'
        }
        whereDefault = {
            'default': 0, 'emailBy': 0, 'type': (type == 'appointment') ? 'newAppointment' : (type == 'event') ? 'newEventRegister' : 'newBooking'
        }
        let emailContent;
        emailContent = await emailNotificationModel.findOne({ ...whereCustom });
        if (!emailContent) {
            emailContent = await emailNotificationModel.findOne({ ...whereDefault });
        }

        let campaignd = await campaignsModel.findOne({ '_id': id }).lean();
        let emailDetail = emailContent?.Details;
        let roomregistrationdate = Date.now();
        let appointmentDetail = { roomregistrationdate, ...campaignd, ...campaignDetail, ...detail?.bookingDetails };

        await sendEmail({ email: detail?.bookingDetails?.userInfo?.Email, emailType: (type == 'appointment') ? 'newAppointment' : (type == 'event') ? 'newEventRegister' : 'newBooking', appointmentDetail: appointmentDetail, smtpDetails, emailDetail });

        let commitTransaction = await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ message: "Booking successfully", status: 1 })

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        return NextResponse.json({ message: error.message, status: 0 })
    }
}

//track booked details
export async function PUT(request) {
    try {
        const data = await request.json();

        if (data.disabledates) {
            if (data.campaign_type == 'booking') {
                let roomTypesArray = data.roomTypes;

                let fullyBookedDates = [];

                const allDates = await bookedSlotsTrackModel.find({
                    campaignId: data.campaign_id,
                }).distinct('date');

                for (const date of allDates) {
                    let fullyBooked = true;

                    for (const roomType of roomTypesArray) {
                        const { id, numberOfRooms } = roomType;
                        const bookingsCount = await bookedSlotsTrackModel.findOne({
                            'campaignId': data.campaign_id,
                            'type': id,
                            'date': date,
                        });

                        if (bookingsCount) {
                            const roomCount = parseInt(numberOfRooms);
                            if (bookingsCount.booked !== roomCount) {
                                fullyBooked = false;
                                break;
                            }
                        } else {
                            fullyBooked = false;
                            break;
                        }
                    }

                    if (fullyBooked) {
                        fullyBookedDates.push(date.toDateString());
                    }
                }
                return NextResponse.json({ data: fullyBookedDates, status: 1 })
            }

            if (data.campaign_type == 'appointment') {
                const staffTypesArray = data.staff;
                const fullyBookedDates = [];

                const allDates = await bookedSlotsTrackModel.find({
                    campaignId: data.campaign_id,
                }).distinct('date');


                for (const date of allDates) {
                    let fullyBooked = true;
                    const timeslotArray = createTimeSlotsArray(date, data.campaignDetail);

                    if (data.staff && data.staff.length > 0) {
                        for (const staff of staffTypesArray) {
                            const { id } = staff;

                            const bookingsCount = await bookedSlotsTrackModel.findOne({
                                'campaignId': data.campaign_id,
                                'staffMember': id,
                                'date': date,
                            });

                            if (!bookingsCount) {
                                fullyBooked = false;
                                break;
                            } else {
                                const isFullyBookedForStaff = timeslotArray.every(timeSlot => {
                                    return bookingsCount.slots.includes(timeSlot);
                                });

                                if (!isFullyBookedForStaff) {
                                    fullyBooked = false;
                                    break;
                                }
                            }
                        }
                    } else {
                        const bookingsCount = await bookedSlotsTrackModel.findOne({
                            'campaignId': data.campaign_id,
                            'date': date,
                        });

                        if (!bookingsCount) {
                            fullyBooked = false;
                        } else {
                            const isFullyBookedForDate = timeslotArray.every(timeSlot => {
                                return bookingsCount.slots.includes(timeSlot);
                            });

                            if (!isFullyBookedForDate) {
                                fullyBooked = false;
                            }
                        }
                    }

                    if (fullyBooked) {
                        fullyBookedDates.push(date.toDateString());
                    }
                }

                return NextResponse.json({ data: fullyBookedDates, status: 1 })
            }

            if (data.campaign_type == 'seattable') {
                let TypesArray;
                let campaignDetail = data.campaignDetail;
                if (campaignDetail.reservationType == "table") {
                    TypesArray = campaignDetail.tables;
                } else if (campaignDetail.reservationType == "seat") {
                    TypesArray = campaignDetail.seats;
                }

                let fullyBookedDates = [];

                const allDates = await bookedSlotsTrackModel.find({
                    campaignId: data.campaign_id,
                }).distinct('date');

                for (const date of allDates) {
                    let fullyBooked = true;
                    const timeslotArray = createTimeSlotsArray(date, data.campaignDetail);
                    for (const type of TypesArray) {
                        const { id } = type;
                        let numberofseattable;
                        if (campaignDetail.reservationType == "table") {
                            numberofseattable = type.numberOfTables;
                        } else if (campaignDetail.reservationType == "seat") {
                            numberofseattable = type.numberOfSeats;
                        }

                        for (const timeSlot of timeslotArray) {
                            const bookingsCount = await bookedSlotsTrackModel.findOne({
                                'campaignId': data.campaign_id,
                                'type': id,
                                'date': date,
                                'slotTime': timeSlot,
                            });

                            if (bookingsCount) {
                                const count = parseInt(numberofseattable);
                                if (bookingsCount.booked !== count) {

                                    fullyBooked = false;
                                    break;
                                }
                            } else {
                                fullyBooked = false;
                                break;
                            }
                        }

                        if (!fullyBooked) {
                            break;
                        }
                    }

                    if (fullyBooked) {
                        fullyBookedDates.push(date.toDateString());
                    }
                }
                return NextResponse.json({ data: fullyBookedDates, status: 1 })
            }

            return NextResponse.json({ data: [], status: 1 })
        }
        else {
            if (data.campaign_type == 'appointment') {
                let appointmentData;

                if (data.staff) {
                    appointmentData = await bookedSlotsTrackModel.findOne({ 'campaignId': data.campaign_id, 'date': data.date, 'staffMember': data.staff })
                } else {
                    appointmentData = await bookedSlotsTrackModel.findOne({ 'campaignId': data.campaign_id, 'date': data.date })
                }

                if (appointmentData == null) {
                    let create;
                    if (data.staff) {
                        create = {
                            campaignId: data.campaign_id,
                            date: data.date,
                            staffMember: data.staff
                        }
                    } else {
                        create = {
                            campaignId: data.campaign_id,
                            date: data.date,
                        }
                    }
                    let createAppointment = await bookedSlotsTrackModel.create(create);
                    return NextResponse.json({ status: 1, data: createAppointment.slots, message: '' })

                } else {
                    return NextResponse.json({ status: 1, data: appointmentData.slots, message: '' })
                }
            }
            else if (data.campaign_type == 'booking') {

                if (data.date) //for seat and table
                {
                    let bookedData = await bookedSlotsTrackModel.find({ 'campaignId': data.campaign_id, 'date': data.date, 'slotTime': data.slotTime })

                    if (bookedData.length > 0) {
                        const resultObject = bookedData.reduce((acc, obj) => {
                            acc[obj.type] = obj.booked;
                            return acc;
                        }, {});

                        return NextResponse.json({ status: 1, data: resultObject, message: '' })

                    } else {
                        return NextResponse.json({ status: 1, data: {}, message: '' })
                    }
                }
                // for room 
                else {
                    let mergedResult = {};

                    // Loop through the date range
                    for (let currentDate = new Date(data.dateCheckIn); currentDate <= new Date(data.dateCheckout); currentDate.setDate(currentDate.getDate() + 1)) {

                        // Fetch booking data for the current date
                        const bookedData = await bookedSlotsTrackModel.find({
                            'campaignId': data.campaign_id,
                            'date': currentDate,
                        });

                        if (bookedData.length > 0) {
                            // Merge the data for each type, considering the maximum booked value
                            bookedData.forEach((obj) => {
                                const currentBooked = mergedResult[obj.type] || 0;
                                mergedResult[obj.type] = Math.max(currentBooked, obj.booked);
                            });
                        }
                    }

                    if (Object.keys(mergedResult).length > 0) {
                        return NextResponse.json({ status: 1, data: mergedResult, message: '' });
                    } else {
                        return NextResponse.json({ status: 1, data: {}, message: 'No booking data found for the given date range' });
                    }
                }

            }
        }

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

export async function PATCH(request) {

    const data = await request.json();

    if (data) {
        await fetch(`${process.env.APP_URL}/api/contactFormMessage`, {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    let admin = await userModel.findOne({ 'role': 1 });
    let smtpDetails = admin.smtpDetails;

    await sendEmail({ email: data.email, emailType: 'contactForm', smtpDetails, emailDetail: data });
    return NextResponse.json({ message: "Your message recieved successfully.", status: 1 })

}

//timeslots generation

function createTimeSlotsArray(selectedDate, data) {
    const selectedDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDate.getDay()];
    const Hours = data.businessDays.find((day) => day.day === selectedDay);

    function isWithinBreakHours(startTime, endTime, breakHours) {
        const breakStart = new Date(breakHours.startTime);
        const breakEnd = new Date(breakHours.endTime);
        let endcheck = ((endTime).toLocaleTimeString() > (breakStart).toLocaleTimeString() && (endTime).toLocaleTimeString() <= (breakEnd).toLocaleTimeString());
        let stcheck = ((startTime).toLocaleTimeString() >= (breakStart).toLocaleTimeString() && (startTime).toLocaleTimeString() < (breakEnd).toLocaleTimeString());
        return endcheck || stcheck;
    }

    if (Hours) {
        const startTime = new Date(Hours.businessHours.startTime);
        const endTime = new Date(Hours.businessHours.endTime);
        let appointSlot;
        let createdSlot = 0;
        if (data.appointmentTimeSlot) {
            appointSlot = data.appointmentTimeSlot * 60 * 1000;
        } else {
            appointSlot = data.reservationSlot * 60 * 1000;
        }

        const timeSlotsArray = [];

        while (startTime < endTime) {
            const endtimeslot = new Date(startTime.getTime() + appointSlot);

            if (!isWithinBreakHours(startTime, endtimeslot, Hours.breakHours)) {

                const slotTime = startTime.toLocaleTimeString().toUpperCase();
                const slotEndTime = new Date(startTime.getTime() + appointSlot).toLocaleTimeString().toUpperCase;

                if (slotEndTime > endTime) {
                    break;
                }

                let isStartTimeIncluded = false;

                if (!isStartTimeIncluded) {
                    timeSlotsArray.push(slotTime);
                    createdSlot++;
                }
            }

            startTime.setTime(startTime.getTime() + appointSlot);
        }

        if (createdSlot === 0) {
            return [];
        }

        return timeSlotsArray;
    } else {
        return [];
    }
}

