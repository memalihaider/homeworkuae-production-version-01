'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Home, Globe, FileText, Phone, DollarSign, HelpCircle, Layers, Settings,
  Save, RotateCcw, Eye, Upload, Plus, Trash2, GripVertical, Check, X,
  Image as ImageIcon, Type, Link as LinkIcon, Video, Star, ArrowRight,
  ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle2, Edit3,
  Layout, MessageSquare, Award, Shield, Users, Briefcase, Mail, MapPin
} from 'lucide-react'
import {
  CMSHomePage, CMSAboutPage, CMSContactPage, CMSPricingPage,
  CMSFAQPage, CMSServicesPage, CMSLayoutSettings,
  defaultHomePage, defaultAboutPage, defaultContactPage,
  defaultPricingPage, defaultFAQPage, defaultServicesPage, defaultLayoutSettings,
  getHomePage, getAboutPage, getContactPage, getPricingPage,
  getFAQPage, getServicesPage, getLayoutSettings,
  saveHomePage, saveAboutPage, saveContactPage, savePricingPage,
  saveFAQPage, saveServicesPage, saveLayoutSettings,
  uploadCMSImage
} from '@/lib/cms-data'

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

// ─── Reusable UI Components ──────────────────────────────────────

function SectionCard({ title, description, children, defaultOpen = false }: {
  title: string; description?: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">{children}</div>}
    </div>
  )
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
      {label}
      {hint && <span className="font-normal text-slate-400 ml-1">({hint})</span>}
    </label>
  )
}

function TextInput({ label, value, onChange, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string
}) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
      />
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder, rows = 3, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; hint?: string
}) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
      />
    </div>
  )
}

