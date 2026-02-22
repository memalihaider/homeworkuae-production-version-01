"use client"

import { 
  ArrowRight, 
  Send, 
  CheckCircle2,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  showSuccessModal?: boolean
}

export default function BookingForm({ preselectedServiceName, showSuccessModal = true }: BookingFormProps) {
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
  const [showSuccess, setShowSuccess] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  // Set client flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check for success state in URL
  useEffect(() => {
    if (!isClient) return
    
    const isSuccess = searchParams.get('thankyou')
    if (isSuccess === 'true' && showSuccessModal) {
      setShowSuccess(true)
    }
  }, [searchParams, showSuccessModal, isClient])

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
        setSubmittedData({
          bookingId: result.bookingId,
          ...formData,
          serviceName: selectedService?.name
        })
        
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
        
        // Update URL to include success state
        if (showSuccessModal) {
          router.push(`?thankyou=true&booking-id=${result.bookingId}`, { scroll: false })
          setShowSuccess(true)
        } else {
          alert('Booking submitted successfully! We will contact you soon.')
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: preselectedServiceName && services.find(s => s.name.toLowerCase() === preselectedServiceName.toLowerCase())?.id || '',
          message: ''
        })
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

  const closeSuccess = () => {
    setShowSuccess(false)
    router.push(window.location.pathname, { scroll: false })
  }

  return (
    <>
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

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && submittedData && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-grid-white/[0.2]" />
                </div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="relative z-10 flex justify-center mb-6"
                >
                  <div className="bg-white rounded-full p-4">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                </motion.div>
                
                <h4 className="text-2xl font-black text-white text-center mb-2">Thank you for the booking</h4>
                <p className="text-green-50 text-center font-bold text-sm">
                  Your request has been received
                </p>
              </div>

              <div className="p-8 space-y-4">
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 font-bold">
                    Thank you <span className="text-primary font-black">{submittedData.name}</span>! We'll review your booking and contact you within 2 hours.
                  </p>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</span>
                      <span className="font-black text-slate-900 text-right">{submittedData.serviceName}</span>
                    </div>
                    <div className="flex justify-between items-start border-t border-slate-200 pt-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking ID</span>
                      <span className="font-mono text-xs text-primary font-black">{submittedData.bookingId.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={closeSuccess}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2"
                >
                  Close <X className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
