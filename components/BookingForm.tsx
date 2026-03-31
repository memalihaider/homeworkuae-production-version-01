"use client"

import { 
  ArrowRight, 
  Send
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { PUBLIC_SERVICES } from '@/lib/public-services'

interface FirebaseService {
  id: string
  name: string
  categoryName: string
}

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

interface BookingFormProps {
  preselectedServiceName?: string
}

const CONTACT = {
  phone: '+971507177059',
  email: 'services@homeworkuae.com',
  whatsapp: '+971 50 717 7059',
}

export default function BookingForm({ preselectedServiceName }: BookingFormProps) {
  const router = useRouter()
  const services = useMemo<FirebaseService[]>(() => (
    PUBLIC_SERVICES.map((service) => ({
      id: service.id,
      name: service.name,
      categoryName: service.categoryName,
    }))
  ), [])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!preselectedServiceName) {
      return
    }

    const matchedService = services.find((service) =>
      service.name.toLowerCase() === preselectedServiceName.toLowerCase()
    )

    if (matchedService) {
      setFormData((prev) => ({
        ...prev,
        service: matchedService.id,
      }))
    }
  }, [preselectedServiceName, services])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const saveBookingToFirebase = async (bookingData: any) => {
    try {
      const bookingWithMeta = {
        ...bookingData,
        status: "new",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "bookings"), bookingWithMeta)

      return {
        success: true,
        bookingId: docRef.id,
      }
    } catch (error: any) {
      console.error("Firebase Error:", error)
      return {
        success: false,
        error: error.message || "Failed to save booking",
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.service) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      // Get service name from selected service ID
      const selectedService = services.find(s => s.id === formData.service)
      
      // Prepare booking data for Firebase
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceId: formData.service,
        service: selectedService?.name || 'Service',
        message: formData.message,
        source: 'service-page-booking'
      }

      // Save to Firebase first and wait for confirmation
      const result = await saveBookingToFirebase(bookingData)

      // Only proceed if booking was successfully saved
      if (!result.success) {
        throw new Error(result.error || 'Failed to save booking to database')
      }

      const bookingId = result.bookingId
      if (!bookingId) {
        throw new Error('Booking ID was not returned after saving')
      }

      // Send email notification (non-blocking)
      try {
        await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: formData.name,
            clientEmail: formData.email,
            clientPhone: formData.phone,
            serviceName: selectedService?.name || 'Service',
            message: formData.message,
            bookingId,
            source: 'service-page-booking',
          }),
        })
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
        // Continue with success even if email fails - booking is already saved
      }
      
      // Redirect to clean thank-you URL
      router.push('/thank-you')
      
    } catch (error) {
      console.error('Booking submission error:', error)
      alert(`Error submitting booking: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group services by category
  const groupServicesByCategory = () => {
    const grouped: { [key: string]: FirebaseService[] } = {}
    
    services.forEach((service) => {
      const category = service.categoryName || 'General'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(service)
    })
    
    return grouped
  }



  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-3xl sm:rounded-[2.5rem] sm:p-8 md:p-12 xl:rounded-[3.5rem] xl:p-14"
    >
        <div className="absolute right-0 top-0 p-4 sm:p-6 md:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-slate-50 animate-pulse sm:h-16 sm:w-16 md:h-20 md:w-20">
             <Send className="h-8 w-8 text-primary/20" />
          </div>
        </div>

        <div className="max-w-2xl relative z-10">
          <span className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4 block underline decoration-primary/20 underline-offset-8">Book Now</span>
          <h3 className="mb-8 whitespace-pre-line text-3xl font-black uppercase tracking-tighter text-slate-900 sm:text-4xl md:mb-10 md:text-5xl">
            BOOK YOUR{"\n"}
            <span className="text-primary italic lowercase">cleaning service</span>
          </h3>

          <noscript>
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              JavaScript is disabled. Use quick contact options:
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">Call</a>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-wider text-white">Email</a>
                <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`} className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-2 text-xs font-black uppercase tracking-wider text-white">WhatsApp</a>
              </div>
            </div>
          </noscript>
          
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 md:space-y-10">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 font-bold text-slate-900 shadow-inner transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 sm:rounded-3xl sm:px-6 sm:py-5 md:px-8"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 font-bold text-slate-900 shadow-inner transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 sm:rounded-3xl sm:px-6 sm:py-5 md:px-8"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+971 5X XXX XXXX"
                  required
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 font-bold text-slate-900 shadow-inner transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 sm:rounded-3xl sm:px-6 sm:py-5 md:px-8"
                />
              </div>
              <div className="space-y-3 relative group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Required *</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 font-black text-slate-900 shadow-inner transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 sm:rounded-3xl sm:px-6 sm:py-5 md:px-8"
                >
                  <option value="">Select a Service</option>
                  {Object.entries(groupServicesByCategory()).map(([category, categoryServices]) => (
                    <optgroup key={category} label={category}>
                      {categoryServices.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ArrowRight className="pointer-events-none absolute bottom-5 right-5 h-5 w-5 rotate-90 text-primary sm:bottom-6 sm:right-6" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Tell us about the space, size, and any special requirements..."
                className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-5 py-5 font-bold text-slate-900 shadow-inner transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 sm:rounded-4xl sm:px-6 sm:py-6 md:px-8"
              ></textarea>
            </div>

            <motion.button 
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-2xl transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-4xl sm:py-5 sm:text-xs sm:tracking-[0.2em] md:py-6"
            >
              {isSubmitting ? (
                <>
                  Processing... <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </>
              ) : (
                <>
                  Book Now <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    )
  }
