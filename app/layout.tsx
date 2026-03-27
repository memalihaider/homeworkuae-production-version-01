import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import MotionProvider from "@/components/MotionProvider";

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
    default: "Homework UAE | Premium Cleaning Company in Dubai | Maid & Deep Cleaning Services",
    template: "%s | Homework UAE",
  },
  description:
    "Premium cleaning company in Dubai for maid services, deep cleaning services, villa cleaning, office cleaning, and AC duct cleaning. Dubai Municipality approved. Trusted by 20,000+ clients since 2004.",
  keywords: [
    "premium cleaning company in Dubai",
    "maid services Dubai",
    "maid service Dubai",
    "deep cleaning services in Dubai",
    "best cleaning company in Dubai",
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
    title: "Homework UAE | Premium Cleaning Company in Dubai",
    description:
      "Premium maid services and deep cleaning services in Dubai. Professional villa, office, AC duct, and residential cleaning with trusted quality.",
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
    title: "Homework UAE | Premium Cleaning Company in Dubai",
    description:
      "Premium maid services and deep cleaning services in Dubai for homes, villas, and offices.",
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
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M5276JP8');`,
          }}
        />
        {/* End Google Tag Manager */}

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
                    "Premium cleaning company in Dubai offering maid services, deep cleaning services, villa cleaning, office cleaning, kitchen cleaning, AC duct cleaning, and post-construction cleaning since 2004.",
                  url: "https://www.homeworkuae.com",
                  telephone: "+971507177059",
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
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maid Services Dubai" } },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Deep Cleaning Services in Dubai" } },
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
        className={`${inter.variable} ${playfair.variable} antialiased reduce-motion`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M5276JP8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <MotionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
