"use client"

import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Briefcase } from 'lucide-react'

export default function OfficeCleaning() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600"
            alt="Office Cleaning"
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
              Normal Cleaning Services
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              REGULAR <br />
              <span className="text-primary italic">OFFICE</span> CLEANING
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Transform Your Office with UAE's Expert Regular Office Cleaning Services
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1 rounded-[3rem] overflow-hidden shadow-3xl group"
            >
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
                alt="Office Cleaning"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-3 text-primary">
                <Briefcase className="h-6 w-6" />
                <span className="text-sm font-black uppercase tracking-widest">Office Cleaning Specialists</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                Professional Office <br />
                <span className="text-primary italic">Cleaning Service</span>
              </h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed">
                A clean and organized office environment is essential for productivity and employee well-being. At Homework Cleaning Services LLC, we offer reliable and comprehensive regular office cleaning services tailored to your specific needs. Our experienced team uses advanced techniques and eco-friendly products to ensure your office stays spotless.
              </p>

              <div className="grid gap-4">
                {[
                  "Reception & Lobby Cleaning",
                  "Workstation & Desk Wiping",
                  "Electronics & Screen Dusting",
                  "Restroom Deep Sanitization",
                  "Kitchen & Pantry Clean",
                  "Floor Vacuuming & Mopping",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700 font-bold">{item}</span>
                  </div>
                ))}
              </div>

              <motion.a
                href="/book-service"
                className="inline-flex items-center gap-4 bg-primary px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-2xl shadow-primary/30 hover:bg-pink-600 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                Book Office Cleaning <ArrowRight className="h-5 w-5" />
              </motion.a>
            </motion.div>
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
            <h4 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Maintain a <span className="text-primary italic">Professional Workspace</span></h4>
            <p className="text-slate-400 text-lg mb-10 font-bold">Contact us today for professional office cleaning services.</p>
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
