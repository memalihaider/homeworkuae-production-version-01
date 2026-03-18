"use client"

import { CheckCircle2, ArrowRight, Zap, ShieldCheck, Star, Heart } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getPricingPage, defaultPricingPage, type CMSPricingPage } from '@/lib/cms-data'

export default function Pricing() {
  const [cms, setCms] = useState<CMSPricingPage>(defaultPricingPage)

  useEffect(() => {
    let m = true
    getPricingPage().then(d => { if (m) setCms(d) }).catch(() => {})
    return () => { m = false }
  }, [])

  const tierIcons = [Zap, Star, Heart]
  const packages = cms.tiers.map((t, i) => ({
    ...t,
    icon: tierIcons[i % tierIcons.length],
  }))

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={cms.heroImage}
            alt="Pricing"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">{cms.heroTitle.includes('\n') ? cms.heroTitle.split('\n').map((l, i) => <span key={i}>{i > 0 && ' '}{i === 1 ? <span className="text-primary">{l}</span> : l}</span>) : <>Simple <span className="text-primary">Pricing</span></>}</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {cms.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div 
                key={index} 
                className={`relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col ${
                  pkg.popular 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105 z-10' 
                    : 'bg-white text-slate-900 border-slate-100 hover:shadow-xl'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-sm font-black rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${pkg.popular ? 'bg-primary text-white' : 'bg-pink-50 text-primary'}`}>
                    <pkg.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">{pkg.name}</h3>
                  <p className={pkg.popular ? 'text-slate-400' : 'text-slate-500'}>{pkg.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black uppercase tracking-widest">AED</span>
                    <span className="text-5xl font-black">{pkg.price}</span>
                    <span className={pkg.popular ? 'text-slate-400' : 'text-slate-500'}>/visit</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-sm">
                      <CheckCircle2 className={`h-5 w-5 ${pkg.popular ? 'text-primary' : 'text-primary'}`} />
                      <span className={pkg.popular ? 'text-slate-300' : 'text-slate-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/book-service" 
                  className={`w-full py-5 rounded-2xl font-black text-lg text-center transition-all flex items-center justify-center gap-2 group ${
                    pkg.popular 
                      ? 'bg-primary text-white hover:bg-pink-600 shadow-xl shadow-primary/20' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  Book Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-slate-50 rounded-[3rem] border border-slate-100 text-center">
            <h3 className="text-2xl font-black text-slate-900 mb-4">{cms.customQuoteTitle}</h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
              {cms.customQuoteDescription}
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-primary font-black text-lg hover:gap-4 transition-all">
              Contact our sales team <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4">Common Questions</h2>
            <h3 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {cms.faqs.map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-4xl border border-slate-100">
                <h4 className="text-lg font-black text-slate-900 mb-3">{faq.question}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
