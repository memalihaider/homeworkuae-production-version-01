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
  Search 
} from 'lucide-react'


export default function MattressDeepCleaning() {
  const categories = [
    {
      title: "Inspection and Pre-Treatment",
      icon: Search,
      items: [
        { name: "Mattress Assessment", desc: "Thorough inspection of your mattress to identify stains, odors, and areas requiring special attention." },
        { name: "Spot Treatment", desc: "Pre-treating stains and spots with specialized cleaning solutions to ensure effective stain removal." }
      ]
    },
    {
      title: "Deep Cleaning",
      icon: Droplets,
      items: [
        { name: "Vacuuming", desc: "Using powerful vacuums to remove dust, dirt, and allergens from the surface and crevices of your mattress." },
        { name: "Steam Cleaning", desc: "Employing steam cleaning to penetrate deep into the mattress, killing bacteria and dust mites while lifting dirt and grime." },
        { name: "Dry Cleaning", desc: "Utilizing dry cleaning methods for delicate mattress materials, ensuring a gentle yet effective clean." }
      ]
    },
    {
      title: "Stain and Odor Removal",
      icon: Sparkles,
      items: [
        { name: "Stain Treatment", desc: "Treating and removing tough stains, such as sweat, urine, and spills, to restore your mattress’s appearance." },
        { name: "Odor Elimination", desc: "Applying deodorizing agents to neutralize unpleasant odors, leaving your mattress smelling fresh and clean." }
      ]
    }
  ]

  const servicesList = [
    { name: "Regular Residential cleaning", slug: "residential-cleaning" },
    { name: "Regular Office cleaning", slug: "office-cleaning" },
    { name: "Floor deep cleaning", slug: "floor-deep-cleaning" },
    { name: "Window cleaning", slug: "window-cleaning" },
    { name: "Balcony Deep Cleaning", slug: "balcony-deep-cleaning" },
    { name: "Sofa Deep Cleaning", slug: "sofa-deep-cleaning" },
    { name: "Carpets Deep Cleaning", slug: "carpets-deep-cleaning" },
    { name: "Mattress Deep Cleaning", slug: "mattress-deep-cleaning" }
  ]

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1632342527264-42620f2c62c9?auto=format&fit=crop&q=80&w=1600" 
            alt="Mattress Deep Cleaning" 
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
              Deep Cleaning Services
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              SLEEP CLEAN & <br />
              <span className="text-primary italic">COMFORTABLE</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium uppercase tracking-tight">
              UAE'S PREMIER MATTRESS DEEP CLEANING FOR BETTER SLEEP HYGIENE
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
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                    Welcome to <span className="text-primary">Homework Cleaning Services LLC</span>
                  </h2>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed">
                    A clean and hygienic mattress is essential for a good night’s sleep and overall health. At Homework Cleaning Services LLC, we offer professional mattress deep cleaning services to ensure your mattress is free from dust, allergens, and stains. Our experienced team uses advanced cleaning techniques and eco-friendly products to give your mattress a thorough clean, leaving it fresh and revitalized.
                  </p>
                  <div className="p-8 bg-slate-50 rounded-3xl border-l-4 border-primary">
                    <p className="text-slate-700 font-bold italic">
                      "Deep cleaning your mattress removes dirt, allergens, and stains, extending its lifespan and promoting better sleep hygiene. Here’s our comprehensive step-by-step guide."
                    </p>
                  </div>
                </div>

                <div className="space-y-12">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
                    <Layers className="h-8 w-8 text-primary" />
                    Our Comprehensive Mattress Cleaning Services:
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
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 order-1 lg:order-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-3xl sticky top-24"
              >
                <h4 className="text-2xl font-black mb-8 tracking-tight italic">Other Services</h4>
                <div className="space-y-4">
                  {servicesList.map((service, i) => (
                    <a 
                      key={i} 
                      href={`/services/${service.slug}`} 
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        service.slug === "mattress-deep-cleaning" 
                        ? 'bg-primary border-primary text-white font-black' 
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs uppercase tracking-widest">{service.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Pricing</p>
                  <p className="text-4xl font-black text-primary tracking-tighter mb-8 italic">Contact Us</p>
                  <a href="/book-service" className="w-full bg-white text-slate-900 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all inline-block">
                    Custom Quote
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
            <h4 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Sleep in a <span className="text-primary italic">Cleaner, Healthier Bed</span></h4>
            <p className="text-slate-400 text-lg mb-10 font-bold">Contact us today for professional mattress deep cleaning services.</p>
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
