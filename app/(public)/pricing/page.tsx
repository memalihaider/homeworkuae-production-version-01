import { CheckCircle2, ArrowRight, Zap, ShieldCheck, Star, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Pricing() {
  const packages = [
    {
      name: "Basic Clean",
      price: "150",
      description: "Essential cleaning for small spaces and busy individuals.",
      features: ["Dusting and wiping", "Floor cleaning", "Bathroom cleaning", "1 hour service", "Standard supplies"],
      popular: false,
      icon: Zap
    },
    {
      name: "Deep Clean",
      price: "300",
      description: "Comprehensive cleaning service for a thorough refresh.",
      features: ["All basic services", "Inside appliances", "Window cleaning", "2-3 hours service", "Premium supplies", "Sanitization"],
      popular: true,
      icon: Star
    },
    {
      name: "Premium Package",
      price: "500",
      description: "Complete home/office transformation and restoration.",
      features: ["All deep clean services", "Carpet cleaning", "Upholstery cleaning", "4+ hours service", "Eco-friendly products", "Post-service inspection"],
      popular: false,
      icon: Heart
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&q=80&w=1600" 
            alt="Pricing" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">Simple <span className="text-primary">Pricing</span></h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Transparent pricing with no hidden costs. Choose the plan that fits your needs.
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
            <h3 className="text-2xl font-black text-slate-900 mb-4">Need a Custom Quote?</h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
              For large commercial spaces, industrial cleaning, or specialized requirements, we offer tailored solutions and competitive rates.
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
            {[
              { q: "Are cleaning supplies included?", a: "Yes, for Deep Clean and Premium packages, we provide all necessary professional-grade supplies and equipment." },
              { q: "Can I cancel or reschedule?", a: "Absolutely! You can cancel or reschedule your booking up to 24 hours before the scheduled time without any charge." },
              { q: "Are your cleaners insured?", a: "Yes, all our staff are fully insured and background-verified for your peace of mind." },
              { q: "How do I pay?", a: "We accept online payments via credit/debit cards, as well as cash on delivery." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-4xl border border-slate-100">
                <h4 className="text-lg font-black text-slate-900 mb-3">{faq.q}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
