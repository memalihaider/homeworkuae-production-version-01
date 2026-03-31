"use client"

import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
  Headset,
  Share2,
  Navigation,
  Music2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { defaultContactPage } from '@/lib/cms-data'
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

export default function Contact() {
  const profileData = {
    email: 'services@homeworkuae.com',
    phone: '+971507177059',
    whatsapp: '+971 50 717 7059'
  }
  const services: FirebaseService[] = PUBLIC_SERVICES.map((service) => ({
    id: service.id,
    name: service.name,
    categoryName: service.categoryName,
  }))
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const cms = defaultContactPage

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const saveInquiryToFirebase = async (inquiryData: any) => {
    try {
      const inquiryWithMeta = {
        ...inquiryData,
        status: "new",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "process-inquiry"), inquiryWithMeta)

      return {
        success: true,
        inquiryId: docRef.id,
      }
    } catch (error: any) {
      console.error("Firebase Error:", error)
      return {
        success: false,
        error: error.message || "Failed to save inquiry",
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
      // Prepare inquiry data for Firebase
      const inquiryData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        source: 'contact-page'
      }

      // Save to Firebase
      const result = await saveInquiryToFirebase(inquiryData)

      if (result.success) {
        alert('Inquiry submitted successfully! We will contact you soon.')
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        })
      } else {
        throw new Error(result.error || 'Failed to submit inquiry')
      }
    } catch (error) {
      console.error('Inquiry error:', error)
      alert('Error submitting inquiry. Please try again.')
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
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24 md:py-32">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=1600"
            alt="Contact Us"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/20 to-slate-950" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">
              Connect With Us
            </span>
            <h1 className="mb-6 text-4xl font-black leading-[0.9] tracking-tighter sm:text-5xl md:mb-8 md:text-7xl lg:text-8xl">
              {cms.heroTitle.split('\n').map((line, i) => (
                <span key={i}>{i > 0 && <br />}{i === cms.heroTitle.split('\n').length - 1 ? <span className="text-primary italic">{line}</span> : line}{' '}</span>
              ))}
            </h1>
            <p className="mx-auto max-w-2xl text-base font-medium uppercase leading-relaxed tracking-tight text-slate-300 italic sm:text-lg md:text-xl">
              {cms.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-white py-14 sm:py-18 md:py-24">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -ml-48 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="space-y-6 sm:space-y-8 lg:col-span-12 xl:col-span-5">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-3xl sm:rounded-[2.5rem] sm:p-8 md:p-10"
              >
                <div className="inline-flex items-center gap-3 text-primary mb-8">
                  <Headset className="h-6 w-6" />
                  <span className="text-sm font-black uppercase tracking-widest">Support Center</span>
                </div>
                <h3 className="mb-8 flex flex-col text-2xl font-black tracking-tight sm:mb-10 sm:text-3xl">
                  <span>LIVE IN CLEANER AND</span>
                  <span className="text-primary italic">HAPPIER SPACES</span>
                </h3>
                <p className="text-slate-400 font-bold mb-10 italic">Talk or Write to us to Discuss your Cleaning Needs</p>
                
                <div className="space-y-7 sm:space-y-10">
                  <a href={`tel:${profileData.phone}`} className="group flex gap-4 border-b border-white/5 pb-6 sm:gap-6 sm:pb-8">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                      <Phone className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Toll Free Line</div>
                      <div className="text-xl font-black group-hover:text-primary transition-colors tracking-tighter">{profileData.phone}</div>
                      <div className="text-slate-400 font-medium text-sm italic">Available 24/7 Support</div>
                    </div>
                  </a>

                  <a href={`mailto:${profileData.email}`} className="group flex gap-4 border-b border-white/5 pb-6 sm:gap-6 sm:pb-8">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                      <Mail className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Inquiry</div>
                      <div className="text-xl font-black group-hover:text-primary transition-colors truncate max-w-50 md:max-w-none">{profileData.email}</div>
                      <div className="text-slate-400 font-medium text-sm italic">Response within 2 hours</div>
                    </div>
                  </a>

                  <div className="group flex gap-4 sm:gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Our Location</div>
                      <div className="text-xl font-black tracking-tight leading-snug">Al Quoz – Dubai</div>
                      <div className="text-slate-400 font-medium text-sm italic underline decoration-primary/30">United Arab Emirates</div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-5 border-t border-white/5 pt-8 sm:mt-12 sm:pt-10">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Follow Our Work</div>
                  <div className="flex flex-wrap gap-4">
                    {cms.socialLinks.map((social, i) => {
                      const socialIcons: Record<string, typeof Facebook> = { Facebook, Instagram, Linkedin, Tiktok: Music2 }
                      const SocialIcon = socialIcons[social.platform] || Share2
                      return (
                        <a key={i} href={social.url} title={social.platform} className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg">
                          <SocialIcon className="h-6 w-6" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden rounded-[2rem] bg-linear-to-br from-green-500 to-emerald-600 p-6 text-white shadow-2xl shadow-green-500/20 sm:rounded-[2.5rem] sm:p-8 md:p-10"
              >
                <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-4 flex items-center gap-3">
                    <MessageSquare className="h-6 w-6" />
                    WhatsApp Chat
                  </h4>
                  <p className="text-green-50/80 mb-6 font-bold italic">Instantly book your cleaning service via WhatsApp.</p>
                  <a href={`https://wa.me/${profileData.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl">
                    {profileData.whatsapp} <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <MessageSquare className="absolute -bottom-10 -right-10 h-48 w-48 text-white/10 group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
            </div>

            <div className="lg:col-span-12 xl:col-span-7">
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
                  <span className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4 block underline decoration-primary/20 underline-offset-8">Booking Online</span>
                  <h3 className="mb-8 whitespace-pre-line text-3xl font-black uppercase tracking-tighter text-slate-900 sm:text-4xl md:mb-10 md:text-5xl">
                    TELL US ABOUT YOUR{"\n"}
                    <span className="text-primary italic lowercase">cleaning needs</span>
                  </h3>

                  <noscript>
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
                      JavaScript is disabled. Use quick contact options:
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <a href={`tel:${profileData.phone}`} className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">Call</a>
                        <a href={`mailto:${profileData.email}`} className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-wider text-white">Email</a>
                        <a href={`https://wa.me/${profileData.whatsapp.replace(/\D/g, '')}`} className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-2 text-xs font-black uppercase tracking-wider text-white">WhatsApp</a>
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
                          Process Inquiry <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative h-136 w-full bg-slate-200 sm:h-152 md:h-168 lg:h-150">
        <div className="absolute inset-0 z-0">
          <iframe 
            src={cms.mapEmbedUrl} 
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000"
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        
        <div className="container mx-auto px-4 h-full relative pointer-events-none">
          <div className="absolute bottom-12 left-4 md:left-12 pointer-events-auto">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
              className="max-w-sm rounded-3xl border border-slate-100 bg-white p-5 shadow-3xl sm:p-6 md:p-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                   <Navigation className="h-6 w-6" />
                </div>
                <div>
                   <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">Office HQ</h4>
                   <p className="text-xs text-slate-400 font-bold italic">Dubai Industrial Zone</p>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-600 mb-6 leading-relaxed italic border-l-2 border-primary pl-4">
                Al Quoz – Dubai – United Arab Emirates
              </p>
              <a 
                href="https://maps.google.com/?q=Al+Quoz+Dubai" 
                target="_blank" 
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary transition-colors"
                rel="noreferrer"
              >
                Get Location <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}