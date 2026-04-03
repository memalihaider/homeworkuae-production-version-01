"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, ClipboardList, Send } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  service: string;
}

interface BookServiceFormProps {
  preselectedServiceName?: string;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  headerAlignment?: "center" | "left";
  className?: string;
}

export default function BookServiceForm({
  preselectedServiceName,
  title = "Book Service",
  subtitle = "Fill out the form below and we will get back to you shortly.",
  showHeader = true,
  headerAlignment = "center",
  className = "",
}: BookServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    service: preselectedServiceName || "",
  });

  useEffect(() => {
    if (!preselectedServiceName) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      service: preselectedServiceName,
    }));
  }, [preselectedServiceName]);

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
      const serviceId =
        serviceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
        "custom-service";

      const now = new Date();
      const bookingRef = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const bookingDate = now.toISOString().split("T")[0];
      const bookingTime = now.toTimeString().slice(0, 5);

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

      router.push("/thank-you");
    } catch (error) {
      console.error("Booking submission error:", error);
      alert("Failed to submit booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  const headerClassName = headerAlignment === "left" ? "text-left" : "text-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] sm:p-8 md:p-10 ${className}`}
    >
      {showHeader && (
        <div className={`mb-8 ${headerClassName}`}>
          <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          <p className="text-base text-slate-500 sm:text-lg">{subtitle}</p>
        </div>
      )}

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
  );
}
