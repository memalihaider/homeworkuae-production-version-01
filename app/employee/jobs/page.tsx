'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
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
  DollarSign,
  Camera,
  Play,
  Eye,
  Bell,
  BellOff,
  ShoppingCart,
  Edit,
  Zap,
  AlertTriangle,
  Check,
  TrendingUp,
  UserPlus,
  ExternalLink,
  ChevronDown,
  ListTodo,
  FileText,
  Menu,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, where, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { EmployeeSidebar } from '../_components/sidebar'

interface Job {
  id: string
  title: string
  client: string
  clientId: string
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  scheduledDate: string | null
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
  requiredSkills: string[]
  equipment: string[]
  permits: string[]
  tags: string[]
  specialInstructions?: string
  recurring: boolean
  createdAt: string
  updatedAt: string
  completedAt?: string
  executionLogs: any[]
  assignedTo: string[]
  assignedEmployees: { id: string; name: string; email: string }[]
  reminderEnabled?: boolean
  reminderDate?: string
  reminderSent?: boolean
  services?: JobService[]
  overtimeRequired?: boolean
  overtimeHours?: number
  overtimeReason?: string
  overtimeApproved?: boolean
  tasks?: JobTask[]
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

interface NewJobForm {
  title: string
  client: string
  clientId: string | null
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  scheduledDate: string
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
  services?: JobService[]
  tasks?: JobTask[]
  selectedEquipment: string[]
  selectedPermits: string[]
  selectedServices: string[]
}

export default function JobsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [permits, setPermits] = useState<PermitLicense[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showNewJobModal, setShowNewJobModal] = useState(false)
  const [showExecutionModal, setShowExecutionModal] = useState(false)
  const [selectedJobForExecution, setSelectedJobForExecution] = useState<Job | null>(null)
  const [executionChecklist, setExecutionChecklist] = useState<string[]>([])
  const [executionNotes, setExecutionNotes] = useState('')
  const [editingJobId, setEditingJobId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTasksSection, setShowTasksSection] = useState(false)

  const [newJobForm, setNewJobForm] = useState<NewJobForm>({
    title: '',
    client: '',
    clientId: null,
    priority: 'Medium',
    scheduledDate: '',
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
    services: [],
    tasks: [],
    selectedEquipment: [],
    selectedPermits: [],
    selectedServices: []
  })

