'use client'

import { Suspense, useState, useCallback, useMemo, useEffect } from 'react'
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Briefcase,
  Banknote,
  Camera,
  Play,
  Eye,
  Bell,
  BellOff,
  ShoppingCart,
  Edit,
  Zap,
  UserPlus,
  ChevronDown,
  ListTodo,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, where, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter, useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'
import SearchSuggestSelect from '@/components/ui/search-suggest-select'

type ExecutionPhotoStage = 'before' | 'inProgress' | 'after' | 'qualityCheck'

interface ExecutionPhotoEvidence {
  stage: ExecutionPhotoStage
  title: string
  description: string
  url: string
  fileName: string
  uploadedAt: string
}

const EXECUTION_PHOTO_STAGES: ExecutionPhotoStage[] = ['before', 'inProgress', 'after', 'qualityCheck']

const EXECUTION_PHOTO_STAGE_LABELS: Record<ExecutionPhotoStage, string> = {
  before: 'Before Photo',
  inProgress: 'In Progress Photo',
  after: 'After Photo',
  qualityCheck: 'Quality Check Photo'
}

const createEmptyExecutionPhotos = (): Record<ExecutionPhotoStage, ExecutionPhotoEvidence | null> => ({
  before: null,
  inProgress: null,
  after: null,
  qualityCheck: null
})

const collectExecutionPhotosByStage = (executionLogs: Array<Record<string, unknown>>) => {
  const grouped: Record<ExecutionPhotoStage, ExecutionPhotoEvidence[]> = {
    before: [],
    inProgress: [],
    after: [],
    qualityCheck: []
  }

  executionLogs.forEach((log) => {
    const photos = log.photos
    if (!photos || typeof photos !== 'object') return

    EXECUTION_PHOTO_STAGES.forEach((stage) => {
      const rawPhoto = (photos as Record<string, unknown>)[stage]
      if (!rawPhoto || typeof rawPhoto !== 'object') return

      const url = String((rawPhoto as Record<string, unknown>).url || '').trim()
      if (!url) return

      grouped[stage].push({
        stage,
        title: String((rawPhoto as Record<string, unknown>).title || EXECUTION_PHOTO_STAGE_LABELS[stage]),
        description: String((rawPhoto as Record<string, unknown>).description || ''),
        url,
        fileName: String((rawPhoto as Record<string, unknown>).fileName || ''),
        uploadedAt: String((rawPhoto as Record<string, unknown>).uploadedAt || '')
      })
    })
  })

  return grouped
}

const formatPhotosForExport = (photos: ExecutionPhotoEvidence[]) => {
  return photos
    .map((photo) => {
      const descriptionPart = photo.description ? ` - ${photo.description}` : ''
      return `${photo.title}${descriptionPart} (${photo.url})`
    })
    .join(' | ')
}

interface Job {
  id: string
  title: string
  client: string
  clientId: string
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Expired'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  scheduledDate: string | null
  scheduledEndDate?: string | null
  scheduledTime?: string
  endTime?: string
  location: string
  teamRequired: number
  budget: number
  actualCost: number
  description: string
  riskLevel: 'Low' | 'Medium' | 'High'
  slaDeadline?: string
  estimatedDuration: string
  estimatedDurationMinutes?: number
  actualDuration?: string
  actualDurationMinutes?: number
  timePerformanceStatus?: 'On Time' | 'Delayed' | 'Unknown'
  timePerformanceDeltaMinutes?: number
  timePerformanceNote?: string
  requiredSkills: string[]
  equipment: string[] 
  permits: string[]
  tags: string[]
  specialInstructions?: string
  recurring: boolean
  createdAt: string
  updatedAt: string
  completedAt?: string
  executionLogs: Array<Record<string, unknown>>
  assignedTo: string[]
  assignedEmployees: { id: string; name: string; email: string }[]
  jobCreatedBy: string
  jobResponsibleBy?: string
  reminderEnabled?: boolean
  reminderDate?: string
  reminderSent?: boolean
  services?: JobService[]
  upsales?: Array<{ name: string; quantity: number; unitPrice: number; total: number; note?: string }>
  overtimeRequired?: boolean
  overtimeHours?: number
  overtimeReason?: string
  overtimeApproved?: boolean
  tasks?: JobTask[]
  listingDurationDays?: number
  listingExpiresAt?: string
  quotationRequired?: boolean
  quotationStatus?: 'Not Required' | 'Pending' | 'Approved' | 'Rejected'
  surveyRequired?: boolean
  surveyStatus?: 'Not Required' | 'Pending' | 'Completed'
  paymentStatus?: 'Pending' | 'Paid' | 'Partially Paid' | 'Collect After Job'
  paymentMethod?: 'Payment Link' | 'Bank Transfer' | 'Cash' | 'Card' | 'N/A'
  paymentReference?: string
  paymentLinkGeneratedBy?: string
  availabilityOverride?: boolean
}

interface JobService {
  id: string
  name: string
  quantity: number
  unitPrice: number
  total: number
  description?: string
}

interface JobTask {
  id: string
  title: string
  description: string
  duration: number
  completed: boolean
}

interface Equipment {
  id: string
  name: string
  category: string
  condition: string
  cost: number
  location: string
  status: string
  quantity: number
  purchaseDate: string
  lastServiced: string
  maintenanceDate: string
  createdAt: string
}

interface PermitLicense {
  id: string
  name: string
  category: string
  cost: number
  expiryDate: string
  issueDate: string
  issuer: string
  renewalDate: string
  status: string
  createdAt: string
  pdfUrl?: string
}

interface ServiceItem {
  id: string
  name: string
  description: string
  price: number
  cost: number
  categoryId: string
  categoryName: string
  imageUrl: string
  sku: string
  status: string
  type: string
  unit: string
  stock: number
  minStock: number
  createdAt: string
  updatedAt: string
}

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  status: string
}

interface ClientLead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  type: 'client' | 'lead'
  status?: string
}

interface NewJobForm {
  title: string
  client: string
  clientId: string | null
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  scheduledDate: string
  scheduledEndDate: string
  scheduledTime: string
  endTime: string
  location: string
  teamRequired: number
  budget: number
  description: string
  riskLevel: 'Low' | 'Medium' | 'High'
  slaDeadline: string
  estimatedDuration: string
  requiredSkills: string
  tags: string
  specialInstructions: string
  recurring: boolean
  selectedEmployees: string[]
  jobCreatedBy: string // 👈 NEW FIELD ADDED
  jobResponsibleBy: string
  services?: JobService[]
  upsales?: Array<{ name: string; quantity: number; unitPrice: number; total: number; note?: string }>
  tasks?: JobTask[]
  selectedEquipment: string[]
  selectedPermits: string[]
  selectedServices: string[]
  listingDurationDays: number
  quotationRequired: boolean
  quotationStatus: 'Not Required' | 'Pending' | 'Approved' | 'Rejected'
  surveyRequired: boolean
  surveyStatus: 'Not Required' | 'Pending' | 'Completed'
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Collect After Job'
  paymentMethod: 'Payment Link' | 'Bank Transfer' | 'Cash' | 'Card' | 'N/A'
  paymentReference: string
  paymentLinkGeneratedBy: string
  allowValidationOverride: boolean
}

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

type UserWeeklyAvailability = Record<DayKey, Array<{ start: string; end: string }>>

const JOB_TAX_RATE = 0.05

function JobsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [clients, setClients] = useState<ClientLead[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [permits, setPermits] = useState<PermitLicense[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [userAvailability, setUserAvailability] = useState<Record<string, UserWeeklyAvailability>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [creatorFilter, setCreatorFilter] = useState<string>('all')
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'nextDay' | 'custom' | 'all'>('all')
  const [customDateFilter, setCustomDateFilter] = useState('')
  const [timeFromFilter, setTimeFromFilter] = useState('')
  const [timeToFilter, setTimeToFilter] = useState('')
  const [showNewJobModal, setShowNewJobModal] = useState(false)
  const [showExecutionModal, setShowExecutionModal] = useState(false)
  const [selectedJobForExecution, setSelectedJobForExecution] = useState<Job | null>(null)
  const [executionChecklist, setExecutionChecklist] = useState<string[]>([])
  const [executionNotes, setExecutionNotes] = useState('')
  const [executionPhotosByStage, setExecutionPhotosByStage] = useState<Record<ExecutionPhotoStage, ExecutionPhotoEvidence | null>>(createEmptyExecutionPhotos)
  const [uploadingPhotoStage, setUploadingPhotoStage] = useState<ExecutionPhotoStage | null>(null)
  const [editingJobId, setEditingJobId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTasksSection, setShowTasksSection] = useState(false)
  const [totalTeamCapacity, setTotalTeamCapacity] = useState(10)
  const [travelBufferMinutes, setTravelBufferMinutes] = useState(30)
  const [lunchBufferMinutes, setLunchBufferMinutes] = useState(30)
  const [selectedTeamMemberToAdd, setSelectedTeamMemberToAdd] = useState('')
  const [calendarPrefillApplied, setCalendarPrefillApplied] = useState(false)

  const [newJobForm, setNewJobForm] = useState<NewJobForm>({
    title: '',
    client: '',
    clientId: null,
    priority: 'Medium',
    scheduledDate: '',
    scheduledEndDate: '',
    scheduledTime: '',
    endTime: '',
    location: '',
    teamRequired: 1,
    budget: 0,
    description: '',
    riskLevel: 'Low',
    slaDeadline: '',
    estimatedDuration: '',
    requiredSkills: '',
    tags: '',
    specialInstructions: '',
    recurring: false,
    selectedEmployees: [],
    jobCreatedBy: '', // 👈 NEW FIELD INITIALIZED
    jobResponsibleBy: '',
    services: [],
    tasks: [],
    selectedEquipment: [],
    selectedPermits: [],
    selectedServices: [],
    listingDurationDays: 0,
    quotationRequired: false,
    quotationStatus: 'Not Required',
    surveyRequired: false,
    surveyStatus: 'Not Required',
    paymentStatus: 'Pending',
    paymentMethod: 'N/A',
    paymentReference: '',
    paymentLinkGeneratedBy: '',
    allowValidationOverride: false,
    upsales: []
  })

  const employeeOptions = useMemo(() => {
    return employees.map((employee) => ({
      value: employee.id,
      label: `${employee.name} - ${employee.position} (${employee.department})`,
      keywords: [employee.email || '', employee.department || '', employee.position || '']
    }))
  }, [employees])

  const jobCategoryValues = useMemo(() => {
    const fromServices = services
      .map((service) => (service.categoryName || '').trim())
      .filter(Boolean)

    const fromJobs = jobs
      .map((job) => (job.title || '').trim())
      .filter(Boolean)

    return Array.from(new Set([...fromServices, ...fromJobs])).sort((a, b) => a.localeCompare(b))
  }, [services, jobs])

  const jobCategoryFilterOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Categories' },
      ...jobCategoryValues.map((category) => ({
        value: category,
        label: category,
      })),
    ]
  }, [jobCategoryValues])

  const jobTitleCreateOptions = useMemo(() => {
    const values = new Set(jobCategoryValues)
    const currentTitle = (newJobForm.title || '').trim()
    if (currentTitle) {
      values.add(currentTitle)
    }

    return Array.from(values)
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({
        value,
        label: value,
      }))
  }, [jobCategoryValues, newJobForm.title])

  useEffect(() => {
    if (calendarPrefillApplied) return
    if (searchParams.get('create') !== '1') return

    const date = searchParams.get('date') || ''
    const time = normalizeTime24(searchParams.get('time') || '')
    const memberId = searchParams.get('member') || ''

    const selectedEmployees = memberId && employees.some((employee) => employee.id === memberId)
      ? [memberId]
      : []

    setEditingJobId(null)
    setShowTasksSection(false)
    setSelectedTeamMemberToAdd('')
    setNewJobForm((prev) => ({
      ...prev,
      scheduledDate: date,
      scheduledEndDate: date,
      scheduledTime: time,
      endTime: prev.endTime || time,
      selectedEmployees,
      teamRequired: selectedEmployees.length > 0 ? Math.max(1, selectedEmployees.length) : prev.teamRequired
    }))
    setShowNewJobModal(true)
    setCalendarPrefillApplied(true)

    router.replace('/admin/jobs')
  }, [calendarPrefillApplied, employees, router, searchParams])

  // Fetch jobs, employees, clients, equipment, permits and services from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs
        const jobsQuery = query(collection(db, 'jobs'))
        const jobsSnapshot = await getDocs(jobsQuery)
        
        const jobsData = jobsSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title || '',
            client: data.client || '',
            clientId: data.clientId || '',
            status: data.status || 'Pending',
            priority: data.priority || 'Medium',
            scheduledDate: data.scheduledDate || null,
            scheduledEndDate: data.scheduledEndDate || data.scheduledDate || null,
            scheduledTime: normalizeTime24(data.scheduledTime) || '',
            endTime: normalizeTime24(data.endTime) || '',
            location: data.location || '',
            teamRequired: data.teamRequired || 1,
            budget: data.budget || 0,
            actualCost: data.actualCost || 0,
            description: data.description || '',
            riskLevel: data.riskLevel || 'Low',
            slaDeadline: data.slaDeadline || '',
            estimatedDuration: data.estimatedDuration || '',
            estimatedDurationMinutes: data.estimatedDurationMinutes || 0,
            actualDuration: data.actualDuration || '',
            actualDurationMinutes: data.actualDurationMinutes || 0,
            timePerformanceStatus: data.timePerformanceStatus || 'Unknown',
            timePerformanceDeltaMinutes: data.timePerformanceDeltaMinutes || 0,
            timePerformanceNote: data.timePerformanceNote || '',
            requiredSkills: data.requiredSkills || [],
            equipment: data.equipment || [],
            permits: data.permits || [],
            tags: data.tags || [],
            specialInstructions: data.specialInstructions || '',
            recurring: data.recurring || false,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            completedAt: data.completedAt || '',
            executionLogs: data.executionLogs || [],
            assignedTo: data.assignedTo || [],
            assignedEmployees: data.assignedEmployees || [],
            jobCreatedBy: data.jobCreatedBy || '', // 👈 NEW FIELD FROM DATABASE
            jobResponsibleBy: data.jobResponsibleBy || '',
            reminderEnabled: data.reminderEnabled || false,
            reminderDate: data.reminderDate || '',
            reminderSent: data.reminderSent || false,
            services: data.services || [],
            tasks: data.tasks || [],
            overtimeRequired: data.overtimeRequired || false,
            overtimeHours: data.overtimeHours || 0,
            overtimeReason: data.overtimeReason || '',
            overtimeApproved: data.overtimeApproved || false,
            listingDurationDays: data.listingDurationDays || 0,
            listingExpiresAt: data.listingExpiresAt || '',
            quotationRequired: data.quotationRequired || false,
            quotationStatus: data.quotationStatus || 'Not Required',
            surveyRequired: data.surveyRequired || false,
            surveyStatus: data.surveyStatus || 'Not Required',
            paymentStatus: data.paymentStatus || 'Pending',
            paymentMethod: data.paymentMethod || 'N/A',
            paymentReference: data.paymentReference || '',
            paymentLinkGeneratedBy: data.paymentLinkGeneratedBy || '',
            availabilityOverride: data.availabilityOverride || false
          } as Job
        })

        // Auto-expire jobs whose listingExpiresAt has passed
        const today = new Date().toISOString().split('T')[0]
        const expiredJobs = jobsData.filter(
          j => j.listingExpiresAt && j.listingExpiresAt < today && j.status !== 'Expired' && j.status !== 'Completed' && j.status !== 'Cancelled'
        )
        for (const expiredJob of expiredJobs) {
          try {
            await updateDoc(doc(db, 'jobs', expiredJob.id), { status: 'Expired', updatedAt: new Date().toISOString() })
            expiredJob.status = 'Expired'
          } catch (e) {
            console.error('Failed to expire job', expiredJob.id, e)
          }
        }

        setJobs(jobsData)

        // Fetch employees
        const employeesQuery = query(collection(db, 'employees'), where('status', '==', 'Active'))
        const employeesSnapshot = await getDocs(employeesQuery)
        
        const employeesData = employeesSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            department: data.department || '',
            position: data.position || '',
            status: data.status || 'Active'
          } as Employee
        })
        
        setEmployees(employeesData)

        // Fetch user availability mapping (employee:<id>)
        const availabilitySnapshot = await getDocs(collection(db, 'user-availability'))
        const availabilityMap: Record<string, UserWeeklyAvailability> = {}
        availabilitySnapshot.docs.forEach((availabilityDoc) => {
          const data = availabilityDoc.data() as {
            userId?: string
            userType?: string
            weeklyAvailability?: UserWeeklyAvailability
          }
          if (!data.userId || !data.userType || !data.weeklyAvailability) return
          availabilityMap[`${data.userType}:${data.userId}`] = data.weeklyAvailability
        })
        setUserAvailability(availabilityMap)

        // Fetch ALL clients
        const clientsList: ClientLead[] = []
        const clientsQuery = query(collection(db, 'clients'))
        const clientsSnapshot = await getDocs(clientsQuery)
        clientsSnapshot.forEach((doc) => {
          const data = doc.data()
          clientsList.push({
            id: doc.id,
            name: data.name || '',
            company: data.company || '',
            email: data.email || '',
            phone: data.phone || '',
            type: 'client',
            status: data.status || 'Active'
          })
        })

        // Fetch ONLY Won and Qualified leads
        const leadsList: ClientLead[] = []
        const leadsQuery = query(
          collection(db, 'leads'),
          where('status', 'in', ['Won', 'Qualified'])
        )
        const leadsSnapshot = await getDocs(leadsQuery)
        leadsSnapshot.forEach((doc) => {
          const data = doc.data()
          leadsList.push({
            id: doc.id,
            name: data.name || '',
            company: data.company || '',
            email: data.email || '',
            phone: data.phone || '',
            type: 'lead',
            status: data.status || 'Won'
          })
        })

        setClients([...clientsList, ...leadsList].sort((a, b) => a.name.localeCompare(b.name)))

        // Fetch equipment
        const equipmentQuery = query(collection(db, 'equipment'))
        const equipmentSnapshot = await getDocs(equipmentQuery)
        
        const equipmentData = equipmentSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || '',
            category: data.category || '',
            condition: data.condition || '',
            cost: data.cost || 0,
            location: data.location || '',
            status: data.status || 'Available',
            quantity: data.quantity || 1,
            purchaseDate: data.purchaseDate || '',
            lastServiced: data.lastServiced || '',
            maintenanceDate: data.maintenanceDate || '',
            createdAt: data.createdAt || new Date().toISOString()
          } as Equipment
        })
        
        setEquipment(equipmentData)

        // Fetch permits_licenses
        const permitsQuery = query(collection(db, 'permits_licenses'))
        const permitsSnapshot = await getDocs(permitsQuery)
        
        const permitsData = permitsSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || '',
            category: data.category || '',
            cost: data.cost || 0,
            expiryDate: data.expiryDate || '',
            issueDate: data.issueDate || '',
            issuer: data.issuer || '',
            renewalDate: data.renewalDate || '',
            status: data.status || 'Active',
            createdAt: data.createdAt || new Date().toISOString(),
            pdfUrl: data.pdfUrl || ''
          } as PermitLicense
        })
        
        setPermits(permitsData)

        // Fetch services
        const servicesQuery = query(collection(db, 'services'))
        const servicesSnapshot = await getDocs(servicesQuery)
        
        const servicesData = servicesSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            price: data.price || 0,
            cost: data.cost || 0,
            categoryId: data.categoryId || '',
            categoryName: data.categoryName || '',
            imageUrl: data.imageUrl || '',
            sku: data.sku || '',
            status: data.status || 'ACTIVE',
            type: data.type || 'SERVICE',
            unit: data.unit || 'Unit',
            stock: data.stock || 0,
            minStock: data.minStock || 0,
            createdAt: data.createdAt || '',
            updatedAt: data.updatedAt || ''
          } as ServiceItem
        })
        
        setServices(servicesData)

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleEditJob = async (jobId: string) => {
    try {
      setLoading(true)
      const jobDoc = doc(db, 'jobs', jobId)
      const jobSnapshot = await getDoc(jobDoc)
      
      if (jobSnapshot.exists()) {
        const jobData = jobSnapshot.data()
        
        const selectedEquipment = equipment
          .filter(eq => jobData.equipment?.includes(eq.name))
          .map(eq => eq.id)

        const selectedPermits = permits
          .filter(p => jobData.permits?.includes(p.name))
          .map(p => p.id)

        const selectedServices = services
          .filter(svc => jobData.services?.some((s: JobService) => s.name === svc.name))
          .map(svc => svc.id)

        setNewJobForm({
          title: jobData.title || '',
          client: jobData.client || '',
          clientId: jobData.clientId || null,
          priority: jobData.priority || 'Medium',
          scheduledDate: jobData.scheduledDate || '',
          scheduledEndDate: jobData.scheduledEndDate || jobData.scheduledDate || '',
          scheduledTime: normalizeTime24(jobData.scheduledTime) || '',
          endTime: normalizeTime24(jobData.endTime) || '',
          location: jobData.location || '',
          teamRequired: jobData.teamRequired || 1,
          budget: jobData.budget || 0,
          description: jobData.description || '',
          riskLevel: jobData.riskLevel || 'Low',
          slaDeadline: jobData.slaDeadline || '',
          estimatedDuration: jobData.estimatedDuration || '',
          requiredSkills: jobData.requiredSkills?.join(', ') || '',
          tags: jobData.tags?.join(', ') || '',
          specialInstructions: jobData.specialInstructions || '',
          recurring: jobData.recurring || false,
          selectedEmployees: jobData.assignedEmployees?.map((emp: { id: string }) => emp.id) || [],
          jobCreatedBy: jobData.jobCreatedBy || '', // 👈 NEW FIELD ADDED TO EDIT
          jobResponsibleBy: jobData.jobResponsibleBy || jobData.jobCreatedBy || '',
          services: jobData.services || [],
          upsales: jobData.upsales || [],
          tasks: jobData.tasks || [],
          selectedEquipment: selectedEquipment,
          selectedPermits: selectedPermits,
          selectedServices: selectedServices,
          listingDurationDays: jobData.listingDurationDays || 0,
          quotationRequired: jobData.quotationRequired || false,
          quotationStatus: jobData.quotationStatus || 'Not Required',
          surveyRequired: jobData.surveyRequired || false,
          surveyStatus: jobData.surveyStatus || 'Not Required',
          paymentStatus: jobData.paymentStatus || 'Pending',
          paymentMethod: jobData.paymentMethod || 'N/A',
          paymentReference: jobData.paymentReference || '',
          paymentLinkGeneratedBy: jobData.paymentLinkGeneratedBy || '',
          allowValidationOverride: false
        })
        
        setEditingJobId(jobId)
        setSelectedTeamMemberToAdd('')
        setShowNewJobModal(true)
      }
    } catch (error) {
      console.error('Error fetching job for edit:', error)
      alert('Error loading job details')
    } finally {
      setLoading(false)
    }
  }

  const handleViewJob = (jobId: string) => {
    router.push(`/admin/jobs/${jobId}`)
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      setLoading(true)
      
      const jobRef = doc(db, 'jobs', jobId)
      await deleteDoc(jobRef)
      
      setJobs(jobs.filter(j => j.id !== jobId))
      setShowDeleteConfirm(null)
      alert('Job deleted successfully!')
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Error deleting job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toMinutes = (value?: string) => {
    if (!value || !value.includes(':')) return null
    const [hours, minutes] = value.split(':').map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
    return (hours * 60) + minutes
  }

  const normalizeTime24 = (value?: string) => {
    if (!value) return ''
    const trimmed = value.trim()

    const hhmmMatch = /^(\d{1,2}):(\d{2})$/.exec(trimmed)
    if (hhmmMatch) {
      const hours = Number(hhmmMatch[1])
      const minutes = Number(hhmmMatch[2])
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      }
    }

    const ampmMatch = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(trimmed)
    if (ampmMatch) {
      let hours = Number(ampmMatch[1])
      const minutes = Number(ampmMatch[2])
      const meridiem = ampmMatch[3].toUpperCase()
      if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
        if (meridiem === 'AM') {
          hours = hours === 12 ? 0 : hours
        } else {
          hours = hours === 12 ? 12 : hours + 12
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      }
    }

    return ''
  }

  const parseDurationToMinutes = (value?: string) => {
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

  const formatMinutesAsDuration = (minutes?: number | null) => {
    if (minutes == null || Number.isNaN(minutes) || minutes < 0) return ''
    const safe = Math.round(minutes)
    const hours = Math.floor(safe / 60)
    const mins = safe % 60
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
    if (hours > 0) return `${hours}h`
    return `${mins}m`
  }

  const toTimeLabel = (minutes: number) => {
    const safe = Math.max(0, Math.min(minutes, 23 * 60 + 59))
    const hrs = Math.floor(safe / 60)
    const mins = safe % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }

  const doesOverlap = (startA: number, endA: number, startB: number, endB: number) => {
    return startA < endB && startB < endA
  }

  const getDayKeyFromDate = (dateValue: string): DayKey | null => {
    if (!dateValue) return null
    const parsed = new Date(`${dateValue}T00:00:00`)
    if (Number.isNaN(parsed.getTime())) return null
    const day = parsed.getDay()
    if (day === 1) return 'monday'
    if (day === 2) return 'tuesday'
    if (day === 3) return 'wednesday'
    if (day === 4) return 'thursday'
    if (day === 5) return 'friday'
    if (day === 6) return 'saturday'
    return 'sunday'
  }

  const isDateInRange = (target: string, start?: string | null, end?: string | null) => {
    if (!target || !start) return false
    const targetDate = new Date(`${target}T00:00:00`)
    const startDate = new Date(`${start}T00:00:00`)
    const endDateValue = end || start
    const endDate = new Date(`${endDateValue}T00:00:00`)

    if ([targetDate, startDate, endDate].some((date) => Number.isNaN(date.getTime()))) return false

    return targetDate >= startDate && targetDate <= endDate
  }

  const schedulingInsights = useMemo(() => {
    if (!newJobForm.scheduledDate) {
      return {
        hasSchedule: false,
        isValidTimeRange: true,
        availableAtRequested: totalTeamCapacity,
        isRequestedSlotAvailable: true,
        nextAvailableTime: null as string | null,
        blockingJobs: [] as string[]
      }
    }

    const requestedStart = toMinutes(newJobForm.scheduledTime)
    const requestedEnd = toMinutes(newJobForm.endTime)
    const fallbackEnd = requestedStart != null ? requestedStart + 120 : null
    const slotStart = requestedStart
    const slotEnd = requestedEnd ?? fallbackEnd
    const bufferMinutes = Math.max(0, travelBufferMinutes) + Math.max(0, lunchBufferMinutes)
    const hasSchedule = slotStart != null && slotEnd != null

    if (!hasSchedule) {
      return {
        hasSchedule: false,
        isValidTimeRange: true,
        availableAtRequested: totalTeamCapacity,
        isRequestedSlotAvailable: true,
        nextAvailableTime: null as string | null,
        blockingJobs: [] as string[]
      }
    }

    const activeJobs = jobs.filter((job) => {
      if (editingJobId && job.id === editingJobId) return false
      if (!newJobForm.scheduledDate || !isDateInRange(newJobForm.scheduledDate, job.scheduledDate, job.scheduledEndDate)) return false
      if (!job.scheduledTime || !job.endTime) return false
      return ['Pending', 'Scheduled', 'In Progress'].includes(job.status)
    })

    const requestedStartBooked = activeJobs.reduce((sum, job) => {
      const jobStart = toMinutes(job.scheduledTime)
      const jobEnd = toMinutes(job.endTime)
      if (jobStart == null || jobEnd == null) return sum
      const adjustedEnd = jobEnd + bufferMinutes
      if (requestedStart != null && requestedStart >= jobStart && requestedStart < adjustedEnd) {
        return sum + Math.max(1, Number(job.teamRequired) || 1)
      }
      return sum
    }, 0)

    const availableAtRequested = Math.max(0, totalTeamCapacity - requestedStartBooked)

    const blockingJobs = activeJobs
      .filter((job) => {
        const jobStart = toMinutes(job.scheduledTime)
        const jobEnd = toMinutes(job.endTime)
        if (jobStart == null || jobEnd == null || slotStart == null || slotEnd == null) return false
        const adjustedEnd = jobEnd + bufferMinutes
        return doesOverlap(slotStart, slotEnd, jobStart, adjustedEnd)
      })
      .map((job) => `${job.title} (${job.scheduledTime}-${job.endTime})`)

    const requiredTeam = Math.max(1, Number(newJobForm.teamRequired) || 1)
    const isValidTimeRange = slotEnd > slotStart

    const isRequestedSlotAvailable =
      isValidTimeRange &&
      availableAtRequested >= requiredTeam &&
      activeJobs.every((job) => {
        const jobStart = toMinutes(job.scheduledTime)
        const jobEnd = toMinutes(job.endTime)
        if (jobStart == null || jobEnd == null || slotStart == null || slotEnd == null) return true
        if (!doesOverlap(slotStart, slotEnd, jobStart, jobEnd + bufferMinutes)) return true

        // Check net manpower during overlap windows.
        const bookedInOverlap = activeJobs.reduce((sum, innerJob) => {
          const innerStart = toMinutes(innerJob.scheduledTime)
          const innerEnd = toMinutes(innerJob.endTime)
          if (innerStart == null || innerEnd == null) return sum
          if (!doesOverlap(slotStart, slotEnd, innerStart, innerEnd + bufferMinutes)) return sum
          return sum + Math.max(1, Number(innerJob.teamRequired) || 1)
        }, 0)

        return bookedInOverlap + requiredTeam <= totalTeamCapacity
      })

    let nextAvailableTime: string | null = null
    if (!isRequestedSlotAvailable && slotStart != null && slotEnd != null) {
      const duration = slotEnd - slotStart
      const dayEnd = toMinutes('18:00') ?? 1080
      for (let start = slotStart; start <= dayEnd - duration; start += 15) {
        const candidateEnd = start + duration
        const canFit = activeJobs.reduce((sum, job) => {
          const jobStart = toMinutes(job.scheduledTime)
          const jobEnd = toMinutes(job.endTime)
          if (jobStart == null || jobEnd == null) return sum
          if (!doesOverlap(start, candidateEnd, jobStart, jobEnd + bufferMinutes)) return sum
          return sum + Math.max(1, Number(job.teamRequired) || 1)
        }, 0) + requiredTeam <= totalTeamCapacity

        if (canFit) {
          nextAvailableTime = toTimeLabel(start)
          break
        }
      }
    }

    return {
      hasSchedule,
      isValidTimeRange,
      availableAtRequested,
      isRequestedSlotAvailable,
      nextAvailableTime,
      blockingJobs
    }
  }, [
    newJobForm.scheduledDate,
    newJobForm.scheduledTime,
    newJobForm.endTime,
    newJobForm.teamRequired,
    totalTeamCapacity,
    travelBufferMinutes,
    lunchBufferMinutes,
    jobs,
    editingJobId
  ])

  const employeeScheduleInsights = useMemo(() => {
    const selectedEmployeeIds = newJobForm.selectedEmployees
    const dayKey = getDayKeyFromDate(newJobForm.scheduledDate)
    const start = toMinutes(newJobForm.scheduledTime)
    const end = toMinutes(newJobForm.endTime)
    const fallbackEnd = start != null ? start + 120 : null
    const slotStart = start
    const slotEnd = end ?? fallbackEnd

    if (!dayKey || slotStart == null || slotEnd == null || selectedEmployeeIds.length === 0) {
      return {
        hasTeamScheduleCheck: false,
        isTeamSlotValid: true,
        unavailableEmployees: [] as string[],
        suggestedStartTimes: [] as string[]
      }
    }

    const activeJobs = jobs.filter((job) => {
      if (editingJobId && job.id === editingJobId) return false
      if (!newJobForm.scheduledDate || !isDateInRange(newJobForm.scheduledDate, job.scheduledDate, job.scheduledEndDate)) return false
      if (!job.scheduledTime || !job.endTime) return false
      return ['Pending', 'Scheduled', 'In Progress'].includes(job.status)
    })

    const isEmployeeAvailableAtRange = (employeeId: string, startMinutes: number, endMinutes: number) => {
      const weeklyAvailability = userAvailability[`employee:${employeeId}`]
      const dayRanges = weeklyAvailability?.[dayKey] || []
      const inAvailability = dayRanges.some((range) => {
        const rangeStart = toMinutes(range.start)
        const rangeEnd = toMinutes(range.end)
        if (rangeStart == null || rangeEnd == null) return false
        return rangeStart <= startMinutes && rangeEnd >= endMinutes
      })

      if (!inAvailability) {
        return false
      }

      const hasJobConflict = activeJobs.some((job) => {
        const isAssigned = Array.isArray(job.assignedEmployees)
          ? job.assignedEmployees.some((emp: { id?: string }) => emp?.id === employeeId)
          : false
        if (!isAssigned) return false
        const jobStart = toMinutes(job.scheduledTime)
        const jobEnd = toMinutes(job.endTime)
        if (jobStart == null || jobEnd == null) return false
        return doesOverlap(startMinutes, endMinutes, jobStart, jobEnd)
      })

      return !hasJobConflict
    }

    const unavailableEmployees = selectedEmployeeIds
      .map((employeeId) => {
        const employee = employees.find((item) => item.id === employeeId)
        const label = employee?.name || employeeId
        const weeklyAvailability = userAvailability[`employee:${employeeId}`]
        const dayRanges = weeklyAvailability?.[dayKey] || []

        if (dayRanges.length === 0) {
          return `${label} (no shift/availability set)`
        }

        const inAvailability = dayRanges.some((range) => {
          const rangeStart = toMinutes(range.start)
          const rangeEnd = toMinutes(range.end)
          if (rangeStart == null || rangeEnd == null) return false
          return rangeStart <= slotStart && rangeEnd >= slotEnd
        })

        if (!inAvailability) {
          return `${label} (outside shift slots)`
        }

        const hasJobConflict = activeJobs.some((job) => {
          const isAssigned = Array.isArray(job.assignedEmployees)
            ? job.assignedEmployees.some((emp: { id?: string }) => emp?.id === employeeId)
            : false
          if (!isAssigned) return false
          const jobStart = toMinutes(job.scheduledTime)
          const jobEnd = toMinutes(job.endTime)
          if (jobStart == null || jobEnd == null) return false
          return doesOverlap(slotStart, slotEnd, jobStart, jobEnd)
        })

        if (hasJobConflict) {
          return `${label} (already booked)`
        }

        return null
      })
      .filter((value): value is string => Boolean(value))

    const duration = slotEnd - slotStart
    const suggestedStartTimes: string[] = []
    const searchStart = toMinutes('06:00') ?? 360
    const searchEnd = toMinutes('22:00') ?? 1320

    for (let candidateStart = searchStart; candidateStart <= searchEnd - duration; candidateStart += 60) {
      const candidateEnd = candidateStart + duration
      const canFitAll = selectedEmployeeIds.every((employeeId) => isEmployeeAvailableAtRange(employeeId, candidateStart, candidateEnd))
      if (canFitAll) {
        suggestedStartTimes.push(toTimeLabel(candidateStart))
      }
      if (suggestedStartTimes.length >= 3) break
    }

    return {
      hasTeamScheduleCheck: true,
      isTeamSlotValid: unavailableEmployees.length === 0,
      unavailableEmployees,
      suggestedStartTimes
    }
  }, [
    newJobForm.selectedEmployees,
    newJobForm.scheduledDate,
    newJobForm.scheduledTime,
    newJobForm.endTime,
    jobs,
    userAvailability,
    employees,
    editingJobId
  ])

  // Helper function to get creator name
  const getCreatorName = useCallback((creatorId: string) => {
    const creator = employees.find(e => e.id === creatorId)
    return creator ? creator.name : 'Unknown'
  }, [employees])

  const createJobAuditLog = useCallback(async (action: string, jobId: string, summary: string) => {
    try {
      await addDoc(collection(db, 'job-audit-logs'), {
        jobId,
        action,
        summary,
        actorId: newJobForm.jobCreatedBy || 'unknown',
        actorName: getCreatorName(newJobForm.jobCreatedBy),
        createdAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Failed to create job audit log:', error)
    }
  }, [newJobForm.jobCreatedBy, getCreatorName])

  const createOperationsNotification = useCallback(async (jobId: string, message: string) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        type: 'job_scheduled',
        audience: 'operations',
        jobId,
        message,
        status: 'unread',
        createdAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to create operations notification:', error)
    }
  }, [])

  const createAssignmentNotifications = useCallback(async (jobId: string, jobTitle: string, assigned: { id: string; name: string; email: string }[]) => {
    if (assigned.length === 0) return
    try {
      await Promise.all(
        assigned.map((employee) =>
          addDoc(collection(db, 'notifications'), {
            type: 'job_assignment',
            audience: 'employee',
            employeeId: employee.id,
            employeeName: employee.name,
            employeeEmail: employee.email,
            jobId,
            message: `You have been assigned to job: ${jobTitle}`,
            status: 'unread',
            createdAt: new Date().toISOString()
          })
        )
      )
    } catch (error) {
      console.error('Failed to create assignment notifications:', error)
    }
  }, [])

  const handleSaveJob = useCallback(async () => {
    if (!newJobForm.title || !newJobForm.client || !newJobForm.location) {
      alert('Please fill in all required fields: Title, Client, and Location')
      return
    }

    if (!newJobForm.jobCreatedBy) {
      alert('Please select the member who is creating this job')
      return
    }

    if (!newJobForm.jobResponsibleBy) {
      alert('Please select the responsible person for this job')
      return
    }

    if (newJobForm.quotationRequired && newJobForm.quotationStatus !== 'Approved' && !newJobForm.allowValidationOverride) {
      alert('Quotation must be approved before scheduling this job. Enable override to proceed anyway.')
      return
    }

    if (newJobForm.surveyRequired && newJobForm.surveyStatus !== 'Completed' && !newJobForm.allowValidationOverride) {
      alert('Survey must be completed before scheduling this job. Enable override to proceed anyway.')
      return
    }

    if (newJobForm.paymentStatus === 'Pending' && !newJobForm.allowValidationOverride) {
      alert('Payment is pending. Scheduling is blocked unless override is enabled.')
      return
    }

    if (newJobForm.scheduledDate && newJobForm.scheduledEndDate) {
      const startDate = new Date(`${newJobForm.scheduledDate}T00:00:00`)
      const endDate = new Date(`${newJobForm.scheduledEndDate}T00:00:00`)
      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        alert('Please enter valid start and end dates.')
        return
      }
      if (endDate < startDate) {
        alert('End date must be the same as or after the start date.')
        return
      }
    }

    if (newJobForm.scheduledDate && (newJobForm.scheduledTime || newJobForm.endTime)) {
      if (!schedulingInsights.isValidTimeRange) {
        alert('End time must be greater than start time.')
        return
      }

      if (!schedulingInsights.isRequestedSlotAvailable && !newJobForm.allowValidationOverride) {
        const nextSlotText = schedulingInsights.nextAvailableTime
          ? `Next available slot is ${schedulingInsights.nextAvailableTime}.`
          : 'No slot is available in current working hours.'
        alert(`Insufficient manpower for this slot. ${nextSlotText} You can enable override to proceed anyway.`)
        return
      }

      if (!employeeScheduleInsights.isTeamSlotValid && !newJobForm.allowValidationOverride) {
        const suggestionText = employeeScheduleInsights.suggestedStartTimes.length > 0
          ? ` Suggested aligned slots: ${employeeScheduleInsights.suggestedStartTimes.join(', ')}.`
          : ''
        alert(`Selected team members are not fully available for this job slot: ${employeeScheduleInsights.unavailableEmployees.join(' | ')}.${suggestionText}`)
        return
      }
    }

    try {
      setLoading(true)
      
      const selectedEmployeesDetails = employees
        .filter(emp => newJobForm.selectedEmployees.includes(emp.id))
        .map(emp => ({
          id: emp.id,
          name: emp.name,
          email: emp.email
        }))

      const selectedEquipmentNames = equipment
        .filter(eq => newJobForm.selectedEquipment.includes(eq.id))
        .map(eq => eq.name)

      const selectedPermitNames = permits
        .filter(p => newJobForm.selectedPermits.includes(p.id))
        .map(p => p.name)

      const enteredBudget = Math.max(0, Number(newJobForm.budget) || 0)
      const taxAmount = Number((enteredBudget * JOB_TAX_RATE).toFixed(2))
      const budgetWithTax = Number((enteredBudget + taxAmount).toFixed(2))
      const existingJob = editingJobId ? jobs.find((job) => job.id === editingJobId) : null

      const jobData = {
        title: newJobForm.title,
        client: newJobForm.client,
        clientId: newJobForm.clientId || '',
        priority: newJobForm.priority,
        scheduledDate: newJobForm.scheduledDate || null,
        scheduledEndDate: newJobForm.scheduledEndDate || newJobForm.scheduledDate || null,
        scheduledTime: normalizeTime24(newJobForm.scheduledTime),
        endTime: normalizeTime24(newJobForm.endTime),
        location: newJobForm.location,
        teamRequired: newJobForm.teamRequired,
        budget: editingJobId ? enteredBudget : budgetWithTax,
        baseBudget: enteredBudget,
        taxRate: JOB_TAX_RATE,
        taxAmount,
        description: newJobForm.description,
        riskLevel: newJobForm.riskLevel,
        slaDeadline: newJobForm.slaDeadline,
        estimatedDuration: newJobForm.estimatedDuration,
        estimatedDurationMinutes: parseDurationToMinutes(newJobForm.estimatedDuration) || 0,
        actualDuration: existingJob?.actualDuration || '',
        actualDurationMinutes: existingJob?.actualDurationMinutes || 0,
        timePerformanceStatus: existingJob?.timePerformanceStatus || 'Unknown',
        timePerformanceDeltaMinutes: existingJob?.timePerformanceDeltaMinutes || 0,
        timePerformanceNote: existingJob?.timePerformanceNote || '',
        requiredSkills: newJobForm.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        equipment: selectedEquipmentNames,
        permits: selectedPermitNames,
        tags: newJobForm.tags.split(',').map(s => s.trim()).filter(s => s),
        specialInstructions: newJobForm.specialInstructions,
        recurring: newJobForm.recurring,
        services: newJobForm.services || [],
        upsales: newJobForm.upsales || [],
        tasks: newJobForm.tasks || [],
        updatedAt: new Date().toISOString(),
        assignedTo: selectedEmployeesDetails.map(emp => emp.name),
        assignedEmployees: selectedEmployeesDetails,
        jobCreatedBy: newJobForm.jobCreatedBy, // 👈 NEW FIELD SAVED TO FIREBASE
        jobResponsibleBy: newJobForm.jobResponsibleBy || '',
        quotationRequired: newJobForm.quotationRequired,
        quotationStatus: newJobForm.quotationRequired ? newJobForm.quotationStatus : 'Not Required',
        surveyRequired: newJobForm.surveyRequired,
        surveyStatus: newJobForm.surveyRequired ? newJobForm.surveyStatus : 'Not Required',
        paymentStatus: newJobForm.paymentStatus,
        paymentMethod: newJobForm.paymentMethod,
        paymentReference: newJobForm.paymentReference,
        paymentLinkGeneratedBy: newJobForm.paymentLinkGeneratedBy,
        availabilityOverride: newJobForm.allowValidationOverride,
        actualCost: 0,
        reminderEnabled: false,
        listingDurationDays: newJobForm.listingDurationDays || 0,
        listingExpiresAt: newJobForm.listingDurationDays > 0
          ? (() => { const d = new Date(); d.setDate(d.getDate() + newJobForm.listingDurationDays); return d.toISOString().split('T')[0] })()
          : ''
      }

      if (editingJobId) {
        const jobRef = doc(db, 'jobs', editingJobId)
        await updateDoc(jobRef, jobData)
        await createJobAuditLog('updated', editingJobId, 'Job updated with schedule/payment/team details')
        if (newJobForm.allowValidationOverride) {
          await createJobAuditLog('override_used', editingJobId, 'Validation override used during job update')
        }
        await createAssignmentNotifications(editingJobId, newJobForm.title, selectedEmployeesDetails)

        if (jobData.scheduledDate && jobData.scheduledTime) {
          await createOperationsNotification(editingJobId, `Job scheduled: ${newJobForm.title} on ${jobData.scheduledDate} at ${jobData.scheduledTime}`)
        }

        if (jobData.recurring && jobData.scheduledDate) {
          await addDoc(collection(db, 'reminders'), {
            type: 'weekly_payment_followup',
            jobId: editingJobId,
            customerName: newJobForm.client,
            triggerDate: jobData.scheduledDate,
            repeat: 'weekly',
            assignedTo: newJobForm.jobCreatedBy,
            message: `Collect weekly advance payment for ${newJobForm.client}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
        
        setJobs(jobs.map(j =>
          j.id === editingJobId
            ? { ...j, ...jobData, id: editingJobId }
            : j
        ))
        alert('Job updated successfully!')
      } else {
        const newJobData = {
          ...jobData,
          status: jobData.scheduledDate && jobData.scheduledTime ? 'Scheduled' : 'Pending',
          createdAt: new Date().toISOString(),
          completedAt: '',
          executionLogs: [],
          reminderSent: false,
          overtimeRequired: false,
          overtimeHours: 0,
          overtimeReason: '',
          overtimeApproved: false
        }

        const docRef = await addDoc(collection(db, 'jobs'), newJobData)
        await createJobAuditLog('created', docRef.id, 'Job created with schedule/payment/team details')
        if (newJobForm.allowValidationOverride) {
          await createJobAuditLog('override_used', docRef.id, 'Validation override used during job creation')
        }
        await createAssignmentNotifications(docRef.id, newJobForm.title, selectedEmployeesDetails)

        if (newJobData.status === 'Scheduled') {
          await createOperationsNotification(docRef.id, `Job scheduled: ${newJobForm.title} on ${newJobData.scheduledDate} at ${newJobData.scheduledTime}`)
        }

        if (newJobData.recurring && newJobData.scheduledDate) {
          await addDoc(collection(db, 'reminders'), {
            type: 'weekly_payment_followup',
            jobId: docRef.id,
            customerName: newJobForm.client,
            triggerDate: newJobData.scheduledDate,
            repeat: 'weekly',
            assignedTo: newJobForm.jobCreatedBy,
            message: `Collect weekly advance payment for ${newJobForm.client}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
        
        const newJob: Job = {
          id: docRef.id,
          ...newJobData
        } as Job
        
        setJobs([...jobs, newJob])
        alert('Job created successfully!')
      }
      
      setShowNewJobModal(false)
      setEditingJobId(null)
      setSelectedTeamMemberToAdd('')
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Error saving job. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [
    newJobForm,
    jobs,
    editingJobId,
    employees,
    equipment,
    permits,
    schedulingInsights,
    employeeScheduleInsights,
    createJobAuditLog,
    createOperationsNotification,
    createAssignmentNotifications
  ])

  const stats = useMemo(() => ({
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'Pending').length,
    scheduled: jobs.filter(j => j.status === 'Scheduled').length,
    inProgress: jobs.filter(j => j.status === 'In Progress').length,
    completed: jobs.filter(j => j.status === 'Completed').length,
    totalBudget: jobs.reduce((sum, j) => sum + j.budget, 0),
    totalActualCost: jobs.reduce((sum, j) => sum + j.actualCost, 0),
    critical: jobs.filter(j => j.priority === 'Critical').length
  }), [jobs])

  const budgetTaxPreview = useMemo(() => {
    const base = Math.max(0, Number(newJobForm.budget) || 0)
    const tax = Number((base * JOB_TAX_RATE).toFixed(2))
    const total = Number((base + tax).toFixed(2))
    return { base, tax, total }
  }, [newJobForm.budget])

  const getLocalDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getJobDateKey = (job: Job) => {
    if (job.scheduledDate) return job.scheduledDate

    if (job.createdAt) {
      const parsed = new Date(job.createdAt)
      if (!Number.isNaN(parsed.getTime())) {
        return getLocalDateKey(parsed)
      }
    }

    return ''
  }

  const getJobDateRange = (job: Job) => {
    if (job.scheduledDate) {
      return {
        start: job.scheduledDate,
        end: job.scheduledEndDate || job.scheduledDate
      }
    }

    if (job.createdAt) {
      const parsed = new Date(job.createdAt)
      if (!Number.isNaN(parsed.getTime())) {
        const createdKey = getLocalDateKey(parsed)
        return { start: createdKey, end: createdKey }
      }
    }

    return { start: '', end: '' }
  }

  const filteredJobs = useMemo(() => {
    const now = new Date()
    const todayKey = getLocalDateKey(now)
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayKey = getLocalDateKey(yesterday)
    const nextDay = new Date(now)
    nextDay.setDate(nextDay.getDate() + 1)
    const nextDayKey = getLocalDateKey(nextDay)
    const timeFromMinutes = toMinutes(timeFromFilter)
    const timeToMinutes = toMinutes(timeToFilter)

    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'queued'
            ? job.status === 'Pending' || job.status === 'Scheduled'
            : job.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter
      const matchesCreator = creatorFilter === 'all' || job.jobCreatedBy === creatorFilter
      const matchesCategory = jobCategoryFilter === 'all' || (job.title || '').trim() === jobCategoryFilter

      const { start: jobStartDate, end: jobEndDate } = getJobDateRange(job)
      const matchesDate =
        dateFilter === 'all'
          ? true
          : dateFilter === 'today'
            ? isDateInRange(todayKey, jobStartDate, jobEndDate)
            : dateFilter === 'yesterday'
              ? isDateInRange(yesterdayKey, jobStartDate, jobEndDate)
              : dateFilter === 'nextDay'
                ? isDateInRange(nextDayKey, jobStartDate, jobEndDate)
              : customDateFilter
                ? isDateInRange(customDateFilter, jobStartDate, jobEndDate)
                : true

      let matchesTime = true
      if (timeFromMinutes != null || timeToMinutes != null) {
        const jobStartMinutes = toMinutes(job.scheduledTime)
        if (jobStartMinutes == null) {
          matchesTime = false
        } else {
          if (timeFromMinutes != null && jobStartMinutes < timeFromMinutes) {
            matchesTime = false
          }
          if (timeToMinutes != null && jobStartMinutes > timeToMinutes) {
            matchesTime = false
          }
        }
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesCreator && matchesCategory && matchesDate && matchesTime
    })
  }, [jobs, searchTerm, statusFilter, priorityFilter, creatorFilter, jobCategoryFilter, dateFilter, customDateFilter, timeFromFilter, timeToFilter])

  const handleExportJobs = useCallback(() => {
    if (filteredJobs.length === 0) {
      alert('No jobs to export with current filters.')
      return
    }

    const rows = filteredJobs.map(job => {
      const photosByStage = collectExecutionPhotosByStage(job.executionLogs || [])

      return ({
      'Job ID': job.id,
      'Title': job.title,
      'Client': job.client,
      'Client ID': job.clientId,
      'Status': job.status,
      'Priority': job.priority,
      'Risk Level': job.riskLevel,
      'Scheduled Date': job.scheduledDate || '',
      'Scheduled End Date': job.scheduledEndDate || job.scheduledDate || '',
      'Scheduled Time': job.scheduledTime || '',
      'End Time': job.endTime || '',
      'Location': job.location,
      'Team Required': job.teamRequired,
      'Budget (AED)': job.budget,
      'Actual Cost (AED)': job.actualCost,
      'Description': job.description,
      'SLA Deadline': job.slaDeadline || '',
      'Estimated Duration': job.estimatedDuration,
      'Estimated Duration (minutes)': job.estimatedDurationMinutes || '',
      'Actual Duration': job.actualDuration || '',
      'Actual Duration (minutes)': job.actualDurationMinutes || '',
      'Time Performance': job.timePerformanceStatus || 'Unknown',
      'Time Delta (minutes)': job.timePerformanceDeltaMinutes || '',
      'Time Note': job.timePerformanceNote || '',
      'Required Skills': (job.requiredSkills || []).join(', '),
      'Equipment': (job.equipment || []).join(', '),
      'Permits': (job.permits || []).join(', '),
      'Tags': (job.tags || []).join(', '),
      'Special Instructions': job.specialInstructions || '',
      'Recurring': job.recurring ? 'Yes' : 'No',
      'Created At': job.createdAt,
      'Updated At': job.updatedAt,
      'Completed At': job.completedAt || '',
      'Execution Logs': JSON.stringify(job.executionLogs || []),
      'Assigned To': (job.assignedTo || []).join(', '),
      'Assigned Employees': JSON.stringify(job.assignedEmployees || []),
      'Job Created By ID': job.jobCreatedBy || '',
      'Job Created By Name': job.jobCreatedBy ? getCreatorName(job.jobCreatedBy) : '',
      'Job Responsible By ID': job.jobResponsibleBy || '',
      'Job Responsible By Name': job.jobResponsibleBy ? getCreatorName(job.jobResponsibleBy) : '',
      'Reminder Enabled': job.reminderEnabled ? 'Yes' : 'No',
      'Reminder Date': job.reminderDate || '',
      'Reminder Sent': job.reminderSent ? 'Yes' : 'No',
      'Services': JSON.stringify(job.services || []),
      'Tasks': JSON.stringify(job.tasks || []),
      'Overtime Required': job.overtimeRequired ? 'Yes' : 'No',
      'Overtime Hours': job.overtimeHours || '',
      'Overtime Reason': job.overtimeReason || '',
      'Overtime Approved': job.overtimeApproved ? 'Yes' : 'No',
      'Listing Duration Days': job.listingDurationDays || '',
      'Listing Expires At': job.listingExpiresAt || '',
      'Quotation Required': job.quotationRequired ? 'Yes' : 'No',
      'Quotation Status': job.quotationStatus || '',
      'Survey Required': job.surveyRequired ? 'Yes' : 'No',
      'Survey Status': job.surveyStatus || '',
      'Payment Status': job.paymentStatus || '',
      'Payment Method': job.paymentMethod || '',
      'Payment Reference': job.paymentReference || '',
      'Payment Link Generated By': job.paymentLinkGeneratedBy || '',
      'Availability Override': job.availabilityOverride ? 'Yes' : 'No',
      'Before Photos': formatPhotosForExport(photosByStage.before),
      'In Progress Photos': formatPhotosForExport(photosByStage.inProgress),
      'After Photos': formatPhotosForExport(photosByStage.after),
      'Quality Check Photos': formatPhotosForExport(photosByStage.qualityCheck)
    })
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs')

    const dateStamp = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(workbook, `jobs-report-${dateStamp}.xlsx`)
  }, [filteredJobs, getCreatorName])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-300'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Scheduled': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Cancelled': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPaymentStatusColor = (paymentStatus?: Job['paymentStatus']) => {
    switch (paymentStatus) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Partially Paid':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Collect After Job':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'Pending':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300'
    }
  }

  const handleAddJob = () => {
    setEditingJobId(null)
    setShowTasksSection(false)
    setNewJobForm({
      title: '',
      client: '',
      clientId: null,
      priority: 'Medium',
      scheduledDate: '',
      scheduledEndDate: '',
      scheduledTime: '',
      endTime: '',
      location: '',
      teamRequired: 1,
      budget: 0,
      description: '',
      riskLevel: 'Low',
      slaDeadline: '',
      estimatedDuration: '',
      requiredSkills: '',
      tags: '',
      specialInstructions: '',
      recurring: false,
      selectedEmployees: [],
      jobCreatedBy: '', // 👈 RESET ON NEW JOB
      jobResponsibleBy: '',
      services: [],
      tasks: [],
      selectedEquipment: [],
      selectedPermits: [],
      selectedServices: [],
      listingDurationDays: 0,
      quotationRequired: false,
      quotationStatus: 'Not Required',
      surveyRequired: false,
      surveyStatus: 'Not Required',
      paymentStatus: 'Pending',
      paymentMethod: 'N/A',
      paymentReference: '',
      paymentLinkGeneratedBy: '',
      allowValidationOverride: false,
      upsales: []
    })
    setSelectedTeamMemberToAdd('')
    setShowNewJobModal(true)
  }

  const toggleEquipmentSelection = (equipmentId: string) => {
    setNewJobForm(prev => {
      if (prev.selectedEquipment.includes(equipmentId)) {
        return {
          ...prev,
          selectedEquipment: prev.selectedEquipment.filter(id => id !== equipmentId)
        }
      } else {
        return {
          ...prev,
          selectedEquipment: [...prev.selectedEquipment, equipmentId]
        }
      }
    })
  }

  const togglePermitSelection = (permitId: string) => {
    setNewJobForm(prev => {
      if (prev.selectedPermits.includes(permitId)) {
        return {
          ...prev,
          selectedPermits: prev.selectedPermits.filter(id => id !== permitId)
        }
      } else {
        return {
          ...prev,
          selectedPermits: [...prev.selectedPermits, permitId]
        }
      }
    })
  }

  const toggleServiceSelection = (serviceId: string) => {
    setNewJobForm(prev => {
      if (prev.selectedServices.includes(serviceId)) {
        const updatedServices = prev.services?.filter(svc => 
          !services.find(s => s.id === serviceId)?.name.includes(svc.name)
        ) || []
        
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(id => id !== serviceId),
          services: updatedServices
        }
      } else {
        const service = services.find(s => s.id === serviceId)
        if (service) {
          const newService: JobService = {
            id: serviceId,
            name: service.name,
            quantity: 1,
            unitPrice: service.price,
            total: service.price,
            description: service.description
          }
          
          return {
            ...prev,
            selectedServices: [...prev.selectedServices, serviceId],
            services: [...(prev.services || []), newService]
          }
        }
        return prev
      }
    })
  }

  const handleAddTask = () => {
    const newTask: JobTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      duration: 1,
      completed: false
    }
    
    setNewJobForm(prev => ({
      ...prev,
      tasks: [...(prev.tasks || []), newTask]
    }))
  }

  const updateTask = (index: number, field: keyof JobTask, value: JobTask[keyof JobTask]) => {
    const updatedTasks = [...(newJobForm.tasks || [])]
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    }
    
    setNewJobForm(prev => ({
      ...prev,
      tasks: updatedTasks
    }))
  }

  const removeTask = (index: number) => {
    const updatedTasks = (newJobForm.tasks || []).filter((_, i) => i !== index)
    setNewJobForm(prev => ({
      ...prev,
      tasks: updatedTasks
    }))
  }

  const handleToggleReminder = useCallback(async (jobId: string) => {
    try {
      const job = jobs.find(j => j.id === jobId)
      if (!job) return

      const newReminderEnabled = !job.reminderEnabled
      let reminderDate = job.reminderDate
      
      if (newReminderEnabled && job.scheduledDate) {
        const reminder = new Date(job.scheduledDate + 'T00:00:00')
        reminder.setDate(reminder.getDate() - 1)
        reminderDate = reminder.toISOString().split('T')[0]
      }

      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, {
        reminderEnabled: newReminderEnabled,
        reminderDate: reminderDate
      })

      setJobs(jobs.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            reminderEnabled: newReminderEnabled,
            reminderDate: reminderDate
          }
        }
        return j
      }))
    } catch (error) {
      console.error('Error updating reminder:', error)
      alert('Error updating reminder')
    }
  }, [jobs])

  const handleUpdateJobStatus = useCallback(async (jobId: string, newStatus: Job['status']) => {
    try {
      const selectedJob = jobs.find(j => j.id === jobId)
      if (!selectedJob) return

      const statusUpdate: Record<string, unknown> = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      }

      if (selectedJob && newStatus === 'Scheduled') {
        if (selectedJob.quotationRequired && selectedJob.quotationStatus !== 'Approved') {
          alert('Cannot schedule: quotation is not approved.')
          return
        }
        if (selectedJob.surveyRequired && selectedJob.surveyStatus !== 'Completed') {
          alert('Cannot schedule: survey is not completed.')
          return
        }
        if (selectedJob.paymentStatus === 'Pending') {
          alert('Cannot schedule: payment is pending.')
          return
        }
      }

      if (newStatus === 'Completed') {
        const completedAtIso = new Date().toISOString()
        const estimatedMinutes = parseDurationToMinutes(selectedJob.estimatedDuration)

        const executionStartLog = [...(selectedJob.executionLogs || [])]
          .reverse()
          .find((log) => typeof log.type === 'string' && log.type === 'execution_started')

        const startTimestampCandidate =
          (executionStartLog?.timestamp as string | undefined) ||
          (selectedJob.scheduledDate && selectedJob.scheduledTime
            ? `${selectedJob.scheduledDate}T${selectedJob.scheduledTime}:00`
            : '') ||
          selectedJob.createdAt

        const startDate = startTimestampCandidate ? new Date(startTimestampCandidate) : null
        const completedDate = new Date(completedAtIso)
        const actualMinutes = startDate && !Number.isNaN(startDate.getTime())
          ? Math.max(0, Math.round((completedDate.getTime() - startDate.getTime()) / 60000))
          : null

        const performanceStatus: Job['timePerformanceStatus'] =
          estimatedMinutes != null && actualMinutes != null
            ? (actualMinutes <= estimatedMinutes ? 'On Time' : 'Delayed')
            : 'Unknown'

        const deltaMinutes =
          estimatedMinutes != null && actualMinutes != null
            ? actualMinutes - estimatedMinutes
            : 0

        const performanceNote =
          performanceStatus === 'On Time'
            ? 'Completed within estimated time.'
            : performanceStatus === 'Delayed'
              ? 'Completed after estimated time.'
              : 'Insufficient timing data for comparison.'

        statusUpdate.completedAt = completedAtIso
        statusUpdate.estimatedDurationMinutes = estimatedMinutes || 0
        statusUpdate.actualDurationMinutes = actualMinutes || 0
        statusUpdate.actualDuration = formatMinutesAsDuration(actualMinutes)
        statusUpdate.timePerformanceStatus = performanceStatus
        statusUpdate.timePerformanceDeltaMinutes = deltaMinutes
        statusUpdate.timePerformanceNote = performanceNote
      }

      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, statusUpdate)

      await createJobAuditLog('status_updated', jobId, `Job status changed to ${newStatus}`)

      if (newStatus === 'Scheduled') {
        await createOperationsNotification(jobId, `Job moved to Scheduled status.`)
      }

      setJobs(jobs.map(j =>
        j.id === jobId
          ? { ...j, ...(statusUpdate as Partial<Job>) }
          : j
      ))
      alert(`Job status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating job status:', error)
      alert('Error updating job status')
    }
  }, [jobs, createJobAuditLog, createOperationsNotification])

  const handleStartExecution = (job: Job) => {
    setSelectedJobForExecution(job)
    setExecutionChecklist([])
    setExecutionNotes('')
    setExecutionPhotosByStage(createEmptyExecutionPhotos())
    setShowExecutionModal(true)
  }

  const handleExecutionPhotoUpload = async (stage: ExecutionPhotoStage, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedJobForExecution) {
      event.target.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file only.')
      event.target.value = ''
      return
    }

    const defaultTitle = file.name.replace(/\.[^/.]+$/, '') || EXECUTION_PHOTO_STAGE_LABELS[stage]
    const titleInput = window.prompt(`Enter a title for ${EXECUTION_PHOTO_STAGE_LABELS[stage]}`, defaultTitle)
    if (titleInput === null) {
      event.target.value = ''
      return
    }

    const descriptionInput = window.prompt(`Enter a description for ${EXECUTION_PHOTO_STAGE_LABELS[stage]} (optional)`, '')
    if (descriptionInput === null) {
      event.target.value = ''
      return
    }

    try {
      setUploadingPhotoStage(stage)

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `jobs/${selectedJobForExecution.id}/execution-photos/${stage}/${Date.now()}_${safeName}`
      const storageRef = ref(storage, filePath)

      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      const uploadedPhoto: ExecutionPhotoEvidence = {
        stage,
        title: titleInput.trim() || EXECUTION_PHOTO_STAGE_LABELS[stage],
        description: descriptionInput.trim(),
        url: downloadURL,
        fileName: file.name,
        uploadedAt: new Date().toISOString()
      }

      setExecutionPhotosByStage((prev) => ({
        ...prev,
        [stage]: uploadedPhoto
      }))
    } catch (error) {
      console.error('Error uploading execution photo:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploadingPhotoStage(null)
      event.target.value = ''
    }
  }

  const handleLogExecution = async () => {
    if (!selectedJobForExecution) return
    
    try {
      const jobRef = doc(db, 'jobs', selectedJobForExecution.id)
      await updateDoc(jobRef, {
        status: 'In Progress',
        updatedAt: new Date().toISOString()
      })

      const executionLog = {
        timestamp: new Date().toISOString(),
        checklist: executionChecklist,
        notes: executionNotes,
        photos: executionPhotosByStage,
        type: 'execution_started'
      }

      await updateDoc(jobRef, {
        executionLogs: [...selectedJobForExecution.executionLogs, executionLog]
      })

      handleUpdateJobStatus(selectedJobForExecution.id, 'In Progress')
      setShowExecutionModal(false)
    } catch (error) {
      console.error('Error logging execution:', error)
      alert('Error logging execution')
    }
  }

  const toggleEmployeeSelection = (employeeId: string) => {
    setNewJobForm(prev => {
      if (prev.selectedEmployees.includes(employeeId)) {
        return {
          ...prev,
          selectedEmployees: prev.selectedEmployees.filter(id => id !== employeeId)
        }
      } else {
        if (prev.selectedEmployees.length >= prev.teamRequired) {
          alert(`Maximum ${prev.teamRequired} employees can be assigned to this job. Please increase team size or remove existing selections.`)
          return prev
        }
        return {
          ...prev,
          selectedEmployees: [...prev.selectedEmployees, employeeId]
        }
      }
    })
  }

  const getSelectedEmployeeNames = () => {
    return newJobForm.selectedEmployees.map(empId => {
      const emp = employees.find(e => e.id === empId)
      return emp ? emp.name : ''
    }).filter(name => name)
  }

  const getSelectedEquipmentNames = () => {
    return newJobForm.selectedEquipment.map(eqId => {
      const eq = equipment.find(e => e.id === eqId)
      return eq ? `${eq.name} (${eq.category})` : ''
    }).filter(name => name)
  }

  const getSelectedPermitNames = () => {
    return newJobForm.selectedPermits.map(pId => {
      const p = permits.find(p => p.id === pId)
      return p ? `${p.name} (${p.category})` : ''
    }).filter(name => name)
  }

  const getSelectedServiceNames = () => {
    return newJobForm.selectedServices.map(svcId => {
      const svc = services.find(s => s.id === svcId)
      return svc ? svc.name : ''
    }).filter(name => name)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Management</h1>
        <p className="text-gray-600">Manage, track, and execute cleaning jobs in real-time</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Budget Utilization</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                {stats.totalBudget > 0 ? ((stats.totalActualCost / stats.totalBudget) * 100).toFixed(0) : '0'}%
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Banknote className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setShowSearchBar((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              aria-expanded={showSearchBar}
              aria-controls="jobs-search"
            >
              <Search className="h-4 w-4" />
              {showSearchBar ? 'Hide Search' : 'Search'}
            </button>
          </div>

          <div className={`${showSearchBar ? 'block' : 'hidden'} lg:block`}>
            <div className="relative" id="jobs-search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by category/title, client, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto flex-nowrap pb-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="queued">Queued</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Creators</option>
              {Array.from(new Set(jobs.filter(j => j.jobCreatedBy).map(j => j.jobCreatedBy))).map(creatorId => {
                const creator = employees.find(e => e.id === creatorId)
                return creator ? (
                  <option key={creatorId} value={creatorId}>
                    {creator.name}
                  </option>
                ) : null
              })}
            </select>

            <SearchSuggestSelect
              value={jobCategoryFilter}
              onChange={(value) => setJobCategoryFilter(value || 'all')}
              options={jobCategoryFilterOptions}
              placeholder="Search category..."
              inputClassName="min-w-[220px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'today' | 'yesterday' | 'nextDay' | 'custom' | 'all')}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="today">Today Jobs</option>
              <option value="yesterday">Previous Day</option>
              <option value="nextDay">Next Day</option>
              <option value="custom">Custom Date</option>
              <option value="all">All History</option>
            </select>

            {dateFilter === 'custom' && (
              <input
                type="date"
                value={customDateFilter}
                onChange={(e) => setCustomDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Time</span>
              <input
                type="time"
                value={timeFromFilter}
                onChange={(e) => setTimeFromFilter(e.target.value)}
                className="px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                title="From time"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="time"
                value={timeToFilter}
                onChange={(e) => setTimeToFilter(e.target.value)}
                className="px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                title="To time"
              />
            </div>

            <button
              onClick={() => {
                setDateFilter('all')
                setCustomDateFilter('')
                setTimeFromFilter('')
                setTimeToFilter('')
                setJobCategoryFilter('all')
                setStatusFilter('all')
                setPriorityFilter('all')
                setCreatorFilter('all')
                setSearchTerm('')
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Reset All Filters
            </button>

            <button
              onClick={handleAddJob}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Job
            </button>

            <button
              onClick={handleExportJobs}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={filteredJobs.length === 0}
              title={filteredJobs.length === 0 ? 'No jobs match current filters' : 'Export filtered jobs'}
            >
              <FileText className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Tip: Start with All History to see every job, then narrow down by status, date, time, or category.
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link href={`/admin/jobs/${job.id}`} className="block mb-3 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{job.client}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <span className={`text-xs font-bold px-3 py-1 border rounded-full ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 border rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 border rounded-full ${getPaymentStatusColor(job.paymentStatus)}`}>
                          Payment: {job.paymentStatus || 'Pending'}
                        </span>
                        {job.overtimeRequired && (
                          <span className={`text-xs font-bold px-3 py-1 border rounded-full flex items-center gap-1 ${job.overtimeApproved ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-amber-100 text-amber-700 border-amber-300'}`}>
                            <Zap className="h-3 w-3" /> OT: {job.overtimeHours}h {job.overtimeApproved ? '✓' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>
                          {job.scheduledDate
                            ? `${new Date(job.scheduledDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}${job.scheduledEndDate && job.scheduledEndDate !== job.scheduledDate
                              ? ` - ${new Date(job.scheduledEndDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}`
                              : ''}`
                            : 'Not scheduled'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 shrink-0" />
                        <span>{job.teamRequired} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 shrink-0" />
                        <span>AED {job.budget.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* 👇 NEW FIELD DISPLAY - Job Created By */}
                    {job.jobCreatedBy && (
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        <div>
                          <span className="font-medium">Created by:</span> {getCreatorName(job.jobCreatedBy)}
                        </div>
                        <div>
                          <span className="font-medium">Responsible:</span> {job.jobResponsibleBy ? getCreatorName(job.jobResponsibleBy) : 'N/A'}
                        </div>
                        {job.status === 'Completed' && (
                          <div>
                            <span className="font-medium">Time:</span>{' '}
                            <span className={
                              job.timePerformanceStatus === 'On Time'
                                ? 'text-emerald-700'
                                : job.timePerformanceStatus === 'Delayed'
                                  ? 'text-red-700'
                                  : 'text-gray-600'
                            }>
                              {job.timePerformanceStatus || 'Unknown'}
                              {job.actualDuration ? ` (${job.actualDuration})` : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {job.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{job.description}</p>
                    )}

                    {job.assignedEmployees && job.assignedEmployees.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <p className="text-xs font-semibold text-gray-600">Assigned Team:</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.assignedEmployees.map((employee) => (
                            <span
                              key={employee.id}
                              className={`text-xs px-2 py-1 rounded-full border font-medium ${
                                job.status === 'In Progress'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : job.status === 'Scheduled'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}
                            >
                              {employee.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEditJob(job.id)}
                      className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center gap-1"
                      disabled={loading}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleViewJob(job.id)}
                      className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View Details
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(job.id)}
                      className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center gap-1"
                      disabled={loading}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>

                    {job.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'Scheduled')}
                          className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                        >
                          Schedule
                        </button>
                      </>
                    )}

                    {(job.status === 'Scheduled' || job.status === 'In Progress') && (
                      <>
                        <button
                          onClick={() => handleToggleReminder(job.id)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                            job.reminderEnabled
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {job.reminderEnabled ? (
                            <>
                              <Bell className="h-3 w-3" />
                              Reminder Set
                            </>
                          ) : (
                            <>
                              <BellOff className="h-3 w-3" />
                              Set Reminder
                            </>
                          )}
                        </button>
                      </>
                    )}

                    {job.reminderEnabled && job.reminderDate && (
                      <div className="text-xs px-2 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Reminder: {new Date(job.reminderDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    )}

                    {job.status === 'Scheduled' && (
                      <>
                        <button
                          onClick={() => handleStartExecution(job)}
                          className="text-xs px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Execute
                        </button>
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'In Progress')}
                          className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                        >
                          Start
                        </button>
                      </>
                    )}

                    {job.status === 'In Progress' && (
                      <>
                        
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'Completed')}
                          className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Complete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No jobs found</p>
            <p className="text-sm text-gray-600">Try Reset All Filters or create a new job</p>
          </div>
        )}
      </div>

      {/* New Job/Edit Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/20"
            onClick={() => {
              setShowNewJobModal(false)
              setEditingJobId(null)
            }}
          ></div>
          <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col border-l border-blue-100">
            {/* Header */}
            <div className="sticky top-0 z-20 shrink-0 bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-3 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold leading-tight">{editingJobId ? 'Edit Job' : 'Create New Job'}</h2>
                <p className="text-blue-100 text-xs mt-0.5">Complete all job details</p>
              </div>
              <button onClick={() => { setShowNewJobModal(false); setEditingJobId(null) }} className="text-blue-100 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 pt-0 md:px-5 md:pb-5 md:pt-0 space-y-4 bg-linear-to-b from-white via-blue-50/20 to-white">
              {/* Basic Information */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Job Category / Title *</label>
                    <SearchSuggestSelect
                      value={newJobForm.title}
                      onChange={(value) => setNewJobForm({ ...newJobForm, title: value || '' })}
                      options={jobTitleCreateOptions}
                      placeholder={jobTitleCreateOptions.length > 0 ? 'Search and select service category...' : 'No service categories found'}
                      inputClassName="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Job title will use the selected service category.</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Client *</label>
                    <SearchSuggestSelect
                      value={newJobForm.clientId || ''}
                      onChange={(value) => {
                        const selected = clients.find((c) => c.id === value)
                        setNewJobForm({
                          ...newJobForm,
                          clientId: selected?.id || null,
                          client: selected?.name || ''
                        })
                      }}
                      options={clients.map((client) => ({
                        value: client.id,
                        label: `${client.name} - ${client.company} (${client.type === 'client' ? 'Client' : `${client.status || 'Lead'} Lead`})`,
                        keywords: [client.name, client.company, client.email, client.phone, client.status || '', client.type]
                      }))}
                      placeholder="Search and select client or lead..."
                      inputClassName="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {newJobForm.clientId === null && newJobForm.client && (
                      <p className="text-sm text-gray-500 mt-1">Client will be saved as: {newJobForm.client}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {clients.filter(c => c.type === 'client').length} clients & {clients.filter(c => c.type === 'lead').length} qualified/won leads
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
                  <textarea
                    value={newJobForm.description}
                    onChange={(e) => setNewJobForm({...newJobForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Detailed job description..."
                  />
                </div>
              </div>

              {/* 👇 NEW SECTION - Job Created By */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  Ownership
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Job Created By (Select Member) *
                  </label>
                  <SearchSuggestSelect
                    value={newJobForm.jobCreatedBy}
                    onChange={(value) => setNewJobForm({ ...newJobForm, jobCreatedBy: value || '' })}
                    options={employeeOptions}
                    placeholder={employeeOptions.length > 0 ? 'Search and select creator...' : 'No employees found'}
                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select the person who is creating/requesting this job
                  </p>
                </div>

                {newJobForm.jobCreatedBy && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Selected Creator:</span>{' '}
                      {employees.find(e => e.id === newJobForm.jobCreatedBy)?.name || ''}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Job Responsible Person *
                  </label>
                  <SearchSuggestSelect
                    value={newJobForm.jobResponsibleBy}
                    onChange={(value) => setNewJobForm({ ...newJobForm, jobResponsibleBy: value || '' })}
                    options={employeeOptions}
                    placeholder={employeeOptions.length > 0 ? 'Search and select responsible person...' : 'No employees found'}
                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This person owns job execution accountability.
                  </p>
                </div>

                {newJobForm.jobResponsibleBy && (
                  <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Responsible Person:</span>{' '}
                      {employees.find(e => e.id === newJobForm.jobResponsibleBy)?.name || ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Team Assignment Section */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    Assign Team Members
                  </h3>
                  <span className="text-sm font-medium text-gray-600">
                    Selected: {newJobForm.selectedEmployees.length} of {newJobForm.teamRequired}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Team Size Required *</label>
                    <input
                      type="number"
                      value={newJobForm.teamRequired}
                      onChange={(e) => {
                        const newSize = parseInt(e.target.value) || 1
                        setNewJobForm({
                          ...newJobForm,
                          teamRequired: newSize,
                          selectedEmployees: newJobForm.selectedEmployees.slice(0, newSize)
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Selected Members</label>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-300 min-h-10.5">
                      {getSelectedEmployeeNames().length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {getSelectedEmployeeNames().map((name, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                              {name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const empId = newJobForm.selectedEmployees[idx]
                                  toggleEmployeeSelection(empId)
                                }}
                                className="hover:text-blue-900"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No employees selected</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Search & Assign Team Member</label>
                  <SearchSuggestSelect
                    value={selectedTeamMemberToAdd}
                    onChange={(value) => {
                      const employeeId = value || ''
                      setSelectedTeamMemberToAdd(employeeId)
                      if (!employeeId) return

                      setNewJobForm((prev) => {
                        if (prev.selectedEmployees.includes(employeeId)) {
                          return prev
                        }

                        if (prev.selectedEmployees.length >= prev.teamRequired) {
                          alert(`Maximum ${prev.teamRequired} employees can be assigned to this job. Please increase team size or remove existing selections.`)
                          return prev
                        }

                        return {
                          ...prev,
                          selectedEmployees: [...prev.selectedEmployees, employeeId]
                        }
                      })
                      setSelectedTeamMemberToAdd('')
                    }}
                    options={employeeOptions}
                    placeholder={employeeOptions.length > 0 ? 'Search employee to assign...' : 'No active employees found'}
                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-500">Search and add members one by one. Use X on tags to remove.</p>
                </div>
              </div>

              {/* Location & Priority */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Location & Priority
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Location *</label>
                  <input
                    type="text"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({...newJobForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter job location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Priority *</label>
                    <select
                      value={newJobForm.priority}
                      onChange={(e) => setNewJobForm({...newJobForm, priority: e.target.value as NewJobForm['priority']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Risk Level *</label>
                    <select
                      value={newJobForm.riskLevel}
                      onChange={(e) => setNewJobForm({...newJobForm, riskLevel: e.target.value as NewJobForm['riskLevel']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Commercial & Compliance */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Commercial & Compliance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <input
                        type="checkbox"
                        checked={newJobForm.quotationRequired}
                        onChange={(e) => setNewJobForm({
                          ...newJobForm,
                          quotationRequired: e.target.checked,
                          quotationStatus: e.target.checked ? 'Pending' : 'Not Required'
                        })}
                        className="w-4 h-4 rounded"
                      />
                      Quotation Required
                    </label>
                    <select
                      value={newJobForm.quotationStatus}
                      onChange={(e) => setNewJobForm({
                        ...newJobForm,
                        quotationStatus: e.target.value as NewJobForm['quotationStatus']
                      })}
                      disabled={!newJobForm.quotationRequired}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                    >
                      <option value="Not Required">Not Required</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <input
                        type="checkbox"
                        checked={newJobForm.surveyRequired}
                        onChange={(e) => setNewJobForm({
                          ...newJobForm,
                          surveyRequired: e.target.checked,
                          surveyStatus: e.target.checked ? 'Pending' : 'Not Required'
                        })}
                        className="w-4 h-4 rounded"
                      />
                      Survey Required
                    </label>
                    <select
                      value={newJobForm.surveyStatus}
                      onChange={(e) => setNewJobForm({
                        ...newJobForm,
                        surveyStatus: e.target.value as NewJobForm['surveyStatus']
                      })}
                      disabled={!newJobForm.surveyRequired}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                    >
                      <option value="Not Required">Not Required</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Status</label>
                    <select
                      value={newJobForm.paymentStatus}
                      onChange={(e) => setNewJobForm({
                        ...newJobForm,
                        paymentStatus: e.target.value as NewJobForm['paymentStatus']
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Collect After Job">Collect After Job</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Method</label>
                    <select
                      value={newJobForm.paymentMethod}
                      onChange={(e) => setNewJobForm({
                        ...newJobForm,
                        paymentMethod: e.target.value as NewJobForm['paymentMethod']
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="N/A">N/A</option>
                      <option value="Payment Link">Payment Link</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Reference (Optional)</label>
                    <input
                      type="text"
                      value={newJobForm.paymentReference}
                      onChange={(e) => setNewJobForm({ ...newJobForm, paymentReference: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Txn ID / Ref number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Link Generated By</label>
                    <input
                      type="text"
                      value={newJobForm.paymentLinkGeneratedBy}
                      onChange={(e) => setNewJobForm({ ...newJobForm, paymentLinkGeneratedBy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., Mamta"
                    />
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Scheduling
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newJobForm.scheduledDate}
                    onChange={(e) => setNewJobForm({...newJobForm, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">End Date</label>
                  <input
                    type="date"
                    min={newJobForm.scheduledDate || undefined}
                    value={newJobForm.scheduledEndDate}
                    onChange={(e) => setNewJobForm({...newJobForm, scheduledEndDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for single-day jobs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Total Team Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={totalTeamCapacity}
                      onChange={(e) => setTotalTeamCapacity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Travel Buffer (mins)</label>
                    <input
                      type="number"
                      min="0"
                      value={travelBufferMinutes}
                      onChange={(e) => setTravelBufferMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Lunch Buffer (mins)</label>
                    <input
                      type="number"
                      min="0"
                      value={lunchBufferMinutes}
                      onChange={(e) => setLunchBufferMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Start Time</label>
                    <input
                      type="time"
                      step={3600}
                      lang="en-GB"
                      value={newJobForm.scheduledTime}
                      onChange={(e) => setNewJobForm({...newJobForm, scheduledTime: normalizeTime24(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">End Time</label>
                    <input
                      type="time"
                      step={3600}
                      lang="en-GB"
                      value={newJobForm.endTime}
                      onChange={(e) => setNewJobForm({...newJobForm, endTime: normalizeTime24(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Estimated Duration</label>
                    <input
                      type="text"
                      value={newJobForm.estimatedDuration}
                      onChange={(e) => setNewJobForm({...newJobForm, estimatedDuration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., 8 hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">SLA Deadline</label>
                    <input
                      type="date"
                      value={newJobForm.slaDeadline}
                      onChange={(e) => setNewJobForm({...newJobForm, slaDeadline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {newJobForm.scheduledDate && newJobForm.scheduledTime && (
                  <div className={`rounded-lg border p-3 text-sm ${schedulingInsights.isRequestedSlotAvailable ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <p className="font-semibold">
                      Available manpower at selected start time: {schedulingInsights.availableAtRequested} / {totalTeamCapacity}
                    </p>
                    {!schedulingInsights.isRequestedSlotAvailable && (
                      <>
                        <p className="mt-1">Selected slot cannot fit required manpower ({newJobForm.teamRequired}).</p>
                        {schedulingInsights.nextAvailableTime && (
                          <p className="mt-1 font-semibold">Suggested next slot: {schedulingInsights.nextAvailableTime}</p>
                        )}
                        {schedulingInsights.blockingJobs.length > 0 && (
                          <p className="mt-1">Conflicts: {schedulingInsights.blockingJobs.slice(0, 2).join(' | ')}</p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {newJobForm.scheduledDate && newJobForm.scheduledTime && newJobForm.selectedEmployees.length > 0 && (
                  <div className={`rounded-lg border p-3 text-sm ${employeeScheduleInsights.isTeamSlotValid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <p className="font-semibold">
                      Team slot alignment with availability schedule: {employeeScheduleInsights.isTeamSlotValid ? 'Aligned' : 'Not aligned'}
                    </p>
                    {!employeeScheduleInsights.isTeamSlotValid && (
                      <>
                        <p className="mt-1">Issues: {employeeScheduleInsights.unavailableEmployees.join(' | ')}</p>
                        {employeeScheduleInsights.suggestedStartTimes.length > 0 && (
                          <p className="mt-1 font-semibold">Suggested aligned starts: {employeeScheduleInsights.suggestedStartTimes.join(', ')}</p>
                        )}
                      </>
                    )}
                  </div>
                )}

                <label className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <input
                    type="checkbox"
                    checked={newJobForm.allowValidationOverride}
                    onChange={(e) => setNewJobForm({ ...newJobForm, allowValidationOverride: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  Proceed with override when validation fails (creates audit log)
                </label>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Listing Duration (days)</label>
                  <p className="text-xs text-gray-500 mb-2">Job will be automatically marked as <strong>Expired</strong> after this many days. Set to 0 for no expiry.</p>
                  <input
                    type="number"
                    min="0"
                    value={newJobForm.listingDurationDays || ''}
                    onChange={(e) => setNewJobForm({...newJobForm, listingDurationDays: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., 30"
                  />
                  {newJobForm.listingDurationDays > 0 && (
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                      Expires on: {(() => { const d = new Date(); d.setDate(d.getDate() + newJobForm.listingDurationDays); return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) })()}
                    </p>
                  )}
                </div>
              </div>

              {/* Resources & Budget */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-blue-600" />
                  Resources & Budget
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {editingJobId ? 'Budget (AED) *' : 'Job Price (AED) *'}
                  </label>
                  <input
                    type="number"
                    value={newJobForm.budget}
                    onChange={(e) => setNewJobForm({...newJobForm, budget: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    min="0"
                    step="0.01"
                  />
                  {!editingJobId && budgetTaxPreview.base > 0 && (
                    <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 p-2 text-xs text-blue-800">
                      <p>Auto Tax (5%): AED {budgetTaxPreview.tax.toLocaleString()}</p>
                      <p className="font-bold">Total with tax: AED {budgetTaxPreview.total.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Required Skills</label>
                  <textarea
                    value={newJobForm.requiredSkills}
                    onChange={(e) => setNewJobForm({...newJobForm, requiredSkills: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={2}
                    placeholder="Enter skills separated by comma. e.g., General Cleaning, Floor Care"
                  />
                </div>
              </div>

              {/* Equipment Section */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Required Equipment
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Selected Equipment</label>
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-300 min-h-10.5">
                    {getSelectedEquipmentNames().length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {getSelectedEquipmentNames().map((name, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                            {name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                const eqId = newJobForm.selectedEquipment[idx]
                                toggleEquipmentSelection(eqId)
                              }}
                              className="hover:text-green-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No equipment selected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Select Equipment</label>
                  <div className="relative">
                    <select
                      multiple
                      value={newJobForm.selectedEquipment}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map(option => option.value)
                        setNewJobForm(prev => ({
                          ...prev,
                          selectedEquipment: selected
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                      size={5}
                    >
                      {equipment.length > 0 ? (
                        equipment.map(eq => (
                          <option key={eq.id} value={eq.id}>
                            {eq.name} - {eq.category} ({eq.status})
                          </option>
                        ))
                      ) : (
                        <option disabled>No equipment found</option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple equipment</p>
                </div>
              </div>

              {/* Permits Section */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Required Permits & Licenses
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Selected Permits/Licenses</label>
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-300 min-h-10.5">
                    {getSelectedPermitNames().length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {getSelectedPermitNames().map((name, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                            {name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                const pId = newJobForm.selectedPermits[idx]
                                togglePermitSelection(pId)
                              }}
                              className="hover:text-purple-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No permits/licenses selected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Select Permits/Licenses</label>
                  <div className="relative">
                    <select
                      multiple
                      value={newJobForm.selectedPermits}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map(option => option.value)
                        setNewJobForm(prev => ({
                          ...prev,
                          selectedPermits: selected
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                      size={5}
                    >
                      {permits.length > 0 ? (
                        permits.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} - {p.category} (Expires: {p.expiryDate})
                          </option>
                        ))
                      ) : (
                        <option disabled>No permits/licenses found</option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple permits/licenses</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Job Tags</label>
                  <textarea
                    value={newJobForm.tags}
                    onChange={(e) => setNewJobForm({...newJobForm, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={2}
                    placeholder="Enter tags separated by comma. e.g., Office, Commercial, Urgent"
                  />
                </div>
              </div>

              {/* Services Section */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Job Services
                </h3>
                <p className="text-sm text-gray-600">Select services for this job</p>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Selected Services</label>
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-300 min-h-10.5">
                    {getSelectedServiceNames().length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {getSelectedServiceNames().map((name, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md">
                            {name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                const svcId = newJobForm.selectedServices[idx]
                                toggleServiceSelection(svcId)
                              }}
                              className="hover:text-orange-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No services selected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Select Services</label>
                  <div className="relative">
                    <select
                      multiple
                      value={newJobForm.selectedServices}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map(option => option.value)
                        setNewJobForm(prev => ({
                          ...prev,
                          selectedServices: selected
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                      size={5}
                    >
                      {services.length > 0 ? (
                        services.map(svc => (
                          <option key={svc.id} value={svc.id}>
                            {svc.name} - AED {svc.price} ({svc.categoryName})
                          </option>
                        ))
                      ) : (
                        <option disabled>No services found</option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple services</p>
                </div>

                {(newJobForm.services || []).length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left text-sm">Service</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-sm">Qty</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-sm">Price</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-sm">Total</th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(newJobForm.services || []).map((service, idx) => (
                            <tr key={service.id}>
                              <td className="border border-gray-300 px-3 py-2 text-sm">{service.name}</td>
                              <td className="border border-gray-300 px-3 py-2">
                                <input
                                  type="number"
                                  value={service.quantity}
                                  onChange={(e) => {
                                    const updated = [...(newJobForm.services || [])]
                                    updated[idx].quantity = parseInt(e.target.value) || 0
                                    updated[idx].total = updated[idx].quantity * updated[idx].unitPrice
                                    setNewJobForm({ ...newJobForm, services: updated })
                                  }}
                                  className="w-20 px-2 py-1 border rounded"
                                  min="1"
                                />
                              </td>
                              <td className="border border-gray-300 px-3 py-2">AED {service.unitPrice}</td>
                              <td className="border border-gray-300 px-3 py-2">AED {service.total}</td>
                              <td className="border border-gray-300 px-3 py-2">
                                <button
                                  onClick={() => {
                                    const svcId = services.find(s => s.name === service.name)?.id
                                    if (svcId) toggleServiceSelection(svcId)
                                  }}
                                  className="text-red-600 hover:text-red-700 text-sm"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Tasks Section */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-blue-600" />
                    Job Tasks
                  </h3>
                  <button
                    onClick={() => setShowTasksSection(!showTasksSection)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showTasksSection ? 'Hide Tasks' : 'Add Tasks'}
                  </button>
                </div>

                {showTasksSection && (
                  <div className="space-y-4">
                    <button
                      onClick={handleAddTask}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Task
                    </button>

                    <div className="space-y-3">
                      {(newJobForm.tasks || []).map((task, idx) => (
                        <div key={task.id} className="p-4 border border-gray-300 rounded-lg space-y-3 bg-gray-50">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1">Task Title *</label>
                              <input
                                type="text"
                                placeholder="e.g., Clean Windows"
                                value={task.title}
                                onChange={(e) => updateTask(idx, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                              <textarea
                                placeholder="Task description..."
                                value={task.description}
                                onChange={(e) => updateTask(idx, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-1">Duration (hours) *</label>
                              <input
                                type="number"
                                placeholder="1"
                                value={task.duration}
                                onChange={(e) => updateTask(idx, 'duration', parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                min="1"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => updateTask(idx, 'completed', e.target.checked)}
                                className="w-4 h-4 rounded"
                                id={`task-completed-${idx}`}
                              />
                              <label htmlFor={`task-completed-${idx}`} className="text-sm font-medium text-gray-900 cursor-pointer">
                                Completed
                              </label>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTask(idx)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove Task
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="space-y-4 border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Special Instructions
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Special Instructions</label>
                  <textarea
                    value={newJobForm.specialInstructions}
                    onChange={(e) => setNewJobForm({...newJobForm, specialInstructions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Any special instructions or notes for this job..."
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    checked={newJobForm.recurring}
                    onChange={(e) => setNewJobForm({...newJobForm, recurring: e.target.checked})}
                    className="w-4 h-4 rounded"
                    id="recurring"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-900 cursor-pointer">
                    This is a recurring job
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => { setShowNewJobModal(false); setEditingJobId(null) }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveJob}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingJobId ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Job</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this job? All associated data will be permanently removed from Firebase.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJob(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Execution Modal */}
      {showExecutionModal && selectedJobForExecution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Execute: {selectedJobForExecution.title}</h2>
              <button onClick={() => setShowExecutionModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Client: </span><span className="font-semibold">{selectedJobForExecution.client}</span></div>
                  <div><span className="text-gray-600">Location: </span><span className="font-semibold">{selectedJobForExecution.location}</span></div>
                  
                  {/* 👇 NEW FIELD - Show Job Creator in Execution Modal */}
                  {selectedJobForExecution.jobCreatedBy && (
                    <div><span className="text-gray-600">Created By: </span>
                      <span className="font-semibold">
                        {employees.find(e => e.id === selectedJobForExecution.jobCreatedBy)?.name || 'Unknown'}
                      </span>
                    </div>
                  )}
                  
                  <div><span className="text-gray-600">Team Size: </span><span className="font-semibold">{selectedJobForExecution.teamRequired}</span></div>
                  <div><span className="text-gray-600">Budget: </span><span className="font-semibold">AED {selectedJobForExecution.budget.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Assigned Team */}
              {selectedJobForExecution.assignedEmployees && selectedJobForExecution.assignedEmployees.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Assigned Team</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedJobForExecution.assignedEmployees.map(employee => (
                      <div key={employee.id} className="p-3 border rounded-lg bg-gray-50">
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-600">{employee.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Section */}
              {selectedJobForExecution.tasks && selectedJobForExecution.tasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Job Tasks</h3>
                  <div className="space-y-2">
                    {selectedJobForExecution.tasks.map((task, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Duration: {task.duration} hours</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {task.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment Section */}
              {selectedJobForExecution.equipment && selectedJobForExecution.equipment.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Required Equipment</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForExecution.equipment.map((eq, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Permits Section */}
              {selectedJobForExecution.permits && selectedJobForExecution.permits.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Required Permits/Licenses</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForExecution.permits.map((p, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Pre-Execution Checklist</h3>
                {['Team arrived on site', 'Equipment setup', 'Safety review', 'Client briefing', 'Work area secured', 'Permits verified'].map(item => (
                  <label key={item} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={executionChecklist.includes(item)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setExecutionChecklist([...executionChecklist, item])
                        } else {
                          setExecutionChecklist(executionChecklist.filter(i => i !== item))
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>

              {/* Photos */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Documentation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EXECUTION_PHOTO_STAGES.map((stage) => {
                    const stageLabel = EXECUTION_PHOTO_STAGE_LABELS[stage]
                    const photo = executionPhotosByStage[stage]
                    const isUploading = uploadingPhotoStage === stage

                    return (
                      <label
                        key={stage}
                        className="aspect-square bg-gray-100 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 p-3 overflow-hidden"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleExecutionPhotoUpload(stage, event)}
                          disabled={isUploading}
                        />

                        {photo?.url ? (
                          <>
                            <img src={photo.url} alt={photo.title || stageLabel} className="h-24 w-full object-cover rounded-md mb-2" />
                            <p className="text-xs font-medium text-gray-700 text-center line-clamp-1">{photo.title || stageLabel}</p>
                            <p className="text-xs text-gray-500 text-center line-clamp-2 mt-1">{photo.description || 'No description'}</p>
                            <p className="text-[10px] text-blue-600 mt-1">Click to replace</p>
                          </>
                        ) : (
                          <>
                            <Camera className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-xs font-medium text-gray-700 text-center">{stageLabel}</p>
                            <p className="text-xs text-gray-500 text-center mt-1">
                              {isUploading ? 'Uploading...' : 'Click to upload'}
                            </p>
                          </>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Notes</h3>
                <textarea
                  value={executionNotes}
                  onChange={(e) => setExecutionNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={4}
                  placeholder="Add notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button onClick={() => setShowExecutionModal(false)} className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleLogExecution} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Log Execution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading jobs...</div>}>
      <JobsPageContent />
    </Suspense>
  )
}