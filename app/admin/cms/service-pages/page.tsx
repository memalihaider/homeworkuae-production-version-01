'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Edit3, Globe, CheckCircle2, X, Save, Loader2 } from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { SERVICE_DEFAULTS, ServicePageContent } from '@/components/ServicePageTemplate'

const OPTIMIZED_IMAGE_HOSTS = new Set([
  'images.unsplash.com',
  'randomuser.me',
  'firebasestorage.googleapis.com',
  'homework-a36e3.firebasestorage.app',
  'i.pinimg.com',
  's.pinimg.com',
])

const canUseNextImage = (src: string) => {
  try {
    const url = new URL(src)
    return url.protocol === 'https:' && OPTIMIZED_IMAGE_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

const SERVICE_LIST = [
  // Normal Cleaning
  { slug: 'residential-cleaning', category: 'Normal Cleaning' },
  { slug: 'office-cleaning', category: 'Normal Cleaning' },
  { slug: 'window-cleaning', category: 'Normal Cleaning' },
  { slug: 'balcony-deep-cleaning', category: 'Normal Cleaning' },
  { slug: 'sofa-deep-cleaning', category: 'Normal Cleaning' },
  { slug: 'carpets-deep-cleaning', category: 'Normal Cleaning' },
  { slug: 'mattress-deep-cleaning', category: 'Normal Cleaning' },
  // Deep Cleaning
  { slug: 'grout-deep-cleaning', category: 'Deep Cleaning' },
  { slug: 'garage-deep-cleaning', category: 'Deep Cleaning' },
  { slug: 'kitchen-deep-cleaning', category: 'Deep Cleaning' },
  { slug: 'post-construction-cleaning', category: 'Deep Cleaning' },
  { slug: 'office-deep-cleaning', category: 'Deep Cleaning' },
  { slug: 'apartment-deep-cleaning', category: 'Deep Cleaning' },
  { slug: 'move-in-out-cleaning', category: 'Deep Cleaning' },
  { slug: 'villa-deep-cleaning', category: 'Deep Cleaning' },
  { slug: 'floor-deep-cleaning', category: 'Deep Cleaning' },
  // Technical Cleaning
  { slug: 'ac-duct-cleaning', category: 'Technical Cleaning' },
  { slug: 'ac-coil-cleaning', category: 'Technical Cleaning' },
  { slug: 'kitchen-hood-cleaning', category: 'Technical Cleaning' },
  { slug: 'grease-trap-cleaning', category: 'Technical Cleaning' },
  { slug: 'restaurant-cleaning', category: 'Technical Cleaning' },
  { slug: 'water-tank-cleaning', category: 'Technical Cleaning' },
  { slug: 'swimming-pool-cleaning', category: 'Technical Cleaning' },
  { slug: 'gym-deep-cleaning', category: 'Technical Cleaning' },
  { slug: 'facade-cleaning', category: 'Technical Cleaning' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Normal Cleaning': 'bg-blue-100 text-blue-700',
  'Deep Cleaning': 'bg-purple-100 text-purple-700',
  'Technical Cleaning': 'bg-orange-100 text-orange-700',
}

const EMPTY_FORM: ServicePageContent = {
  name: '',
  badge: '',
  heroTitleLine1: '',
  heroTitleLine2: '',
  heroSubtitle: '',
  heroImage: '',
  sectionImage: '',
  specialistLabel: '',
  aboutHeading1: '',
  aboutHeading2: '',
  description: '',
  features: [],
  ctaTitle: '',
  ctaSubtitle: '',
  trustStats: [],
  offerCards: [],
  processSteps: [],
  serviceAreas: [],
  whyChoosePoints: [],
  faqs: [],
  reviews: [],
}

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const splitPipeLine = (line: string) => line.split('|').map((part) => part.trim())

const DEFAULT_TRUST_STATS = [
  { label: 'Satisfied Clients', value: '20,000+' },
  { label: 'Service Rating', value: '4.9/5.0' },
  { label: 'Expert Cleaners', value: '250+' },
  { label: 'City Coverage', value: '100%' },
]

const DEFAULT_SERVICE_AREAS = ['Downtown Dubai', 'Dubai Marina', 'Business Bay', 'Jumeirah', 'Al Barsha', 'JVC', 'Deira', 'Mirdif']

function withExtendedDefaults(base: ServicePageContent): ServicePageContent {
  const serviceName = base.name || 'Professional Cleaning Service'

  return {
    ...base,
    trustStats: base.trustStats?.length ? base.trustStats : DEFAULT_TRUST_STATS,
    offerCards: base.offerCards?.length
      ? base.offerCards
      : base.features.slice(0, 4).map((title) => ({ title: title.length > 42 ? `${title.slice(0, 39)}...` : title })),
    processSteps: base.processSteps?.length
      ? base.processSteps
      : [
          { title: 'Inspection', detail: `We inspect and scope ${serviceName.toLowerCase()} requirements before work begins.` },
          { title: 'Preparation', detail: 'We prepare the workspace and tools for efficient execution with minimal disruption.' },
          { title: 'Execution', detail: `Our team delivers detailed ${serviceName.toLowerCase()} using professional techniques and equipment.` },
          { title: 'Final Verification', detail: 'We finalize quality checks and share recommendations for long-lasting results.' },
        ],
    serviceAreas: base.serviceAreas?.length ? base.serviceAreas : DEFAULT_SERVICE_AREAS,
    whyChoosePoints: base.whyChoosePoints?.length
      ? base.whyChoosePoints
      : [
          `Certified specialists for ${serviceName.toLowerCase()} with Dubai-ready standards.`,
          'Transparent workflow with clear communication from booking to completion.',
          'Advanced tools and safe products for reliable, long-lasting outcomes.',
          'Flexible scheduling and fast response across all major Dubai locations.',
          'Quality-first delivery backed by responsive support after completion.',
        ],
    faqs: base.faqs?.length
      ? base.faqs
      : [
          {
            q: `How often should I book ${serviceName.toLowerCase()}?`,
            a: `Most homes and offices in Dubai benefit from ${serviceName.toLowerCase()} every 6 to 12 months.`,
          },
          {
            q: `How long does ${serviceName.toLowerCase()} take?`,
            a: 'Typical appointments take 2 to 6 hours depending on property size and service scope.',
          },
          {
            q: 'Is the service safe for children and pets?',
            a: 'Yes. We use approved methods and products suitable for occupied residential and commercial spaces.',
          },
          {
            q: 'Do you provide service across all Dubai areas?',
            a: 'Yes, we provide city-wide coverage with flexible appointment slots.',
          },
        ],
    reviews: base.reviews?.length
      ? base.reviews
      : [
          {
            name: 'Sarah Jenkins',
            text: `Excellent ${serviceName.toLowerCase()} service with visible results and professional execution.`,
            area: 'Palm Jumeirah',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
            date: '2 weeks ago',
          },
          {
            name: 'Mohamed Al-Fayed',
            text: 'Very organized team, clear communication, and strong quality standards from start to finish.',
            area: 'Downtown Dubai',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
            date: '1 month ago',
          },
          {
            name: 'Emma Robertson',
            text: 'Highly reliable and detail-focused service. I would confidently recommend this team in Dubai.',
            area: 'Dubai Marina',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
            date: '5 days ago',
          },
        ],
  }
}

export default function ServicePagesCMS() {
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [form, setForm] = useState<ServicePageContent>(EMPTY_FORM)
  const [featuresText, setFeaturesText] = useState('')
  const [trustStatsText, setTrustStatsText] = useState('')
  const [offerCardsText, setOfferCardsText] = useState('')
  const [processStepsText, setProcessStepsText] = useState('')
  const [serviceAreasText, setServiceAreasText] = useState('')
  const [whyChooseText, setWhyChooseText] = useState('')
  const [faqsText, setFaqsText] = useState('')
  const [reviewsJson, setReviewsJson] = useState('[]')
  const [saving, setSaving] = useState(false)
  const [syncingAll, setSyncingAll] = useState(false)
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set())
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null)

  const openEdit = async (slug: string) => {
    setLoadingSlug(slug)
    const defaults = withExtendedDefaults(SERVICE_DEFAULTS[slug] ?? EMPTY_FORM)
    let merged = { ...defaults }
    try {
      const snap = await getDoc(doc(db, 'service-pages', slug))
      if (snap.exists()) {
        const data = snap.data() as Partial<ServicePageContent>
        merged = withExtendedDefaults({
          ...defaults,
          ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== '')),
          ...(Array.isArray(data.features) && data.features.length > 0 ? { features: data.features } : {}),
        } as ServicePageContent)
      }
    } catch { /* use defaults */ }
    setForm(merged)
    setFeaturesText((merged.features ?? []).join('\n'))
    setTrustStatsText((merged.trustStats ?? []).map((item) => `${item.label} | ${item.value}`).join('\n'))
    setOfferCardsText((merged.offerCards ?? []).map((item) => item.title).join('\n'))
    setProcessStepsText((merged.processSteps ?? []).map((item) => `${item.title} | ${item.detail}`).join('\n'))
    setServiceAreasText((merged.serviceAreas ?? []).join('\n'))
    setWhyChooseText((merged.whyChoosePoints ?? []).join('\n'))
    setFaqsText((merged.faqs ?? []).map((item) => `${item.q} | ${item.a}`).join('\n'))
    setReviewsJson(JSON.stringify(merged.reviews ?? [], null, 2))
    setEditingSlug(slug)
    setLoadingSlug(null)
  }

  const closeEdit = () => {
    setEditingSlug(null)
    setForm(EMPTY_FORM)
    setFeaturesText('')
    setTrustStatsText('')
    setOfferCardsText('')
    setProcessStepsText('')
    setServiceAreasText('')
    setWhyChooseText('')
    setFaqsText('')
    setReviewsJson('[]')
  }

  const handleSave = async () => {
    if (!editingSlug) return
    setSaving(true)
    try {
      const features = splitLines(featuresText)
      const trustStats = splitLines(trustStatsText)
        .map(splitPipeLine)
        .filter((parts) => parts.length >= 2)
        .map(([label, value]) => ({ label, value }))

      const offerCards = splitLines(offerCardsText).map((title) => ({ title }))

      const processSteps = splitLines(processStepsText)
        .map(splitPipeLine)
        .filter((parts) => parts.length >= 2)
        .map(([title, ...detailParts]) => ({ title, detail: detailParts.join(' | ') }))

      const serviceAreas = splitLines(serviceAreasText)
      const whyChoosePoints = splitLines(whyChooseText)

      const faqs = splitLines(faqsText)
        .map(splitPipeLine)
        .filter((parts) => parts.length >= 2)
        .map(([q, ...aParts]) => ({ q, a: aParts.join(' | ') }))

      let reviews: ServicePageContent['reviews'] = []
      try {
        const parsed = JSON.parse(reviewsJson)
        reviews = Array.isArray(parsed)
          ? parsed.filter(
              (item): item is NonNullable<ServicePageContent['reviews']>[number] =>
                typeof item?.name === 'string' &&
                typeof item?.text === 'string' &&
                typeof item?.area === 'string' &&
                typeof item?.avatar === 'string' &&
                typeof item?.date === 'string'
            )
          : []
      } catch {
        alert('❌ Reviews JSON is invalid. Please fix it before saving.')
        setSaving(false)
        return
      }

      const payload: ServicePageContent = {
        ...form,
        features,
        trustStats,
        offerCards,
        processSteps,
        serviceAreas,
        whyChoosePoints,
        faqs,
        reviews,
      }
      await setDoc(doc(db, 'service-pages', editingSlug), payload)
      setSavedSlugs(prev => new Set([...prev, editingSlug]))
      alert('✅ Service page saved successfully!')
      closeEdit()
    } catch (err) {
      console.error(err)
      alert('❌ Error saving service page.')
    } finally {
      setSaving(false)
    }
  }

  const categories = ['Normal Cleaning', 'Deep Cleaning', 'Technical Cleaning']

  const handleSyncAllToFirebase = async () => {
    if (!confirm('Sync all service defaults (including extended section fields) to Firebase? This updates all service-pages docs.')) {
      return
    }

    setSyncingAll(true)
    try {
      await Promise.all(
        SERVICE_LIST.map(async ({ slug }) => {
          const defaults = SERVICE_DEFAULTS[slug] ?? EMPTY_FORM
          const payload = withExtendedDefaults(defaults)
          await setDoc(doc(db, 'service-pages', slug), payload, { merge: true })
        })
      )

      setSavedSlugs(new Set(SERVICE_LIST.map((item) => item.slug)))
      alert('✅ All service pages synced to Firebase with full extended section fields.')
    } catch (error) {
      console.error(error)
      alert('❌ Failed to sync all service pages to Firebase.')
    } finally {
      setSyncingAll(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        <button
          onClick={handleSyncAllToFirebase}
          disabled={syncingAll}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-pink-600 disabled:opacity-60"
        >
          {syncingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {syncingAll ? 'Syncing All...' : 'Sync All To Firebase'}
        </button>
      </div>

      {categories.map(cat => (
        <div key={cat}>
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">{cat}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {SERVICE_LIST.filter(s => s.category === cat).map(({ slug }) => {
              const def = SERVICE_DEFAULTS[slug]
              const isSaved = savedSlugs.has(slug)
              return (
                <div
                  key={slug}
                  className="group relative p-4 rounded-2xl border bg-muted/30 hover:bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_COLORS[cat]}`}>
                      {cat}
                    </span>
                  </div>
                  <p className="font-bold text-sm mb-1 line-clamp-2">{def?.name ?? slug}</p>
                  <p className="text-[11px] text-muted-foreground font-mono mb-3">/services/{slug}</p>
                  {isSaved && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-semibold mb-2">
                      <CheckCircle2 className="h-3 w-3" /> Customized
                    </div>
                  )}
                  <button
                    onClick={() => openEdit(slug)}
                    disabled={loadingSlug === slug}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-60"
                  >
                    {loadingSlug === slug ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Edit3 className="h-3.5 w-3.5" />
                    )}
                    Edit Page
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingSlug && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold">Edit: {SERVICE_DEFAULTS[editingSlug]?.name ?? editingSlug}</h2>
                <p className="text-xs text-muted-foreground font-mono">/services/{editingSlug}</p>
              </div>
              <button onClick={closeEdit} className="p-2 hover:bg-muted rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Hero Section Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b pb-2">Hero Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Badge Text</label>
                    <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Hero Title Line 1</label>
                    <input value={form.heroTitleLine1} onChange={e => setForm(f => ({ ...f, heroTitleLine1: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Hero Title Line 2 <span className="text-primary">(italic highlight)</span></label>
                    <input value={form.heroTitleLine2} onChange={e => setForm(f => ({ ...f, heroTitleLine2: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Hero Subtitle</label>
                    <input value={form.heroSubtitle} onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Hero Image URL</label>
                    <input value={form.heroImage} onChange={e => setForm(f => ({ ...f, heroImage: e.target.value }))}
                      placeholder="https://..." className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    {form.heroImage && (
                      canUseNextImage(form.heroImage) ? (
                        <Image src={form.heroImage} alt="" width={640} height={80} loading="lazy" sizes="(min-width: 768px) 50vw, 100vw" className="mt-2 h-20 w-full object-cover rounded-lg" />
                      ) : (
                        <img src={form.heroImage} alt="" className="mt-2 h-20 w-full object-cover rounded-lg" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                      )
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Section Image URL</label>
                    <input value={form.sectionImage} onChange={e => setForm(f => ({ ...f, sectionImage: e.target.value }))}
                      placeholder="https://..." className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    {form.sectionImage && (
                      canUseNextImage(form.sectionImage) ? (
                        <Image src={form.sectionImage} alt="" width={640} height={80} loading="lazy" sizes="(min-width: 768px) 50vw, 100vw" className="mt-2 h-20 w-full object-cover rounded-lg" />
                      ) : (
                        <img src={form.sectionImage} alt="" className="mt-2 h-20 w-full object-cover rounded-lg" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Content Section Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b pb-2">Content Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Specialist Label</label>
                    <input value={form.specialistLabel} onChange={e => setForm(f => ({ ...f, specialistLabel: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">About Heading Line 1</label>
                    <input value={form.aboutHeading1} onChange={e => setForm(f => ({ ...f, aboutHeading1: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">About Heading Line 2 <span className="text-primary">(italic highlight)</span></label>
                    <input value={form.aboutHeading2} onChange={e => setForm(f => ({ ...f, aboutHeading2: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Description Paragraph</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={4} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Features <span className="font-normal text-muted-foreground">(one per line)</span></label>
                    <textarea value={featuresText} onChange={e => setFeaturesText(e.target.value)}
                      rows={7} placeholder="Full Surface Dusting & Wiping&#10;Carpet Vacuuming & Floor Mopping&#10;..."
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono" />
                    <p className="text-[11px] text-muted-foreground mt-1">{featuresText.split('\n').filter(Boolean).length} features</p>
                  </div>
                </div>
              </div>

              {/* CTA Section Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b pb-2">CTA Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">CTA Title</label>
                    <input value={form.ctaTitle} onChange={e => setForm(f => ({ ...f, ctaTitle: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">CTA Subtitle</label>
                    <input value={form.ctaSubtitle} onChange={e => setForm(f => ({ ...f, ctaSubtitle: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* Extended AC Layout Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b pb-2">Extended Sections (AC Layout)</h3>
                <p className="text-[11px] text-muted-foreground">
                  Use <strong>|</strong> between fields where mentioned. One item per line.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Trust Stats <span className="font-normal text-muted-foreground">(Label | Value)</span></label>
                    <textarea
                      value={trustStatsText}
                      onChange={e => setTrustStatsText(e.target.value)}
                      rows={4}
                      placeholder="Satisfied Clients | 20,000+"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Offer Cards <span className="font-normal text-muted-foreground">(Title)</span></label>
                    <textarea
                      value={offerCardsText}
                      onChange={e => setOfferCardsText(e.target.value)}
                      rows={4}
                      placeholder="Air Vent Cleaning"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Process Steps <span className="font-normal text-muted-foreground">(Title | Detail)</span></label>
                    <textarea
                      value={processStepsText}
                      onChange={e => setProcessStepsText(e.target.value)}
                      rows={6}
                      placeholder="Inspection | We inspect and map service scope"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Service Areas <span className="font-normal text-muted-foreground">(one per line)</span></label>
                    <textarea
                      value={serviceAreasText}
                      onChange={e => setServiceAreasText(e.target.value)}
                      rows={6}
                      placeholder="Dubai Marina"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Why Choose Points <span className="font-normal text-muted-foreground">(one per line)</span></label>
                    <textarea
                      value={whyChooseText}
                      onChange={e => setWhyChooseText(e.target.value)}
                      rows={6}
                      placeholder="Certified specialists with proven methods"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">FAQs <span className="font-normal text-muted-foreground">(Question | Answer)</span></label>
                    <textarea
                      value={faqsText}
                      onChange={e => setFaqsText(e.target.value)}
                      rows={6}
                      placeholder="How often should I book this service? | Most homes should schedule every 6-12 months"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Reviews JSON <span className="font-normal text-muted-foreground">(array of {`{name,text,area,avatar,date}`})</span></label>
                    <textarea
                      value={reviewsJson}
                      onChange={e => setReviewsJson(e.target.value)}
                      rows={10}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex gap-3 justify-end">
              <button onClick={closeEdit} className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-muted">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition-all"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