function ImageField({ label, value, onChange, onUpload }: {
  label: string; value: string; onChange: (v: string) => void; onUpload: (file: File) => Promise<string>
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState<'url' | 'upload'>('url')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await onUpload(file)
      onChange(url)
      setMode('url')
    } catch {
      alert('Upload failed. You can paste an image URL instead.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <FieldLabel label={label} />
        <div className="flex rounded-md overflow-hidden border border-slate-200 text-[10px]">
          <button onClick={() => setMode('url')} className={`px-2.5 py-1 font-semibold transition-colors ${mode === 'url' ? 'bg-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
            <span className="flex items-center gap-1"><LinkIcon className="h-2.5 w-2.5" /> URL</span>
          </button>
          <button onClick={() => setMode('upload')} className={`px-2.5 py-1 font-semibold transition-colors ${mode === 'upload' ? 'bg-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
            <span className="flex items-center gap-1"><Upload className="h-2.5 w-2.5" /> Upload</span>
          </button>
        </div>
      </div>
      {mode === 'url' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-5 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:border-primary/40 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'Uploading to Firebase Storage...' : 'Click to select & upload image'}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {value && (
        <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
          <div className="rounded-lg overflow-hidden border border-slate-200 h-20 w-28 shrink-0">
            {canUseNextImage(value) ? (
              <Image src={value} alt="Preview" width={112} height={80} loading="lazy" sizes="112px" className="w-full h-full object-cover" />
            ) : (
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 break-all leading-relaxed line-clamp-3">{value}</p>
            <button onClick={() => onChange('')} className="mt-1 text-[10px] font-medium text-red-400 hover:text-red-600 flex items-center gap-0.5">
              <X className="h-2.5 w-2.5" /> Remove image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function InlineImageUpload({ value, onChange, onUpload }: {
  value: string; onChange: (v: string) => void; onUpload: (f: File) => Promise<string>
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try { onChange(await onUpload(file)) } catch { alert('Upload failed. Try pasting a URL.') } finally { setUploading(false); e.target.value = '' }
  }

  return (
    <div className="flex gap-1">
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-primary/20" />
      <button onClick={() => ref.current?.click()} disabled={uploading} title="Upload image to Firebase Storage" className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors disabled:opacity-50 shrink-0">
        {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
      </button>
      <input ref={ref} type="file" accept="image/*" onChange={handle} className="hidden" />
    </div>
  )
}

// ─── Page Editors ─────────────────────────────────────────────────

function HomePageEditor({ data, onChange, onUpload }: {
  data: CMSHomePage; onChange: (d: CMSHomePage) => void; onUpload: (f: File) => Promise<string>
}) {
  const update = (path: string, value: unknown) => {
    const newData = JSON.parse(JSON.stringify(data)) as Record<string, unknown>
    const keys = path.split('.')
    let obj: Record<string, unknown> = newData
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]] as Record<string, unknown>
    }
    obj[keys[keys.length - 1]] = value
    onChange(newData as unknown as CMSHomePage)
  }

  return (
    <div className="space-y-4">
      <SectionCard title="Hero Section" description="Main hero area with rotating headings, video, and CTA" defaultOpen={true}>
        <div className="space-y-4">
          <FieldLabel label="Rotating Headings" hint="Use \\n for line break" />
          {data.hero.headings.map((h, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-xs text-slate-400 w-6">{i + 1}.</span>
              <input
                type="text"
                value={h}
                onChange={(e) => {
                  const headings = [...data.hero.headings]
                  headings[i] = e.target.value
                  update('hero.headings', headings)
                }}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <button onClick={() => {
                const headings = data.hero.headings.filter((_, idx) => idx !== i)
                update('hero.headings', headings)
              }} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button onClick={() => update('hero.headings', [...data.hero.headings, "New\nHeading"])} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
            <Plus className="h-3 w-3" /> Add Heading
          </button>

          <TextInput label="Badge Text" value={data.hero.badgeText} onChange={(v) => update('hero.badgeText', v)} />
          <TextArea label="Subtitle" value={data.hero.subtitle} onChange={(v) => update('hero.subtitle', v)} rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <TextInput label="CTA Button Text" value={data.hero.ctaText} onChange={(v) => update('hero.ctaText', v)} />
            <TextInput label="CTA Link" value={data.hero.ctaLink} onChange={(v) => update('hero.ctaLink', v)} />
          </div>
          <TextInput label="Video Embed URL" value={data.hero.videoUrl} onChange={(v) => update('hero.videoUrl', v)} hint="YouTube embed URL" />

          <FieldLabel label="Feature Tags" />
          {data.hero.featureTags.map((tag, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={tag}
                onChange={(e) => {
                  const tags = [...data.hero.featureTags]
                  tags[i] = e.target.value
                  update('hero.featureTags', tags)
                }}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <button onClick={() => update('hero.featureTags', data.hero.featureTags.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button onClick={() => update('hero.featureTags', [...data.hero.featureTags, ""])} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
            <Plus className="h-3 w-3" /> Add Tag
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Trust Banner" description="Statistics bar below the hero">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput
            label="Gradient Start Color"
            value={data.trustBanner.gradientFrom ?? '#0F1A2B'}
            onChange={(v) => update('trustBanner.gradientFrom', v)}
            placeholder="#0F1A2B"
            hint="Hex color"
          />
          <TextInput
            label="Gradient End Color"
            value={data.trustBanner.gradientTo ?? '#111827'}
            onChange={(v) => update('trustBanner.gradientTo', v)}
            placeholder="#111827"
            hint="Hex color"
          />
        </div>

        {data.trustBanner.stats.map((stat, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={stat.value}
              onChange={(e) => {
                const stats = [...data.trustBanner.stats]
                stats[i] = { ...stats[i], value: e.target.value }
                update('trustBanner.stats', stats)
              }}
              placeholder="Value"
              className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <input
              type="text"
              value={stat.label}
              onChange={(e) => {
                const stats = [...data.trustBanner.stats]
                stats[i] = { ...stats[i], label: e.target.value }
                update('trustBanner.stats', stats)
              }}
              placeholder="Label"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <button onClick={() => update('trustBanner.stats', data.trustBanner.stats.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button onClick={() => update('trustBanner.stats', [...data.trustBanner.stats, { label: "", value: "" }])} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
          <Plus className="h-3 w-3" /> Add Stat
        </button>
      </SectionCard>

      <SectionCard title="Certifications & Awards" description="Recognition badges section">
        {data.certifications.map((cert, i) => (
          <div key={i} className="flex gap-2 items-center p-3 bg-slate-50 rounded-lg">
            <input
              type="text"
              value={cert.title}
              onChange={(e) => {
                const certs = [...data.certifications]
                certs[i] = { ...certs[i], title: e.target.value }
                onChange({ ...data, certifications: certs })
              }}
              placeholder="Title"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
            />
            <input
              type="text"
              value={cert.subtitle}
              onChange={(e) => {
                const certs = [...data.certifications]
                certs[i] = { ...certs[i], subtitle: e.target.value }
                onChange({ ...data, certifications: certs })
              }}
              placeholder="Subtitle"
              className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
            />
            <select
              value={cert.type}
              onChange={(e) => {
                const certs = [...data.certifications]
                certs[i] = { ...certs[i], type: e.target.value as 'award' | 'certification' }
                onChange({ ...data, certifications: certs })
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
            >
              <option value="award">Award</option>
              <option value="certification">Certification</option>
            </select>
            <button onClick={() => onChange({ ...data, certifications: data.certifications.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ ...data, certifications: [...data.certifications, { title: "", subtitle: "", type: "certification" }] })} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
          <Plus className="h-3 w-3" /> Add Certification
        </button>
      </SectionCard>

      <SectionCard title="Featured Services" description="Service cards displayed on the home page">
        <div className="space-y-3">
          {data.services.map((svc, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-slate-300" />
                <span className="text-xs font-bold text-slate-500 w-6">{i + 1}</span>
                <input type="text" value={svc.title} onChange={(e) => {
                  const svcs = [...data.services]; svcs[i] = { ...svcs[i], title: e.target.value }; onChange({ ...data, services: svcs })
                }} placeholder="Service Title" className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20" />
                <select value={svc.tag} onChange={(e) => {
                  const svcs = [...data.services]; svcs[i] = { ...svcs[i], tag: e.target.value }; onChange({ ...data, services: svcs })
                }} className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white outline-none">
                  <option>Regular</option><option>Deep</option><option>Technical</option><option>Specialist</option>
                </select>
                <button onClick={() => onChange({ ...data, services: data.services.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="ml-12 grid grid-cols-3 gap-2">
                <input type="text" value={svc.description} onChange={(e) => {
                  const svcs = [...data.services]; svcs[i] = { ...svcs[i], description: e.target.value }; onChange({ ...data, services: svcs })
                }} placeholder="Description" className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white outline-none col-span-1" />
                <input type="text" value={svc.href} onChange={(e) => {
                  const svcs = [...data.services]; svcs[i] = { ...svcs[i], href: e.target.value }; onChange({ ...data, services: svcs })
                }} placeholder="/services/..." className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white outline-none" />
                <InlineImageUpload
                  value={svc.image}
                  onChange={(v) => { const svcs = [...data.services]; svcs[i] = { ...svcs[i], image: v }; onChange({ ...data, services: svcs }) }}
                  onUpload={onUpload}
                />
              </div>
            </div>
          ))}
          <button onClick={() => onChange({ ...data, services: [...data.services, { title: "", description: "", image: "", tag: "Regular", href: "" }] })} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
            <Plus className="h-3 w-3" /> Add Service
          </button>
        </div>
      </SectionCard>
    </div>
  )
}

function AboutPageEditor({ data, onChange, onUpload }: {
  data: CMSAboutPage; onChange: (d: CMSAboutPage) => void; onUpload: (f: File) => Promise<string>
}) {
  return (
    <div className="space-y-4">
      <SectionCard title="Hero Section" defaultOpen={true}>
        <TextInput label="Badge Text" value={data.heroBadge} onChange={(v) => onChange({ ...data, heroBadge: v })} />
        <TextArea label="Hero Title" value={data.heroTitle} onChange={(v) => onChange({ ...data, heroTitle: v })} hint="Use \\n for line break" rows={2} />
        <TextArea label="Hero Subtitle" value={data.heroSubtitle} onChange={(v) => onChange({ ...data, heroSubtitle: v })} rows={2} />
        <ImageField label="Hero Background Image" value={data.heroImage} onChange={(v) => onChange({ ...data, heroImage: v })} onUpload={onUpload} />
      </SectionCard>

      <SectionCard title="Legacy Section">
        <TextArea label="Legacy Title" value={data.legacyTitle} onChange={(v) => onChange({ ...data, legacyTitle: v })} hint="Use \\n for line break" rows={2} />
        <FieldLabel label="Paragraphs" />
        {data.legacyParagraphs.map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea value={p} onChange={(e) => {
              const paragraphs = [...data.legacyParagraphs]; paragraphs[i] = e.target.value; onChange({ ...data, legacyParagraphs: paragraphs })
            }} rows={2} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none outline-none focus:ring-2 focus:ring-primary/20" />
            <button onClick={() => onChange({ ...data, legacyParagraphs: data.legacyParagraphs.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 p-1 self-start mt-2">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ ...data, legacyParagraphs: [...data.legacyParagraphs, ""] })} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
          <Plus className="h-3 w-3" /> Add Paragraph
        </button>
      </SectionCard>

      <SectionCard title="Vision & Mission">
        <TextArea label="Vision Statement" value={data.visionText} onChange={(v) => onChange({ ...data, visionText: v })} rows={3} />
        <TextArea label="Mission Statement" value={data.missionText} onChange={(v) => onChange({ ...data, missionText: v })} rows={3} />
      </SectionCard>

      <SectionCard title="Core Values">
        {data.coreValues.map((val, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg flex gap-3 items-start">
            <div className="flex-1 space-y-2">
              <input type="text" value={val.title} onChange={(e) => {
                const values = [...data.coreValues]; values[i] = { ...values[i], title: e.target.value }; onChange({ ...data, coreValues: values })
              }} placeholder="Value Title" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary/20" />
              <input type="text" value={val.description} onChange={(e) => {
                const values = [...data.coreValues]; values[i] = { ...values[i], description: e.target.value }; onChange({ ...data, coreValues: values })
              }} placeholder="Description" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white outline-none" />
            </div>
            <button onClick={() => onChange({ ...data, coreValues: data.coreValues.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 p-1 mt-1">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ ...data, coreValues: [...data.coreValues, { title: "", description: "" }] })} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
          <Plus className="h-3 w-3" /> Add Value
        </button>
      </SectionCard>

      <SectionCard title="Contact Info (Footer of About Page)">
        <TextInput label="Address" value={data.contactAddress} onChange={(v) => onChange({ ...data, contactAddress: v })} />
        <TextInput label="Phone" value={data.contactPhone} onChange={(v) => onChange({ ...data, contactPhone: v })} />
        <TextInput label="Email" value={data.contactEmail} onChange={(v) => onChange({ ...data, contactEmail: v })} />
      </SectionCard>
    </div>
  )
}

function ContactPageEditor({ data, onChange, onUpload }: {
  data: CMSContactPage; onChange: (d: CMSContactPage) => void; onUpload: (f: File) => Promise<string>
}) {
  return (
    <div className="space-y-4">
      <SectionCard title="Hero Section" defaultOpen={true}>
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => onChange({ ...data, heroTitle: v })} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => onChange({ ...data, heroSubtitle: v })} rows={2} />
      </SectionCard>

      <SectionCard title="Contact Details">
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Phone Number" value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} />
          <TextInput label="Email" value={data.email} onChange={(v) => onChange({ ...data, email: v })} />
          <TextInput label="WhatsApp Number" value={data.whatsapp} onChange={(v) => onChange({ ...data, whatsapp: v })} />
          <TextInput label="Address" value={data.address} onChange={(v) => onChange({ ...data, address: v })} />
        </div>
      </SectionCard>

      <SectionCard title="Map Embed">
        <TextInput label="Google Maps Embed URL" value={data.mapEmbedUrl} onChange={(v) => onChange({ ...data, mapEmbedUrl: v })} hint="iframe src URL" />
        {data.mapEmbedUrl && (
          <div className="rounded-lg overflow-hidden border border-slate-200 h-48">
            <iframe src={data.mapEmbedUrl} className="w-full h-full" style={{ border: 'none' }} title="Map preview" />
          </div>
        )}
      </SectionCard>

      <SectionCard title="Social Media Links">
        {data.socialLinks.map((link, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={link.platform} onChange={(e) => {
              const links = [...data.socialLinks]; links[i] = { ...links[i], platform: e.target.value }; onChange({ ...data, socialLinks: links })
            }} placeholder="Platform" className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            <input type="text" value={link.url} onChange={(e) => {
              const links = [...data.socialLinks]; links[i] = { ...links[i], url: e.target.value }; onChange({ ...data, socialLinks: links })
            }} placeholder="URL" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            <button onClick={() => onChange({ ...data, socialLinks: data.socialLinks.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ ...data, socialLinks: [...data.socialLinks, { platform: "", url: "" }] })} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
          <Plus className="h-3 w-3" /> Add Social Link
        </button>
      </SectionCard>
    </div>
  )
}

function PricingPageEditor({ data, onChange }: {
  data: CMSPricingPage; onChange: (d: CMSPricingPage) => void
}) {
  return (
    <div className="space-y-4">
      <SectionCard title="Hero Section" defaultOpen={true}>
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => onChange({ ...data, heroTitle: v })} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => onChange({ ...data, heroSubtitle: v })} rows={2} />
        <TextInput label="Hero Background Image" value={data.heroImage} onChange={(v) => onChange({ ...data, heroImage: v })} />
      </SectionCard>

      <SectionCard title="Pricing Tiers" description="Package cards with features">
        {data.tiers.map((tier, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400">Tier {i + 1}</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={tier.popular} onChange={(e) => {
                    const tiers = [...data.tiers]; tiers[i] = { ...tiers[i], popular: e.target.checked }; onChange({ ...data, tiers })
                  }} className="w-3.5 h-3.5 accent-primary" />
                  <span className="text-xs text-slate-600">Popular</span>
                </label>
              </div>
              <button onClick={() => onChange({ ...data, tiers: data.tiers.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={tier.name} onChange={(e) => {
                const tiers = [...data.tiers]; tiers[i] = { ...tiers[i], name: e.target.value }; onChange({ ...data, tiers })
              }} placeholder="Plan Name" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none" />
              <input type="text" value={tier.price} onChange={(e) => {
                const tiers = [...data.tiers]; tiers[i] = { ...tiers[i], price: e.target.value }; onChange({ ...data, tiers })
              }} placeholder="Price (AED)" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none" />
              <input type="text" value={tier.description} onChange={(e) => {
                const tiers = [...data.tiers]; tiers[i] = { ...tiers[i], description: e.target.value }; onChange({ ...data, tiers })
              }} placeholder="Short description" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none" />
            </div>
            <FieldLabel label="Features" />
            {tier.features.map((f, fi) => (
              <div key={fi} className="flex gap-2 items-center ml-2">
                <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                <input type="text" value={f} onChange={(e) => {
                  const tiers = [...data.tiers]; const features = [...tiers[i].features]; features[fi] = e.target.value; tiers[i] = { ...tiers[i], features }; onChange({ ...data, tiers })
                }} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs bg-white outline-none" />
                <button onClick={() => {
                  const tiers = [...data.tiers]; tiers[i] = { ...tiers[i], features: tiers[i].features.filter((_, idx) => idx !== fi) }; onChange({ ...data, tiers })
                }} className="text-red-400 hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button onClick={() => {
              const tiers = [...data.tiers]; tiers[i] = { ...tiers[i], features: [...tiers[i].features, ""] }; onChange({ ...data, tiers })
            }} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline ml-2">
              <Plus className="h-3 w-3" /> Add Feature
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ ...data, tiers: [...data.tiers, { name: "", price: "", description: "", features: [], popular: false }] })} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
          <Plus className="h-3 w-3" /> Add Pricing Tier
        </button>
      </SectionCard>

      <SectionCard title="Pricing FAQs">
        {data.faqs.map((faq, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
            <div className="flex gap-2">
              <input type="text" value={faq.question} onChange={(e) => {
                const faqs = [...data.faqs]; faqs[i] = { ...faqs[i], question: e.target.value }; onChange({ ...data, faqs })
              }} placeholder="Question" className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none" />
              <button onClick={() => onChange({ ...data, faqs: data.faqs.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <textarea value={faq.answer} onChange={(e) => {
              const faqs = [...data.faqs]; faqs[i] = { ...faqs[i], answer: e.target.value }; onChange({ ...data, faqs })
            }} placeholder="Answer" rows={2} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white outline-none resize-none" />
          </div>
        ))}
        <button onClick={() => onChange({ ...data, faqs: [...data.faqs, { question: "", answer: "" }] })} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
          <Plus className="h-3 w-3" /> Add FAQ
        </button>
      </SectionCard>

      <SectionCard title="Custom Quote Section">
        <TextInput label="Title" value={data.customQuoteTitle} onChange={(v) => onChange({ ...data, customQuoteTitle: v })} />
        <TextArea label="Description" value={data.customQuoteDescription} onChange={(v) => onChange({ ...data, customQuoteDescription: v })} rows={2} />
      </SectionCard>
    </div>
  )
}

function FAQPageEditor({ data, onChange }: {
  data: CMSFAQPage; onChange: (d: CMSFAQPage) => void
}) {
  return (
    <div className="space-y-4">
      <SectionCard title="FAQ Page Settings" defaultOpen={true}>
        <TextInput label="Page Title" value={data.heroTitle} onChange={(v) => onChange({ ...data, heroTitle: v })} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => onChange({ ...data, heroSubtitle: v })} rows={2} />
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> Individual FAQ items are managed in the main CMS tab. This editor controls only the page hero text and appearance.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}

function ServiceItemCard({ svc, si, ci, data, onChange, onUpload }: {
  svc: { title: string; description: string; image: string; href: string }
  si: number; ci: number; data: CMSServicesPage; onChange: (d: CMSServicesPage) => void; onUpload: (f: File) => Promise<string>
}) {
  const imgRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [imgMode, setImgMode] = useState<'url' | 'upload'>('url')

  const update = (fields: Partial<typeof svc>) => {
    const categories = [...data.categories]
    const services = [...categories[ci].services]
    services[si] = { ...services[si], ...fields }
    categories[ci] = { ...categories[ci], services }
    onChange({ ...data, categories })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await onUpload(file)
      update({ image: url })
      setImgMode('url')
    } catch {
      alert('Upload failed. Try pasting a URL instead.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="ml-4 bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-3 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text" value={svc.title} onChange={(e) => update({ title: e.target.value })}
            placeholder="Service Title" className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <input
            type="text" value={svc.description} onChange={(e) => update({ description: e.target.value })}
            placeholder="Short description" className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <input
          type="text" value={svc.href} onChange={(e) => update({ href: e.target.value })}
          placeholder="Page link e.g. /services/residential-cleaning" className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Image</span>
            <div className="flex rounded-md overflow-hidden border border-slate-200 text-[10px]">
              <button onClick={() => setImgMode('url')} className={`px-2 py-0.5 font-semibold transition-colors ${imgMode === 'url' ? 'bg-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                <span className="flex items-center gap-1"><LinkIcon className="h-2.5 w-2.5" /> URL</span>
              </button>
              <button onClick={() => setImgMode('upload')} className={`px-2 py-0.5 font-semibold transition-colors ${imgMode === 'upload' ? 'bg-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                <span className="flex items-center gap-1"><Upload className="h-2.5 w-2.5" /> Upload</span>
              </button>
            </div>
          </div>
          {imgMode === 'url' ? (
            <input
              type="text" value={svc.image} onChange={(e) => update({ image: e.target.value })}
              placeholder="https://..." className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          ) : (
            <button
              onClick={() => imgRef.current?.click()} disabled={uploading}
              className="w-full flex items-center justify-center gap-1.5 py-4 border-2 border-dashed border-slate-300 rounded-lg text-xs text-slate-500 hover:bg-slate-50 hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin text-primary" /> : <Upload className="h-3 w-3" />}
              {uploading ? 'Uploading to Firebase Storage...' : 'Click to select & upload image'}
            </button>
          )}
          <input ref={imgRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          {svc.image && (
            <div className="flex items-center gap-2 mt-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
              {canUseNextImage(svc.image) ? (
                <Image src={svc.image} alt="preview" width={56} height={36} loading="lazy" sizes="56px" className="h-9 w-14 object-cover rounded border border-slate-200 shrink-0" />
              ) : (
                <img src={svc.image} alt="preview" className="h-9 w-14 object-cover rounded border border-slate-200 shrink-0" />
              )}
              <span className="text-[10px] text-slate-400 truncate flex-1 min-w-0">{svc.image}</span>
              <button onClick={() => update({ image: '' })} className="text-slate-400 hover:text-red-500 shrink-0"><X className="h-3 w-3" /></button>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-slate-100 px-3 py-1.5 flex justify-end bg-slate-50">
        <button onClick={() => {
          const categories = [...data.categories]
          categories[ci] = { ...categories[ci], services: categories[ci].services.filter((_, idx) => idx !== si) }
          onChange({ ...data, categories })
        }} className="flex items-center gap-1 text-[10px] font-medium text-red-400 hover:text-red-600 transition-colors">
          <Trash2 className="h-3 w-3" /> Remove Service
        </button>
      </div>
    </div>
  )
}

function ServicesPageEditor({ data, onChange, onUpload }: {
  data: CMSServicesPage; onChange: (d: CMSServicesPage) => void; onUpload: (f: File) => Promise<string>
}) {
  return (
    <div className="space-y-4">
      <SectionCard title="Hero Section" defaultOpen={true}>
        <TextInput label="Title" value={data.heroTitle} onChange={(v) => onChange({ ...data, heroTitle: v })} />
        <TextArea label="Subtitle" value={data.heroSubtitle} onChange={(v) => onChange({ ...data, heroSubtitle: v })} rows={2} />
        <ImageField label="Hero Background Image" value={data.heroImage} onChange={(v) => onChange({ ...data, heroImage: v })} onUpload={onUpload} />
      </SectionCard>

      <SectionCard title="Service Categories" description="Grouped service listings">
        {data.categories.map((cat, ci) => (
          <div key={ci} className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <input type="text" value={cat.name} onChange={(e) => {
                const categories = [...data.categories]; categories[ci] = { ...categories[ci], name: e.target.value }; onChange({ ...data, categories })
              }} placeholder="Category Name" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-primary/20" />
              <button onClick={() => onChange({ ...data, categories: data.categories.filter((_, idx) => idx !== ci) })} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {cat.services.map((svc, si) => (
              <ServiceItemCard key={si} svc={svc} si={si} ci={ci} data={data} onChange={onChange} onUpload={onUpload} />
            ))}
            <button onClick={() => {
              const categories = [...data.categories]; categories[ci] = { ...categories[ci], services: [...categories[ci].services, { title: "", description: "", image: "", href: "" }] }; onChange({ ...data, categories })
            }} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline ml-4">
              <Plus className="h-3 w-3" /> Add Service
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ ...data, categories: [...data.categories, { name: "", services: [] }] })} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
          <Plus className="h-3 w-3" /> Add Category
        </button>
      </SectionCard>
    </div>
  )
}

function LayoutSettingsEditor({ data, onChange }: {
  data: CMSLayoutSettings; onChange: (d: CMSLayoutSettings) => void
}) {
  return (
    <div className="space-y-4">
      <SectionCard title="Top Bar" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Phone Number" value={data.topBarPhone} onChange={(v) => onChange({ ...data, topBarPhone: v })} />
          <TextInput label="Email" value={data.topBarEmail} onChange={(v) => onChange({ ...data, topBarEmail: v })} />
        </div>
      </SectionCard>

      <SectionCard title="Navbar">
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Logo Text" value={data.navbar.logoText} onChange={(v) => onChange({ ...data, navbar: { ...data.navbar, logoText: v } })} />
          <TextInput label="Logo Image URL" value={data.navbar.logoImage} onChange={(v) => onChange({ ...data, navbar: { ...data.navbar, logoImage: v } })} hint="Optional" />
          <TextInput label="CTA Button Text" value={data.navbar.ctaText} onChange={(v) => onChange({ ...data, navbar: { ...data.navbar, ctaText: v } })} />
          <TextInput label="CTA Button Link" value={data.navbar.ctaLink} onChange={(v) => onChange({ ...data, navbar: { ...data.navbar, ctaLink: v } })} />
        </div>
      </SectionCard>

      <SectionCard title="Footer">
        <TextArea label="Company Description" value={data.footer.companyDescription} onChange={(v) => onChange({ ...data, footer: { ...data.footer, companyDescription: v } })} rows={3} />
        <TextInput label="Copyright Text" value={data.footer.copyrightText} onChange={(v) => onChange({ ...data, footer: { ...data.footer, copyrightText: v } })} />
        <TextInput label="Newsletter Title" value={data.footer.newsletterTitle} onChange={(v) => onChange({ ...data, footer: { ...data.footer, newsletterTitle: v } })} />
        <TextInput label="Newsletter Subtitle" value={data.footer.newsletterSubtitle} onChange={(v) => onChange({ ...data, footer: { ...data.footer, newsletterSubtitle: v } })} />

        <FieldLabel label="Social Media Links" />
        {data.footer.socialLinks.map((link, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={link.platform} onChange={(e) => {
              const links = [...data.footer.socialLinks]; links[i] = { ...links[i], platform: e.target.value }; onChange({ ...data, footer: { ...data.footer, socialLinks: links } })
            }} placeholder="Platform" className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
            <input type="text" value={link.url} onChange={(e) => {
              const links = [...data.footer.socialLinks]; links[i] = { ...links[i], url: e.target.value }; onChange({ ...data, footer: { ...data.footer, socialLinks: links } })
            }} placeholder="URL" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
            <button onClick={() => onChange({ ...data, footer: { ...data.footer, socialLinks: data.footer.socialLinks.filter((_, idx) => idx !== i) } })} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button onClick={() => onChange({ ...data, footer: { ...data.footer, socialLinks: [...data.footer.socialLinks, { platform: "", url: "" }] } })} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
          <Plus className="h-3 w-3" /> Add Social Link
        </button>
      </SectionCard>
    </div>
  )
}

// ─── Main CMS Page ────────────────────────────────────────────────

const pages = [
  { id: 'home', label: 'Home Page', icon: Home, color: 'text-blue-600 bg-blue-50' },
  { id: 'about', label: 'About Page', icon: Users, color: 'text-violet-600 bg-violet-50' },
  { id: 'services', label: 'Services Page', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'contact', label: 'Contact Page', icon: Phone, color: 'text-sky-600 bg-sky-50' },
  { id: 'pricing', label: 'Pricing Page', icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
  { id: 'faq', label: 'FAQ Page', icon: HelpCircle, color: 'text-rose-600 bg-rose-50' },
  { id: 'layout', label: 'Navbar & Footer', icon: Layout, color: 'text-slate-600 bg-slate-100' },
]

export default function WebsiteCMS() {
  const [activePage, setActivePage] = useState('home')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [hasChanges, setHasChanges] = useState(false)

  // State for each page
  const [homeData, setHomeData] = useState<CMSHomePage>(defaultHomePage)
  const [aboutData, setAboutData] = useState<CMSAboutPage>(defaultAboutPage)
  const [contactData, setContactData] = useState<CMSContactPage>(defaultContactPage)
  const [pricingData, setPricingData] = useState<CMSPricingPage>(defaultPricingPage)
  const [faqData, setFaqData] = useState<CMSFAQPage>(defaultFAQPage)
  const [servicesData, setServicesData] = useState<CMSServicesPage>(defaultServicesPage)
  const [layoutData, setLayoutData] = useState<CMSLayoutSettings>(defaultLayoutSettings)

  // Load all CMS data on mount
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      try {
        const [home, about, contact, pricing, faq, services, layout] = await Promise.all([
          getHomePage(), getAboutPage(), getContactPage(), getPricingPage(),
          getFAQPage(), getServicesPage(), getLayoutSettings()
        ])
        setHomeData(home)
        setAboutData(about)
        setContactData(contact)
        setPricingData(pricing)
        setFaqData(faq)
        setServicesData(services)
        setLayoutData(layout)
      } catch (error) {
        console.error('Error loading CMS data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // Clear save status after 3s
  useEffect(() => {
    if (saveStatus !== 'idle') {
      const timer = setTimeout(() => setSaveStatus('idle'), 3000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus])

  const handleUpload = async (file: File) => {
    return uploadCMSImage(file, activePage)
  }

  const handleChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (data: T) => {
    setter(data)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const saveMap: Record<string, () => Promise<boolean>> = {
        home: () => saveHomePage(homeData),
        about: () => saveAboutPage(aboutData),
        contact: () => saveContactPage(contactData),
        pricing: () => savePricingPage(pricingData),
        faq: () => saveFAQPage(faqData),
        services: () => saveServicesPage(servicesData),
        layout: () => saveLayoutSettings(layoutData),
      }
      const result = await saveMap[activePage]()
      setSaveStatus(result ? 'success' : 'error')
      if (result) setHasChanges(false)
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const results = await Promise.all([
        saveHomePage(homeData),
        saveAboutPage(aboutData),
        saveContactPage(contactData),
        savePricingPage(pricingData),
        saveFAQPage(faqData),
        saveServicesPage(servicesData),
        saveLayoutSettings(layoutData),
      ])
      const allOk = results.every(Boolean)
      setSaveStatus(allOk ? 'success' : 'error')
      if (allOk) setHasChanges(false)
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset this page to defaults? Your unsaved changes will be lost.')) return
    const resetMap: Record<string, () => void> = {
      home: () => setHomeData(defaultHomePage),
      about: () => setAboutData(defaultAboutPage),
      contact: () => setContactData(defaultContactPage),
      pricing: () => setPricingData(defaultPricingPage),
      faq: () => setFaqData(defaultFAQPage),
      services: () => setServicesData(defaultServicesPage),
      layout: () => setLayoutData(defaultLayoutSettings),
    }
    resetMap[activePage]()
    setHasChanges(true)
  }

  const currentPage = pages.find(p => p.id === activePage)!

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading CMS data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Website CMS</h1>
          <p className="text-sm text-slate-500 mt-1">Customize every page of your website — content, images, and settings</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
              <AlertCircle className="h-3.5 w-3.5" /> Error
            </span>
          )}
          <button onClick={handleReset} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Reset Page
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm shadow-primary/20">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Page
          </button>
          <button onClick={handleSaveAll} disabled={saving} className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
            Save All
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">You have unsaved changes. Click &quot;Save Page&quot; or &quot;Save All&quot; to persist your edits to Firebase.</p>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar - Page Navigation */}
        <div className="w-56 shrink-0 space-y-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm ${
                activePage === page.id
                  ? 'bg-white shadow-md border border-slate-200 font-bold text-slate-900'
                  : 'hover:bg-slate-50 text-slate-600 font-medium'
              }`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${activePage === page.id ? page.color : 'text-slate-400 bg-slate-50'}`}>
                <page.icon className="h-4 w-4" />
              </div>
              {page.label}
            </button>
          ))}

          {/* Quick Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
              <strong>Tip:</strong> Changes are saved to Firebase and reflected on the live website instantly after saving.
            </p>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 min-w-0">
          {/* Editor Header */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${currentPage.color}`}>
              <currentPage.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">{currentPage.label}</h2>
              <p className="text-xs text-slate-500">Edit content, images, and settings for this page</p>
            </div>
            <div className="ml-auto">
              <a
                href={activePage === 'layout' ? '/' : activePage === 'faq' ? '/faqs' : `/${activePage === 'home' ? '' : activePage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Eye className="h-3.5 w-3.5" /> Preview Live
              </a>
            </div>
          </div>

          {/* Dynamic Editor */}
          {activePage === 'home' && <HomePageEditor data={homeData} onChange={handleChange(setHomeData)} onUpload={handleUpload} />}
          {activePage === 'about' && <AboutPageEditor data={aboutData} onChange={handleChange(setAboutData)} onUpload={handleUpload} />}
          {activePage === 'contact' && <ContactPageEditor data={contactData} onChange={handleChange(setContactData)} onUpload={handleUpload} />}
          {activePage === 'pricing' && <PricingPageEditor data={pricingData} onChange={handleChange(setPricingData)} />}
          {activePage === 'faq' && <FAQPageEditor data={faqData} onChange={handleChange(setFaqData)} />}
          {activePage === 'services' && <ServicesPageEditor data={servicesData} onChange={handleChange(setServicesData)} onUpload={handleUpload} />}
          {activePage === 'layout' && <LayoutSettingsEditor data={layoutData} onChange={handleChange(setLayoutData)} />}
        </div>
      </div>
    </div>
  )
}
