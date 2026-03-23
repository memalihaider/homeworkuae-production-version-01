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

export default function OfficeDeepCleaningLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
