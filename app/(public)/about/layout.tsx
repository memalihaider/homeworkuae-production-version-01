import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Homework UAE | Cleaning Company in Dubai Since 2004",
  description:
    "Homework UAE is a Dubai Municipality approved cleaning company since 2004, trusted by 20,000+ clients with trained and insured teams.",
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
      "Trusted Dubai cleaning company since 2004. Municipality approved and trusted by 20,000+ clients.",
    url: "https://www.homeworkuae.com/about",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
