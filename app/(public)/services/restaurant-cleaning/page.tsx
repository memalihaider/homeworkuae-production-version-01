"use client"

import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ArrowRight, 
  Utensils, 
  Play, 
  Sparkles, 
  ChefHat, 
  Wine, 
  Trash2, 
  Users,
  Search,
  Droplets,
  Shield,
  Wind,
  Flame,
  Fan,
  Activity,
  History,
  TrendingDown,
  Scale
} from 'lucide-react'

export default function RestaurantCleaning() {
  const categories = [
    {
      title: "Dining Area Cleaning",
      icon: Users,
      items: [
        { name: "Floor Care", desc: "Expert vacuuming, sweeping, and mopping of all flooring types to maintain a pristine guest environment." },
        { name: "Furniture Sanitization", desc: "Thorough wiping and disinfecting of tables, chairs, and booths to remove spills and pathogens." },
        { name: "Glass & Mirrors", desc: "Precision cleaning of windows and mirrors for a streak-free, crystal-clear appearance." },
        { name: "Fixtures & Décor", desc: "Detailed dusting of light fixtures and wall art to preserve your restaurant's aesthetic appeal." }
      ]
    },
    {
      title: "Kitchen Deep Cleaning",
      icon: ChefHat,
      items: [
        { name: "Equipment Degreasing", desc: "Intensive cleaning of ovens, stoves, fryers, and grills to remove carbon buildup and grease." },
        { name: "Workstation Hygiene", desc: "Sterilizing countertops and cutting boards to ensure a safe, cross-contamination-free prep zone." },
        { name: "Appliance Detailing", desc: "Interior and exterior sanitization of refrigerators, freezers, and industrial dishwashers." },
        { name: "Sinks & Drainage", desc: "Descaling and disinfecting sinks and drain strainers to prevent odors and backups." }
      ]
    },
    {
      title: "Restroom Sanitization",
      icon: Droplets,
      items: [
        { name: "Fixture Sterilization", desc: "Medical-grade cleaning of toilets, urinals, and sinks to eliminate bacteria and viruses." },
        { name: "High-Touch surfaces", desc: "Disinfecting handles, dispensers, and countertops to protect guest health." },
        { name: "Deep Floor Scrubbing", desc: "Mechanical scrubbing of restroom floors to remove deep-seated grime and bacteria." },
        { name: "Supply Management", desc: "Full restocking of essential supplies including soap, tissues, and hand towels." }
      ]
    },
    {
      title: "Bar & Service Areas",
      icon: Wine,
      items: [
        { name: "Bar Station Hygiene", desc: "Cleaning and sanitizing bar counters, rail systems, and drink preparation surfaces." },
        { name: "Glassware Polishing", desc: "Specialized washing and polishing to ensure every glass is spotless and ready for service." },
        { name: "Debris Removal", desc: "Sweeping and mopping bar floors to eliminate sticky residues and beverage spills." },
        { name: "Tap & Drain Care", desc: "Clearing and sanitizing beer taps and drainage lines for optimal beverage quality." }
      ]
    },
    {
      title: "Exterior Excellence",
      icon: Sparkles,
      items: [
        { name: "Entrance Maintenance", desc: "Sweeping and cleaning the main entry to create an immediate positive first impression." },
        { name: "Patio & Outdoor Seating", desc: "Washing and sanitizing outdoor furniture and flooring for a fresh al-fresco experience." },
        { name: "Facade Window Cleaning", desc: "Deep cleaning of exterior windows and signage for maximum curb appeal." },
        { name: "Waste Zone Sanitization", desc: "Cleaning and deodorizing external waste areas to maintain overall hygiene." }
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
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1600" 
            alt="Restaurant Cleaning" 
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
              F&B Specialized Hygiene
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              RESTAURANT <br />
              <span className="text-primary italic text-5xl md:text-8xl">CLEANING SOLUTIONS</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium uppercase tracking-tight">
              Comprehensive Restaurant Cleaning in UAE – Spotless and Hygienic Dining
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
                    Exceed Health Codes: Your <span className="text-primary italic text-3xl md:text-5xl border-b-4 border-primary/20">Master Kitchen & Dining Checklist</span>
                  </h2>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
                    Keeping your restaurant clean and sanitary is essential for both customer satisfaction and health compliance. 
                  </p>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed">
                    At Homework Cleaning Services LLC, we specialize in providing comprehensive restaurant cleaning services tailored to meet the unique needs of the foodservice industry. Our experienced team uses advanced cleaning techniques and eco-friendly products to ensure your restaurant is spotless and hygienic from the front door to the back dock.
                  </p>
                  <div className="p-8 bg-slate-50 rounded-3xl border-l-4 border-primary shadow-sm">
                    <p className="text-slate-700 font-bold italic text-sm">
                      "If you're looking to perform Restaurant Kitchen Hood Cleaning, here's a practical checklist to keep your home clean and organized efficiently."
                    </p>
                  </div>
                </div>

                <div className="space-y-12">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
                    <Star className="h-8 w-8 text-primary" />
                    Our Comprehensive Cleaning Modules:
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
                    Ensure your reputation stays as spotless as your floors. Contact Homework Cleaning Services LLC today for a customized restaurant hygiene plan.
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
                <h4 className="text-2xl font-black mb-8 tracking-tight italic">Commercial Services</h4>
                <div className="space-y-4">
                  {servicesList.map((service, i) => (
                    <a 
                      key={i} 
                      href={`/services/${service.slug}`} 
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        service.slug === "restaurant-cleaning" 
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
                  <p className="text-sm font-bold text-primary mb-4 uppercase tracking-[0.2em]">Immediate Quote</p>
                  <p className="text-2xl font-black text-white tracking-tighter mb-8 italic leading-tight uppercase tracking-widest">DRIVE CUSTOMER<br />TRUST</p>
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
            <h4 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Keep Your Restaurant <span className="text-primary italic">Pristine</span></h4>
            <p className="text-slate-400 text-lg mb-10 font-bold">Contact us today for professional restaurant cleaning services.</p>
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

