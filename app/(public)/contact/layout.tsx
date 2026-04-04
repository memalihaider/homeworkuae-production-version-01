import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us | Book a Cleaning Service in Dubai",
  description:
    "Contact Homework UAE to book cleaning services in Dubai. Call, WhatsApp, or email for quick support and scheduling.",
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
      "Book cleaning services in Dubai. Call, WhatsApp, or email Homework UAE for a quick response.",
    url: "https://www.homeworkuae.com/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
