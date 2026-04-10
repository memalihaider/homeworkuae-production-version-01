'use client'

import { useState, useEffect, useMemo, useCallback, type ComponentType, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Banknote,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  FileText,
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Package,
  Award,
  Target,
  Wallet,
  Landmark,
  FileSpreadsheet,
  DownloadCloud,
  Printer,
  Zap,
  Activity,
  AlertTriangle,
  PiggyBank,
  Calculator,
  ChartPie,
  ChartBar,
  ChartLine,
  Globe2,
  Receipt,
  HardHat,
  Building,
  Layers,
  Box} from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  subMonths,
  parseISO,
  isWithinInterval,
} from 'date-fns'
import * as XLSX from 'xlsx'
import SearchSuggestSelect from '@/components/ui/search-suggest-select'

type TimestampLike = Date | string | { seconds: number } | { toDate: () => Date } | null | undefined
type GenericRecord = Record<string, unknown>

const parseTimestampLike = (value: TimestampLike): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const parsed = parseISO(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate()
  }
  if (typeof value === 'object' && 'seconds' in value && typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000)
  }
  return null
}

const normalizeJobPaymentStatus = (value?: string): string => {
  if (!value) return 'Pending'
  const normalized = value.trim().toLowerCase()
  if (normalized === 'paid') return 'Paid'
  if (normalized === 'partially paid') return 'Partially Paid'
  if (normalized === 'collect after job') return 'Collect After Job'
  return 'Pending'
}

const normalizeQuotationStatus = (value?: string): string => {
  if (!value) return 'sent'
  const normalized = value.trim().toLowerCase()
  if (normalized === 'draft') return 'sent'
  return normalized
}

const parseDurationToMinutes = (value?: string): number | null => {
  if (!value) return null
  const raw = value.trim().toLowerCase()
  if (!raw) return null

  const normalized = raw.replace(/,/g, ' ')
  const hourMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)/)
  const minuteMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(m|min|mins|minute|minutes)/)

  const hoursFromUnits = hourMatch ? Number(hourMatch[1]) : 0
  const minutesFromUnits = minuteMatch ? Number(minuteMatch[1]) : 0
  const totalFromUnits = Math.round((hoursFromUnits * 60) + minutesFromUnits)
  if (totalFromUnits > 0) return totalFromUnits

  const hhmmMatch = normalized.match(/^(\d{1,2}):(\d{2})$/)
  if (hhmmMatch) {
    const hours = Number(hhmmMatch[1])
    const minutes = Number(hhmmMatch[2])
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      return (hours * 60) + minutes
    }
  }

  const numeric = Number(normalized)
  if (!Number.isNaN(numeric) && numeric > 0) {
    return numeric <= 24 ? Math.round(numeric * 60) : Math.round(numeric)
  }

  return null
}

const formatMinutesAsDuration = (minutes?: number | null): string => {
  if (minutes == null || Number.isNaN(minutes) || minutes < 0) return 'N/A'
  const safe = Math.round(minutes)
  const hours = Math.floor(safe / 60)
  const mins = safe % 60
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
  if (hours > 0) return `${hours}h`
  return `${mins}m`
}

const safeText = (value: unknown, fallback = 'N/A'): string => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    const flattened = value
      .map(item => safeText(item, ''))
      .filter(Boolean)
      .join(', ')
    return flattened || fallback
  }

  if (typeof value === 'object') {
    if ('name' in value && typeof (value as { name?: unknown }).name === 'string') {
      return (value as { name: string }).name
    }
    if ('title' in value && typeof (value as { title?: unknown }).title === 'string') {
      return (value as { title: string }).title
    }
    if ('type' in value && typeof (value as { type?: unknown }).type === 'string') {
      return (value as { type: string }).type
    }

    try {
      return JSON.stringify(value)
    } catch {
      return fallback
    }
  }

  return fallback
}

const normalizeIdentityKey = (value: string): string => value.trim().toLowerCase()

// ============= INTERFACES =============

interface Survey {
  id: string
  title: string
  description: string
  category: string
  status: string
  createdAt: TimestampLike
  selectedClient?: {
    id: string
    name: string
    email: string
    phone: string
    company: string
    type: string
  }
  responsesCount: number
  sections: GenericRecord[]
  surveyType: string
  generatedFrom: string
  leadId?: string
}

interface Quotation {
  id: string
  quoteNumber: string
  client: string
  clientId: string
  company: string
  email: string
  phone: string
  location: string
  date: string
  validUntil: string
  dueDate: string
  status: string
  subtotal: number
  discount: number
  discountAmount: number
  discountType: string
  taxAmount: number
  taxRate: number
  total: number
  services: Array<{
    id: string
    name: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  products?: Array<{
    id: string
    name: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  currency: string
  createdBy: string
  assignedTo?: string
  assignedToId?: string
  showAssignedToInPdf?: boolean
  createdAt: TimestampLike
  updatedAt: TimestampLike
  template: string
  terms: string
  notes: string
  paymentMethods: string[]
  bankDetails: GenericRecord
}

interface Job {
  id: string
  title: string
  description: string
  client: string
  clientId: string
  location: string
  status: string
  paymentStatus?: string
  paymentMethod?: string
  priority: string
  riskLevel: string
  scheduledDate: string
  scheduledTime: string
  completedAt: TimestampLike
  estimatedDuration: string
  estimatedDurationMinutes?: number
  actualDuration?: string
  actualDurationMinutes?: number
  timePerformanceStatus?: 'On Time' | 'Delayed' | 'Unknown'
  timePerformanceDeltaMinutes?: number
  timePerformanceNote?: string
  budget: number
  actualCost: number
  teamRequired: number
  jobCreatedBy?: string
  jobResponsibleBy?: string
  assignedTo?: string[]
  assignedEmployees: GenericRecord[]
  requiredSkills: string[]
  equipment: GenericRecord[]
  milestones: GenericRecord[]
  tasks: GenericRecord[]
  executionLogs: GenericRecord[]
  permits: GenericRecord[]
  tags: string[]
  specialInstructions: string
  slaDeadline: string
  recurring: boolean
  reminderEnabled: boolean
  overtimeRequired: boolean
  overtimeHours: number
  overtimeApproved: boolean
  employeeFeedback?: GenericRecord[]
  feedback?: GenericRecord
  createdAt: TimestampLike
  updatedAt: TimestampLike
}

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  role: string
  status: string
  rating: number
  salary: number
  salaryStructure: string
  bankAccount: string
  bankName: string
  joinDate: string
  dateOfBirth: string
  nationality: string
  emiratesIdNumber: string
  passportNumber: string
  visaNumber: string
  visaExpiryDate: string
  emergencyContact: string
  emergencyPhone: string
  emergencyRelation: string
  supervisor: string
  assignedRoles: string[]
  team: GenericRecord[]
  documents: GenericRecord[]
  burnoutRisk: string
  createdAt: TimestampLike
  lastUpdated: TimestampLike
}

interface UserRoleEntry {
  id: string
  name: string
  email: string
  portal: string
  roleName: string
  employeeId?: string
  employeeName?: string
  createdAt?: TimestampLike
}

interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  status: string
  overtimeHours: number
}

interface StaffReportRow {
  id: string
  employeeId?: string
  name: string
  email: string
  department: string
  role: string
  status: string
  salary: number
  rating: number
  attendanceDays: number
  leaveDays: number
  absentDays: number
  lateDays: number
  overtimeDays: number
  overtimeHours: number
}

interface JobTimePerformanceRow {
  id: string
  title: string
  client: string
  createdBy: string
  responsible: string
  teamMembers: string
  estimatedLabel: string
  actualLabel: string
  deltaMinutes: number
  timeStatus: 'On Time' | 'Delayed' | 'Unknown'
  timeNote: string
  teamMemberList: string[]
}

interface TeamMemberProductivityRow {
  memberName: string
  totalJobs: number
  onTimeJobs: number
  delayedJobs: number
  unknownJobs: number
  productivityScore: number
  averageDeltaMinutes: number
}

interface Booking {
  id: string
  bookingId: string
  name: string
  email: string
  phone: string
  area: string
  service: string
  date: string
  time: string
  status: string
  frequency: string
  propertyType: string
  message: string
  createdAt: TimestampLike
  updatedAt: TimestampLike
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  isActive: boolean
  itemCount: number
  createdAt: TimestampLike
  updatedAt: TimestampLike
}

interface Service {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  categoryName: string
  price: number
  cost: number
  profitMargin: number
  sku: string
  unit: string
  type: string
  status: string
  isActive: boolean
  imageUrl: string
  createdAt: TimestampLike
  updatedAt: TimestampLike
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  categoryName: string
  price: number
  cost: number
  profitMargin: number
  sku: string
  unit: string
  type: string
  status: string
  isActive: boolean
  stock: number
  minStock: number
  imageUrl: string
  createdAt: TimestampLike
  updatedAt: TimestampLike
}

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  location: string
  joinDate: string
  totalSpent: number
  projects: number
  lastService: string
  status: string
  tier: string
  notes: string
  contracts: GenericRecord[]
  createdAt: TimestampLike
  updatedAt: TimestampLike
}

interface LeadRecord {
  id: string
  name: string
  status: string
  value: number
  createdBy: string
  createdAt: TimestampLike
}

interface PersonPerformanceRow {
  personKey: string
  name: string
  role: string
  personType: 'Admin' | 'Employee' | 'Unknown'
  quotationsSent: number
  totalQuotationValue: number
  averageQuotationValue: number
  wonQuotations: number
  wonQuotationValue: number
  pendingQuotations: number
  pendingQuotationValue: number
  valueConversionRate: number
  completedQuotations: number
  completedQuotationValue: number
  wonLeads: number
  wonLeadValue: number
  lostLeads: number
  qualifiedLeads: number
  contactedLeads: number
  newLeads: number
  jobsCreated: number
  jobsAssigned: number
  jobValue: number
  generatedRevenue: number
}

// ============= FINANCIAL METRICS INTERFACE =============

interface FinancialMetrics {
  // Revenue metrics
  totalRevenue: number
  monthlyRevenue: number
  quarterlyRevenue: number
  yearlyRevenue: number
  averageOrderValue: number
  revenueGrowth: number
  projectedRevenue: number
  
  // Service Revenue
  serviceRevenue: number
  serviceCost: number
  serviceProfit: number
  serviceMargin: number
  topServices: Array<{name: string, revenue: number, profit: number, quantity: number, margin: number}>
  servicesByCategory: Array<{category: string, revenue: number, count: number}>
  
  // Product Revenue
  productRevenue: number
  productCost: number
  productProfit: number
  productMargin: number
  inventoryValue: number
  lowStockItems: number
  topProducts: Array<{name: string, revenue: number, profit: number, quantity: number, margin: number, stock: number}>
  productsByCategory: Array<{category: string, revenue: number, count: number}>
  
  // Quotation metrics
  totalQuotations: number
  approvedQuotations: number
  approvedValue: number
  completedQuotationValue: number
  pendingQuotations: number
  rejectedQuotations: number
  draftQuotations: number
  quotationValue: number
  conversionRate: number
  
  // Job metrics
  totalJobs: number
  completedJobs: number
  inProgressJobs: number
  pendingJobs: number
  cancelledJobs: number
  jobRevenue: number
  jobCost: number
  jobProfit: number
  jobMargin: number
  paidJobs: number
  unpaidJobs: number
  collectAfterJobJobs: number
  onTimeJobs: number
  delayedJobs: number
  totalJobReviews: number
  reviewedJobs: number
  avgJobReviewRating: number
  
  // Client metrics
  totalClients: number
  activeClients: number
  newClients: number
  clientLTV: number
  repeatRate: number
  topClients: Array<{name: string, spent: number, projects: number, tier: string}>
  
  // Employee metrics
  totalEmployees: number
  activeEmployees: number
  totalPayroll: number
  averageSalary: number
  employeeCost: number
  departmentCosts: Array<{department: string, cost: number, count: number}>
  
  // Survey metrics
  totalSurveys: number
  completedSurveys: number
  surveyResponses: number
  
  // Booking metrics
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  cancelledBookings: number
  bookingValue: number
  
  // Category metrics
  totalCategories: number
  activeCategories: number
  categoriesWithItems: Array<{name: string, count: number}>
  
  // Tax metrics
  totalTax: number
  averageTaxRate: number
  
  // Discount metrics
  totalDiscounts: number
  averageDiscount: number
  
  // Profit & Loss
  grossProfit: number
  netProfit: number
  operatingExpenses: number
  profitMargin: number
  roi: number
}

// ============= DATE RANGE TYPE =============

type DateRangeType = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom' | 'all'
type ActiveTab =
  | 'overview'
  | 'revenue'
  | 'profit-loss'
  | 'quotations'
  | 'jobs'
  | 'clients'
  | 'employees'
  | 'services'
  | 'products'
  | 'bookings'
  | 'surveys'
  | 'categories'
type SortByType = 'date' | 'value' | 'name'
type ExportFormatType = 'pdf' | 'excel' | 'csv'

type MetricCardProps = {
  title: string
  value: string | number
  icon: ComponentType<{ className?: string }>
  trend?: number
  trendLabel?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'red' | 'amber' | 'emerald'
  subValue?: string
  tooltip?: string
}

