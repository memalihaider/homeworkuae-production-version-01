import type { Metadata } from "next";
import type { ReactNode } from "react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What cleaning services do you offer in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Homework UAE offers villa deep cleaning, AC duct cleaning, residential home cleaning, office cleaning, kitchen deep cleaning, post-construction cleaning, sofa cleaning, carpet cleaning, window cleaning and more across Dubai and the UAE.",
      },
    },
    {
      "@type": "Question",
      name: "Are you a Dubai Municipality approved cleaning company?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Homework UAE is fully approved by Dubai Municipality and holds all required permits to operate as a professional cleaning company in Dubai.",
      },
    },
    {
      "@type": "Question",
      name: "How do I book a villa deep cleaning in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book a villa deep cleaning by visiting our website, calling us, or sending a WhatsApp message. We'll confirm availability and provide a quote within hours.",
      },
    },
    {
      "@type": "Question",
      name: "How much does AC duct cleaning cost in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AC duct cleaning prices vary depending on the size of the property and number of units. Contact Homework UAE for a free quote tailored to your home or office.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer regular residential home cleaning in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer regular, weekly, bi-weekly and monthly residential cleaning packages across Dubai and the UAE. All staff are trained, vetted and insured.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "FAQs: Cleaning Services in Dubai | Homework UAE",
  description:
    "Frequently asked questions about Homework UAE cleaning services in Dubai, including villa cleaning, AC duct cleaning, and home cleaning.",
  keywords: [
    "cleaning company FAQ Dubai",
    "villa deep cleaning questions",
    "AC duct cleaning FAQ",
    "home cleaning FAQ Dubai",
    "cleaning companies in Dubai FAQ",
  ],
  alternates: { canonical: "https://www.homeworkuae.com/faqs" },
  openGraph: {
    title: "FAQs | Homework UAE – Cleaning Services Dubai",
    description:
      "Common questions about villa, AC duct, and home cleaning services in Dubai.",
    url: "https://www.homeworkuae.com/faqs",
    type: "website",
  },
};

export default function FAQsLayout({ children }: { children: ReactNode }) {
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
