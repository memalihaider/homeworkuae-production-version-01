'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Users,
  Star,
  UserCheck,
  MapPin,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  Wind,
  Wrench,
  Activity,
  Timer,
  CircleCheck,
} from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'

export type ServiceTrustStat = { label: string; value: string }
export type ServiceOfferCard = { title: string }
export type ServiceProcessStep = { title: string; detail: string }
export type ServiceFAQItem = { q: string; a: string }
export type ServiceReviewItem = {
  name: string
  text: string
  area: string
  avatar: string
  date: string
}

export type ServicePageContent = {
  name: string
  badge: string
  heroTitleLine1: string
  heroTitleLine2: string
  heroSubtitle: string
  heroImage: string
  sectionImage: string
  specialistLabel: string
  aboutHeading1: string
  aboutHeading2: string
  description: string
  features: string[]
  ctaTitle: string
  ctaSubtitle: string
  trustStats?: ServiceTrustStat[]
  offerCards?: ServiceOfferCard[]
  processSteps?: ServiceProcessStep[]
  serviceAreas?: string[]
  whyChoosePoints?: string[]
  faqs?: ServiceFAQItem[]
  reviews?: ServiceReviewItem[]
}

export const SERVICE_DEFAULTS: Record<string, ServicePageContent> = {
  'residential-cleaning': {
    name: 'Regular Residential Cleaning',
    badge: 'Normal Cleaning Services',
    heroTitleLine1: 'REGULAR',
    heroTitleLine2: 'RESIDENTIAL CLEANING',
    heroSubtitle: "UAE's Trusted Residential Cleaning – Experience Pristine Living Spaces",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Home Cleaning Specialists',
    aboutHeading1: 'Expert Regular',
    aboutHeading2: 'Home Cleaning Service',
    description: "Keeping your home clean and tidy is essential for a comfortable and healthy living environment. At Homework Cleaning Services LLC, we offer reliable and comprehensive regular residential cleaning services tailored to your specific needs. Our experienced team uses advanced techniques and eco-friendly products to ensure your home stays spotless.",
    features: ['Full Surface Dusting & Wiping', 'Carpet Vacuuming & Floor Mopping', 'Window & Mirror Cleaning', 'Bathroom Deep Sanitization', 'Shower, Tub & Toilet Cleaning', 'Bed Making & Bedroom Tidying'],
    ctaTitle: 'Enjoy a Spotless Home',
    ctaSubtitle: 'Contact us today for professional residential cleaning services.',
  },
  'office-cleaning': {
    name: 'Regular Office Cleaning',
    badge: 'Normal Cleaning Services',
    heroTitleLine1: 'REGULAR',
    heroTitleLine2: 'OFFICE CLEANING',
    heroSubtitle: "Transform Your Office with UAE's Expert Regular Office Cleaning Services",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Office Cleaning Specialists',
    aboutHeading1: 'Professional Office',
    aboutHeading2: 'Cleaning Service',
    description: "A clean and organized office environment is essential for productivity and employee well-being. At Homework Cleaning Services LLC, we offer reliable and comprehensive regular office cleaning services tailored to your specific needs. Our experienced team uses advanced techniques and eco-friendly products to ensure your office stays spotless.",
    features: ['Reception & Lobby Cleaning', 'Workstation & Desk Wiping', 'Electronics & Screen Dusting', 'Restroom Deep Sanitization', 'Floor Vacuuming & Mopping', 'Breakroom & Pantry Cleaning'],
    ctaTitle: 'Maintain a Clean Workspace',
    ctaSubtitle: 'Contact us today for professional office cleaning services.',
  },
  'window-cleaning': {
    name: 'Window Cleaning',
    badge: 'Normal Cleaning Services',
    heroTitleLine1: 'CRYSTAL',
    heroTitleLine2: 'CLEAR WINDOWS',
    heroSubtitle: "Crystal Clear Window Cleaning Services in UAE – Stunning Views, Every Time",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Window Cleaning Specialists',
    aboutHeading1: 'Streak-Free',
    aboutHeading2: 'Window Cleaning',
    description: "Sparkling clean windows can enhance the appearance of your home or office, providing a clear view and letting in natural light. At Homework Cleaning Services LLC, we offer comprehensive window cleaning services to ensure your windows are spotless and streak-free using advanced techniques and eco-friendly products.",
    features: ['Interior & Exterior Glass Cleaning', 'Window Frame & Sill Cleaning', 'Fly Screen Cleaning & Inspection', 'Commercial Office Building Windows', 'High-Rise Window Access Solutions', 'Hard Water Stain Removal Treatment'],
    ctaTitle: 'Enjoy Crystal Clear Windows',
    ctaSubtitle: 'Contact us today for professional window cleaning services.',
  },
  'balcony-deep-cleaning': {
    name: 'Balcony Deep Cleaning',
    badge: 'Deep Cleaning Services',
    heroTitleLine1: 'PRISTINE',
    heroTitleLine2: 'BALCONY CLEANING',
    heroSubtitle: "Pristine Balcony Deep Cleaning in UAE – Enjoy Your Outdoor Space",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Balcony Specialists',
    aboutHeading1: 'Restore Your',
    aboutHeading2: 'Outdoor Living Space',
    description: "A clean balcony can be a refreshing extension of your living space. At Homework Cleaning Services LLC, we offer comprehensive balcony cleaning services to ensure your balcony is spotless and inviting. Our experienced team uses advanced cleaning techniques and eco-friendly products to tackle dirt, grime, and stains.",
    features: ['Thorough Sweeping & Vacuuming', 'Deep Mopping & Scrubbing', 'Railing & Handrail Polishing', 'Outdoor Furniture Cleaning', 'Window Glass & Frame Cleaning', 'High-Pressure Surface Washing'],
    ctaTitle: 'Revitalize Your Outdoor Space',
    ctaSubtitle: 'Contact us today for professional balcony deep cleaning services.',
  },
  'sofa-deep-cleaning': {
    name: 'Sofa Deep Cleaning',
    badge: 'Deep Cleaning Services',
    heroTitleLine1: 'REVITALIZE',
    heroTitleLine2: 'YOUR SOFA',
    heroSubtitle: "Revitalize Your Sofa with UAE's Expert Deep Cleaning Services",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Upholstery Specialists',
    aboutHeading1: 'Like-New',
    aboutHeading2: 'Sofa Deep Cleaning',
    description: "Your sofa is the centerpiece of your living room, and keeping it clean is essential for maintaining a healthy and inviting home. At Homework Cleaning Services LLC, we offer professional sofa deep cleaning services to remove dirt, stains, and allergens from your upholstery, leaving it looking and feeling like new.",
    features: ['Fabric Type Assessment', 'Targeted Spot Pre-Treatment', 'High-Power Vacuum Extraction', 'Hot Steam Deep Sanitization', 'Stubborn Stain Removal', 'Premium Fabric Protection Coating'],
    ctaTitle: "Restore Your Sofa's Freshness",
    ctaSubtitle: 'Contact us today for professional sofa deep cleaning services.',
  },
  'carpets-deep-cleaning': {
    name: 'Carpets Deep Cleaning',
    badge: 'Deep Cleaning Services',
    heroTitleLine1: 'REVITALIZE',
    heroTitleLine2: 'YOUR CARPETS',
    heroSubtitle: "Revitalize Your Carpets with UAE's Expert Deep Cleaning Services",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Carpet Specialists',
    aboutHeading1: 'Expert Carpet',
    aboutHeading2: 'Deep Extraction',
    description: "Transform your carpets and extend their life with Homework Cleaning Services LLC's expert carpet deep cleaning services. Our team specializes in removing deep-seated dirt, stains, and allergens, restoring your carpets to their original beauty using state-of-the-art equipment and eco-friendly cleaning solutions.",
    features: ['Detailed Carpet Inspection', 'Pre-Treatment Application', 'Hot Water Steam Extraction', 'Dry Foam Cleaning Option', 'Stubborn Stain Treatment', 'Odour Neutralisation'],
    ctaTitle: 'Restore Your Carpets',
    ctaSubtitle: 'Contact us today for professional carpet deep cleaning services.',
  },
  'mattress-deep-cleaning': {
    name: 'Mattress Deep Cleaning',
    badge: 'Deep Cleaning Services',
    heroTitleLine1: 'SLEEP CLEAN &',
    heroTitleLine2: 'COMFORTABLE',
    heroSubtitle: "UAE's Premier Mattress Deep Cleaning for Better Sleep Hygiene",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Mattress Specialists',
    aboutHeading1: 'Healthier Sleep,',
    aboutHeading2: 'Cleaner Mattress',
    description: "A clean and hygienic mattress is essential for a good night's sleep and overall health. At Homework Cleaning Services LLC, we offer professional mattress deep cleaning services to ensure your mattress is free from dust, allergens, and stains. Our team uses advanced techniques and eco-friendly products to leave your mattress fresh and revitalized.",
    features: ['Full Mattress Assessment', 'Targeted Spot Pre-Treatment', 'High-Power Vacuum Extraction', 'Hot Steam Deep Sanitization', 'Tough Stain Removal Treatment', 'Odour Neutralisation & Freshening'],
    ctaTitle: 'Sleep in a Cleaner, Healthier Bed',
    ctaSubtitle: 'Contact us today for professional mattress deep cleaning services.',
  },
  'grout-deep-cleaning': {
    name: 'Grout Deep Cleaning',
    badge: 'Deep Cleaning Services',
    heroTitleLine1: 'REVITALIZE',
    heroTitleLine2: 'YOUR TILES',
    heroSubtitle: "Expert Grout Cleaning Services in UAE – Fresh and Disinfected",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Grout Specialists',
    aboutHeading1: 'Restore Your Tiles &',
    aboutHeading2: 'Grout Lines',
    description: "Are you tired of dirty, stained grout lines diminishing the beauty of your tiles? Homework Cleaning Services LLC offers professional grout deep cleaning services to restore the original look of your tiled surfaces using advanced techniques and eco-friendly products.",
    features: ['Thorough Grout Assessment', 'Eco-Friendly Solution Application', 'High-Pressure Steam Cleaning', 'Manual Hard Stain Scrubbing', 'Premium Grout Sealing', 'Grout Colour Restoration'],
    ctaTitle: 'Restore Your Grout & Tiles',
    ctaSubtitle: 'Contact us today for professional grout deep cleaning services.',
  },
  'garage-deep-cleaning': {
    name: 'Garage Deep Cleaning',
    badge: 'Deep Cleaning Services',
    heroTitleLine1: 'PREMIUM',
    heroTitleLine2: 'GARAGE CLEANING',
    heroSubtitle: "Organized and Clean Spaces in UAE – Restore Your Garage Mastery",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Garage Specialists',
    aboutHeading1: 'Transform Your',
    aboutHeading2: 'Garage Space',
    description: "A clean and organized garage can make a world of difference in your home. At Homework Cleaning Services LLC, we specialize in providing thorough garage deep cleaning services to transform your garage into a spotless, functional space using advanced cleaning techniques and eco-friendly products.",
    features: ['Walls, Ceilings & Cobwebs', 'Oil & Grease Stain Removal', 'Floor Mopping & Pressure Washing', 'Shelves & Cabinet Cleaning', 'Tool & Equipment Organization', 'Pet Area Sanitization'],
    ctaTitle: 'Transform Your Garage',
    ctaSubtitle: 'Contact us today for professional garage deep cleaning services.',
  },
  'kitchen-deep-cleaning': {
    name: 'Kitchen Deep Cleaning',
    badge: 'Deep Cleaning Services',
    heroTitleLine1: 'HYGIENIC',
    heroTitleLine2: 'KITCHEN PURITY',
    heroSubtitle: "Immaculate Kitchen Deep Cleaning in UAE – Hygienic and Spotless",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Kitchen Specialists',
    aboutHeading1: 'Deep Kitchen',
    aboutHeading2: 'Sanitization & Degreasing',
    description: "A sparkling clean kitchen is the heart of a happy home. At Homework Cleaning Services LLC, we offer comprehensive kitchen deep cleaning services to ensure your kitchen is not only visually spotless but also hygienically clean. Our professional team uses advanced techniques and eco-friendly products to tackle every corner.",
    features: ['Cabinet Interior & Exterior Cleaning', 'Stubborn Stain & Grease Removal', 'Full Refrigerator & Freezer Clean', 'Oven & Stovetop Deep Degreasing', 'Descaling of Taps & Sinks', 'Floor Machine Scrubbing'],
    ctaTitle: 'Transform Your Kitchen',
    ctaSubtitle: 'Contact us today for a professional kitchen deep cleaning experience.',
  },
  'post-construction-cleaning': {
    name: 'Post Construction Cleaning',
    badge: 'Expert Restoration',
    heroTitleLine1: 'POST CONSTRUCTION',
    heroTitleLine2: 'CLEANING EXCELLENCE',
    heroSubtitle: "Post Construction Cleaning Excellence in UAE – Move In Ready Spaces",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Construction Clean Specialists',
    aboutHeading1: 'Move-In Ready',
    aboutHeading2: 'Post-Build Cleaning',
    description: "Just finished a construction or renovation project? Let Homework Cleaning Services LLC handle the mess. Our professional post-construction cleaning services are designed to remove dust, debris, and construction residue, leaving your new space pristine and ready to be enjoyed.",
    features: ['Full Construction Dust Removal', 'Floor Cleaning & Polishing', 'Bathroom Fixture Deep Clean', 'Cabinet & Drawer Interior Wipe', 'Debris & Waste Removal', 'Final Detail & Snagging Clean'],
    ctaTitle: 'Turn Your Build Into Your Home',
    ctaSubtitle: 'Contact us today for professional post-construction cleaning services.',
  },
  'office-deep-cleaning': {
    name: 'Office Deep Cleaning',
    badge: 'Deep Cleaning Services',
    heroTitleLine1: 'WORKSPACE',
    heroTitleLine2: 'TRANSFORMATION',
    heroSubtitle: "A deeper level of corporate hygiene. Specialized sanitization for high-traffic workspaces, conference rooms, and data centers.",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'B2B Hygiene Specialists',
    aboutHeading1: 'Corporate',
    aboutHeading2: 'Deep Sanitization',
    description: "Regular cleaning maintains visibility; deep cleaning maintains health. We focus on frequently touched surfaces, high-ventilation areas, and textile deep cleaning to ensure your team stays productive and safe.",
    features: ['Server Room & Electronics Dusting', 'Upholstered Chair & Carpet Extraction', 'Restroom Deep Sanitization (Hospital Grade)', 'Pantry & Breakroom Degreasing', 'Air Vent & Grille Cleaning', 'Touch-Point Antimicrobial Coating'],
    ctaTitle: 'Transform Your Workspace',
    ctaSubtitle: 'Contact us today for a professional office deep cleaning experience.',
  },
  'apartment-deep-cleaning': {
    name: 'Apartment Deep Cleaning',
    badge: 'Elite Residential Care',
    heroTitleLine1: 'APARTMENT',
    heroTitleLine2: 'DEEP CLEANING',
    heroSubtitle: "Top Apartment Deep Cleaning in UAE – Sparkling Results Every Time",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Apartment Specialists',
    aboutHeading1: 'Complete Apartment',
    aboutHeading2: 'Deep Sanitization',
    description: "Are you looking to give your apartment a thorough, top-to-bottom clean? Homework Cleaning Services LLC is here to provide exceptional apartment deep cleaning services. Our professional team uses advanced cleaning techniques and eco-friendly products to ensure every nook and cranny of your apartment is spotless.",
    features: ['Full Dusting of All Surfaces', 'Floor Vacuuming & Mopping', 'Windows & Mirror Cleaning', 'Bathroom Deep Sanitization', 'Kitchen Appliance Cleaning', 'Balcony & Outdoor Areas'],
    ctaTitle: 'Transform Your Apartment',
    ctaSubtitle: 'Contact us today for a professional apartment deep cleaning experience.',
  },
  'move-in-out-cleaning': {
    name: 'Move In/Out Cleaning',
    badge: 'Relocation Specialists',
    heroTitleLine1: 'STRESS-FREE',
    heroTitleLine2: 'MOVE IN / OUT',
    heroSubtitle: "Stress-Free Move In/Move Out Cleaning in UAE – Your Perfect Transition Partner",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Move Cleaning Specialists',
    aboutHeading1: 'Complete Move-Out',
    aboutHeading2: 'Deep Cleaning Service',
    description: "Moving out can be stressful, but with Homework Cleaning Services LLC, your move-out cleaning is one less thing to worry about. We provide thorough and efficient cleaning services to ensure your old home is spotless and ready for the next occupants. Our team handles everything from floor to ceiling.",
    features: ['Walls, Ceilings & Skirting Boards', 'Full Floor Cleaning & Polishing', 'Bathroom Deep Sanitization', 'Kitchen Appliance Cleaning', 'Cabinets & Drawers Interior Clean', 'Final Inspection & Sign-Off'],
    ctaTitle: 'Start Fresh in Your New Space',
    ctaSubtitle: 'Contact us today for professional move in/out cleaning services.',
  },
  'villa-deep-cleaning': {
    name: 'Villa Deep Cleaning',
    badge: 'Grand Scale Excellence',
    heroTitleLine1: 'VILLA',
    heroTitleLine2: 'DEEP CLEANING',
    heroSubtitle: "Transform Your Villa with UAE's Expert Deep Cleaning Services",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Villa Cleaning Specialists',
    aboutHeading1: 'Complete Villa',
    aboutHeading2: 'Deep Sanitization',
    description: "Is your villa in need of a thorough and meticulous clean? At Homework Cleaning Services LLC, we specialize in transforming your villa into a spotless sanctuary. Our professional team uses advanced equipment and eco-friendly cleaning solutions to ensure every corner of your villa shines with brilliance.",
    features: ['Walls, Skirting & Sills Cleaning', 'Furniture & Upholstery Deep Clean', 'Shower Areas & Bathtub Scrubbing', 'Full Kitchen Appliance Cleaning', 'Countertops & Backsplash Sanitization', 'High-Touch Point Antimicrobial Treatment'],
    ctaTitle: 'Transform Your Villa',
    ctaSubtitle: 'Contact us today for a professional villa deep cleaning experience.',
  },
  'floor-deep-cleaning': {
    name: 'Floor Deep Cleaning',
    badge: 'Deep Cleaning Services',
    heroTitleLine1: 'BRILLIANT',
    heroTitleLine2: 'FLOOR RESTORE',
    heroSubtitle: "Professional machine scrubbing and polishing for all types of hard flooring. Bring back the shine to your marble, tile, and stone.",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Floor Specialists',
    aboutHeading1: 'Machine',
    aboutHeading2: 'Deep Scrubbing',
    description: "Ordinary mopping is not enough for UAE's dust levels. Our rotary scrubbing machines and specialized cleaning solutions penetrate the pores of your tiles and marble, extracting deep-seated dirt and restoring surface luster.",
    features: ['Rotary Machine Scrubbing with Pad Selection', 'pH-Balanced Stone Cleaning Solutions', 'High-Pressure Grout Line Extraction', 'Stain Removal from Porous Surfaces', 'Buffing and Polishing for High Shine', 'Protective Flooring Sealant Application'],
    ctaTitle: 'Ready to Restore Your Floors?',
    ctaSubtitle: 'Contact us today for a professional floor deep cleaning experience.',
  },
  'ac-duct-cleaning': {
    name: 'AC Duct Cleaning',
    badge: 'Breathable Excellence',
    heroTitleLine1: 'AC DUCT',
    heroTitleLine2: 'CLEANING',
    heroSubtitle: "Breathe Easy with UAE's Professional AC Duct Cleaning Services",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Air Quality Specialists',
    aboutHeading1: 'Breathe Easy: Your Ultimate',
    aboutHeading2: 'Guide to AC Duct Cleaning',
    description: "Cleaning your AC ducts is more than just a chore—it's essential for your health and your home's efficiency. Many people overlook this necessary task, only to pay the price later. At Homework UAE, we prioritize your indoor air quality by removing dust, allergens, and mold from your ventilation system using hospital-grade disinfectants.",
    features: ['Hidden Pollutant Removal', 'Allergy & Asthma Relief', 'Energy Efficiency Restoration', 'Advanced Air Scrubbing', 'Annual Maintenance Schedule', 'Filter Replacement Guidance'],
    ctaTitle: 'Breathe Cleaner Air Today',
    ctaSubtitle: 'Contact us today for professional AC duct cleaning services.',
  },
  'ac-coil-cleaning': {
    name: 'AC Coil Cleaning',
    badge: 'Efficiency Experts',
    heroTitleLine1: 'AC COIL',
    heroTitleLine2: 'CLEANING',
    heroSubtitle: "Efficient AC Coil Cleaning in UAE – Enhanced Cooling Efficiency",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'AC Coil Specialists',
    aboutHeading1: 'Keep Your Cool: A Comprehensive',
    aboutHeading2: 'Guide to AC Coil Cleaning',
    description: "Keeping your air conditioning (AC) system in top shape is essential for comfort, efficiency, and health. One important yet often overlooked component is the AC coils. At Homework UAE, we provide deep coil cleaning using hospital-grade chemicals to restore your system's peak performance and reduce energy bills.",
    features: ['Energy Waste Diagnosis', 'Health Concerns Assessment', 'Evaporator Coil Cleaning', 'Chemical Deep Scrubbing', 'Regular Maintenance Schedule', 'Energy Savings Verification'],
    ctaTitle: 'Keep Your AC Running at Peak Efficiency',
    ctaSubtitle: 'Contact us today for professional AC coil cleaning in the UAE.',
  },
  'kitchen-hood-cleaning': {
    name: 'Kitchen Hood Cleaning',
    badge: 'Safety & Compliance',
    heroTitleLine1: 'KITCHEN HOOD',
    heroTitleLine2: 'HYGIENE EXPERTS',
    heroSubtitle: "Expert Kitchen Hood Cleaning in UAE – Safe and Hygienic Kitchens",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Hood Cleaning Specialists',
    aboutHeading1: 'Safety & Compliance:',
    aboutHeading2: 'Kitchen Exhaust Maintenance',
    description: "When you think of a restaurant's kitchen, the focus usually goes to the food being prepared. Yet, one crucial component often overlooked is the kitchen hood. Regular cleaning of this system is not just good practice — it's essential for safety and compliance. Cooking equipment is the leading cause of restaurant fires, accounting for over 50% of all incidents.",
    features: ['Fire Hazard Risk Assessment', 'Regulatory Compliance Check', 'Full System Dismantling & Prep', 'Heavy-Duty Chemical Degreasing', 'Baffle Filter Deep Cleaning', 'NFPA 96 Compliance Certification'],
    ctaTitle: 'Keep Your Kitchen Hood Clean',
    ctaSubtitle: 'Contact us today for professional kitchen hood cleaning services.',
  },
  'grease-trap-cleaning': {
    name: 'Grease Trap Cleaning',
    badge: 'Maintenance & Compliance',
    heroTitleLine1: 'GREASE TRAP',
    heroTitleLine2: 'CLEANING SOLUTIONS',
    heroSubtitle: "Reliable Grease Trap Cleaning in UAE – Keep Your Kitchen Flowing",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'FOG Management Specialists',
    aboutHeading1: 'Prevent Costly Clogs:',
    aboutHeading2: 'Active Grease Management',
    description: "The accumulation of grease in your plumbing system can lead to significant problems. At Homework Cleaning Services LLC, we provide municipality-approved grease trap cleaning to protect your business from foul odors, plumbing disasters, and regulatory fines. Regular maintenance ensures your kitchen remains operational and hygienic.",
    features: ['Slow Drain Identification', 'Foul Odour Elimination', 'Full Waste Vacuum Pumping', 'High-Pressure Internal Washing', 'Regular Maintenance Schedule', 'Regulatory Compliance Assurance'],
    ctaTitle: 'Keep Your Grease Traps Clean & Compliant',
    ctaSubtitle: 'Contact us today for professional grease trap cleaning services.',
  },
  'restaurant-cleaning': {
    name: 'Restaurant Cleaning',
    badge: 'F&B Specialized Hygiene',
    heroTitleLine1: 'RESTAURANT',
    heroTitleLine2: 'CLEANING SOLUTIONS',
    heroSubtitle: "Comprehensive Restaurant Cleaning in UAE – Spotless and Hygienic Dining",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'F&B Hygiene Specialists',
    aboutHeading1: 'Exceed Health Codes:',
    aboutHeading2: 'Master Kitchen & Dining Hygiene',
    description: "Keeping your restaurant clean and sanitary is essential for both customer satisfaction and health compliance. At Homework Cleaning Services LLC, we specialize in providing comprehensive restaurant cleaning services tailored to meet the unique needs of the foodservice industry. We ensure your establishment passes every inspection.",
    features: ['Dining Floor Deep Cleaning', 'Furniture & Table Sanitization', 'Kitchen Equipment Degreasing', 'Prep Station Hygiene Protocol', 'Restroom Fixture Sterilization', 'Bar & Counter Sanitization'],
    ctaTitle: 'Keep Your Restaurant Pristine',
    ctaSubtitle: 'Contact us today for professional restaurant cleaning services.',
  },
  'water-tank-cleaning': {
    name: 'Water Tank Cleaning',
    badge: 'Essential Health Hygiene',
    heroTitleLine1: 'PURE WATER',
    heroTitleLine2: 'STORAGE SOLUTIONS',
    heroSubtitle: "Top-Quality Water Tank Cleaning in UAE – Safe and Clean Water",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Water Hygiene Specialists',
    aboutHeading1: 'Protect Your Health:',
    aboutHeading2: 'Tank Sanitization Experts',
    description: "Water tanks are an essential part of many homes and businesses, providing a vital resource for daily needs. Dirty water tanks can harbor harmful bacteria, viruses, and parasites. At Homework Cleaning Services LLC, we provide municipality-standard disinfection to ensure your family or staff have access to crisp, safe drinking water.",
    features: ['Water Pathogen Risk Assessment', 'Discolouration & Contamination Check', 'Full Tank Evacuation & Draining', 'Food-Grade Chemical Sanitizing', 'Quarterly Inspection Programme', 'Filtration Upgrade Consultation'],
    ctaTitle: 'Ensure Clean, Safe Water',
    ctaSubtitle: 'Contact us today for professional water tank cleaning services.',
  },
  'swimming-pool-cleaning': {
    name: 'Swimming Pool Cleaning',
    badge: 'Premium Aquatic Care',
    heroTitleLine1: 'CRYSTAL CLEAR',
    heroTitleLine2: 'DIVE-IN WATERS',
    heroSubtitle: "Professional Swimming Pool Cleaning in UAE – Dive into Clean Waters",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Pool Care Specialists',
    aboutHeading1: 'Maintain Your Oasis:',
    aboutHeading2: 'Aquatic Health Mastery',
    description: "Keeping your swimming pool clean and well-maintained is essential for enjoying a safe and refreshing swim. At Homework Cleaning Services LLC, we offer comprehensive swimming pool cleaning services to ensure your pool is crystal clear and inviting using advanced equipment and eco-friendly products.",
    features: ['Surface Skimming & Debris Removal', 'Precision Vacuum Cleaning', 'Advanced Water Chemistry Testing', 'Chemical Balancing & Treatment', 'Targeted Algae Killing & Brushing', 'Pump & Filter Circulation Check'],
    ctaTitle: 'Dive Into a Crystal Clear Pool',
    ctaSubtitle: 'Contact us today for professional swimming pool cleaning services.',
  },
  'gym-deep-cleaning': {
    name: 'Gym Deep Cleaning',
    badge: 'Fitness Facility Specialist',
    heroTitleLine1: 'HYGIENIC GYM',
    heroTitleLine2: 'ENVIRONMENTS',
    heroSubtitle: "Sanitized Gym Deep Cleaning in UAE – Protect Your Members & Reputation",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Gym Hygiene Specialists',
    aboutHeading1: 'Member Safety First:',
    aboutHeading2: 'Fitness Hygiene Mastery',
    description: "A clean and hygienic gym is crucial for the health and satisfaction of your members. In a high-moisture environment, pathogens can spread rapidly without professional intervention. At Homework Cleaning Services LLC, we specialize in comprehensive gym cleaning services tailored to the unique needs of fitness facilities.",
    features: ['Gym Equipment Sanitization', 'Rubber Floor Deep Scrubbing', 'Fixture & Locker Sterilization', 'Restroom & Shower Deep Clean', 'Studio Floor Machine Cleaning', 'Reception & Front Desk Detailing'],
    ctaTitle: 'Maintain a Hygienic Gym',
    ctaSubtitle: 'Contact us today for professional gym deep cleaning services.',
  },
  'facade-cleaning': {
    name: 'Facade Cleaning',
    badge: 'Exterior Restoration Specialists',
    heroTitleLine1: 'IMPRESSIVE',
    heroTitleLine2: 'BUILDING EXTERIORS',
    heroSubtitle: "Sparkling Facade Cleaning in UAE – First Impressions That Last",
    heroImage: '',
    sectionImage: '',
    specialistLabel: 'Facade Specialists',
    aboutHeading1: 'Pristine Skylines:',
    aboutHeading2: 'Master Facade Cleaning',
    description: "First impressions matter, and a clean facade can make a significant difference. At Homework Cleaning Services LLC, we specialize in professional facade cleaning services to ensure your building's exterior looks pristine and inviting. Our experienced team uses advanced techniques and eco-friendly products to remove dirt, grime, and stains.",
    features: ['High-Pressure Water Jet Washing', 'Graffiti Eradication', 'Streak-Free Window Cleaning', 'Regular Maintenance Plans', 'Rope Access Mastery', 'Structural Condition Inspection'],
    ctaTitle: "Restore Your Building's Facade",
    ctaSubtitle: 'Contact us today for professional facade cleaning services.',
  },
}

