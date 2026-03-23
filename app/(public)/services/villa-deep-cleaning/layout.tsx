import type { Metadata } from "next";
import type { ReactNode } from "react";

const PAGE_URL = "https://www.homeworkuae.com/services/villa-deep-cleaning";

export const metadata: Metadata = {
  title: "Villa Deep Cleaning Dubai | Expert Villa Cleaning Service",
  description:
    "Expert villa deep cleaning in Dubai. Complete interior & exterior – all rooms, bathrooms, kitchen & outdoor areas. Dubai Municipality approved. Trusted since 2004. Book today!",
  keywords: [
    "villa deep cleaning Dubai",
    "villa cleaning Dubai",
    "villa deep clean UAE",
    "villa cleaning service Dubai",
    "villa cleaning company Dubai",
    "luxury villa cleaning Dubai",
    "villa interior cleaning Dubai",
    "villa exterior cleaning UAE",
    "deep cleaning villa Dubai",
    "cleaning companies in Dubai",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Villa Deep Cleaning Dubai | Homework UAE",
    description:
      "Professional villa deep cleaning in Dubai. All rooms, kitchen, bathrooms & outdoor areas. Municipality approved. Book now!",
    url: PAGE_URL,
    type: "website",
  },
};

export default function VillaDeepCleaningLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
