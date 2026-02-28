#!/usr/bin/env python3
"""Script to regenerate all service pages with the office-deep-cleaning template design."""

import os

BASE = "/Users/macbookpro/Desktop/homework_01/app/(public)/services"

def h1_html(lines):
    """Build h1 inner HTML from lines list. Lines prefixed with 'italic:' become <span>."""
    parts = []
    for i, line in enumerate(lines):
        if line.startswith("italic:"):
            parts.append(f'<span className="text-primary italic">{line[7:]}</span>')
        else:
            parts.append(line)
    # Join with <br /> between normal lines and a space before italic continuation on same visual line
    result = ""
    for i, (line, part) in enumerate(zip(lines, parts)):
        if i == 0:
            result = part
        else:
            prev_is_italic = lines[i-1].startswith("italic:")
            curr_is_italic = line.startswith("italic:")
            if not prev_is_italic and not curr_is_italic:
                result += " <br />\n              " + part
            elif not prev_is_italic and curr_is_italic:
                result += " <br />\n              " + part
            else:
                result += " " + part
    return result

def h2_html(lines):
    """Build h2 inner HTML."""
    parts = []
    for line in lines:
        if line.startswith("italic:"):
            parts.append(f'<span className="text-primary italic">{line[7:]}</span>')
        else:
            parts.append(line)
    if len(parts) == 1:
        return parts[0]
    result = parts[0]
    for i, (line, part) in enumerate(zip(lines[1:], parts[1:]), 1):
        prev_is_italic = lines[i-1].startswith("italic:")
        curr_is_italic = lines[i].startswith("italic:")
        if not prev_is_italic:
            result += " <br />\n                " + part
        else:
            result += " " + part
    return result

def cta_h4_html(lines):
    """Build CTA h4 inner HTML."""
    parts = []
    for line in lines:
        if line.startswith("italic:"):
            parts.append(f'<span className="text-primary italic">{line[7:]}</span>')
        else:
            parts.append(line)
    return " ".join(parts)

def checklist_str(items):
    """Build checklist items array as a string."""
    lines = []
    for item in items:
        lines.append(f'                  "{item}",')
    return "\n".join(lines)

def make_page(slug, component, hero_img, hero_badge, h1_lines, hero_desc,
              icon, badge_label, h2_lines, main_desc, checklist, details_img,
              cta_h4_lines, cta_desc, book_btn):
    h1 = h1_html(h1_lines)
    h2 = h2_html(h2_lines)
    cta_h4 = cta_h4_html(cta_h4_lines)
    items = checklist_str(checklist)
    # Determine alt text from slug
    alt = slug.replace("-", " ").title()

    content = f'''"use client"

import {{ motion }} from 'framer-motion'
import {{ CheckCircle2, ArrowRight, {icon} }} from 'lucide-react'

export default function {component}() {{
  return (
    <div className="flex flex-col overflow-hidden">
      {{/* Hero Section */}}
      <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="{hero_img}"
            alt="{alt}"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/20 to-slate-950" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{{{ opacity: 0, y: 30 }}}}
            animate={{{{ opacity: 1, y: 0 }}}}
            transition={{{{ duration: 0.8 }}}}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">
              {hero_badge}
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              {h1}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              {hero_desc}
            </p>
          </motion.div>
        </div>
      </section>

      {{/* Details Section */}}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{{{ opacity: 0, scale: 0.8 }}}}
              whileInView={{{{ opacity: 1, scale: 1 }}}}
              viewport={{{{ once: true }}}}
              className="relative order-2 lg:order-1 rounded-[3rem] overflow-hidden shadow-3xl group"
            >
              <img
                src="{details_img}"
                alt="{alt}"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              initial={{{{ opacity: 0, x: 50 }}}}
              whileInView={{{{ opacity: 1, x: 0 }}}}
              viewport={{{{ once: true }}}}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-3 text-primary">
                <{icon} className="h-6 w-6" />
                <span className="text-sm font-black uppercase tracking-widest">{badge_label}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                {h2}
              </h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed">
                {main_desc}
              </p>

              <div className="grid gap-4">
                {{[
{items}
                ].map((item, i) => (
                  <div key={{i}} className="flex items-center gap-4 group">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700 font-bold">{{item}}</span>
                  </div>
                ))}}
              </div>

              <motion.a
                href="/book-service"
                className="inline-flex items-center gap-4 bg-primary px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-2xl shadow-primary/30 hover:bg-pink-600 transition-colors"
                whileTap={{{{ scale: 0.95 }}}}
              >
                {book_btn} <ArrowRight className="h-5 w-5" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {{/* CTA Section */}}
      <section className="py-24 bg-slate-950 text-white relative">
        <motion.div
          initial={{{{ opacity: 0, y: 30 }}}}
          whileInView={{{{ opacity: 1, y: 0 }}}}
          viewport={{{{ once: true }}}}
          className="mt-20 p-12 bg-slate-950 rounded-[3.5rem] text-center relative overflow-hidden group container mx-auto px-4 max-w-3xl"
        >
          <div className="relative z-10">
            <h4 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">{cta_h4}</h4>
            <p className="text-slate-400 text-lg mb-10 font-bold">{cta_desc}</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="https://homeworkuae.com/book-service" className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-pink-700 transition-all flex items-center gap-3">
                Book Now
              </a>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}}
'''
    return content

