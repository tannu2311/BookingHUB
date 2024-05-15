import { widgetCurrency } from "./data";

var APP_NAME = process.env.APP_NAME;
var APP_URL = process.env.APP_URL;

function customizeDate(date) {
  const [year, month, day] = date.split('-');
  const dateObj = new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return dateObj;
}

export const accountCreation = (userInfo, emailmess) => {
  emailmess = emailmess.replaceAll('${client_first_name}', userInfo.firstname);
  emailmess = emailmess.replaceAll('${client_last_name}', userInfo.lastname);
  emailmess = emailmess.replaceAll('${client_full_name}', userInfo.firstname + userInfo.lastname);
  emailmess = emailmess.replaceAll('${client_email}', userInfo.email);
  emailmess = emailmess.replaceAll('${client_password}', userInfo.password);

  return `
    <br/><br />
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px;  font-size:'14px';">
              ${emailmess}
      <div style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #ccc;">
        <p style="color: #777;">Copyright © 2023 ${APP_NAME}. All rights reserved.</p>
      </div>
    </tr>
  </div>`
}

export const resetpasswordContent = (email, hashedToken, userName, emailmess) => {

  emailmess = emailmess.replaceAll('${reset_link_url}', `${APP_URL}/reset-password?token=${hashedToken}`);
  emailmess = emailmess.replaceAll('${client_email}', email);
  emailmess = emailmess.replaceAll('${client_first_name}', userName.firstname);
  emailmess = emailmess.replaceAll('${client_last_name}', userName.lastname);
  emailmess = emailmess.replaceAll('${client_full_name}', userName.firstname + ` ` + userName.lastname);


  return `
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px;  font-size:'14px';">
        
         ${emailmess}
        <div style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #ccc; border-radius: 0 0 10px 10px;">
          <p style="color: #777;">Copyright © 2023 ${process.env.APP_NAME}. All rights reserved.</p>
        </div>
      
    </div>  `
}

