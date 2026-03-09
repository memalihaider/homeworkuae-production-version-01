import { db, storage } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// ─── CMS Data Types ───────────────────────────────────────────────

export interface CMSHeroSection {
  headings: string[]
  subtitle: string
  badgeText: string
  ctaText: string
  ctaLink: string
  videoUrl: string
  featureTags: string[]
  avatarImages: string[]
}

export interface CMSTrustBanner {
  stats: { label: string; value: string }[]
}

export interface CMSCertification {
  title: string
  subtitle: string
  type: 'award' | 'certification'
}

export interface CMSServiceItem {
  title: string
  description: string
  image: string
  tag: string
  href: string
}

export interface CMSHomePage {
  hero: CMSHeroSection
  trustBanner: CMSTrustBanner
  certifications: CMSCertification[]
  services: CMSServiceItem[]
}

export interface CMSAboutPage {
  heroTitle: string
  heroSubtitle: string
  heroBadge: string
  heroImage: string
  legacyTitle: string
  legacyParagraphs: string[]
  visionText: string
  missionText: string
  coreValues: { title: string; description: string }[]
  contactAddress: string
  contactPhone: string
  contactEmail: string
}

export interface CMSContactPage {
  heroTitle: string
  heroSubtitle: string
  phone: string
  email: string
  whatsapp: string
  address: string
  mapEmbedUrl: string
  socialLinks: { platform: string; url: string }[]
}

export interface CMSPricingTier {
  name: string
  price: string
  description: string
  features: string[]
  popular: boolean
}

export interface CMSPricingPage {
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  tiers: CMSPricingTier[]
  faqs: { question: string; answer: string }[]
  customQuoteTitle: string
  customQuoteDescription: string
}

export interface CMSFAQPage {
  heroTitle: string
  heroSubtitle: string
}

export interface CMSServicesPage {
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  categories: {
    name: string
    services: { title: string; description: string; image: string; href: string }[]
  }[]
}

export interface CMSNavbar {
  logoText: string
  logoImage: string
  ctaText: string
  ctaLink: string
}

export interface CMSFooter {
  companyDescription: string
  copyrightText: string
  socialLinks: { platform: string; url: string }[]
  newsletterTitle: string
  newsletterSubtitle: string
}

export interface CMSLayoutSettings {
  navbar: CMSNavbar
  footer: CMSFooter
  topBarPhone: string
  topBarEmail: string
}

// ─── Default Data ────────────────────────────────────────────────

