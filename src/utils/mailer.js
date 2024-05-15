import { accountCreation, resetpasswordContent,verificationContent,declineRequestmail, newAppointmentBook, newEventBook, newBooking, contactForm,subsciptionSuspended,subsciptionRenewal } from './mailContent';
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import userModel from '@/models/users';

export default async function sendEmail({ email, emailType, userInfo, appointmentDetail, smtpDetails, emailDetail, userName }) {

  try {
 
    let hashedToken;
    if (emailType == 'RESET') {
      hashedToken = await bcrypt.hash(userInfo.toString(), 10);
      await userModel.findByIdAndUpdate(userInfo, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 900000,
        }
      }
      )
    }

    if (emailType == 'VERIFY') {
      function generateRandomSixDigitNumber() {
        return Math.floor(100000 + Math.random() * 900000);
      }
      hashedToken = generateRandomSixDigitNumber();

      await userModel.findByIdAndUpdate(userInfo, {
        $set: {
          verificationOtp: hashedToken,
          verificationOtpExpiry: Date.now() + 10 * 60 * 1000,
        }
      }
      )
    }

    var transport = nodemailer.createTransport({
      host: smtpDetails.server,
      port: smtpDetails.port,
      auth: {
        user: smtpDetails.from,
        pass: smtpDetails.password
      }
    });

    let mailContext;
    let mailSubject;

    if (emailType == 'accountCreation') 
    {
      mailSubject = emailDetail.Subject ? emailDetail.Subject : `Welcome to ${process.env.APP_NAME}!... Your Account Has Been Created on ${process.env.APP_NAME}`;
      mailContext = accountCreation(userInfo, emailDetail.message);
    } 
    else if (emailType == 'RESET') 
    {
      mailSubject = emailDetail.Subject ? emailDetail.Subject : "Reset your password";
      mailContext = resetpasswordContent(email, hashedToken, userName, emailDetail.message)
    } 
    else if (emailType == 'declineMail') 
    {
      mailSubject = emailDetail.Subject ? emailDetail.Subject : `Declined: Appointment Request for ${appointmentDetail.campaignTitle}`;
      mailContext = declineRequestmail(userInfo, appointmentDetail, emailDetail.message, userName)
    }
    else if (emailType == 'VERIFY') 
    {
      mailSubject = emailDetail.Subject ? emailDetail.Subject : "Please verify your email";
      mailContext = verificationContent(hashedToken, email, emailDetail.message);
    } 
    else if (emailType == 'newAppointment') 
    {
      mailSubject = emailDetail.Subject ? emailDetail.Subject : "Succesfully booked appointment.";
      mailContext = newAppointmentBook(appointmentDetail,emailDetail.message)
    }
    else if(emailType == 'newEventRegister')
    {
      mailSubject = emailDetail.Subject ? emailDetail.Subject : "Succesfully booked event.";
      mailContext = newEventBook(appointmentDetail,emailDetail.message)
    }
    else if(emailType == 'newBooking'){
      mailSubject = emailDetail.Subject ? emailDetail.Subject : "Succesfully booked.";
      mailContext = newBooking(appointmentDetail,emailDetail.message)
    }
    else if(emailType == 'contactForm')
    {
      mailSubject = emailDetail.subject ? emailDetail.subject : "New Message";
      mailContext = contactForm(emailDetail)
    }
    else if(emailType == 'subsciptionSuspended')
    {
      mailSubject = emailDetail.subject ? emailDetail.subject : "Urgent: Action Required - Subscription Payment Failed";
      mailContext = subsciptionSuspended(userInfo,emailDetail.message)
    }
    else if(emailType == 'subsciptionRenewal')
    {
      mailSubject = emailDetail.subject ? emailDetail.subject : "Your Subscription Plan Has Been Successfully Renewed!";
      mailContext = subsciptionRenewal(userInfo,emailDetail.message)
    }

    let mailData;
    if(emailType == 'contactForm')
    {
      mailData = {
        from: smtpDetails.from,
        to: smtpDetails.from,
        subject: mailSubject,
        html: mailContext
      }
    }
    else{
      mailData = { 
        from: smtpDetails.from,
        to: email,
        subject: mailSubject,
        html: mailContext
      }
    }


    const mailresponse = await transport.sendMail(mailData);

    return mailresponse;

  }
  catch (error) {
    throw new Error(error.message);
  }
}