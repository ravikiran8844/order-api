import {  NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';



export async function GET(request) {
    return Response.json("Order Canceled API")
}
 
export async function POST(req) {


    try {
        const requestData = await req.json();
        const lineItems = requestData.line_items || []; // If the property is nested, use the correct path

          // Check if any line item has the matching vendor
          const hasMatchingVendor = lineItems.some(item => item.vendor === 'Fitput');

          if (hasMatchingVendor) {
              // Rest of your email sending logic
              const transport = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  auth: {
                      user: process.env.NEXT_PUBLIC_SMTP_USER,
                      pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD
                  }
              });
  
              const mailOptions = {
                  from: process.env.NEXT_PUBLIC_SMTP_USER,
                  to: 'orderskriya@gmail.com',
                  subject: 'Order Canceled with Matching Vendor - Fitput',
                  text: JSON.stringify(requestData) // Just an example, you can modify the email content
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
  
              await sendMailPromise();


               // Send JSON data as a POST request to the specified endpoint
            const apiUrl = 'https://Omni-proxy.increff.com/shopify/api/push/orderCancel';
            const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (apiResponse.ok) {
                return NextResponse.json({ message: 'Email sent and data sent to API successfully' });
            } else {
                return NextResponse.json({ message: 'Email sent but failed to send data to API' });
            }
        } else {
            return NextResponse.json({ message: 'No matching vendor found, email not sent' });
        }
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}