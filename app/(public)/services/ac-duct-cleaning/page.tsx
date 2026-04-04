import type { Metadata } from 'next'
import ServiceStructuredData from '@/components/ServiceStructuredData'
import BookServiceForm from '@/components/BookServiceForm'
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

const baseMetadata = buildServiceMetadata('ac-duct-cleaning')

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'AC Duct Cleaning Dubai | Certified Service | Homework UAE',
  description:
    'Top-rated AC duct cleaning in Dubai by trained technicians. Improve indoor air quality and cooling efficiency with a free quote today.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'AC Duct Cleaning Dubai | Certified Service | Homework UAE',
    description:
      'Top-rated AC duct cleaning in Dubai by trained technicians. Improve indoor air quality and cooling efficiency with a free quote today.',
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'AC Duct Cleaning Dubai | Certified Service | Homework UAE',
    description:
      'Top-rated AC duct cleaning in Dubai by trained technicians. Improve indoor air quality and cooling efficiency with a free quote today.',
  },
}

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

  const heroSectionImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80'
  const detailsSectionImage = 'https://firebasestorage.googleapis.com/v0/b/homework-a36e3.firebasestorage.app/o/WhatsApp%20Image%202026-03-27%20at%2023.28.14.jpeg?alt=media&token=f472eafa-4a11-4031-9ea0-d824fabaf773'
  const beforeAfterSectionImage = 'https://firebasestorage.googleapis.com/v0/b/homework-a36e3.firebasestorage.app/o/WhatsApp%20Image%202026-03-28%20at%2000.31.31.jpeg?alt=media&token=66edf9da-16d4-4381-9c06-1dab9ac2fe79'
  const whyChooseSectionImage = 'https://firebasestorage.googleapis.com/v0/b/homework-a36e3.firebasestorage.app/o/WhatsApp%20Image%202026-03-27%20at%2023.28.14.jpeg?alt=media&token=f472eafa-4a11-4031-9ea0-d824fabaf773'
  const expertsSectionImage = 'https://firebasestorage.googleapis.com/v0/b/homework-a36e3.firebasestorage.app/o/WhatsApp%20Image%202026-03-27%20at%2023.28.14.jpeg?alt=media&token=f472eafa-4a11-4031-9ea0-d824fabaf773'

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
        <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden bg-[#08172b] text-white md:min-h-[85vh]">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroSectionImage}
              alt="AC duct cleaning background"
              fill
              className="object-cover opacity-30 shadow-2xl transition-opacity duration-700"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a192f] via-[#0a192f]/80 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0a192f]" />
            <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#039ED9]/20 blur-3xl" />
            <div className="absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          </div>

          <div className="container relative z-10 mx-auto px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
              <div className="max-w-3xl">
                <h1 className="mb-4 text-3xl font-black leading-[1.1] tracking-tight text-white sm:mb-6 sm:text-5xl md:text-6xl xl:text-7xl">
                  Professional <span className="bg-linear-to-r from-[#7BD7FF] via-[#3FB5F4] to-primary bg-clip-text text-transparent">AC Duct Cleaning</span> Services in Dubai
                </h1>
                <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/80 sm:mb-10 sm:text-lg md:text-lg lg:text-xl">
                  As a top-rated AC duct cleaning company in Dubai, our AC duct cleaning Dubai team removes contaminants, allergens, dust, and hidden debris from HVAC ducts. This air duct cleaning service is designed for homes, villas, and commercial spaces, improving indoor air quality and cooling performance.
                </p>
                <div className="flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-5">
                  <Link href="/book-service" className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-linear-to-r from-[#039ED9] to-primary px-6 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_35px_rgba(236,72,153,0.35)] sm:px-8 sm:py-4 sm:text-sm sm:tracking-widest">
                    <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">Book Premium Service</span>
                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </Link>
                  <a href="tel:+971507177059" className="flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/8 px-6 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/14 sm:px-8 sm:py-4 sm:text-sm sm:tracking-widest">
                    <PhoneCall className="h-4 w-4 text-primary" />
                    +971 50 717 7059
                  </a>
                </div>
              </div>

              <div className="w-full max-w-xl lg:justify-self-end">
                <BookServiceForm
                  preselectedServiceName="AC Duct Cleaning"
                  title="Book This Service"
                  subtitle="Share your details and preferred location. Our team will confirm quickly."
                  headerAlignment="left"
                  className="bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl"
                />
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 animate-bounce flex-col items-center gap-2 md:flex">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/50">Explore Service</span>
            <div className="h-6 w-px bg-linear-to-b from-blue-400/50 to-transparent" />
          </div>
        </section>

        <section className="relative -mt-6 pb-8 md:-mt-10 md:pb-6">
          <div className="container mx-auto px-4 sm:px-6">
            <div
              className="rounded-3xl border border-white/20 px-4 py-5 shadow-[0_25px_60px_rgba(3,158,217,0.4)] backdrop-blur-[2px] sm:px-6 sm:py-6 md:px-10"
              style={{ backgroundImage: 'linear-gradient(135deg, #039ED9 0%, var(--primary) 100%)' }}
            >
              <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3 text-center text-white/90 sm:gap-4">
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-3 py-3 sm:gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xl font-black text-white sm:text-2xl">20,000+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/85 sm:text-[11px]">Satisfied Clients</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-3 py-3 sm:gap-3">
                  <Star className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xl font-black text-white sm:text-2xl">4.9/5.0</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/85 sm:text-[11px]">Service Rating</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-3 py-3 sm:gap-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xl font-black text-white sm:text-2xl">250+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/85 sm:text-[11px]">Expert Cleaners</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-3 py-3 sm:gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xl font-black text-white sm:text-2xl">100%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/85 sm:text-[11px]">City Coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-b from-[#f7fbff] to-[#eef5ff] py-14 sm:py-16 md:py-20 xl:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_25%,rgba(3,158,217,0.18)_0%,transparent_42%)]" />
          <div className="container mx-auto grid items-center gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-[#0f4f8c] to-primary px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-[#0f4f8c]/25 sm:text-[11px] sm:tracking-[0.18em]">
                Dubai AC Duct Cleaning Services
                <span className="h-0.5 w-10 bg-white/70" />
              </span>
              <h2 className="mt-5 max-w-2xl text-3xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-4xl md:text-5xl xl:text-6xl">
                Dubai AC Duct Cleaning Services
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:mt-6 sm:text-lg">
                Need expert AC Duct Cleaning Services?
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
                Most residents in Dubai strive to maintain a clean and healthy indoor environment, but often overlook
                AC ducts where sand, dust, mould spores, and bacteria quickly build up due to the city's dusty climate.
                Our professional AC duct cleaning service removes these hidden contaminants using advanced equipment
                and certified technicians, ensuring cleaner air and better system performance. We provide reliable
                duct cleaning solutions for apartments, villas, and commercial properties, helping improve indoor air
                quality and AC efficiency, especially during the extreme summer months.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md sm:max-w-140">
              <div className="absolute -left-4 top-6 hidden h-40 w-8 -skew-x-16 bg-linear-to-b from-[#5ecfff] to-primary shadow-xl md:block" />
              <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl md:[clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]">
                <div className="relative aspect-4/3">
                  <Image
                    src={detailsSectionImage}
                    alt="Inside of cleaned AC duct"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-8 right-4 hidden h-28 w-28 items-center justify-center rounded-full bg-linear-to-b from-[#039ED9] to-primary p-4 text-center text-xs font-black leading-tight text-white shadow-2xl sm:flex md:right-6 md:h-36 md:w-36 md:p-5 md:text-sm">
                Professional Service
                <br />
                AC Duct Cleaning
                <br />
                Dubai
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-14 sm:py-16 md:py-20 xl:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
              <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px] sm:tracking-[0.3em]">Dubai's Best AC Duct Cleaning</span>
              <h2 className="max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-4xl lg:text-5xl">What We <span className="text-primary">Offer You</span></h2>
              <div className="mt-6 h-1 w-20 rounded-full bg-linear-to-r from-[#039ED9] to-primary" />
            </div>
            
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7">
              {offerCards.map((card) => {
                const Icon = card.icon
                return (
                  <article key={card.title} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xs backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_20px_45px_-22px_rgba(236,72,153,0.35)] sm:rounded-[2.5rem] sm:p-7 lg:p-8">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-50/50 transition-all duration-500 group-hover:scale-150 group-hover:bg-blue-600/5" />
                    <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#039ED9] to-primary text-white shadow-xl shadow-primary/25 transition-transform duration-500 group-hover:rotate-6 sm:h-16 sm:w-16">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <h3 className="relative z-10 text-lg font-black text-slate-900 sm:text-xl">{card.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500 group-hover:text-slate-600">Premium AC duct cleaning Dubai for residential and commercial airflow channels.</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-[#1a2440] py-14 text-white sm:py-16 md:py-20 xl:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_78%_20%,rgba(236,72,153,0.28)_0%,transparent_40%)]" />
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
              <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary/90 sm:text-[11px] sm:tracking-[0.3em]">Quality You Can See</span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-4xl lg:text-5xl">Quality <span className="italic text-primary">You Can See</span></h2>
              <p className="mt-4 max-w-xl text-slate-400">
                We take pride in every job we do. Explore our before-and-after photos from real projects and see the difference for yourself. Discover how we transform homes like yours with results that truly stand out.
              </p>
            </div>

            <div className="mx-auto max-w-6xl">
              <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:border-primary/35 hover:bg-white/8 sm:rounded-[3rem]">
                <div className="relative aspect-video bg-slate-950/40">
                  <Image
                    src={beforeAfterSectionImage}
                    alt="AC duct cleaning results"
                    fill
                    className="object-contain p-2 transition-transform duration-700 group-hover:scale-105 sm:p-4"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-sm font-medium leading-relaxed text-slate-300">Real project results captured after professional AC duct cleaning.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-b from-white to-slate-50 py-14 sm:py-16 md:py-20 xl:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-16 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left">
              <div>
                <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-blue-600 sm:text-[11px] sm:tracking-[0.3em]">Local Presence</span>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-4xl lg:text-5xl">Dubai Area <span className="text-blue-600">Coverage</span></h2>
              </div>
              <div className="mt-8 flex gap-4 md:mt-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-xl shadow-blue-600/10 ring-8 ring-blue-50/50 sm:h-16 sm:w-16">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-[3rem]">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-65 sm:min-h-90 lg:min-h-105">
                  <iframe
                    title="Dubai service coverage map"
                    src="https://www.google.com/maps?q=Dubai,UAE&z=11&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute h-full w-full grayscale transition-all duration-700 hover:grayscale-0"
                  />
                </div>
                <div className="p-6 sm:p-7 lg:p-10 xl:p-12">
                  <h3 className="mb-8 text-xl font-black text-slate-900 sm:text-2xl">Marked Service Hubs</h3>
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
                  <div className="mt-10 rounded-[2rem] bg-linear-to-r from-[#039ED9] to-primary p-6 text-white shadow-2xl shadow-primary/30 sm:mt-12 sm:p-7 lg:p-8">
                    <p className="text-sm font-bold uppercase tracking-widest opacity-70">Support Hotline</p>
                    <p className="mt-1 text-xl font-black sm:text-2xl">Fast Dispatch Dubai Wide</p>
                    <Link href="/book-service" className="mt-6 inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-primary transition-all duration-300 hover:scale-105">
                      Check Availability
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-r from-[#0a3a70] via-[#0c5a9b] to-primary py-14 text-white sm:py-16 md:py-20 xl:py-24">
          <div className="absolute inset-0 opacity-15 [background:radial-gradient(circle_at_20%_15%,#1e88e5_0%,transparent_35%)]" />
          <div className="absolute -right-30 top-1/2 hidden h-140 w-140 -translate-y-1/2 rotate-45 border border-white/10 lg:block" />
          <div className="absolute -right-12.5 top-1/2 hidden h-96 w-96 -translate-y-1/2 rotate-45 border border-white/10 lg:block" />

          <div className="container relative z-10 mx-auto grid items-center gap-10 px-4 sm:gap-10 sm:px-6 lg:gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative mx-auto w-full max-w-sm sm:max-w-xl">
              <div className="absolute -left-3 top-8 hidden h-44 w-8 -skew-x-12 bg-linear-to-b from-[#66d5ff] to-primary shadow-2xl md:block" />
              <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl md:[clip-path:polygon(18%_0,100%_0,82%_100%,0_100%)]">
                <div className="relative aspect-4/3">
                  <Image
                    src={whyChooseSectionImage}
                    alt="Professional AC duct interior cleaning"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="absolute -bottom-10 left-1/2 hidden h-40 w-40 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-b from-[#039ED9] to-primary p-6 text-center text-sm font-black leading-tight text-white shadow-2xl md:flex">
                Professional Service
                <br />
                for Air Duct Cleaning
                <br />
                in Dubai
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-3 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#1b3f71] sm:gap-4 sm:px-5 sm:text-[11px] sm:tracking-[0.16em]">
                Why Dubai Residents Choose Homework UAE
                <span className="h-0.5 w-10 bg-[#1b3f71]" />
              </div>

              <h2 className="mt-4 max-w-3xl text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl xl:text-6xl">
                Why Dubai Residents
                <br className="hidden sm:block" />
                Choose Homework UAE
              </h2>

              <ul className="mt-7 space-y-3 text-base leading-relaxed text-white/95 sm:text-lg">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  We use modern, industrial-grade equipment and advanced techniques to thoroughly remove dust, debris, and contaminants from your air ducts.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  Our negative-air vacuum system creates proper pressure, ensuring pollutants are safely pulled out without spreading into your living space.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  We provide mold and mildew removal, allergen cleaning, and safe sanitizing treatments to improve indoor air quality.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  Our technicians are professionally trained, background-checked, fully insured, and experienced in handling all types of duct systems.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  We ensure full transparency by providing before-and-after photos along with a detailed job completion report.
                </li>
              </ul>

              <p className="mt-7 max-w-3xl text-lg font-semibold leading-relaxed text-white/95 sm:text-xl lg:text-2xl xl:text-3xl">
                Choose Homework UAE for AC duct cleaning Dubai, cleaner air, better health, and peace of mind.
              </p>

              <div className="mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
                <a href="tel:+971507177059" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#1a3c6b] transition hover:bg-slate-100 sm:text-sm">
                  Call +971 50 717 7059
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/book-service" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#1a3c6b] transition hover:bg-slate-100 sm:text-sm">
                  Book Online
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-b from-white to-slate-50/70 py-14 sm:py-16 md:py-20 xl:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px] sm:tracking-[0.3em]">The Blueprint</span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-4xl lg:text-5xl">Our Workflow <span className="text-primary">Protocol</span></h2>
              <div className="mt-6 h-1 w-20 rounded-full bg-linear-to-r from-[#039ED9] to-primary" />
            </div>

            <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
              {processSteps.map((step, idx) => {
                const Icon = step.icon
                return (
                  <article key={step.title} className="group relative rounded-3xl border border-slate-200 bg-slate-50/80 p-6 transition-all duration-500 hover:border-primary/25 hover:bg-white hover:shadow-[0_20px_40px_-24px_rgba(236,72,153,0.45)] sm:rounded-[2rem] sm:p-7 lg:p-8">
                    <div className="mb-8 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-xl shadow-primary/15 ring-1 ring-primary/10 transition-colors duration-500 group-hover:bg-linear-to-br group-hover:from-[#039ED9] group-hover:to-primary group-hover:text-white sm:h-14 sm:w-14">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="text-4xl font-black italic text-slate-200 transition-colors duration-500 group-hover:text-primary/20">0{idx + 1}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{step.title}</h3>
                    <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-500 transition-colors duration-500 group-hover:text-slate-600">{step.detail}</p>
                  </article>
                )
              })}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/book-service" className="inline-flex items-center gap-4 rounded-full bg-linear-to-r from-[#039ED9] to-primary px-7 py-4 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(236,72,153,0.32)] sm:px-10 sm:py-5 sm:text-sm">
                Breathe Better Today
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-100 py-14 sm:py-16 md:py-20 xl:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 sm:gap-12 lg:gap-14 lg:flex-row">
              <div className="lg:w-1/2">
                <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px] sm:tracking-[0.3em]">The Experts</span>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-4xl lg:text-5xl">Elite Air <br className="hidden sm:block" /><span className="text-primary">Technicians</span></h2>
                <p className="mt-6 text-base font-medium leading-relaxed text-slate-500 sm:text-lg">Our technicians are certified indoor air quality specialists, trained to handle everything from studio apartments to sprawling commercial campuses with precision tools.</p>
                
                <div className="mt-10 space-y-4">
                  {[
                    { icon: Timer, label: "Fast Dispatch", detail: "Transparent service timelines for your schedule." },
                    { icon: Activity, label: "Performance Audit", detail: "Pre and post airflow efficiency monitoring." },
                    { icon: ShieldCheck, label: "Clinical Safety", detail: "Hospital-grade sanitation protocols." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-3xl border border-slate-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 sm:gap-5 sm:p-4 lg:gap-6 lg:p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
                  <Link href="/book-service" className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-[#039ED9] to-primary px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:brightness-110 sm:text-xs">
                    Consult Our Team
                  </Link>
                </div>
              </div>
              
              <div className="relative lg:w-1/2">
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-blue-100 shadow-2xl sm:rounded-[4rem]">
                  <Image
                    src={expertsSectionImage}
                    alt="AC duct technicians"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-tr from-primary/30 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-10 -left-10 hidden rounded-[2.5rem] bg-white p-8 shadow-2xl ring-1 ring-slate-100 md:block">
                  <p className="text-3xl font-black text-primary">100%</p>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sanitized</p>
                  <p className="mt-4 text-[10px] font-bold text-slate-500">Certified Dubai Experts</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-[#1e2340] py-14 text-white sm:py-16 md:py-20 xl:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 flex flex-col items-center text-center sm:mb-20">
              <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary/90 sm:text-[11px] sm:tracking-[0.3em]">Clear Answers</span>
              <h2 className="text-3xl font-black italic tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">Technical FAQ</h2>
              <div className="mt-6 h-1.5 w-24 rounded-full bg-linear-to-r from-[#039ED9] to-primary" />
            </div>
            
            <div className="mx-auto max-w-4xl space-y-6">
              {faqs.map((item) => (
                <details key={item.q} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-500 open:border-primary/35 open:bg-white/10 sm:rounded-[2rem]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-black tracking-tight sm:p-6 sm:text-lg md:text-xl lg:p-8">
                    {item.q}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary transition-transform duration-500 group-open:rotate-180 sm:h-10 sm:w-10">
                      <ArrowRight className="h-5 w-5 rotate-90" />
                    </div>
                  </summary>
                  <div className="px-5 pb-5 text-slate-300 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                    <div className="mb-6 h-px w-full bg-white/5 p-0" />
                    <p className="text-base font-medium leading-relaxed sm:text-[17px]">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-b from-white to-slate-50/80 py-14 sm:py-16 md:py-20 xl:py-24">
          <div className="container mx-auto px-4 text-center sm:px-6">
            <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px] sm:tracking-[0.3em]">Google Reviews</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-4xl lg:text-5xl">What Our <span className="text-primary">Customers</span> Say</h2>
            
            <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <article key={review.name} className="flex w-full flex-col rounded-3xl border border-slate-200/70 bg-white p-6 text-left shadow-xs transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-[0_20px_45px_-24px_rgba(236,72,153,0.35)] sm:rounded-[3rem] sm:p-7 md:p-8 lg:p-9">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} viewBox="0 0 24 24" className="h-5 w-5 fill-[#fbbc05] text-[#fbbc05]">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</span>
                  </div>
                  <p className="mb-8 text-[15px] font-medium leading-relaxed text-slate-600 sm:mb-10 sm:text-[16px]">"{review.text}"</p>
                  <div className="mt-auto flex items-center gap-3 border-t border-slate-200 pt-6 sm:gap-4 sm:pt-8">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-blue-50 ring-offset-2 sm:h-14 sm:w-14">
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
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-primary text-white">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-primary">{review.area}</p>
                    </div>
                    <div className="ml-auto">
                      {googleBusinessIcon}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-4 sm:mt-16">
              <div className="hidden h-px w-12 bg-slate-200 sm:block" />
              <p className="text-sm font-bold text-slate-500">Rated <span className="text-slate-900">4.9/5</span> based on 850+ Google Reviews</p>
              <div className="hidden h-px w-12 bg-slate-200 sm:block" />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
