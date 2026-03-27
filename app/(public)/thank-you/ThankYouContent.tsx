'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Home, Phone, Hash, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('booking-id')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="mx-auto w-full max-w-4xl"
    >
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-[#0f2b8a] px-6 py-8 text-white md:px-10 md:py-10">
          <CheckCircle2 className="mb-4 h-14 w-14 text-emerald-300" />
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">Booking Confirmed</h1>
          <p className="mt-2 text-base text-blue-100 md:text-lg">
            Thank you for choosing Homework UAE. Your request has been submitted successfully.
          </p>
        </div>

        <div className="space-y-8 px-6 py-8 md:px-10 md:py-10">
          {bookingId && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Hash className="h-4 w-4" /> Booking ID
              </p>
              <p className="break-all text-base font-bold text-slate-900">{bookingId}</p>
            </div>
          )}

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">What happens next</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">
              Our team will contact you shortly to finalize scheduling and service details. For priority support,
              call us directly.
            </p>
            <a
              href="tel:+971507177059"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              <Phone className="h-4 w-4" /> +971 50 717 7059
            </a>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push('/services')}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              View Services <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => router.push('/')}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
            >
              <Home className="h-4 w-4" /> Back To Home
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}