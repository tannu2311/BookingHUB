import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { langModel } from "@/models/languages";

var langdata = {
        1: "Time Slot",
        2: "Change",
        3: "Venue",
        4: "Continue",
        5: "Verify",
        6: "Name",
        7: "Email",
        8: "Back",
        9: "Contact",
        10: "Bill To",
        11: "Pay",
        12: "Free",
        13: "Description",
        14: "Available",
        15: "Unavailable",
        16: "Total",
        17: "Total Amount",
        18: "And",
        19: "Selected",
        20: "Quantity",
        21: "Price",
        22: "Amount",
        23: "Date",
        24: "Cash",
        25: "Paypal",
        26: "Stripe",
        27: "Time",
        28: "Sold Out",
        29: "Find Time",
        30: "Submit",
        31: "Payment Method",
        32: "Transaction Id",
        33: "Select an option",
        34: "CASH ON COUNTER",
        35: "Enter OTP",
        36: "Resend OTP",
        37: "Resend OTP in {seconds}",
        38: "Please enter a value",
        39: "Please verify your email",
        40: "Please select a value",
        41: "Please select a date",
        42: "Please enter a valid email address.",
        43: "Please enter a valid phone number.",
        44: "Invalid OTP. Please enter a 6-digit OTP.",
        46: "Selected Time",
        47: "Selected Staff",
        48: "Appointment Details",
        49: "Appointment Date",
        50: "Select A Staff Member",
        51: "Your {employeeService} appointment with {employee} is scheduled for {date} at {selectedTime}.",
        52: "Your appointment is scheduled for {selectedDate} at {selectedTime}.",
        53: "Please provide your details in the form below to proceed.",
        54: "Price for the service is {price}. How you would like to pay",
        55: "Oops! No slots available for chosen date, try to choose a different date. Thank you!",
        56: "No slots available for this day.",
        57: "You already have an appointment for this day.",
        58: "Event Details",
        59: "Organised By",
        60: "Date and Time",
        61: "Select Tickets",
        62: "Free",
        63: "How you would like to pay:",
        64: "Select at least one ticket",
        65: "Registration has not started yet.",
        66: "Registration has been closed.",
        67: "You have selected {selectedTickets} ticket. Your total payable amount is {price}.",
        68: "Please provide your details in the form below to proceed with booking.",
        69: "Sorry, all tickets for this event have been booked. We're fully sold out! Please stay tuned for our future updates. Thank you for your interest!",
    
    
        70: "Check In",
        71: "Check Out",
        72: "Select",
        73: "Room",
        74: "Seat",
        75: "Table",
        76: "Book now",
        77: "Person per Room",
        78: "No of Person - {personPerTable}",
        79: "Select at least one option",
        80: "How you would like to pay",
        81: "You have selected {selectedRooms} for {dateCheckIn} to {dateCheckout}. Your total cost is {price}.",
        82: "Please provide your details in the form below to proceed with booking.",
        83: "Oops!, currently no rooms available for chosen dates. Try to select different dates. Thank you for your interest!",
        84: "You have selected {selectedSeat-Table} for {selectedDate}, {selectedTime}. Your total cost is {price}.",
        85: "Sorry, currently no {reservationType} available for chosen date and time. Try selecting another date and time. Thank you for your interest!",
}

export async function GET(request) {
    try {
        let langcode = request.nextUrl.searchParams.get("code");
        let userId = request.nextUrl.searchParams.get("id");

        if (langcode) {
            let userData = await langModel.findOne({ 'userId': userId });
            if (userData && userData.language && langcode in userData.language) {
                let languageData = userData.language[langcode];
                if(languageData)
                {
                    return NextResponse.json({ data: languageData, status: 1 });
                }
            }
            return NextResponse.json({ data: langdata, status: 1 });
        }
        else {
            const token = await getToken({ req: request });
            if (token && token.role == 0) {
                let userData = await langModel.findOne({ 'userId': token.sub });
                if (userData && userData.language) {
                    let language = userData.language;
                    return NextResponse.json({ data: language, status: 1 })
                }
                else {
                    return NextResponse.json({ data: {}, status: 1 })
                }
            } else {
                return NextResponse.json({ message: "Unauthorized user.", status: 0 })
            }
        }

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}


export async function POST(request) {
    try {
        const data = await request.json();
        const langCode = data.langcode;
        const langData = data.langdata;
        const token = await getToken({ req: request });
        if (token && token.role == 0) {

            let userData = await langModel.findOne({ 'userId': token.sub });

            if (!userData) {
                userData = await langModel.create({
                    'userId': token.sub,
                    language: { [langCode]: langData }
                });
                return NextResponse.json({ message: "Saved successfully.", status: 1 })


            } else {

                if (userData.language[langCode]) {
                    await langModel.updateOne(
                        { 'userId': token.sub },
                        { $set: { [`language.${langCode}`]: { ...userData.language[langCode], ...langData } } }
                    );
                } else {
                    await langModel.updateOne(
                        { 'userId': token.sub },
                        { $set: { [`language.${langCode}`]: langData } }
                    );
                }

                return NextResponse.json({ message: "Saved successfully.", status: 1 })
            }
        }
        return NextResponse.json({ message: "Unauthorized user.", status: 0 })

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}