export const defaultHomePage: CMSHomePage = {
  hero: {
    headings: [
      "We Clean\nYou Relax",
      "Pure Air\nPure Health",
      "Certified\nExcellence",
      "Family\nSafe Always",
      "Sparkle &\nShine Daily",
      "Trust Our\nExpertise"
    ],
    subtitle: "Professional cleaning solutions for homes and offices across the UAE. Trusted by 20,000+ clients with eco-friendly products and expert teams.",
    badgeText: "Professional Cleaning Solutions",
    ctaText: "Get Started",
    ctaLink: "/book-service",
    videoUrl: "https://www.pexels.com/download/video/6197558/",
    featureTags: ["Eco-Friendly", "Background Checked", "Same-Day Available", "Insured & Bonded"],
    avatarImages: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150&h=150",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150"
    ]
  },
  trustBanner: {
    stats: [
      { label: "Satisfied Clients", value: "20,000+" },
      { label: "Service Rating", value: "4.9/5.0" },
      { label: "Expert Cleaners", value: "250+" },
      { label: "City Coverage", value: "100%" }
    ]
  },
  certifications: [
    { title: "Best Deep Cleaning Company", subtitle: "2025", type: "award" },
    { title: "Dubai Municipality", subtitle: "Approved", type: "certification" },
    { title: "ISO Certified", subtitle: "Quality Standards", type: "certification" },
    { title: "HACCP Certified", subtitle: "Food Safety", type: "certification" }
  ],
  services: [
    { title: "Residential Cleaning", description: "Regular hourly cleaning for homes", image: "https://images.unsplash.com/photo-1742483359033-13315b247c74?q=80&w=1288&auto=format&fit=crop", tag: "Regular", href: "/services/residential-cleaning" },
    { title: "Villa Deep Cleaning", description: "Complete interior and exterior sanitization", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800", tag: "Deep", href: "/services/villa-deep-cleaning" },
    { title: "AC Duct Cleaning", description: "Professional air duct sterilization", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800", tag: "Technical", href: "/services/ac-duct-cleaning" },
    { title: "Office Deep Cleaning", description: "Corporate space sanitization", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", tag: "Deep", href: "/services/office-deep-cleaning" },
    { title: "Kitchen Deep Cleaning", description: "Heavy-duty degreasing and hood cleaning", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800", tag: "Deep", href: "/services/kitchen-deep-cleaning" },
    { title: "Apartment Deep Cleaning", description: "Move-in or move-out deep cleaning", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800", tag: "Deep", href: "/services/apartment-deep-cleaning" },
    { title: "Post Construction Cleaning", description: "Remove dust and construction residue", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800", tag: "Specialist", href: "/services/post-construction-cleaning" },
    { title: "Sofa Deep Cleaning", description: "Professional upholstery cleaning", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800", tag: "Specialist", href: "/services/sofa-deep-cleaning" },
    { title: "Window Cleaning", description: "Interior and exterior window service", image: "https://images.unsplash.com/photo-1596204976717-1a9ff47f74ef?auto=format&fit=crop&q=80&w=800", tag: "Regular", href: "/services/window-cleaning" },
    { title: "Carpet Deep Cleaning", description: "Professional carpet and rug cleaning", image: "https://plus.unsplash.com/premium_photo-1677234146637-99562eb0ac54?q=80&w=2670&auto=format&fit=crop", tag: "Deep", href: "/services/carpets-deep-cleaning" },
    { title: "Water Tank Cleaning", description: "Safe water tank sanitization", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800", tag: "Technical", href: "/services/water-tank-cleaning" },
    { title: "Gym Deep Cleaning", description: "Equipment and facility sanitization", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", tag: "Deep", href: "/services/gym-deep-cleaning" }
  ]
}

export const defaultAboutPage: CMSAboutPage = {
  heroTitle: "THE STORY OF\nHOMEWORK",
  heroSubtitle: "A brainchild of the parent company E-Movers, dedicated to delivering meticulously clean environments pre and post-move.",
  heroBadge: "Established Since 2004",
  heroImage: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=1600",
  legacyTitle: "Built on 20+ Years of\nRelocation Excellence",
  legacyParagraphs: [
    "Homework is a brainchild of the parent company E-Movers, who have been in the relocation and moving business for 20+ years.",
    "In addition, with COVID-19 in the mist, there has been an increasing need for sanitization and deep cleaning services.",
    "Through the years, we have mastered the smartest and most innovative cleaning techniques."
  ],
  visionText: "To be the first choice to our employees, suppliers and customers in the region we operate.",
  missionText: "To provide reliable, flexible and consistent solution to our internal and external stakeholders in our hygiene business.",
  coreValues: [
    { title: "Honoring Professional SLAs", description: "We stick to our commitments and performance standards." },
    { title: "Reliability & Integrity", description: "Consistent results and honest service every single time." },
    { title: "Customer-First Approach", description: "Your satisfaction is the primary driver of our operations." },
    { title: "Excellence and Quality", description: "Setting the gold standard in every hygiene session." }
  ],
  contactAddress: "Al Quoz - Dubai - United Arab Emirates",
  contactPhone: "800 4663 9675",
  contactEmail: "services@homeworkuae.com"
}

export const defaultContactPage: CMSContactPage = {
  heroTitle: "HAVE QUESTIONS?",
  heroSubtitle: "We'd love to hear from you. Reach out and our team will get back to you promptly.",
  phone: "80046639675",
  email: "services@homeworkuae.com",
  whatsapp: "971501234567",
  address: "Al Quoz Industrial Area 3, Dubai, UAE",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178509394994!2d55.2362!3d25.1885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzE4LjYiTiA1NcKwMTQnMTAuMyJF!5e0!3m2!1sen!2sae!4v1234567890",
  socialLinks: [
    { platform: "Facebook", url: "https://facebook.com/homeworkuae" },
    { platform: "Instagram", url: "https://instagram.com/homeworkuae" },
    { platform: "LinkedIn", url: "https://linkedin.com/company/homeworkuae" },
    { platform: "TikTok", url: "https://tiktok.com/@homeworkuae" }
  ]
}

export const defaultPricingPage: CMSPricingPage = {
  heroTitle: "Simple Pricing",
  heroSubtitle: "Transparent pricing with no hidden costs. Choose the plan that fits your needs.",
  heroImage: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&q=80&w=1600",
  tiers: [
    {
      name: "Basic Clean",
      price: "150",
      description: "Essential cleaning for small spaces and busy individuals.",
      features: ["Dusting and wiping", "Floor cleaning", "Bathroom cleaning", "1 hour service", "Standard supplies"],
      popular: false
    },
    {
      name: "Deep Clean",
      price: "300",
      description: "Comprehensive cleaning service for a thorough refresh.",
      features: ["All basic services", "Inside appliances", "Window cleaning", "2-3 hours service", "Premium supplies", "Sanitization"],
      popular: true
    },
    {
      name: "Premium Package",
      price: "500",
      description: "Complete home/office transformation and restoration.",
      features: ["All deep clean services", "Carpet cleaning", "Upholstery cleaning", "4+ hours service", "Eco-friendly products", "Post-service inspection"],
      popular: false
    }
  ],
  faqs: [
    { question: "Are cleaning supplies included?", answer: "Yes, for Deep Clean and Premium packages, we provide all necessary professional-grade supplies and equipment." },
    { question: "Can I cancel or reschedule?", answer: "Absolutely! You can cancel or reschedule your booking up to 24 hours before the scheduled time without any charge." },
    { question: "Are your cleaners insured?", answer: "Yes, all our staff are fully insured and background-verified for your peace of mind." },
    { question: "How do I pay?", answer: "We accept online payments via credit/debit cards, as well as cash on delivery." }
  ],
  customQuoteTitle: "Need a Custom Quote?",
  customQuoteDescription: "For large commercial spaces, industrial cleaning, or specialized requirements, we offer tailored solutions and competitive rates."
}

export const defaultFAQPage: CMSFAQPage = {
  heroTitle: "Frequently Asked Questions",
  heroSubtitle: "Find answers to common questions about our cleaning services."
}

export const defaultServicesPage: CMSServicesPage = {
  heroTitle: "Our Services",
  heroSubtitle: "Professional cleaning solutions tailored for every space and need.",
  heroImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1600",
  categories: [
    {
      name: "Normal Cleaning",
      services: [
        { title: "Residential Cleaning", description: "Regular hourly cleaning", image: "https://images.unsplash.com/photo-1742483359033-13315b247c74?q=80&w=1288", href: "/services/residential-cleaning" },
        { title: "Window Cleaning", description: "Interior and exterior windows", image: "https://images.unsplash.com/photo-1596204976717-1a9ff47f74ef?auto=format&fit=crop&q=80&w=800", href: "/services/window-cleaning" }
      ]
    },
    {
      name: "Deep Cleaning",
      services: [
        { title: "Villa Deep Cleaning", description: "Complete sanitization", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800", href: "/services/villa-deep-cleaning" },
        { title: "Kitchen Deep Cleaning", description: "Heavy-duty degreasing", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800", href: "/services/kitchen-deep-cleaning" }
      ]
    },
    {
      name: "Technical Services",
      services: [
        { title: "AC Duct Cleaning", description: "Air duct sterilization", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800", href: "/services/ac-duct-cleaning" },
        { title: "Water Tank Cleaning", description: "Water tank sanitization", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800", href: "/services/water-tank-cleaning" }
      ]
    }
  ]
}

export const defaultLayoutSettings: CMSLayoutSettings = {
  navbar: {
    logoText: "HOMEWORK",
    logoImage: "",
    ctaText: "BOOK NOW",
    ctaLink: "/book-service"
  },
  footer: {
    companyDescription: "Professional cleaning services across the UAE. Trusted by thousands for eco-friendly, reliable cleaning solutions.",
    copyrightText: "© 2025 HomeWork UAE. All rights reserved.",
    socialLinks: [
      { platform: "Facebook", url: "https://facebook.com/homeworkuae" },
      { platform: "Instagram", url: "https://instagram.com/homeworkuae" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/homeworkuae" },
      { platform: "TikTok", url: "https://tiktok.com/@homeworkuae" }
    ],
    newsletterTitle: "Stay Updated",
    newsletterSubtitle: "Subscribe to our newsletter for cleaning tips and offers."
  },
  topBarPhone: "80046639675",
  topBarEmail: "services@homeworkuae.com"
}

// ─── Firebase CRUD Operations ─────────────────────────────────────

const CMS_COLLECTION = 'cms-pages'

export async function getCMSData<T>(pageId: string, defaultData: T): Promise<T> {
  try {
    const docRef = doc(db, CMS_COLLECTION, pageId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as T
    }
    return defaultData
  } catch (error) {
    console.error(`Error fetching CMS data for ${pageId}:`, error)
    return defaultData
  }
}

export async function saveCMSData<T extends Record<string, unknown>>(pageId: string, data: T): Promise<boolean> {
  try {
    const docRef = doc(db, CMS_COLLECTION, pageId)
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true })
    return true
  } catch (error) {
    console.error(`Error saving CMS data for ${pageId}:`, error)
    return false
  }
}

export async function uploadCMSImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, `cms/${path}/${Date.now()}_${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// Convenience getters
export const getHomePage = () => getCMSData<CMSHomePage>('home', defaultHomePage)
export const getAboutPage = () => getCMSData<CMSAboutPage>('about', defaultAboutPage)
export const getContactPage = () => getCMSData<CMSContactPage>('contact', defaultContactPage)
export const getPricingPage = () => getCMSData<CMSPricingPage>('pricing', defaultPricingPage)
export const getFAQPage = () => getCMSData<CMSFAQPage>('faq-page', defaultFAQPage)
export const getServicesPage = () => getCMSData<CMSServicesPage>('services', defaultServicesPage)
export const getLayoutSettings = () => getCMSData<CMSLayoutSettings>('layout', defaultLayoutSettings)

export const saveHomePage = (data: CMSHomePage) => saveCMSData('home', data as unknown as Record<string, unknown>)
export const saveAboutPage = (data: CMSAboutPage) => saveCMSData('about', data as unknown as Record<string, unknown>)
export const saveContactPage = (data: CMSContactPage) => saveCMSData('contact', data as unknown as Record<string, unknown>)
export const savePricingPage = (data: CMSPricingPage) => saveCMSData('pricing', data as unknown as Record<string, unknown>)
export const saveFAQPage = (data: CMSFAQPage) => saveCMSData('faq-page', data as unknown as Record<string, unknown>)
export const saveServicesPage = (data: CMSServicesPage) => saveCMSData('services', data as unknown as Record<string, unknown>)
export const saveLayoutSettings = (data: CMSLayoutSettings) => saveCMSData('layout', data as unknown as Record<string, unknown>)
