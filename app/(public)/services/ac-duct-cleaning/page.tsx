import type { Metadata } from 'next'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import { buildServiceMetadata } from '@/lib/service-seo'
import Image from 'next/image'
import Link from 'next/link'
import {
  AirVent,
  Wind,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  CircleCheck,
  Timer,
  Wrench,
  Activity,
  Users,
  Star,
  UserCheck,
  MapPin,
  PhoneCall,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = buildServiceMetadata('ac-duct-cleaning')

export default function ACDuctCleaning() {
  const offerCards = [
    { title: 'Air Vent Cleaning', icon: AirVent },
    { title: 'Dryer Vent Cleaning', icon: Wind },
    { title: 'HVAC Duct Cleaning', icon: Sparkles },
    { title: 'Trash Chute Cleaning', icon: ShieldCheck },
  ]

  const processSteps = [
    {
      title: 'Inspection',
      detail:
        'We inspect supply and return ducts, grills, and air handler condition to map contamination levels.',
      icon: BadgeCheck,
    },
    {
      title: 'Vacuuming',
      detail:
        'High-powered negative-air vacuum systems capture dust, debris, and fine particles without spreading them indoors.',
      icon: Wind,
    },
    {
      title: 'Sanitization',
      detail:
        'Approved disinfectants and anti-microbial treatments help reduce bacteria, odor sources, and mold risk.',
      icon: ShieldCheck,
    },
    {
      title: 'Sealing & Prevention',
      detail:
        'We restore grills, check airflow balance, and share maintenance advice to keep indoor air cleaner for longer.',
      icon: Wrench,
    },
  ]

  const faqs = [
    {
      q: 'How often should I book AC duct cleaning in Dubai?',
      a: 'For most villas and apartments in Dubai, every 12 to 18 months is ideal. Homes with pets, allergies, recent renovations, or high AC usage may need cleaning every 6 to 12 months.',
    },
    {
      q: 'How long does professional air duct cleaning take?',
      a: 'A typical apartment takes around 2 to 4 hours, while larger villas and commercial spaces can take 4 to 8 hours depending on system size and duct condition.',
    },
    {
      q: 'Can duct cleaning reduce electricity bills?',
      a: 'Yes. Cleaner ducts improve airflow and reduce pressure on your HVAC system, which can improve cooling efficiency and lower energy usage over time.',
    },
    {
      q: 'Is AC duct sanitization safe for children and pets?',
      a: 'Yes. We use industry-approved products and controlled application methods designed for occupied residential and commercial spaces.',
    },
    {
      q: 'Do you provide AC duct cleaning for offices and retail spaces?',
      a: 'Absolutely. Our team handles residential and commercial HVAC duct cleaning across Dubai, including offices, clinics, schools, and retail properties.',
    },
  ]

  const reviews = [
    {
      name: "Sarah Jenkins",
      text: "The difference in air quality is night and day. My allergies have significantly improved since the cleaning. The team was professional, showed me the before/after photos, and left everything spotless. Highly recommend for any villa owner in Dubai.",
      area: "Palm Jumeirah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      date: "2 weeks ago"
    },
    {
      name: "Mohamed Al-Fayed",
      text: "Excellent service. They used specialized equipment that I haven't seen other companies use. Very thorough cleaning of the vents and the internal coils. Worth every dirham for the peace of mind. Professional and punctual.",
      area: "Downtown Dubai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      date: "1 month ago"
    },
    {
      name: "Emma Robertson",
      text: "I was skeptical at first, but seeing the amount of dust they removed was shocking. The cooling efficiency of my AC has also improved. Great communication from the team from start to finish. Five stars!",
      area: "Dubai Marina",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      date: "3 days ago"
    }
  ]

  const serviceAreas = [
    'Downtown Dubai',
    'Dubai Marina',
    'Business Bay',
    'Jumeirah',
    'Al Barsha',
    'JVC',
    'Deira',
    'Mirdif',
  ]

  const googleBusinessIcon = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path fill="#EA4335" d="M12 11V8h10a10 10 0 0 1 .2 2c0 6-4 10-10.2 10A10 10 0 1 1 12 2c2.7 0 5 .9 6.8 2.5l-2.8 2.8A5.9 5.9 0 0 0 12 5a6 6 0 0 0 0 12c3 0 5-1.7 5.6-4H12Z" />
      <path fill="#4285F4" d="M3.7 7.1A10 10 0 0 1 12 2c2.7 0 5 .9 6.8 2.5l-2.8 2.8A5.9 5.9 0 0 0 12 5a6 6 0 0 0-5.4 3.3Z" />
      <path fill="#FBBC05" d="M2 12c0-1.7.4-3.3 1.2-4.9l3.4 1.2A6.2 6.2 0 0 0 6 12c0 1.3.4 2.5 1 3.5l-3.4 1.3A10 10 0 0 1 2 12Z" />
      <path fill="#34A853" d="M12 22a10 10 0 0 1-8.4-4.6L7 15.5A6 6 0 0 0 12 17c3 0 5-1.7 5.6-4H12v-2h10a10 10 0 0 1 .2 2c0 6-4 10-10.2 10Z" />
    </svg>
  )

  const clutchIcon = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path fill="#2E3C43" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.33 13.92H8.67v-1.78h6.66v1.78zm0-3.11H8.67v-1.78h6.66v1.78zm0-3.11H8.67V7.92h6.66v1.78z" />
    </svg>
  )

  const trustpilotIcon = (
    <svg viewBox="0 0 124 124" aria-hidden="true" className="h-6 w-6">
      <path d="M124 47.4h-46.7L62 0 46.7 47.4H0l37.8 28.3L23.4 124 62 95.7 100.6 124l-14.4-48.3L124 47.4z" fill="#00b67a" />
    </svg>
  )

  return (
    <>
      <ServiceStructuredData slug="ac-duct-cleaning" />
      <main className="bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#0a192f] text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop"
              alt="AC duct cleaning background"
              fill
              className="object-cover opacity-30 shadow-2xl transition-opacity duration-700"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a192f] via-[#0a192f]/80 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0a192f]" />
          </div>

          <div className="container relative z-10 mx-auto px-6 py-24">
            <div className="max-w-3xl">
              <h1 className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-white md:text-7xl">
                Premium <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">AC Duct Cleaning</span> in Dubai
              </h1>
              <p className="mb-10 max-w-xl text-lg leading-relaxed text-blue-100/80 md:text-xl">
                Breathe crystalline air. Our clinical-grade negative-air systems and hospital-safe sanitization eliminate 99% of dust and allergens.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link href="/book-service" className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-blue-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">Book Premium Service</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
                <a href="tel:80046639675" className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/40">
                  <PhoneCall className="h-4 w-4 text-blue-400" />
                  800 4663 9675
                </a>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 animate-bounce flex-col items-center gap-2 md:flex">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/50">Explore Service</span>
            <div className="h-6 w-px bg-linear-to-b from-blue-400/50 to-transparent" />
          </div>
        </section>

        <section className="relative -mt-10 pb-6">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl bg-[#0c1526] px-6 py-6 shadow-[0_25px_60px_rgba(5,10,20,0.45)] md:px-10">
              <div className="grid gap-6 text-center text-white/80 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center justify-center gap-3">
                  <Users className="h-5 w-5 text-cyan-300" />
                  <div className="text-left">
                    <p className="text-2xl font-black text-white">20,000+</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Satisfied Clients</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Star className="h-5 w-5 text-cyan-300" />
                  <div className="text-left">
                    <p className="text-2xl font-black text-white">4.9/5.0</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Service Rating</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <UserCheck className="h-5 w-5 text-cyan-300" />
                  <div className="text-left">
                    <p className="text-2xl font-black text-white">250+</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Expert Cleaners</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="h-5 w-5 text-cyan-300" />
                  <div className="text-left">
                    <p className="text-2xl font-black text-white">100%</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">City Coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f3f5f8] py-20 md:py-24">
          <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-3 bg-[#0f3a73] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-100">
                Premium Air Duct Cleaning in Dubai
                <span className="h-0.5 w-10 bg-cyan-400" />
              </span>
              <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[1.1] tracking-tight text-[#173b6c] md:text-6xl">
                Need A Professional Team For AC Duct Cleaning In Dubai?
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700">
                Many families focus on visible cleaning while hidden HVAC duct lines quietly collect dust, allergens,
                and contaminants that circulate through every room. Our Dubai AC duct cleaning specialists remove
                deep buildup from vents, returns, and internal pathways using negative-air equipment and controlled
                sanitization methods designed for occupied homes and commercial spaces.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
                From apartments to large villas, we deliver a structured process that improves indoor air quality,
                supports healthier breathing, and helps your cooling system operate more efficiently in harsh summer
                conditions. Every project is handled by trained technicians with before-and-after verification so you
                can clearly see the service impact.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-140">
              <div className="absolute -left-4 top-6 hidden h-40 w-8 -skew-x-16 bg-linear-to-b from-cyan-400 to-[#0b3f85] shadow-xl md:block" />
              <div className="relative overflow-hidden border-4 border-white shadow-2xl [clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]">
                <div className="relative aspect-4/3">
                  <Image
                    src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1600&auto=format&fit=crop"
                    alt="Inside of cleaned AC duct"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-8 right-6 flex h-36 w-36 items-center justify-center rounded-full bg-linear-to-b from-cyan-500 to-[#0f3a73] p-5 text-center text-sm font-black leading-tight text-white shadow-2xl">
                Professional Service
                <br />
                AC Duct Cleaning
                <br />
                Dubai
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 flex flex-col items-center text-center">
              <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Pure Air Solutions</span>
              <h2 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">What We <span className="text-blue-600">Perfect</span></h2>
              <div className="mt-6 h-1 w-20 rounded-full bg-blue-600" />
            </div>
            
            <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {offerCards.map((card, idx) => {
                const Icon = card.icon
                return (
                  <article key={card.title} className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-50/50 transition-all duration-500 group-hover:scale-150 group-hover:bg-blue-600/5" />
                    <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 transition-transform duration-500 group-hover:rotate-6">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="relative z-10 text-xl font-black text-slate-900">{card.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500 group-hover:text-slate-600">Premium hygiene for your industrial or residential airflow channels.</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-24 text-white">
          <div className="container mx-auto px-6">
            <div className="mb-16 flex flex-col items-center text-center">
              <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">Proof of Quality</span>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">Clinical <span className="italic text-blue-400">Results</span></h2>
              <p className="mt-4 max-w-xl text-slate-400">Experience the transformation of your HVAC interiors with our high-definition thermal and optical imaging.</p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
              <article className="group overflow-hidden rounded-[3rem] border border-white/5 bg-white/5 shadow-2xl transition-all duration-500 hover:border-white/10 hover:bg-white/[0.07]">
                <div className="relative aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1600&auto=format&fit=crop"
                    alt="Before AC duct cleaning"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400 ring-1 ring-red-400/30 backdrop-blur-md">
                      <Wind className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Initial State</p>
                      <p className="text-sm font-bold">Heavily Contaminated</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-sm font-medium leading-relaxed text-slate-400">Accumulated microbial buildup, particulate matter, and restricted airflow channels prior to clinical treatment.</p>
                </div>
              </article>

              <article className="group overflow-hidden rounded-[3rem] border border-blue-500/20 bg-blue-500/5 shadow-2xl transition-all duration-500 hover:border-blue-500/40 hover:bg-blue-500/[0.07]">
                <div className="relative aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop"
                    alt="After AC duct cleaning"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-blue-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 ring-1 ring-blue-400/30 backdrop-blur-md">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Sanitized</p>
                      <p className="text-sm font-bold">Crystalline Airflow</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-sm font-medium leading-relaxed text-blue-100/60">Fully decontaminated surfaces using medical-grade sanitation and high-efficiency negative pressure systems.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left">
              <div>
                <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Local Presence</span>
                <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Dubai Area <span className="text-blue-600">Coverage</span></h2>
              </div>
              <div className="mt-8 flex gap-4 md:mt-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-xl shadow-blue-600/10 ring-8 ring-blue-50/50">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[3rem] border border-slate-200 bg-white shadow-2xl">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-100">
                  <iframe
                    title="Dubai service coverage map"
                    src="https://www.google.com/maps?q=Dubai,UAE&z=11&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute h-full w-full grayscale transition-all duration-700 hover:grayscale-0"
                  />
                </div>
                <div className="p-12">
                  <h3 className="mb-8 text-2xl font-black text-slate-900">Marked Service Hubs</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {serviceAreas.map((area) => (
                      <div key={area} className="group flex items-center gap-4 transition-all duration-300">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-50 bg-blue-50/50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                          <MapPin className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <span className="font-bold text-slate-700 transition-colors duration-300 group-hover:text-blue-600">{area}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 rounded-[2rem] bg-blue-600 p-8 text-white shadow-2xl shadow-blue-600/30">
                    <p className="text-sm font-bold uppercase tracking-widest opacity-70">Support Hotline</p>
                    <p className="mt-1 text-2xl font-black">Fast Dispatch Dubai Wide</p>
                    <Link href="/book-service" className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-blue-600 transition-all duration-300 hover:scale-105">
                      Check Availability
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-r from-[#123c67] to-[#2b4f87] py-24 text-white">
          <div className="absolute inset-0 opacity-15 [background:radial-gradient(circle_at_20%_15%,#1e88e5_0%,transparent_35%)]" />
          <div className="absolute -right-30 top-1/2 hidden h-140 w-140 -translate-y-1/2 rotate-45 border border-white/10 lg:block" />
          <div className="absolute -right-12.5 top-1/2 hidden h-96 w-96 -translate-y-1/2 rotate-45 border border-white/10 lg:block" />

          <div className="container relative z-10 mx-auto grid items-center gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -left-3 top-8 hidden h-44 w-8 -skew-x-12 bg-linear-to-b from-cyan-400 to-blue-900 shadow-2xl md:block" />
              <div className="relative overflow-hidden border-2 border-white/20 shadow-2xl [clip-path:polygon(18%_0,100%_0,82%_100%,0_100%)]">
                <div className="relative aspect-4/3">
                  <Image
                    src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1600&auto=format&fit=crop"
                    alt="Professional AC duct interior cleaning"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="absolute -bottom-10 left-1/2 flex h-40 w-40 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-b from-cyan-500 to-blue-900 p-6 text-center text-sm font-black leading-tight text-white shadow-2xl">
                Professional Service
                <br />
                for Air Duct Cleaning
                <br />
                in Dubai
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-4 bg-white px-5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#1b3f71]">
                The Dubai Air Duct Cleaning
                <span className="h-0.5 w-10 bg-[#1b3f71]" />
              </div>

              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
                What Do We Offer When
                <br />
                It Comes to Air Duct
                <br />
                Cleaning?
              </h2>

              <p className="mt-5 text-lg font-medium text-blue-100">
                Here's why Dubai residents choose our certified duct cleaning team.
              </p>

              <ul className="mt-7 space-y-3 text-[22px] leading-relaxed text-blue-50/95 md:text-lg">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-400/15 text-cyan-300">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  We use modern negative-air systems and precision tools to remove dust, debris, and allergens from deep duct pathways.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-400/15 text-cyan-300">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  Our vacuum extraction process reaches grills, corners, and vents to clear compacted buildup without spreading contaminants indoors.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-400/15 text-cyan-300">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  We also apply safe sanitization treatments that target odor sources, microbial risk, and poor indoor air conditions.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-400/15 text-cyan-300">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  Preventive maintenance guidance is included to help keep your ducts cleaner and your HVAC performance stable all year.
                </li>
              </ul>

              <p className="mt-7 max-w-3xl text-xl font-semibold leading-relaxed text-blue-100/95 md:text-3xl">
                Our team is dedicated to delivering top-tier AC duct cleaning with experienced technicians, transparent service, and measurable results.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="tel:80046639675" className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#1a3c6b] transition hover:bg-slate-100">
                  Call (800) 4663-9675
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/book-service" className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#1a3c6b] transition hover:bg-slate-100">
                  Book Online
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">The Blueprint</span>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Our Workflow <span className="text-blue-600">Protocol</span></h2>
              <div className="mt-6 h-1 w-20 rounded-full bg-blue-600" />
            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, idx) => {
                const Icon = step.icon
                return (
                  <article key={step.title} className="group relative rounded-[2rem] border border-slate-100 bg-slate-50 p-8 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5">
                    <div className="mb-8 flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 transition-colors duration-500 group-hover:bg-blue-600 group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-4xl font-black italic text-slate-200 transition-colors duration-500 group-hover:text-blue-100">0{idx + 1}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{step.title}</h3>
                    <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-500 transition-colors duration-500 group-hover:text-slate-600">{step.detail}</p>
                  </article>
                )
              })}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/book-service" className="inline-flex items-center gap-4 rounded-full bg-blue-600 px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 hover:bg-blue-500 hover:shadow-[0_20px_40px_rgba(37,99,235,0.3)]">
                Breathe Better Today
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 lg:flex-row">
              <div className="lg:w-1/2">
                <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">The Experts</span>
                <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Elite Air <br /><span className="text-blue-600">Technicians</span></h2>
                <p className="mt-6 text-lg font-medium leading-relaxed text-slate-500">Our technicians are certified indoor air quality specialists, trained to handle everything from studio apartments to sprawling commercial campuses with precision tools.</p>
                
                <div className="mt-10 space-y-4">
                  {[
                    { icon: Timer, label: "Fast Dispatch", detail: "Transparent service timelines for your schedule." },
                    { icon: Activity, label: "Performance Audit", detail: "Pre and post airflow efficiency monitoring." },
                    { icon: ShieldCheck, label: "Clinical Safety", detail: "Hospital-grade sanitation protocols." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 rounded-3xl border border-slate-200/50 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{item.label}</p>
                        <p className="text-xs font-medium text-slate-500">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12">
                  <Link href="/book-service" className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-blue-600">
                    Consult Our Team
                  </Link>
                </div>
              </div>
              
              <div className="relative lg:w-1/2">
                <div className="relative aspect-square overflow-hidden rounded-[4rem] border border-blue-100 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1600&auto=format&fit=crop"
                    alt="AC duct technicians"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-tr from-blue-900/20 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-10 -left-10 hidden rounded-[2.5rem] bg-white p-8 shadow-2xl ring-1 ring-slate-100 md:block">
                  <p className="text-3xl font-black text-blue-600">100%</p>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sanitized</p>
                  <p className="mt-4 text-[10px] font-bold text-slate-500">Certified Dubai Experts</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-24 text-white">
          <div className="container mx-auto px-6">
            <div className="mb-20 flex flex-col items-center text-center">
              <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">Clear Answers</span>
              <h2 className="text-4xl font-black tracking-tight md:text-6xl italic">Technical FAQ</h2>
              <div className="mt-6 h-1.5 w-24 rounded-full bg-blue-500" />
            </div>
            
            <div className="mx-auto max-w-4xl space-y-6">
              {faqs.map((item) => (
                <details key={item.q} className="group overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 transition-all duration-500 open:border-white/10 open:bg-white/8">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-8 text-lg font-black tracking-tight md:text-xl">
                    {item.q}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-transform duration-500 group-open:rotate-180">
                      <ArrowRight className="h-5 w-5 rotate-90" />
                    </div>
                  </summary>
                  <div className="px-8 pb-8 text-slate-400">
                    <div className="h-px w-full bg-white/5 p-0 mb-6" />
                    <p className="text-[17px] font-medium leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="container mx-auto px-6 text-center">
            <span className="mb-4 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Google Reviews</span>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">What Our <span className="text-blue-600">Customers</span> Say</h2>
            
            <div className="mt-20 flex flex-wrap justify-center gap-8">
              {reviews.map((review, i) => (
                <article key={review.name} className="flex max-w-md flex-col rounded-[3rem] border border-slate-100 bg-slate-50 p-10 text-left shadow-xs transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} viewBox="0 0 24 24" className="h-5 w-5 fill-[#fbbc05] text-[#fbbc05]">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</span>
                  </div>
                  <p className="mb-10 text-[16px] font-medium leading-relaxed text-slate-600">"{review.text}"</p>
                  <div className="mt-auto flex items-center gap-4 border-t border-slate-200 pt-8">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-blue-50 ring-offset-2">
                      <Image 
                        src={review.avatar} 
                        alt={review.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900">{review.name}</p>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-blue-500 text-white">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">{review.area}</p>
                    </div>
                    <div className="ml-auto">
                      {googleBusinessIcon}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-slate-200" />
              <p className="text-sm font-bold text-slate-500">Rated <span className="text-slate-900">4.9/5</span> based on 850+ Google Reviews</p>
              <div className="h-px w-12 bg-slate-200" />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
