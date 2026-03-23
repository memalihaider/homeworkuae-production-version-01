import type { Metadata } from "next";
import type { ReactNode } from "react";

const PAGE_URL = "https://www.homeworkuae.com/services/post-construction-cleaning";

export const metadata: Metadata = {
  title: "Post Construction Cleaning Dubai | After Build Clean UAE",
  description:
    "Specialist post-construction cleaning in Dubai. Remove construction dust, debris & chemical residue from new builds & renovations. Municipality approved. Get a quote today!",
  keywords: [
    "post construction cleaning Dubai",
    "after construction cleaning UAE",
    "builders clean Dubai",
    "new build cleaning Dubai",
    "renovation cleaning UAE",
    "construction dust cleaning Dubai",
    "cleaning companies in Dubai",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Post Construction Cleaning Dubai | Homework UAE",
    description: "Specialist post-construction cleaning in Dubai. Remove dust, debris & residue. Municipality approved. Get a quote!",
    url: PAGE_URL,
    type: "website",
  },
};

export default function PostConstructionCleaningLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
