"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronLeft,
  MapPin,
  ClipboardList,
  Star,
  Send,
} from "lucide-react";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';

// Firebase service type
interface FirebaseService {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  description: string;
  status: string;
}

// Save booking to Firebase function
const saveBookingToFirebase = async (bookingData: any) => {
  try {
    // Generate booking ID
    const bookingId = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Prepare data with metadata
    const bookingWithMeta = {
      ...bookingData,
      bookingId,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, "bookings"), bookingWithMeta);

    return {
      success: true,
      bookingId: docRef.id,
      bookingRef: bookingId,
    };
  } catch (error: any) {
    console.error("Firebase Error:", error);
    return {
      success: false,
      error: error.message || "Failed to save booking",
    };
  }
};

// Fetch services from Firebase
const fetchServicesFromFirebase = async (): Promise<FirebaseService[]> => {
  try {
    const servicesRef = collection(db, "services");
    const querySnapshot = await getDocs(servicesRef);
    
    const services: FirebaseService[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Only include active services
      if (data.status === "ACTIVE") {
        services.push({
          id: doc.id,
          name: data.name || "",
          categoryName: data.categoryName || "Uncategorized",
          price: data.price || 0,
          description: data.description || "",
          status: data.status || "",
        });
      }
    });
    
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export default function BookService() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firebaseServices, setFirebaseServices] = useState<FirebaseService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    propertyType: "apartment",
    area: "",
    frequency: "once",
    date: "",
    time: "",
    message: "",
  });

  // Hardcoded services (if any)
  const serviceCategories: any[] = [
    // Add your hardcoded services here if needed
  ];

  // Fetch services from Firebase on component mount
  useEffect(() => {
    const loadServices = async () => {
      setIsLoadingServices(true);
      try {
        const services = await fetchServicesFromFirebase();
        setFirebaseServices(services);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };
    
    loadServices();
  }, []);

  const totalSteps = 3;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < totalSteps) {
      nextStep();
    } else {
      // Complete booking - Save to Firebase
      setIsSubmitting(true);
      try {
        // Validate required fields
        if (
          !formData.name ||
          !formData.email ||
          !formData.phone ||
          !formData.service ||
          !formData.date
        ) {
          alert('Please fill in all required fields');
          setIsSubmitting(false);
          return;
        }

        console.log('📝 Submitting booking to Firebase...', formData);

        // Get service name
        let selectedServiceName = firebaseServices.find(s => s.id === formData.service)?.name;
        
        if (!selectedServiceName) {
          // Check hardcoded services
          for (const category of serviceCategories) {
            const service = category.options.find((opt: { id: string; }) => opt.id === formData.service);
            if (service) {
              selectedServiceName = service.label;
              break;
            }
          }
        }
        
        selectedServiceName = selectedServiceName || 'Service';

        // Save to Firebase first
        const result = await saveBookingToFirebase(formData);

        console.log('✅ Firebase save result:', result);

        // Only proceed if booking was successfully saved
        if (!result.success) {
          throw new Error(result.error || 'Failed to save booking to database');
        }

        // ============= SEND REAL EMAIL TO SALES TEAM =============
        console.log('📧 Sending real email to sales team...');

        try {
          const emailResponse = await fetch('/api/send-booking-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientName: formData.name,
              clientEmail: formData.email,
              clientPhone: formData.phone,
              serviceName: selectedServiceName,
              bookingDate: formData.date,
              bookingTime: formData.time,
              message: formData.message,
              bookingId: result.bookingRef,
              propertyType: formData.propertyType,
              area: formData.area,
              frequency: formData.frequency,
              source: 'book-service-page',
            }),
          });
          
          const emailResult = await emailResponse.json();
          
          if (emailResult.success) {
            console.log('✅ Real email sent successfully to:', emailResult.to || 'Homeworkuae2026@gmail.com');
            console.log('📧 Message ID:', emailResult.messageId || 'Check your inbox');
          } else {
            console.error('❌ Email sending failed:', emailResult.error);
          }
          
        } catch (emailError) {
          console.error('❌ Email notification error:', emailError);
          // Continue even if email fails - booking is already saved
        }
        // ========================================================

        console.log('✅ Booking completed successfully! Redirecting...');

        // Redirect to thank you page
        router.push('/thank-you');
        
      } catch (error: any) {
        console.error("❌ Booking submission error:", error);
        alert(`Error submitting booking: ${error?.message || 'Please try again.'}`);
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Get service name from ID
  const getServiceName = (id: string) => {
    // First check hardcoded services
    for (const category of serviceCategories) {
      const service = category.options.find((opt: { id: string; }) => opt.id === id);
      if (service) return service.label;
    }
    
    // Then check Firebase services
    const firebaseService = firebaseServices.find((service) => service.id === id);
    if (firebaseService) return firebaseService.name;
    
    return id;
  };

  // Group Firebase services by category
  const groupServicesByCategory = () => {
    const grouped: { [key: string]: FirebaseService[] } = {};
    
    firebaseServices.forEach((service) => {
      const category = service.categoryName || "Other Services";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(service);
    });
    
    return grouped;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative py-24 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a40?auto=format&fit=crop&q=80&w=1600"
            alt="Premium Booking"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/20 to-slate-950" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">
              Instant Scheduling
            </span>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
              SECURE YOUR <br />
              <span className="text-primary italic lowercase">
                premium session
              </span>
            </h1>
            <p className="text-xl text-slate-300 font-bold uppercase tracking-tight italic">
              UAE's most reliable hygiene booking system. Simple, fast,
              professional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-24 -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[700px]">
              {/* Left Side: Progress & Info */}
              <div className="bg-slate-900 md:w-80 p-12 text-white flex flex-col justify-between border-r border-white/5">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                      Booking Steps
                    </h3>
                    <div className="space-y-8">
                      {[
                        { s: 1, label: "CONTACT INFO", icon: User },
                        { s: 2, label: "SERVICE TYPE", icon: ClipboardList },
                        { s: 3, label: "DATETIME", icon: Calendar },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-4 transition-all duration-500 ${step >= item.s ? "opacity-100" : "opacity-30"}`}
                        >
                          <div
                            className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs ${step > item.s ? "bg-primary text-white" : step === item.s ? "bg-white text-slate-900 shadow-xl shadow-white/10" : "bg-white/5 text-white"}`}
                          >
                            {step > item.s ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              item.s
                            )}
                          </div>
                          <span className="text-[11px] font-black tracking-widest uppercase">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-12 border-t border-white/5 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                      Why Us?
                    </h4>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                        <p className="text-xs font-bold text-slate-300 italic">
                          Vetted Professionals
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Zap className="h-4 w-4 text-primary shrink-0" />
                        <p className="text-xs font-bold text-slate-300 italic">
                          15-Min Response
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Sparkles className="h-4 w-4 text-primary shrink-0" />
                        <p className="text-xs font-bold text-slate-300 italic">
                          Satisfaction Guaranteed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-white/5">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                    Need instant help? <br />
                    <a
                      href="tel:80046639675"
                      className="text-white hover:text-primary transition-colors"
                    >
                      800-HOMEWORK
                    </a>
                  </p>
                </div>
              </div>

              {/* Right Side: Form Content */}
              <div className="flex-1 p-12 md:p-20 flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 flex-1"
                      >
                        <div className="space-y-2">
                          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                            Your Details
                          </h2>
                          <p className="text-slate-400 font-bold italic">
                            Tell us who you are so we can reach you better.
                          </p>
                        </div>

                        <div className="grid gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                              Full Identity *
                            </label>
                            <div className="relative group">
                              <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                              Contact Phone *
                            </label>
                            <div className="relative group">
                              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+971 XX XXX XXXX"
                                required
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                              Email Address *
                            </label>
                            <div className="relative group">
                              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@email.com"
                                required
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 flex-1"
                      >
                        <div className="space-y-2">
                          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                            Services
                          </h2>
                          <p className="text-slate-400 font-bold italic">
                            Select the type of hygiene restoration required.
                          </p>
                        </div>

                        <div className="grid gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                              Required Service *
                            </label>
                            <select
                              name="service"
                              value={formData.service}
                              onChange={handleChange}
                              required
                              className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner appearance-none relative z-10"
                            >
                              <option value="">Choose Service...</option>
                              
                              {/* Hardcoded Services */}
                              {serviceCategories.map((cat, idx) => (
                                <optgroup key={`hardcoded-${idx}`} label={cat.group}>
                                  {cat.options.map((opt: any) => (
                                    <option key={`hardcoded-${opt.id}`} value={opt.id}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                              
                              {/* Firebase Services */}
                              {isLoadingServices ? (
                                <option disabled>
                                  Loading services...
                                </option>
                              ) : (
                                Object.entries(groupServicesByCategory()).map(([category, services]) => (
                                  <optgroup key={`firebase-${category}`} label={category}>
                                    {services.map((service) => (
                                      <option key={`firebase-${service.id}`} value={service.id}>
                                        {service.name} - AED {service.price}
                                      </option>
                                    ))}
                                  </optgroup>
                                ))
                              )}
                            </select>
                            {isLoadingServices && (
                              <p className="text-xs text-slate-500 mt-2 italic">
                                Loading services from database...
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                                Property
                              </label>
                              <select
                                name="propertyType"
                                value={formData.propertyType}
                                onChange={handleChange}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner appearance-none"
                              >
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                                <option value="office">Office</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                                Frequency
                              </label>
                              <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner appearance-none"
                              >
                                <option value="once">One-Time</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-Weekly</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                              General Area / Location
                            </label>
                            <div className="relative group">
                              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                              <input
                                type="text"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                placeholder="Dubai Marina, Downtown, etc."
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 flex-1"
                      >
                        <div className="space-y-2">
                          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                            Availability
                          </h2>
                          <p className="text-slate-400 font-bold italic">
                            When should we arrive for the restoration?
                          </p>
                        </div>

                        <div className="grid gap-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                                Target Date *
                              </label>
                              <div className="relative group">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-hover:text-primary transition-colors pointer-events-none" />
                                <input
                                  type="date"
                                  name="date"
                                  value={formData.date}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                                Preferred Time
                              </label>
                              <div className="relative group">
                                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-hover:text-primary transition-colors pointer-events-none" />
                                <input
                                  type="time"
                                  name="time"
                                  value={formData.time}
                                  onChange={handleChange}
                                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                              Special Notes
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="Any specific instructions or priorities for our team?"
                              className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner resize-none min-h-[120px]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer Navigation */}
                  <div className="pt-12 flex items-center justify-between gap-6">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="h-16 px-8 rounded-2xl bg-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3"
                      >
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-16 px-12 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 hover:bg-pink-600 transition-all flex items-center gap-4 active:scale-95 flex-1 md:flex-initial justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          {step === totalSteps ? (
                            <>
                              Complete Booking
                              <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          ) : (
                            <>
                              Continue
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Bottom Proof Section */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  Fully Insured
                </h4>
                <p className="text-sm text-slate-500 font-bold italic">
                  Your property is protected with our comprehensive public
                  liability insurance.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-16 w-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto text-primary">
                  <Star className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  DM Approved
                </h4>
                <p className="text-sm text-slate-500 font-bold italic">
                  Our technical services use only municipality-approved
                  chemicals and processes.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-16 w-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto text-primary">
                  <Phone className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  24/7 Support
                </h4>
                <p className="text-sm text-slate-500 font-bold italic">
                  Our customer happiness team is always available for your
                  inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}