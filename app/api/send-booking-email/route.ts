import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  console.log('📧 Email API called - START');
  
  try {
    const body = await request.json();
    console.log('📧 Request body received');

    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      serviceName, 
      bookingDate, 
      bookingTime, 
      message,
      bookingId,
      propertyType,
      area,
      frequency
    } = body;

    // Email content (HTML version)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #8B5CF6; color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .booking-id { background: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px; font-size: 18px; font-weight: bold; border-left: 4px solid #8B5CF6; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
          .value { font-size: 16px; color: #1f2937; }
          .divider { height: 1px; background: #e5e7eb; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; background: #f9fafb; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Booking Received</h1>
          </div>
          <div class="content">
            <div class="booking-id">
              Booking ID: #${bookingId}
            </div>
            
            <div class="field">
              <div class="label">👤 Client Name</div>
              <div class="value">${clientName}</div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email Address</div>
              <div class="value">${clientEmail}</div>
            </div>
            
            <div class="field">
              <div class="label">📞 Phone Number</div>
              <div class="value">${clientPhone}</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="field">
              <div class="label">🔧 Service Requested</div>
              <div class="value">${serviceName}</div>
            </div>
            
            <div class="field">
              <div class="label">🏠 Property Type</div>
              <div class="value">${propertyType || 'Not specified'}</div>
            </div>
            
            <div class="field">
              <div class="label">📍 Location</div>
              <div class="value">${area || 'Not specified'}</div>
            </div>
            
            <div class="field">
              <div class="label">🔄 Frequency</div>
              <div class="value">${frequency === 'once' ? 'One-Time' : frequency === 'weekly' ? 'Weekly' : 'Bi-Weekly'}</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="field">
              <div class="label">📅 Preferred Date</div>
              <div class="value">${bookingDate}</div>
            </div>
            
            <div class="field">
              <div class="label">⏰ Preferred Time</div>
              <div class="value">${bookingTime || 'Not specified'}</div>
            </div>
            
            ${message ? `
            <div class="divider"></div>
            <div class="field">
              <div class="label">📝 Customer Message</div>
              <div class="value">${message}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">📊 Status</div>
              <div class="value"><span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px;">PENDING</span></div>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated notification from your booking system.</p>
            <p>© ${new Date().getFullYear()} Homework UAE. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const textContent = `
      NEW BOOKING RECEIVED
      ====================
      
      Booking ID: #${bookingId}
      
      CLIENT INFORMATION:
      Name: ${clientName}
      Email: ${clientEmail}
      Phone: ${clientPhone}
      
      SERVICE DETAILS:
      Service: ${serviceName}
      Property: ${propertyType || 'Not specified'}
      Location: ${area || 'Not specified'}
      Frequency: ${frequency === 'once' ? 'One-Time' : frequency === 'weekly' ? 'Weekly' : 'Bi-Weekly'}
      
      SCHEDULE:
      Date: ${bookingDate}
      Time: ${bookingTime || 'Not specified'}
      
      ${message ? `CUSTOMER MESSAGE:\n${message}\n` : ''}
      
      Status: PENDING
      
      This is an automated notification from your booking system.
    `;

    // ============= HARDCODED GMAIL CONFIGURATION =============
    console.log('📧 Creating transporter with hardcoded values...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Homeworkuae2026@gmail.com',
        pass: 'tpvrkxdoqhvxltcn',
      },
    });

   const mailOptions = {
  from: '"Homework UAE" <Homeworkuae2026@gmail.com>',
  to: 'sales@homeworkuae.com, sales@largifysolutions.com,' , 
  subject: `🔔 New Booking: ${clientName} - ${serviceName} (#${bookingId})`,
  html: htmlContent,
  text: textContent,
};

    console.log('📧 Sending email to: Homeworkuae2026@gmail.com');
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅✅✅ EMAIL SENT SUCCESSFULLY!');
    console.log('📧 Message ID:', info.messageId);
    
    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId
    });

  } catch (error: any) {
    console.error('❌❌❌ ERROR:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send email'
      },
      { status: 500 }
    );
  }
}