import type { Metadata } from "next";
import type { ReactNode } from "react";

const PAGE_URL = "https://www.homeworkuae.com/services/kitchen-deep-cleaning";

export const metadata: Metadata = {
  title: "Kitchen Deep Cleaning Dubai | Professional Kitchen Clean",
  description:
    "Expert kitchen deep cleaning in Dubai. Heavy-duty degreasing, hood cleaning, appliances, tiles & grout. Dubai Municipality approved. Book your kitchen deep clean today!",
  keywords: [
    "kitchen deep cleaning Dubai",
    "kitchen cleaning service UAE",
    "deep clean kitchen Dubai",
    "kitchen hood cleaning Dubai",
    "professional kitchen cleaning UAE",
    "cleaning companies in Dubai",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Kitchen Deep Cleaning Dubai | Homework UAE",
    description: "Expert kitchen deep cleaning in Dubai. Degreasing, hood, appliances & tiles. Municipality approved. Book today!",
    url: PAGE_URL,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Kitchen Deep Cleaning Dubai",
  description: "Professional kitchen deep cleaning service in Dubai. Heavy-duty degreasing, hood cleaning, all kitchen appliances, tiles, grout and surfaces. Dubai Municipality approved.",
  url: PAGE_URL,
  serviceType: "Kitchen Deep Cleaning",
  areaServed: [{ "@type": "City", name: "Dubai" }, { "@type": "State", name: "United Arab Emirates" }],
  provider: { "@type": "LocalBusiness", "@id": "https://www.homeworkuae.com/#business", name: "Homework UAE" },
  offers: { "@type": "Offer", priceCurrency: "AED", availability: "https://schema.org/InStock", url: PAGE_URL },
};

export default function KitchenDeepCleaningLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
