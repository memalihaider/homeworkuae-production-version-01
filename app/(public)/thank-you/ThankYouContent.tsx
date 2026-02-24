'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle, Home, Mail, Phone, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bookingId, setBookingId] = useState<string>('')

  useEffect(() => {
    const id = searchParams.get('booking-id')
    if (id) {
      setBookingId(id)
    }
  }, [searchParams])

  const handleHome = () => {
    router.push('/')
  }

  const handleServices = () => {
    router.push('/services')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl w-full"
    >
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="inline-block"
          >
            <CheckCircle className="h-24 w-24 mx-auto" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">Thank You for Your Booking!</h1>
          <p className="text-green-100 mt-2">Your booking has been successfully submitted</p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Booking ID */}
          {bookingId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-8"
            >
              <p className="text-sm text-green-700">Booking ID</p>
              <p className="text-2xl font-bold text-green-900 font-mono mt-1">#{bookingId}</p>
            </motion.div>
          )}

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-gray-700 text-lg leading-relaxed">
              We have received your booking request and will review all the details. Our team will contact you shortly to confirm the service and provide any additional information you may need.
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4">What Happens Next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                <span className="text-gray-700">We'll review your booking details and service requirements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                <span className="text-gray-700">Our team will contact you within 24 hours to confirm the service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                <span className="text-gray-700">We'll schedule the service at a convenient time for you</span>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            <a
              href="mailto:support@homeworkuae.com"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="h-6 w-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Email Us</p>
                <p className="text-sm font-semibold text-gray-900">service@homeworkuae.com</p>
              </div>
            </a>
            <a
              href="tel:+97145678910"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Phone className="h-6 w-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Call Us</p>
                <p className="text-sm font-semibold text-gray-900">80046639675</p>
              </div>
            </a>
          </motion.div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-amber-50 border border-amber-200 p-4 rounded mb-8"
          >
            <p className="text-sm text-amber-900">
              <strong>💡 Tip:</strong> Save your booking ID for future reference. Check your email inbox (and spam folder) for our confirmation message.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={handleServices}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowRight className="h-5 w-5" />
              View More Services
            </button>
            <button
              onClick={handleHome}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 text-center text-sm text-gray-600 border-t">
          <p>
            Need help?{' '}
            <a href="mailto:support@homeworkuae.com" className="text-blue-600 hover:underline font-semibold">
              Contact our support team
            </a>
          </p>
        </div>
      </div>

      {/* Additional Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Homework UAE?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-2">Professional Team</h4>
            <p className="text-sm text-gray-600">Trained and experienced professionals for all services</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <h4 className="font-semibold text-gray-900 mb-2">Reliable & On-Time</h4>
            <p className="text-sm text-gray-600">We value your time and deliver quality work promptly</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">✨</div>
            <h4 className="font-semibold text-gray-900 mb-2">100% Satisfaction</h4>
            <p className="text-sm text-gray-600">Your satisfaction is our top priority</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
