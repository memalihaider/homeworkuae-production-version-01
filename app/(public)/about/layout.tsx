import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Homework UAE | Cleaning Company in Dubai Since 2004",
  description:
    "Homework UAE has been Dubai's most trusted cleaning company since 2004. Dubai Municipality approved, 20,000+ satisfied clients, trained & insured staff across the UAE.",
  keywords: [
    "about Homework UAE",
    "cleaning company Dubai since 2004",
    "cleaning companies in Dubai",
    "Dubai Municipality approved cleaning company",
    "best cleaning company UAE",
    "trusted cleaning company Dubai",
  ],
  alternates: { canonical: "https://www.homeworkuae.com/about" },
  openGraph: {
    title: "About Homework UAE | Dubai's Cleaning Company Since 2004",
    description:
      "Dubai's most trusted cleaning company since 2004. Municipality approved, 20,000+ satisfied clients.",
    url: "https://www.homeworkuae.com/about",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