type TableCardProps = {
  title: string
  icon: ComponentType<{ className?: string }>
  children: ReactNode
  action?: ReactNode
  className?: string
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend = 0,
  trendLabel = '',
  color = 'blue',
  subValue = '',
  tooltip = ''
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 border-2 ${colorClasses[color]} bg-white relative group`}
      title={tooltip}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-sm font-bold ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
        {trendLabel && <p className="text-xs text-slate-500 mt-1">{trendLabel}</p>}
      </div>
    </motion.div>
  )
}

function TableCard({ title, icon: Icon, children, action, className = '' }: TableCardProps) {
  return (
    <div className={`bg-white rounded-2xl border-2 border-slate-200 overflow-hidden ${className}`}>
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

// ============= MAIN COMPONENT =============

export default function FinanceReportPage() {
  // ============= STATE MANAGEMENT =============
  
  // Data states
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [roleUsers, setRoleUsers] = useState<UserRoleEntry[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [leads, setLeads] = useState<LeadRecord[]>([])
  
  // UI states
  const [dateRange, setDateRange] = useState<DateRangeType>('all')
  const [customStartDate, setCustomStartDate] = useState<string>(
    format(subMonths(new Date(), 1), 'yyyy-MM-dd')
  )
  const [customEndDate, setCustomEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarView, setCalendarView] = useState<'year' | 'month'>('month')
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('')
  const [employeeRoleFilter, setEmployeeRoleFilter] = useState<string>('all')
  const [employeeDepartmentFilter, setEmployeeDepartmentFilter] = useState<string>('all')
  const [employeeAttendanceFilter, setEmployeeAttendanceFilter] = useState<string>('all')
  const [quotationPersonFilter, setQuotationPersonFilter] = useState<string>('all')
  const [jobTimeStatusFilter, setJobTimeStatusFilter] = useState<'all' | 'on-time' | 'delayed'>('all')
  const [jobTimeMemberFilter, setJobTimeMemberFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortByType>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [exportFormat, setExportFormat] = useState<ExportFormatType>('pdf')
  const [showExportModal, setShowExportModal] = useState(false)

  // ============= DATA FETCHING =============

  async function fetchSurveys() {
    try {
      const q = query(collection(db, 'surveys'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Survey[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          title: docData.title || 'Untitled Survey',
          description: docData.description || '',
          category: docData.category || 'General',
          status: docData.status || 'draft',
          createdAt: docData.createdAt,
          selectedClient: docData.selectedClient,
          responsesCount: docData.responsesCount || 0,
          sections: docData.sections || [],
          surveyType: docData.surveyType || '',
          generatedFrom: docData.generatedFrom || 'manual',
          leadId: docData.leadId
        })
      })
      
      setSurveys(data)
    } catch (error) {
      console.error('Error fetching surveys:', error)
    }
  }

  async function fetchQuotations() {
    try {
      const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Quotation[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          quoteNumber: docData.quoteNumber || `QT-${doc.id.slice(0, 8)}`,
          client: docData.client || 'Unknown Client',
          clientId: docData.clientId || '',
          company: docData.company || '',
          email: docData.email || '',
          phone: docData.phone || '',
          location: docData.location || '',
          date: docData.date || format(new Date(), 'yyyy-MM-dd'),
          validUntil: docData.validUntil || '',
          dueDate: docData.dueDate || '',
          status: docData.status || 'Draft',
          subtotal: docData.subtotal || 0,
          discount: docData.discount || 0,
          discountAmount: docData.discountAmount || 0,
          discountType: docData.discountType || 'percentage',
          taxAmount: docData.taxAmount || 0,
          taxRate: docData.taxRate || 0,
          total: docData.total || 0,
          services: docData.services || [],
          products: docData.products || [],
          currency: docData.currency || 'AED',
          createdBy: docData.createdBy || 'system',
          assignedTo: docData.assignedTo || '',
          assignedToId: docData.assignedToId || '',
          showAssignedToInPdf: Boolean(docData.showAssignedToInPdf),
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt,
          template: docData.template || 'standard',
          terms: docData.terms || '',
          notes: docData.notes || '',
          paymentMethods: docData.paymentMethods || [],
          bankDetails: docData.bankDetails || {}
        })
      })
      
      setQuotations(data)
    } catch (error) {
      console.error('Error fetching quotations:', error)
    }
  }

  async function fetchJobs() {
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Job[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          title: safeText(docData.title, 'Untitled Job'),
          description: safeText(docData.description, ''),
          client: safeText(docData.client, 'Unknown Client'),
          clientId: safeText(docData.clientId, ''),
          location: safeText(docData.location, ''),
          status: safeText(docData.status, 'Pending'),
          paymentStatus: safeText(docData.paymentStatus, 'Pending'),
          paymentMethod: safeText(docData.paymentMethod, 'N/A'),
          priority: safeText(docData.priority, 'Medium'),
          riskLevel: safeText(docData.riskLevel, 'Low'),
          scheduledDate: safeText(docData.scheduledDate, ''),
          scheduledTime: safeText(docData.scheduledTime, ''),
          completedAt: docData.completedAt,
          estimatedDuration: safeText(docData.estimatedDuration, '0'),
          estimatedDurationMinutes: Number(docData.estimatedDurationMinutes || 0),
          actualDuration: safeText(docData.actualDuration, ''),
          actualDurationMinutes: Number(docData.actualDurationMinutes || 0),
          timePerformanceStatus: safeText(docData.timePerformanceStatus, 'Unknown') as Job['timePerformanceStatus'],
          timePerformanceDeltaMinutes: Number(docData.timePerformanceDeltaMinutes || 0),
          timePerformanceNote: safeText(docData.timePerformanceNote, ''),
          budget: docData.budget || 0,
          actualCost: docData.actualCost || 0,
          teamRequired: docData.teamRequired || 1,
          jobCreatedBy: safeText(docData.jobCreatedBy, ''),
          jobResponsibleBy: safeText(docData.jobResponsibleBy, ''),
          assignedTo: Array.isArray(docData.assignedTo) ? docData.assignedTo : [],
          assignedEmployees: docData.assignedEmployees || [],
          requiredSkills: docData.requiredSkills || [],
          equipment: docData.equipment || [],
          milestones: docData.milestones || [],
          tasks: docData.tasks || [],
          executionLogs: docData.executionLogs || [],
          permits: docData.permits || [],
          tags: docData.tags || [],
          specialInstructions: safeText(docData.specialInstructions, ''),
          slaDeadline: safeText(docData.slaDeadline, ''),
          recurring: docData.recurring || false,
          reminderEnabled: docData.reminderEnabled || false,
          overtimeRequired: docData.overtimeRequired || false,
          overtimeHours: docData.overtimeHours || 0,
          overtimeApproved: docData.overtimeApproved || false,
          employeeFeedback: Array.isArray(docData.employeeFeedback) ? docData.employeeFeedback : [],
          feedback: (docData.feedback || {}) as GenericRecord,
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  async function fetchEmployees() {
    try {
      const q = query(collection(db, 'employees'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Employee[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unknown',
          email: docData.email || '',
          phone: docData.phone || '',
          position: docData.position || '',
          department: docData.department || '',
          role: docData.role || '',
          status: docData.status || 'Active',
          rating: docData.rating || 0,
          salary: docData.salary || 0,
          salaryStructure: docData.salaryStructure || 'Monthly',
          bankAccount: docData.bankAccount || '',
          bankName: docData.bankName || '',
          joinDate: docData.joinDate || '',
          dateOfBirth: docData.dateOfBirth || '',
          nationality: docData.nationality || '',
          emiratesIdNumber: docData.emiratesIdNumber || '',
          passportNumber: docData.passportNumber || '',
          visaNumber: docData.visaNumber || '',
          visaExpiryDate: docData.visaExpiryDate || '',
          emergencyContact: docData.emergencyContact || '',
          emergencyPhone: docData.emergencyPhone || '',
          emergencyRelation: docData.emergencyRelation || '',
          supervisor: docData.supervisor || '',
          assignedRoles: docData.assignedRoles || [],
          team: docData.team || [],
          documents: docData.documents || [],
          burnoutRisk: docData.burnoutRisk || 'Low',
          createdAt: docData.createdAt,
          lastUpdated: docData.lastUpdated
        })
      })
      
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  async function fetchRoleUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users-role'))

      const data: UserRoleEntry[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || '',
          email: docData.email || '',
          portal: docData.portal || 'admin',
          roleName: docData.roleName || (docData.portal === 'admin' ? 'admin' : 'employee'),
          employeeId: docData.employeeId || '',
          employeeName: docData.employeeName || '',
          createdAt: docData.createdAt
        })
      })

      setRoleUsers(data)
    } catch (error) {
      console.error('Error fetching role users:', error)
    }
  }

  async function fetchAttendanceRecords() {
    try {
      const q = query(collection(db, 'attendance'), orderBy('date', 'desc'))
      const querySnapshot = await getDocs(q)

      const data: AttendanceRecord[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          employeeId: docData.employeeId || '',
          employeeName: docData.employeeName || '',
          date: docData.date || '',
          status: docData.status || 'Absent',
          overtimeHours: Number(docData.overtimeHours || 0)
        })
      })

      setAttendanceRecords(data)
    } catch (error) {
      console.error('Error fetching attendance records:', error)
    }
  }

  async function fetchBookings() {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Booking[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          bookingId: docData.bookingId || `BK-${doc.id.slice(0, 8)}`,
          name: docData.name || '',
          email: docData.email || '',
          phone: docData.phone || '',
          area: docData.area || '',
          service: docData.service || '',
          date: docData.date || '',
          time: docData.time || '',
          status: docData.status || 'pending',
          frequency: docData.frequency || 'once',
          propertyType: docData.propertyType || '',
          message: docData.message || '',
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  async function fetchCategories() {
    try {
      const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Category[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unnamed Category',
          slug: docData.slug || '',
          description: docData.description || '',
          color: docData.color || '#3B82F6',
          isActive: docData.isActive || false,
          itemCount: docData.itemCount || 0,
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  async function fetchServices() {
    try {
      const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Service[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unnamed Service',
          slug: docData.slug || '',
          description: docData.description || '',
          categoryId: docData.categoryId || '',
          categoryName: docData.categoryName || 'Uncategorized',
          price: docData.price || 0,
          cost: docData.cost || 0,
          profitMargin: docData.profitMargin || 0,
          sku: docData.sku || '',
          unit: docData.unit || 'Hour',
          type: docData.type || 'SERVICE',
          status: docData.status || 'ACTIVE',
          isActive: docData.isActive || false,
          imageUrl: docData.imageUrl || '',
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  async function fetchProducts() {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Product[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unnamed Product',
          slug: docData.slug || '',
          description: docData.description || '',
          categoryId: docData.categoryId || '',
          categoryName: docData.categoryName || 'Uncategorized',
          price: docData.price || 0,
          cost: docData.cost || 0,
          profitMargin: docData.profitMargin || 0,
          sku: docData.sku || '',
          unit: docData.unit || 'Unit',
          type: docData.type || 'PRODUCT',
          status: docData.status || 'ACTIVE',
          isActive: docData.isActive || false,
          stock: docData.stock || 0,
          minStock: docData.minStock || 0,
          imageUrl: docData.imageUrl || '',
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  async function fetchClients() {
    try {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Client[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unknown',
          company: docData.company || '',
          email: docData.email || '',
          phone: docData.phone || '',
          location: docData.location || '',
          joinDate: docData.joinDate || '',
          totalSpent: docData.totalSpent || 0,
          projects: docData.projects || 0,
          lastService: docData.lastService || 'No service yet',
          status: docData.status || 'Active',
          tier: docData.tier || 'Bronze',
          notes: docData.notes || '',
          contracts: docData.contracts || [],
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  async function fetchLeads() {
    try {
      const querySnapshot = await getDocs(collection(db, 'leads'))

      const data: LeadRecord[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        const createdBy = safeText(
          docData.createdBy ||
          docData.createdByName ||
          docData.assignedTo ||
          docData.assignedToName ||
          docData.owner ||
          docData.salesPerson ||
          docData.employeeName ||
          docData.userName,
          'Unassigned'
        )

        data.push({
          id: doc.id,
          name: safeText(docData.name, 'Unknown Lead'),
          status: safeText(docData.status, 'New'),
          value: Number(docData.value || 0),
          createdBy,
          createdAt: docData.createdAt || docData.updatedAt
        })
      })

      setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchSurveys(),
        fetchQuotations(),
        fetchJobs(),
        fetchEmployees(),
        fetchRoleUsers(),
        fetchAttendanceRecords(),
        fetchBookings(),
        fetchCategories(),
        fetchServices(),
        fetchProducts(),
        fetchClients(),
        fetchLeads()
      ])
    }

    void loadAllData()
  }, [])

  // ============= DATE FILTERING =============

  const getDateRange = useMemo(() => {
    const now = new Date()
    
    switch (dateRange) {
      case 'today':
        return {
          start: startOfDay(now),
          end: endOfDay(now)
        }
      case 'week':
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 })
        }
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
      case 'quarter':
        return {
          start: startOfQuarter(now),
          end: endOfQuarter(now)
        }
      case 'year':
        return {
          start: new Date(selectedYear, 0, 1),
          end: new Date(selectedYear, 11, 31)
        }
      case 'custom':
        return {
          start: parseISO(customStartDate),
          end: parseISO(customEndDate)
        }
      case 'all':
      default:
        return {
          start: new Date(2000, 0, 1),
          end: now
        }
    }
  }, [dateRange, selectedYear, customStartDate, customEndDate])

  const isInDateRange = useCallback((date: TimestampLike): boolean => {
    if (!date) return false
    
    let dateObj: Date
    if (date && typeof date === 'object' && 'toDate' in date) {
      dateObj = date.toDate()
    } else if (date && typeof date === 'object' && 'seconds' in date) {
      dateObj = new Date(date.seconds * 1000)
    } else if (typeof date === 'string') {
      dateObj = parseISO(date)
    } else {
      dateObj = new Date(date)
    }
    
    const range = getDateRange
    return isWithinInterval(dateObj, { start: range.start, end: range.end })
  }, [getDateRange])

  // ============= FINANCIAL METRICS CALCULATION =============

  const metrics = useMemo((): FinancialMetrics => {
    // Filter data by date range
    const filteredQuotations = quotations.filter(q => isInDateRange(q.createdAt))
    const filteredJobs = jobs.filter(j => isInDateRange(j.createdAt) || isInDateRange(j.completedAt))
    const filteredBookings = bookings.filter(b => isInDateRange(b.createdAt))
    const filteredSurveys = surveys.filter(s => isInDateRange(s.createdAt))
    const filteredClients = clients.filter(c => {
      if (c.createdAt) {
        return isInDateRange(c.createdAt)
      }
      if (c.joinDate) {
        return isInDateRange(c.joinDate)
      }
      return false
    })

    // ===== SERVICE REVENUE CALCULATIONS =====
    let serviceRevenue = 0
    let serviceCost = 0
    const serviceRevenueMap = new Map<string, { revenue: number, cost: number, quantity: number }>()
    const serviceCategoryMap = new Map<string, { revenue: number, count: number }>()

    filteredQuotations
      .filter(q => q.status === 'Approved' || q.status === 'Completed')
      .forEach(q => {
        q.services?.forEach(s => {
          const service = services.find(svc => svc.name === s.name)
          const revenue = s.total || 0
          const cost = (service?.cost || 0) * (s.quantity || 1)
          
          serviceRevenue += revenue
          serviceCost += cost
          
          // Service breakdown
          const current = serviceRevenueMap.get(s.name) || { revenue: 0, cost: 0, quantity: 0 }
          serviceRevenueMap.set(s.name, {
            revenue: current.revenue + revenue,
            cost: current.cost + cost,
            quantity: current.quantity + (s.quantity || 1)
          })
          
          // Category breakdown
          if (service?.categoryName) {
            const catCurrent = serviceCategoryMap.get(service.categoryName) || { revenue: 0, count: 0 }
            serviceCategoryMap.set(service.categoryName, {
              revenue: catCurrent.revenue + revenue,
              count: catCurrent.count + 1
            })
          }
        })
      })

  const serviceProfit = serviceRevenue - serviceCost
  const serviceMargin = serviceRevenue > 0 ? (serviceProfit / serviceRevenue) * 100 : 0

  // Top Services
  const topServices = Array.from(serviceRevenueMap.entries())
    .map(([name, data]) => ({
      name,
      revenue: data.revenue,
      profit: data.revenue - data.cost,
      quantity: data.quantity,
      margin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  // Services by Category
  const servicesByCategory = Array.from(serviceCategoryMap.entries())
    .map(([category, data]) => ({
      category,
      revenue: data.revenue,
      count: data.count
    }))
    .sort((a, b) => b.revenue - a.revenue)

  // ===== PRODUCT REVENUE CALCULATIONS =====
  let productRevenue = 0
  let productCost = 0
  const productRevenueMap = new Map<string, { revenue: number, cost: number, quantity: number, stock: number }>()
  const productCategoryMap = new Map<string, { revenue: number, count: number }>()

  filteredQuotations
    .filter(q => q.status === 'Approved' || q.status === 'Completed')
    .forEach(q => {
      q.products?.forEach(p => {
        const product = products.find(pr => pr.name === p.name)
        const revenue = p.total || 0
        const cost = (product?.cost || 0) * (p.quantity || 1)
        
        productRevenue += revenue
        productCost += cost
        
        // Product breakdown
        const current = productRevenueMap.get(p.name) || { 
          revenue: 0, 
          cost: 0, 
          quantity: 0,
          stock: product?.stock || 0 
        }
        productRevenueMap.set(p.name, {
          revenue: current.revenue + revenue,
          cost: current.cost + cost,
          quantity: current.quantity + (p.quantity || 1),
          stock: product?.stock || 0
        })
        
        // Category breakdown
        if (product?.categoryName) {
          const catCurrent = productCategoryMap.get(product.categoryName) || { revenue: 0, count: 0 }
          productCategoryMap.set(product.categoryName, {
            revenue: catCurrent.revenue + revenue,
            count: catCurrent.count + 1
          })
        }
      })
    })

  const productProfit = productRevenue - productCost
  const productMargin = productRevenue > 0 ? (productProfit / productRevenue) * 100 : 0

  // Top Products
  const topProducts = Array.from(productRevenueMap.entries())
    .map(([name, data]) => ({
      name,
      revenue: data.revenue,
      profit: data.revenue - data.cost,
      quantity: data.quantity,
      margin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
      stock: data.stock
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  // Products by Category
  const productsByCategory = Array.from(productCategoryMap.entries())
    .map(([category, data]) => ({
      category,
      revenue: data.revenue,
      count: data.count
    }))
    .sort((a, b) => b.revenue - a.revenue)

  // Inventory Value
  const inventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
  const lowStockItems = products.filter(p => (p.stock || 0) <= (p.minStock || 0)).length

  // ===== JOB REVENUE CALCULATIONS =====
  // Job budget is entered at creation time and treated as revenue value.
  const jobRevenue = filteredJobs
    .reduce((sum, j) => sum + (j.budget || 0), 0)
  
  const jobCost = filteredJobs
    .filter(j => j.status === 'Completed')
    .reduce((sum, j) => sum + (j.actualCost || 0), 0)
  
  const jobProfit = jobRevenue - jobCost
  const jobMargin = jobRevenue > 0 ? (jobProfit / jobRevenue) * 100 : 0

  // ===== BOOKING VALUE =====
  const bookingValue = filteredBookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .length * 1000 // Average booking value - you can enhance this

  // ===== QUOTATION METRICS =====
  const totalQuotations = filteredQuotations.length
  const approvedQuotations = filteredQuotations.filter(q => q.status === 'Approved').length
  const completedQuotations = filteredQuotations.filter(q => q.status === 'Completed').length
  const approvedValue = filteredQuotations
    .filter(q => q.status === 'Approved')
    .reduce((sum, q) => sum + (q.total || 0), 0)
  const completedQuotationValue = filteredQuotations
    .filter(q => q.status === 'Completed')
    .reduce((sum, q) => sum + (q.total || 0), 0)
  const pendingQuotations = filteredQuotations.filter(
    q => q.status === 'Pending' || q.status === 'Draft' || q.status === 'Sent'
  ).length
  const rejectedQuotations = filteredQuotations.filter(q => q.status === 'Rejected').length
  const draftQuotations = filteredQuotations.filter(q => q.status === 'Draft').length
  const quotationValue = filteredQuotations.reduce((sum, q) => sum + (q.total || 0), 0)
  const conversionRate = totalQuotations > 0 ? (approvedQuotations / totalQuotations) * 100 : 0

  // ===== JOB METRICS =====
  const totalJobs = filteredJobs.length
  const completedJobs = filteredJobs.filter(j => j.status === 'Completed').length
  const inProgressJobs = filteredJobs.filter(j => j.status === 'In Progress' || j.status === 'Active').length
  const pendingJobs = filteredJobs.filter(j => j.status === 'Pending' || j.status === 'Scheduled').length
  const cancelledJobs = filteredJobs.filter(j => j.status === 'Cancelled').length
  const paidJobs = filteredJobs.filter(j => normalizeJobPaymentStatus(j.paymentStatus) === 'Paid').length
  const collectAfterJobJobs = filteredJobs.filter(j => normalizeJobPaymentStatus(j.paymentStatus) === 'Collect After Job').length
  const unpaidJobs = filteredJobs.filter(j => {
    const paymentStatus = normalizeJobPaymentStatus(j.paymentStatus)
    return paymentStatus === 'Pending' || paymentStatus === 'Partially Paid'
  }).length
  const onTimeJobs = filteredJobs.filter(j => j.timePerformanceStatus === 'On Time').length
  const delayedJobs = filteredJobs.filter(j => j.timePerformanceStatus === 'Delayed').length
  const totalJobReviews = filteredJobs.reduce((sum, job) => {
    const feedbackItems = Array.isArray(job.employeeFeedback) ? job.employeeFeedback.length : 0
    return sum + feedbackItems
  }, 0)
  const reviewedJobs = filteredJobs.filter((job) => {
    const hasEmployeeFeedback = Array.isArray(job.employeeFeedback) && job.employeeFeedback.length > 0
    const npsValue = Number((job.feedback as { npsScore?: unknown })?.npsScore)
    const hasNps = Number.isFinite(npsValue)
    return hasEmployeeFeedback || hasNps
  }).length
  const reviewRatings = filteredJobs.flatMap((job) => {
    if (!Array.isArray(job.employeeFeedback)) return []
    return job.employeeFeedback
      .map((entry) => Number((entry as { rating?: unknown }).rating))
      .filter((rating) => Number.isFinite(rating) && rating > 0)
  })
  const avgJobReviewRating = reviewRatings.length > 0
    ? reviewRatings.reduce((sum, rating) => sum + rating, 0) / reviewRatings.length
    : 0

  // ===== CLIENT METRICS =====
  const totalClients = filteredClients.length
  const activeClients = filteredClients.filter(c => c.status === 'Active').length
  const newClients = filteredClients.length
  const clientLTV = activeClients > 0 ? approvedValue / activeClients : 0
  const repeatRate = totalClients > 0 ? 
    (filteredClients.filter(c => c.projects > 1).length / totalClients) * 100 : 0

  // Top Clients
  const topClients = [...filteredClients]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10)
    .map(c => ({ 
      name: c.name, 
      spent: c.totalSpent, 
      projects: c.projects,
      tier: c.tier 
    }))

  // ===== EMPLOYEE METRICS =====
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(
    e => e.status === 'Active' || e.status === 'Working'
  ).length
  const totalPayroll = employees
    .filter(e => e.status === 'Active' || e.status === 'Working')
    .reduce((sum, e) => sum + (e.salary || 0), 0)
  const averageSalary = activeEmployees > 0 ? totalPayroll / activeEmployees : 0
  const employeeCost = totalPayroll

  // Department costs
  const departmentMap = new Map<string, { cost: number, count: number }>()
  employees.forEach(e => {
    if (e.status === 'Active' || e.status === 'Working') {
      const current = departmentMap.get(e.department) || { cost: 0, count: 0 }
      departmentMap.set(e.department, {
        cost: current.cost + (e.salary || 0),
        count: current.count + 1
      })
    }
  })
  const departmentCosts = Array.from(departmentMap.entries())
    .map(([department, data]) => ({ 
      department: department || 'Unassigned', 
      cost: data.cost,
      count: data.count
    }))
    .sort((a, b) => b.cost - a.cost)

  // ===== SURVEY METRICS =====
  const totalSurveys = filteredSurveys.length
  const completedSurveys = filteredSurveys.filter(s => s.status === 'completed' || s.status === 'published').length
  const surveyResponses = filteredSurveys.reduce((sum, s) => sum + (s.responsesCount || 0), 0)

  // ===== BOOKING METRICS =====
  const totalBookings = filteredBookings.length
  const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length
  const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed' || b.status === 'accepted').length
  const completedBookings = filteredBookings.filter(b => b.status === 'completed').length
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length

  // ===== CATEGORY METRICS =====
  const totalCategories = categories.length
  const activeCategories = categories.filter(c => c.isActive).length
  const categoriesWithItems = categories
    .filter(c => c.itemCount > 0)
    .map(c => ({ name: c.name, count: c.itemCount }))
    .sort((a, b) => b.count - a.count)

  // ===== TAX METRICS =====
  const totalTax = filteredQuotations
    .filter(q => q.status === 'Approved')
    .reduce((sum, q) => sum + (q.taxAmount || 0), 0)
  const averageTaxRate = filteredQuotations.length > 0 ? 
    filteredQuotations.reduce((sum, q) => sum + (q.taxRate || 0), 0) / filteredQuotations.length : 0

  // ===== DISCOUNT METRICS =====
  const totalDiscounts = filteredQuotations
    .filter(q => q.status === 'Approved')
    .reduce((sum, q) => sum + (q.discountAmount || 0), 0)
  const averageDiscount = filteredQuotations.length > 0 ? 
    filteredQuotations.reduce((sum, q) => sum + (q.discount || 0), 0) / filteredQuotations.length : 0

  // ===== TOTAL REVENUE =====
  const totalRevenue = serviceRevenue + productRevenue + jobRevenue + bookingValue
  
  // ===== PROFIT & LOSS =====
  const grossProfit = serviceProfit + productProfit + jobProfit
  const operatingExpenses = totalPayroll
  const netProfit = grossProfit - operatingExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  const roi = operatingExpenses > 0 ? (netProfit / operatingExpenses) * 100 : 0

  // ===== MONTHLY/QUARTERLY/YEARLY =====
  const monthlyRevenue = totalRevenue
  const quarterlyRevenue = totalRevenue
  const yearlyRevenue = totalRevenue
  const averageOrderValue = approvedQuotations > 0 ? approvedValue / approvedQuotations : 0

  return {
    // Revenue
    totalRevenue,
    monthlyRevenue,
    quarterlyRevenue,
    yearlyRevenue,
    averageOrderValue,
    revenueGrowth: 0,
    projectedRevenue: totalRevenue * 1.1,
    
    // Service
    serviceRevenue,
    serviceCost,
    serviceProfit,
    serviceMargin,
    topServices,
    servicesByCategory,
    
    // Product
    productRevenue,
    productCost,
    productProfit,
    productMargin,
    inventoryValue,
    lowStockItems,
    topProducts,
    productsByCategory,
    
    // Quotations
    totalQuotations,
    approvedQuotations,
    approvedValue,
    completedQuotationValue,
    pendingQuotations,
    rejectedQuotations,
    draftQuotations,
    quotationValue,
    conversionRate,
    
    // Jobs
    totalJobs,
    completedJobs,
    inProgressJobs,
    pendingJobs,
    cancelledJobs,
    jobRevenue,
    jobCost,
    jobProfit,
    jobMargin,
    paidJobs,
    unpaidJobs,
    collectAfterJobJobs,
    onTimeJobs,
    delayedJobs,
    totalJobReviews,
    reviewedJobs,
    avgJobReviewRating,
    
    // Clients
    totalClients,
    activeClients,
    newClients,
    clientLTV,
    repeatRate,
    topClients,
    
    // Employees
    totalEmployees,
    activeEmployees,
    totalPayroll,
    averageSalary,
    employeeCost,
    departmentCosts,
    
    // Surveys
    totalSurveys,
    completedSurveys,
    surveyResponses,
    
    // Bookings
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    bookingValue,
    
    // Categories
    totalCategories,
    activeCategories,
    categoriesWithItems,
    
    // Tax
    totalTax,
    averageTaxRate,
    
    // Discount
    totalDiscounts,
    averageDiscount,
    
    // P&L
    grossProfit,
    netProfit,
    operatingExpenses,
    profitMargin,
    roi
  }
}, [quotations, jobs, employees, bookings, surveys, categories, services, products, clients, isInDateRange])

  const filteredQuotationsInRange = useMemo(() => {
    return quotations.filter(q => isInDateRange(q.createdAt))
  }, [quotations, isInDateRange])

  const filteredJobsInRange = useMemo(() => {
    return jobs.filter(job => isInDateRange(job.createdAt) || isInDateRange(job.completedAt) || isInDateRange(job.scheduledDate))
  }, [jobs, isInDateRange])

  const jobTimePerformanceRows = useMemo<JobTimePerformanceRow[]>(() => {
    return filteredJobsInRange.map((job) => {
      const estimatedMinutes = (job.estimatedDurationMinutes && job.estimatedDurationMinutes > 0)
        ? job.estimatedDurationMinutes
        : (parseDurationToMinutes(job.estimatedDuration) || 0)

      const actualMinutes = (job.actualDurationMinutes && job.actualDurationMinutes > 0)
        ? job.actualDurationMinutes
        : (parseDurationToMinutes(job.actualDuration) || 0)

      const fallbackStatus: JobTimePerformanceRow['timeStatus'] =
        estimatedMinutes > 0 && actualMinutes > 0
          ? (actualMinutes <= estimatedMinutes ? 'On Time' : 'Delayed')
          : 'Unknown'

      const createdByName = safeText(employees.find(e => e.id === safeText(job.jobCreatedBy, ''))?.name, 'N/A')
      const responsibleName = safeText(employees.find(e => e.id === safeText(job.jobResponsibleBy, ''))?.name, 'N/A')
      const teamMembers =
        (job.assignedEmployees || [])
          .map((emp) => safeText((emp as GenericRecord).name, ''))
          .filter(Boolean)
          .join(', ') || safeText((job.assignedTo || []).join(', '), 'N/A')

      const teamMemberList =
        (job.assignedEmployees || [])
          .map((emp) => safeText((emp as GenericRecord).name, ''))
          .filter(Boolean)

      return {
        id: job.id,
        title: safeText(job.title, 'Untitled Job'),
        client: safeText(job.client, 'Unknown Client'),
        createdBy: createdByName,
        responsible: responsibleName,
        teamMembers,
        estimatedLabel: estimatedMinutes > 0 ? formatMinutesAsDuration(estimatedMinutes) : safeText(job.estimatedDuration, 'N/A'),
        actualLabel: actualMinutes > 0 ? formatMinutesAsDuration(actualMinutes) : safeText(job.actualDuration, 'N/A'),
        deltaMinutes: Number(job.timePerformanceDeltaMinutes ?? (actualMinutes - estimatedMinutes)),
        timeStatus: (job.timePerformanceStatus || fallbackStatus),
        timeNote: safeText(job.timePerformanceNote, ''),
        teamMemberList
      }
    })
  }, [filteredJobsInRange, employees])

  const jobTimeMemberOptions = useMemo(() => {
    const members = new Set<string>()
    jobTimePerformanceRows.forEach((row) => {
      row.teamMemberList.forEach((name) => {
        if (name && name !== 'N/A') members.add(name)
      })
    })

    return [
      { value: 'all', label: 'All Team Members' },
      ...Array.from(members).sort((a, b) => a.localeCompare(b)).map((name) => ({
        value: name,
        label: name
      }))
    ]
  }, [jobTimePerformanceRows])

  const filteredJobTimePerformanceRows = useMemo(() => {
    return jobTimePerformanceRows.filter((row) => {
      const matchesStatus =
        jobTimeStatusFilter === 'all'
          ? true
          : jobTimeStatusFilter === 'on-time'
            ? row.timeStatus === 'On Time'
            : row.timeStatus === 'Delayed'

      const matchesMember =
        jobTimeMemberFilter === 'all'
          ? true
          : row.teamMemberList.includes(jobTimeMemberFilter)

      return matchesStatus && matchesMember
    })
  }, [jobTimePerformanceRows, jobTimeStatusFilter, jobTimeMemberFilter])

  const teamMemberProductivityRows = useMemo<TeamMemberProductivityRow[]>(() => {
    const map = new Map<string, TeamMemberProductivityRow>()

    filteredJobTimePerformanceRows.forEach((row) => {
      row.teamMemberList.forEach((memberName) => {
        if (!memberName || memberName === 'N/A') return

        const current = map.get(memberName) || {
          memberName,
          totalJobs: 0,
          onTimeJobs: 0,
          delayedJobs: 0,
          unknownJobs: 0,
          productivityScore: 0,
          averageDeltaMinutes: 0
        }

        current.totalJobs += 1
        if (row.timeStatus === 'On Time') current.onTimeJobs += 1
        else if (row.timeStatus === 'Delayed') current.delayedJobs += 1
        else current.unknownJobs += 1

        current.averageDeltaMinutes += row.deltaMinutes
        map.set(memberName, current)
      })
    })

    return Array.from(map.values())
      .map((row) => {
        const scoredJobs = row.onTimeJobs + row.delayedJobs
        const productivityScore = scoredJobs > 0 ? (row.onTimeJobs / scoredJobs) * 100 : 0
        const averageDeltaMinutes = row.totalJobs > 0 ? row.averageDeltaMinutes / row.totalJobs : 0
        return {
          ...row,
          productivityScore,
          averageDeltaMinutes
        }
      })
      .sort((a, b) => b.productivityScore - a.productivityScore)
  }, [filteredJobTimePerformanceRows])

  const filteredLeadsInRange = useMemo(() => {
    return leads.filter(lead => isInDateRange(lead.createdAt))
  }, [leads, isInDateRange])

  const personPerformanceRows = useMemo<PersonPerformanceRow[]>(() => {
    const staffByEmail = new Map<string, { name: string; role: string; personType: 'Admin' | 'Employee' | 'Unknown' }>()
    const staffByName = new Map<string, { name: string; role: string; personType: 'Admin' | 'Employee' | 'Unknown' }>()
    const staffById = new Map<string, { name: string; role: string; personType: 'Admin' | 'Employee' | 'Unknown' }>()
    const rows = new Map<string, PersonPerformanceRow>()

    roleUsers.forEach((user) => {
      const resolvedName = user.employeeName || user.name || user.email || 'Unknown'
      const roleName = user.roleName || user.portal || 'Admin'
      const personType: 'Admin' | 'Employee' | 'Unknown' = roleName.toLowerCase().includes('employee') ? 'Employee' : 'Admin'
      const entry = { name: resolvedName, role: roleName, personType }

      if (user.email) {
        staffByEmail.set(normalizeIdentityKey(user.email), entry)
      }
      if (resolvedName) {
        staffByName.set(normalizeIdentityKey(resolvedName), entry)
      }
      if (user.employeeId) {
        staffById.set(user.employeeId, entry)
      }
    })

    employees.forEach((employee) => {
      const entry = {
        name: employee.name || 'Unknown',
        role: employee.role || employee.position || 'Employee',
        personType: 'Employee' as const
      }

      if (employee.email) {
        const emailKey = normalizeIdentityKey(employee.email)
        if (!staffByEmail.has(emailKey)) {
          staffByEmail.set(emailKey, entry)
        }
      }

      if (employee.name) {
        const nameKey = normalizeIdentityKey(employee.name)
        if (!staffByName.has(nameKey)) {
          staffByName.set(nameKey, entry)
        }
      }

      if (employee.id && !staffById.has(employee.id)) {
        staffById.set(employee.id, entry)
      }
    })

    const getIdentityFromEmployeeId = (employeeId?: string) => {
      if (!employeeId) return ''
      const profile = staffById.get(employeeId)
      return profile?.name || ''
    }

    const getOrCreateRow = (rawIdentity: string): PersonPerformanceRow => {
      const normalized = normalizeIdentityKey(rawIdentity || 'unassigned')
      const fallbackName = rawIdentity?.trim() || 'Unassigned'
      const profile = staffByEmail.get(normalized) || staffByName.get(normalized)

      if (!rows.has(normalized)) {
        rows.set(normalized, {
          personKey: normalized,
          name: profile?.name || fallbackName,
          role: profile?.role || 'Unknown',
          personType: profile?.personType || 'Unknown',
          quotationsSent: 0,
          totalQuotationValue: 0,
          averageQuotationValue: 0,
          wonQuotations: 0,
          wonQuotationValue: 0,
          pendingQuotations: 0,
          pendingQuotationValue: 0,
          valueConversionRate: 0,
          completedQuotations: 0,
          completedQuotationValue: 0,
          wonLeads: 0,
          wonLeadValue: 0,
          lostLeads: 0,
          qualifiedLeads: 0,
          contactedLeads: 0,
          newLeads: 0,
          jobsCreated: 0,
          jobsAssigned: 0,
          jobValue: 0,
          generatedRevenue: 0
        })
      }

      return rows.get(normalized) as PersonPerformanceRow
    }

    filteredQuotationsInRange.forEach((quotation) => {
      const creator = safeText(quotation.createdBy, 'Unassigned')
      const quotationValue = Number(quotation.total || 0)
      const quotationStatus = normalizeQuotationStatus(quotation.status)

      const assignee = safeText(quotation.assignedTo, '')
      const people = [creator]
      if (assignee && normalizeIdentityKey(assignee) !== normalizeIdentityKey(creator)) {
        people.push(assignee)
      }

      people.forEach((person) => {
        const row = getOrCreateRow(person)
        row.quotationsSent += 1
        row.totalQuotationValue += quotationValue

        if (quotationStatus === 'completed') {
          row.completedQuotations += 1
          row.completedQuotationValue += quotationValue
        }

        if (quotationStatus === 'won' || quotationStatus === 'approved' || quotationStatus === 'completed') {
          row.wonQuotations += 1
          row.wonQuotationValue += quotationValue
        }

        if (quotationStatus === 'pending' || quotationStatus === 'sent') {
          row.pendingQuotations += 1
          row.pendingQuotationValue += quotationValue
        }
      })
    })

    filteredLeadsInRange.forEach((lead) => {
      const owner = safeText(lead.createdBy, 'Unassigned')
      const row = getOrCreateRow(owner)
      const status = normalizeIdentityKey(lead.status)
      const value = Number(lead.value || 0)

      if (status.includes('won')) {
        row.wonLeads += 1
        row.wonLeadValue += value
      } else if (status.includes('lost')) {
        row.lostLeads += 1
      } else if (status.includes('qualif')) {
        row.qualifiedLeads += 1
      } else if (status.includes('contact')) {
        row.contactedLeads += 1
      } else if (status.includes('new')) {
        row.newLeads += 1
      }
    })

    filteredJobsInRange.forEach((job) => {
      const jobValue = Number(job.budget || 0)

      const creatorName = getIdentityFromEmployeeId(job.jobCreatedBy) || safeText(job.jobCreatedBy, '')
      if (creatorName) {
        const creatorRow = getOrCreateRow(creatorName)
        creatorRow.jobsCreated += 1
        creatorRow.jobValue += jobValue
      }

      const assignedPeople = new Set<string>()
      const responsibleName = getIdentityFromEmployeeId(job.jobResponsibleBy) || safeText(job.jobResponsibleBy, '')
      if (responsibleName) {
        assignedPeople.add(responsibleName)
      }
      ;(job.assignedEmployees || []).forEach((employee: GenericRecord) => {
        const name = safeText(employee.name, '')
        if (name) {
          assignedPeople.add(name)
        }
      })

      ;(job.assignedTo || []).forEach((name) => {
        const safeName = safeText(name, '')
        if (safeName) {
          assignedPeople.add(safeName)
        }
      })

      assignedPeople.forEach((personName) => {
        if (!personName) return
        const row = getOrCreateRow(personName)
        row.jobsAssigned += 1
        row.jobValue += jobValue
      })
    })

    rows.forEach((row) => {
      row.generatedRevenue = row.completedQuotationValue + row.wonLeadValue + row.jobValue
      row.averageQuotationValue = row.quotationsSent > 0 ? row.totalQuotationValue / row.quotationsSent : 0
      row.valueConversionRate = row.totalQuotationValue > 0
        ? (row.wonQuotationValue / row.totalQuotationValue) * 100
        : 0
    })

    return Array.from(rows.values()).sort((a, b) => {
      if (b.generatedRevenue !== a.generatedRevenue) {
        return b.generatedRevenue - a.generatedRevenue
      }
      return a.name.localeCompare(b.name)
    })
  }, [roleUsers, employees, filteredQuotationsInRange, filteredLeadsInRange, filteredJobsInRange])

  const quotationPersonOptions = useMemo(() => {
    return personPerformanceRows.map(row => ({
      key: row.personKey,
      label: `${row.name} (${row.role})`
    }))
  }, [personPerformanceRows])

  const selectedPersonPerformance = useMemo(() => {
    if (quotationPersonFilter === 'all') return personPerformanceRows
    return personPerformanceRows.filter(row => row.personKey === quotationPersonFilter)
  }, [personPerformanceRows, quotationPersonFilter])

  const quotationRowsForTable = useMemo(() => {
    const data = [...filteredQuotationsInRange]
    if (quotationPersonFilter === 'all') {
      return data.slice(0, 20)
    }

    return data
      .filter(q => {
        const creatorKey = normalizeIdentityKey(safeText(q.createdBy, 'Unassigned'))
        const assigneeKey = normalizeIdentityKey(safeText(q.assignedTo, ''))
        return creatorKey === quotationPersonFilter || (!!assigneeKey && assigneeKey === quotationPersonFilter)
      })
      .slice(0, 20)
  }, [filteredQuotationsInRange, quotationPersonFilter])

  const quotationValueSummary = useMemo(() => {
    let totalValue = 0
    let wonValue = 0
    let pendingValue = 0

    filteredQuotationsInRange.forEach((quotation) => {
      const value = Number(quotation.total || 0)
      const status = normalizeQuotationStatus(quotation.status)

      totalValue += value

      if (status === 'won' || status === 'approved' || status === 'completed') {
        wonValue += value
      }

      if (status === 'pending' || status === 'sent') {
        pendingValue += value
      }
    })

    const valueConversionRate = totalValue > 0 ? (wonValue / totalValue) * 100 : 0

    return {
      totalValue,
      wonValue,
      pendingValue,
      valueConversionRate,
    }
  }, [filteredQuotationsInRange])

  // ============= CHART DATA PREPARATION =============

  const monthlyRevenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const data = Array(12).fill(0)
    
    quotations
      .filter(q => q.status === 'Approved' || q.status === 'Completed')
      .forEach(q => {
        const date = parseTimestampLike(q.createdAt)
        if (date && date.getFullYear() === selectedYear) {
          data[date.getMonth()] += q.total
        }
      })
    
    return { labels: months, values: data }
  }, [quotations, selectedYear])

  const filteredAttendanceRecords = useMemo(() => {
    return attendanceRecords.filter(record => isInDateRange(record.date))
  }, [attendanceRecords, isInDateRange])

  const staffReportRows = useMemo<StaffReportRow[]>(() => {
    const emailToEmployee = new Map<string, Employee>()
    const staffMap = new Map<string, StaffReportRow>()

    employees.forEach((employee) => {
      if (employee.email) {
        emailToEmployee.set(employee.email.toLowerCase(), employee)
      }

      staffMap.set(employee.id, {
        id: employee.id,
        employeeId: employee.id,
        name: employee.name || 'Unknown',
        email: employee.email || '',
        department: employee.department || 'Unassigned',
        role: employee.role || employee.position || 'Employee',
        status: employee.status || 'Active',
        salary: Number(employee.salary || 0),
        rating: Number(employee.rating || 0),
        attendanceDays: 0,
        leaveDays: 0,
        absentDays: 0,
        lateDays: 0,
        overtimeDays: 0,
        overtimeHours: 0
      })
    })

    roleUsers.forEach((roleUser) => {
      const normalizedEmail = (roleUser.email || '').toLowerCase()
      const linkedEmployeeByEmail = normalizedEmail ? emailToEmployee.get(normalizedEmail) : undefined
      const linkedEmployeeId = roleUser.employeeId || linkedEmployeeByEmail?.id

      if (linkedEmployeeId && staffMap.has(linkedEmployeeId)) {
        const existing = staffMap.get(linkedEmployeeId)
        if (!existing) return

        const resolvedRole = roleUser.roleName || roleUser.portal || existing.role
        staffMap.set(linkedEmployeeId, {
          ...existing,
          role: resolvedRole
        })
        return
      }

      const syntheticId = `role-${roleUser.id}`
      if (staffMap.has(syntheticId)) return

      staffMap.set(syntheticId, {
        id: syntheticId,
        employeeId: roleUser.employeeId || undefined,
        name: roleUser.employeeName || roleUser.name || roleUser.email || 'Unknown',
        email: roleUser.email || '',
        department: 'Administration',
        role: roleUser.roleName || roleUser.portal || 'Admin',
        status: 'Active',
        salary: 0,
        rating: 0,
        attendanceDays: 0,
        leaveDays: 0,
        absentDays: 0,
        lateDays: 0,
        overtimeDays: 0,
        overtimeHours: 0
      })
    })

    const leaveStatuses = new Set(['Full Leave', 'Sick Leave', 'Annual Leave', 'Casual Leave'])

    filteredAttendanceRecords.forEach((record) => {
      if (!record.employeeId) return
      const row = staffMap.get(record.employeeId)
      if (!row) return

      const status = record.status || 'Absent'
      if (status === 'Absent') {
        row.absentDays += 1
      } else if (status === 'Late') {
        row.attendanceDays += 1
        row.lateDays += 1
      } else if (leaveStatuses.has(status)) {
        row.leaveDays += 1
      } else if (status === 'Present' || status === 'On Job' || status === 'Half Day') {
        row.attendanceDays += 1
      }

      const overtimeHours = Number(record.overtimeHours || 0)
      if (overtimeHours > 0) {
        row.overtimeDays += 1
        row.overtimeHours += overtimeHours
      }
    })

    return Array.from(staffMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [employees, roleUsers, filteredAttendanceRecords])

  const employeeReportRows = useMemo(() => {
    const search = employeeSearchTerm.trim().toLowerCase()

    return staffReportRows.filter((row) => {
      const matchesSearch =
        !search ||
        row.name.toLowerCase().includes(search) ||
        row.email.toLowerCase().includes(search) ||
        row.department.toLowerCase().includes(search) ||
        row.role.toLowerCase().includes(search)

      const matchesRole = employeeRoleFilter === 'all' || row.role.toLowerCase() === employeeRoleFilter.toLowerCase()
      const matchesDepartment = employeeDepartmentFilter === 'all' || row.department === employeeDepartmentFilter
      const matchesAttendanceFilter =
        employeeAttendanceFilter === 'all' ||
        (employeeAttendanceFilter === 'attendance' && row.attendanceDays > 0) ||
        (employeeAttendanceFilter === 'leave' && row.leaveDays > 0) ||
        (employeeAttendanceFilter === 'absent' && row.absentDays > 0) ||
        (employeeAttendanceFilter === 'late' && row.lateDays > 0) ||
        (employeeAttendanceFilter === 'overtime' && row.overtimeDays > 0)

      return matchesSearch && matchesRole && matchesDepartment && matchesAttendanceFilter
    })
  }, [staffReportRows, employeeSearchTerm, employeeRoleFilter, employeeDepartmentFilter, employeeAttendanceFilter])

  const employeeReportSummary = useMemo(() => {
    const staffCount = employeeReportRows.length
    const activeStaff = employeeReportRows.filter(r => r.status === 'Active').length
    const totalPayrollAmount = employeeReportRows.reduce((sum, row) => sum + row.salary, 0)
    const avgSalaryAmount = staffCount > 0 ? totalPayrollAmount / staffCount : 0
    const totalAttendanceDays = employeeReportRows.reduce((sum, row) => sum + row.attendanceDays, 0)
    const totalLeaveDays = employeeReportRows.reduce((sum, row) => sum + row.leaveDays, 0)
    const totalAbsentDays = employeeReportRows.reduce((sum, row) => sum + row.absentDays, 0)
    const totalLateDays = employeeReportRows.reduce((sum, row) => sum + row.lateDays, 0)
    const totalOvertimeHours = employeeReportRows.reduce((sum, row) => sum + row.overtimeHours, 0)

    return {
      staffCount,
      activeStaff,
      totalPayrollAmount,
      avgSalaryAmount,
      totalAttendanceDays,
      totalLeaveDays,
      totalAbsentDays,
      totalLateDays,
      totalOvertimeHours
    }
  }, [employeeReportRows])

  const employeeRoleOptions = useMemo(() => {
    return Array.from(new Set(staffReportRows.map(row => row.role).filter(Boolean))).sort((a, b) => a.localeCompare(b))
  }, [staffReportRows])

  const employeeDepartmentOptions = useMemo(() => {
    return Array.from(new Set(staffReportRows.map(row => row.department).filter(Boolean))).sort((a, b) => a.localeCompare(b))
  }, [staffReportRows])

  const revenueBreakdownData = useMemo(() => {
    return {
      labels: ['Services', 'Products', 'Jobs', 'Bookings'],
      values: [
        metrics.serviceRevenue,
        metrics.productRevenue,
        metrics.jobRevenue,
        metrics.bookingValue
      ],
      colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']
    }
  }, [metrics])

  const profitBreakdownData = useMemo(() => {
    return {
      labels: ['Service Profit', 'Product Profit', 'Job Profit'],
      values: [
        metrics.serviceProfit,
        metrics.productProfit,
        metrics.jobProfit
      ],
      colors: ['#10B981', '#F59E0B', '#8B5CF6']
    }
  }, [metrics])

  const statusFilterOptions = useMemo(() => ([
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
  ]), [])

  const categoryFilterOptions = useMemo(() => ([
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name || 'Unnamed Category' })),
  ]), [categories])

  const sortByOptions = useMemo(() => ([
    { value: 'date', label: 'Sort by Date' },
    { value: 'value', label: 'Sort by Value' },
    { value: 'name', label: 'Sort by Name' },
  ]), [])

  const quotationPersonFilterOptions = useMemo(() => ([
    { value: 'all', label: 'All Profiles' },
    ...quotationPersonOptions.map((option) => ({ value: option.key, label: option.label })),
  ]), [quotationPersonOptions])

  const employeeRoleFilterOptions = useMemo(() => ([
    { value: 'all', label: 'All Roles' },
    ...employeeRoleOptions.map((role) => ({ value: role, label: role })),
  ]), [employeeRoleOptions])

  const employeeDepartmentFilterOptions = useMemo(() => ([
    { value: 'all', label: 'All Departments' },
    ...employeeDepartmentOptions.map((department) => ({ value: department, label: department })),
  ]), [employeeDepartmentOptions])

  const employeeAttendanceFilterOptions = useMemo(() => ([
    { value: 'all', label: 'All Attendance Types' },
    { value: 'attendance', label: 'Has Attendance' },
    { value: 'leave', label: 'Has Leave' },
    { value: 'absent', label: 'Has Absence' },
    { value: 'late', label: 'Has Late Entries' },
    { value: 'overtime', label: 'Has Overtime' },
  ]), [])

  const dateRangeOptions = useMemo(() => ([
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ]), [])

  // ============= RENDER HELPERS =============

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-AE').format(value)
  }

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  const escapeCsvValue = (value: unknown): string => {
    const stringValue = String(value ?? '')
    const escaped = stringValue.replace(/"/g, '""')
    return `"${escaped}"`
  }

  const getJobsForDetailedExport = (): Job[] => {
    return jobs.filter(j => isInDateRange(j.createdAt) || isInDateRange(j.completedAt))
  }

  const getEmployeeRowsForDetailedExport = (): StaffReportRow[] => {
    return employeeReportRows
  }

  const handleExportReport = () => {
    const exportJobs = getJobsForDetailedExport()
    const exportEmployees = getEmployeeRowsForDetailedExport()
    const headers = [
      'Job ID',
      'Title',
      'Client',
      'Location',
      'Job Status',
      'Payment Status',
      'Payment Method',
      'Priority',
      'Risk Level',
      'Scheduled Date',
      'Scheduled Time',
      'Completed At',
      'Estimated Duration',
      'Actual Duration',
      'Time Performance',
      'Time Delta (minutes)',
      'Time Note',
      'Budget (AED)',
      'Actual Cost (AED)',
      'Profit (AED)',
      'Team Required',
      'Created At',
      'Updated At'
    ]

    const employeeHeaders = [
      'Staff ID',
      'Employee ID',
      'Name',
      'Email',
      'Department',
      'Role',
      'Status',
      'Salary (AED)',
      'Attendance Days',
      'Leave Days',
      'Absent Days',
      'Late Days',
      'Overtime Days',
      'Overtime Hours'
    ]

    const rows = exportJobs.map(job => {
      const completedAt = parseTimestampLike(job.completedAt)
      const createdAt = parseTimestampLike(job.createdAt)
      const updatedAt = parseTimestampLike(job.updatedAt)
      return [
        job.id,
        job.title,
        job.client,
        job.location,
        job.status,
        normalizeJobPaymentStatus(job.paymentStatus),
        job.paymentMethod || 'N/A',
        job.priority,
        job.riskLevel,
        job.scheduledDate || 'N/A',
        job.scheduledTime || 'N/A',
        completedAt ? format(completedAt, 'yyyy-MM-dd HH:mm') : 'N/A',
        job.estimatedDuration || 'N/A',
        job.actualDuration || formatMinutesAsDuration(job.actualDurationMinutes),
        job.timePerformanceStatus || 'Unknown',
        String(job.timePerformanceDeltaMinutes ?? ''),
        job.timePerformanceNote || '',
        Number(job.budget || 0).toFixed(2),
        Number(job.actualCost || 0).toFixed(2),
        Number((job.budget || 0) - (job.actualCost || 0)).toFixed(2),
        String(job.teamRequired || 0),
        createdAt ? format(createdAt, 'yyyy-MM-dd HH:mm') : 'N/A',
        updatedAt ? format(updatedAt, 'yyyy-MM-dd HH:mm') : 'N/A'
      ]
    })

    const employeeRows = exportEmployees.map(row => [
      row.id,
      row.employeeId || '',
      row.name,
      row.email,
      row.department,
      row.role,
      row.status,
      Number(row.salary || 0).toFixed(2),
      String(row.attendanceDays),
      String(row.leaveDays),
      String(row.absentDays),
      String(row.lateDays),
      String(row.overtimeDays),
      Number(row.overtimeHours || 0).toFixed(2)
    ])

    const summaryRows = [
      ['Report', 'Deterox Job & Payment Detailed Report'],
      ['Date Range', dateRange],
      ['Total Jobs', String(exportJobs.length)],
      ['Completed Jobs', String(exportJobs.filter(j => j.status === 'Completed').length)],
      ['Pending/Scheduled Jobs', String(exportJobs.filter(j => j.status === 'Pending' || j.status === 'Scheduled').length)],
      ['In Progress Jobs', String(exportJobs.filter(j => j.status === 'In Progress' || j.status === 'Active').length)],
      ['On Time Jobs', String(exportJobs.filter(j => j.timePerformanceStatus === 'On Time').length)],
      ['Delayed Jobs', String(exportJobs.filter(j => j.timePerformanceStatus === 'Delayed').length)],
      ['Paid Jobs', String(exportJobs.filter(j => normalizeJobPaymentStatus(j.paymentStatus) === 'Paid').length)],
      ['Unpaid Jobs', String(exportJobs.filter(j => {
        const paymentStatus = normalizeJobPaymentStatus(j.paymentStatus)
        return paymentStatus === 'Pending' || paymentStatus === 'Partially Paid'
      }).length)],
      ['Collect After Job', String(exportJobs.filter(j => normalizeJobPaymentStatus(j.paymentStatus) === 'Collect After Job').length)],
      [''],
      ['Staff Report (Admins + Employees)', ''],
      ['Total Staff', String(exportEmployees.length)],
      ['Active Staff', String(exportEmployees.filter(row => row.status === 'Active').length)],
      ['Attendance Days', String(exportEmployees.reduce((sum, row) => sum + row.attendanceDays, 0))],
      ['Leave Days', String(exportEmployees.reduce((sum, row) => sum + row.leaveDays, 0))],
      ['Absent Days', String(exportEmployees.reduce((sum, row) => sum + row.absentDays, 0))],
      ['Late Days', String(exportEmployees.reduce((sum, row) => sum + row.lateDays, 0))],
      ['Overtime Hours', Number(exportEmployees.reduce((sum, row) => sum + row.overtimeHours, 0)).toFixed(2)]
    ]

    const exportDate = format(new Date(), 'yyyy-MM-dd_HH-mm')

    if (exportFormat === 'excel') {
      const workbook = XLSX.utils.book_new()
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows)
      const jobsSheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
      const staffSheet = XLSX.utils.aoa_to_sheet([employeeHeaders, ...employeeRows])

      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
      XLSX.utils.book_append_sheet(workbook, jobsSheet, 'Jobs')
      XLSX.utils.book_append_sheet(workbook, staffSheet, 'Staff Report')

      XLSX.writeFile(workbook, `deterox_jobs_staff_report_${exportDate}.xlsx`)
      setShowExportModal(false)
      return
    }

    if (exportFormat === 'pdf') {
      alert('PDF export is not available yet. Exporting CSV instead.')
    }

    const summaryCsv = summaryRows.map(row => row.map(col => escapeCsvValue(col)).join(',')).join('\n')
    const headerCsv = headers.map(header => escapeCsvValue(header)).join(',')
    const detailsCsv = rows.map(row => row.map(col => escapeCsvValue(col)).join(',')).join('\n')
    const employeeHeaderCsv = employeeHeaders.map(header => escapeCsvValue(header)).join(',')
    const employeeDetailsCsv = employeeRows.map(row => row.map(col => escapeCsvValue(col)).join(',')).join('\n')
    const content = `${summaryCsv}\n\n${headerCsv}\n${detailsCsv}\n\n${employeeHeaderCsv}\n${employeeDetailsCsv}`

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `deterox_jobs_staff_report_${exportDate}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setShowExportModal(false)
  }

  const exportRangeLabel =
    dateRange === 'today'
      ? 'Today'
      : dateRange === 'week'
        ? 'This Week'
        : dateRange === 'month'
          ? 'This Month'
          : dateRange === 'quarter'
            ? 'This Quarter'
            : dateRange === 'year'
              ? `Year ${selectedYear}`
              : dateRange === 'custom'
                ? `${format(parseISO(customStartDate), 'MMM d')} - ${format(parseISO(customEndDate), 'MMM d')}`
                : 'All Time'

  const reviewedJobsPercentage = metrics.totalJobs > 0
    ? (metrics.reviewedJobs / metrics.totalJobs) * 100
    : 0

  const wonQuotationValuePercentage = quotationValueSummary.totalValue > 0
    ? (quotationValueSummary.wonValue / quotationValueSummary.totalValue) * 100
    : 0

  const handlePrintOwnerSummary = () => {
    window.print()
  }

  // ============= MAIN RENDER =============

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
                Financial <span className="text-[#039ED9]">Report</span>
              </h1>
              <p className="text-slate-600 text-lg">
                Complete financial overview - Revenue: {formatCurrency(metrics.totalRevenue)} | Profit: {formatCurrency(metrics.netProfit)} | Margin: {formatPercentage(metrics.profitMargin)}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-primary transition-colors font-bold text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  {dateRange === 'today' && 'Today'}
                  {dateRange === 'week' && 'This Week'}
                  {dateRange === 'month' && 'This Month'}
                  {dateRange === 'quarter' && 'This Quarter'}
                  {dateRange === 'year' && `Year ${selectedYear}`}
                  {dateRange === 'custom' && `${format(parseISO(customStartDate), 'MMM d')} - ${format(parseISO(customEndDate), 'MMM d')}`}
                  {dateRange === 'all' && 'All Time'}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showCalendar && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-slate-200 rounded-2xl shadow-xl z-50 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCalendarView('month')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            calendarView === 'month' ? 'bg-primary text-white' : 'bg-slate-100'
                          }`}
                        >
                          Month
                        </button>
                        <button
                          onClick={() => setCalendarView('year')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            calendarView === 'year' ? 'bg-primary text-white' : 'bg-slate-100'
                          }`}
                        >
                          Year
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setDateRange('today')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('week')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        This Week
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('month')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        This Month
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('quarter')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        This Quarter
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('year')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        This Year
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('all')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        All Time
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('custom')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        Custom Range
                      </button>
                    </div>

                    {dateRange === 'custom' && (
                      <div className="mt-4 pt-4 border-t-2 border-slate-200 space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-4 py-2.5  text-white rounded-xl bg-[#039ED9] transition-colors font-bold text-sm"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  fetchSurveys()
                  fetchQuotations()
                  fetchJobs()
                  fetchEmployees()
                  fetchRoleUsers()
                  fetchAttendanceRecords()
                  fetchBookings()
                  fetchCategories()
                  fetchServices()
                  fetchProducts()
                  fetchClients()
                  fetchLeads()
                }}
                className="p-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-primary transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: PieChart },
              { id: 'revenue', label: 'Revenue', icon: TrendingUp },
              { id: 'profit-loss', label: 'Profit & Loss', icon: Calculator },
              { id: 'quotations', label: 'Quotations', icon: FileText },
              { id: 'jobs', label: 'Deterox Report', icon: Briefcase },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'surveys', label: 'Surveys', icon: FileSpreadsheet },
              { id: 'categories', label: 'Categories', icon: Layers },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'employees', label: 'Employees', icon: HardHat },
              { id: 'services', label: 'Services', icon: Zap },
              { id: 'products', label: 'Products', icon: Package }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#039ED9] text-white'
                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-primary'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl hover:border-primary transition-colors text-sm font-bold"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showFilters && (
              <div className="flex items-center gap-3 flex-wrap">
                <SearchSuggestSelect
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value || 'all')}
                  options={statusFilterOptions}
                  placeholder="Search status..."
                  inputClassName="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none w-56"
                />

                <SearchSuggestSelect
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value || 'all')}
                  options={categoryFilterOptions}
                  placeholder="Search category..."
                  inputClassName="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none w-64"
                />

                <SearchSuggestSelect
                  value={sortBy}
                  onChange={(value) => setSortBy((value as SortByType) || 'date')}
                  options={sortByOptions}
                  placeholder="Search sort..."
                  inputClassName="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none w-56"
                />

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border-2 border-slate-200 rounded-lg hover:border-primary transition-colors"
                >
                  {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Export Center */}
          <div className="mt-6">
            <TableCard title="Report Export" icon={DownloadCloud}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border-2 border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Range</p>
                  <p className="text-sm font-black text-slate-900 mt-1">{exportRangeLabel}</p>
                </div>
                <div className="rounded-xl border-2 border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Jobs</p>
                  <p className="text-sm font-black text-slate-900 mt-1">{formatNumber(metrics.totalJobs)}</p>
                </div>
                <div className="rounded-xl border-2 border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Jobs</p>
                  <p className="text-sm font-black text-slate-900 mt-1">{formatNumber(metrics.paidJobs)}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setExportFormat('csv')
                    handleExportReport()
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm"
                >
                  <Download className="h-4 w-4" />
                  Quick CSV Export
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-primary transition-colors font-bold text-sm"
                >
                  <DownloadCloud className="h-4 w-4" />
                  Open Export Builder
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Exports include jobs plus employee/admin attendance report for the selected date range.
              </p>
            </TableCard>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <TableCard
              title="Executive Summary"
              icon={Landmark}
              action={
                <button
                  type="button"
                  onClick={handlePrintOwnerSummary}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  <Printer className="h-4 w-4" />
                  Print Universal Report
                </button>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl border-2 border-slate-200 p-4 bg-white">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Quotation Value</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(quotationValueSummary.totalValue)}</p>
                    <p className="text-xs text-slate-500 mt-1">All quotations in selected range</p>
                  </div>
                  <div className="rounded-xl border-2 border-emerald-200 p-4 bg-emerald-50">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Won Quotation Value</p>
                    <p className="text-2xl font-black text-emerald-800 mt-1">{formatCurrency(quotationValueSummary.wonValue)}</p>
                    <p className="text-xs text-emerald-700 mt-1">{formatPercentage(wonQuotationValuePercentage)} of total quotation value</p>
                  </div>
                  <div className="rounded-xl border-2 border-slate-200 p-4 bg-white">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Jobs</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{formatNumber(metrics.totalJobs)}</p>
                    <p className="text-xs text-slate-500 mt-1">Across selected date range</p>
                  </div>
                  <div className="rounded-xl border-2 border-blue-200 p-4 bg-blue-50">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Reviewed Jobs</p>
                    <p className="text-2xl font-black text-blue-800 mt-1">{formatNumber(metrics.reviewedJobs)}</p>
                    <p className="text-xs text-blue-700 mt-1">{formatPercentage(reviewedJobsPercentage)} of total jobs reviewed</p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border-2 border-slate-200">
                  <table className="w-full bg-white">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Owner Universal Summary</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Total</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Won / Completed</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Pending / Remaining</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">Quotations (Value)</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(quotationValueSummary.totalValue)}</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">{formatCurrency(quotationValueSummary.wonValue)}</td>
                        <td className="py-3 px-4 text-right font-black text-amber-700">{formatCurrency(quotationValueSummary.pendingValue)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatPercentage(quotationValueSummary.valueConversionRate)} value conversion</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">Jobs</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalJobs)}</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">{formatNumber(metrics.completedJobs)} completed</td>
                        <td className="py-3 px-4 text-right font-black text-amber-700">{formatNumber(metrics.pendingJobs + metrics.inProgressJobs)} open</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.onTimeJobs)} on-time / {formatNumber(metrics.delayedJobs)} delayed</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">Job Reviews</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalJobReviews)} reviews</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">{formatNumber(metrics.reviewedJobs)} jobs reviewed</td>
                        <td className="py-3 px-4 text-right font-black text-amber-700">{formatNumber(Math.max(0, metrics.totalJobs - metrics.reviewedJobs))} jobs pending review</td>
                        <td className="py-3 px-4 text-right font-black">{metrics.avgJobReviewRating.toFixed(1)}/5 avg rating</td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">Revenue vs Profit</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.totalRevenue)}</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">{formatCurrency(metrics.netProfit)}</td>
                        <td className="py-3 px-4 text-right font-black text-amber-700">{formatCurrency(Math.max(0, metrics.totalRevenue - metrics.netProfit))}</td>
                        <td className="py-3 px-4 text-right font-black">{formatPercentage(metrics.profitMargin)} net margin</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">Bookings / Clients / Team</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalBookings)} bookings</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">{formatNumber(metrics.completedBookings)} completed bookings</td>
                        <td className="py-3 px-4 text-right font-black text-amber-700">{formatNumber(metrics.activeClients)} active clients</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.activeEmployees)} active employees</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TableCard>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(metrics.totalRevenue)}
                icon={Banknote}
                trend={12}
                trendLabel="vs last month"
                color="green"
                tooltip="Total revenue from all sources: Services, Products, Jobs, Bookings"
              />
              <MetricCard
                title="Net Profit"
                value={formatCurrency(metrics.netProfit)}
                icon={PiggyBank}
                subValue={`Margin: ${formatPercentage(metrics.profitMargin)}`}
                color="blue"
                tooltip="Revenue minus costs and expenses"
              />
              <MetricCard
                title="Gross Profit"
                value={formatCurrency(metrics.grossProfit)}
                icon={TrendingUp}
                subValue={`ROI: ${formatPercentage(metrics.roi)}`}
                color="purple"
                tooltip="Profit before operating expenses"
              />
              <MetricCard
                title="Operating Expenses"
                value={formatCurrency(metrics.operatingExpenses)}
                icon={Wallet}
                subValue={`Payroll: ${formatCurrency(metrics.totalPayroll)}`}
                color="orange"
                tooltip="Total operating costs including payroll"
              />
              <MetricCard
                title="Total Quotation Value"
                value={formatCurrency(metrics.quotationValue)}
                icon={Receipt}
                subValue={`${formatNumber(metrics.totalQuotations)} quotations`}
                color="emerald"
                tooltip="Sum of all quotation values in selected date range"
              />
              <MetricCard
                title="Total Reviews"
                value={formatNumber(metrics.totalJobReviews)}
                icon={Award}
                subValue={`${formatNumber(metrics.reviewedJobs)} jobs reviewed | Avg ${metrics.avgJobReviewRating.toFixed(1)}/5`}
                color="pink"
                tooltip="Reviews collected from total jobs"
              />
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Service Revenue"
                value={formatCurrency(metrics.serviceRevenue)}
                icon={Zap}
                subValue={`Profit: ${formatCurrency(metrics.serviceProfit)} (${formatPercentage(metrics.serviceMargin)})`}
                color="blue"
              />
              <MetricCard
                title="Product Revenue"
                value={formatCurrency(metrics.productRevenue)}
                icon={Package}
                subValue={`Profit: ${formatCurrency(metrics.productProfit)} (${formatPercentage(metrics.productMargin)})`}
                color="green"
              />
              <MetricCard
                title="Job Revenue"
                value={formatCurrency(metrics.jobRevenue)}
                icon={Briefcase}
                subValue={`Profit: ${formatCurrency(metrics.jobProfit)} (${formatPercentage(metrics.jobMargin)})`}
                color="purple"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Breakdown Chart */}
              <TableCard title="Revenue Breakdown" icon={ChartPie}>
                <div className="space-y-4">
                  {revenueBreakdownData.labels.map((label, i) => {
                    const total = revenueBreakdownData.values.reduce((a, b) => a + b, 0)
                    const percentage = total > 0 ? (revenueBreakdownData.values[i] / total) * 100 : 0
                    
                    return (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-slate-900">{label}</span>
                          <span className="font-bold" style={{ color: revenueBreakdownData.colors[i] }}>
                            {formatCurrency(revenueBreakdownData.values[i])}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: revenueBreakdownData.colors[i]
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 text-right">{percentage.toFixed(1)}%</p>
                      </div>
                    )
                  })}
                </div>
              </TableCard>

              {/* Profit Breakdown Chart */}
              <TableCard title="Profit Breakdown" icon={ChartBar}>
                <div className="space-y-4">
                  {profitBreakdownData.labels.map((label, i) => {
                    const total = profitBreakdownData.values.reduce((a, b) => a + b, 0)
                    const percentage = total > 0 ? (profitBreakdownData.values[i] / total) * 100 : 0
                    
                    return (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-slate-900">{label}</span>
                          <span className="font-bold" style={{ color: profitBreakdownData.colors[i] }}>
                            {formatCurrency(profitBreakdownData.values[i])}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: profitBreakdownData.colors[i]
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 text-right">{percentage.toFixed(1)}%</p>
                      </div>
                    )
                  })}
                </div>
              </TableCard>
            </div>

            {/* Monthly Revenue Chart */}
            <TableCard title={`Monthly Revenue - ${selectedYear}`} icon={ChartLine}>
              <div className="h-64 flex items-end justify-between gap-2 pt-4">
                {monthlyRevenueData.labels.map((month, i) => {
                  const maxValue = Math.max(...monthlyRevenueData.values)
                  const height = maxValue > 0 ? (monthlyRevenueData.values[i] / maxValue) * 200 : 0
                  
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <div 
                          className="w-full bg-linear-to-t from-primary to-pink-400 rounded-t-lg transition-all group-hover:opacity-80 cursor-pointer"
                          style={{ height: `${height}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {formatCurrency(monthlyRevenueData.values[i])}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{month}</span>
                    </div>
                  )
                })}
              </div>
            </TableCard>

            {/* Top Services */}
            <TableCard title="Top Services by Revenue" icon={Zap}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">#</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Service</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quantity</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profit</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topServices.map((service, i) => (
                      <tr key={service.name} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-400">{i + 1}</td>
                        <td className="py-3 px-4 font-black text-primary">{service.name}</td>
                        <td className="py-3 px-4 text-right font-bold">{formatNumber(service.quantity)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(service.revenue)}</td>
                        <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(service.profit)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatPercentage(service.margin)}</td>
                      </tr>
                    ))}
                    {metrics.topServices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">No service data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            {/* Top Products */}
            <TableCard title="Top Products by Revenue" icon={Package}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">#</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Product</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quantity</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profit</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Margin</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topProducts.map((product, i) => (
                      <tr key={product.name} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-400">{i + 1}</td>
                        <td className="py-3 px-4 font-black text-primary">{product.name}</td>
                        <td className="py-3 px-4 text-right font-bold">{formatNumber(product.quantity)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(product.revenue)}</td>
                        <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(product.profit)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatPercentage(product.margin)}</td>
                        <td className="py-3 px-4 text-right font-bold">{product.stock}</td>
                      </tr>
                    ))}
                    {metrics.topProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">No product data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            {/* Services by Category */}
            <TableCard title="Services by Category" icon={Layers}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Services Sold</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.servicesByCategory.map((cat, i) => (
                      <tr key={cat.category} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{cat.category}</td>
                        <td className="py-3 px-4 text-right font-bold">{cat.count}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(cat.revenue)}</td>
                      </tr>
                    ))}
                    {metrics.servicesByCategory.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500">No category data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            {/* Products by Category */}
            <TableCard title="Products by Category" icon={Box}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Products Sold</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.productsByCategory.map((cat, i) => (
                      <tr key={cat.category} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{cat.category}</td>
                        <td className="py-3 px-4 text-right font-bold">{cat.count}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(cat.revenue)}</td>
                      </tr>
                    ))}
                    {metrics.productsByCategory.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500">No category data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Quotations"
                value={formatNumber(metrics.totalQuotations)}
                icon={FileText}
                subValue={`${formatNumber(metrics.approvedQuotations)} approved (${formatPercentage(metrics.conversionRate)})`}
                color="blue"
              />
              <MetricCard
                title="Jobs"
                value={formatNumber(metrics.totalJobs)}
                icon={Briefcase}
                subValue={`${formatNumber(metrics.completedJobs)} completed`}
                color="green"
              />
              <MetricCard
                title="Clients"
                value={formatNumber(metrics.totalClients)}
                icon={Users}
                subValue={`${formatNumber(metrics.activeClients)} active`}
                color="purple"
              />
              <MetricCard
                title="Employees"
                value={formatNumber(metrics.totalEmployees)}
                icon={HardHat}
                subValue={`Payroll: ${formatCurrency(metrics.totalPayroll)}`}
                color="orange"
              />
            </div>

            <TableCard title="Universal Report Snapshot" icon={Globe2}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Total Count</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Value / Amount</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Health KPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-black text-primary">Quotations</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalQuotations)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.quotationValue)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatPercentage(metrics.conversionRate)} approved</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-black text-primary">Jobs</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalJobs)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.jobRevenue)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.onTimeJobs)} on-time / {formatNumber(metrics.delayedJobs)} delayed</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-black text-primary">Bookings</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalBookings)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.bookingValue)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.completedBookings)} completed</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-black text-primary">Clients</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalClients)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.clientLTV)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatPercentage(metrics.repeatRate)} repeat rate</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-black text-primary">Employees</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalEmployees)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.totalPayroll)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.activeEmployees)} active</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-black text-primary">Surveys</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalSurveys)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.surveyResponses)} responses</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.completedSurveys)} completed</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-black text-primary">Reviews</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.totalJobReviews)}</td>
                      <td className="py-3 px-4 text-right font-black">{metrics.avgJobReviewRating.toFixed(1)}/5 avg rating</td>
                      <td className="py-3 px-4 text-right font-black">{formatNumber(metrics.reviewedJobs)} jobs reviewed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TableCard>

            {/* Department Costs */}
            <TableCard title="Department Costs" icon={Building}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Department</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Employees</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Total Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Avg Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.departmentCosts.map((dept, i) => (
                      <tr key={dept.department} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{dept.department}</td>
                        <td className="py-3 px-4 text-right font-bold">{dept.count}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(dept.cost)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(dept.cost / dept.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>

            <TableCard
              title="Job Time Performance & Team Report"
              icon={Clock}
              action={
                <div className="flex items-center gap-2">
                  <select
                    value={jobTimeStatusFilter}
                    onChange={(e) => setJobTimeStatusFilter(e.target.value as 'all' | 'on-time' | 'delayed')}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="all">All Signals</option>
                    <option value="on-time">Only On Time</option>
                    <option value="delayed">Only Delayed</option>
                  </select>
                  <SearchSuggestSelect
                    value={jobTimeMemberFilter}
                    onChange={(value) => setJobTimeMemberFilter(value || 'all')}
                    options={jobTimeMemberOptions}
                    placeholder="Filter member..."
                    inputClassName="min-w-[180px] px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setJobTimeStatusFilter('all')
                      setJobTimeMemberFilter('all')
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100"
                  >
                    Reset
                  </button>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Job</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Created By</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Responsible</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Team Members</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Estimated</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Actual</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Variance</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Signal</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobTimePerformanceRows.map((row) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{row.title}</td>
                        <td className="py-3 px-4 text-slate-700">{row.client}</td>
                        <td className="py-3 px-4 text-slate-700">{row.createdBy}</td>
                        <td className="py-3 px-4 text-slate-700">{row.responsible}</td>
                        <td className="py-3 px-4 text-slate-700">{row.teamMembers}</td>
                        <td className="py-3 px-4 text-right font-bold">{row.estimatedLabel}</td>
                        <td className="py-3 px-4 text-right font-bold">{row.actualLabel}</td>
                        <td className={`py-3 px-4 text-right font-bold ${row.deltaMinutes <= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                          {row.deltaMinutes > 0 ? '+' : ''}{row.deltaMinutes} min
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            row.timeStatus === 'On Time' ? 'bg-green-100 text-green-700' :
                            row.timeStatus === 'Delayed' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {row.timeStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{row.timeNote || 'N/A'}</td>
                      </tr>
                    ))}
                    {filteredJobTimePerformanceRows.length === 0 && (
                      <tr>
                        <td colSpan={10} className="py-6 text-center text-slate-500 font-medium">
                          No job timing data found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            <TableCard title="Per-Team-Member Productivity (On Time vs Delayed)" icon={TrendingUp}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Team Member</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Total Jobs</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">On Time</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Delayed</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Unknown</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Avg Variance</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Productivity Score</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMemberProductivityRows.map((row) => (
                      <tr key={row.memberName} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{row.memberName}</td>
                        <td className="py-3 px-4 text-right font-bold">{formatNumber(row.totalJobs)}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatNumber(row.onTimeJobs)}</td>
                        <td className="py-3 px-4 text-right font-bold text-red-700">{formatNumber(row.delayedJobs)}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-500">{formatNumber(row.unknownJobs)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${row.averageDeltaMinutes <= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                          {row.averageDeltaMinutes > 0 ? '+' : ''}{Math.round(row.averageDeltaMinutes)} min
                        </td>
                        <td className="py-3 px-4 text-right font-black">{row.productivityScore.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            row.productivityScore >= 80 ? 'bg-green-100 text-green-700' :
                            row.productivityScore >= 60 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {row.productivityScore >= 80 ? 'Good' : row.productivityScore >= 60 ? 'Watch' : 'Risk'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {teamMemberProductivityRows.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-500 font-medium">
                          No team member productivity data found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(metrics.totalRevenue)}
                icon={Banknote}
                color="green"
              />
              <MetricCard
                title="Service Revenue"
                value={formatCurrency(metrics.serviceRevenue)}
                icon={Zap}
                subValue={`Profit: ${formatCurrency(metrics.serviceProfit)}`}
                color="blue"
              />
              <MetricCard
                title="Product Revenue"
                value={formatCurrency(metrics.productRevenue)}
                icon={Package}
                subValue={`Profit: ${formatCurrency(metrics.productProfit)}`}
                color="purple"
              />
              <MetricCard
                title="Job Revenue"
                value={formatCurrency(metrics.jobRevenue)}
                icon={Briefcase}
                subValue={`Profit: ${formatCurrency(metrics.jobProfit)}`}
                color="orange"
              />
            </div>

            <TableCard title="Revenue Breakdown" icon={BarChart3}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Source</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profit</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 font-black text-blue-600">Services</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.serviceRevenue)}</td>
                      <td className="py-3 px-4 text-right font-black text-red-600">{formatCurrency(metrics.serviceCost)}</td>
                      <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(metrics.serviceProfit)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatPercentage(metrics.serviceMargin)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 font-black text-purple-600">Products</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.productRevenue)}</td>
                      <td className="py-3 px-4 text-right font-black text-red-600">{formatCurrency(metrics.productCost)}</td>
                      <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(metrics.productProfit)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatPercentage(metrics.productMargin)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 font-black text-orange-600">Jobs</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.jobRevenue)}</td>
                      <td className="py-3 px-4 text-right font-black text-red-600">{formatCurrency(metrics.jobCost)}</td>
                      <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(metrics.jobProfit)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatPercentage(metrics.jobMargin)}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-4 px-4 font-black text-slate-900">Total</td>
                      <td className="py-4 px-4 text-right font-black text-primary">{formatCurrency(metrics.totalRevenue)}</td>
                      <td className="py-4 px-4 text-right font-black text-red-600">{formatCurrency(metrics.totalRevenue - metrics.grossProfit)}</td>
                      <td className="py-4 px-4 text-right font-black text-green-600">{formatCurrency(metrics.grossProfit)}</td>
                      <td className="py-4 px-4 text-right font-black">{formatPercentage((metrics.grossProfit/metrics.totalRevenue)*100)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* PROFIT & LOSS TAB */}
        {activeTab === 'profit-loss' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Gross Profit"
                value={formatCurrency(metrics.grossProfit)}
                icon={TrendingUp}
                color="green"
              />
              <MetricCard
                title="Operating Expenses"
                value={formatCurrency(metrics.operatingExpenses)}
                icon={Wallet}
                color="red"
              />
              <MetricCard
                title="Net Profit"
                value={formatCurrency(metrics.netProfit)}
                icon={PiggyBank}
                subValue={`Margin: ${formatPercentage(metrics.profitMargin)}`}
                color="blue"
              />
            </div>

            <TableCard title="Profit & Loss Statement" icon={Calculator}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Revenue</h4>
                  <div className="pl-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Service Revenue</span>
                      <span className="font-black">{formatCurrency(metrics.serviceRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Product Revenue</span>
                      <span className="font-black">{formatCurrency(metrics.productRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Job Revenue</span>
                      <span className="font-black">{formatCurrency(metrics.jobRevenue)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                      <span className="font-black text-slate-900">Total Revenue</span>
                      <span className="font-black text-primary">{formatCurrency(metrics.totalRevenue)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Cost of Goods Sold</h4>
                  <div className="pl-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Service Costs</span>
                      <span className="font-black">{formatCurrency(metrics.serviceCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Product Costs</span>
                      <span className="font-black">{formatCurrency(metrics.productCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Job Costs</span>
                      <span className="font-black">{formatCurrency(metrics.jobCost)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                      <span className="font-black text-slate-900">Total COGS</span>
                      <span className="font-black text-red-600">{formatCurrency(metrics.totalRevenue - metrics.grossProfit)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Gross Profit</h4>
                  <div className="pl-4">
                    <div className="flex justify-between">
                      <span className="font-black text-slate-900">Gross Profit</span>
                      <span className="font-black text-green-600">{formatCurrency(metrics.grossProfit)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-slate-600">Gross Margin</span>
                      <span className="font-black">{formatPercentage((metrics.grossProfit/metrics.totalRevenue)*100)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Operating Expenses</h4>
                  <div className="pl-4 space-y-2">
                    {metrics.departmentCosts.map(dept => (
                      <div key={dept.department} className="flex justify-between">
                        <span className="text-slate-600">{dept.department} Payroll</span>
                        <span className="font-black">{formatCurrency(dept.cost)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                      <span className="font-black text-slate-900">Total Operating Expenses</span>
                      <span className="font-black text-orange-600">{formatCurrency(metrics.operatingExpenses)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Net Profit</h4>
                  <div className="pl-4">
                    <div className="flex justify-between">
                      <span className="font-black text-slate-900">Net Profit</span>
                      <span className="font-black text-primary">{formatCurrency(metrics.netProfit)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-slate-600">Net Profit Margin</span>
                      <span className="font-black">{formatPercentage(metrics.profitMargin)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-slate-600">Return on Investment (ROI)</span>
                      <span className="font-black">{formatPercentage(metrics.roi)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TableCard>
          </div>
        )}

        {/* QUOTATIONS TAB */}
        {activeTab === 'quotations' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <MetricCard
                title="Total Value"
                value={formatCurrency(quotationValueSummary.totalValue)}
                icon={Banknote}
                subValue={`${formatNumber(metrics.totalQuotations)} quotations`}
                color="blue"
              />
              <MetricCard
                title="Won Value"
                value={formatCurrency(quotationValueSummary.wonValue)}
                icon={Award}
                subValue={`${formatNumber(selectedPersonPerformance.reduce((sum, row) => sum + row.wonQuotations, 0))} won/approved/completed`}
                color="emerald"
              />
              <MetricCard
                title="Pending Value"
                value={formatCurrency(quotationValueSummary.pendingValue)}
                icon={Clock}
                subValue={`${formatNumber(selectedPersonPerformance.reduce((sum, row) => sum + row.pendingQuotations, 0))} pending/sent`}
                color="blue"
              />
              <MetricCard
                title="Value Conversion Rate"
                value={formatPercentage(quotationValueSummary.valueConversionRate)}
                icon={Target}
                color="purple"
              />
            </div>

            <TableCard
              title="Quotation Filters"
              icon={Filter}
              action={
                <span className="text-xs font-bold text-slate-500">
                  {quotationPersonFilter === 'all' ? 'All Team Members' : 'Single Profile View'}
                </span>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Profile Filter</label>
                  <SearchSuggestSelect
                    value={quotationPersonFilter}
                    onChange={(value) => setQuotationPersonFilter(value || 'all')}
                    options={quotationPersonFilterOptions}
                    placeholder="Search team member..."
                    inputClassName="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                  />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filtered Summary</p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    Quotations: {formatNumber(selectedPersonPerformance.reduce((sum, row) => sum + row.quotationsSent, 0))}
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    Value: {formatCurrency(selectedPersonPerformance.reduce((sum, row) => sum + row.totalQuotationValue, 0))}
                  </p>
                </div>
              </div>
            </TableCard>

            <TableCard title="Recent Quotations" icon={FileText}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quote #</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Created By</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Assigned To</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Tax</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Discount</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotationRowsForTable.map(q => (
                      <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{q.quoteNumber}</td>
                        <td className="py-3 px-4 font-medium">{q.client}</td>
                        <td className="py-3 px-4 text-slate-700">{safeText(q.createdBy, 'Unassigned')}</td>
                        <td className="py-3 px-4 text-slate-700">{safeText(q.assignedTo, 'N/A')}</td>
                        <td className="py-3 px-4 text-slate-600">{q.date}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(q.total)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(q.taxAmount)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(q.discountAmount)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            q.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            q.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            q.status === 'Draft' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {quotationRowsForTable.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-6 text-center text-slate-500 font-medium">
                          No quotations found for the selected profile and date range.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            <TableCard title="Team Member Wise Quotation Summary" icon={Users}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Team Member</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quotations</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Total Value</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Avg Value</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Won Value</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Pending Value</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Conversion % (Value)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPersonPerformance.map((row) => (
                      <tr key={`summary-${row.personKey}`} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{row.name}</td>
                        <td className="py-3 px-4 text-slate-700">{row.role}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(row.quotationsSent)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(row.totalQuotationValue)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(row.averageQuotationValue)}</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">{formatCurrency(row.wonQuotationValue)}</td>
                        <td className="py-3 px-4 text-right font-black text-amber-700">{formatCurrency(row.pendingQuotationValue)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatPercentage(row.valueConversionRate)}</td>
                      </tr>
                    ))}
                    {selectedPersonPerformance.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-500 font-medium">
                          No team member quotation data found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            <TableCard title="Per-Person Quotation & Lead Profile" icon={Users}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profile</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Jobs Created</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Jobs Assigned</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Job Value</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quotations</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quotation Value</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Completed Value</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Won Leads</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Won Value</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Lost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Qualified</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Contacted</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">New</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue Generated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPersonPerformance.map((row) => (
                      <tr key={row.personKey} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{row.name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            row.personType === 'Admin' ? 'bg-purple-100 text-purple-700' :
                            row.personType === 'Employee' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {row.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(row.jobsCreated)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(row.jobsAssigned)}</td>
                        <td className="py-3 px-4 text-right font-black text-indigo-700">{formatCurrency(row.jobValue)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(row.quotationsSent)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(row.totalQuotationValue)}</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">{formatCurrency(row.completedQuotationValue)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(row.wonLeads)}</td>
                        <td className="py-3 px-4 text-right font-black text-green-700">{formatCurrency(row.wonLeadValue)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(row.lostLeads)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(row.qualifiedLeads)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(row.contactedLeads)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(row.newLeads)}</td>
                        <td className="py-3 px-4 text-right font-black text-primary">{formatCurrency(row.generatedRevenue)}</td>
                      </tr>
                    ))}
                    {selectedPersonPerformance.length === 0 && (
                      <tr>
                        <td colSpan={15} className="py-6 text-center text-slate-500 font-medium">
                          No profile performance data found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <MetricCard
                title="Total Jobs"
                value={formatNumber(metrics.totalJobs)}
                icon={Briefcase}
                color="purple"
              />
              <MetricCard
                title="Completed"
                value={formatNumber(metrics.completedJobs)}
                icon={CheckCircle}
                subValue={formatCurrency(metrics.jobRevenue)}
                color="green"
              />
              <MetricCard
                title="In Progress"
                value={formatNumber(metrics.inProgressJobs)}
                icon={Activity}
                color="blue"
              />
              <MetricCard
                title="Job Profit"
                value={formatCurrency(metrics.jobProfit)}
                icon={TrendingUp}
                subValue={`Margin: ${formatPercentage(metrics.jobMargin)}`}
                color="emerald"
              />
              <MetricCard
                title="Paid"
                value={formatNumber(metrics.paidJobs)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Unpaid"
                value={formatNumber(metrics.unpaidJobs)}
                icon={AlertTriangle}
                color="amber"
              />
              <MetricCard
                title="After Job"
                value={formatNumber(metrics.collectAfterJobJobs)}
                icon={Clock}
                color="purple"
              />
              <MetricCard
                title="On Time"
                value={formatNumber(metrics.onTimeJobs)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Delayed"
                value={formatNumber(metrics.delayedJobs)}
                icon={XCircle}
                color="red"
              />
            </div>

            <TableCard title="Deterox Jobs & Payment Status (Detailed)" icon={Briefcase}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Job</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Created By</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Responsible</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Assigned To</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Budget</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Actual Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profit</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Payment</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Time Calc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobsInRange.map(job => (
                      <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{safeText(job.title, 'Untitled Job')}</td>
                        <td className="py-3 px-4 font-medium">{safeText(job.client, 'Unknown Client')}</td>
                        <td className="py-3 px-4 text-slate-700">{safeText(employees.find(e => e.id === safeText(job.jobCreatedBy, ''))?.name, 'N/A')}</td>
                        <td className="py-3 px-4 text-slate-700">{safeText(employees.find(e => e.id === safeText(job.jobResponsibleBy, ''))?.name, 'N/A')}</td>
                        <td className="py-3 px-4 text-slate-700">{(job.assignedEmployees || []).map((emp) => safeText((emp as GenericRecord).name, '')).filter(Boolean).join(', ') || safeText((job.assignedTo || []).join(', '), 'N/A')}</td>
                        <td className="py-3 px-4 text-slate-600">{safeText(job.scheduledDate, 'N/A')}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(job.budget)}</td>
                        <td className="py-3 px-4 text-right font-black text-red-600">{formatCurrency(job.actualCost)}</td>
                        <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(job.budget - job.actualCost)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            job.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {safeText(job.status, 'Pending')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            normalizeJobPaymentStatus(job.paymentStatus) === 'Paid' ? 'bg-green-100 text-green-700' :
                            normalizeJobPaymentStatus(job.paymentStatus) === 'Collect After Job' ? 'bg-purple-100 text-purple-700' :
                            normalizeJobPaymentStatus(job.paymentStatus) === 'Partially Paid' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {normalizeJobPaymentStatus(job.paymentStatus)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            job.timePerformanceStatus === 'On Time' ? 'bg-green-100 text-green-700' :
                            job.timePerformanceStatus === 'Delayed' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {job.timePerformanceStatus || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredJobsInRange.length === 0 && (
                      <tr>
                        <td colSpan={12} className="py-6 text-center text-slate-500 font-medium">
                          No jobs found for this date range.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            <TableCard
              title="Per-Team-Member Productivity (On Time vs Delayed)"
              icon={TrendingUp}
              action={
                <div className="flex items-center gap-2">
                  <select
                    value={jobTimeStatusFilter}
                    onChange={(e) => setJobTimeStatusFilter(e.target.value as 'all' | 'on-time' | 'delayed')}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="all">All Signals</option>
                    <option value="on-time">Only On Time</option>
                    <option value="delayed">Only Delayed</option>
                  </select>
                  <SearchSuggestSelect
                    value={jobTimeMemberFilter}
                    onChange={(value) => setJobTimeMemberFilter(value || 'all')}
                    options={jobTimeMemberOptions}
                    placeholder="Filter member..."
                    inputClassName="min-w-[180px] px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setJobTimeStatusFilter('all')
                      setJobTimeMemberFilter('all')
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100"
                  >
                    Reset
                  </button>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Team Member</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Total Jobs</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">On Time</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Delayed</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Unknown</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Avg Variance</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Productivity Score</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMemberProductivityRows.map((row) => (
                      <tr key={row.memberName} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{row.memberName}</td>
                        <td className="py-3 px-4 text-right font-bold">{formatNumber(row.totalJobs)}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatNumber(row.onTimeJobs)}</td>
                        <td className="py-3 px-4 text-right font-bold text-red-700">{formatNumber(row.delayedJobs)}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-500">{formatNumber(row.unknownJobs)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${row.averageDeltaMinutes <= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                          {row.averageDeltaMinutes > 0 ? '+' : ''}{Math.round(row.averageDeltaMinutes)} min
                        </td>
                        <td className="py-3 px-4 text-right font-black">{row.productivityScore.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            row.productivityScore >= 80 ? 'bg-green-100 text-green-700' :
                            row.productivityScore >= 60 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {row.productivityScore >= 80 ? 'Good' : row.productivityScore >= 60 ? 'Watch' : 'Risk'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {teamMemberProductivityRows.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-500 font-medium">
                          No team member productivity data found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <MetricCard title="Total Bookings" value={formatNumber(metrics.totalBookings)} icon={Calendar} color="blue" />
              <MetricCard title="Pending" value={formatNumber(metrics.pendingBookings)} icon={Clock} color="amber" />
              <MetricCard title="Confirmed" value={formatNumber(metrics.confirmedBookings)} icon={CheckCircle} color="green" />
              <MetricCard title="Completed" value={formatNumber(metrics.completedBookings)} icon={CheckCircle} color="emerald" />
              <MetricCard title="Cancelled" value={formatNumber(metrics.cancelledBookings)} icon={XCircle} color="red" />
            </div>

            <TableCard title="Bookings Report" icon={Calendar}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Booking ID</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Service</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Area</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 30).map((booking) => (
                      <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{booking.bookingId}</td>
                        <td className="py-3 px-4 font-medium">{booking.name}</td>
                        <td className="py-3 px-4">{booking.service}</td>
                        <td className="py-3 px-4">{booking.area}</td>
                        <td className="py-3 px-4">{booking.date} {booking.time}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {activeTab === 'surveys' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard title="Total Surveys" value={formatNumber(metrics.totalSurveys)} icon={FileSpreadsheet} color="blue" />
              <MetricCard title="Completed" value={formatNumber(metrics.completedSurveys)} icon={CheckCircle} color="green" />
              <MetricCard title="Responses" value={formatNumber(metrics.surveyResponses)} icon={Activity} color="purple" />
            </div>

            <TableCard title="Survey Report" icon={FileSpreadsheet}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Title</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Responses</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveys.slice(0, 30).map((survey) => (
                      <tr key={survey.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{survey.title}</td>
                        <td className="py-3 px-4">{survey.category}</td>
                        <td className="py-3 px-4">{survey.selectedClient?.name || 'N/A'}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(survey.responsesCount || 0)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            {survey.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {surveys.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">No surveys found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard title="Total Categories" value={formatNumber(metrics.totalCategories)} icon={Layers} color="blue" />
              <MetricCard title="Active Categories" value={formatNumber(metrics.activeCategories)} icon={CheckCircle} color="green" />
              <MetricCard title="With Items" value={formatNumber(metrics.categoriesWithItems.length)} icon={Box} color="purple" />
            </div>

            <TableCard title="Category Report" icon={Layers}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Slug</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Items</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.slice(0, 30).map((category) => (
                      <tr key={category.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{category.name}</td>
                        <td className="py-3 px-4">{category.slug}</td>
                        <td className="py-3 px-4 text-right font-black">{formatNumber(category.itemCount || 0)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            category.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">No categories found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Clients"
                value={formatNumber(metrics.totalClients)}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Active Clients"
                value={formatNumber(metrics.activeClients)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Client LTV"
                value={formatCurrency(metrics.clientLTV)}
                icon={Banknote}
                color="purple"
              />
              <MetricCard
                title="Repeat Rate"
                value={formatPercentage(metrics.repeatRate)}
                icon={Target}
                color="orange"
              />
            </div>

            <TableCard title="Top Clients by Revenue" icon={Award}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Company</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Total Spent</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Projects</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topClients.map(client => (
                      <tr key={client.name} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{client.name}</td>
                   
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(client.spent)}</td>
                        <td className="py-3 px-4 text-right font-bold">{client.projects}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            client.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                            client.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                            client.tier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {client.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Staff"
                value={formatNumber(employeeReportSummary.staffCount)}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Active Staff"
                value={formatNumber(employeeReportSummary.activeStaff)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Total Payroll"
                value={formatCurrency(employeeReportSummary.totalPayrollAmount)}
                icon={Wallet}
                color="purple"
              />
              <MetricCard
                title="Avg Salary"
                value={formatCurrency(employeeReportSummary.avgSalaryAmount)}
                icon={TrendingUp}
                color="orange"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="rounded-xl border-2 border-slate-200 p-4 bg-white">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Days</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{formatNumber(employeeReportSummary.totalAttendanceDays)}</p>
              </div>
              <div className="rounded-xl border-2 border-slate-200 p-4 bg-white">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leave Days</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{formatNumber(employeeReportSummary.totalLeaveDays)}</p>
              </div>
              <div className="rounded-xl border-2 border-slate-200 p-4 bg-white">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Absent Days</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{formatNumber(employeeReportSummary.totalAbsentDays)}</p>
              </div>
              <div className="rounded-xl border-2 border-slate-200 p-4 bg-white">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Late Days</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{formatNumber(employeeReportSummary.totalLateDays)}</p>
              </div>
              <div className="rounded-xl border-2 border-slate-200 p-4 bg-white">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overtime Hours</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{employeeReportSummary.totalOvertimeHours.toFixed(1)}</p>
              </div>
            </div>

            <TableCard title="Employee Report Filters" icon={Filter}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  placeholder="Search name, email, role..."
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                />
                <SearchSuggestSelect
                  value={employeeRoleFilter}
                  onChange={(value) => setEmployeeRoleFilter(value || 'all')}
                  options={employeeRoleFilterOptions}
                  placeholder="Search role..."
                  inputClassName="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                />
                <SearchSuggestSelect
                  value={employeeDepartmentFilter}
                  onChange={(value) => setEmployeeDepartmentFilter(value || 'all')}
                  options={employeeDepartmentFilterOptions}
                  placeholder="Search department..."
                  inputClassName="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                />
                <SearchSuggestSelect
                  value={employeeAttendanceFilter}
                  onChange={(value) => setEmployeeAttendanceFilter(value || 'all')}
                  options={employeeAttendanceFilterOptions}
                  placeholder="Search attendance type..."
                  inputClassName="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                />
              </div>
            </TableCard>

            <TableCard title="Employee & Admin Attendance Report" icon={HardHat}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Email</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Department</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Salary</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Attendance</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Leave</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Absent</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Late</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Overtime</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeReportRows.map(emp => (
                      <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{emp.name}</td>
                        <td className="py-3 px-4 font-medium">{emp.email || 'N/A'}</td>
                        <td className="py-3 px-4 font-medium">{emp.department}</td>
                        <td className="py-3 px-4 font-medium">{emp.role}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(emp.salary)}</td>
                        <td className="py-3 px-4 text-right font-black">{emp.attendanceDays}</td>
                        <td className="py-3 px-4 text-right font-black">{emp.leaveDays}</td>
                        <td className="py-3 px-4 text-right font-black">{emp.absentDays}</td>
                        <td className="py-3 px-4 text-right font-black">{emp.lateDays}</td>
                        <td className="py-3 px-4 text-right font-black">{emp.overtimeHours.toFixed(1)}h</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            emp.status === 'Active' ? 'bg-green-100 text-green-700' :
                            emp.status === 'Inactive' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {employeeReportRows.length === 0 && (
                      <tr>
                        <td colSpan={11} className="py-8 text-center text-slate-500">
                          No staff report data found for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Services"
                value={formatNumber(services.length)}
                icon={Zap}
                color="blue"
              />
              <MetricCard
                title="Active Services"
                value={formatNumber(services.filter(s => s.isActive && s.status === 'ACTIVE').length)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Service Revenue"
                value={formatCurrency(metrics.serviceRevenue)}
                icon={Banknote}
                color="purple"
              />
            </div>

            <TableCard title="Services List" icon={Zap}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Service</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Price</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Margin</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.slice(0, 10).map(service => (
                      <tr key={service.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{service.name}</td>
                        <td className="py-3 px-4 font-medium">{service.categoryName}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(service.price)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(service.cost)}</td>
                        <td className="py-3 px-4 text-right font-black">{service.profitMargin}%</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            service.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {service.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Products"
                value={formatNumber(products.length)}
                icon={Package}
                color="blue"
              />
              <MetricCard
                title="Active Products"
                value={formatNumber(products.filter(p => p.isActive && p.status === 'ACTIVE').length)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Inventory Value"
                value={formatCurrency(metrics.inventoryValue)}
                icon={Landmark}
                color="purple"
              />
              <MetricCard
                title="Low Stock Items"
                value={formatNumber(metrics.lowStockItems)}
                icon={AlertTriangle}
                color="red"
              />
            </div>

            <TableCard title="Products List" icon={Package}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Product</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Price</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Stock</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Min Stock</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 10).map(product => (
                      <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{product.name}</td>
                        <td className="py-3 px-4 font-medium">{product.categoryName}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(product.price)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(product.cost)}</td>
                        <td className="py-3 px-4 text-right font-bold">{product.stock}</td>
                        <td className="py-3 px-4 text-right font-bold">{product.minStock}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b-2 border-slate-200 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Export Report</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'pdf', label: 'PDF', icon: FileText },
                      { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
                      { id: 'csv', label: 'CSV', icon: FileText }
                    ].map(format => (
                      <button
                        key={format.id}
                        onClick={() => setExportFormat(format.id as ExportFormatType)}
                        className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                          exportFormat === format.id
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 hover:border-primary'
                        }`}
                      >
                        <format.icon className={`h-6 w-6 ${
                          exportFormat === format.id ? 'text-primary' : 'text-slate-600'
                        }`} />
                        <span className={`text-xs font-bold ${
                          exportFormat === format.id ? 'text-primary' : 'text-slate-600'
                        }`}>
                          {format.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Date Range</label>
                  <SearchSuggestSelect
                    value={dateRange}
                    onChange={(value) => setDateRange((value as DateRangeType) || 'all')}
                    options={dateRangeOptions}
                    placeholder="Search date range..."
                    inputClassName="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Include Sections</label>
                  <div className="space-y-2">
                    {['Overview', 'Revenue', 'Profit & Loss', 'Quotations', 'Deterox Report', 'Bookings', 'Surveys', 'Categories', 'Clients', 'Employees', 'Services', 'Products'].map(section => (
                      <label key={section} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary focus:ring-primary" />
                        <span className="text-sm font-medium">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleExportReport}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <DownloadCloud className="h-5 w-5" />
                  {exportFormat === 'excel' ? 'Export Detailed Excel Report' : 'Export Detailed Report'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}