export const subsciptionSuspended = (userInfo,emailmess) => {

  emailmess = emailmess.replaceAll('${client_first_name}', userInfo?.firstname);
  emailmess = emailmess.replaceAll('${client_last_name}', userInfo?.lastname);
  emailmess = emailmess.replaceAll('${client_full_name}', userInfo?.firstname + userInfo?.lastname);
  emailmess = emailmess.replaceAll('${subscriptionId}', userInfo?.subscriptionId);
  emailmess = emailmess.replaceAll('${subscriptionPlan}', userInfo?.subscriptionPlan);
  emailmess = emailmess.replaceAll('${next_billing_time}', (userInfo?.paymentMethod == 'stripe')? (userInfo?.next_billing_time).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : customizeDate(userInfo?.next_billing_time));
  emailmess = emailmess.replaceAll('${paymentDate}', (userInfo?.paymentMethod == 'stripe')? (userInfo?.subscribedToDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : customizeDate(userInfo?.paymentDate));
  emailmess = emailmess.replaceAll('${paymentMethod}', userInfo?.paymentMethod);

  return `
    <br/><br />
    <div style="margin: 0 auto; background-color: #ffffff; border-radius: 10px;  font-size:'14px';">
              ${emailmess}
      <div style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #ccc;">
        <p style="color: #777;">Copyright © 2023 ${APP_NAME}. All rights reserved.</p>
      </div>
    </tr>
  </div>`
}

export const subsciptionRenewal = (userInfo,emailmess) => {
  emailmess = emailmess.replaceAll('${client_first_name}', userInfo?.firstname);
  emailmess = emailmess.replaceAll('${client_last_name}', userInfo?.lastname);
  emailmess = emailmess.replaceAll('${client_full_name}', userInfo?.firstname + userInfo?.lastname);
  emailmess = emailmess.replaceAll('${subscriptionId}', userInfo?.subscriptionId);
  emailmess = emailmess.replaceAll('${subscriptionPlan}', userInfo?.planname);
  emailmess = emailmess.replaceAll('${next_billing_time}', (userInfo?.paymentMethod == 'stripe')? (userInfo?.subscribedToDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : customizeDate(userInfo?.subscribedToDate));
  emailmess = emailmess.replaceAll('${paymentDate}', (userInfo?.paymentMethod == 'stripe')? (userInfo?.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : customizeDate(userInfo?.paymentDate));
  emailmess = emailmess.replaceAll('${paymentMethod}', userInfo?.paymentMethod);
  emailmess = emailmess.replaceAll('${invoiceNumber}', userInfo?.invoiceNumber);
  emailmess = emailmess.replaceAll('${subscription_start_date}', (userInfo?.paymentMethod == 'stripe')? (userInfo?.subscribedfromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : customizeDate(userInfo?.subscribedfromDate));
  emailmess = emailmess.replaceAll('${amount_paid}', userInfo?.amount);

  return `
    <br/><br />
    <div style="margin: 0 auto; background-color: #ffffff; border-radius: 10px;  font-size:'14px';">
              ${emailmess}
      <div style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #ccc;">
        <p style="color: #777;">Copyright © 2023 ${APP_NAME}. All rights reserved.</p>
      </div>
    </tr>
  </div>`
}

export const verificationContent = (hashedToken, email, emailmess) => {
  emailmess = emailmess.replaceAll('${verification_code}', hashedToken);
  emailmess = emailmess.replaceAll('${client_email}', email);

  return `
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px;  font-size:'14px';">
         ${emailmess}
</div>
  `;
}

export const declineRequestmail = (userInfo, appointmentDetail, emailmess) => {

  function customizeDate(date) {
    const [year, month, day] = date.split('-');
    const dateObj = new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return dateObj;
  }

  emailmess = emailmess.replaceAll('${cancellation_reason}', userInfo);
  emailmess = emailmess.replaceAll('${appointment_date}', customizeDate(appointmentDetail.appointmentDate));
  emailmess = emailmess.replaceAll('${appointment_time}', new Date(`2000-01-01 ${appointmentDetail.slotTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  emailmess = emailmess.replaceAll('${client_name}', appointmentDetail.userInfo.Name);
  emailmess = emailmess.replaceAll('${client_email}', appointmentDetail.userInfo.Email);
  emailmess = emailmess.replaceAll('${payment_type}', (appointmentDetail.paymentMode)? appointmentDetail.paymentMode : '');
  emailmess = emailmess.replaceAll('${staff_name}', appointmentDetail.staff);
  emailmess = emailmess.replaceAll('${total_price}', (appointmentDetail.paymentMode)? (appointmentDetail.paymentMode == "cash") ? (widgetCurrency[(appointmentDetail?.currency.toLowerCase())] + appointmentDetail?.amount) : widgetCurrency[(appointmentDetail?.paymentInvoice?.currency.toLowerCase())] + appointmentDetail?.paymentInvoice?.price : '');
  emailmess = emailmess.replaceAll('${company_address}', (appointmentDetail?.address)? appointmentDetail.address : '');
  emailmess = emailmess.replaceAll('${business_name}', (appointmentDetail?.business)? appointmentDetail.business : '');
  emailmess = emailmess.replaceAll('${company_phoneno}', (appointmentDetail?.phone)? appointmentDetail.phone : '');

  return `
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px;  font-size:'14px';">
            ${emailmess}
</div>
  `;
}

export const newAppointmentBook = (appointmentDetail, emailmess) => {

  emailmess = emailmess.replaceAll('${client_name}', appointmentDetail.userInfo.Name);
  emailmess = emailmess.replaceAll('${client_email}', appointmentDetail.userInfo.Email);
  emailmess = emailmess.replaceAll('${appointment_date}', customizeDate(appointmentDetail.appointmentDate));
  emailmess = emailmess.replaceAll('${appointment_time}', new Date(`2000-01-01 ${appointmentDetail.slotTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  emailmess = emailmess.replaceAll('${company_address}', (appointmentDetail?.address)? appointmentDetail.address : '');
  emailmess = emailmess.replaceAll('${business_name}', (appointmentDetail?.business)? appointmentDetail.business : '');
  emailmess = emailmess.replaceAll('${company_phoneno}', (appointmentDetail?.phone)? appointmentDetail.phone : '');
  emailmess = emailmess.replaceAll('${payment_method}', (appointmentDetail.paymentMode)? (appointmentDetail.paymentMode) : 'Free');
  emailmess = emailmess.replaceAll('${payment_status}', (appointmentDetail?.paymentInvoice?.status)? (appointmentDetail?.paymentInvoice?.status) : 'NA');
  emailmess = emailmess.replaceAll('${staff_name}', (appointmentDetail.staff)? appointmentDetail.staff : 'NA');
  emailmess = emailmess.replaceAll('${transaction_id}', (appointmentDetail.paymentMode)? appointmentDetail.paymentMode == "cash"? 'NA' : (appointmentDetail.paymentMode == "paypal" ? appointmentDetail?.paymentInvoice?.transactionId : appointmentDetail?.paymentInvoice?.invoiceNumber) : 'NA');
  emailmess = emailmess.replaceAll('${total_price}', (appointmentDetail.paymentMode)? (appointmentDetail.paymentMode == "cash" ? `${widgetCurrency[appointmentDetail?.currency]} ${appointmentDetail?.amount}` : widgetCurrency[(appointmentDetail?.paymentInvoice?.currency.toLowerCase())] + appointmentDetail?.paymentInvoice?.price) : '0');

  return `
  <br/><br />
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; font-size:'14px';">
            ${emailmess}
    <div style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #ccc;">
      <p style="color: #777;">Copyright © 2023 ${APP_NAME}. All rights reserved.</p>
    </div>
  </tr>
</div>`
}

export const newEventBook = (appointmentDetail, emailmess) => {
 
  let tot_amount = appointmentDetail.registrationType == 'free' ? '0' : appointmentDetail.paymentMode == 'cash' ? `${widgetCurrency[appointmentDetail?.currency]} ${appointmentDetail?.amount}` : `${widgetCurrency[appointmentDetail?.paymentInvoice.currency.toLowerCase()]} ${appointmentDetail?.paymentInvoice?.price}`;
  const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  let eventDateTime = `<ul>
  ${(() => {
      let list = '';
      (appointmentDetail?.eventDays).forEach((event) => {
        const date = new Date(event.date);
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        const formattedTime = new Date(event.startTime).toLocaleTimeString('en-US', timeOptions);
        list += `<li> ${formattedDate}, ${formattedTime}</li>`
      });
      return list
    })()}
  </ul>
  `;


  let selectedRecordsTable = ` <div class='table_conatiner'>
  <table style="width: 100%;border-collapse: collapse;border: 1px solid #e5e1e1" id="detail_table">
      <thead>
      <tr style="border: 1px solid #e5e1e1;">
          <th style="padding: 8px 0px;text-align: center;">Selected</th>
          <th style="padding: 8px 0px;text-align: center;">Quantity</th>
          <th style="padding: 8px 0px;text-align: center;">Price</th>
          <th style="padding: 8px 0px;text-align: center;">Amount</th>
        </tr>
      </thead>
      <tbody>
      
      ${(() => {
      let rows = '';
      for (const key in appointmentDetail.selectedRecords) {
        rows += `<tr>
            <td style="padding: 8px 0px;text-align: center;">${key}</td>
            <td style="padding: 8px 0px;text-align: center;">${appointmentDetail.selectedRecords[key].selectCount}</td>
            <td style="padding: 8px 0px;text-align: center;">${ appointmentDetail.registrationType == 'free' ? '0' : appointmentDetail?.paymentMode == 'cash' ? widgetCurrency[appointmentDetail?.currency] + appointmentDetail.selectedRecords[key].price : widgetCurrency[appointmentDetail?.paymentInvoice.currency.toLowerCase()] + appointmentDetail.selectedRecords[key].price}</td>
            <td style="padding: 8px 0px;text-align: center;">${ appointmentDetail.registrationType == 'free' ? '0' :  appointmentDetail?.paymentMode == 'cash' ? widgetCurrency[appointmentDetail?.currency] + appointmentDetail.selectedRecords[key].price: widgetCurrency[appointmentDetail?.paymentInvoice.currency.toLowerCase()] + (appointmentDetail.selectedRecords[key].selectCount * appointmentDetail.selectedRecords[key].price)}</td>
          </tr>`;
      }
      return rows;
    })()}
      </tbody>
  </table>
</div>
<div style="display:flex;align-items:center;margin-top:15px;"><div>Total Amount : </div><span style="font-size:18px; font-weight: 500">${tot_amount}</span></div> `;


  emailmess = emailmess.replaceAll('${client_name}', appointmentDetail?.userInfo?.Name);
  emailmess = emailmess.replaceAll('${client_email}', appointmentDetail?.userInfo?.Email);
  emailmess = emailmess.replaceAll('${event_date_and_time}', eventDateTime);
  emailmess = emailmess.replaceAll('${company_address}', (appointmentDetail?.address)? appointmentDetail.address : '');
  emailmess = emailmess.replaceAll('${business_name}', (appointmentDetail?.business)? appointmentDetail.business : '');
  emailmess = emailmess.replaceAll('${company_phoneno}', (appointmentDetail?.phone)? appointmentDetail.phone : '');
  emailmess = emailmess.replaceAll('${payment_method}', appointmentDetail?.registrationType == "paid" ? appointmentDetail.paymentMode : appointmentDetail?.registrationType);
  emailmess = emailmess.replaceAll('${payment_status}', appointmentDetail?.registrationType == "free" ? "" : (appointmentDetail?.paymentMode == 'cash') ? 'unpaid' : appointmentDetail?.paymentInvoice?.status);
  emailmess = emailmess.replaceAll('${campaign_name}', appointmentDetail?.title);
  emailmess = emailmess.replaceAll('${transaction_id}', (appointmentDetail?.registrationType == "free" || appointmentDetail?.paymentMode == 'cash') ? "NA" : appointmentDetail.paymentMode == "paypal" ? appointmentDetail?.paymentInvoice?.transactionId : appointmentDetail?.paymentInvoice?.invoiceNumber);
  emailmess = emailmess.replaceAll('${total_price}', appointmentDetail.registrationType == 'free' ? '0' : appointmentDetail.paymentMode == 'cash' ? `${widgetCurrency[appointmentDetail?.currency]} ${appointmentDetail?.amount}` : `${widgetCurrency[appointmentDetail?.paymentInvoice.currency.toLowerCase()]} ${appointmentDetail?.paymentInvoice?.price}`);
  emailmess = emailmess.replaceAll('${selected_types_table}', selectedRecordsTable);

  return `
  <br/><br />
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; font-size:'14px';">
            ${emailmess}
            
    <div style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #ccc;">
      <p style="color: #777;">Copyright © 2023 ${APP_NAME}. All rights reserved.</p>
    </div>
  
</div>`
}

export const newBooking = (appointmentDetail, emailmess) => {


  let tot_amount = appointmentDetail.paymentMode == 'cash' ? `${widgetCurrency[appointmentDetail?.currency]} ${appointmentDetail?.amount}` : `${widgetCurrency[appointmentDetail?.paymentInvoice.currency.toLowerCase()]} ${appointmentDetail?.paymentInvoice?.price}`;

  let selectedRecordsTable = `<div class='table_conatiner'>
  <h4>Booking Details:</h4>
  <table style="width: 100%;border-collapse: collapse;border: 1px solid #e5e1e1" id="detail_table">
      <thead>
      <tr style="border: 1px solid #e5e1e1;">
          <th style="padding: 8px 0px;text-align: center;">Selected</th>
          <th style="padding: 8px 0px;text-align: center;">Quantity</th>
          <th style="padding: 8px 0px;text-align: center;">Price</th>
          <th style="padding: 8px 0px;text-align: center;">Amount</th>
        </tr>
      </thead>
      <tbody>
      
      ${(() => {
      let rows = '';
      for (const key in appointmentDetail.selectedRecords) {
        rows += `<tr>
            <td style="padding: 8px 0px;text-align: center;">${key}</td>
            <td style="padding: 8px 0px;text-align: center;">${appointmentDetail.selectedRecords[key].selectCount}</td>
            <td style="padding: 8px 0px;text-align: center;">${appointmentDetail?.paymentMode == 'cash' ? widgetCurrency[appointmentDetail?.currency] : widgetCurrency[appointmentDetail?.paymentInvoice.currency.toLowerCase()]} ${appointmentDetail.selectedRecords[key].price}</td>
            <td style="padding: 8px 0px;text-align: center;">${appointmentDetail?.paymentMode == 'cash' ? widgetCurrency[appointmentDetail?.currency] : widgetCurrency[appointmentDetail?.paymentInvoice.currency.toLowerCase()]} ${appointmentDetail.selectedRecords[key].selectCount * appointmentDetail.selectedRecords[key].price}</td>
          </tr>`;
      }
      return rows;
    })()}
      </tbody>
  </table>
</div>
<div style="display:flex;align-items:center;margin-top:15px;"><div>Total Amount : </div><span style="font-size:18px; font-weight: 500">${tot_amount}</span></div>
  `;

  let checkInOutDate = (roomregistrationdate) => 
  {
    if(roomregistrationdate)
    {
      let options = {
        day: "numeric", 
        month: "short", 
        year: "numeric", 
        hour: "numeric", 
        minute: "numeric", 
        hour12: true 
      };
      let date = new Date(roomregistrationdate);
      let registrationdate = date.toLocaleString("en-US", options);

      return `${registrationdate}`;
    }
    else{
      return ` <div> ${customizeDate(appointmentDetail.Checkindate)} To ${customizeDate(appointmentDetail.Checkoutdate)}</div>`;
    }
  }

  emailmess = emailmess.replaceAll('${client_name}', appointmentDetail.userInfo.Name);
  emailmess = emailmess.replaceAll('${client_email}', appointmentDetail.userInfo.Email);
  emailmess = emailmess.replaceAll('${company_address}', (appointmentDetail?.address)? appointmentDetail.address : '');
  emailmess = emailmess.replaceAll('${business_name}', (appointmentDetail?.business)? appointmentDetail.business : '');
  emailmess = emailmess.replaceAll('${company_phoneno}', (appointmentDetail?.phone)? appointmentDetail.phone : '');
  emailmess = emailmess.replaceAll('${booking_date}', (appointmentDetail.reservationType == 'room')? checkInOutDate() : customizeDate(appointmentDetail.bookingDate));
  emailmess = emailmess.replaceAll('${booking_time}', (appointmentDetail.reservationType == 'room')? checkInOutDate(appointmentDetail.roomregistrationdate) : new Date(`2000-01-01 ${appointmentDetail.slotTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  emailmess = emailmess.replaceAll('${booking_type}', appointmentDetail?.reservationType);
  emailmess = emailmess.replaceAll('${payment_method}', appointmentDetail?.paymentMode);
  emailmess = emailmess.replaceAll('${payment_status}', (appointmentDetail.paymentMode == 'cash') ? 'unpaid' : appointmentDetail?.paymentInvoice?.status);
  emailmess = emailmess.replaceAll('${transaction_id}', (appointmentDetail.paymentMode == 'cash') ? 'NA' : appointmentDetail.paymentMode == "paypal" ? appointmentDetail?.paymentInvoice?.transactionId : appointmentDetail?.paymentInvoice?.invoiceNumber);
  emailmess = emailmess.replaceAll('${total_price}', (appointmentDetail.paymentMode == "cash") ? (widgetCurrency[(appointmentDetail?.currency.toLowerCase())] + appointmentDetail?.amount) : widgetCurrency[(appointmentDetail?.paymentInvoice?.currency.toLowerCase())] + appointmentDetail?.paymentInvoice?.price);
  emailmess = emailmess.replaceAll('${selected_types_table}', selectedRecordsTable);

  return `
  <br/><br />
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; font-size:'14px';">
            ${emailmess}
           
    <div style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #ccc;">
      <p style="color: #777;">Copyright © 2023 ${APP_NAME}. All rights reserved.</p>
    </div>
  </tr>
</div>`
} 

export const contactForm = (data) => {
  return ` <br/><br />
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; font-size:'14px';">
  <h5  style=" font-size:'16px';">Hello Admin</h5>
  <p  style=" font-size:'16px';">You have received a new contact form submission. Here are the details:</p>
  <div  style=" font-size:'16px';">Name: <span  style="font-weight:'500';">${data.first_name + data.last_name} </span></div>
  <div  style=" font-size:'16px';">Email: <span  style="font-weight:'500'">${data.email} </span></div>
  <div  style=" font-size:'16px';">Message: <span  style=" font-weight:'500'">${data.message} </span></div>
  <br/>
  <p>Best regards</p>
  </div>`
}