const FALLBACK: ServicePageContent = {
  name: 'Professional Cleaning Service',
  badge: 'Professional Cleaning',
  heroTitleLine1: 'PROFESSIONAL',
  heroTitleLine2: 'CLEANING SERVICE',
  heroSubtitle: "UAE's Premier Cleaning Services – Quality You Can Trust",
  heroImage: '',
  sectionImage: '',
  specialistLabel: 'Cleaning Specialists',
  aboutHeading1: 'Expert Professional',
  aboutHeading2: 'Cleaning Service',
  description: "At Homework Cleaning Services LLC, we offer comprehensive cleaning services tailored to your specific needs. Our experienced team uses advanced techniques and eco-friendly products to ensure your space stays spotless.",
  features: ['Professional Cleaning Team', 'Eco-Friendly Products', 'Quality Guaranteed', 'Flexible Scheduling', 'Trained Specialists', 'Customer Satisfaction'],
  ctaTitle: 'Book a Professional Clean',
  ctaSubtitle: 'Contact us today for professional cleaning services.',
}

function SkeletonImg({
  src,
  alt,
  imgClassName,
  skeletonClassName,
}: {
  src: string
  alt: string
  imgClassName?: string
  skeletonClassName?: string
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {(!loaded || !src) && (
        <div className={`absolute inset-0 animate-pulse ${skeletonClassName ?? 'bg-slate-200'}`} />
      )}
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          loading="lazy"
          className={`${imgClassName ?? ''} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
      )}
    </>
  )
}

export default function ServicePageTemplate({ slug }: { slug: string }) {
  const base = SERVICE_DEFAULTS[slug] ?? FALLBACK
  // Render immediately with built-in defaults; Firestore overrides merge silently in background
  const [content, setContent] = useState<ServicePageContent>(base)

  useEffect(() => {
    const fetchOverrides = async () => {
      const cacheKey = `service-page:${slug}`
      const cacheTtlMs = 10 * 60 * 1000

      try {
        const cachedRaw = window.sessionStorage.getItem(cacheKey)
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as { timestamp: number; data: Partial<ServicePageContent> }
          if (Date.now() - cached.timestamp < cacheTtlMs) {
            setContent(prev => ({ ...prev, ...cached.data }))
            return
          }
        }
      } catch {
        // Ignore cache read failures
      }

      try {
        const docRef = doc(db, 'service-pages', slug)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setContent((prev) => {
            const mergedData = {
              ...prev,
              ...Object.fromEntries(
                Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== '')
              ),
              // merge features array if present and non-empty
              ...(Array.isArray(data.features) && data.features.length > 0 ? { features: data.features } : {}),
            }

            try {
              window.sessionStorage.setItem(
                cacheKey,
                JSON.stringify({ timestamp: Date.now(), data: mergedData })
              )
            } catch {
              // Ignore cache write failures
            }

            return mergedData
          })
        }
      } catch {
        // use built-in defaults on error
      }
    }
    fetchOverrides()
  }, [slug])

  const fallbackImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=80'
  const fallbackAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
  const heroImage = content.heroImage || content.sectionImage || fallbackImage
  const detailsImage = content.sectionImage || content.heroImage || fallbackImage
  const serviceName = content.name || 'Professional Cleaning Service'

  const trustStatIcons = [Users, Star, UserCheck, MapPin]
  const trustStatItems = content.trustStats?.length
    ? content.trustStats
    : [
        { label: 'Satisfied Clients', value: '20,000+' },
        { label: 'Service Rating', value: '4.9/5.0' },
        { label: 'Expert Cleaners', value: '250+' },
        { label: 'City Coverage', value: '100%' },
      ]
  const trustStats = trustStatItems.map((stat, i) => ({
    ...stat,
    icon: trustStatIcons[i % trustStatIcons.length],
  }))

  const offerCardIcons = [Sparkles, Wind, ShieldCheck, Activity]
  const offerCards = (content.offerCards?.length
    ? content.offerCards
    : content.features.slice(0, 4).map((item) => ({
        title: item.length > 42 ? `${item.slice(0, 39)}...` : item,
      }))
  ).map((card, i) => ({ ...card, icon: offerCardIcons[i % offerCardIcons.length] }))

  const processStepIcons = [BadgeCheck, Wind, ShieldCheck, Wrench]
  const processSteps = (content.processSteps?.length
    ? content.processSteps
    : [
        {
          title: 'Inspection',
          detail: `We assess your ${serviceName.toLowerCase()} requirements and identify critical treatment areas before work begins.`,
        },
        {
          title: 'Preparation',
          detail: 'Our team secures the workspace, protects surfaces, and prepares tools for an efficient, low-disruption process.',
        },
        {
          title: 'Execution',
          detail: `We perform a detailed ${serviceName.toLowerCase()} process using professional equipment and approved techniques.`,
        },
        {
          title: 'Final Verification',
          detail: 'We complete quality checks, ensure finishing standards, and share post-service care recommendations.',
        },
      ]
  ).map((step, i) => ({ ...step, icon: processStepIcons[i % processStepIcons.length] }))

  const serviceAreas = content.serviceAreas?.length
    ? content.serviceAreas
    : ['Downtown Dubai', 'Dubai Marina', 'Business Bay', 'Jumeirah', 'Al Barsha', 'JVC', 'Deira', 'Mirdif']

  const whyChoosePoints = content.whyChoosePoints?.length
    ? content.whyChoosePoints
    : [
        `Certified specialists for ${serviceName.toLowerCase()} with Dubai-ready standards.`,
        'Transparent workflow with clear communication from booking to completion.',
        'Advanced tools and safe products for reliable, long-lasting results.',
        'Flexible scheduling, fast response, and minimal disruption during service.',
        'Quality-first delivery backed by consistent support after completion.',
      ]

  const faqs = content.faqs?.length
    ? content.faqs
    : [
        {
          q: `How often should I book ${serviceName.toLowerCase()}?`,
          a: `For most Dubai homes and offices, scheduling ${serviceName.toLowerCase()} every 6 to 12 months helps maintain hygiene, performance, and long-term asset condition.`,
        },
        {
          q: `How long does ${serviceName.toLowerCase()} take?`,
          a: 'Typical appointments take 2 to 6 hours depending on property size, condition, and scope of work required.',
        },
        {
          q: 'Is the service safe for children and pets?',
          a: 'Yes. We use controlled methods and approved products suitable for occupied residential and commercial environments.',
        },
        {
          q: 'Do you provide service across all Dubai areas?',
          a: 'Yes, we provide city-wide coverage with flexible appointments for apartments, villas, and commercial spaces.',
        },
      ]

  const reviews = content.reviews?.length
    ? content.reviews
    : [
        {
          name: 'Sarah Jenkins',
          text: `Excellent ${serviceName.toLowerCase()} experience. The team was punctual, professional, and delivered visible results with great attention to detail.`,
          area: 'Palm Jumeirah',
          avatar: fallbackAvatar,
          date: '2 weeks ago',
        },
        {
          name: 'Mohamed Al-Fayed',
          text: 'Very organized service from start to finish. The crew explained each step clearly and completed the work to a high standard.',
          area: 'Downtown Dubai',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
          date: '1 month ago',
        },
        {
          name: 'Emma Robertson',
          text: 'Impressive quality and smooth communication. I would definitely book again and recommend this service for families in Dubai.',
          area: 'Dubai Marina',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
          date: '5 days ago',
        },
      ]

  const googleBusinessIcon = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path fill="#EA4335" d="M12 11V8h10a10 10 0 0 1 .2 2c0 6-4 10-10.2 10A10 10 0 1 1 12 2c2.7 0 5 .9 6.8 2.5l-2.8 2.8A5.9 5.9 0 0 0 12 5a6 6 0 0 0 0 12c3 0 5-1.7 5.6-4H12Z" />
      <path fill="#4285F4" d="M3.7 7.1A10 10 0 0 1 12 2c2.7 0 5 .9 6.8 2.5l-2.8 2.8A5.9 5.9 0 0 0 12 5a6 6 0 0 0-5.4 3.3Z" />
      <path fill="#FBBC05" d="M2 12c0-1.7.4-3.3 1.2-4.9l3.4 1.2A6.2 6.2 0 0 0 6 12c0 1.3.4 2.5 1 3.5l-3.4 1.3A10 10 0 0 1 2 12Z" />
      <path fill="#34A853" d="M12 22a10 10 0 0 1-8.4-4.6L7 15.5A6 6 0 0 0 12 17c3 0 5-1.7 5.6-4H12v-2h10a10 10 0 0 1 .2 2c0 6-4 10-10.2 10Z" />
    </svg>
  )

  return (
    <main className="flex flex-col overflow-hidden bg-white selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative isolate flex min-h-[74vh] items-center overflow-hidden bg-[#08172b] text-white md:min-h-[82vh]">
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <SkeletonImg
              src={heroImage}
              alt={content.name}
              imgClassName="h-full w-full object-cover opacity-35"
              skeletonClassName="bg-slate-900"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-[#08172b] via-[#0a2037]/88 to-[#0a2037]/30" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#08172b]" />
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#039ED9]/20 blur-3xl" />
          <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {content.badge}
              </span>

              <h1 className="mb-5 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
                {content.heroTitleLine1}
                <br />
                <span className="bg-linear-to-r from-[#7BD7FF] via-[#3FB5F4] to-primary bg-clip-text text-transparent">
                  {content.heroTitleLine2}
                </span>
              </h1>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
                {content.heroSubtitle}
              </p>

              <div className="flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
                <a
                  href="/book-service"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#039ED9] to-primary px-7 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_35px_rgba(236,72,153,0.32)] sm:text-sm"
                >
                  Book Premium Service
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href="tel:+971507177059"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/8 px-7 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/14 sm:text-sm"
                >
                  <PhoneCall className="h-4 w-4 text-primary" />
                  +971 50 717 7059
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badge */}
      <section className="relative z-20 -mt-8 px-4 pb-8 md:-mt-10 md:pb-10">
        <div className="container mx-auto sm:px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/20 px-4 py-5 shadow-[0_25px_60px_rgba(3,158,217,0.4)] backdrop-blur-[2px] sm:px-6 sm:py-6 md:px-10"
            style={{ backgroundImage: 'linear-gradient(135deg, #039ED9 0%, var(--primary) 100%)' }}
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3 text-center text-white/90 sm:gap-4">
              {trustStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-3 py-3 sm:gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-xl font-black text-white sm:text-2xl">{stat.value}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/85 sm:text-[11px]">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#f7fbff] to-[#eef5ff] py-14 sm:py-16 md:py-20 xl:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_25%,rgba(3,158,217,0.18)_0%,transparent_42%)]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 space-y-6 lg:order-1"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary shadow-sm">
                {content.specialistLabel}
              </span>

              <h2 className="text-3xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                {content.aboutHeading1}
                <br />
                <span className="text-primary">{content.aboutHeading2}</span>
              </h2>

              <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
                {content.description}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {content.features.slice(0, 6).map((item, i) => (
                  <div key={`${item}-${i}`} className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-bold leading-relaxed text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-white p-2 shadow-2xl sm:rounded-[2.5rem]">
                <div className="relative aspect-4/3 overflow-hidden rounded-4xl sm:rounded-[2rem]">
                  <SkeletonImg
                    src={detailsImage}
                    alt={content.name}
                    imgClassName="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    skeletonClassName="bg-slate-200"
                  />
                  <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Included Services */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-16 md:py-20 xl:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px]">
              What Is Included
            </span>
            <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Service Deliverables
            </h3>
            <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-linear-to-r from-[#039ED9] to-primary" />
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {content.features.map((feature, idx) => (
              <article
                key={`${feature}-${idx}`}
                className="group rounded-3xl border border-slate-200 bg-slate-50/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-[0_20px_40px_-25px_rgba(236,72,153,0.4)]"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-linear-to-br group-hover:from-[#039ED9] group-hover:to-primary group-hover:text-white">
                  <span className="text-xs font-black">{`${idx + 1}`.padStart(2, '0')}</span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-slate-800">{feature}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Cards */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-16 md:py-20 xl:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
            <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px]">
              What We Offer
            </span>
            <h3 className="max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Premium Service Coverage
            </h3>
            <div className="mt-6 h-1 w-20 rounded-full bg-linear-to-r from-[#039ED9] to-primary" />
          </div>

          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {offerCards.map((card) => {
              const Icon = card.icon
              return (
                <article
                  key={card.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_20px_45px_-22px_rgba(236,72,153,0.35)]"
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-50/50 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary/10" />
                  <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#039ED9] to-primary text-white shadow-lg shadow-primary/25">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h4 className="relative z-10 text-lg font-black text-slate-900">{card.title}</h4>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quality Showcase */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-[#1a2440] py-14 text-white sm:py-16 md:py-20 xl:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_78%_20%,rgba(236,72,153,0.28)_0%,transparent_40%)]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
            <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary/90 sm:text-[11px]">Quality You Can See</span>
            <h3 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">Real <span className="italic text-primary">Results</span></h3>
            <p className="mt-4 max-w-xl text-slate-300">
              Explore service quality from real projects with consistent standards and detail-focused execution.
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:border-primary/35 hover:bg-white/8 sm:rounded-[3rem]">
              <div className="relative aspect-video bg-slate-950/40">
                <SkeletonImg
                  src={detailsImage}
                  alt={`${content.name} quality results`}
                  imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  skeletonClassName="bg-slate-800"
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-sm font-medium leading-relaxed text-slate-300">
                  Real service outcomes captured from professional {serviceName.toLowerCase()} projects.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-white to-slate-50 py-14 sm:py-16 md:py-20 xl:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-16 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left">
            <div>
              <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px]">Local Presence</span>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Dubai Area <span className="text-primary">Coverage</span>
              </h3>
            </div>
            <div className="mt-8 md:mt-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-sky-100 bg-white text-primary shadow-xl shadow-primary/10 ring-8 ring-sky-50/50">
                <MapPin className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-[3rem]">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-65 sm:min-h-90 lg:min-h-105">
                <iframe
                  title="Dubai service coverage map"
                  src="https://www.google.com/maps?q=Dubai,UAE&z=11&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute h-full w-full grayscale transition-all duration-700 hover:grayscale-0"
                />
              </div>
              <div className="p-6 sm:p-7 lg:p-10 xl:p-12">
                <h4 className="mb-8 text-xl font-black text-slate-900 sm:text-2xl">Marked Service Hubs</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {serviceAreas.map((area) => (
                    <div key={area} className="group flex items-center gap-4 transition-all duration-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-50 bg-sky-50/50 text-[#039ED9] transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                        <MapPin className="h-4 w-4 shrink-0" />
                      </div>
                      <span className="font-bold text-slate-700 transition-colors duration-300 group-hover:text-primary">{area}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 rounded-[2rem] bg-linear-to-r from-[#039ED9] to-primary p-6 text-white shadow-2xl shadow-primary/30 sm:mt-12 sm:p-7 lg:p-8">
                  <p className="text-sm font-bold uppercase tracking-widest opacity-75">Support Hotline</p>
                  <p className="mt-1 text-xl font-black sm:text-2xl">Fast Dispatch Dubai Wide</p>
                  <a href="/book-service" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-primary transition-all duration-300 hover:scale-105">
                    Check Availability
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="relative overflow-hidden bg-linear-to-r from-[#0a3a70] via-[#0c5a9b] to-primary py-14 text-white sm:py-16 md:py-20 xl:py-24">
        <div className="absolute inset-0 opacity-15 [background:radial-gradient(circle_at_20%_15%,#1e88e5_0%,transparent_35%)]" />
        <div className="container relative z-10 mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative mx-auto w-full max-w-sm sm:max-w-xl">
            <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl">
              <div className="relative aspect-4/3">
                <SkeletonImg
                  src={heroImage}
                  alt={`Why choose ${content.name}`}
                  imgClassName="h-full w-full object-cover"
                  skeletonClassName="bg-slate-700"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#1b3f71] sm:px-5 sm:text-[11px]">
              Why Dubai Residents Choose Homework UAE
            </div>

            <h3 className="mt-4 max-w-3xl text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl xl:text-6xl">
              Why Dubai Residents Choose Homework UAE
            </h3>

            <ul className="mt-7 space-y-3 text-base leading-relaxed text-white/95 sm:text-lg">
              {whyChoosePoints.map((point, i) => (
                <li key={`${point}-${i}`} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white">
                    <CircleCheck className="h-4 w-4" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
              <a href="tel:+971507177059" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#1a3c6b] transition hover:bg-slate-100 sm:text-sm">
                Call +971 50 717 7059
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/book-service" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#1a3c6b] transition hover:bg-slate-100 sm:text-sm">
                Book Online
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-white to-slate-50/70 py-14 sm:py-16 md:py-20 xl:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px]">The Blueprint</span>
            <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">Our Workflow <span className="text-primary">Protocol</span></h3>
            <div className="mt-6 h-1 w-20 rounded-full bg-linear-to-r from-[#039ED9] to-primary" />
          </div>

          <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {processSteps.map((step, idx) => {
              const Icon = step.icon
              return (
                <article key={`${step.title}-${idx}`} className="group relative rounded-3xl border border-slate-200 bg-slate-50/80 p-6 transition-all duration-500 hover:border-primary/25 hover:bg-white hover:shadow-[0_20px_40px_-24px_rgba(236,72,153,0.45)]">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-xl shadow-primary/15 ring-1 ring-primary/10 transition-colors duration-500 group-hover:bg-linear-to-br group-hover:from-[#039ED9] group-hover:to-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-4xl font-black italic text-slate-200 transition-colors duration-500 group-hover:text-primary/20">0{idx + 1}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900">{step.title}</h4>
                  <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-600">{step.detail}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-100 py-14 sm:py-16 md:py-20 xl:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 sm:gap-12 lg:gap-14 lg:flex-row">
            <div className="lg:w-1/2">
              <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px]">The Experts</span>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">Elite Service <span className="text-primary">Technicians</span></h3>
              <p className="mt-6 text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
                Our technicians are certified specialists, trained to deliver consistent results across residential and commercial environments.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  { icon: Timer, label: 'Fast Dispatch', detail: 'Transparent service timelines for your schedule.' },
                  { icon: Activity, label: 'Performance Audit', detail: 'Pre and post quality checks for reliable outcomes.' },
                  { icon: ShieldCheck, label: 'Clinical Safety', detail: 'Safe methods aligned with approved hygiene protocols.' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex items-center gap-4 rounded-3xl border border-slate-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{item.label}</p>
                        <p className="text-xs font-medium text-slate-500">{item.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="relative lg:w-1/2">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-blue-100 shadow-2xl sm:rounded-[4rem]">
                <SkeletonImg
                  src={detailsImage}
                  alt={`${content.name} team`}
                  imgClassName="h-full w-full object-cover"
                  skeletonClassName="bg-slate-200"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-primary/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-[#1e2340] py-14 text-white sm:py-16 md:py-20 xl:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 flex flex-col items-center text-center sm:mb-20">
            <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary/90 sm:text-[11px]">Clear Answers</span>
            <h3 className="text-3xl font-black italic tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">Technical FAQ</h3>
            <div className="mt-6 h-1.5 w-24 rounded-full bg-linear-to-r from-[#039ED9] to-primary" />
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {faqs.map((item, idx) => (
              <details key={`${item.q}-${idx}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-500 open:border-primary/35 open:bg-white/10">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-black tracking-tight sm:p-6 sm:text-lg md:text-xl lg:p-8">
                  {item.q}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary transition-transform duration-500 group-open:rotate-180">
                    <ArrowRight className="h-5 w-5 rotate-90" />
                  </div>
                </summary>
                <div className="px-5 pb-5 text-slate-300 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                  <div className="mb-6 h-px w-full bg-white/5" />
                  <p className="text-base font-medium leading-relaxed sm:text-[17px]">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-white to-slate-50/80 py-14 sm:py-16 md:py-20 xl:py-24">
        <div className="container mx-auto px-4 text-center sm:px-6">
          <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-[11px]">Google Reviews</span>
          <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">What Our <span className="text-primary">Customers</span> Say</h3>

          <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review, idx) => (
              <article key={`${review.name}-${idx}`} className="flex w-full flex-col rounded-3xl border border-slate-200/70 bg-white p-6 text-left shadow-xs transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-[0_20px_45px_-24px_rgba(236,72,153,0.35)] sm:p-7 md:p-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} viewBox="0 0 24 24" className="h-5 w-5 fill-[#fbbc05] text-[#fbbc05]">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{review.date}</span>
                </div>
                <p className="mb-8 text-[15px] font-medium leading-relaxed text-slate-600 sm:mb-10">"{review.text}"</p>
                <div className="mt-auto flex items-center gap-3 border-t border-slate-200 pt-6 sm:gap-4 sm:pt-8">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-blue-50 ring-offset-2 sm:h-14 sm:w-14">
                    <SkeletonImg
                      src={review.avatar || fallbackAvatar}
                      alt={review.name}
                      imgClassName="h-full w-full object-cover"
                      skeletonClassName="bg-slate-200"
                    />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{review.name}</p>
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary">{review.area}</p>
                  </div>
                  <div className="ml-auto">
                    {googleBusinessIcon}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-linear-to-r from-[#0a3a70] via-[#0c5a9b] to-primary py-14 text-white sm:py-16 md:py-20 xl:py-24">
        <div className="absolute inset-0 opacity-15 [background:radial-gradient(circle_at_20%_15%,#1e88e5_0%,transparent_35%)]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl rounded-[2.2rem] border border-white/15 bg-white/8 px-6 py-10 text-center backdrop-blur-sm sm:px-10"
          >
            <h4 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              {content.ctaTitle}
            </h4>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/80 sm:text-lg">
              {content.ctaSubtitle}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="/book-service"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-[#1a3c6b] transition hover:bg-slate-100 sm:text-sm"
              >
                Book Online
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:+971507177059"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-transparent px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/10 sm:text-sm"
              >
                Call +971 50 717 7059
                <PhoneCall className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
