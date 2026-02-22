# Booking Email System Setup Guide

## Overview

The booking email system automatically sends notification emails to `services@homeworkuae.com` whenever a customer submits a booking from any service page.

## How It Works

1. **Customer submits booking form** → Service page
2. **Booking saved to Firebase** → `bookings` collection
3. **Email API triggered** → `/api/send-booking-email`
4. **Notification sent** → `services@homeworkuae.com`

## Email Contents

Each booking email includes:
- **Customer Information**: Name, email, phone number
- **Service Details**: Service name, booking date/time (if provided)
- **Customer Message**: Any additional notes from the booking form
- **Status**: New booking with unique Booking ID

## Setup Instructions

### Option 1: Using Make.com (Recommended for Easy Setup)

1. **Go to Make.com** and create a free account
2. **Create a new scenario**:
   - Add a "Webhooks - Custom webhook" trigger
   - Copy the webhook URL
3. **Add an Email action**:
   - Choose your email provider (Gmail, Outlook, etc.)
   - Connect your account
   - Configure email fields (recipient, subject, body)
4. **Update `.env.local`**:
   ```
   EMAIL_SERVICE=webhooks
   EMAIL_WEBHOOK_URL=https://hook.make.com/your-webhook-id
   BOOKING_NOTIFICATION_EMAIL=services@homeworkuae.com
   ```

### Option 2: Using Zapier

1. **Go to Zapier.com** and create a free account
2. **Create a new Zap**:
   - Trigger: Webhooks by Zapier - Catch Raw Hook
   - Copy the webhook URL
3. **Action**: Send an email via your provider
4. **Update `.env.local`**:
   ```
   EMAIL_SERVICE=webhooks
   EMAIL_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your-id
   BOOKING_NOTIFICATION_EMAIL=services@homeworkuae.com
   ```

### Option 3: Using Resend (For Developers)

1. **Install Resend**:
   ```bash
   npm install resend
   ```

2. **Get your API key** from [resend.com](https://resend.com)

3. **Update `app/api/send-booking-email/route.ts`**:
   ```typescript
   import { Resend } from 'resend'

   const resend = new Resend(process.env.RESEND_API_KEY)

   // In the POST handler, replace the webhook section with:
   await resend.emails.send({
     from: 'bookings@yourdomain.com',
     to: process.env.BOOKING_NOTIFICATION_EMAIL || 'services@homeworkuae.com',
     subject: `New Booking Received - ${booking.serviceName} (ID: #${booking.bookingId})`,
     html: htmlBody,
     text: textBody,
   })
   ```

4. **Update `.env.local`**:
   ```
   RESEND_API_KEY=your_api_key_here
   BOOKING_NOTIFICATION_EMAIL=services@homeworkuae.com
   ```

### Option 4: Using Gmail (With Nodemailer)

1. **Enable "Less secure app access"** in Gmail settings
2. **Install Nodemailer**:
   ```bash
   npm install nodemailer
   ```

3. **Update `.env.local`**:
   ```
   GMAIL_EMAIL=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   BOOKING_NOTIFICATION_EMAIL=services@homeworkuae.com
   ```

4. **Update `app/api/send-booking-email/route.ts`** with Nodemailer implementation

## Testing

### Manual Test:
1. Navigate to any service page: `http://localhost:3000/services/apartment-deep-cleaning`
2. Fill out the booking form
3. Submit the booking
4. Check your selected email service for the notification
5. Confirm the booking appears in the admin dashboard

### Via curl:
```bash
curl -X POST http://localhost:3000/api/send-booking-email \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "John Doe",
    "clientEmail": "john@example.com",
    "clientPhone": "+971501234567",
    "serviceName": "Apartment Deep Cleaning",
    "message": "Please clean the bedroom carefully",
    "bookingId": "test123"
  }'
```

## Environment Variables

Create `.env.local` in the project root:

```env
# Email Service Configuration
EMAIL_SERVICE=webhooks  # or 'manual', 'resend', 'gmail'
EMAIL_WEBHOOK_URL=https://your-webhook-url.com/webhook
BOOKING_NOTIFICATION_EMAIL=services@homeworkuae.com

# For Resend
RESEND_API_KEY=re_your_api_key

# For Gmail
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

## Current Default Behavior

If no email service is configured:
- ✅ Bookings still save to Firebase normally
- ✅ Success popup shows to customer
- ✅ Admin dashboard shows the booking in real-time
- ⚠️ Email notifications are logged to console (development mode)

To see the email that would be sent in development:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Submit a booking
4. Look for "📧 Email would be sent to:" message

## Troubleshooting

### Emails not sending?

1. **Check Firebase connection**: Bookings should still save
2. **Check webhook URL**: Verify it's correct in `.env.local`
3. **Check console logs**: Look for email service errors
4. **Test webhook directly**: Use curl command above

### Email formatting issues?

- Check your email provider's spam filter
- Verify HTML/text email support in your provider
- Test with plain text emails first

## Support

For questions or issues:
- Check the `.env.example` file for all available options
- Review browser console for error messages
- Verify Firebase connection is working (bookings still save)
- Test with a simple webhook service like Make.com or Zapier first

---

**Note**: The current implementation defaults to logging emails to console. Configure your preferred email service to actually send notifications.
