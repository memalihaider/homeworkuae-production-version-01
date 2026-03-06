import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us | Book a Cleaning Service in Dubai",
  description:
    "Contact Homework UAE to book a professional cleaning service in Dubai. Call, WhatsApp or email us. Serving Dubai, Sharjah, Abu Dhabi & all UAE. Quick response guaranteed.",
  keywords: [
    "contact cleaning company Dubai",
    "book cleaning service Dubai",
    "cleaning company contact UAE",
    "home cleaning booking Dubai",
    "cleaning companies in Dubai contact",
  ],
  alternates: { canonical: "https://www.homeworkuae.com/contact" },
  openGraph: {
    title: "Contact Homework UAE | Book a Cleaning Service in Dubai",
    description:
      "Book a professional cleaning service in Dubai. Call, WhatsApp or email Homework UAE. Quick response guaranteed.",
    url: "https://www.homeworkuae.com/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
