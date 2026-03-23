'use client'

import { useState, useEffect, useMemo, useCallback, type ComponentType, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
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
  Zap,
  Activity,
  AlertTriangle,
  PiggyBank,
  Calculator,
  ChartPie,
  ChartBar,
  ChartLine,
  Receipt,
  HardHat,
  Building,
  Layers,
  Box} from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { format, startOfMonth, endOfMonth, subMonths, parseISO, isWithinInterval } from 'date-fns'

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
  priority: string
  riskLevel: string
  scheduledDate: string
  scheduledTime: string
  completedAt: TimestampLike
  estimatedDuration: string
  actualDuration?: string
  budget: number
  actualCost: number
  teamRequired: number
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
type ActiveTab = 'overview' | 'revenue' | 'profit-loss' | 'quotations' | 'jobs' | 'clients' | 'employees' | 'services' | 'products'
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
  const [bookings, setBookings] = useState<Booking[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [clients, setClients] = useState<Client[]>([])
  
  // UI states
  const [dateRange, setDateRange] = useState<DateRangeType>('month')
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
          title: docData.title || 'Untitled Job',
          description: docData.description || '',
          client: docData.client || 'Unknown Client',
          clientId: docData.clientId || '',
          location: docData.location || '',
          status: docData.status || 'Pending',
          priority: docData.priority || 'Medium',
          riskLevel: docData.riskLevel || 'Low',
          scheduledDate: docData.scheduledDate || '',
          scheduledTime: docData.scheduledTime || '',
          completedAt: docData.completedAt,
          estimatedDuration: docData.estimatedDuration || '0',
          actualDuration: docData.actualDuration,
          budget: docData.budget || 0,
          actualCost: docData.actualCost || 0,
          teamRequired: docData.teamRequired || 1,
          assignedEmployees: docData.assignedEmployees || [],
          requiredSkills: docData.requiredSkills || [],
          equipment: docData.equipment || [],
          milestones: docData.milestones || [],
          tasks: docData.tasks || [],
          executionLogs: docData.executionLogs || [],
          permits: docData.permits || [],
          tags: docData.tags || [],
          specialInstructions: docData.specialInstructions || '',
          slaDeadline: docData.slaDeadline || '',
          recurring: docData.recurring || false,
          reminderEnabled: docData.reminderEnabled || false,
          overtimeRequired: docData.overtimeRequired || false,
          overtimeHours: docData.overtimeHours || 0,
          overtimeApproved: docData.overtimeApproved || false,
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

  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchSurveys(),
        fetchQuotations(),
        fetchJobs(),
        fetchEmployees(),
        fetchBookings(),
        fetchCategories(),
        fetchServices(),
        fetchProducts(),
        fetchClients()
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
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
      case 'week':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
      case 'quarter':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
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
  const jobRevenue = filteredJobs
    .filter(j => j.status === 'Completed')
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
  const approvedValue = filteredQuotations
    .filter(q => q.status === 'Approved')
    .reduce((sum, q) => sum + (q.total || 0), 0)
  const pendingQuotations = filteredQuotations.filter(q => q.status === 'Pending' || q.status === 'Draft').length
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

  // ===== CLIENT METRICS =====
  const totalClients = filteredClients.length
  const activeClients = filteredClients.filter(c => c.status === 'Active').length
  const newClients = filteredClients.length
  const clientLTV = activeClients > 0 ? approvedValue / activeClients : 0
  const repeatRate = totalClients > 0 ? 
    (clients.filter(c => c.projects > 1).length / totalClients) * 100 : 0

  // Top Clients
  const topClients = clients
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
  const activeEmployees = employees.filter(e => e.status === 'Active').length
  const totalPayroll = employees
    .filter(e => e.status === 'Active')
    .reduce((sum, e) => sum + (e.salary || 0), 0)
  const averageSalary = activeEmployees > 0 ? totalPayroll / activeEmployees : 0
  const employeeCost = totalPayroll

  // Department costs
  const departmentMap = new Map<string, { cost: number, count: number }>()
  employees.forEach(e => {
    if (e.status === 'Active') {
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
                  fetchBookings()
                  fetchCategories()
                  fetchServices()
                  fetchProducts()
                  fetchClients()
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
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
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
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortByType)}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                >
                  <option value="date">Sort by Date</option>
                  <option value="value">Sort by Value</option>
                  <option value="name">Sort by Name</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border-2 border-slate-200 rounded-lg hover:border-primary transition-colors"
                >
                  {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(metrics.totalRevenue)}
                icon={DollarSign}
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
          </div>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(metrics.totalRevenue)}
                icon={DollarSign}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Quotations"
                value={formatNumber(metrics.totalQuotations)}
                icon={FileText}
                color="blue"
              />
              <MetricCard
                title="Approved"
                value={formatNumber(metrics.approvedQuotations)}
                icon={CheckCircle}
                subValue={formatCurrency(metrics.approvedValue)}
                color="green"
              />
              <MetricCard
                title="Pending"
                value={formatNumber(metrics.pendingQuotations)}
                icon={Clock}
                color="blue"
              />
              <MetricCard
                title="Conversion Rate"
                value={formatPercentage(metrics.conversionRate)}
                icon={Target}
                color="purple"
              />
            </div>

            <TableCard title="Recent Quotations" icon={FileText}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quote #</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Tax</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Discount</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.slice(0, 10).map(q => (
                      <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{q.quoteNumber}</td>
                        <td className="py-3 px-4 font-medium">{q.client}</td>
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
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            </div>

            <TableCard title="Recent Jobs" icon={Briefcase}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Job</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Budget</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Actual Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profit</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.slice(0, 10).map(job => (
                      <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{job.title}</td>
                        <td className="py-3 px-4 font-medium">{job.client}</td>
                        <td className="py-3 px-4 text-slate-600">{job.scheduledDate}</td>
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
                            {job.status}
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
                icon={DollarSign}
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
                title="Total Employees"
                value={formatNumber(metrics.totalEmployees)}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Active Employees"
                value={formatNumber(metrics.activeEmployees)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Total Payroll"
                value={formatCurrency(metrics.totalPayroll)}
                icon={Wallet}
                color="purple"
              />
              <MetricCard
                title="Avg Salary"
                value={formatCurrency(metrics.averageSalary)}
                icon={TrendingUp}
                color="orange"
              />
            </div>

            <TableCard title="Employee List" icon={HardHat}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Department</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Salary</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Rating</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 10).map(emp => (
                      <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{emp.name}</td>
                        <td className="py-3 px-4 font-medium">{emp.department}</td>
                        <td className="py-3 px-4 font-medium">{emp.role}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(emp.salary)}</td>
                        <td className="py-3 px-4 text-right font-black">{emp.rating}/5</td>
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
                icon={DollarSign}
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
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as DateRangeType)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Include Sections</label>
                  <div className="space-y-2">
                    {['Overview', 'Revenue', 'Profit & Loss', 'Quotations', 'Jobs', 'Clients', 'Employees', 'Services', 'Products'].map(section => (
                      <label key={section} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary focus:ring-primary" />
                        <span className="text-sm font-medium">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Exporting as ${exportFormat.toUpperCase()}...`)
                    setShowExportModal(false)
                  }}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <DownloadCloud className="h-5 w-5" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}