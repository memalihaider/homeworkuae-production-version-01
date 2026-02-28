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
  Flame,
  Fan,
  Activity,
  History,
  TrendingDown,
  Scale
} from 'lucide-react'

export default function KitchenHoodCleaning() {
  const categories = [
    {
      title: "Critical Safety & Risks",
      icon: ShieldAlert,
      items: [
        { name: "Fire Hazard Prevention", desc: "Cooking equipment causes 50% of restaurant fires; we eliminate the grease buildup that fuel them." },
        { name: "Compliance & Fines", desc: "Avoid potential fines of $1,000 to $10,000 and the risk of business license suspension." },
        { name: "Insurance Savings", desc: "Poor hood maintenance can increase insurance premiums by up to 30%—we help you save." },
        { name: "Health Code Standards", desc: "Maintain absolute hygiene to pass local municipal and fire safety inspections effortlessly." }
      ]
    },
    {
      title: "Our Intensive Cleaning Process",
      icon: Droplets,
      items: [
        { name: "Dismantling & Prep", desc: "Detaching filters and panels while protecting all nearby kitchen surfaces from debris." },
        { name: "Heavy-Duty Degreasing", desc: "Applying industrial-grade degreasers to break down carbonized grease on all surfaces." },
        { name: "Abrasive Scrubbing", desc: "Manual scrubbing with professional pads to remove stubborn residue from the hood canopy." },
        { name: "Rinsing & Reassembly", desc: "High-pressure rinsing followed by secure reinstallation of filters and panels." }
      ]
    },
    {
      title: "Performance & Longevity",
      icon: TrendingDown,
      items: [
        { name: "Improved Air Quality", desc: "Effective heat and smoke removal ensures a safer, more comfortable air environment for staff." },
        { name: "Enhanced Efficiency", desc: "Clean exhaust systems allow for faster heat removal, improving overall cooking performance." },
        { name: "Equipment Longevity", desc: "Preventing grease buildup reduces wear on exhaust fans and ducts, extending their lifespan." },
        { name: "Energy Reduction", desc: "An unobstructed exhaust fan works more efficiently, lowering daily operational energy costs." }
      ]
    },
    {
      title: "Maintenance & Training",
      icon: Activity,
      items: [
        { name: "Daily Staff Practices", desc: "Training your team on daily wipe-downs and filter cleaning to prevent rapid grease accumulation." },
        { name: "Regular Schedule", desc: "Setting up a maintenance check schedule to identify potential duct issues before they escalate." },
        { name: "Employee Training", desc: "Ensuring staff understands the proper procedures and the vital importance of hood safety." },
        { name: "Documentation", desc: "Full reports or logs of our professional cleanings for your safety audits and future reference." }
      ]
    },
    {
      title: "Choosing the Right Partner",
      icon: Scale,
      items: [
        { name: "Licensing & Insurance", desc: "We are fully licensed and insured, ensuring we follow all UAE industry standards." },
        { name: "Proven Reputation", desc: "Years of experience in restaurant hood cleaning with a track record of total compliance." },
        { name: "Transparent Pricing", desc: "Detailed quotes with no hidden fees, helping you budget for safety without surprises." },
        { name: "NFPA Compliance", desc: "Our methods align with National Fire Protection Association standards for exhaust systems." }
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
            src="https://images.unsplash.com/photo-1556911220-e150213ff337?auto=format&fit=crop&q=80&w=1600" 
            alt="Kitchen Hood Cleaning" 
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
              Safety & Compliance
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              KITCHEN HOOD <br />
              <span className="text-primary italic text-5xl md:text-8xl">HYGIENE EXPERTS</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium uppercase tracking-tight">
              Expert Kitchen Hood Cleaning in UAE – Safe and Hygienic Kitchens
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
                    Safety & Compliance: Essential <span className="text-primary italic">Kitchen Exhaust Maintenance</span>
                  </h2>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
                    When you think of a restaurant’s kitchen, the focus usually goes to the food being prepared. Yet, one crucial component often overlooked is the kitchen hood. Regular cleaning of this system is not just a good practice; it’s essential for safety and compliance.
                  </p>
                  <p className="text-slate-600 text-lg font-medium leading-relaxed">
                    At Homework Cleaning Services LLC, we understand that cooking equipment is the leading cause of restaurant fires, accounting for over 50% of all incidents. Grease buildup in kitchen exhaust systems is a major contributor, leading to potential infernos that can devastate your establishment. We help you stay compliant, avoid fines, and protect your bottom line.
                  </p>
                  <div className="p-8 bg-slate-50 rounded-3xl border-l-4 border-primary shadow-sm">
                    <p className="text-slate-700 font-bold italic text-sm">
                      "If you're looking to perform kitchen cleaning, here's a practical checklist to keep your home clean and organized efficiently."
                    </p>
                  </div>
                </div>

                <div className="space-y-12">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
                    <History className="h-8 w-8 text-primary" />
                    Our Comprehensive Safety Checklist:
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
                    Follow local fire and health regulations to avoid fines ranging from $1,000 to $10,000. Don’t wait for a violation or fire incident to take action—prioritize your kitchen hood cleaning today for success and safety.
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
                        service.slug === "kitchen-hood-cleaning" 
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
            <h4 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Keep Your <span className="text-primary italic">Kitchen Hood Clean</span></h4>
            <p className="text-slate-400 text-lg mb-10 font-bold">Contact us today for professional kitchen hood cleaning services.</p>
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