  // Fetch data from Firebase
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
            scheduledTime: data.scheduledTime || '',
            endTime: data.endTime || '',
            location: data.location || '',
            teamRequired: data.teamRequired || 1,
            budget: data.budget || 0,
            actualCost: data.actualCost || 0,
            description: data.description || '',
            riskLevel: data.riskLevel || 'Low',
            slaDeadline: data.slaDeadline || '',
            estimatedDuration: data.estimatedDuration || '',
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
            reminderEnabled: data.reminderEnabled || false,
            reminderDate: data.reminderDate || '',
            reminderSent: data.reminderSent || false,
            services: data.services || [],
            tasks: data.tasks || [],
            overtimeRequired: data.overtimeRequired || false,
            overtimeHours: data.overtimeHours || 0,
            overtimeReason: data.overtimeReason || '',
            overtimeApproved: data.overtimeApproved || false
          } as Job
        })
        
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

        // Fetch clients
        const clientsQuery = query(collection(db, 'clients'))
        const clientsSnapshot = await getDocs(clientsQuery)
        const clientsData = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setClients(clientsData)

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

        // Fetch permits
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

  // UI Styling Functions (from code 1)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-900/20 text-green-400 border-green-800'
      case 'In Progress': return 'bg-amber-900/20 text-amber-400 border-amber-800'
      case 'Scheduled': return 'bg-blue-900/20 text-blue-400 border-blue-800'
      case 'Pending': return 'bg-red-900/20 text-red-400 border-red-800'
      case 'Cancelled': return 'bg-slate-700 text-slate-300'
      default: return 'bg-slate-700 text-slate-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-900/20 text-red-300'
      case 'High': return 'bg-orange-900/20 text-orange-300'
      case 'Medium': return 'bg-amber-900/20 text-amber-300'
      case 'Low': return 'bg-green-900/20 text-green-300'
      default: return 'bg-slate-700 text-slate-300'
    }
  }

  // Edit function
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
          .filter(svc => jobData.services?.some((s: any) => s.name === svc.name))
          .map(svc => svc.id)

        setNewJobForm({
          title: jobData.title || '',
          client: jobData.client || '',
          clientId: jobData.clientId || null,
          priority: jobData.priority || 'Medium',
          scheduledDate: jobData.scheduledDate || '',
          scheduledTime: jobData.scheduledTime || '',
          endTime: jobData.endTime || '',
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
          selectedEmployees: jobData.assignedEmployees?.map((emp: any) => emp.id) || [],
          services: jobData.services || [],
          tasks: jobData.tasks || [],
          selectedEquipment: selectedEquipment,
          selectedPermits: selectedPermits,
          selectedServices: selectedServices
        })
        
        setEditingJobId(jobId)
        setShowNewJobModal(true)
      }
    } catch (error) {
      console.error('Error fetching job for edit:', error)
      alert('Error loading job details')
    } finally {
      setLoading(false)
    }
  }

  // View function
  const handleViewJob = (jobId: string) => {
    router.push(`/employee/jobs/${jobId}`)
  }

  // Delete function
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

  // Save/Update function
  const handleSaveJob = useCallback(async () => {
    if (!newJobForm.title || !newJobForm.client || !newJobForm.location) {
      alert('Please fill in all required fields: Title, Client, and Location')
      return
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

      const jobData = {
        title: newJobForm.title,
        client: newJobForm.client,
        clientId: newJobForm.clientId || '',
        priority: newJobForm.priority,
        scheduledDate: newJobForm.scheduledDate || null,
        scheduledTime: newJobForm.scheduledTime,
        endTime: newJobForm.endTime,
        location: newJobForm.location,
        teamRequired: newJobForm.teamRequired,
        budget: newJobForm.budget,
        description: newJobForm.description,
        riskLevel: newJobForm.riskLevel,
        slaDeadline: newJobForm.slaDeadline,
        estimatedDuration: newJobForm.estimatedDuration,
        requiredSkills: newJobForm.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        equipment: selectedEquipmentNames,
        permits: selectedPermitNames,
        tags: newJobForm.tags.split(',').map(s => s.trim()).filter(s => s),
        specialInstructions: newJobForm.specialInstructions,
        recurring: newJobForm.recurring,
        services: newJobForm.services || [],
        tasks: newJobForm.tasks || [],
        updatedAt: new Date().toISOString(),
        assignedTo: selectedEmployeesDetails.map(emp => emp.name),
        assignedEmployees: selectedEmployeesDetails,
        actualCost: 0,
        reminderEnabled: false
      }

      if (editingJobId) {
        const jobRef = doc(db, 'jobs', editingJobId)
        await updateDoc(jobRef, jobData)
        
        setJobs(jobs.map(j =>
          j.id === editingJobId
            ? { ...j, ...jobData, id: editingJobId }
            : j
        ))
        alert('Job updated successfully!')
      } else {
        const newJobData = {
          ...jobData,
          status: 'Pending',
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
        
        const newJob: Job = {
          id: docRef.id,
          ...newJobData
        } as Job
        
        setJobs([...jobs, newJob])
        alert('Job created successfully!')
      }
      
      setShowNewJobModal(false)
      setEditingJobId(null)
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Error saving job. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [newJobForm, jobs, editingJobId, employees, equipment, permits])

  // Calculate statistics
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

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || job.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [jobs, searchTerm, statusFilter, priorityFilter])

  const handleAddJob = () => {
    setEditingJobId(null)
    setShowTasksSection(false)
    setNewJobForm({
      title: '',
      client: '',
      clientId: null,
      priority: 'Medium',
      scheduledDate: '',
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
      services: [],
      tasks: [],
      selectedEquipment: [],
      selectedPermits: [],
      selectedServices: []
    })
    setShowNewJobModal(true)
  }

  // Toggle equipment selection
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

  // Toggle permit selection
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

  // Toggle service selection
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

  // Add new task
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

  // Update task
  const updateTask = (index: number, field: keyof JobTask, value: any) => {
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

  // Remove task
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
      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })

      setJobs(jobs.map(j =>
        j.id === jobId
          ? { ...j, status: newStatus, updatedAt: new Date().toISOString() }
          : j
      ))
      alert(`Job status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating job status:', error)
      alert('Error updating job status')
    }
  }, [jobs])

  const handleStartExecution = (job: Job) => {
    setSelectedJobForExecution(job)
    setExecutionChecklist([])
    setExecutionNotes('')
    setShowExecutionModal(true)
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

  // Helper functions
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
    <div className="min-h-screen  bg-slate-900 flex">
      {/* Sidebar (from code 1) */}
      <div className="lg:hidden ">
        <EmployeeSidebar 
          session={{}} 
          open={sidebarOpen} 
          onOpenChange={setSidebarOpen} 
        />
      </div>
      <div className="hidden lg:block">
        <EmployeeSidebar 
          session={{}} 
          open={true} 
          onOpenChange={setSidebarOpen} 
        />
      </div>

      <main className="flex-1 overflow-auto">
        {/* Header (from code 1 style) */}
        <div className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur border-b border-slate-700">
          <div className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Job Management</h1>
                <p className="text-sm text-slate-400">Manage, track, and execute cleaning jobs in real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Statistics (from code 1 style) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Total Jobs</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">{stats.inProgress}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{stats.completed}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Budget</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">AED {stats.totalBudget.toLocaleString()}</p>
            </div>
          </div>

          {/* Filters (from code 1 style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by job title, client, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
              >
                <option value="all">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
             
            </div>
          </div>

          {/* Jobs List (from code 1 style) */}
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      
                      <div className="flex-1">
                         <Link href={`/employee/jobs/${job.id}`} className="block mb-3 group">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(job.priority)}`}>
                            {job.priority}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.client}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {job.scheduledDate ? new Date(job.scheduledDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'Not scheduled'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.teamRequired} members
                          </div>
                        </div>
                         </Link>
                      </div>
                    </div>

                    {job.description && (
                      <p className="text-slate-300 text-sm mt-3">{job.description}</p>
                    )}

                    {/* Assigned Employees */}
                    {job.assignedEmployees && job.assignedEmployees.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-slate-500" />
                          <p className="text-xs font-semibold text-slate-400">Assigned Team:</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.assignedEmployees.map((employee, idx) => (
                            <span
                              key={employee.id}
                              className={`text-xs px-2 py-1 rounded-full border font-medium ${
                                job.status === 'In Progress'
                                  ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800'
                                  : job.status === 'Scheduled'
                                  ? 'bg-blue-900/20 text-blue-400 border-blue-800'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {employee.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                   

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-700">
                     

                      <button
                        onClick={() => handleViewJob(job.id)}
                        className="text-xs px-3 py-1.5 bg-green-900/20 text-green-400 rounded-lg hover:bg-green-900/30 transition-colors font-medium flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View Details
                      </button>

                     

                     

                      {job.status === 'Scheduled' && (
                        <>
                          <button
                            onClick={() => handleStartExecution(job)}
                            className="text-xs px-3 py-1.5 bg-orange-900/20 text-orange-400 rounded-lg hover:bg-orange-900/30 transition-colors font-medium flex items-center gap-1"
                          >
                            <Play className="h-3 w-3" />
                            Execute
                          </button>
                          <button
                            onClick={() => handleUpdateJobStatus(job.id, 'In Progress')}
                            className="text-xs px-3 py-1.5 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/30 transition-colors font-medium"
                          >
                            Start
                          </button>
                        </>
                      )}

                      {job.status === 'In Progress' && (
                        <>
                          
                          <button
                            onClick={() => handleUpdateJobStatus(job.id, 'Completed')}
                            className="text-xs px-3 py-1.5 bg-green-900/20 text-green-400 rounded-lg hover:bg-green-900/30 transition-colors font-medium flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No jobs found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Job/Edit Modal (updated styling) */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 backdrop-blur-sm bg-black/10" 
            onClick={() => { 
              setShowNewJobModal(false); 
              setEditingJobId(null); 
            }}
          ></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-slate-800 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-700">
              <div>
                <h2 className="text-2xl font-bold">{editingJobId ? 'Edit Job' : 'Create New Job'}</h2>
                <p className="text-slate-400 text-sm mt-1">Complete all job details</p>
              </div>
              <button onClick={() => { setShowNewJobModal(false); setEditingJobId(null) }} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-violet-400" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={newJobForm.title}
                      onChange={(e) => setNewJobForm({...newJobForm, title: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      placeholder="e.g., Office Deep Cleaning"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Client *</label>
                    <select
                      value={newJobForm.clientId || ''}
                      onChange={(e) => {
                        const selected = clients.find(c => c.id === e.target.value)
                        setNewJobForm({
                          ...newJobForm,
                          clientId: selected?.id || null,
                          client: selected?.name || ''
                        })
                      }}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="">Select a client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    {newJobForm.clientId === null && newJobForm.client && (
                      <p className="text-sm text-slate-500 mt-1">Client will be saved as: {newJobForm.client}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Description *</label>
                  <textarea
                    value={newJobForm.description}
                    onChange={(e) => setNewJobForm({...newJobForm, description: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    rows={3}
                    placeholder="Detailed job description..."
                  />
                </div>
              </div>

              {/* Team Assignment Section */}
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-violet-400" />
                    Assign Team Members
                  </h3>
                  <span className="text-sm font-medium text-slate-400">
                    Selected: {newJobForm.selectedEmployees.length} of {newJobForm.teamRequired}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Team Size Required *</label>
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
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Selected Members</label>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 min-h-[42px]">
                      {getSelectedEmployeeNames().length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {getSelectedEmployeeNames().map((name, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-md border border-blue-800">
                              {name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const empId = newJobForm.selectedEmployees[idx]
                                  toggleEmployeeSelection(empId)
                                }}
                                className="hover:text-blue-300"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No employees selected</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employees Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Select Employees</label>
                  <div className="relative">
                    <select
                      multiple
                      value={newJobForm.selectedEmployees}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map(option => option.value)
                        setNewJobForm(prev => ({
                          ...prev,
                          selectedEmployees: selected.slice(0, prev.teamRequired)
                        }))
                      }}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500 appearance-none"
                      size={5}
                    >
                      {employees.length > 0 ? (
                        employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position} ({employee.department})
                          </option>
                        ))
                      ) : (
                        <option disabled>No active employees found</option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500">Hold Ctrl/Cmd to select multiple employees</p>
                </div>
              </div>

              {/* Location & Priority */}
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-violet-400" />
                  Location & Priority
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Location *</label>
                  <input
                    type="text"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({...newJobForm, location: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    placeholder="Enter job location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Priority *</label>
                    <select
                      value={newJobForm.priority}
                      onChange={(e) => setNewJobForm({...newJobForm, priority: e.target.value as any})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Risk Level *</label>
                    <select
                      value={newJobForm.riskLevel}
                      onChange={(e) => setNewJobForm({...newJobForm, riskLevel: e.target.value as any})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-violet-400" />
                  Scheduling
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    value={newJobForm.scheduledDate}
                    onChange={(e) => setNewJobForm({...newJobForm, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={newJobForm.scheduledTime}
                      onChange={(e) => setNewJobForm({...newJobForm, scheduledTime: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">End Time</label>
                    <input
                      type="time"
                      value={newJobForm.endTime}
                      onChange={(e) => setNewJobForm({...newJobForm, endTime: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Estimated Duration</label>
                    <input
                      type="text"
                      value={newJobForm.estimatedDuration}
                      onChange={(e) => setNewJobForm({...newJobForm, estimatedDuration: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                      placeholder="e.g., 8 hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">SLA Deadline</label>
                    <input
                      type="date"
                      value={newJobForm.slaDeadline}
                      onChange={(e) => setNewJobForm({...newJobForm, slaDeadline: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              {/* Resources & Budget */}
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-violet-400" />
                  Resources & Budget
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Budget (AED) *</label>
                  <input
                    type="number"
                    value={newJobForm.budget}
                    onChange={(e) => setNewJobForm({...newJobForm, budget: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Required Skills</label>
                  <textarea
                    value={newJobForm.requiredSkills}
                    onChange={(e) => setNewJobForm({...newJobForm, requiredSkills: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    rows={2}
                    placeholder="Enter skills separated by comma. e.g., General Cleaning, Floor Care"
                  />
                </div>
              </div>

              {/* Equipment Section */}
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-violet-400" />
                  Required Equipment
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Selected Equipment</label>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 min-h-[42px]">
                    {getSelectedEquipmentNames().length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {getSelectedEquipmentNames().map((name, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md border border-green-800">
                            {name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                const eqId = newJobForm.selectedEquipment[idx]
                                toggleEquipmentSelection(eqId)
                              }}
                              className="hover:text-green-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No equipment selected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Select Equipment</label>
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
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500 appearance-none"
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
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500">Hold Ctrl/Cmd to select multiple equipment</p>
                </div>
              </div>

              {/* Permits Section */}
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-violet-400" />
                  Required Permits & Licenses
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Selected Permits/Licenses</label>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 min-h-[42px]">
                    {getSelectedPermitNames().length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {getSelectedPermitNames().map((name, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-md border border-purple-800">
                            {name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                const pId = newJobForm.selectedPermits[idx]
                                togglePermitSelection(pId)
                              }}
                              className="hover:text-purple-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No permits/licenses selected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Select Permits/Licenses</label>
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
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500 appearance-none"
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
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500">Hold Ctrl/Cmd to select multiple permits/licenses</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Job Tags</label>
                  <textarea
                    value={newJobForm.tags}
                    onChange={(e) => setNewJobForm({...newJobForm, tags: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    rows={2}
                    placeholder="Enter tags separated by comma. e.g., Office, Commercial, Urgent"
                  />
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-violet-400" />
                  Job Services
                </h3>
                <p className="text-sm text-slate-400">Select services for this job</p>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Selected Services</label>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 min-h-[42px]">
                    {getSelectedServiceNames().length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {getSelectedServiceNames().map((name, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-900/30 text-orange-400 text-xs rounded-md border border-orange-800">
                            {name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                const svcId = newJobForm.selectedServices[idx]
                                toggleServiceSelection(svcId)
                              }}
                              className="hover:text-orange-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No services selected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Select Services</label>
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
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500 appearance-none"
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
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500">Hold Ctrl/Cmd to select multiple services</p>
                </div>

                {/* Service Details Table */}
                {(newJobForm.services || []).length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-white mb-2">Service Details</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-700 rounded-lg">
                        <thead>
                          <tr className="bg-slate-900">
                            <th className="border border-slate-700 px-3 py-2 text-left text-sm text-slate-300">Service</th>
                            <th className="border border-slate-700 px-3 py-2 text-left text-sm text-slate-300">Qty</th>
                            <th className="border border-slate-700 px-3 py-2 text-left text-sm text-slate-300">Price</th>
                            <th className="border border-slate-700 px-3 py-2 text-left text-sm text-slate-300">Total</th>
                            <th className="border border-slate-700 px-3 py-2 text-left text-sm text-slate-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(newJobForm.services || []).map((service, idx) => (
                            <tr key={service.id} className="border-b border-slate-700">
                              <td className="border border-slate-700 px-3 py-2 text-sm text-slate-300">{service.name}</td>
                              <td className="border border-slate-700 px-3 py-2">
                                <input
                                  type="number"
                                  value={service.quantity}
                                  onChange={(e) => {
                                    const updated = [...(newJobForm.services || [])]
                                    updated[idx].quantity = parseInt(e.target.value) || 0
                                    updated[idx].total = updated[idx].quantity * updated[idx].unitPrice
                                    setNewJobForm({ ...newJobForm, services: updated })
                                  }}
                                  className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white"
                                  min="1"
                                />
                              </td>
                              <td className="border border-slate-700 px-3 py-2 text-slate-300">AED {service.unitPrice}</td>
                              <td className="border border-slate-700 px-3 py-2 text-slate-300">AED {service.total}</td>
                              <td className="border border-slate-700 px-3 py-2">
                                <button
                                  onClick={() => {
                                    const svcId = services.find(s => s.name === service.name)?.id
                                    if (svcId) toggleServiceSelection(svcId)
                                  }}
                                  className="text-red-400 hover:text-red-300 text-sm"
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

              {/* Add Tasks Section */}
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-violet-400" />
                    Job Tasks
                  </h3>
                  <button
                    onClick={() => setShowTasksSection(!showTasksSection)}
                    className="text-sm text-violet-400 hover:text-violet-300 font-medium"
                  >
                    {showTasksSection ? 'Hide Tasks' : 'Add Tasks'}
                  </button>
                </div>

                {showTasksSection && (
                  <div className="space-y-4">
                    <button
                      onClick={handleAddTask}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Task
                    </button>

                    <div className="space-y-3">
                      {(newJobForm.tasks || []).map((task, idx) => (
                        <div key={task.id} className="p-4 border border-slate-700 rounded-lg space-y-3 bg-slate-900">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-slate-300 mb-1">Task Title *</label>
                              <input
                                type="text"
                                placeholder="e.g., Clean Windows"
                                value={task.title}
                                onChange={(e) => updateTask(idx, 'title', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                              <textarea
                                placeholder="Task description..."
                                value={task.description}
                                onChange={(e) => updateTask(idx, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-1">Duration (hours) *</label>
                              <input
                                type="number"
                                placeholder="1"
                                value={task.duration}
                                onChange={(e) => updateTask(idx, 'duration', parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                min="1"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => updateTask(idx, 'completed', e.target.checked)}
                                className="w-4 h-4 rounded bg-slate-800"
                                id={`task-completed-${idx}`}
                              />
                              <label htmlFor={`task-completed-${idx}`} className="text-sm font-medium text-slate-300 cursor-pointer">
                                Completed
                              </label>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTask(idx)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium"
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
              <div className="space-y-4 border-b border-slate-700 pb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-violet-400" />
                  Special Instructions
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Special Instructions</label>
                  <textarea
                    value={newJobForm.specialInstructions}
                    onChange={(e) => setNewJobForm({...newJobForm, specialInstructions: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    rows={3}
                    placeholder="Any special instructions or notes for this job..."
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-900/20 rounded-lg border border-blue-800">
                  <input
                    type="checkbox"
                    checked={newJobForm.recurring}
                    onChange={(e) => setNewJobForm({...newJobForm, recurring: e.target.checked})}
                    className="w-4 h-4 rounded bg-slate-800"
                    id="recurring"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-slate-300 cursor-pointer">
                    This is a recurring job
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed Bottom */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => { setShowNewJobModal(false); setEditingJobId(null) }}
                className="px-6 py-2 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 font-semibold transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveJob}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-semibold transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingJobId ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (updated styling) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-red-900/30 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete Job</h3>
                  <p className="text-sm text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete this job? All associated data will be permanently removed from Firebase.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-700 font-medium transition-colors"
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

      {/* Execution Modal (updated styling) */}
      {showExecutionModal && selectedJobForExecution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Execute: {selectedJobForExecution.title}</h2>
              <button onClick={() => setShowExecutionModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Details */}
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-400">Client: </span><span className="font-semibold text-white">{selectedJobForExecution.client}</span></div>
                  <div><span className="text-slate-400">Location: </span><span className="font-semibold text-white">{selectedJobForExecution.location}</span></div>
                  <div><span className="text-slate-400">Team Size: </span><span className="font-semibold text-white">{selectedJobForExecution.teamRequired}</span></div>
                  <div><span className="text-slate-400">Budget: </span><span className="font-semibold text-white">AED {selectedJobForExecution.budget.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Assigned Team */}
              {selectedJobForExecution.assignedEmployees && selectedJobForExecution.assignedEmployees.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Assigned Team</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedJobForExecution.assignedEmployees.map(employee => (
                      <div key={employee.id} className="p-3 border border-slate-700 rounded-lg bg-slate-900">
                        <p className="font-medium text-white">{employee.name}</p>
                        <p className="text-xs text-slate-400">{employee.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Section */}
              {selectedJobForExecution.tasks && selectedJobForExecution.tasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Job Tasks</h3>
                  <div className="space-y-2">
                    {selectedJobForExecution.tasks.map((task, idx) => (
                      <div key={idx} className="p-3 border border-slate-700 rounded-lg bg-slate-900">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">{task.title}</p>
                            <p className="text-sm text-slate-400">{task.description}</p>
                            <p className="text-xs text-slate-500 mt-1">Duration: {task.duration} hours</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${task.completed ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-amber-900/20 text-amber-400 border border-amber-800'}`}>
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
                  <h3 className="font-semibold text-white">Required Equipment</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForExecution.equipment.map((eq, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-900/20 text-green-400 text-sm rounded-full border border-green-800">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Permits Section */}
              {selectedJobForExecution.permits && selectedJobForExecution.permits.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Required Permits/Licenses</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForExecution.permits.map((p, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-900/20 text-purple-400 text-sm rounded-full border border-purple-800">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Pre-Execution Checklist</h3>
                {['Team arrived on site', 'Equipment setup', 'Safety review', 'Client briefing', 'Work area secured', 'Permits verified'].map(item => (
                  <label key={item} className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg hover:bg-slate-700/50 cursor-pointer">
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
                      className="w-4 h-4 rounded bg-slate-800"
                    />
                    <span className="text-sm text-slate-300">{item}</span>
                  </label>
                ))}
              </div>

              {/* Photos */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Documentation</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Before', 'During', 'After'].map(label => (
                    <div key={label} className="aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-violet-500">
                      <Camera className="h-8 w-8 text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Notes</h3>
                <textarea
                  value={executionNotes}
                  onChange={(e) => setExecutionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  rows={4}
                  placeholder="Add notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                <button onClick={() => setShowExecutionModal(false)} className="px-4 py-2 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-700">
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