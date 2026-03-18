'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'

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

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">
              {content.badge}
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              {content.heroTitleLine1} <br />
              <span className="text-primary italic">{content.heroTitleLine2}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              {content.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1 rounded-[3rem] overflow-hidden shadow-3xl group aspect-4/3"
            >
              <SkeletonImg
                src={content.sectionImage}
                alt={content.name}
                imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                skeletonClassName="bg-slate-200"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-3 text-primary">
                <span className="text-sm font-black uppercase tracking-widest">{content.specialistLabel}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                {content.aboutHeading1} <br />
                <span className="text-primary italic">{content.aboutHeading2}</span>
              </h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed">
                {content.description}
              </p>

              <div className="grid gap-4">
                {content.features.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700 font-bold">{item}</span>
                  </div>
                ))}
              </div>

              <motion.a
                href="/book-service"
                className="inline-flex items-center gap-4 bg-primary px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-2xl shadow-primary/30 hover:bg-pink-600 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                Book Now <ArrowRight className="h-5 w-5" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-950 text-white relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-slate-950 rounded-[3.5rem] text-center relative overflow-hidden group container mx-auto px-4 max-w-3xl"
        >
          <div className="relative z-10">
            <h4 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
              {content.ctaTitle}
            </h4>
            <p className="text-slate-400 text-lg mb-10 font-bold">{content.ctaSubtitle}</p>
            <a
              href="/book-service"
              className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-pink-700 transition-all inline-flex items-center gap-3"
            >
              Book Now <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
