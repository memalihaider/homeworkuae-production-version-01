"use client"

import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ArrowRight, 
  Waves, 
  Play, 
  Sparkles, 
  Droplets, 
  Shield, 
  Search,
  Wind,
  ShieldAlert,
  Activity,
  History,
  TrendingDown,
  Scale,
  Stethoscope,
  Trash2,
  Filter
} from 'lucide-react'

export default function WaterTankCleaning() {
  const categories = [
    {
      title: "The Hidden Dangers",
      icon: ShieldAlert,
      items: [
        { name: "Pathogen Risks", desc: "Dirty tanks harbor bacteria, viruses, and parasites causing gastrointestinal and skin infections." },
        { name: "Sediment & Algae", desc: "Accumulation leads to clogs, reduced flow, and unpleasant metallic or earthy tastes." },
        { name: "Giardiasis & Crypto", desc: "Common parasites in contaminated tanks that lead to severe abdominal pain and distress." },
        { name: "Legionnaires’ Disease", desc: "Critical risk of pneumonia caused by Legionella bacteria found in stagnant, dirty water." }
      ]
    },
    {
      title: "Recognizing the Signs",
      icon: Search,
      items: [
        { name: "Discoloration", desc: "Cloudy or rusty-looking water is a primary indicator of heavy internal tank contamination." },
        { name: "Foul Odors", desc: "Unusual smells from your taps signal active bacterial growth or algae presence in the storage." },
        { name: "Taste Changes", desc: "A metallic or earthy flavor suggests that your tank's protective lining or water is compromised." },
        { name: "Visible Sediment", desc: "Seeing debris or sand when filling a glass is a clear sign your tank requires urgent attention." }
      ]
    },
    {
      title: "The Cleaning Standard",
      icon: Droplets,
      items: [
        { name: "Full Evacuation", desc: "Completely draining the tank to expose all interior surfaces for deep mechanical scrubbing." },
        { name: "Food-Grade Sanitizing", desc: "Using Dubai Municipality-approved non-toxic agents to eliminate 99.9% of waterborne pathogens." },
        { name: "High-Pressure Rinse", desc: "Removing all chemical residues and dislodged biofilm with medical-grade pressure washing." },
        { name: "Laboratory Testing", desc: "Optional water quality kits to verify your water remains crisp, refreshing, and safe for use." }
      ]
    },
    {
      title: "Maintenance & Prevention",
      icon: Activity,
      items: [
        { name: "Quarterly Inspections", desc: "Checking every few months for signs of buildup or structural leaks to catch problems early." },
        { name: "Secure Cover Seals", desc: "Ensuring tank lids are airtight to prevent debris, insects, and birds from entering the supply." },
        { name: "Filtration Upgrades", desc: "Installing and maintaining in-tank sediment filters to reduce the cleaning frequency needed." },
        { name: "Safety Data Compliance", desc: "Always using products that are biodegradable and safe for drinking water systems." }
      ]
    },
    {
      title: "Why Hire Professionals?",
      icon: ShieldCheck,
      items: [
        { name: "Expertise vs DIY", desc: "Professionals have the industrial equipment needed for deep cleaning that heavy contamination requires." },
        { name: "Peace of Mind", desc: "Proper disinfection prevents the 50% risk of waterborne illness linked to poor hygiene practices." },
        { name: "Advanced Equipment", desc: "Using high-pressure jets and sludge pumps that aren't available for standard home use." },
        { name: "Certified Safe", desc: "Full documentation and certification for municipality health and safety audits." }
      ]
    }
  ]

  const servicesList = [
    { name: "Ac Duct Cleaning", slug: "ac-duct-cleaning" },
    { name: "Ac Coil Cleaning", slug: "ac-coil-cleaning" },
    { name: "Kitchen Hood Cleaning", slug: "kitchen-hood-cleaning" },
    { name: "Grease Trap Cleaning", slug: "grease-trap-cleaning" },
    { name: "Restaurant Cleaning", slug: "restaurant-cleaning" },
    { name: "Water Tank Cleaning", slug: "water-tank-cleaning" },
    { name: "Swimming Pool Cleaning", slug: "swimming-pool-cleaning" },
    { name: "Gym Deep Cleaning", slug: "gym-deep-cleaning" },
    { name: "Facade Cleaning", slug: "facade-cleaning" },
    { name: "Villa Deep Cleaning", slug: "villa-deep-cleaning" },
    { name: "Move in/out Cleaning", slug: "move-in-out-cleaning" },
    { name: "Apartment Deep Cleaning", slug: "apartment-deep-cleaning" },
    { name: "Office Deep Cleaning", slug: "office-cleaning" },
    { name: "Post Construction Cleaning", slug: "post-construction-cleaning" },
    { name: "Kitchen Deep Cleaning", slug: "kitchen-deep-cleaning" }
  ]

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?auto=format&fit=crop&q=80&w=1600" 
            alt="Water Tank Cleaning" 
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
              Essential Health Hygiene
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              PURE WATER <br />
              <span className="text-primary italic text-5xl md:text-8xl">STORAGE SOLUTIONS</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium uppercase tracking-tight">
              Top-Quality Water Tank Cleaning in UAE – Safe and Clean Water
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
                    Protect Your Health: The <span className="text-primary italic text-3xl md:text-5xl border-b-4 border-primary/20">Ultimate Tank Sanitization Checklist</span>
                  </h2>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
                    Water tanks are an essential part of many homes and businesses, providing a vital resource for daily needs. However, many people overlook the importance of keeping these tanks clean. 
                  </p>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed">
                    Dirty water tanks can harbor harmful bacteria, viruses, and parasites. These pathogens can cause various health issues, including gastrointestinal problems, skin infections, and respiratory diseases. At Homework Cleaning Services LLC, we provide municipality-standard disinfection to ensure your family or staff have access to crisp, safe drinking water.
                  </p>
                  <div className="p-8 bg-slate-50 rounded-3xl border-l-4 border-primary shadow-sm">
                    <p className="text-slate-700 font-bold italic text-sm">
                      "If you're looking to perform Water Tank Cleaning, here's a practical checklist to keep your home clean and organized efficiently."
                    </p>
                  </div>
                </div>

                <div className="space-y-12">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
                    <Stethoscope className="h-8 w-8 text-primary" />
                    Our Comprehensive Hygiene Process:
                  </h3>

                  <div className="grid gap-8">
                    {categories.map((cat, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50"
                      >
                        <div className="flex items-center gap-4 mb-8">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <cat.icon className="h-6 w-6" />
                          </div>
                          <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{cat.title}</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          {cat.items.map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center text-primary mt-1 group-hover:bg-primary group-hover:text-white transition-all">
                                <CheckCircle2 className="h-3 w-3" />
                              </div>
                              <div>
                                <h5 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-1">{item.name}</h5>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100 italic font-medium text-slate-500">
                  <p>
                    Safe water starts with a clean tank. According to the CDC, proper water treatment and hygiene practices can reduce waterborne illnesses by up to 50%.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 order-1 lg:order-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-3xl sticky top-24 max-h-[80vh] overflow-y-auto"
              >
                <h4 className="text-2xl font-black mb-8 tracking-tight italic">Technical Services</h4>
                <div className="space-y-4">
                  {servicesList.map((service, i) => (
                    <a 
                      key={i} 
                      href={`/services/${service.slug}`} 
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        service.slug === "water-tank-cleaning" 
                        ? 'bg-primary border-primary text-white font-black shadow-lg shadow-primary/20' 
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-widest">{service.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-primary/10 rounded-3xl border border-primary/20 text-center">
                  <p className="text-sm font-bold text-primary mb-4 uppercase tracking-[0.2em]">Easy Booking</p>
                  <p className="text-2xl font-black text-white tracking-tighter mb-8 italic leading-tight uppercase tracking-widest">SCHEDULE NOW</p>
                  <a href="https://homeworkuae.com/book-service" className="block w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-pink-700 transition-all shadow-xl shadow-primary/40">
                     Book Now
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-24 bg-slate-950 text-white relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-slate-950 rounded-[3.5rem] text-center relative overflow-hidden group container mx-auto px-4 max-w-3xl"
        >
          <div className="relative z-10">
            <h4 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Ensure Clean, <span className="text-primary italic">Safe Water</span></h4>
            <p className="text-slate-400 text-lg mb-10 font-bold">Contact us today for professional water tank cleaning services.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="https://homeworkuae.com/book-service" className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-pink-700 transition-all flex items-center gap-3">
                 Book Now
              </a>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}

