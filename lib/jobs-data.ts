// Job Management Data and Types

export interface JobImage {
  id: string
  url: string
  type: 'before' | 'during' | 'after'
  timestamp: string
  notes?: string
}

export interface JobChecklistItem {
  id: string
  title: string
  completed: boolean
  completedAt?: string
  completedBy?: string
}

export interface JobNote {
  id: string
  content: string
  author: string
  timestamp: string
  type: 'progress' | 'issue' | 'info'
}

export interface JobExecutionLog {
  id: string
  jobId: number
  startTime: string
  endTime?: string
  teamMembers: string[]
  checklist: JobChecklistItem[]
  images: JobImage[]
  notes: JobNote[]
  status: 'in-progress' | 'completed' | 'paused'
  hoursLogged: number
}

export interface Job {
  id: number
  title: string
  client: string
  clientId: number
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
  permits: string[]
  tags: string[]
  specialInstructions?: string
  recurring: boolean
  createdAt: string
  updatedAt: string
  completedAt?: string
  executionLogs: JobExecutionLog[]
  assignedTo: string[]
}

// In-memory storage (replace with API calls to backend in production)
let jobsData: Job[] = [
  {
    id: 1,
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    clientId: 1,
    status: 'Scheduled',
    priority: 'High',
    scheduledDate: '2025-01-20',
    scheduledTime: '08:00',
    endTime: '16:00',
    location: 'Downtown, Dubai',
    teamRequired: 4,
    budget: 5000,
    actualCost: 0,
    description: 'Complete office floor deep cleaning with window and cubicle sanitization',
    riskLevel: 'Low',
    slaDeadline: '2025-01-25',
    estimatedDuration: '8 hours',
    requiredSkills: ['General Cleaning', 'Floor Care', 'Window Cleaning'],
    permits: ['Building Access'],
    tags: ['Office', 'Commercial'],
    specialInstructions: 'Use eco-friendly products only. Avoid disruption during business hours.',
    recurring: false,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
    executionLogs: [],
    assignedTo: ['John Smith', 'Sarah Johnson']
  },
  {
    id: 2,
    title: 'Medical Facility Sanitization',
    client: 'Emirates Medical Center',
    clientId: 2,
    status: 'Pending',
    priority: 'Critical',
    scheduledDate: null,
    location: 'Al Baraha, Dubai',
    teamRequired: 6,
    budget: 8500,
    actualCost: 0,
    description: 'Complete sanitization of medical facility including operating rooms',
    riskLevel: 'High',
    estimatedDuration: '12 hours',
    requiredSkills: ['Medical Cleaning', 'Sanitization', 'HEPA Certification'],
    permits: ['Medical Facility Access', 'Biohazard Handling'],
    tags: ['Medical', 'Sanitization'],
    specialInstructions: 'Requires ISO 14644 certification. Strict hygiene protocols mandatory.',
    recurring: true,
    createdAt: '2025-01-09T14:30:00Z',
    updatedAt: '2025-01-11T09:00:00Z',
    executionLogs: [],
    assignedTo: ['Ahmed Hassan', 'Maria Garcia']
  },
  {
    id: 3,
    title: 'Carpet Cleaning & Maintenance',
    client: 'Hotel Al Manara',
    clientId: 3,
    status: 'In Progress',
    priority: 'Medium',
    scheduledDate: '2025-01-18',
    scheduledTime: '09:00',
    endTime: '17:00',
    location: 'Al Manara, Dubai',
    teamRequired: 3,
    budget: 3500,
    actualCost: 2100,
    description: 'Deep carpet cleaning for hotel lobby and guest rooms',
    riskLevel: 'Low',
    estimatedDuration: '8 hours',
    requiredSkills: ['Carpet Cleaning', 'Upholstery Care'],
    permits: ['Hotel Access'],
    tags: ['Carpet', 'Hospitality'],
    specialInstructions: 'Work after guest checkout. Must complete by 6 PM.',
    recurring: false,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-18T10:30:00Z',
    executionLogs: [
      {
        id: 'log-1',
        jobId: 3,
        startTime: '2025-01-18T09:00:00Z',
        status: 'in-progress',
        teamMembers: ['Michael Chen', 'Lisa Wong'],
        checklist: [
          { id: 'c1', title: 'Team arrived on site', completed: true, completedAt: '2025-01-18T09:05:00Z', completedBy: 'Michael Chen' },
          { id: 'c2', title: 'Equipment setup completed', completed: true, completedAt: '2025-01-18T09:20:00Z', completedBy: 'Michael Chen' },
          { id: 'c3', title: 'Safety protocols reviewed', completed: true, completedAt: '2025-01-18T09:25:00Z', completedBy: 'Lisa Wong' },
          { id: 'c4', title: 'Client briefing completed', completed: true, completedAt: '2025-01-18T09:30:00Z', completedBy: 'Michael Chen' },
          { id: 'c5', title: 'Work area secured', completed: true, completedAt: '2025-01-18T09:35:00Z', completedBy: 'Lisa Wong' }
        ],
        images: [
          { id: 'img-1', url: '/api/placeholder/carpet-before', type: 'before', timestamp: '2025-01-18T09:40:00Z', notes: 'Lobby carpet - shows heavy staining' }
        ],
        notes: [
          { id: 'note-1', content: 'Started with lobby cleaning. High traffic stains visible.', author: 'Michael Chen', timestamp: '2025-01-18T10:00:00Z', type: 'progress' }
        ],
        hoursLogged: 2
      }
    ],
    assignedTo: ['Michael Chen', 'Lisa Wong']
  },
  {
    id: 4,
    title: 'Residential Complex Maintenance',
    client: 'Marina Residential Tower',
    clientId: 4,
    status: 'Scheduled',
    priority: 'Medium',
    scheduledDate: '2025-01-22',
    scheduledTime: '07:00',
    endTime: '15:00',
    location: 'Marina, Dubai',
    teamRequired: 5,
    budget: 4200,
    actualCost: 0,
    description: 'Common areas cleaning, pool deck sanitization, and landscaping maintenance',
    riskLevel: 'Low',
    estimatedDuration: '8 hours',
    requiredSkills: ['Residential Cleaning', 'Pool Maintenance', 'Landscaping'],
    permits: ['Residential Access'],
    tags: ['Residential', 'Maintenance'],
    specialInstructions: 'Coordinate with building management. Avoid disturbing residents.',
    recurring: true,
    createdAt: '2025-01-08T11:00:00Z',
    updatedAt: '2025-01-08T11:00:00Z',
    executionLogs: [],
    assignedTo: ['James Wilson', 'Emma Davis']
  },
  {
    id: 5,
    title: 'Industrial Floor Coating',
    client: 'Dubai Industrial Park',
    clientId: 5,
    status: 'Pending',
    priority: 'High',
    scheduledDate: null,
    location: 'Industrial City, Dubai',
    teamRequired: 8,
    budget: 12000,
    actualCost: 0,
    description: 'Industrial floor preparation, epoxy coating application, and quality inspection',
    riskLevel: 'High',
    estimatedDuration: '24 hours',
    requiredSkills: ['Industrial Cleaning', 'Epoxy Application', 'Safety Management'],
    permits: ['Industrial Facility Access', 'Chemical Handling'],
    tags: ['Industrial', 'Flooring'],
    specialInstructions: 'Requires hazmat certification. Work during off-hours. Proper ventilation essential.',
    recurring: false,
    createdAt: '2025-01-07T15:45:00Z',
    updatedAt: '2025-01-11T09:15:00Z',
    executionLogs: [],
    assignedTo: []
  }
]

