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
}

export default function ServicePagesCMS() {
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [form, setForm] = useState<ServicePageContent>(EMPTY_FORM)
  const [featuresText, setFeaturesText] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set())
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null)

  const openEdit = async (slug: string) => {
    setLoadingSlug(slug)
    const defaults = SERVICE_DEFAULTS[slug] ?? EMPTY_FORM
    let merged = { ...defaults }
    try {
      const snap = await getDoc(doc(db, 'service-pages', slug))
      if (snap.exists()) {
        const data = snap.data() as Partial<ServicePageContent>
        merged = {
          ...defaults,
          ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== '')),
          ...(Array.isArray(data.features) && data.features.length > 0 ? { features: data.features } : {}),
        } as ServicePageContent
      }
    } catch { /* use defaults */ }
    setForm(merged)
    setFeaturesText((merged.features ?? []).join('\n'))
    setEditingSlug(slug)
    setLoadingSlug(null)
  }

  const closeEdit = () => {
    setEditingSlug(null)
    setForm(EMPTY_FORM)
    setFeaturesText('')
  }

  const handleSave = async () => {
    if (!editingSlug) return
    setSaving(true)
    try {
      const features = featuresText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
      const payload: ServicePageContent = { ...form, features }
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

  return (
    <div className="space-y-8">
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
