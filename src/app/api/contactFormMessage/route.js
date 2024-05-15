import { NextResponse } from "next/server";
import ContactFormMsgModel from "@/models/contactFormMessages";
import { getToken } from "next-auth/jwt";

export async function POST(request) {
    try {
    const data = await request.json();
    if(data)
    {
        await ContactFormMsgModel.create(data);
        return NextResponse.json({ message: "Message saved.", status: 1 });
    }
    return NextResponse.json({ message: "Please provide details.", status: 0 })

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 })
    }
}

export async function PUT(request) {
    try {

        const params = await request.json();

        let getpage = params.page ? params.page : 1;
        let keyword = params.search ? params.search : '';
        let limit = params.listPerPage ? params.listPerPage : 10;

        const page = parseInt(getpage);
        const skip = (page - 1) * parseInt(limit);

        const token = await getToken({ req: request })

        let messages, totalRecords;
        if (token && token.role == 1) {

            if (keyword) {
                messages = await ContactFormMsgModel.find({
                    $or: [
                        { first_name: { $regex: keyword, $options: 'i' } },
                        { last_name: { $regex: keyword, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } },
                    ]
                }).sort({ _id: -1 }).skip(skip).limit(limit);

                totalRecords = await ContactFormMsgModel.countDocuments({
                    $or: [
                        { first_name: { $regex: keyword, $options: 'i' } },
                        { last_name: { $regex: keyword, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } },
                    ]
                })
            }
            else {
                messages = await ContactFormMsgModel.find().sort({ _id: -1 }).skip(skip).limit(limit);
                totalRecords = await ContactFormMsgModel.countDocuments();
            }

            const totalPages = Math.ceil(totalRecords / limit);

            return NextResponse.json({ messages, totalRecords, totalPages, status: 1 });
        }
        return NextResponse.json({ message: "Unauthorized user", status: 0 });

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 });
    }
}

export async function DELETE(request) {

    let id = request.nextUrl.searchParams.get("id");
 
    try {
        const token = await getToken({ req: request })
        if (token.role == 1) {

            await ContactFormMsgModel.findByIdAndDelete(id);

            return NextResponse.json({ message: "Message deleted sucessfully.", status: 1 });
        }
        return NextResponse.json({ message: "Unauthorized user.", status: 0 });

    } catch (error) {
        
        return NextResponse.json({ message: "Failed to delete.", status: 0 });
    }
}


