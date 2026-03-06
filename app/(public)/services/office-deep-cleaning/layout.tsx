import type { Metadata } from "next";
import type { ReactNode } from "react";

const PAGE_URL = "https://www.homeworkuae.com/services/office-deep-cleaning";

export const metadata: Metadata = {
  title: "Office Deep Cleaning Dubai | Commercial Cleaning Service",
  description:
    "Professional office and commercial deep cleaning in Dubai. Sanitization of workstations, meeting rooms, kitchens & restrooms. Municipality approved. Book a free site survey.",
  keywords: [
    "office deep cleaning Dubai",
    "commercial cleaning Dubai",
    "office cleaning service UAE",
    "office cleaning companies Dubai",
    "corporate cleaning Dubai",
    "cleaning companies in Dubai",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Office Deep Cleaning Dubai | Homework UAE",
    description: "Professional office deep cleaning in Dubai. Sanitization of all workspaces. Municipality approved. Book today!",
    url: PAGE_URL,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Office Deep Cleaning Dubai",
  description: "Professional office and commercial space deep cleaning in Dubai. Includes sanitization of workstations, meeting rooms, kitchen areas and bathrooms. Dubai Municipality approved cleaning company.",
  url: PAGE_URL,
  serviceType: "Office Deep Cleaning",
  areaServed: [{ "@type": "City", name: "Dubai" }, { "@type": "State", name: "United Arab Emirates" }],
  provider: { "@type": "LocalBusiness", "@id": "https://www.homeworkuae.com/#business", name: "Homework UAE" },
  offers: { "@type": "Offer", priceCurrency: "AED", availability: "https://schema.org/InStock", url: PAGE_URL },
};

export default function OfficeDeepCleaningLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
