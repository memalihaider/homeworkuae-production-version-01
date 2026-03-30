"use client"

import {
  CheckCircle2, ArrowRight, Star, Shield, Clock, Users, Award, Sparkles,
  ShieldCheck, Zap, ChevronLeft, ChevronRight,
  Home, Building2, Wind, ShieldAlert, Utensils, Construction,
  Sofa, Layout, Waves, Dumbbell, Calendar, BookOpen, ArrowUpRight, MessageCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { INITIAL_BLOG_POSTS } from '@/lib/blog-data'
import { INITIAL_TESTIMONIALS } from '@/lib/testimonials-data'
import { defaultHomePage } from '@/lib/cms-data'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

// Reusable CTA Button Component
interface CTAButtonProps {
  text: string
  href: string
  variant?: "primary" | "secondary" | "dark"
  icon?: React.ComponentType<{ className?: string }> | null
  className?: string
}

const CTAButton = ({ text, href, variant = "primary", icon: Icon = null, className = "" }: CTAButtonProps) => {
  const baseStyles = "px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-200"
  const variants = {
    primary: "bg-primary text-white hover:bg-pink-700 shadow-md shadow-primary/20",
    secondary: "bg-white text-primary hover:bg-slate-50 shadow-md",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-md",
  }

  return (
    <a
      href={href}
      className={`${baseStyles} ${variants[variant]} inline-flex items-center gap-2 hover:-translate-y-0.5 ${className}`}
    >
      {text}
      {Icon && <Icon className="h-4 w-4" />}
    </a>
  )
}

export default function HomePage() {
  // Light scroll-reveal animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.07, ease: 'easeOut' as const } })
  }
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' as const } }
  }

  const [blogSliderIndex, setBlogSliderIndex] = useState(0)
  const [airQuality, setAirQuality] = useState(72)
  const [airQualityStatus, setAirQualityStatus] = useState("Moderate")
  const [airQualityColor, setAirQualityColor] = useState("text-amber-500")
  const [heroWhatsapp, setHeroWhatsapp] = useState('+971 50 717 7059')
  const cmsData = defaultHomePage
  const whatsappDigits = heroWhatsapp.replace(/\D/g, '')
  const whatsappHref = whatsappDigits ? `https://wa.me/${whatsappDigits}` : '#'

  const heroTexts = cmsData.hero.headings
  const activeHeroText = heroTexts[0] ?? 'PREMIUM\nCLEANING'
  const activeHeroImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=80'
  const trustBannerGradient = 'linear-gradient(135deg, #039ED9 0%, var(--primary) 100%)'
  const trustBannerStats: Array<{ label: string; value: string; icon: React.ComponentType<{ className?: string }> }> = [
    { label: 'Satisfied Clients', value: '20,000+', icon: Users },
    { label: 'Service Rating', value: '4.9/5.0', icon: Star },
    { label: 'Expert Cleaners', value: '250+', icon: Award },
    { label: 'City Coverage', value: '100%', icon: Building2 },
    { label: 'Google Reviews', value: '500+', icon: Users },
  ]

  // Services data with Icons
  // Services data with Icons - merge CMS data with local icon mapping
  const serviceIcons: Record<string, React.ReactNode> = {
    "Residential Cleaning": <Home className="h-7 w-7" />,
    "Villa Deep Cleaning": <Building2 className="h-7 w-7" />,
    "AC Duct Cleaning": <Wind className="h-7 w-7" />,
    "Office Deep Cleaning": <ShieldAlert className="h-7 w-7" />,
    "Kitchen Deep Cleaning": <Utensils className="h-7 w-7" />,
    "Apartment Deep Cleaning": <Building2 className="h-7 w-7" />,
    "Post Construction Cleaning": <Construction className="h-7 w-7" />,
    "Sofa Deep Cleaning": <Sofa className="h-7 w-7" />,
    "Window Cleaning": <Layout className="h-7 w-7" />,
    "Carpet Deep Cleaning": <Sparkles className="h-7 w-7" />,
    "Water Tank Cleaning": <Waves className="h-7 w-7" />,
    "Gym Deep Cleaning": <Dumbbell className="h-7 w-7" />,
  }
  const services = cmsData.services.map(s => ({
    ...s,
    icon: serviceIcons[s.title] || <Sparkles className="h-7 w-7" />,
  }))

  // Blog posts data - using actual blog posts from database
  const blogs = INITIAL_BLOG_POSTS.slice(0, 6).map(post => ({
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    category: post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    date: new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: `${post.readTime} min read`,
    href: `/blog/${post.slug}`
  }))

  // Testimonials data from database
  const testimonials = INITIAL_TESTIMONIALS.slice(0, 8).map(testimonial => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    image: testimonial.image,
    text: testimonial.text,
    rating: testimonial.rating
  }))

  const getAirQualityStatus = (aqi: number) => {
    if (aqi <= 50) return { status: "Good", color: "text-green-500" }
    if (aqi <= 100) return { status: "Moderate", color: "text-yellow-500" }
    if (aqi <= 150) return { status: "Unhealthy for Sensitive Groups", color: "text-orange-500" }
    if (aqi <= 200) return { status: "Unhealthy", color: "text-red-500" }
    if (aqi <= 300) return { status: "Very Unhealthy", color: "text-red-700" }
    return { status: "Hazardous", color: "text-red-900" }
  }

  useEffect(() => {
    let isMounted = true

    const fetchAirQualityData = async () => {
      if (!isMounted) return
      try {
        const response = await fetch(
          'https://air-quality-api.open-meteo.com/v1/air_quality?latitude=25.2048&longitude=55.2708&current=us_aqi'
        )

        if (!isMounted) return

        const data = await response.json()

        if (!isMounted) return

        const aqi = Math.round(data.current?.us_aqi || 72)
        const { status, color } = getAirQualityStatus(aqi)

        setAirQuality(Math.min(aqi, 100))
        setAirQualityStatus(status)
        setAirQualityColor(color)
      } catch (error) {
        if (!isMounted) return
        console.error('Error fetching air quality:', error)
      }
    }

    fetchAirQualityData()

    // Fetch real-time air quality every 10 minutes
    const airQualityInterval = setInterval(() => {
      if (isMounted) fetchAirQualityData()
    }, 10 * 60 * 1000)

    return () => {
      isMounted = false
      clearInterval(airQualityInterval)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchWhatsappFromSettings = async () => {
      try {
        const settingsRef = doc(db, 'profile-setting', 'admin-settings')
        const settingsSnap = await getDoc(settingsRef)

        if (!isMounted || !settingsSnap.exists()) return

        const settings = settingsSnap.data() as {
          profile?: {
            whatsapp?: string
          }
        }

        const configuredWhatsapp = settings.profile?.whatsapp?.trim()
        if (configuredWhatsapp) {
          setHeroWhatsapp(configuredWhatsapp)
        }
      } catch (error) {
        console.warn('Could not load WhatsApp number from settings:', error)
      }
    }

    fetchWhatsappFromSettings()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="flex flex-col overflow-hidden selection:bg-primary selection:text-white">

      {/* Hero Section - Enhanced Premium */}
      <section
        className="relative pt-16 pb-24 px-4 md:px-8 min-h-[92vh] flex items-center overflow-hidden"
      >
        {/* Simplified static background for faster paint */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-white via-slate-50/90 to-pink-50/40" />
          <div className="absolute -top-20 -right-20 w-175 h-175 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-25 -left-25 w-125 h-125 bg-[#039ED9]/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/3 w-75 h-75 bg-rose-400/10 rounded-full blur-[90px]" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(#039ED9 1px, transparent 1px), linear-gradient(90deg, #039ED9 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          />
        </div>

        <div className="container mx-auto relative z-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              className="w-full lg:w-3/5 space-y-8"
            >
              <div>
                {/* Animated badge with shimmer */}
                <motion.div
                  variants={fadeUp}
                  className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/20 mb-6 overflow-hidden group cursor-default"
                >
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
                    className="absolute inset-0 bg-linear-to-r from-transparent via-primary/15 to-transparent skew-x-[-20deg]"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                  />
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.12em] relative z-10">{cmsData.hero.badgeText}</span>
                </motion.div>

                {/* Hero heading */}
                <div className="relative min-h-42 md:min-h-52">
                  <h1 className="absolute top-0 left-0 text-5xl md:text-7xl font-black text-[#039ED9] leading-[0.95] tracking-tight">
                    {activeHeroText.split('\n')[0]} <br />
                    <span className="text-primary">
                      {activeHeroText.split('\n')[1]}
                    </span>
                  </h1>
                </div>

                <motion.p
                  variants={fadeUp}
                  className="mt-6 text-base md:text-lg text-slate-500 max-w-lg leading-relaxed"
                >
                  {cmsData.hero.subtitle}
                </motion.p>

                {/* Feature pills */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-5">
                  {cmsData.hero.featureTags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-sm"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5 mt-8">
                  <motion.a
                    href={cmsData.hero.ctaLink}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative px-8 py-3.5 rounded-full font-bold text-sm bg-primary text-white shadow-lg shadow-primary/30 inline-flex items-center gap-2 overflow-hidden group"
                  >
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                    />
                    Book your service
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.a>

                  <motion.a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="px-8 py-3.5 rounded-full font-bold text-sm bg-white text-emerald-700 border border-emerald-200 shadow-md inline-flex items-center gap-2 hover:bg-emerald-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp {heroWhatsapp}
                  </motion.a>

                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {cmsData.hero.avatarImages.map((src, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.08, duration: 0.3 }}
                          className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm"
                        >
                          <NextImage
                            src={src}
                            alt="Happy client"
                            width={40}
                            height={40}
                            loading="lazy"
                            sizes="40px"
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.12, duration: 0.3 }}
                        className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 shadow-sm"
                      >
                        20K+
                      </motion.div>
                    </div>
                    <div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">Trusted by 20,000+</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Content: Video Card & Widgets */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full lg:w-2/5 relative"
            >
              {/* Floating glow ring */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border border-primary/20 blur-[2px] z-0"
              />

              <div className="relative aspect-square max-w-115 mx-auto">

                {/* Main Image Card — subtle float wraps outer only */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 z-20"
                >
                  <div className="relative w-full h-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/30">
                    <img
                      src={activeHeroImage}
                      alt="Professional cleaning service"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3 w-3 fill-primary text-primary" />)}
                        </div>
                        <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Premium Rated</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Air Quality Widget */}
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7, type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="absolute -top-8 -right-8 w-44 h-44 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl z-30 border border-slate-100/80 cursor-default"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Wind className="h-5 w-5 text-[#039ED9]" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-2 w-2 rounded-full bg-green-500"
                      />
                    </div>
                    <div>
                      <motion.div
                        key={airQuality}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-3xl font-black text-slate-900 leading-none"
                      >
                        {airQuality}
                      </motion.div>
                      <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Air Quality Index</div>
                      <div className={`text-[9px] font-bold mt-0.5 ${airQualityColor}`}>{airQualityStatus}</div>
                    </div>
                  </div>
                </motion.div>

                {/* Verified Badge Widget */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9, type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl z-30 border border-slate-100/80 cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ boxShadow: ["0 0 0 0 rgba(236,72,153,0.3)", "0 0 0 8px rgba(236,72,153,0)", "0 0 0 0 rgba(236,72,153,0)"] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
                    >
                      <ShieldCheck className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Verified Pros</div>
                      <div className="text-[10px] text-slate-500">Background Checked</div>
                    </div>
                  </div>
                </motion.div>

                {/* Live tag widget */}
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.1, type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute top-1/2 -right-10 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-xl z-30 border border-slate-100/80 flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-rose-500"
                  />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Live Support</span>
                </motion.div>

                {/* Subtle Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 rounded-full blur-[100px] z-0" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="relative z-30 -mt-8 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-6xl mx-auto rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_24px_50px_-24px_rgba(3,158,217,0.45)] text-white"
          style={{ backgroundImage: trustBannerGradient }}
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6 md:gap-8">
            {trustBannerStats.map((stat, i) => {
              const StatIcon = stat.icon
              return (
                <motion.div key={i} variants={fadeUp} custom={i} className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <StatIcon className="h-4 w-4 text-white/90" />
                    <span className="text-xl md:text-2xl font-black tracking-tight">{stat.value}</span>
                  </div>
                  <div className="text-[10px] font-medium text-white/80 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Certifications & Awards Section */}
      <section className="py-16 bg-linear-to-b from-white to-slate-50/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary font-semibold text-[11px] uppercase tracking-wider mb-3">
              <Award className="h-3 w-3" />
              Certifications & Awards
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Recognized <span className="text-primary">Excellence</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Certified by leading authorities and recognized for our commitment to quality</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {cmsData.certifications.map((cert, i) => {
              const isAward = cert.type === 'award'
              const certIcons = [Star, ShieldCheck, Shield, Award]
              const CertIcon = certIcons[i % certIcons.length]
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className={isAward
                    ? "relative p-6 bg-linear-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 text-center group hover:shadow-lg hover:shadow-amber-100 transition-all duration-300"
                    : "p-6 bg-white rounded-2xl border border-slate-100 text-center group hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                  }
                >
                  {isAward && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-md">Award</span>
                    </div>
                  )}
                  <div className={`h-14 w-14 rounded-xl ${isAward ? 'bg-amber-100 text-amber-600' : 'bg-primary/8 text-primary'} flex items-center justify-center mx-auto mb-3`}>
                    <CertIcon className={`h-7 w-7 ${isAward ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight mb-1">{cert.title}</h4>
                  <span className={isAward ? "text-xl font-black text-amber-600" : "text-xs font-semibold text-primary"}>{cert.subtitle}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Service Icons - Static Grid */}
      <section className="py-20 px-4 bg-linear-to-b from-white to-slate-50/50 relative">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary font-semibold text-[11px] uppercase tracking-wider mb-3">
              <Sparkles className="h-3 w-3" />
              Quick Services
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Everything You Need</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Comprehensive cleaning solutions delivered with precision and care</p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {services.map((service, i) => (
              <motion.a
                key={i}
                href={service.href}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i % 6}
                className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-3">
                  {service.icon}
                </div>
                <span className="text-[11px] font-semibold text-center text-slate-700 leading-tight group-hover:text-primary transition-colors">
                  {service.title}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Mission Values */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary font-semibold text-[11px] uppercase tracking-wider mb-4">
              <Shield className="h-3 w-3" />
              Our Foundation
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Built on <span className="text-primary">Trust</span> & Excellence
            </h3>
            <p className="text-slate-500 text-base leading-relaxed">
              Setting new standards in the cleaning industry with unwavering commitment to quality and transparency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={0}
              className="group relative p-10 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/8 flex items-center justify-center text-primary mb-5">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-900">Our Vision</h3>
              <p className="text-slate-500 leading-relaxed">
                To be the first choice for our customers, employees, and suppliers in the regions we operate.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={1}
              className="group relative p-10 bg-slate-900 rounded-2xl shadow-lg flex flex-col text-white"
            >
              <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center text-white mb-5">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black mb-3">Our Mission</h3>
              <p className="text-slate-400 leading-relaxed">
                To provide reliable, flexible, and consistent solutions to our internal and external stakeholders in our hygiene business.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={2}
              className="group relative p-10 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/8 flex items-center justify-center text-primary mb-5">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black mb-5 text-slate-900">Core Values</h3>
              <ul className="space-y-3">
                {[
                  "Honouring Our Commitments",
                  "Trust & Integrity",
                  "Reliability & Consistency",
                  "Long-Term Approach"
                ].map((val, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-slate-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium">{val}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Static Grid */}
      <section className="py-20 bg-slate-50/50 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary font-semibold text-[11px] uppercase tracking-wider mb-4">
              <Sparkles className="h-3 w-3" />
              Our Services
            </span>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-3">
              Exceptional Care for <span className="text-primary">Every Space</span>
            </h3>
            <p className="text-slate-500 text-base leading-relaxed">
              Specialized teams equipped with professional-grade equipment delivering pristine results
            </p>
          </div>

          {/* Static Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i % 4}
                className="relative h-72 rounded-2xl overflow-hidden shadow-md group"
              >
                <a href={service.href} className="block h-full w-full">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/30 to-transparent" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-primary/90 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {service.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 z-10">
                    <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
                    <p className="text-slate-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-white text-[11px] font-semibold">
                      Book Service <ArrowRight className="h-3 w-3 text-primary" />
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-pink-700 transition-colors shadow-md shadow-primary/20"
            >
              View All Services <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-primary font-semibold text-[11px] uppercase tracking-wider border border-primary/20">
                  <Award className="h-3 w-3" />
                  The Difference
                </span>
                <h3 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
                  Why Choose <span className="text-primary">HomeWork UAE</span>?
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">Elevating hygiene standards with certified excellence and innovation</p>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                className="space-y-8"
              >
                {[
                  {
                    title: "Advanced Cleaning Protocols",
                    desc: "We use trusted, industry-grade solutions that are highly effective against pathogens while remaining safe for families and pets.",
                    icon: ShieldCheck
                  },
                  {
                    title: "Dubai Municipality Approved",
                    desc: "Full compliance with the highest government standards for commercial and residential hygiene.",
                    icon: Award
                  },
                  {
                    title: "Fast & Easy Booking",
                    desc: "Our streamlined booking process allows you to schedule your expert cleaner quickly and conveniently.",
                    icon: Zap
                  }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="flex gap-5 group">
                    <div className="h-14 w-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1.5">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed max-w-md">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="relative"
            >
              <div className="bg-slate-800/60 rounded-2xl p-10 border border-white/5">
                <h4 className="text-2xl font-black mb-8 tracking-tight">Direct Support</h4>
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center font-bold text-lg">800</div>
                    <div>
                      <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">Toll Free Support</div>
                      <div className="text-2xl font-black tracking-tight">+971 50 717 7059</div>
                    </div>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="grid gap-4">
                    {[
                      "Instant WhatsApp Booking",
                      "Same-Day Urgent Deep Clean",
                      "Key-Drop Service Available",
                      "Flexible Payment Plans Available"
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-slate-300 text-sm font-medium">{text}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href="https://wa.me/971507177059"
                    className="block w-full h-12 bg-white text-slate-900 rounded-xl text-center leading-12 font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    Chat via WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary font-semibold text-[11px] uppercase tracking-wider mb-4">
                <BookOpen className="h-3 w-3" />
                Expert Insights
              </span>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-3">
                Knowledge & <span className="text-primary">Expert Tips</span>
              </h3>
              <p className="text-slate-500 text-base leading-relaxed">
                Stay informed with professional cleaning insights and maintenance guides
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBlogSliderIndex(Math.max(0, blogSliderIndex - 1))}
                disabled={blogSliderIndex === 0}
                className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setBlogSliderIndex(Math.min(blogs.length - 3, blogSliderIndex + 1))}
                disabled={blogSliderIndex >= blogs.length - 3}
                className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-pink-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Blog Slider */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-5"
              animate={{ x: -blogSliderIndex * 380 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {blogs.map((blog, i) => (
                <article key={i} className="relative w-90 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0 bg-white group hover:shadow-lg transition-shadow duration-300">
                  <a href={blog.href} className="block cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-primary/90 text-[10px] font-semibold uppercase tracking-wider text-white">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{blog.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{blog.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-primary text-[11px] font-semibold">
                        Read Article <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </a>
                </article>
              ))}
            </motion.div>
          </div>

          {/* Slider Indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {Array.from({ length: Math.ceil(blogs.length / 3) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setBlogSliderIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === blogSliderIndex ? 'w-6 bg-primary' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-pink-700 transition-colors shadow-md shadow-primary/20"
            >
              <BookOpen className="h-4 w-4" />
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50/50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary font-semibold text-[11px] uppercase tracking-wider mb-4">
              <Star className="h-3 w-3 fill-current" />
              Testimonials
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">What Our Clients Say</h3>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Real feedback from thousands across the UAE</p>
          </div>

          {/* Infinite Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-5"
              animate={{ x: [0, -testimonials.length * 380] }}
              transition={{
                duration: testimonials.length * 6,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <div
                  key={i}
                  className="w-90 rounded-2xl shrink-0 bg-white border border-slate-100 p-7 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex text-primary mb-4 gap-0.5">
                    {[...Array(testimonial.rating)].map((_, idx) => <Star key={idx} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 grow">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                      <p className="text-primary text-[11px] font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Edge Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-slate-50 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-slate-50 to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-linear-to-br from-primary to-pink-700 rounded-2xl p-12 md:p-16 relative overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  Experience the Gold Standard
                </h2>
                <p className="text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
                  Join 20,000+ satisfied clients across the UAE. Transform your space into a pristine, healthy environment.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/book-service"
                  className="bg-white text-primary px-8 py-3.5 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
                >
                  Start Booking Now <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/quote"
                  className="bg-white/15 text-white border border-white/25 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white/25 transition-colors inline-flex items-center gap-2"
                >
                  Check Availability <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pre-Footer CTA */}
      <section className="py-12 px-4 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2 tracking-tight">Ready to Transform Your Space?</h2>
              <p className="text-slate-500 text-sm">Join thousands of satisfied customers enjoying pristine, healthy environments across the UAE</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="/book-service"
                className="px-7 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-pink-700 transition-colors shadow-md shadow-primary/20 inline-flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Schedule Now
              </a>
              <a
                href="/quote"
                className="px-7 py-3 rounded-full bg-white text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors border border-slate-200 inline-flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Get Free Quote
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

