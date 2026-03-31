"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, ClipboardList, Send, Star, Quote } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { INITIAL_TESTIMONIALS } from "@/lib/testimonials-data";

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  service: string;
}

export default function BookService() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const feedbackTestimonials = INITIAL_TESTIMONIALS;
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    service: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.service) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceName = formData.service.trim();
      const serviceId = serviceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "custom-service";

      const now = new Date();
      const bookingRef = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const bookingDate = now.toISOString().split("T")[0];
      const bookingTime = now.toTimeString().slice(0, 5);

      // Keep Firestore shape compatible with admin real-time bookings screen.
      const bookingPayload = {
        bookingId: bookingRef,
        name: formData.name,
        clientName: formData.name,
        email: formData.email,
        clientEmail: formData.email,
        phone: formData.phone,
        clientPhone: formData.phone,
        service: serviceName,
        serviceName,
        serviceId,
        area: formData.location,
        location: formData.location,
        clientAddress: formData.location,
        date: bookingDate,
        bookingDate,
        time: bookingTime,
        bookingTime,
        propertyType: "",
        frequency: "once",
        message: "",
        notes: "",
        status: "pending",
        source: "book-service-single-step",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "bookings"), bookingPayload);

      // Keep existing notification flow.
      try {
        await fetch("/api/send-booking-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: formData.name,
            clientEmail: formData.email,
            clientPhone: formData.phone,
            serviceName,
            bookingDate,
            bookingTime,
            message: "",
            bookingId: bookingRef,
            propertyType: "Not specified",
            area: formData.location,
            frequency: "once",
          }),
        });
      } catch (emailError) {
        console.error("Booking email failed:", emailError);
      }

      router.push('/thank-you');
    } catch (error) {
      console.error("Booking submission error:", error);
      alert("Failed to submit booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] sm:p-8 md:p-10"
          >
            <div className="mb-8 text-center md:mb-10">
              <h1 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Book Service
              </h1>
              <p className="text-base text-slate-500 sm:text-lg">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 sm:text-lg"
                />
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 sm:text-lg"
                />
              </div>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 sm:text-lg"
                />
              </div>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 sm:text-lg"
                />
              </div>

              <div className="relative">
                <ClipboardList className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  placeholder="Service Required"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-14 pr-4 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 sm:text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-70 sm:text-xl"
              >
                {isSubmitting ? "Submitting..." : "Submit Booking"}
                {!isSubmitting && <Send className="h-5 w-5" />}
              </button>
            </form>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] sm:p-8"
          >
            <div className="mb-6">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Client Feedback
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Trusted by UAE Clients
              </h2>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Real reviews from our testimonials. Scroll to see more.
              </p>
            </div>

            <div className="max-h-104 space-y-4 overflow-y-auto pr-2 sm:max-h-128 sm:space-y-5 lg:max-h-160">
              {feedbackTestimonials.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: Math.min(Math.max(item.rating, 1), 5) }).map((_, i) => (
                      <Star key={`${item.id}-${i}`} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <Quote className="mb-2 h-5 w-5 text-primary/25" />
                  <p className="line-clamp-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-[15px]">
                    &quot;{item.text}&quot;
                  </p>
                  <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-black text-slate-700">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{item.name}</p>
                      <p className="text-xs font-semibold text-slate-500">{item.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}