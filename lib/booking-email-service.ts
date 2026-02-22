/**
 * Booking Email Service
 * Handles sending email notifications when a new booking is received
 */

export interface BookingEmailData {
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceName: string
  message?: string
  bookingDate?: string
  bookingTime?: string
  bookingId: string
}

/**
 * Send booking notification email
 * Sends to services@homeworkuae.com by default
 */
export async function sendBookingEmail(booking: BookingEmailData): Promise<boolean> {
  try {
    const response = await fetch('/api/send-booking-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    })

    if (!response.ok) {
      console.error('Failed to send booking email:', response.statusText)
      return false
    }

    const data = await response.json()
    console.log('Booking email sent successfully:', data)
    return true
  } catch (error) {
    console.error('Error sending booking email:', error)
    return false
  }
}

/**
 * Generate a summary of the booking for logging
 */
export function getBookingSummary(booking: BookingEmailData): string {
  return `
📧 Booking Email Summary:
- Client: ${booking.clientName} (${booking.clientEmail})
- Phone: ${booking.clientPhone}
- Service: ${booking.serviceName}
- Booking ID: #${booking.bookingId}
${booking.message ? `- Message: ${booking.message}` : ''}
`
}
