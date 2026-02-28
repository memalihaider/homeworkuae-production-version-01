"use client"

import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ArrowRight, 
  Layers, 
  Play, 
  Sparkles, 
  Droplets, 
  Shield, 
  Search,
  Wind,
  ShieldAlert,
  ThermometerSnowflake,
  Fan,
  History,
  Activity
} from 'lucide-react'

export default function ACCoilCleaning() {
  const categories = [
    {
      title: "Importance of Clean Coils",
      icon: ThermometerSnowflake,
      items: [
        { name: "Energy Waste", desc: "Dirty coils can increase energy waste by up to 30%, causing soaring utility bills." },
        { name: "Health Concerns", desc: "Dust, mold, and allergens accumulate on coils, contributing to poor indoor air quality." },
        { name: "System Performance", desc: "Regular cleaning ensures optimal cooling performance and long-term system health." },
        { name: "Reduced Strain", desc: "Clean coils prevent the AC unit from working harder than necessary to cool your space." }
      ]
    },
    {
      title: "Coil Types & Locations",
      icon: Search,
      items: [
        { name: "Evaporator Coils", desc: "Located inside your home near the furnace, these absorb heat from the indoor air." },
        { name: "Condenser Coils", desc: "Positioned in the outdoor unit, these release heat to the outside environment." },
        { name: "Visual Signs", desc: "Look for dirt buildup, corrosion, or visible mold as cues for immediate cleaning." },
        { name: "Unit Access", desc: "Indoor coils are near the air handler; outdoor units are on rooftops or ground level." }
      ]
    },
    {
      title: "Professional Cleaning Method",
      icon: Wind,
      items: [
        { name: "Chemical Scrubbing", desc: "Applying specialized non-corrosive coil cleaners to strip away oxidation and scale." },
        { name: "HEPA Vacuuming", desc: "Using vacuum attachments to gently clear loose debris from delicate aluminum fins." },
        { name: "High-Pressure Rinse", desc: "Thoroughly rinsing coils with water to ensure absolute removal of grime and chemicals." },
        { name: "Fan Cage Service", desc: "Removing and cleaning the fan cage to ensure unobstructed outdoor airflow." }
      ]
    },
    {
      title: "Prevention & Maintenance",
      icon: Clock,
      items: [
        { name: "Regular Schedule", desc: "We recommend professional coil cleaning every 6-12 months for peak efficiency." },
        { name: "Filter Management", desc: "Change air filters every 1-3 months to prevent dust from reaching and clogging coils." },
        { name: "Clearance Rules", desc: "Keep outdoor units free of vegetation and debris for proper heat exchange." },
        { name: "Peak Season Check", desc: "Ideally schedule your cleaning just before the heavy cooling season begins." }
      ]
    },
    {
      title: "Long-Term Benefits",
      icon: Zap,
      items: [
        { name: "Energy Savings", desc: "A clean AC unit can save between 5% to 15% on energy bills annually." },
        { name: "Superior IAQ", desc: "Drastically reduce airborne irritants and provide a healthier indoor environment." },
        { name: "Extended Lifespan", desc: "Regular maintenance increases system longevity, saving you from premature replacement." },
        { name: "Enhanced Comfort", desc: "Ensure your home reaches target temperatures faster with efficient heat transfer." }
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
            alt="AC Coil Cleaning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/40 to-slate-950" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">
              Efficiency Experts
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              AC COIL <br />
              <span className="text-primary italic">CLEANING</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium uppercase tracking-tight">
              Efficient AC Coil Cleaning in UAE – Enhanced Cooling Efficiency
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
                    Keep Your Cool: A Comprehensive <span className="text-primary italic">Guide to AC Coil Cleaning</span>
                  </h2>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
                    Keeping your air conditioning (AC) system in top shape is essential for comfort, efficiency, and health. One important yet often overlooked component is the AC coils. 
                  </p>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed">
                    Cleaning these coils may not be glamorous, but it can save you money and improve air quality in your home. At Homework Cleaning Services LLC, we use specialized non-corrosive chemicals and tools to ensure your evaporator and condenser coils are working at peak performance.
                  </p>
                  <div className="p-8 bg-slate-50 rounded-3xl border-l-4 border-primary shadow-sm">
                    <p className="text-slate-700 font-bold italic text-sm">
                      "If you're looking to perform AC Coil Cleaning, here's a practical checklist to keep your home clean and organized efficiently."
                    </p>
                  </div>
                </div>

                <div className="space-y-12">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
                    <Activity className="h-8 w-8 text-primary" />
                    Service Breakdown & Checklist:
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
                        <div className="grid md:grid-cols-1 gap-6">
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
                    Dr. Sarah Smith, an HVAC expert, states, “Regular maintenance can drastically reduce airborne irritants.” Prioritizing AC Coil Cleaning ensures comfort, savings, and health for your entire family.
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
                <h4 className="text-2xl font-black mb-8 tracking-tight italic">HVAC Maintenance</h4>
                <div className="space-y-4">
                  {servicesList.map((service, i) => (
                    <a 
                      key={i} 
                      href={`/services/${service.slug}`} 
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        service.slug === "ac-coil-cleaning" 
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
                  <p className="text-sm font-bold text-primary mb-4 uppercase tracking-[0.2em]">Book Today</p>
                  <p className="text-2xl font-black text-white tracking-tighter mb-8 italic leading-tight uppercase">Restore Your<br />Cooling Flow</p>
                  <a href="https://homeworkuae.com/book-service" className="block w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-pink-700 transition-all shadow-xl shadow-primary/30">
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
            <h4 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Keep Your AC Running at <span className="text-primary italic">Peak Efficiency</span></h4>
            <p className="text-slate-400 text-lg mb-10 font-bold">Contact us today for professional AC coil cleaning in the UAE.</p>
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

