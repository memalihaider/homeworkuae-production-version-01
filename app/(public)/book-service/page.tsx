"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { INITIAL_TESTIMONIALS } from "@/lib/testimonials-data";
import BookServiceForm from "@/components/BookServiceForm";

export default function BookService() {
  const feedbackTestimonials = INITIAL_TESTIMONIALS;

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <BookServiceForm />

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