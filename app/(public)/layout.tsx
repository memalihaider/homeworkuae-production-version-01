
"use client"

import { ReactNode, useState, useEffect, useRef } from 'react'
import { 
  Phone, Mail, Facebook, Linkedin, Instagram, MessageCircle, ChevronDown,
  Home, Briefcase, Maximize, Sun, Sofa, Layers, Bed, 
  Wind, Grid3X3, Warehouse, CookingPot, HardHat, Building, Truck, Brush,
  Fan, Pipette, Utensils, Waves, Dumbbell, PanelTop, ThermometerSnowflake,
  Star, HelpCircle, ShieldCheck, Music2, Send, MapPin, ArrowRight, X, Menu
} from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { defaultLayoutSettings } from '@/lib/cms-data'

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hasShownWelcomePopup = useRef(false)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const welcomePopupStorageKey = 'homeworkuae_welcome_popup_shown'
  const welcomePopupDismissedKey = 'homeworkuae_welcome_popup_dismissed'
  const profileData = {
    phone: '+971507177059',
    email: 'services@homeworkuae.com',
    company: 'homeware',
    address: 'Office: 201, 2nd Floor, Al Saaha Offices - B, Downtown Dubai - UAE' // Default address
  }
  const isLoading = false
  const cms = defaultLayoutSettings

  useEffect(() => {
    if (pathname !== '/' || hasShownWelcomePopup.current) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    const alreadyDismissed = window.localStorage.getItem(welcomePopupDismissedKey) === 'true'
    const legacyShown = window.localStorage.getItem(welcomePopupStorageKey) === 'true'

    if (alreadyDismissed || legacyShown) {
      hasShownWelcomePopup.current = true
      return
    }

    const handleScrollTrigger = () => {
      if (hasShownWelcomePopup.current) return

      if (window.scrollY >= 60) {
        hasShownWelcomePopup.current = true
        setShowWelcomePopup(true)
      }
    }

    window.addEventListener('scroll', handleScrollTrigger, { passive: true })
    handleScrollTrigger()

    return () => {
      window.removeEventListener('scroll', handleScrollTrigger)
    }
  }, [pathname, welcomePopupDismissedKey, welcomePopupStorageKey])

  const closeWelcomePopup = () => {
    setShowWelcomePopup(false)
    hasShownWelcomePopup.current = true

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(welcomePopupDismissedKey, 'true')
      // Keep legacy key synced for older checks.
      window.localStorage.setItem(welcomePopupStorageKey, 'true')
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top Bar - Premium */}
      <div className="bg-linear-to-r from-[#039ED9] via-[#0388be] to-[#039ED9] text-white py-2.5 hidden md:block">
        <div className="container mx-auto px-6 flex justify-between items-center text-xs font-semibold">
          <div className="flex items-center gap-8">
            <a 
              href={`tel:${profileData.phone}`} 
              className="flex items-center gap-2 hover:text-white/90 transition-all group"
            >
              <div className="h-6 w-6 rounded-md bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all">
                <Phone className="h-3 w-3" />
              </div>
              <span className="tracking-wide">{profileData.phone}</span>
            </a>
            <a 
              href={`mailto:${profileData.email}`} 
              className="flex items-center gap-2 hover:text-white/90 transition-all group"
            >
              <div className="h-6 w-6 rounded-md bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all">
                <Mail className="h-3 w-3" />
              </div>
              <span className="tracking-wide">{profileData.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-white/60 text-[9px] uppercase tracking-[0.2em] mr-2">Follow Us</span>
            {[Facebook, Linkedin, MessageCircle, Instagram, Music2].map((Icon, i) => (
              <a key={i} href="#" className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/25 transition-all"><Icon className="h-3 w-3" /></a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar - Premium Glass */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center">
            <div className="h-14 w-14">
              <Image
                src="/logo.jpeg"
                alt="Logo"
                width={56}
                height={56}
                priority
                sizes="56px"
                className="h-full w-full rounded-xl object-contain"
              />
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-0.5 text-[13px] font-semibold">
            <a href="/" className="px-4 py-2 text-slate-600 hover:text-primary rounded-lg transition-colors">Home</a>
            <a href="/about" className="px-4 py-2 text-slate-600 hover:text-primary rounded-lg transition-colors">About</a>
            <div className="relative group py-6">
              <a href="/services" className="px-4 py-2 text-slate-600 hover:text-primary rounded-lg transition-colors flex items-center gap-1">
                Services <ChevronDown className="h-3.5 w-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
              </a>
              
              {/* Mega Menu */}
              <div className="absolute top-full -left-80 w-180 bg-white border border-slate-200/80 shadow-xl rounded-2xl p-8 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="grid grid-cols-3 gap-8">
                  {/* Normal Cleaning Section */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 pb-2 border-b border-slate-100">
                      Normal Cleaning
                    </h4>
                    <div className="grid gap-0.5">
                      {[
                        { name: "Regular Residential", href: "/services/residential-cleaning", icon: Home },
                        { name: "Regular Office", href: "/services/office-cleaning", icon: Briefcase },
                        { name: "Window cleaning", href: "/services/window-cleaning", icon: Maximize },
                        { name: "Balcony Cleaning", href: "/services/balcony-deep-cleaning", icon: Sun },
                        { name: "Sofa Cleaning", href: "/services/sofa-deep-cleaning", icon: Sofa },
                        { name: "Carpets Cleaning", href: "/services/carpets-deep-cleaning", icon: Layers },
                        { name: "Mattress Cleaning", href: "/services/mattress-deep-cleaning", icon: Bed }
                      ].map((item) => (
                        <a 
                          key={item.href} 
                          href={item.href}
                          className="group/item flex items-center gap-2.5 text-[12.5px] font-medium text-slate-600 hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-50"
                        >
                          <item.icon className="h-3.5 w-3.5 text-slate-400 group-hover/item:text-primary transition-colors shrink-0" />
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Deep Cleaning Section */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 pb-2 border-b border-slate-100">
                      Deep Cleaning
                    </h4>
                    <div className="grid grid-cols-1 gap-0.5">
                      {[
                        { name: "Grout Deep Clean", href: "/services/grout-deep-cleaning", icon: Grid3X3 },
                        { name: "Garage Deep Clean", href: "/services/garage-deep-cleaning", icon: Warehouse },
                        { name: "Kitchen Deep Clean", href: "/services/kitchen-deep-cleaning", icon: CookingPot },
                        { name: "Post Construction", href: "/services/post-construction-cleaning", icon: HardHat },
                        { name: "Office Deep Clean", href: "/services/office-deep-cleaning", icon: Briefcase },
                        { name: "Apartment Deep", href: "/services/apartment-deep-cleaning", icon: Building },
                        { name: "Move In/Out", href: "/services/move-in-out-cleaning", icon: Truck },
                        { name: "Villa Deep Clean", href: "/services/villa-deep-cleaning", icon: Home },
                        { name: "Mattress Deep", href: "/services/mattress-deep-cleaning", icon: Bed },
                        { name: "Carpets Deep", href: "/services/carpets-deep-cleaning", icon: Layers },
                        { name: "Sofa Deep Clean", href: "/services/sofa-deep-cleaning", icon: Sofa },
                        { name: "Balcony Deep", href: "/services/balcony-deep-cleaning", icon: Sun },
                        { name: "Window cleaning", href: "/services/window-cleaning", icon: Maximize },
                        { name: "Floor Deep Clean", href: "/services/floor-deep-cleaning", icon: Brush }
                      ].map((item) => (
                        <a 
                          key={item.href} 
                          href={item.href}
                          className="group/item flex items-center gap-2.5 text-[12.5px] font-medium text-slate-600 hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-50"
                        >
                          <item.icon className="h-3.5 w-3.5 text-slate-400 group-hover/item:text-primary transition-colors shrink-0" />
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Technical Cleaning Section */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 pb-2 border-b border-slate-100">
                      Technical Cleaning
                    </h4>
                    <div className="grid grid-cols-1 gap-0.5">
                      {[
                        { name: "AC Duct Cleaning", href: "/services/ac-duct-cleaning", icon: Wind },
                        { name: "AC Coil Cleaning", href: "/services/ac-coil-cleaning", icon: ThermometerSnowflake },
                        { name: "Kitchen Hood Clean", href: "/services/kitchen-hood-cleaning", icon: Fan },
                        { name: "Grease Trap Clean", href: "/services/grease-trap-cleaning", icon: Pipette },
                        { name: "Restaurant Clean", href: "/services/restaurant-cleaning", icon: Utensils },
                        { name: "Water Tank Clean", href: "/services/water-tank-cleaning", icon: Waves },
                        { name: "Swimming Pool", href: "/services/swimming-pool-cleaning", icon: Waves },
                        { name: "Gym Deep Clean", href: "/services/gym-deep-cleaning", icon: Dumbbell },
                        { name: "Facade Cleaning", href: "/services/facade-cleaning", icon: PanelTop }
                      ].map((item) => (
                        <a 
                          key={item.href} 
                          href={item.href}
                          className="group/item flex items-center gap-2.5 text-[12.5px] font-medium text-slate-600 hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-50"
                        >
                          <item.icon className="h-3.5 w-3.5 text-slate-400 group-hover/item:text-primary transition-colors shrink-0" />
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More Link with Dropdown */}
            <div className="relative group py-6">
              <button className="flex items-center gap-1 px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-primary rounded-lg transition-colors">
                More <ChevronDown className="h-3.5 w-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-full -left-8 w-72 bg-white border border-slate-200/80 shadow-xl rounded-xl p-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="grid gap-1">
                  {[
                    { name: "Testimonials", href: "/testimonials", icon: Star, desc: "Client reviews" },
                    { name: "FAQs", href: "/faqs", icon: HelpCircle, desc: "Common questions" },
                    { name: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck, desc: "Data protection" }
                  ].map((item) => (
                    <a 
                      key={item.href} 
                      href={item.href}
                      className="group/item flex items-center gap-3 text-[13px] font-medium text-slate-600 hover:text-primary transition-colors p-2.5 rounded-lg hover:bg-slate-50"
                    >
                      <item.icon className="h-4 w-4 text-slate-400 group-hover/item:text-primary transition-colors shrink-0" />
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-[11px] text-slate-400">{item.desc}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a href="/blog" className="px-4 py-2 text-slate-600 hover:text-primary rounded-lg transition-colors font-semibold text-[13px]">Blog</a>
            <a href="/contact" className="px-4 py-2 text-slate-600 hover:text-primary rounded-lg transition-colors font-semibold text-[13px]">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href={cms.navbar.ctaLink} 
              className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-primary px-7 text-xs font-bold text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] tracking-wide"
            >
              {cms.navbar.ctaText}
            </a>

            <details className="relative lg:hidden">
              <summary
                className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </summary>

              <div className="absolute right-0 mt-3 w-[min(92vw,22rem)] max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                <div className="space-y-1 text-sm font-semibold text-slate-700">
                  <a href="/" className="block rounded-xl px-3 py-2.5 hover:bg-slate-50">Home</a>
                  <a href="/about" className="block rounded-xl px-3 py-2.5 hover:bg-slate-50">About</a>

                  <details className="rounded-xl border border-slate-100 bg-slate-50/70">
                    <summary className="cursor-pointer list-none px-3 py-2.5 font-semibold text-slate-800">Services</summary>
                    <div className="grid gap-2 px-2 pb-2 text-[13px] font-medium">
                      <a href="/services" className="rounded-lg bg-white px-2 py-2 font-semibold hover:bg-white">All Services</a>

                      <details className="rounded-lg border border-slate-200 bg-white">
                        <summary className="cursor-pointer list-none px-2 py-2 text-xs font-bold uppercase tracking-wider text-slate-700">Normal Cleaning</summary>
                        <div className="grid gap-1 px-2 pb-2">
                          <a href="/services/residential-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Regular Residential</a>
                          <a href="/services/office-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Regular Office</a>
                          <a href="/services/window-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Window Cleaning</a>
                          <a href="/services/balcony-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Balcony Cleaning</a>
                          <a href="/services/sofa-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Sofa Cleaning</a>
                          <a href="/services/carpets-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Carpets Cleaning</a>
                          <a href="/services/mattress-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Mattress Cleaning</a>
                        </div>
                      </details>

                      <details className="rounded-lg border border-slate-200 bg-white">
                        <summary className="cursor-pointer list-none px-2 py-2 text-xs font-bold uppercase tracking-wider text-slate-700">Deep Cleaning</summary>
                        <div className="grid gap-1 px-2 pb-2">
                          <a href="/services/grout-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Grout Deep Clean</a>
                          <a href="/services/garage-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Garage Deep Clean</a>
                          <a href="/services/kitchen-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Kitchen Deep Clean</a>
                          <a href="/services/post-construction-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Post Construction</a>
                          <a href="/services/office-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Office Deep Clean</a>
                          <a href="/services/apartment-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Apartment Deep</a>
                          <a href="/services/move-in-out-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Move In/Out</a>
                          <a href="/services/villa-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Villa Deep Clean</a>
                          <a href="/services/floor-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Floor Deep Clean</a>
                        </div>
                      </details>

                      <details className="rounded-lg border border-slate-200 bg-white">
                        <summary className="cursor-pointer list-none px-2 py-2 text-xs font-bold uppercase tracking-wider text-slate-700">Technical Cleaning</summary>
                        <div className="grid gap-1 px-2 pb-2">
                          <a href="/services/ac-duct-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">AC Duct Cleaning</a>
                          <a href="/services/ac-coil-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">AC Coil Cleaning</a>
                          <a href="/services/kitchen-hood-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Kitchen Hood Clean</a>
                          <a href="/services/grease-trap-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Grease Trap Clean</a>
                          <a href="/services/restaurant-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Restaurant Clean</a>
                          <a href="/services/water-tank-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Water Tank Clean</a>
                          <a href="/services/swimming-pool-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Swimming Pool</a>
                          <a href="/services/gym-deep-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Gym Deep Clean</a>
                          <a href="/services/facade-cleaning" className="rounded-md px-2 py-1.5 hover:bg-slate-50">Facade Cleaning</a>
                        </div>
                      </details>
                    </div>
                  </details>

                  <details className="rounded-xl border border-slate-100 bg-slate-50/70">
                    <summary className="cursor-pointer list-none px-3 py-2.5 font-semibold text-slate-800">More</summary>
                    <div className="grid gap-1 px-2 pb-2 text-[13px] font-medium">
                      <a href="/testimonials" className="rounded-lg px-2 py-2 hover:bg-white">Testimonials</a>
                      <a href="/faqs" className="rounded-lg px-2 py-2 hover:bg-white">FAQs</a>
                      <a href="/privacy-policy" className="rounded-lg px-2 py-2 hover:bg-white">Privacy Policy</a>
                      <a href="/blog" className="rounded-lg px-2 py-2 hover:bg-white">Blog</a>
                    </div>
                  </details>

                  <a href="/contact" className="block rounded-xl px-3 py-2.5 hover:bg-slate-50">Contact</a>
                </div>

                <a
                  href={cms.navbar.ctaLink}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-xs font-black uppercase tracking-widest text-white"
                >
                  {cms.navbar.ctaText}
                </a>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-950 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="space-y-5">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 mb-5">Contact Us</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[#039ED9] shrink-0">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <span className="group-hover:text-white transition-colors text-[12px] leading-relaxed">
                    {isLoading ? (
                      <span className="animate-pulse bg-slate-800 rounded w-48 h-4 block"></span>
                    ) : (
                      profileData.address
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[#039ED9] shrink-0">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <a href={`tel:${profileData.phone}`} className="group-hover:text-white transition-colors">
                    {isLoading ? (
                      <span className="animate-pulse bg-slate-800 rounded w-32 h-4 block"></span>
                    ) : (
                      profileData.phone
                    )}
                  </a>
                </li>
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[#039ED9] shrink-0">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <a href={`mailto:${profileData.email}`} className="group-hover:text-white transition-colors">
                    {isLoading ? (
                      <span className="animate-pulse bg-slate-800 rounded w-40 h-4 block"></span>
                    ) : (
                      profileData.email
                    )}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 mb-5">Cleaning Services</h4>
              <ul className="space-y-3 text-[13px] text-slate-400">
                <li><a href="/services/residential-cleaning" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3 text-[#039ED9]" /> Normal Cleaning</a></li>
                <li><a href="/services/villa-deep-cleaning" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3 text-[#039ED9]" /> Deep Cleaning</a></li>
                <li><a href="/services/ac-duct-cleaning" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3 text-[#039ED9]" /> Technical Cleaning</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 mb-5">Quick Links</h4>
              <ul className="space-y-3 text-[13px] text-slate-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About us</a></li>
                <li><a href="/testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="/faqs" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact us</a></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80">{cms.footer.newsletterTitle}</h4>
              <p className="text-slate-500 text-[13px]">{cms.footer.newsletterSubtitle}</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address…" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-xs focus:ring-1 focus:ring-[#039ED9] outline-none placeholder:text-slate-600"
                />
                <button className="absolute right-1.5 top-1.5 h-8 w-8 bg-[#039ED9] rounded-md flex items-center justify-center hover:bg-[#0388be] transition-colors">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[11px] text-slate-500 tracking-wide">{cms.footer.copyrightText}</p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Music2].map((Icon, i) => (
                <a key={i} href="#" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#039ED9] transition-colors group">
                  <Icon className="h-3.5 w-3.5 text-slate-500 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {pathname === '/' && showWelcomePopup && (
        <div className="fixed inset-0 z-10000 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <button
              onClick={closeWelcomePopup}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                Premium Service Provider
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                Welcome to Homework UAE
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Trusted premium cleaning solutions for homes, villas, and offices across Dubai. Book your service now or chat with our team directly on WhatsApp.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.homeworkuae.com/book-service"
                  onClick={closeWelcomePopup}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-pink-600 transition-colors"
                >
                  Book Service
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="https://wa.me/971507177059"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeWelcomePopup}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] text-white font-black uppercase text-xs tracking-widest hover:bg-[#1fb65a] transition-colors"
                >
                  WhatsApp +971 50 717 7059
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons - Clean & Minimal */}
      <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3">
        {/* WhatsApp */}
        <a 
          href="https://wa.me/971507177059" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative h-12 w-12 bg-[#25D366] text-white rounded-full shadow-lg shadow-[#25D366]/25 flex items-center justify-center hover:scale-105 transition-transform"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.006c-1.795 0-3.588.474-5.148 1.37l-.369.221-3.823.954.972-3.855.235-.374A8.871 8.871 0 015.051 2.054 8.916 8.916 0 0113.997 10.5c0 2.408-.937 4.671-2.639 6.373s-3.965 2.639-6.373 2.639"/>
          </svg>
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
        </a>
        {/* Phone */}
        <a 
          href={`tel:${profileData.phone}`} 
          className="h-12 w-12 bg-[#039ED9] text-white rounded-full shadow-lg shadow-[#039ED9]/25 flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Phone className="h-5 w-5" />
        </a>
        {/* Email */}
        <a 
          href={`mailto:${profileData.email}`} 
          className="h-12 w-12 bg-slate-800 text-white rounded-full shadow-lg shadow-slate-800/25 flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Mail className="h-5 w-5" />
        </a>
      </div>
    </div>
  )
}
