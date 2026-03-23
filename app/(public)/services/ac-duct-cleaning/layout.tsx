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

export default function ACDuctCleaningLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
