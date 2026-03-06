import type { Metadata } from "next";
import type { ReactNode } from "react";

const PAGE_URL = "https://www.homeworkuae.com/services/ac-duct-cleaning";

export const metadata: Metadata = {
  title: "AC Duct Cleaning Dubai | Air Duct Cleaning Service UAE",
  description:
    "Professional AC duct cleaning in Dubai. Remove dust, mould & bacteria from your AC system. Improve air quality & efficiency. Dubai Municipality approved. Book online today!",
  keywords: [
    "AC duct cleaning Dubai",
    "air duct cleaning UAE",
    "AC duct cleaning service Dubai",
    "AC duct cleaning company Dubai",
    "air conditioning duct cleaning Dubai",
    "AC cleaning Dubai",
    "duct cleaning service UAE",
    "HVAC cleaning Dubai",
    "AC sanitization Dubai",
    "cleaning companies in Dubai",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "AC Duct Cleaning Dubai | Homework UAE",
    description:
      "Expert AC duct cleaning in Dubai. Remove dust, mould & bacteria. Improve air quality. Municipality approved. Book now!",
    url: PAGE_URL,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AC Duct Cleaning Dubai",
  alternateName: ["Air Duct Cleaning UAE", "HVAC Cleaning Dubai", "AC Cleaning Dubai"],
  description:
    "Professional AC and air duct cleaning service in Dubai. We remove dust, mould, allergens and bacteria from your air conditioning ducts to improve indoor air quality and system efficiency. Dubai Municipality approved.",
  url: PAGE_URL,
  serviceType: "AC Duct Cleaning",
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
    reviewCount: "412",
  },
};

export default function ACDuctCleaningLayout({ children }: { children: ReactNode }) {
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
