import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Premium Cleaning & Maid Services in Dubai",
  description:
    "Explore maid and deep cleaning services in Dubai for villas, offices, and homes. Trusted teams with transparent pricing and reliable scheduling.",
  keywords: [
    "maid services Dubai",
    "maid service Dubai",
    "deep cleaning services in Dubai",
    "premium cleaning company in Dubai",
    "best cleaning company in Dubai",
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
    "maid service Dubai",
    "post construction cleaning Dubai",
    "kitchen deep cleaning Dubai",
    "sofa cleaning Dubai",
    "carpet cleaning Dubai",
    "window cleaning Dubai",

  ],
  alternates: { canonical: "https://www.homeworkuae.com/services" },
  openGraph: {
    title: "Premium Cleaning & Maid Services in Dubai | Homework UAE",
    description:
      "Maid and deep cleaning services in Dubai for homes, villas, and offices. Municipality approved.",
    url: "https://www.homeworkuae.com/services",
    type: "website",
  },
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