# ─── Page definitions ────────────────────────────────────────────────────────

pages = [
    dict(
        slug="ac-coil-cleaning",
        component="ACCoilCleaning",
        hero_img="https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Efficiency Experts",
        h1_lines=["AC COIL", "italic:CLEANING"],
        hero_desc="Efficient AC Coil Cleaning in UAE – Enhanced Cooling Efficiency",
        icon="Activity",
        badge_label="AC Coil Specialists",
        h2_lines=["Keep Your Cool: A Comprehensive", "italic:Guide to AC Coil Cleaning"],
        main_desc="Keeping your air conditioning (AC) system in top shape is essential for comfort, efficiency, and health. One important yet often overlooked component is the AC coils. At Homework UAE, we provide deep coil cleaning using hospital-grade chemicals to restore your system's peak performance and reduce energy bills.",
        checklist=["Energy Waste Diagnosis", "Health Concerns Assessment", "Evaporator Coil Cleaning", "Chemical Deep Scrubbing", "Regular Maintenance Schedule", "Energy Savings Verification"],
        details_img="https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Keep Your AC Running at", "italic:Peak Efficiency"],
        cta_desc="Contact us today for professional AC coil cleaning in the UAE.",
        book_btn="Book AC Coil Clean",
    ),
    dict(
        slug="ac-duct-cleaning",
        component="ACDuctCleaning",
        hero_img="https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Breathable Excellence",
        h1_lines=["AC DUCT", "italic:CLEANING"],
        hero_desc="Breathe Easy with UAE's Professional AC Duct Cleaning Services",
        icon="Wind",
        badge_label="Air Quality Specialists",
        h2_lines=["Breathe Easy: Your Ultimate", "italic:Guide to AC Duct Cleaning"],
        main_desc="Cleaning your AC ducts is more than just a chore—it's essential for your health and your home's efficiency. Many people overlook this necessary task, only to pay the price later. At Homework UAE, we prioritize your indoor air quality by removing dust, allergens, and mold from your ventilation system using hospital-grade disinfectants.",
        checklist=["Hidden Pollutant Removal", "Allergy & Asthma Relief", "Energy Efficiency Restoration", "Advanced Air Scrubbing", "Annual Maintenance Schedule", "Filter Replacement Guidance"],
        details_img="https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Breathe", "italic:Cleaner Air Today"],
        cta_desc="Contact us today for professional AC duct cleaning services.",
        book_btn="Book AC Duct Clean",
    ),
    dict(
        slug="apartment-deep-cleaning",
        component="ApartmentDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Elite Residential Care",
        h1_lines=["APARTMENT", "italic:DEEP CLEANING"],
        hero_desc="Top Apartment Deep Cleaning in UAE – Sparkling Results Every Time",
        icon="Building2",
        badge_label="Apartment Specialists",
        h2_lines=["Complete Apartment", "italic:Deep Sanitization"],
        main_desc="Are you looking to give your apartment a thorough, top-to-bottom clean? Homework Cleaning Services LLC is here to provide exceptional apartment deep cleaning services. Our professional team uses advanced cleaning techniques and eco-friendly products to ensure every nook and cranny of your apartment is spotless.",
        checklist=["Full Dusting of All Surfaces", "Floor Vacuuming & Mopping", "Windows & Mirror Cleaning", "Bathroom Deep Sanitization", "Kitchen Appliance Cleaning", "Balcony & Outdoor Areas"],
        details_img="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Transform Your", "italic:Apartment"],
        cta_desc="Contact us today for a professional apartment deep cleaning experience.",
        book_btn="Book Apartment Deep Clean",
    ),
    dict(
        slug="balcony-deep-cleaning",
        component="BalconyDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Deep Cleaning Services",
        h1_lines=["PRISTINE", "italic:BALCONY", "CLEANING"],
        hero_desc="Pristine Balcony Deep Cleaning in UAE – Enjoy Your Outdoor Space",
        icon="Wind",
        badge_label="Balcony Specialists",
        h2_lines=["Restore Your", "italic:Outdoor Living Space"],
        main_desc="A clean balcony can be a refreshing extension of your living space. At Homework Cleaning Services LLC, we offer comprehensive balcony cleaning services to ensure your balcony is spotless and inviting. Our experienced team uses advanced cleaning techniques and eco-friendly products to tackle dirt, grime, and stains.",
        checklist=["Thorough Sweeping & Vacuuming", "Deep Mopping & Scrubbing", "Railing & Handrail Polishing", "Outdoor Furniture Cleaning", "Window Glass & Frame Cleaning", "High-Pressure Surface Washing"],
        details_img="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Revitalize Your", "italic:Outdoor Space"],
        cta_desc="Contact us today for professional balcony deep cleaning services.",
        book_btn="Book Balcony Deep Clean",
    ),
    dict(
        slug="carpets-deep-cleaning",
        component="CarpetsDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1558317374-067df5f15430?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Deep Cleaning Services",
        h1_lines=["REVITALIZE", "italic:YOUR CARPETS"],
        hero_desc="Revitalize Your Carpets with UAE's Expert Deep Cleaning Services",
        icon="Layers",
        badge_label="Carpet Specialists",
        h2_lines=["Expert Carpet", "italic:Deep Extraction"],
        main_desc="Transform your carpets and extend their life with Homework Cleaning Services LLC's expert carpet deep cleaning services. Our team specializes in removing deep-seated dirt, stains, and allergens, restoring your carpets to their original beauty using state-of-the-art equipment and eco-friendly cleaning solutions.",
        checklist=["Detailed Carpet Inspection", "Pre-Treatment Application", "Hot Water Steam Extraction", "Dry Foam Cleaning Option", "Stubborn Stain Treatment", "Odour Neutralisation"],
        details_img="https://images.unsplash.com/photo-1558317374-067df5f15430?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Restore Your", "italic:Carpets"],
        cta_desc="Contact us today for professional carpet deep cleaning services.",
        book_btn="Book Carpet Deep Clean",
    ),
    dict(
        slug="facade-cleaning",
        component="FacadeCleaning",
        hero_img="https://images.unsplash.com/photo-1541888941295-1e3c83743aa1?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Exterior Restoration Specialists",
        h1_lines=["IMPRESSIVE", "italic:BUILDING EXTERIORS"],
        hero_desc="Sparkling Facade Cleaning in UAE – First Impressions That Last",
        icon="Building2",
        badge_label="Facade Specialists",
        h2_lines=["Pristine Skylines:", "italic:Master Facade Cleaning"],
        main_desc="First impressions matter, and a clean facade can make a significant difference. At Homework Cleaning Services LLC, we specialize in professional facade cleaning services to ensure your building's exterior looks pristine and inviting. Our experienced team uses advanced techniques and eco-friendly products to remove dirt, grime, and stains.",
        checklist=["High-Pressure Water Jet Washing", "Graffiti Eradication", "Streak-Free Window Cleaning", "Regular Maintenance Plans", "Rope Access Mastery", "Structural Condition Inspection"],
        details_img="https://images.unsplash.com/photo-1541888941295-1e3c83743aa1?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Restore Your", "italic:Building's Facade"],
        cta_desc="Contact us today for professional facade cleaning services.",
        book_btn="Book Facade Cleaning",
    ),
    dict(
        slug="garage-deep-cleaning",
        component="GarageDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1590674899484-d5640e25ed30?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Deep Cleaning Services",
        h1_lines=["PREMIUM", "italic:GARAGE CLEANING"],
        hero_desc="Organized and Clean Spaces in UAE – Restore Your Garage Mastery",
        icon="Warehouse",
        badge_label="Garage Specialists",
        h2_lines=["Transform Your", "italic:Garage Space"],
        main_desc="A clean and organized garage can make a world of difference in your home. At Homework Cleaning Services LLC, we specialize in providing thorough garage deep cleaning services to transform your garage into a spotless, functional space using advanced cleaning techniques and eco-friendly products.",
        checklist=["Walls, Ceilings & Cobwebs", "Oil & Grease Stain Removal", "Floor Mopping & Pressure Washing", "Shelves & Cabinet Cleaning", "Tool & Equipment Organization", "Pet Area Sanitization"],
        details_img="https://images.unsplash.com/photo-1590674899484-d5640e25ed30?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Transform Your", "italic:Garage"],
        cta_desc="Contact us today for professional garage deep cleaning services.",
        book_btn="Book Garage Deep Clean",
    ),
    dict(
        slug="grease-trap-cleaning",
        component="GreaseTrapCleaning",
        hero_img="https://images.unsplash.com/photo-1556911220-e150213ff337?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Maintenance & Compliance",
        h1_lines=["GREASE TRAP", "italic:CLEANING SOLUTIONS"],
        hero_desc="Reliable Grease Trap Cleaning in UAE – Keep Your Kitchen Flowing",
        icon="Droplets",
        badge_label="FOG Management Specialists",
        h2_lines=["Prevent Costly Clogs:", "italic:Active Grease Management"],
        main_desc="The accumulation of grease in your plumbing system can lead to significant problems. At Homework Cleaning Services LLC, we provide municipality-approved grease trap cleaning to protect your business from foul odors, plumbing disasters, and regulatory fines. Regular maintenance ensures your kitchen remains operational and hygienic.",
        checklist=["Slow Drain Identification", "Foul Odour Elimination", "Full Waste Vacuum Pumping", "High-Pressure Internal Washing", "Regular Maintenance Schedule", "Regulatory Compliance Assurance"],
        details_img="https://images.unsplash.com/photo-1556911220-e150213ff337?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Keep Your Grease Traps", "italic:Clean & Compliant"],
        cta_desc="Contact us today for professional grease trap cleaning services.",
        book_btn="Book Grease Trap Clean",
    ),
    dict(
        slug="grout-deep-cleaning",
        component="GroutDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Deep Cleaning Services",
        h1_lines=["REVITALIZE", "italic:YOUR TILES"],
        hero_desc="Expert Grout Cleaning Services in UAE – Fresh and Disinfected",
        icon="Grid3X3",
        badge_label="Grout Specialists",
        h2_lines=["Restore Your Tiles &", "italic:Grout Lines"],
        main_desc="Are you tired of dirty, stained grout lines diminishing the beauty of your tiles? Homework Cleaning Services LLC offers professional grout deep cleaning services to restore the original look of your tiled surfaces using advanced techniques and eco-friendly products.",
        checklist=["Thorough Grout Assessment", "Eco-Friendly Solution Application", "High-Pressure Steam Cleaning", "Manual Hard Stain Scrubbing", "Premium Grout Sealing", "Grout Colour Restoration"],
        details_img="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Restore Your", "italic:Grout & Tiles"],
        cta_desc="Contact us today for professional grout deep cleaning services.",
        book_btn="Book Grout Deep Clean",
    ),
    dict(
        slug="gym-deep-cleaning",
        component="GymDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Fitness Facility Specialist",
        h1_lines=["HYGIENIC GYM", "italic:ENVIRONMENTS"],
        hero_desc="Sanitized Gym Deep Cleaning in UAE – Protect Your Members & Reputation",
        icon="ShieldCheck",
        badge_label="Gym Hygiene Specialists",
        h2_lines=["Member Safety First:", "italic:Fitness Hygiene Mastery"],
        main_desc="A clean and hygienic gym is crucial for the health and satisfaction of your members. In a high-moisture environment, pathogens can spread rapidly without professional intervention. At Homework Cleaning Services LLC, we specialize in comprehensive gym cleaning services tailored to the unique needs of fitness facilities.",
        checklist=["Gym Equipment Sanitization", "Rubber Floor Deep Scrubbing", "Fixture & Locker Sterilization", "Restroom & Shower Deep Clean", "Studio Floor Machine Cleaning", "Reception & Front Desk Detailing"],
        details_img="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Maintain a", "italic:Hygienic Gym"],
        cta_desc="Contact us today for professional gym deep cleaning services.",
        book_btn="Book Gym Deep Clean",
    ),
    dict(
        slug="kitchen-deep-cleaning",
        component="KitchenDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1556911220-e150213ff337?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Deep Cleaning Services",
        h1_lines=["HYGIENIC", "italic:KITCHEN PURITY"],
        hero_desc="Immaculate Kitchen Deep Cleaning in UAE – Hygienic and Spotless",
        icon="Sparkles",
        badge_label="Kitchen Specialists",
        h2_lines=["Deep Kitchen", "italic:Sanitization & Degreasing"],
        main_desc="A sparkling clean kitchen is the heart of a happy home. At Homework Cleaning Services LLC, we offer comprehensive kitchen deep cleaning services to ensure your kitchen is not only visually spotless but also hygienically clean. Our professional team uses advanced techniques and eco-friendly products to tackle every corner.",
        checklist=["Cabinet Interior & Exterior Cleaning", "Stubborn Stain & Grease Removal", "Full Refrigerator & Freezer Clean", "Oven & Stovetop Deep Degreasing", "Descaling of Taps & Sinks", "Floor Machine Scrubbing"],
        details_img="https://images.unsplash.com/photo-1556911220-e150213ff337?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Transform Your", "italic:Kitchen"],
        cta_desc="Contact us today for a professional kitchen deep cleaning experience.",
        book_btn="Book Kitchen Deep Clean",
    ),
    dict(
        slug="kitchen-hood-cleaning",
        component="KitchenHoodCleaning",
        hero_img="https://images.unsplash.com/photo-1556911220-e150213ff337?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Safety & Compliance",
        h1_lines=["KITCHEN HOOD", "italic:HYGIENE EXPERTS"],
        hero_desc="Expert Kitchen Hood Cleaning in UAE – Safe and Hygienic Kitchens",
        icon="ShieldCheck",
        badge_label="Hood Cleaning Specialists",
        h2_lines=["Safety & Compliance:", "italic:Kitchen Exhaust Maintenance"],
        main_desc="When you think of a restaurant's kitchen, the focus usually goes to the food being prepared. Yet, one crucial component often overlooked is the kitchen hood. Regular cleaning of this system is not just good practice — it's essential for safety and compliance. Cooking equipment is the leading cause of restaurant fires, accounting for over 50% of all incidents.",
        checklist=["Fire Hazard Risk Assessment", "Regulatory Compliance Check", "Full System Dismantling & Prep", "Heavy-Duty Chemical Degreasing", "Baffle Filter Deep Cleaning", "NFPA 96 Compliance Certification"],
        details_img="https://images.unsplash.com/photo-1556911220-e150213ff337?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Keep Your", "italic:Kitchen Hood Clean"],
        cta_desc="Contact us today for professional kitchen hood cleaning services.",
        book_btn="Book Hood Cleaning",
    ),
    dict(
        slug="mattress-deep-cleaning",
        component="MattressDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1632342527264-42620f2c62c9?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Deep Cleaning Services",
        h1_lines=["SLEEP CLEAN &", "italic:COMFORTABLE"],
        hero_desc="UAE's Premier Mattress Deep Cleaning for Better Sleep Hygiene",
        icon="Sparkles",
        badge_label="Mattress Specialists",
        h2_lines=["Healthier Sleep,", "italic:Cleaner Mattress"],
        main_desc="A clean and hygienic mattress is essential for a good night's sleep and overall health. At Homework Cleaning Services LLC, we offer professional mattress deep cleaning services to ensure your mattress is free from dust, allergens, and stains. Our team uses advanced techniques and eco-friendly products to leave your mattress fresh and revitalized.",
        checklist=["Full Mattress Assessment", "Targeted Spot Pre-Treatment", "High-Power Vacuum Extraction", "Hot Steam Deep Sanitization", "Tough Stain Removal Treatment", "Odour Neutralisation & Freshening"],
        details_img="https://images.unsplash.com/photo-1632342527264-42620f2c62c9?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Sleep in a", "italic:Cleaner, Healthier Bed"],
        cta_desc="Contact us today for professional mattress deep cleaning services.",
        book_btn="Book Mattress Deep Clean",
    ),
    dict(
        slug="move-in-out-cleaning",
        component="MoveInOutCleaning",
        hero_img="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Relocation Specialists",
        h1_lines=["STRESS-FREE", "italic:MOVE IN / OUT"],
        hero_desc="Stress-Free Move In/Move Out Cleaning in UAE – Your Perfect Transition Partner",
        icon="Zap",
        badge_label="Move Cleaning Specialists",
        h2_lines=["Complete Move-Out", "italic:Deep Cleaning Service"],
        main_desc="Moving out can be stressful, but with Homework Cleaning Services LLC, your move-out cleaning is one less thing to worry about. We provide thorough and efficient cleaning services to ensure your old home is spotless and ready for the next occupants. Our team handles everything from floor to ceiling.",
        checklist=["Walls, Ceilings & Skirting Boards", "Full Floor Cleaning & Polishing", "Bathroom Deep Sanitization", "Kitchen Appliance Cleaning", "Cabinets & Drawers Interior Clean", "Final Inspection & Sign-Off"],
        details_img="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Start Fresh in", "italic:Your New Space"],
        cta_desc="Contact us today for professional move in/out cleaning services.",
        book_btn="Book Move Clean",
    ),
    dict(
        slug="office-cleaning",
        component="OfficeCleaning",
        hero_img="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Normal Cleaning Services",
        h1_lines=["REGULAR", "italic:OFFICE", "CLEANING"],
        hero_desc="Transform Your Office with UAE's Expert Regular Office Cleaning Services",
        icon="Briefcase",
        badge_label="Office Cleaning Specialists",
        h2_lines=["Professional Office", "italic:Cleaning Service"],
        main_desc="A clean and organized office environment is essential for productivity and employee well-being. At Homework Cleaning Services LLC, we offer reliable and comprehensive regular office cleaning services tailored to your specific needs. Our experienced team uses advanced techniques and eco-friendly products to ensure your office stays spotless.",
        checklist=["Reception & Lobby Cleaning", "Workstation & Desk Wiping", "Electronics & Screen Dusting", "Restroom Deep Sanitization", "Kitchen & Pantry Clean", "Floor Vacuuming & Mopping"],
        details_img="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Maintain a", "italic:Professional Workspace"],
        cta_desc="Contact us today for professional office cleaning services.",
        book_btn="Book Office Cleaning",
    ),
    dict(
        slug="post-construction-cleaning",
        component="PostConstructionCleaning",
        hero_img="https://images.unsplash.com/photo-1503387762-592ecd58ea46?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Expert Restoration",
        h1_lines=["POST CONSTRUCTION", "italic:CLEANING EXCELLENCE"],
        hero_desc="Post Construction Cleaning Excellence in UAE – Move In Ready Spaces",
        icon="ShieldCheck",
        badge_label="Construction Clean Specialists",
        h2_lines=["Move-In Ready", "italic:Post-Build Cleaning"],
        main_desc="Just finished a construction or renovation project? Let Homework Cleaning Services LLC handle the mess. Our professional post-construction cleaning services are designed to remove dust, debris, and construction residue, leaving your new space pristine and ready to be enjoyed.",
        checklist=["Full Construction Dust Removal", "Floor Cleaning & Polishing", "Bathroom Fixture Deep Clean", "Cabinet & Drawer Interior Wipe", "Debris & Waste Removal", "Final Detail & Snagging Clean"],
        details_img="https://images.unsplash.com/photo-1503387762-592ecd58ea46?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Turn Your Build Into", "italic:Your Home"],
        cta_desc="Contact us today for professional post-construction cleaning services.",
        book_btn="Book Post-Build Clean",
    ),
    dict(
        slug="residential-cleaning",
        component="ResidentialCleaning",
        hero_img="https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Normal Cleaning Services",
        h1_lines=["REGULAR", "italic:RESIDENTIAL", "CLEANING"],
        hero_desc="UAE's Trusted Residential Cleaning – Experience Pristine Living Spaces",
        icon="Home",
        badge_label="Home Cleaning Specialists",
        h2_lines=["Expert Regular", "italic:Home Cleaning Service"],
        main_desc="Keeping your home clean and tidy is essential for a comfortable and healthy living environment. At Homework Cleaning Services LLC, we offer reliable and comprehensive regular residential cleaning services tailored to your specific needs. Our experienced team uses advanced techniques and eco-friendly products to ensure your home stays spotless.",
        checklist=["Full Surface Dusting & Wiping", "Carpet Vacuuming & Floor Mopping", "Window & Mirror Cleaning", "Bathroom Deep Sanitization", "Shower, Tub & Toilet Cleaning", "Bed Making & Bedroom Tidying"],
        details_img="https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Enjoy a", "italic:Spotless Home"],
        cta_desc="Contact us today for professional residential cleaning services.",
        book_btn="Book Residential Clean",
    ),
    dict(
        slug="restaurant-cleaning",
        component="RestaurantCleaning",
        hero_img="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1600",
        hero_badge="F&B Specialized Hygiene",
        h1_lines=["RESTAURANT", "italic:CLEANING SOLUTIONS"],
        hero_desc="Comprehensive Restaurant Cleaning in UAE – Spotless and Hygienic Dining",
        icon="Star",
        badge_label="F&B Hygiene Specialists",
        h2_lines=["Exceed Health Codes:", "italic:Master Kitchen & Dining Hygiene"],
        main_desc="Keeping your restaurant clean and sanitary is essential for both customer satisfaction and health compliance. At Homework Cleaning Services LLC, we specialize in providing comprehensive restaurant cleaning services tailored to meet the unique needs of the foodservice industry. We ensure your establishment passes every inspection.",
        checklist=["Dining Floor Deep Cleaning", "Furniture & Table Sanitization", "Kitchen Equipment Degreasing", "Prep Station Hygiene Protocol", "Restroom Fixture Sterilization", "Bar & Counter Sanitization"],
        details_img="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Keep Your Restaurant", "italic:Pristine"],
        cta_desc="Contact us today for professional restaurant cleaning services.",
        book_btn="Book Restaurant Clean",
    ),
    dict(
        slug="sofa-deep-cleaning",
        component="SofaDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Deep Cleaning Services",
        h1_lines=["REVITALIZE", "italic:YOUR SOFA"],
        hero_desc="Revitalize Your Sofa with UAE's Expert Deep Cleaning Services",
        icon="Sparkles",
        badge_label="Upholstery Specialists",
        h2_lines=["Like-New", "italic:Sofa Deep Cleaning"],
        main_desc="Your sofa is the centerpiece of your living room, and keeping it clean is essential for maintaining a healthy and inviting home. At Homework Cleaning Services LLC, we offer professional sofa deep cleaning services to remove dirt, stains, and allergens from your upholstery, leaving it looking and feeling like new.",
        checklist=["Fabric Type Assessment", "Targeted Spot Pre-Treatment", "High-Power Vacuum Extraction", "Hot Steam Deep Sanitization", "Stubborn Stain Removal", "Premium Fabric Protection Coating"],
        details_img="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Restore Your Sofa's", "italic:Freshness"],
        cta_desc="Contact us today for professional sofa deep cleaning services.",
        book_btn="Book Sofa Deep Clean",
    ),
    dict(
        slug="swimming-pool-cleaning",
        component="SwimmingPoolCleaning",
        hero_img="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Premium Aquatic Care",
        h1_lines=["CRYSTAL CLEAR", "italic:DIVE-IN WATERS"],
        hero_desc="Professional Swimming Pool Cleaning in UAE – Dive into Clean Waters",
        icon="Droplets",
        badge_label="Pool Care Specialists",
        h2_lines=["Maintain Your Oasis:", "italic:Aquatic Health Mastery"],
        main_desc="Keeping your swimming pool clean and well-maintained is essential for enjoying a safe and refreshing swim. At Homework Cleaning Services LLC, we offer comprehensive swimming pool cleaning services to ensure your pool is crystal clear and inviting using advanced equipment and eco-friendly products.",
        checklist=["Surface Skimming & Debris Removal", "Precision Vacuum Cleaning", "Advanced Water Chemistry Testing", "Chemical Balancing & Treatment", "Targeted Algae Killing & Brushing", "Pump & Filter Circulation Check"],
        details_img="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Dive Into a", "italic:Crystal Clear Pool"],
        cta_desc="Contact us today for professional swimming pool cleaning services.",
        book_btn="Book Pool Cleaning",
    ),
    dict(
        slug="villa-deep-cleaning",
        component="VillaDeepCleaning",
        hero_img="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Grand Scale Excellence",
        h1_lines=["VILLA", "italic:DEEP CLEANING"],
        hero_desc="Transform Your Villa with UAE's Expert Deep Cleaning Services",
        icon="Home",
        badge_label="Villa Cleaning Specialists",
        h2_lines=["Complete Villa", "italic:Deep Sanitization"],
        main_desc="Is your villa in need of a thorough and meticulous clean? At Homework Cleaning Services LLC, we specialize in transforming your villa into a spotless sanctuary. Our professional team uses advanced equipment and eco-friendly cleaning solutions to ensure every corner of your villa shines with brilliance.",
        checklist=["Walls, Skirting & Sills Cleaning", "Furniture & Upholstery Deep Clean", "Shower Areas & Bathtub Scrubbing", "Full Kitchen Appliance Cleaning", "Countertops & Backsplash Sanitization", "High-Touch Point Antimicrobial Treatment"],
        details_img="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Transform Your", "italic:Villa"],
        cta_desc="Contact us today for a professional villa deep cleaning experience.",
        book_btn="Book Villa Deep Clean",
    ),
    dict(
        slug="water-tank-cleaning",
        component="WaterTankCleaning",
        hero_img="https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Essential Health Hygiene",
        h1_lines=["PURE WATER", "italic:STORAGE SOLUTIONS"],
        hero_desc="Top-Quality Water Tank Cleaning in UAE – Safe and Clean Water",
        icon="Droplets",
        badge_label="Water Hygiene Specialists",
        h2_lines=["Protect Your Health:", "italic:Tank Sanitization Experts"],
        main_desc="Water tanks are an essential part of many homes and businesses, providing a vital resource for daily needs. Dirty water tanks can harbor harmful bacteria, viruses, and parasites. At Homework Cleaning Services LLC, we provide municipality-standard disinfection to ensure your family or staff have access to crisp, safe drinking water.",
        checklist=["Water Pathogen Risk Assessment", "Discolouration & Contamination Check", "Full Tank Evacuation & Draining", "Food-Grade Chemical Sanitizing", "Quarterly Inspection Programme", "Filtration Upgrade Consultation"],
        details_img="https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Ensure Clean,", "italic:Safe Water"],
        cta_desc="Contact us today for professional water tank cleaning services.",
        book_btn="Book Tank Cleaning",
    ),
    dict(
        slug="window-cleaning",
        component="WindowCleaning",
        hero_img="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1600",
        hero_badge="Normal Cleaning Services",
        h1_lines=["CRYSTAL", "italic:CLEAR", "WINDOWS"],
        hero_desc="Crystal Clear Window Cleaning Services in UAE – Stunning Views, Every Time",
        icon="Sun",
        badge_label="Window Cleaning Specialists",
        h2_lines=["Streak-Free", "italic:Window Cleaning"],
        main_desc="Sparkling clean windows can enhance the appearance of your home or office, providing a clear view and letting in natural light. At Homework Cleaning Services LLC, we offer comprehensive window cleaning services to ensure your windows are spotless and streak-free using advanced techniques and eco-friendly products.",
        checklist=["Interior & Exterior Glass Cleaning", "Window Frame & Sill Cleaning", "Fly Screen Cleaning & Inspection", "Commercial Office Building Windows", "High-Rise Window Access Solutions", "Hard Water Stain Removal Treatment"],
        details_img="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000",
        cta_h4_lines=["Enjoy", "italic:Crystal Clear Windows"],
        cta_desc="Contact us today for professional window cleaning services.",
        book_btn="Book Window Cleaning",
    ),
]

# ─── Write files ──────────────────────────────────────────────────────────────

for p in pages:
    content = make_page(
        slug=p["slug"],
        component=p["component"],
        hero_img=p["hero_img"],
        hero_badge=p["hero_badge"],
        h1_lines=p["h1_lines"],
        hero_desc=p["hero_desc"],
        icon=p["icon"],
        badge_label=p["badge_label"],
        h2_lines=p["h2_lines"],
        main_desc=p["main_desc"],
        checklist=p["checklist"],
        details_img=p["details_img"],
        cta_h4_lines=p["cta_h4_lines"],
        cta_desc=p["cta_desc"],
        book_btn=p["book_btn"],
    )
    path = os.path.join(BASE, p["slug"], "page.tsx")
    with open(path, "w") as f:
        f.write(content)
    print(f"✅ Written: {p['slug']}/page.tsx")

print("\nAll service pages regenerated successfully!")
