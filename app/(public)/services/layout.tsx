import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Professional Cleaning Services in Dubai",
  description:
    "All professional cleaning services in Dubai & UAE. Villa deep cleaning, AC duct cleaning, residential home cleaning, office, kitchen & post-construction. Municipality approved.",
  keywords: [
    "cleaning services Dubai",
    "cleaning companies in Dubai",
    "cleaning companies Dubai",
    "professional cleaning Dubai",
    "home cleaning Dubai",
    "home cleaning service Dubai",
    "villa deep cleaning Dubai",
    "AC duct cleaning Dubai",
    "residential cleaning Dubai",
    "office cleaning Dubai",
    "deep cleaning company UAE",
  ],
  alternates: { canonical: "https://www.homeworkuae.com/services" },
  openGraph: {
    title: "Professional Cleaning Services in Dubai | Homework UAE",
    description:
      "All professional cleaning services in Dubai & UAE. Villa deep cleaning, AC duct, residential & office cleaning. Municipality approved.",
    url: "https://www.homeworkuae.com/services",
    type: "website",
  },
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
