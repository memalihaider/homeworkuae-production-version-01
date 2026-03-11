import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

const SITE_URL = "https://www.homeworkuae.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Homework UAE | #1 Cleaning Company in Dubai | Since 2004",
    template: "%s | Homework UAE",
  },
  description:
    "Dubai's #1 cleaning company since 2004. Villa deep cleaning, AC duct cleaning, residential & home cleaning, office & post-construction. Dubai Municipality approved. 20,000+ happy clients.",
  keywords: [
    "cleaning companies in Dubai",
    "cleaning companies Dubai",
    "home cleaning Dubai",
    "home cleaning service Dubai",
    "villa deep cleaning Dubai",
    "villa cleaning Dubai",
    "AC duct cleaning Dubai",
    "air duct cleaning UAE",
    "residential cleaning Dubai",
    "deep cleaning company UAE",
    "office cleaning Dubai",
    "post construction cleaning Dubai",
    "Dubai Municipality approved cleaning",
    "professional cleaning services UAE",
    "move in move out cleaning Dubai",
    "kitchen deep cleaning Dubai",
  ],
  authors: [{ name: "Homework UAE", url: SITE_URL }],
  creator: "Homework UAE",
  publisher: "Homework UAE",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Homework UAE | #1 Cleaning Company in Dubai",
    description:
      "Professional villa deep cleaning, AC duct cleaning, residential & home cleaning across Dubai & UAE. Municipality approved. 20,000+ happy clients.",
    type: "website",
    locale: "en_AE",
    siteName: "Homework UAE",
    url: SITE_URL,
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Homework UAE – Professional Cleaning Company Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Homework UAE | #1 Cleaning Company in Dubai",
    description:
      "Professional villa deep cleaning, AC duct cleaning, residential & home cleaning across Dubai & UAE.",
    images: ["/logo.jpeg"],
  },
  verification: {
    google: "", // add your Google Search Console token here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* LocalBusiness + Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.homeworkuae.com/#business",
                  name: "Homework UAE",
                  alternateName: "Homework Cleaning UAE",
                  description:
                    "Professional cleaning company in Dubai & UAE offering villa deep cleaning, AC duct cleaning, residential home cleaning, office, kitchen & post-construction cleaning since 2004.",
                  url: "https://www.homeworkuae.com",
                  telephone: "+97180046639675",
                  email: "services@homeworkuae.com",
                  foundingDate: "2004",
                  priceRange: "$$",
                  currenciesAccepted: "AED",
                  paymentAccepted: "Cash, Credit Card, Bank Transfer",
                  image: "https://www.homeworkuae.com/logo.jpeg",
                  logo: "https://www.homeworkuae.com/logo.jpeg",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Office 201, 2nd Floor, Al Saaha Offices - B, Downtown Dubai",
                    addressLocality: "Dubai",
                    addressRegion: "Dubai",
                    addressCountry: "AE",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 25.1972,
                    longitude: 55.2744,
                  },
                  areaServed: [
                    { "@type": "City", name: "Dubai" },
                    { "@type": "City", name: "Abu Dhabi" },
                    { "@type": "City", name: "Sharjah" },
                    { "@type": "State", name: "United Arab Emirates" },
                  ],
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Sunday"],
                      opens: "08:00",
                      closes: "20:00",
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Friday", "Saturday"],
                      opens: "09:00",
                      closes: "18:00",
                    },
                  ],
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Cleaning Services",
                    itemListElement: [
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Villa Deep Cleaning Dubai" } },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Duct Cleaning Dubai" } },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Residential Cleaning Dubai" } },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Cleaning Dubai" } },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Office Deep Cleaning Dubai" } },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Kitchen Deep Cleaning Dubai" } },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Post Construction Cleaning Dubai" } },
                    ],
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    bestRating: "5",
                    reviewCount: "1247",
                  },
                  sameAs: [
                    "https://www.facebook.com/homework.uae",
                    "https://www.instagram.com/homework.uae",
                    "https://www.linkedin.com/company/homework-uae",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.homeworkuae.com/#website",
                  url: "https://www.homeworkuae.com",
                  name: "Homework UAE",
                  publisher: { "@id": "https://www.homeworkuae.com/#business" },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: "https://www.homeworkuae.com/services?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="prefetch" href="/" />
        <link rel="prefetch" href="/services" />
        <link rel="prefetch" href="/about" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
