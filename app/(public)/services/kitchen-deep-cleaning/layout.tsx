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

export default function KitchenDeepCleaningLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
