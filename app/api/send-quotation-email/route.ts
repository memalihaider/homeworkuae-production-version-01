import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface SendQuotationEmailBody {
  toEmail: string
  clientName: string
  quoteNumber: string
  company?: string
  total?: number
  currency?: string
  validUntil?: string
  notes?: string
  pdfBase64: string
  pdfFileName?: string
}

const resolveTransport = () => {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  }

  // Fallback to existing configured Gmail account used in this project.
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Homeworkuae2026@gmail.com',
      pass: 'tpvrkxdoqhvxltcn',
    },
  })
}

const asCurrency = (amount?: number, currency?: string) => {
  if (typeof amount !== 'number') return 'N/A'
  return `${amount.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency || 'AED'}`
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<SendQuotationEmailBody>

    if (!body.toEmail || !body.quoteNumber || !body.pdfBase64) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: toEmail, quoteNumber, pdfBase64',
        },
        { status: 400 },
      )
    }

    const transporter = resolveTransport()

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin:0 0 12px;">Quotation ${body.quoteNumber}</h2>
        <p>Hello ${body.clientName || 'Customer'},</p>
        <p>Please find attached your quotation.</p>
        <div style="margin: 16px 0; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
          <p style="margin: 0 0 6px;"><strong>Quotation Number:</strong> ${body.quoteNumber}</p>
          <p style="margin: 0 0 6px;"><strong>Company:</strong> ${body.company || 'N/A'}</p>
          <p style="margin: 0 0 6px;"><strong>Total:</strong> ${asCurrency(body.total, body.currency)}</p>
          <p style="margin: 0;"><strong>Valid Until:</strong> ${body.validUntil || 'N/A'}</p>
        </div>
        ${body.notes ? `<p><strong>Notes:</strong> ${body.notes}</p>` : ''}
        <p>Thank you,<br/>Homework UAE</p>
      </div>
    `

    const text = [
      `Quotation ${body.quoteNumber}`,
      '',
      `Hello ${body.clientName || 'Customer'},`,
      'Please find attached your quotation.',
      '',
      `Quotation Number: ${body.quoteNumber}`,
      `Company: ${body.company || 'N/A'}`,
      `Total: ${asCurrency(body.total, body.currency)}`,
      `Valid Until: ${body.validUntil || 'N/A'}`,
      body.notes ? `Notes: ${body.notes}` : '',
      '',
      'Thank you,',
      'Homework UAE',
    ]
      .filter(Boolean)
      .join('\n')

    const info = await transporter.sendMail({
      from: '"Homework UAE" <Homeworkuae2026@gmail.com>',
      to: body.toEmail,
      subject: `Quotation ${body.quoteNumber} from Homework UAE`,
      html,
      text,
      attachments: [
        {
          filename: body.pdfFileName || `Quotation_${body.quoteNumber}.pdf`,
          content: body.pdfBase64,
          encoding: 'base64',
          contentType: 'application/pdf',
        },
      ],
    })

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      sentTo: body.toEmail,
    })
  } catch (error: any) {
    console.error('Error sending quotation email:', error)

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to send quotation email',
      },
      { status: 500 },
    )
  }
}