// Get all jobs
export function getJobs(): Job[] {
  return jobsData
}

// Get job by ID
export function getJobById(id: number): Job | undefined {
  return jobsData.find(job => job.id === id)
}

// Create new job
export function createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'executionLogs' | 'actualCost'>): Job {
  const newJob: Job = {
    ...jobData,
    id: Math.max(...jobsData.map(j => j.id), 0) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    executionLogs: [],
    actualCost: 0
  }
  jobsData.push(newJob)
  return newJob
}

// Update job
export function updateJob(id: number, updates: Partial<Job>): Job | null {
  const index = jobsData.findIndex(job => job.id === id)
  if (index === -1) return null
  
  jobsData[index] = {
    ...jobsData[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  return jobsData[index]
}

// Update job status
export function updateJobStatus(id: number, status: Job['status']): Job | null {
  return updateJob(id, {
    status,
    ...(status === 'Completed' && { completedAt: new Date().toISOString() })
  })
}

// Add execution log to job
export function addExecutionLog(jobId: number, log: Omit<JobExecutionLog, 'id'>): Job | null {
  const job = getJobById(jobId)
  if (!job) return null
  
  const newLog: JobExecutionLog = {
    ...log,
    id: `log-${Date.now()}`
  }
  
  job.executionLogs.push(newLog)
  return updateJob(jobId, { executionLogs: job.executionLogs })
}

// Update execution log
export function updateExecutionLog(jobId: number, logId: string, updates: Partial<JobExecutionLog>): Job | null {
  const job = getJobById(jobId)
  if (!job) return null
  
  const logIndex = job.executionLogs.findIndex(log => log.id === logId)
  if (logIndex === -1) return null
  
  job.executionLogs[logIndex] = {
    ...job.executionLogs[logIndex],
    ...updates
  }
  
  return updateJob(jobId, { executionLogs: job.executionLogs })
}

// Add note to execution log
export function addExecutionNote(jobId: number, logId: string, note: Omit<JobNote, 'id'>): Job | null {
  const job = getJobById(jobId)
  if (!job) return null
  
  const log = job.executionLogs.find(l => l.id === logId)
  if (!log) return null
  
  const newNote: JobNote = {
    ...note,
    id: `note-${Date.now()}`
  }
  
  log.notes.push(newNote)
  return updateJob(jobId, { executionLogs: job.executionLogs })
}

// Assign employee to job
export function assignEmployeeToJob(jobId: number, employeeName: string): Job | null {
  const job = getJobById(jobId)
  if (!job) return null
  
  if (!job.assignedTo.includes(employeeName)) {
    job.assignedTo.push(employeeName)
    return updateJob(jobId, { assignedTo: job.assignedTo })
  }
  
  return job
}

// Remove employee from job
export function removeEmployeeFromJob(jobId: number, employeeName: string): Job | null {
  const job = getJobById(jobId)
  if (!job) return null
  
  const updatedAssignees = job.assignedTo.filter(name => name !== employeeName)
  return updateJob(jobId, { assignedTo: updatedAssignees })
}

// Get jobs by status
export function getJobsByStatus(status: Job['status']): Job[] {
  return jobsData.filter(job => job.status === status)
}

// Get jobs by priority
export function getJobsByPriority(priority: Job['priority']): Job[] {
  return jobsData.filter(job => job.priority === priority)
}

// Get jobs by client
export function getJobsByClient(clientId: number): Job[] {
  return jobsData.filter(job => job.clientId === clientId)
}

// Get job statistics
export function getJobStats() {
  return {
    total: jobsData.length,
    pending: jobsData.filter(j => j.status === 'Pending').length,
    scheduled: jobsData.filter(j => j.status === 'Scheduled').length,
    inProgress: jobsData.filter(j => j.status === 'In Progress').length,
    completed: jobsData.filter(j => j.status === 'Completed').length,
    totalBudget: jobsData.reduce((sum, j) => sum + j.budget, 0),
    totalActualCost: jobsData.reduce((sum, j) => sum + j.actualCost, 0),
    critical: jobsData.filter(j => j.priority === 'Critical').length
  }
}

// Delete job
export function deleteJob(id: number): boolean {
  const index = jobsData.findIndex(job => job.id === id)
  if (index === -1) return false
  jobsData.splice(index, 1)
  return true
}
