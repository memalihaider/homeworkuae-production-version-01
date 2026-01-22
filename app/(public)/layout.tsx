import { ReactNode } from 'react'
import { 
  Phone, Mail, Facebook, Linkedin, Instagram, MessageCircle, ChevronDown,
  Home, Briefcase, Maximize, Sun, Sofa, Layers, Bed, 
  Wind, Grid3X3, Warehouse, CookingPot, HardHat, Building, Truck, Brush,
  Fan, Pipette, Utensils, Waves, Dumbbell, PanelTop, ThermometerSnowflake,
  Star, HelpCircle, ShieldCheck, Music2, Send, MapPin, ArrowRight
} from 'lucide-react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium">
          <div className="flex items-center gap-6">
            <a href="tel:80046639675" className="flex items-center gap-2 hover:text-pink-100 transition-colors">
              <Phone className="h-3 w-3" /> 80046639675
            </a>
            <a href="mailto:services@homeworkuae.com" className="flex items-center gap-2 hover:text-pink-100 transition-colors">
              <Mail className="h-3 w-3" /> services@homeworkuae.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-pink-100 transition-colors"><Facebook className="h-3.5 w-3.5" /></a>
            <a href="#" className="hover:text-pink-100 transition-colors"><Linkedin className="h-3.5 w-3.5" /></a>
            <a href="#" className="hover:text-pink-100 transition-colors"><MessageCircle className="h-3.5 w-3.5" /></a>
            <a href="#" className="hover:text-pink-100 transition-colors"><Instagram className="h-3.5 w-3.5" /></a>
            <a href="#" className="hover:text-pink-100 transition-colors"><Music2 className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">H</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">HOMEWORK</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary leading-none mt-1">UAE CLEANING</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center space-x-8 text-sm font-bold uppercase tracking-wide">
            <a href="/" className="text-slate-600 hover:text-primary transition-colors">Home</a>
            <a href="/about" className="text-slate-600 hover:text-primary transition-colors">About Us</a>
            <div className="relative group py-8">
              <a href="/services" className="text-slate-600 group-hover:text-primary transition-colors flex items-center gap-1">
                Services <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              </a>
              
              {/* Dropdown Menu - Mega Menu Style Expanded */}
              <div className="absolute top-full -left-80 w-275 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] p-10 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 z-50">
                <div className="grid grid-cols-3 gap-10">
                  {/* Normal Cleaning Section */}
                  <div>
                    <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                      <span className="h-1 w-6 bg-primary rounded-full" />
                      Normal
                    </h4>
                    <div className="grid gap-1">
                      {[
                        { name: "Regular Residential", href: "/services/residential-cleaning", icon: Home },
                        { name: "Regular Office", href: "/services/office-cleaning", icon: Briefcase },
                        { name: "Window cleaning", href: "/services/window-cleaning", icon: Maximize },
                        { name: "Balcony Cleaning", href: "/services/balcony-deep-cleaning", icon: Sun },
                        { name: "Sofa Cleaning", href: "/services/sofa-deep-cleaning", icon: Sofa },
                        { name: "Carpets Cleaning", href: "/services/carpets-deep-cleaning", icon: Layers },
                        { name: "Mattress Cleaning", href: "/services/mattress-deep-cleaning", icon: Bed }
                      ].map((item) => (
                        <a 
                          key={item.href} 
                          href={item.href}
                          className="group/item flex items-center gap-3 text-[13px] font-bold text-slate-600 hover:text-primary transition-all py-1 px-2 rounded-xl hover:bg-slate-50"
                        >
                          <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                            <item.icon className="h-3.5 w-3.5" />
                          </div>
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Deep Cleaning Section */}
                  <div>
                    <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                      <span className="h-1 w-6 bg-primary rounded-full" />
                      Deep Cleaning
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {[
                        { name: "Grout Deep Clean", href: "/services/grout-deep-cleaning", icon: Grid3X3 },
                        { name: "Garage Deep Clean", href: "/services/garage-deep-cleaning", icon: Warehouse },
                        { name: "Kitchen Deep Clean", href: "/services/kitchen-deep-cleaning", icon: CookingPot },
                        { name: "Post Construction", href: "/services/post-construction-cleaning", icon: HardHat },
                        { name: "Office Deep Clean", href: "/services/office-deep-cleaning", icon: Briefcase },
                        { name: "Apartment Deep", href: "/services/apartment-deep-cleaning", icon: Building },
                        { name: "Move In/Out", href: "/services/move-in-out-cleaning", icon: Truck },
                        { name: "Villa Deep Clean", href: "/services/villa-deep-cleaning", icon: Home },
                        { name: "Mattress Deep", href: "/services/mattress-deep-cleaning", icon: Bed },
                        { name: "Carpets Deep", href: "/services/carpets-deep-cleaning", icon: Layers },
                        { name: "Sofa Deep Clean", href: "/services/sofa-deep-cleaning", icon: Sofa },
                        { name: "Balcony Deep", href: "/services/balcony-deep-cleaning", icon: Sun },
                        { name: "Window cleaning", href: "/services/window-cleaning", icon: Maximize },
                        { name: "Floor Deep Clean", href: "/services/floor-deep-cleaning", icon: Brush }
                      ].map((item) => (
                        <a 
                          key={item.href} 
                          href={item.href}
                          className="group/item flex items-center gap-3 text-[13px] font-bold text-slate-600 hover:text-primary transition-all py-1 px-2 rounded-xl hover:bg-slate-50"
                        >
                          <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                            <item.icon className="h-3.5 w-3.5" />
                          </div>
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Technical Cleaning Section */}
                  <div>
                    <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                      <span className="h-1 w-6 bg-primary rounded-full" />
                      Technical
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {[
                        { name: "AC Duct Cleaning", href: "/services/ac-duct-cleaning", icon: Wind },
                        { name: "AC Coil Cleaning", href: "/services/ac-coil-cleaning", icon: ThermometerSnowflake },
                        { name: "Kitchen Hood Clean", href: "/services/kitchen-hood-cleaning", icon: Fan },
                        { name: "Grease Trap Clean", href: "/services/grease-trap-cleaning", icon: Pipette },
                        { name: "Restaurant Clean", href: "/services/restaurant-cleaning", icon: Utensils },
                        { name: "Water Tank Clean", href: "/services/water-tank-cleaning", icon: Waves },
                        { name: "Swimming Pool", href: "/services/swimming-pool-cleaning", icon: Waves },
                        { name: "Gym Deep Clean", href: "/services/gym-deep-cleaning", icon: Dumbbell },
                        { name: "Facade Cleaning", href: "/services/facade-cleaning", icon: PanelTop }
                      ].map((item) => (
                        <a 
                          key={item.href} 
                          href={item.href}
                          className="group/item flex items-center gap-3 text-[13px] font-bold text-slate-600 hover:text-primary transition-all py-1 px-2 rounded-xl hover:bg-slate-50"
                        >
                          <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                            <item.icon className="h-3.5 w-3.5" />
                          </div>
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More Link with Mega Dropdown */}
            <div className="relative group py-4">
              <button className="flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-primary transition-all uppercase tracking-wider group">
                More <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute top-full -left-20 w-100 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 z-50">
                <div className="grid gap-2">
                  <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <span className="h-1 w-6 bg-primary rounded-full" />
                    Resources
                  </h4>
                  
                  {[
                    { name: "Testimonials", href: "/testimonials", icon: Star, desc: "See what our premium clients say" },
                    { name: "FAQs", href: "/faqs", icon: HelpCircle, desc: "Common questions answered" },
                    { name: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck, desc: "How we protect your data" }
                  ].map((item) => (
                    <a 
                      key={item.href} 
                      href={item.href}
                      className="group/item flex items-center gap-4 text-sm font-bold text-slate-600 hover:text-primary transition-all p-3 rounded-2xl hover:bg-slate-50"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-900 group-hover/item:text-primary transition-colors">{item.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{item.desc}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a href="/blog" className="text-slate-600 font-bold text-sm uppercase tracking-wider hover:text-primary transition-colors">Blog</a>
            <a href="/contact" className="text-slate-600 font-bold text-sm uppercase tracking-wider hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="/book-service" 
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-pink-700 hover:shadow-primary/40 active:scale-95"
            >
              BOOK ONLINE
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-primary underline decoration-primary/20 underline-offset-8">Contact Us</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-4 group cursor-pointer">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-lg">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="group-hover:text-white transition-colors">Al Quoz- Dubai - United Arab Emirates</span>
                </li>
                <li className="flex items-start gap-4 group cursor-pointer">
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-lg">
                    <Phone className="h-4 w-4" />
                  </div>
                  <a href="tel:80046639675" className="group-hover:text-white transition-colors">80046639675</a>
                </li>
                <li className="flex items-start gap-4 group cursor-pointer">
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-lg">
                    <Mail className="h-4 w-4" />
                  </div>
                  <a href="mailto:services@homeworkuae.com" className="group-hover:text-white transition-colors">services@homeworkuae.com</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-primary underline decoration-primary/20 underline-offset-8">Cleaning Services</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="/services/residential-cleaning" className="hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Normal Cleaning</a></li>
                <li><a href="/services/villa-deep-cleaning" className="hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Deep Cleaning</a></li>
                <li><a href="/services/ac-duct-cleaning" className="hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Technical Cleaning</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-primary underline decoration-primary/20 underline-offset-8">Quick Links</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="/" className="hover:text-white transition-colors flex items-center gap-2">Home</a></li>
                <li><a href="/about" className="hover:text-white transition-colors flex items-center gap-2">About us</a></li>
                <li><a href="/testimonials" className="hover:text-white transition-colors flex items-center gap-2">Testimonials</a></li>
                <li><a href="/faqs" className="hover:text-white transition-colors flex items-center gap-2">FAQs</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors flex items-center gap-2">Contact us</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary underline decoration-primary/20 underline-offset-8">Newsletter</h4>
              <p className="text-slate-400 text-sm italic font-medium">Subscribe our newsletter for latest updates</p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="and updates to your email…" 
                  className="w-full bg-slate-800 border-none rounded-2xl py-5 px-6 text-xs font-bold focus:ring-2 focus:ring-primary outline-none placeholder:text-slate-500 shadow-inner"
                />
                <button className="absolute right-2 top-2 h-11 w-11 bg-primary rounded-xl flex items-center justify-center hover:bg-pink-600 transition-all shadow-lg hover:scale-110">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Copyright ©2024 Home Work Uae</p>
            <div className="flex items-center gap-6">
              <a href="#" className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:scale-110 shadow-lg group">
                <Facebook className="h-5 w-5 text-slate-400 group-hover:text-white" />
              </a>
              <a href="#" className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:scale-110 shadow-lg group">
                <Instagram className="h-5 w-5 text-slate-400 group-hover:text-white" />
              </a>
              <a href="#" className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:scale-110 shadow-lg group">
                <Music2 className="h-5 w-5 text-slate-400 group-hover:text-white" />
              </a>
              <a href="/contact" className="ml-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-colors border-l border-white/10 pl-10 h-12 flex items-center">Contact us</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons - Public Website */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {/* WhatsApp Button - Primary */}
        <a 
          href="https://wa.me/97180046639675" 
          target="_blank" 
          rel="noopener noreferrer"
          className="pointer-events-auto h-16 w-16 bg-[#25D366] text-white rounded-full shadow-[0_15px_40px_rgba(37,211,102,0.4)] flex items-center justify-center hover:scale-125 transition-all duration-300 group relative border-4 border-white/30 hover:border-white animate-bounce-subtle"
        >
          <MessageCircle className="h-8 w-8 fill-current" />
          <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          <span className="absolute -right-40 px-4 py-3 bg-[#25D366] text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-2xl border border-white/20 md:block hidden">
            WhatsApp: Chat Now
          </span>
        </a>
        
        {/* Phone Button */}
        <a 
          href="tel:80046639675" 
          className="pointer-events-auto h-14 w-14 bg-slate-900 text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 group relative border-2 border-white/20 hover:border-white"
        >
          <Phone className="h-6 w-6" />
          <span className="absolute -right-40 px-4 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-2xl border border-white/10 md:block hidden">
            Call: 800 4663 9675
          </span>
        </a>
      </div>
    </div>
  )
}