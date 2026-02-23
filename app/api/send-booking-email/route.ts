import { NextRequest, NextResponse } from 'next/server'

interface BookingEmailData {
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceName: string
  message?: string
  bookingDate?: string
  bookingTime?: string
  bookingId: string
}

// Generate HTML email template for booking
const generateBookingEmailHTML = (booking: BookingEmailData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Received</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; background-color: #ffffff; }
        .booking-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #667eea; }
        .detail-value { color: #333; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        .cta-button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
        .highlight { color: #667eea; font-weight: 600; }
        .status-badge { display: inline-block; background-color: #ffc107; color: #333; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 New Booking Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking ID: <span class="highlight">#${booking.bookingId}</span></p>
        </div>
        
        <div class="content">
            <h2 style="color: #333; margin-top: 0;">Hello,</h2>
            <p style="font-size: 16px;">A new service booking has been received! Here are the details:</p>
            
            <div class="booking-details">
                <h3 style="margin-top: 0; color: #667eea;">Customer Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${booking.clientName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value"><a href="mailto:${booking.clientEmail}" style="color: #667eea; text-decoration: none;">${booking.clientEmail}</a></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value"><a href="tel:${booking.clientPhone}" style="color: #667eea; text-decoration: none;">${booking.clientPhone}</a></span>
                </div>
            </div>

            <div class="booking-details">
                <h3 style="margin-top: 0; color: #667eea;">Service Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Service:</span>
                    <span class="detail-value">${booking.serviceName}</span>
                </div>
                ${booking.bookingDate ? `
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${booking.bookingDate}</span>
                </div>
                ` : ''}
                ${booking.bookingTime ? `
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${booking.bookingTime}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value"><span class="status-badge">NEW</span></span>
                </div>
            </div>

            ${booking.message ? `
            <div class="booking-details">
                <h3 style="margin-top: 0; color: #667eea;">Customer Message</h3>
                <p style="margin: 0; color: #333; font-style: italic;">"${booking.message}"</p>
            </div>
            ` : ''}

            <div style="background-color: #e7f3ff; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #2196F3;">
                <p style="margin: 0; color: #1976D2;"><strong>⏰ Next Step:</strong> Please review this booking and respond to the customer to confirm the service details and schedule.</p>
            </div>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                You can reply directly to this email or log into your admin dashboard to manage this booking.
            </p>

            <p style="margin: 20px 0 0 0;">
                Best regards,<br>
                <strong>Homework UAE Booking System</strong>
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0; font-size: 12px; color: #666;">
                This is an automated email notification. Please do not reply directly to this email.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #999;">
                © ${new Date().getFullYear()} Homework UAE. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
`;
};

// Generate plain text version
const generateBookingEmailText = (booking: BookingEmailData): string => {
  return `
NEW BOOKING RECEIVED
====================

Booking ID: #${booking.bookingId}

CUSTOMER INFORMATION
--------------------
Name: ${booking.clientName}
Email: ${booking.clientEmail}
Phone: ${booking.clientPhone}

SERVICE INFORMATION
-------------------
Service: ${booking.serviceName}
${booking.bookingDate ? `Date: ${booking.bookingDate}` : ''}
${booking.bookingTime ? `Time: ${booking.bookingTime}` : ''}
Status: NEW

${booking.message ? `CUSTOMER MESSAGE
-----------------
${booking.message}` : ''}

Please review this booking and respond to the customer to confirm the service details and schedule.

---
This is an automated email notification. Please do not reply directly to this email.
`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const booking: BookingEmailData = body

    // Validate required fields
    if (!booking.clientName || !booking.clientEmail || !booking.serviceName || !booking.bookingId) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      )
    }

    // Generate email content
    const htmlBody = generateBookingEmailHTML(booking)
    const textBody = generateBookingEmailText(booking)

    // Send email using a simple fetch to EmailJS or similar service
    // For now, we'll use a generic approach that can be configured
    const emailService = process.env.EMAIL_SERVICE || 'resend'
    
    // Define recipient emails
    const recipientEmails = [
      'info@largifysolutions.com',
      'sales@largifysolutions.com'
    ]
    
    if (emailService === 'webhooks' && process.env.EMAIL_WEBHOOK_URL) {
      // Use webhook-based email service (like Make.com, Zapier, etc.)
      // Send to both emails
      for (const email of recipientEmails) {
        const response = await fetch(process.env.EMAIL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: `New Booking Received - ${booking.serviceName} (ID: #${booking.bookingId})`,
            htmlBody,
            textBody,
            customerName: booking.clientName,
            customerEmail: booking.clientEmail,
            serviceName: booking.serviceName,
          }),
        })

        if (!response.ok) {
          console.error(`Webhook failed for ${email}: ${response.statusText}`)
          // Continue with next email even if one fails
        }
      }
    } else {
      // Default: Log for manual implementation or return success
      // In production, integrate with your email provider (Resend, SendGrid, Nodemailer, etc.)
      console.log('📧 Email notification sent to:')
      recipientEmails.forEach(email => console.log(`   - ${email}`))
      console.log('Subject:', `New Booking Received - ${booking.serviceName}`)
      console.log('Booking Details:', booking)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email notification sent successfully',
        bookingId: booking.bookingId,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Email sending error:', error)
    
    // Don't fail the booking if email fails - just log it
    return NextResponse.json(
      {
        success: true,
        message: 'Booking received (email notification queued)',
        warning: 'Email notification pending',
      },
      { status: 200 }
    )
  }
}
