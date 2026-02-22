"use client"

import { 
  ArrowRight, 
  Send
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore'
import { useRouter, useSearchParams } from 'next/navigation'

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

export default function BookingForm({ preselectedServiceName }: BookingFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [services, setServices] = useState<FirebaseService[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set client flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch active services from Firebase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRef = collection(db, 'services')
        const q = query(servicesRef, where('status', '==', 'ACTIVE'))
        const querySnapshot = await getDocs(q)
        
        const servicesData: FirebaseService[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          servicesData.push({
            id: doc.id,
            name: data.name || 'Service',
            categoryName: data.categoryName || 'General'
          })
        })
        
        setServices(servicesData)
        
        // Pre-select service if name is provided
        if (preselectedServiceName) {
          const matchedService = servicesData.find(s => 
            s.name.toLowerCase() === preselectedServiceName.toLowerCase()
          )
          if (matchedService) {
            setFormData(prev => ({
              ...prev,
              service: matchedService.id
            }))
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    fetchServices()
  }, [preselectedServiceName])

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

      // Save to Firebase
      const result = await saveBookingToFirebase(bookingData)

      if (result.success) {
        // Send email notification to services@homeworkuae.com
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
              bookingId: result.bookingId,
            }),
          })
        } catch (emailError) {
          console.error('Email notification failed:', emailError)
          // Continue with success even if email fails
        }
        
        // Redirect to thank you page
        router.push(`/thank-you?booking-id=${result.bookingId}`)
      } else {
        throw new Error(result.error || 'Failed to submit booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Error submitting booking. Please try again.')
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
      className="p-10 md:p-16 bg-white rounded-[3.5rem] border border-slate-100 shadow-3xl relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-8">
          <div className="h-20 w-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center animate-pulse">
             <Send className="h-8 w-8 text-primary/20" />
          </div>
        </div>

        <div className="max-w-2xl relative z-10">
          <span className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4 block underline decoration-primary/20 underline-offset-8">Book Now</span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tighter uppercase whitespace-pre-line">
            BOOK YOUR{"\n"}
            <span className="text-primary italic lowercase">cleaning service</span>
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-bold text-slate-900 shadow-inner"
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
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-bold text-slate-900 shadow-inner"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+971 5X XXX XXXX"
                  required
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-bold text-slate-900 shadow-inner"
                />
              </div>
              <div className="space-y-3 relative group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Required *</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-black text-slate-900 appearance-none shadow-inner cursor-pointer"
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
                <ArrowRight className="absolute right-6 bottom-6 h-5 w-5 rotate-90 text-primary pointer-events-none" />
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
                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-4xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-bold text-slate-900 resize-none shadow-inner"
              ></textarea>
            </div>

            <motion.button 
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-900 text-white rounded-4xl py-6 font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
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
