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

export default function ResidentialCleaningLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
