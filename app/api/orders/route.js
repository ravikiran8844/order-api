import {  NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer'



export async function GET(request) {
    return Response.json("helllo")
}
 
export async function POST(req) {
    
    const data= await req.text();
    console.log(data);
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.NEXT_PUBLIC_SMTP_USER,
          pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD
        }
    
        // host: 'smtp.ethereal.email',
        // port: 587,
        // auth: {
        //     user: 'janice74@ethereal.email',
        //     pass: 'wt8uxrdQU7erYVyfxa'
        // }
      });
    
      const mailOptions = {
        from: process.env.NEXT_PUBLIC_SMTP_USER,
        to: 'ravi.kiran8844@gmail.com',
        // replyTo: email,
        // cc: email, (uncomment this line if you want to send a copy to the sender)
        subject: `New Shopify Order`,
        text: `${data}`
            
      };
    
      const sendMailPromise = () =>
        new Promise((resolve, reject) => {
          transport.sendMail(mailOptions, function (err) {
            if (!err) {
              resolve('Email sent');
            } else {
              reject(err.message);
            }
          });
        });
    
      try {
        await sendMailPromise();
        return NextResponse.json({ message: 'Email sent' });
      } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
      }
    }