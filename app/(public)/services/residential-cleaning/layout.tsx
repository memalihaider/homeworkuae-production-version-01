import type { Metadata } from "next";
import type { ReactNode } from "react";

const PAGE_URL = "https://www.homeworkuae.com/services/residential-cleaning";

export const metadata: Metadata = {
  title: "Residential Cleaning Dubai | Home Cleaning Service UAE",
  description:
    "Trusted residential & home cleaning service in Dubai. Vetted staff, professional equipment. Regular, weekly & one-off cleans available. Cleaning companies in Dubai since 2004. Book today!",
  keywords: [
    "residential cleaning Dubai",
    "home cleaning Dubai",
    "home cleaning service Dubai",
    "house cleaning Dubai",
    "cleaning companies in Dubai",
    "cleaning companies Dubai",
    "home cleaning company Dubai",
    "regular home cleaning UAE",
    "maid service Dubai",
    "weekly cleaning Dubai",
    "apartment cleaning Dubai",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Residential & Home Cleaning Dubai | Homework UAE",
    description:
      "Trusted home cleaning service in Dubai. Vetted staff, professional equipment. Regular, weekly & one-off. Book today!",
    url: PAGE_URL,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Residential Cleaning Dubai",
  alternateName: ["Home Cleaning Dubai", "House Cleaning Service UAE", "Home Cleaning Company Dubai"],
  description:
    "Professional residential and home cleaning service in Dubai. Trained and vetted cleaning staff using professional equipment. Available for regular, weekly recurring, and one-off cleaning sessions across Dubai and UAE.",
  url: PAGE_URL,
  serviceType: "Residential Cleaning",
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
    reviewCount: "689",
  },
};

export default function ResidentialCleaningLayout({ children }: { children: ReactNode }) {
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
