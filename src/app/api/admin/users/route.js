import userModel from "@/models/users";
import campaignsModel from "@/models/campaigns";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import paymentMethodModel from "@/models/paymentMethods";
import auotoresponderModel from "@/models/Autoresponders";
import invoiceModel from "@/models/invoiceModel";


//GET THE LIST OF USERS FOR ADMIN PAGE
export async function POST(request) {
    try {

        const params = await request.json();

        let getpage = params.page ? params.page : 1;
        let keyword = params.search ? params.search : '';
        let limit = params.listPerPage ? params.listPerPage : 10;

        var where = {}
        where.role = 0;
        where.trash = 0;

        const page = parseInt(getpage);
        const skip = (page - 1) * parseInt(limit);

        const token = await getToken({ req: request })

        let users, totalRecords;
        if (token && token.role == 1) {

            if (keyword) {
                users = await userModel.find({
                    ...where,
                    $or: [
                        { firstname: { $regex: keyword, $options: 'i' } },
                        { lastname: { $regex: keyword, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } },
                    ]
                }).select('-password -smtpDetails').populate({ path: 'plan', select: 'planname' }).sort({ _id: -1 }).skip(skip).limit(limit);

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
                users = await userModel.find(where).select('-password -smtpDetails').populate({ path: 'plan', select: 'planname' }).sort({ _id: -1 }).skip(skip).limit(limit);
                totalRecords = await userModel.countDocuments(where);
            }

            const totalPages = Math.ceil(totalRecords / limit);

            return NextResponse.json({ users, totalRecords, totalPages, status: 1 });
        }
        return NextResponse.json({ message: "Unauthorized user", status: 0 });

    } catch (error) {
        return NextResponse.json({ message: error.message, status: 0 });
    }
}

//DELETE SINGLE USER FROM ADMIN PAGE
export async function DELETE(request) {

    let id = request.nextUrl.searchParams.get("id");
 
    try {
        const token = await getToken({ req: request })
        if (token.role == 1) {
            
            const campaigns = await campaignsModel.find({ 'userId' : id });

            // delete payment methods 
            let deleted = await paymentMethodModel.deleteMany({'userId' : id});
          
            let autores = await auotoresponderModel.deleteMany({'userId' : id});

            let invoices = await invoiceModel.deleteMany({'userId' : id});
            

            // Iterate through campaigns and delete each
            for (const campaign of campaigns) {
             
                await deleteCampaign(campaign._id);
            }

            await userModel.findByIdAndDelete(id);

            return NextResponse.json({ message: "User deleted sucessfully.", status: 1 });
        }
        return NextResponse.json({ message: "Unauthorized user.", status: 0 });

    } catch (error) {
        
        return NextResponse.json({ message: "Failed to delete.", status: 0 });
    }
}

//delete campaign associate to that user 
async function deleteCampaign (id){
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





