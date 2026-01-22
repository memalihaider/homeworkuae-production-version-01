"use client"

import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col overflow-hidden pt-20">
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">
              Compliance & Safety
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-12 leading-tight uppercase">
              Privacy <span className="text-primary italic">Policy</span>
            </h1>
            
            <div className="space-y-12 bg-white p-12 md:p-20 rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-100">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                  <h2 className="text-2xl font-black uppercase">Information Collection</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  At Homework UAE, we respect your privacy. We collect personal information such as your name, contact details, and address solely for the purpose of providing and coordinating our cleaning services. This data is stored securely and is never shared with third parties for marketing purposes.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                  <Lock className="h-8 w-8" />
                  <h2 className="text-2xl font-black uppercase">Data Security</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  We implement industry-standard security measures to protect your personal data from unauthorized access or disclosure. Our online booking system uses SSL encryption to ensure your payment and personal details are handled with the highest level of security.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                  <Eye className="h-8 w-8" />
                  <h2 className="text-2xl font-black uppercase">Usage Disclosure</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  We use your information to:
                  <ul className="list-disc pl-6 mt-4 space-y-2">
                    <li>Schedule and confirm your cleaning appointments</li>
                    <li>Process payments and issue invoices</li>
                    <li>Communicate service updates or changes</li>
                    <li>Enhance our customer support experience</li>
                  </ul>
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                  <FileText className="h-8 w-8" />
                  <h2 className="text-2xl font-black uppercase">Your Rights</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  You have the right to request access to the personal data we hold about you, to request corrections, or to ask for your data to be deleted from our active databases when it is no longer required for service delivery.
                </p>
              </div>

              <div className="pt-10 border-t border-slate-100 text-slate-400 text-sm font-bold">
                Last Updated: January 2026 | Homework UAE Compliance Department
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
