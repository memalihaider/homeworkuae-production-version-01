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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Villa Deep Cleaning Dubai",
  alternateName: ["Villa Cleaning Dubai", "Villa Deep Clean UAE"],
  description:
    "Professional villa deep cleaning service in Dubai covering all interior rooms, bathrooms, kitchen, and exterior/outdoor areas. Dubai Municipality approved, with trained and vetted cleaning teams.",
  url: PAGE_URL,
  serviceType: "Villa Deep Cleaning",
  areaServed: [{ "@type": "City", name: "Dubai" }, { "@type": "State", name: "United Arab Emirates" }],
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://www.homeworkuae.com/#business",
    name: "Homework UAE",
    url: "https://www.homeworkuae.com",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "AED",
    availability: "https://schema.org/InStock",
    url: PAGE_URL,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    reviewCount: "534",
  },
};

export default function VillaDeepCleaningLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
