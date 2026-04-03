'use client'

import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { Landmark, RefreshCw, DownloadCloud, Receipt } from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

type TallySettings = {
  enabled: boolean
  serverUrl: string
  port: string
  companyName: string
  syncMode: 'manual' | 'hourly' | 'daily'
  voucherType: 'Sales' | 'Receipt' | 'Journal'
}

type TallyExportSettings = {
  enabled: boolean
  format: 'csv' | 'xml'
  includeJobs: boolean
  includeQuotations: boolean
  includeBookings: boolean
  batchSize: string
}

const DEFAULT_TALLY_SETTINGS: TallySettings = {
  enabled: false,
  serverUrl: '',
  port: '9000',
  companyName: '',
  syncMode: 'manual',
  voucherType: 'Sales'
}

const DEFAULT_EXPORT_SETTINGS: TallyExportSettings = {
  enabled: false,
  format: 'csv',
  includeJobs: true,
  includeQuotations: true,
  includeBookings: false,
  batchSize: '200'
}

type StatCardProps = {
  title: string
  value: string
  icon: ComponentType<{ className?: string }>
  hint?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

type SectionCardProps = {
  title: string
  icon: ComponentType<{ className?: string }>
  children: ReactNode
  action?: ReactNode
}

const StatCard = ({ title, value, icon: Icon, hint, color = 'blue' }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200'
  }

  return (
    <div className={`rounded-2xl p-6 border-2 ${colorClasses[color]} bg-white`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}

const SectionCard = ({ title, icon: Icon, children, action }: SectionCardProps) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b-2 border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function TallyPage() {
  const [tallySettings, setTallySettings] = useState<TallySettings>(DEFAULT_TALLY_SETTINGS)
  const [exportSettings, setExportSettings] = useState<TallyExportSettings>(DEFAULT_EXPORT_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'profile-setting', 'admin-settings')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()

          if (data.tally) {
            setTallySettings({
              enabled: Boolean(data.tally.enabled),
              serverUrl: data.tally.serverUrl || '',
              port: data.tally.port || '9000',
              companyName: data.tally.companyName || '',
              syncMode: data.tally.syncMode || 'manual',
              voucherType: data.tally.voucherType || 'Sales'
            })
          }

          if (data.tallyExport) {
            setExportSettings({
              enabled: Boolean(data.tallyExport.enabled),
              format: data.tallyExport.format || 'csv',
              includeJobs: data.tallyExport.includeJobs !== false,
              includeQuotations: data.tallyExport.includeQuotations !== false,
              includeBookings: Boolean(data.tallyExport.includeBookings),
              batchSize: data.tallyExport.batchSize || '200'
            })
          }
        }
      } catch (error) {
        console.error('Error loading Tally settings:', error)
        setLoadError('Unable to load Tally settings. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleTallyChange = (field: keyof TallySettings, value: TallySettings[keyof TallySettings]) => {
    setTallySettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleExportChange = (
    field: keyof TallyExportSettings,
    value: TallyExportSettings[keyof TallyExportSettings]
  ) => {
    setExportSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setLoadError('')
    try {
      await setDoc(
        doc(db, 'profile-setting', 'admin-settings'),
        {
          tally: tallySettings,
          tallyExport: exportSettings,
          tallyUpdatedAt: new Date()
        },
        { merge: true }
      )
    } catch (error) {
      console.error('Error saving Tally settings:', error)
      setLoadError('Unable to save Tally settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const isConfigured =
    tallySettings.enabled &&
    Boolean(tallySettings.serverUrl.trim()) &&
    Boolean(tallySettings.companyName.trim())

  const connectionValue = isConfigured ? 'Configured' : 'Not Configured'
  const connectionHint = tallySettings.serverUrl
    ? `Server: ${tallySettings.serverUrl}:${tallySettings.port}`
    : 'Server not set'

  const syncLabel =
    tallySettings.syncMode === 'manual'
      ? 'Manual'
      : tallySettings.syncMode === 'hourly'
        ? 'Hourly'
        : 'Daily'

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
                Tally <span className="text-[#039ED9]">Integration</span>
              </h1>
              <p className="text-slate-600 text-lg">
                Manage the connection, sync rules, and export preferences for Tally.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#039ED9] text-white rounded-xl font-bold text-sm"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {loadError && (
            <div className="mt-4 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Connection"
            value={connectionValue}
            icon={Landmark}
            color={isConfigured ? 'green' : 'red'}
            hint={connectionHint}
          />
          <StatCard
            title="Sync Mode"
            value={syncLabel}
            icon={RefreshCw}
            color="blue"
            hint={tallySettings.enabled ? 'Sync enabled' : 'Sync disabled'}
          />
          <StatCard
            title="Voucher Type"
            value={tallySettings.voucherType}
            icon={Receipt}
            color="purple"
            hint="Default voucher mapping"
          />
          <StatCard
            title="Export"
            value={exportSettings.enabled ? 'Enabled' : 'Disabled'}
            icon={DownloadCloud}
            color="orange"
            hint={`Format: ${exportSettings.format.toUpperCase()}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <SectionCard title="Tally Connection" icon={Landmark}>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 p-4">
                <div>
                  <p className="font-bold text-slate-900">Enable Tally Sync</p>
                  <p className="text-sm text-slate-500">Allow exports and sync from this portal.</p>
                </div>
                <button
                  onClick={() => handleTallyChange('enabled', !tallySettings.enabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    tallySettings.enabled ? 'bg-green-600' : 'bg-slate-300'
                  }`}
                  disabled={isSaving}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      tallySettings.enabled ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Tally Server URL</label>
                  <input
                    type="text"
                    value={tallySettings.serverUrl}
                    onChange={(event) => handleTallyChange('serverUrl', event.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none"
                    placeholder="http://localhost"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Port</label>
                  <input
                    type="text"
                    value={tallySettings.port}
                    onChange={(event) => handleTallyChange('port', event.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none"
                    placeholder="9000"
                    disabled={isSaving}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-600 mb-2">Company Name (Tally)</label>
                  <input
                    type="text"
                    value={tallySettings.companyName}
                    onChange={(event) => handleTallyChange('companyName', event.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none"
                    placeholder="HOMEWORK CLEANING SERVICES LLC"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Ensure the Tally server is reachable from the hosting environment before enabling sync.
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Sync Controls" icon={RefreshCw}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Sync Mode</label>
                <select
                  value={tallySettings.syncMode}
                  onChange={(event) => handleTallyChange('syncMode', event.target.value as TallySettings['syncMode'])}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none"
                  disabled={isSaving}
                >
                  <option value="manual">Manual Only</option>
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Default Voucher Type</label>
                <select
                  value={tallySettings.voucherType}
                  onChange={(event) =>
                    handleTallyChange('voucherType', event.target.value as TallySettings['voucherType'])
                  }
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none"
                  disabled={isSaving}
                >
                  <option value="Sales">Sales</option>
                  <option value="Receipt">Receipt</option>
                  <option value="Journal">Journal</option>
                </select>
              </div>

              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Use manual sync while validating mapping. Switch to automated schedules after verification.
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-8">
          <SectionCard title="Export Preferences" icon={DownloadCloud}>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 p-4">
                <div>
                  <p className="font-bold text-slate-900">Enable Auto Export</p>
                  <p className="text-sm text-slate-500">Prepare export batches when sync runs.</p>
                </div>
                <button
                  onClick={() => handleExportChange('enabled', !exportSettings.enabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    exportSettings.enabled ? 'bg-green-600' : 'bg-slate-300'
                  }`}
                  disabled={isSaving}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      exportSettings.enabled ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Export Format</label>
                  <select
                    value={exportSettings.format}
                    onChange={(event) => handleExportChange('format', event.target.value as TallyExportSettings['format'])}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none"
                    disabled={isSaving}
                  >
                    <option value="csv">CSV</option>
                    <option value="xml">XML</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Batch Size</label>
                  <input
                    type="text"
                    value={exportSettings.batchSize}
                    onChange={(event) => handleExportChange('batchSize', event.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none"
                    placeholder="200"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 rounded-xl border-2 border-slate-200 p-3 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeJobs}
                    onChange={(event) => handleExportChange('includeJobs', event.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    disabled={isSaving}
                  />
                  Jobs & Payments
                </label>
                <label className="flex items-center gap-2 rounded-xl border-2 border-slate-200 p-3 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeQuotations}
                    onChange={(event) => handleExportChange('includeQuotations', event.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    disabled={isSaving}
                  />
                  Quotations
                </label>
                <label className="flex items-center gap-2 rounded-xl border-2 border-slate-200 p-3 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeBookings}
                    onChange={(event) => handleExportChange('includeBookings', event.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    disabled={isSaving}
                  />
                  Bookings
                </label>
              </div>

              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Export preferences define which datasets are queued for Tally sync and reporting.
              </div>
            </div>
          </SectionCard>
        </div>

        {isLoading && (
          <div className="mt-8 text-sm font-bold text-slate-500">Loading Tally settings...</div>
        )}
      </div>
    </div>
  )
}
