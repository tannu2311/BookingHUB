import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import emailNotificationModel from "@/models/emailNotification";

// Get the type of notification user and admin

export async function GET(request) {
  try {
    const token = await getToken({ req: request });

    if (token) {
      let wherealltype, whereCustom, whereDefault;
      // for user
      if (token.role == 0) {
        wherealltype = {
          'emailBy': 0
        }
        whereCustom = {
          'userId': token.sub, 'default': 1, 'emailBy': 0
        }
        whereDefault = {
          'default': 0, 'emailBy': 0
        }
      }
      //for admin
      else if (token.role == 1) {
        wherealltype = {
          'emailBy': 1
        }
        whereCustom = {
          'userId': token.sub, 'default': 1, 'emailBy': 1
        }
        whereDefault = {
          'default': 0, 'emailBy': 1
        }
      }

      let types = await emailNotificationModel.find(wherealltype).distinct('type');
      let userCustom = await emailNotificationModel.find(whereCustom).distinct('type');
      const filteredTypes = types.filter(type => !userCustom.includes(type));

      let data = userCustom.map(async (type) => {
        let notify = await emailNotificationModel.findOne({ ...whereCustom, type });
        return notify;
      });

      let defaulttemplate = filteredTypes.map(async (type) => {
        let notify = await emailNotificationModel.findOne({ ...whereDefault, type });
        return notify;
      })

      let userNotifications = await Promise.all(data);
      let defaultNotifications = await Promise.all(defaulttemplate);
      let notifications = [...userNotifications, ...defaultNotifications];

      return NextResponse.json({ data: notifications, status: 1 })

    }
    else {
      return NextResponse.json({ message: "Unauthorized user", status: 0 });
    }

  } catch (error) {
    return NextResponse.json({ status: 0, message: error.message });
  }
}

export async function POST(request) {
  try {
    let id = request.nextUrl.searchParams.get('id');
    let data = await request.json();
    const token = await getToken({ req: request });

    if (token) {
      let notification = await emailNotificationModel.findById(id);


      if (notification) {

        if (notification.default == 1 && notification.userId == token.sub) 
        {
          let type = notification.type;
          let update = await emailNotificationModel.findOneAndUpdate({'userId' : token.sub, 'default': 1,"emailBy": notification.emailBy,type},
            { $set: { 'Details': data } },
            { new: true });
            return NextResponse.json({ status: 1, message: "Successfully updated notification."});
        }
        else {  
            let newupdate = {
              "default": 1,
              "emailBy": notification.emailBy,
              "userId" : token.sub,
              "type": notification.type,
              "Details" : data
            }
            let created = await emailNotificationModel.create(newupdate);
            return NextResponse.json({ status: 1, message: "Successfully updated notification."});
        }
      }
      else {
        return NextResponse.json({ status: 0, message: "Invalid notification id." });
      }
    }
    else {
      return NextResponse.json({ status: 0, message: "Unauthorized user." });
    }
  }
  catch (error) {
    return NextResponse.json({ status: 0, message: error.message });
  }
}
