'use client'

import { useState, Suspense } from 'react'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Tag,
  DollarSign,
  ArrowRight,
  MessageSquare,
  Star,
  Zap,
  ClipboardCheck,
  Navigation,
  AlertTriangle,
  CheckSquare,
  MessageCircle,
  Calendar,
  Timer,
  ShieldCheck,
  Download,
  History,
  FileText,
  Plus,
  ChevronRight,
  Bell,
  TrendingUp,
  Activity,
  Cloud,
  Car,
  Wrench,
  Eye,
  Edit,
  Save,
  X,
  RefreshCw,
  BarChart3,
  Target,
  Award,
  ThumbsUp,
  ThumbsDown,
  Send,
  Phone,
  Mail,
  Building,
  Wifi,
  WifiOff,
  PlayCircle,
  Camera
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

function JobDetailContent() {
  const params = useParams()
  const jobId = params?.id as string || '1'
  const [activeTab, setActiveTab] = useState<'overview' | 'pre-execution' | 'execution' | 'completion' | 'notes' | 'tasks' | 'team' | 'reports' | 'feedback' | 'compensation'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notesText, setNotesText] = useState('')
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([])
  const [checklistItems, setChecklistItems] = useState([
    { item: 'Job requirements reviewed', status: true },
    { item: 'Client contact confirmed', status: true },
    { item: 'Site access arrangements', status: false },
    { item: 'Safety protocols reviewed', status: true },
    { item: 'Equipment requirements checked', status: false },
    { item: 'Team availability confirmed', status: true }
  ])
  const [equipmentStatus, setEquipmentStatus] = useState([
    { item: 'Cleaning supplies', status: 'Ready', color: 'green' },
    { item: 'Safety equipment', status: 'Ready', color: 'green' },
    { item: 'Specialized tools', status: 'Pending', color: 'yellow' },
    { item: 'Transportation', status: 'Ready', color: 'green' }
  ])
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Ahmed Hassan', role: 'Team Lead', status: 'Confirmed', initials: 'AH', hourlyRate: 150, estimatedHours: 8, totalCompensation: 1200 },
    { id: 2, name: 'Fatima Al-Mazrouei', role: 'Floor Specialist', status: 'Confirmed', initials: 'FA', hourlyRate: 120, estimatedHours: 8, totalCompensation: 960 },
    { id: 3, name: 'Mohammed Bin Ali', role: 'Window Specialist', status: 'Pending', initials: 'MBA', hourlyRate: 110, estimatedHours: 6, totalCompensation: 660 }
  ])
  const [activityLog, setActivityLog] = useState([
    { action: 'Created', timestamp: '2025-01-10 10:30', user: 'Sales Team', details: 'Job created from quotation' },
    { action: 'Scheduled', timestamp: '2025-01-12 14:00', user: 'Scheduling Team', details: 'Date and time confirmed' },
    { action: 'Team Assigned', timestamp: '2025-01-15 09:00', user: 'HR Manager', details: '3 team members assigned' },
    { action: 'Permits Approved', timestamp: '2025-01-18 16:00', user: 'Compliance Officer', details: 'All required permits obtained' }
  ])
  const [executionTasks, setExecutionTasks] = useState([
    { id: 1, task: 'Floor deep cleaning - Main area', status: 'completed', progress: 100, reminder: null },
    { id: 2, task: 'Window exterior cleaning', status: 'in-progress', progress: 60, reminder: { time: '14:00', enabled: true } },
    { id: 3, task: 'Cubicle sanitization', status: 'pending', progress: 0, reminder: null },
    { id: 4, task: 'Restroom deep clean', status: 'pending', progress: 0, reminder: null }
  ])
  const [executionTime, setExecutionTime] = useState({
    elapsedHours: 4,
    elapsedMinutes: 30,
    estimatedCompletion: 6.5,
    lastUpdate: '2 min ago'
  })
  const [executionNotes, setExecutionNotes] = useState('')
  const [executionPhotos, setExecutionPhotos] = useState([
    { id: 1, stage: 'Before', imageUrl: '/api/placeholder/200/150', uploadedAt: '2025-01-20 09:15' },
    { id: 2, stage: 'In Progress', imageUrl: '/api/placeholder/200/150', uploadedAt: '2025-01-20 11:30' }
  ])
  const [jobNotes, setJobNotes] = useState([
    { id: 1, text: 'Client prefers morning service', author: 'Sales Team', timestamp: '2025-01-10 10:30', type: 'general' },
    { id: 2, text: 'Building access from rear entrance only', author: 'Operations', timestamp: '2025-01-12 14:00', type: 'important' }
  ])
  const [newJobNote, setNewJobNote] = useState('')
  const [taskAssignments, setTaskAssignments] = useState([
    { taskId: 1, taskName: 'Floor deep cleaning - Main area', assignedTo: 'Fatima Al-Mazrouei', status: 'completed' },
    { taskId: 2, taskName: 'Window exterior cleaning', assignedTo: 'Mohammed Bin Ali', status: 'in-progress' },
    { taskId: 3, taskName: 'Cubicle sanitization', assignedTo: 'Ahmed Hassan', status: 'pending' }
  ])
  const [jobReminders, setJobReminders] = useState([
    { id: 1, text: 'Team check-in reminder', remindAt: '08:00', enabled: true },
    { id: 2, text: 'Equipment arrival confirmation', remindAt: '07:30', enabled: true }
  ])
  const [employeeReports, setEmployeeReports] = useState([
    { id: 1, employee: 'Ahmed Hassan', jobId: jobId, date: '2025-01-20', hoursWorked: 8, tasksCompleted: 4, status: 'submitted', notes: 'All tasks completed successfully' },
    { id: 2, employee: 'Fatima Al-Mazrouei', jobId: jobId, date: '2025-01-20', hoursWorked: 7.5, tasksCompleted: 3, status: 'submitted', notes: 'Minor delay due to client requests' }
  ])
  const [employeeFeedback, setEmployeeFeedback] = useState([
    { id: 1, employee: 'Ahmed Hassan', jobId: jobId, date: '2025-01-20', rating: 5, feedback: 'Excellent coordination with team. High quality work delivered on time.', category: 'performance' },
    { id: 2, employee: 'Fatima Al-Mazrouei', jobId: jobId, date: '2025-01-20', rating: 4, feedback: 'Good work quality. Communication could be improved.', category: 'performance' },
    { id: 3, employee: 'Mohammed Bin Ali', jobId: jobId, date: '2025-01-19', rating: 4, feedback: 'Proactive and helpful. Requires more attention to detail.', category: 'behavioral' }
  ])
  const [showJobNoteModal, setShowJobNoteModal] = useState(false)
  const [showTaskAssignmentModal, setShowTaskAssignmentModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedTeamMember, setSelectedTeamMember] = useState('')
  const [reminderTime, setReminderTime] = useState('08:00')
  const [reminderText, setReminderText] = useState('')
  const [selectedTaskForReminder, setSelectedTaskForReminder] = useState<any>(null)

  const handleChecklistChange = (index: number) => {
    setChecklistItems(prev => prev.map((item, i) => 
      i === index ? { ...item, status: !item.status } : item
    ))
    addActivityLog('Checklist Updated', `${checklistItems[index].item} marked as ${!checklistItems[index].status ? 'done' : 'pending'}`)
  }

  const handleEquipmentStatusChange = (index: number, newStatus: string) => {
    setEquipmentStatus(prev => {
      const newColor = newStatus === 'Ready' ? 'green' : newStatus === 'Pending' ? 'yellow' : 'red'
      return prev.map((item, i) => 
        i === index ? { ...item, status: newStatus, color: newColor } : item
      )
    })
    addActivityLog('Equipment Status Updated', `${equipmentStatus[index].item} status changed to ${newStatus}`)
  }

  const handleTeamStatusChange = (memberId: number, newStatus: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, status: newStatus } : member
    ))
    const member = teamMembers.find(m => m.id === memberId)
    addActivityLog('Team Status Updated', `${member?.name} marked as ${newStatus}`)
  }

  const addActivityLog = (action: string, details: string) => {
    const now = new Date()
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setActivityLog(prev => [{ action, timestamp, user: 'Current User', details }, ...prev])
  }

  const handleTaskStatusChange = (taskId: number, newStatus: string) => {
    setExecutionTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : newStatus === 'in-progress' ? 60 : 0 } : task
    ))
    const task = executionTasks.find(t => t.id === taskId)
    addActivityLog('Task Updated', `${task?.task} status changed to ${newStatus}`)
  }

  const handleTaskProgressChange = (taskId: number, newProgress: number) => {
    setExecutionTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, progress: newProgress, status: newProgress === 100 ? 'completed' : 'in-progress' } : task
    ))
    addActivityLog('Task Progress Updated', `Task progress updated to ${newProgress}%`)
  }

  const handleSaveExecutionNotes = () => {
    if (executionNotes.trim()) {
      addActivityLog('Execution Notes', executionNotes)
      setExecutionNotes('')
    }
  }

  const handleUploadPhoto = (stage: string) => {
    const newPhoto = {
      id: executionPhotos.length + 1,
      stage: stage,
      imageUrl: '/api/placeholder/200/150',
      uploadedAt: new Date().toLocaleString()
    }
    setExecutionPhotos(prev => [newPhoto, ...prev])
    addActivityLog('Photo Uploaded', `${stage} photo added to documentation`)
  }

  const getTaskProgress = () => {
    const completed = executionTasks.filter(t => t.status === 'completed').length
    const total = executionTasks.length
    return Math.round((completed / total) * 100)
  }

  const handleAddJobNote = () => {
    if (newJobNote.trim()) {
      const newNote = {
        id: jobNotes.length + 1,
        text: newJobNote,
        author: 'Current User',
        timestamp: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'general'
      }
      setJobNotes([...jobNotes, newNote])
      setNewJobNote('')
      addActivityLog('Job Note Added', newJobNote)
      setShowJobNoteModal(false)
    }
  }

  const handleAssignTask = () => {
    if (selectedTask && selectedTeamMember) {
      setTaskAssignments(taskAssignments.map(assignment => 
        assignment.taskId === selectedTask.id 
          ? { ...assignment, assignedTo: selectedTeamMember }
          : assignment
      ))
      addActivityLog('Task Assignment', `${selectedTask.taskName} assigned to ${selectedTeamMember}`)
      setShowTaskAssignmentModal(false)
      setSelectedTask(null)
      setSelectedTeamMember('')
    }
  }

  const handleAddReminder = () => {
    if (reminderText.trim()) {
      const newReminder = {
        id: jobReminders.length + 1,
        text: reminderText,
        remindAt: reminderTime,
        enabled: true
      }
      setJobReminders([...jobReminders, newReminder])
      addActivityLog('Reminder Created', `${reminderText} at ${reminderTime}`)
      setReminderText('')
      setReminderTime('08:00')
      setShowReminderModal(false)
    }
  }

  const handleToggleReminder = (reminderId: number) => {
    setJobReminders(jobReminders.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, enabled: !reminder.enabled }
        : reminder
    ))
    const reminder = jobReminders.find(r => r.id === reminderId)
    addActivityLog('Reminder Status', `${reminder?.text} ${!reminder?.enabled ? 'enabled' : 'disabled'}`)
  }

  const handleRemoveReminder = (reminderId: number) => {
    const reminder = jobReminders.find(r => r.id === reminderId)
    setJobReminders(jobReminders.filter(r => r.id !== reminderId))
    addActivityLog('Reminder Removed', reminder?.text || '')
  }

  const handleRemoveJobNote = (noteId: number) => {
    const note = jobNotes.find(n => n.id === noteId)
    setJobNotes(jobNotes.filter(n => n.id !== noteId))
    addActivityLog('Job Note Removed', note?.text || '')
  }

  const handleAddTaskReminder = (taskId: number) => {
    if (reminderTime) {
      setExecutionTasks(prev => prev.map(task =>
        task.id === taskId
          ? { ...task, reminder: { time: reminderTime, enabled: true } }
          : task
      ))
      const task = executionTasks.find(t => t.id === taskId)
      addActivityLog('Task Reminder Set', `Reminder set for "${task?.task}" at ${reminderTime}`)
      setShowReminderModal(false)
      setReminderTime('08:00')
      setSelectedTaskForReminder(null)
    }
  }

  const handleToggleTaskReminder = (taskId: number) => {
    setExecutionTasks(prev => prev.map(task =>
      task.id === taskId && task.reminder
        ? { ...task, reminder: { ...task.reminder, enabled: !task.reminder.enabled } }
        : task
    ))
  }

  const handleRemoveTaskReminder = (taskId: number) => {
    setExecutionTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, reminder: null }
        : task
    ))
    const task = executionTasks.find(t => t.id === taskId)
    addActivityLog('Task Reminder Removed', `Reminder removed for "${task?.task}"`)
  }

  const handleReassignTeamMember = (taskIndex: number, newMember: string) => {
    const oldAssignment = taskAssignments[taskIndex]
    setTaskAssignments(taskAssignments.map((assignment, idx) =>
      idx === taskIndex
        ? { ...assignment, assignedTo: newMember }
        : assignment
    ))
    addActivityLog('Team Member Reassigned', `${oldAssignment.taskName} reassigned to ${newMember}`)
  }

  // Enhanced job data with AI insights and real-time tracking
  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    clientId: 1,
    status: 'Scheduled',
    priority: 'High',
    scheduledDate: '2025-01-20',
    scheduledTime: '08:00 - 16:00',
    location: 'Downtown, Dubai',
    estimatedDuration: '8 hours',
    teamRequired: 4,
    assignedTeam: [
      { id: 1, name: 'Ahmed Hassan', role: 'Team Lead', status: 'Confirmed', checkInTime: null, checkOutTime: null },
      { id: 2, name: 'Fatima Al-Mazrouei', role: 'Floor Specialist', status: 'Confirmed', checkInTime: null, checkOutTime: null },
      { id: 3, name: 'Mohammed Bin Ali', role: 'Window Specialist', status: 'Pending', checkInTime: null, checkOutTime: null }
    ],
    permits: [
      { name: 'Building Access Pass', status: 'Approved', expiryDate: '2025-01-25' },
      { name: 'Commercial Permit', status: 'Approved', expiryDate: '2025-01-22' }
    ],
    slaDeadline: '2025-01-20',
    daysUntilSLA: 2,
    riskLevel: 'medium',
    requiredSkills: ['Floor Cleaning', 'Window Cleaning', 'Safety Certification', 'Team Lead'],
    dependencies: ['Building access authorization', 'Equipment delivery'],
    budget: 5000,
    description: 'Complete office floor deep cleaning with window and cubicle sanitization',
    notes: 'Building manager is Ahmed. Access from rear entrance. Equipment storage in basement.',
    aiInsights: {
      riskPrediction: 'medium',
      estimatedCompletion: '7.5 hours',
      recommendedTeamSize: 4,
      weatherImpact: 'None',
      trafficDelay: '15 minutes',
      equipmentEfficiency: '95%'
    },
    progressMetrics: {
      checklistCompletion: 85,
      equipmentReadiness: 90,
      teamReadiness: 100,
      permitStatus: 100,
      overallReadiness: 92
    },
    realTimeData: {
      teamLocation: 'En Route',
      weatherConditions: 'Clear, 28°C',
      trafficStatus: 'Moderate',
      equipmentStatus: 'All Ready'
    },
    history: [
      { action: 'Created', user: 'Sales Team', timestamp: '2025-01-10 10:30', details: 'Job created from quotation', type: 'creation' },
      { action: 'Scheduled', user: 'Scheduling Team', timestamp: '2025-01-12 14:00', details: 'Date and time confirmed', type: 'scheduling' },
      { action: 'Team Assigned', user: 'HR Manager', timestamp: '2025-01-15 09:00', details: '3 team members assigned', type: 'assignment' },
      { action: 'Permits Approved', user: 'Compliance Officer', timestamp: '2025-01-18 16:00', details: 'All required permits obtained', type: 'compliance' }
    ],
    attachments: [
      { name: 'Building Layout', type: 'PDF', size: '2.4 MB', uploadedBy: 'Operations Manager', uploadDate: '2025-01-15' },
      { name: 'Safety Instructions', type: 'PDF', size: '1.1 MB', uploadedBy: 'Safety Officer', uploadDate: '2025-01-16' },
      { name: 'Client Requirements', type: 'DOC', size: '450 KB', uploadedBy: 'Sales Team', uploadDate: '2025-01-10' }
    ],
    notifications: [
      { id: 1, type: 'warning', message: 'Weather forecast shows possible rain - consider rescheduling', timestamp: '2025-01-19 08:00', read: false },
      { id: 2, type: 'info', message: 'Team check-in reminder: 08:00 tomorrow', timestamp: '2025-01-19 18:00', read: true },
      { id: 3, type: 'success', message: 'All permits approved and ready', timestamp: '2025-01-18 16:30', read: true }
    ]
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 space-y-8">
      {/* Enhanced Header with Real-time Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/jobs" className="p-2 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                job.status === 'Scheduled' ? 'bg-indigo-100 text-indigo-700' :
                job.status === 'In Progress' ? 'bg-green-100 text-green-700' :
                job.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {job.status}
              </span>
             
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {job.client}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
         

          {/* Action Buttons */}
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all border border-gray-400"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Job</span>
          </button>
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Update Status</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all border border-red-300">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Enhanced Quick Stats Bar with AI Insights */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Scheduled Date', value: job.scheduledDate, sub: job.scheduledTime, icon: Calendar, color: 'text-blue-600' },
          { label: 'Duration', value: job.estimatedDuration, sub: `AI: ${job.aiInsights.estimatedCompletion}`, icon: Timer, color: 'text-indigo-600' },
          { label: 'Budget', value: `AED ${job.budget.toLocaleString()}`, sub: 'Fixed Price', icon: DollarSign, color: 'text-emerald-600' },
          { label: 'SLA Deadline', value: job.slaDeadline, sub: `${job.daysUntilSLA} days left`, icon: ShieldCheck, color: job.daysUntilSLA <= 1 ? 'text-red-600' : 'text-amber-600' },
          { label: 'AI Risk Level', value: job.aiInsights.riskPrediction.toUpperCase(), sub: 'Medium Confidence', icon: job.aiInsights.riskPrediction === 'high' ? AlertTriangle : job.aiInsights.riskPrediction === 'medium' ? Clock : CheckCircle, color: job.aiInsights.riskPrediction === 'high' ? 'text-red-600' : job.aiInsights.riskPrediction === 'medium' ? 'text-yellow-600' : 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-300 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.sub}</div>
          </div>
        ))}
      </div>


      {/* Enhanced Workflow Actions - Dynamic based on status */}
      {job.status === 'Scheduled' && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Pre-Execution Workflow
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700">Progress: {job.progressMetrics.overallReadiness}%</span>
              <div className="w-24 bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${job.progressMetrics.overallReadiness}%` }}></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link
              href={`/admin/jobs/${jobId}/pre-job-checklist`}
              className="group p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <ClipboardCheck className="w-6 h-6 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-blue-900">Pre-Job Checklist</span>
              <div className="text-[10px] text-blue-700 mt-1">{job.progressMetrics.checklistCompletion}% Complete</div>
            </Link>
            <Link
              href={`/admin/jobs/${jobId}/assignment`}
              className="group p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <Users className="w-6 h-6 text-purple-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-purple-900">Team Assignment</span>
              <div className="text-[10px] text-purple-700 mt-1">{job.progressMetrics.teamReadiness}% Ready</div>
            </Link>
            <Link
              href={`/admin/jobs/${jobId}/permit-tracker`}
              className="group p-4 bg-green-100 hover:bg-green-200 border border-green-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <ShieldCheck className="w-6 h-6 text-green-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-green-900">Permit Tracker</span>
              <div className="text-[10px] text-green-700 mt-1">{job.progressMetrics.permitStatus}% Approved</div>
            </Link>
            <Link
              href={`/admin/jobs/${jobId}/equipment-readiness`}
              className="group p-4 bg-orange-100 hover:bg-orange-200 border border-orange-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <Wrench className="w-6 h-6 text-orange-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-orange-900">Equipment</span>
              <div className="text-[10px] text-orange-700 mt-1">{job.progressMetrics.equipmentReadiness}% Ready</div>
            </Link>
            <button
              onClick={() => setShowStatusModal(true)}
              className="group p-4 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <ArrowRight className="w-6 h-6 text-indigo-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-indigo-900">Start Job</span>
              <div className="text-[10px] text-indigo-700 mt-1">Begin Execution</div>
            </button>
          </div>
        </div>
      )}

      {job.status === 'In Progress' && (
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Active Execution Workflow
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-800">LIVE TRACKING</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link
              href={`/admin/jobs/${jobId}/live-job-view`}
              className="group p-4 bg-green-100 hover:bg-green-200 border border-green-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <Eye className="w-6 h-6 text-green-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-green-900">Live View</span>
              <div className="text-[10px] text-green-700 mt-1">Real-time Monitoring</div>
            </Link>
            <Link
              href={`/admin/jobs/${jobId}/task-progress`}
              className="group p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <CheckSquare className="w-6 h-6 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-blue-900">Task Progress</span>
              <div className="text-[10px] text-blue-700 mt-1">Track Completion</div>
            </Link>
            <Link
              href={`/admin/jobs/${jobId}/damage-check`}
              className="group p-4 bg-orange-100 hover:bg-orange-200 border border-orange-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <AlertTriangle className="w-6 h-6 text-orange-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-orange-900">Damage Check</span>
              <div className="text-[10px] text-orange-700 mt-1">Quality Control</div>
            </Link>
            <Link
              href={`/admin/jobs/${jobId}/incident-log`}
              className="group p-4 bg-red-100 hover:bg-red-200 border border-red-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <AlertCircle className="w-6 h-6 text-red-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-red-900">Incidents</span>
              <div className="text-[10px] text-red-700 mt-1">Report Issues</div>
            </Link>
            <button
              onClick={() => setShowStatusModal(true)}
              className="group p-4 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <CheckCircle className="w-6 h-6 text-emerald-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-emerald-900">Complete Job</span>
              <div className="text-[10px] text-emerald-700 mt-1">Finish Execution</div>
            </button>
          </div>
        </div>
      )}

      {job.status === 'Completed' && (
        <div className="bg-linear-to-r from-emerald-50 to-green-50 border border-emerald-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Post-Completion Workflow
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
              <CheckCircle className="w-3 h-3 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-800">JOB COMPLETED</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link
              href={`/admin/jobs/${jobId}/job-closure`}
              className="group p-4 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <CheckCircle className="w-6 h-6 text-emerald-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-emerald-900">Job Closure</span>
              <div className="text-[10px] text-emerald-700 mt-1">Final Documentation</div>
            </Link>
            <Link
              href={`/admin/jobs/${jobId}/feedback-collection`}
              className="group p-4 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <Star className="w-6 h-6 text-indigo-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-indigo-900">Client Feedback</span>
              <div className="text-[10px] text-indigo-700 mt-1">Collect Reviews</div>
            </Link>
            <Link
              href={`/admin/jobs/${jobId}/review-request`}
              className="group p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <MessageSquare className="w-6 h-6 text-purple-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-purple-900">Review Request</span>
              <div className="text-[10px] text-purple-700 mt-1">Request Approval</div>
            </Link>
            <Link
              href={`/admin/jobs/${jobId}/client-summary`}
              className="group p-4 bg-pink-100 hover:bg-pink-200 border border-pink-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <FileText className="w-6 h-6 text-pink-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-pink-900">Client Summary</span>
              <div className="text-[10px] text-pink-700 mt-1">Final Report</div>
            </Link>
            <Link
              href={`/admin/finance/invoice-generator?jobId=${jobId}`}
              className="group p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <DollarSign className="w-6 h-6 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-blue-900">Generate Invoice</span>
              <div className="text-[10px] text-blue-700 mt-1">Billing Process</div>
            </Link>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="grid grid-cols-5 gap-2 p-1 bg-white border border-gray-300 rounded-2xl shadow-sm">
        {[
          { id: 'overview', label: 'Overview', icon: FileText },
          { id: 'pre-execution', label: 'Pre-Execution', icon: ClipboardCheck },
          { id: 'execution', label: 'Execution', icon: Navigation },
          { id: 'notes', label: 'Notes & Reminders', icon: MessageSquare },
          { id: 'tasks', label: 'Task Assignment', icon: CheckCircle },
          { id: 'team', label: 'Team Management', icon: Users },
          { id: 'compensation', label: 'Compensation', icon: DollarSign },
          { id: 'feedback', label: 'Employee Feedback', icon: Star },
          { id: 'reports', label: 'Employee Reports', icon: FileText },
          { id: 'completion', label: 'Completion', icon: CheckSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="line-clamp-2 text-center">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'pre-execution' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Pre-Execution Phase</h3>
                <span className="text-xs font-bold text-blue-900 px-3 py-1 bg-blue-100 rounded-full">Preparation Stage</span>
              </div>

              {/* Pre-Execution Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5" />
                    Pre-Job Checklist
                  </h4>
                  <div className="space-y-3">
                    {checklistItems.map((check, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-200">
                        <input
                          type="checkbox"
                          checked={check.status}
                          onChange={() => handleChecklistChange(i)}
                          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">{check.item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Readiness
                  </h4>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-200">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                          member.status === 'Confirmed' ? 'bg-green-600' : 'bg-yellow-600'
                        }`}>
                          {member.initials}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-600">{member.role}</div>
                        </div>
                        <select
                          value={member.status}
                          onChange={(e) => handleTeamStatusChange(member.id, e.target.value)}
                          className="text-xs font-bold px-2 py-1 rounded-full border cursor-pointer bg-white transition-all hover:border-purple-400"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Pending">Pending</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Permits & Equipment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Permits & Access
                  </h4>
                  <div className="space-y-3">
                    {job.permits.map((permit, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-green-200">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{permit.name}</div>
                            <div className="text-xs text-gray-600">Expires: {permit.expiryDate}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          permit.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {permit.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-linear-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Equipment Status
                  </h4>
                  <div className="space-y-3">
                    {equipmentStatus.map((equipment, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-200">
                        <span className="text-sm text-gray-900">{equipment.item}</span>
                        <select
                          value={equipment.status}
                          onChange={(e) => handleEquipmentStatusChange(i, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer transition-all hover:border-orange-400 ${
                            equipment.color === 'green' ? 'bg-green-100 text-green-700 border-green-300' :
                            equipment.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                            'bg-red-100 text-red-700 border-red-300'
                          }`}
                        >
                          <option value="Ready">Ready</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Ready">Not Ready</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pre-Execution Actions */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-4">Quick Actions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link
                    href={`/admin/jobs/${jobId}/pre-job-checklist`}
                    className="p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105"
                  >
                    <ClipboardCheck className="w-6 h-6 text-blue-700 mx-auto mb-2" />
                    <span className="text-xs font-bold text-blue-900">Complete Checklist</span>
                  </Link>
                  <Link
                    href={`/admin/jobs/${jobId}/assignment`}
                    className="p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all hover:scale-105"
                  >
                    <Users className="w-6 h-6 text-purple-700 mx-auto mb-2" />
                    <span className="text-xs font-bold text-purple-900">Manage Team</span>
                  </Link>
                  <Link
                    href={`/admin/jobs/${jobId}/permit-tracker`}
                    className="p-4 bg-green-100 hover:bg-green-200 border border-green-400 rounded-xl text-center transition-all hover:scale-105"
                  >
                    <ShieldCheck className="w-6 h-6 text-green-700 mx-auto mb-2" />
                    <span className="text-xs font-bold text-green-900">Permit Tracker</span>
                  </Link>
                  <Link
                    href={`/admin/jobs/${jobId}/equipment-readiness`}
                    className="p-4 bg-orange-100 hover:bg-orange-200 border border-orange-400 rounded-xl text-center transition-all hover:scale-105"
                  >
                    <Wrench className="w-6 h-6 text-orange-700 mx-auto mb-2" />
                    <span className="text-xs font-bold text-orange-900">Equipment Check</span>
                  </Link>
                </div>
              </div>

              {/* Team Status Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Team Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Team Active</span>
                      <span className="text-2xl font-bold text-purple-600">{teamMembers.filter(m => m.status === 'Confirmed').length}/{teamMembers.length}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              member.status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className="text-sm text-gray-700">{member.name}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase">{member.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Equipment Status Summary</h4>
                  <div className="space-y-3">
                    {equipmentStatus.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.item}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          item.color === 'green' ? 'bg-green-100 text-green-700' :
                          item.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <>
              {/* Description & Notes */}
              <div className="bg-white border border-gray-300 rounded-3xl p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    Job Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>
                <div className="p-6 bg-indigo-50 border border-indigo-300 rounded-2xl">
                  <h4 className="text-sm font-bold text-indigo-900 mb-2">Operational Notes</h4>
                  <p className="text-sm text-gray-800">{job.notes}</p>
                </div>
              </div>

              {/* Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-xs font-bold border border-blue-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Permits & Access</h3>
                  <div className="space-y-3">
                    {job.permits.map((permit, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-300">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{permit.name}</div>
                            <div className="text-xs text-gray-600">Expires: {permit.expiryDate}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          permit.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {permit.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'execution' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">On-Site Execution</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-green-800">LIVE</span>
                  </div>
                  <span className="text-xs font-bold text-green-900 px-3 py-1 bg-green-100 rounded-full">In Progress</span>
                </div>
              </div>
              
              {/* Execution Progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckSquare className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-900">Task Progress</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-2">{getTaskProgress()}%</div>
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{ width: `${getTaskProgress()}%` }}></div>
                  </div>
                  <div className="text-xs text-green-700">{executionTasks.filter(t => t.status === 'completed').length} of {executionTasks.length} tasks completed</div>
                </div>
                
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">Time Tracking</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-2">{executionTime.elapsedHours}.{String(executionTime.elapsedMinutes).padStart(2, '0')}h</div>
                  <div className="text-xs text-blue-700 mb-2">Elapsed: {executionTime.elapsedHours}h {executionTime.elapsedMinutes}m</div>
                  <div className="text-xs text-blue-600">Estimated completion: {executionTime.estimatedCompletion}h</div>
                </div>
                
                <div className="bg-linear-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-bold text-orange-900">Live Updates</span>
                  </div>
                  <div className="text-xs text-orange-700 mb-2">Last update: {executionTime.lastUpdate}</div>
                  <div className="text-xs text-orange-600">Team: On site, working efficiently</div>
                </div>
              </div>

              {/* Current Tasks & Image Documentation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Current Tasks</h4>
                  <div className="space-y-3">
                    {executionTasks.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <select
                            value={task.status}
                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                            className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer transition-all ${
                              task.status === 'completed' ? 'bg-green-100 text-green-700 border-green-300' :
                              task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                              'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <span className="flex-1 text-sm font-medium text-gray-900">{task.task}</span>
                          <button
                            onClick={() => {
                              setSelectedTaskForReminder(task);
                              setReminderTime('08:00');
                              setShowReminderModal(true);
                            }}
                            className={`px-2 py-1 text-xs rounded-lg font-bold transition-all ${
                              task.reminder ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-amber-50'
                            }`}
                          >
                            🔔 {task.reminder ? 'Remind' : 'Set'}
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={task.progress}
                            onChange={(e) => handleTaskProgressChange(task.id, parseInt(e.target.value))}
                            className="flex-1 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-gray-600 w-8 text-right">{task.progress}%</span>
                        </div>
                        {task.reminder && (
                          <div className="mt-2 flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span className="text-xs text-amber-700 font-medium">Reminder at {task.reminder.time}</span>
                            <button
                              onClick={() => handleToggleTaskReminder(task.id)}
                              className="ml-auto text-xs text-amber-600 hover:text-amber-700 font-bold"
                            >
                              {task.reminder.enabled ? '✓ On' : '✗ Off'}
                            </button>
                            <button
                              onClick={() => handleRemoveTaskReminder(task.id)}
                              className="text-xs text-gray-500 hover:text-gray-700 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Image Documentation</h4>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {['Before', 'In Progress', 'After'].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => handleUploadPhoto(stage)}
                        className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <div className="text-center">
                          <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">{stage}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => document.getElementById('photo-input')?.click()}
                      className="aspect-square bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-all"
                    >
                      <div className="text-center">
                        <Plus className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-blue-600">Add Photo</p>
                      </div>
                    </button>
                    <input
                      id="photo-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const newPhoto = {
                            id: executionPhotos.length + 1,
                            stage: 'Custom',
                            imageUrl: URL.createObjectURL(e.target.files[0]),
                            uploadedAt: new Date().toLocaleString()
                          }
                          setExecutionPhotos(prev => [newPhoto, ...prev])
                          addActivityLog('Photo Uploaded', 'Custom photo added to documentation')
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {executionPhotos.map((photo) => (
                      <div key={photo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                        <span className="font-medium text-gray-700">{photo.stage}</span>
                        <span className="text-gray-500">{photo.uploadedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Execution Notes */}
              <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Execution Notes</h4>
                <textarea
                  value={executionNotes}
                  onChange={(e) => setExecutionNotes(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add real-time notes about job execution..."
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSaveExecutionNotes}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
                    disabled={!executionNotes.trim()}
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              {/* Team Status & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Team Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Members</span>
                      <span className="text-2xl font-bold text-purple-600">{teamMembers.filter(m => m.status === 'Confirmed').length}/{teamMembers.length}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              member.status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">{member.name}</span>
                              <div className="text-xs text-gray-500">{member.role}</div>
                            </div>
                          </div>
                          <select
                            value={member.status}
                            onChange={(e) => handleTeamStatusChange(member.id, e.target.value)}
                            className="text-xs font-bold px-2 py-1 rounded border cursor-pointer bg-white"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Pending">Pending</option>
                            <option value="Left">Left</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Execution Summary</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Tasks Completed</span>
                      <span className="text-lg font-bold text-green-600">{executionTasks.filter(t => t.status === 'completed').length}/{executionTasks.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Photos Captured</span>
                      <span className="text-lg font-bold text-blue-600">{executionPhotos.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Notes Added</span>
                      <span className="text-lg font-bold text-purple-600">{activityLog.filter(a => a.action === 'Execution Notes').length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Overall Progress</span>
                      <span className="text-lg font-bold text-orange-600">{getTaskProgress()}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'completion' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Job Completion</h3>
                <span className="text-xs font-bold text-emerald-900 px-3 py-1 bg-emerald-100 rounded-full">Ready for Completion</span>
              </div>

              {/* Completion Checklist */}
              <div className="bg-linear-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 mb-6">
                <h4 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Completion Checklist
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { item: 'All tasks completed', status: true },
                    { item: 'Quality inspection passed', status: true },
                    { item: 'Equipment returned to storage', status: false },
                    { item: 'Site cleaned and secured', status: false },
                    { item: 'Client sign-off obtained', status: false },
                    { item: 'Final documentation uploaded', status: false }
                  ].map((check, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-200">
                      <input
                        type="checkbox"
                        checked={check.status}
                        onChange={(e) => {
                          // Handle completion checklist change
                          addActivityLog('Completion Checklist', `${check.item} ${e.target.checked ? 'completed' : 'unchecked'}`)
                        }}
                        className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-900">{check.item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Final Documentation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Client Sign-Off</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Downtown Business Tower</div>
                          <div className="text-xs text-gray-600">Client Representative</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">Signature required for job completion</div>
                      <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
                        Request Signature
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Quality Assurance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm text-green-900">Quality Score</span>
                      <span className="text-sm font-bold text-green-900">95/100</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-sm text-blue-900">Client Satisfaction</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Actions */}
              <div className="bg-linear-to-r from-emerald-50 to-green-50 border border-emerald-300 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-emerald-900 mb-4">Final Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-xl text-center transition-all hover:scale-105">
                    <CheckCircle className="w-6 h-6 text-emerald-700 mx-auto mb-2" />
                    <span className="text-sm font-bold text-emerald-900">Complete Job</span>
                  </button>
                  <button className="p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105">
                    <FileText className="w-6 h-6 text-blue-700 mx-auto mb-2" />
                    <span className="text-sm font-bold text-blue-900">Generate Report</span>
                  </button>
                  <Link
                    href={`/admin/finance/invoice-generator?jobId=${jobId}`}
                    className="p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all hover:scale-105"
                  >
                    <DollarSign className="w-6 h-6 text-purple-700 mx-auto mb-2" />
                    <span className="text-sm font-bold text-purple-900">Create Invoice</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Notes & Reminders Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Job Notes Section */}
              <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Job Notes & Reminders</h3>
                  <button
                    onClick={() => setShowJobNoteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Note</span>
                  </button>
                </div>

                {/* Notes */}
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Notes
                  </h4>
                  <div className="space-y-3">
                    {jobNotes.map((note) => (
                      <div key={note.id} className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm text-gray-900">{note.text}</div>
                            <div className="text-xs text-gray-600 mt-2">{note.author} • {note.timestamp}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveJobNote(note.id)}
                            className="text-gray-400 hover:text-red-600 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reminders */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-600" />
                      Reminders
                    </h4>
                    <button
                      onClick={() => setShowReminderModal(true)}
                      className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      Add Reminder
                    </button>
                  </div>
                  <div className="space-y-3">
                    {jobReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={reminder.enabled}
                            onChange={() => handleToggleReminder(reminder.id)}
                            className="rounded border-amber-300 text-amber-600"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{reminder.text}</div>
                            <div className="text-xs text-gray-600 mt-1">Remind at {reminder.remindAt}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveReminder(reminder.id)}
                          className="text-gray-400 hover:text-red-600 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Task Assignment Tab */}
          {activeTab === 'tasks' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Task Assignment</h3>
                <button
                  onClick={() => { setSelectedTask(null); setShowTaskAssignmentModal(true) }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Reassign Task</span>
                </button>
              </div>

              <div className="space-y-4">
                {taskAssignments.map((assignment, idx) => (
                  <div key={assignment.taskId} className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">{assignment.taskName}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">{assignment.assignedTo}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            assignment.status === 'completed' ? 'bg-emerald-200 text-emerald-800' :
                            assignment.status === 'in-progress' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {assignment.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTask(assignment);
                          setSelectedTeamMember(assignment.assignedTo);
                          setShowTaskAssignmentModal(true);
                        }}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-xs font-bold text-gray-700"
                      >
                        Change Assignment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Management Tab */}
          {activeTab === 'team' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Team Member Management</h3>
              <div className="space-y-5">
                {taskAssignments.map((assignment, idx) => (
                  <div key={assignment.taskId} className="bg-linear-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{assignment.taskName}</h4>
                        <div className="text-sm text-gray-700 mb-3">Currently assigned to: <span className="font-bold">{assignment.assignedTo}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={assignment.assignedTo}
                        onChange={(e) => handleReassignTeamMember(idx, e.target.value)}
                        className="flex-1 px-4 py-2 border border-purple-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select a team member...</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name} ({member.role})
                          </option>
                        ))}
                      </select>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium">
                        Replace Duty
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employee Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-8">Employee Report Tracking</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-300">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Employee</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Date</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Hours Worked</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Tasks Completed</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Status</th>
                        <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {employeeReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50 transition-all">
                          <td className="px-4 py-4 text-sm text-gray-900 font-medium">{report.employee}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{report.date}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{report.hoursWorked}h</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{report.tasksCompleted}</td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              report.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{report.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Compensation Tab */}
          {activeTab === 'compensation' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Team Compensation Analysis
              </h3>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                  <div className="text-sm font-medium text-green-700 mb-1">Total Job Cost</div>
                  <div className="text-3xl font-bold text-green-900">
                    AED {teamMembers.reduce((sum, m) => sum + m.totalCompensation, 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 mt-2">{teamMembers.length} team members</div>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="text-sm font-medium text-blue-700 mb-1">Average Rate/Hour</div>
                  <div className="text-3xl font-bold text-blue-900">
                    AED {Math.round(teamMembers.reduce((sum, m) => sum + m.hourlyRate, 0) / teamMembers.length)}
                  </div>
                  <div className="text-xs text-blue-600 mt-2">Across all roles</div>
                </div>
                <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                  <div className="text-sm font-medium text-purple-700 mb-1">Total Estimated Hours</div>
                  <div className="text-3xl font-bold text-purple-900">
                    {teamMembers.reduce((sum, m) => sum + m.estimatedHours, 0)} hrs
                  </div>
                  <div className="text-xs text-purple-600 mt-2">Project duration</div>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Team Member</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Role</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Hourly Rate</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Est. Hours</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Total Cost</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-all border-b border-gray-200">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{member.role}</td>
                        <td className="px-4 py-4 text-sm font-bold text-gray-900">AED {member.hourlyRate}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{member.estimatedHours}h</td>
                        <td className="px-4 py-4 text-sm font-bold text-green-600">AED {member.totalCompensation}</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            member.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comparison Chart */}
              <div className="mt-8 p-6 bg-linear-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-4">Cost Breakdown by Role</h4>
                <div className="space-y-4">
                  {teamMembers.map((member) => {
                    const totalCost = teamMembers.reduce((sum, m) => sum + m.totalCompensation, 0);
                    const percentage = Math.round((member.totalCompensation / totalCost) * 100);
                    return (
                      <div key={member.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{member.name} ({member.role})</span>
                          <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              member.role === 'Team Lead' ? 'bg-blue-600' :
                              member.role === 'Floor Specialist' ? 'bg-green-600' :
                              'bg-purple-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Employee Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-600" />
                Employee Feedback & Reviews
              </h3>

              {/* Filter Buttons */}
              <div className="flex gap-2 mb-8">
                <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-300 hover:bg-indigo-200">
                  All Feedback
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-300 hover:bg-gray-200">
                  Performance
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-300 hover:bg-gray-200">
                  Behavioral
                </button>
              </div>

              {/* Feedback Cards */}
              <div className="space-y-6">
                {employeeFeedback.map((feedback) => (
                  <div key={feedback.id} className="bg-linear-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{feedback.employee}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-gray-700">{feedback.rating}.0/5.0</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          feedback.category === 'performance' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                        </span>
                        <div className="text-xs text-gray-600 mt-2">{feedback.date}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{feedback.feedback}</p>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border border-gray-300 rounded-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {(employeeFeedback.reduce((sum, f) => sum + f.rating, 0) / employeeFeedback.length).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Avg. Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{employeeFeedback.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {employeeFeedback.filter(f => f.rating >= 4).length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Positive (4+)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{new Set(employeeFeedback.map(f => f.employee)).size}</div>
                  <div className="text-xs text-gray-600 mt-1">Team Members</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Team & History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Enhanced Team Section with Real-time Status */}
          <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                Team Status
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-600">{job.assignedTeam.filter(m => m.status === 'Confirmed').length}/{job.assignedTeam.length} Active</span>
                </div>
                <Link href={`/admin/jobs/${jobId}/assignment`} className="text-xs font-bold text-indigo-600 hover:underline">
                  Manage
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {job.assignedTeam.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-300 hover:bg-gray-100 transition-all">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white ${
                      member.status === 'Confirmed' ? 'bg-green-600' :
                      member.status === 'Pending' ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {member.status === 'Confirmed' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm font-bold text-gray-900">{member.name}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        member.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        member.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">{member.role}</div>
                    {member.checkInTime && (
                      <div className="flex items-center gap-3 text-[10px] text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Check-in: {member.checkInTime}</span>
                        </div>
                        {member.checkOutTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Check-out: {member.checkOutTime}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {job.status === 'In Progress' && !member.checkInTime && (
                      <div className="text-[10px] text-amber-600 font-medium">Awaiting check-in at site</div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                      <Phone className="w-3 h-3 text-gray-600" />
                    </button>
                    <button className="p-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                      <MessageCircle className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
              <Link
                href={`/admin/jobs/${jobId}/assignment`}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 text-sm font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Team Member
              </Link>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Attachments</h3>
            <div className="space-y-3">
              {job.attachments.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{file.name}</div>
                      <div className="text-[10px] text-gray-500">{file.size} • {file.type}</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* History Timeline */}
          <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-500" />
              Activity Log
            </h3>
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gray-300">
              {activityLog.map((event, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-3 top-1.5 w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]" />
                  <div className="text-xs font-bold text-gray-900 mb-1">{event.action}</div>
                  <div className="text-[10px] text-gray-600 mb-1">{event.timestamp} • {event.user}</div>
                  <div className="text-[10px] text-gray-500 italic">{event.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Update Job Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { status: 'Scheduled', label: 'Scheduled', color: 'bg-indigo-100 text-indigo-700', icon: Calendar },
                { status: 'In Progress', label: 'Start Job', color: 'bg-green-100 text-green-700', icon: PlayCircle },
                { status: 'Completed', label: 'Complete Job', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
                { status: 'Cancelled', label: 'Cancel Job', color: 'bg-red-100 text-red-700', icon: X }
              ].map((option) => (
                <button
                  key={option.status}
                  onClick={() => {
                    // Handle status update
                    setShowStatusModal(false)
                  }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    job.status === option.status
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${option.color.split(' ')[0]} ${option.color.split(' ')[1]}`}>
                    <option.icon className={`w-4 h-4 ${option.color.split(' ')[1]}`} />
                  </div>
                  <span className="font-bold text-gray-900">{option.label}</span>
                  {job.status === option.status && <CheckCircle className="w-4 h-4 text-indigo-600 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Notes</h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Enter your notes here..."
                className="w-full h-32 p-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle save notes
                    setShowNotesModal(false)
                    setNotesText('')
                  }}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Note Modal */}
      {showJobNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Job Note</h3>
              <button
                onClick={() => setShowJobNoteModal(false)}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <textarea
                value={newJobNote}
                onChange={(e) => setNewJobNote(e.target.value)}
                placeholder="Enter your note..."
                className="w-full h-32 p-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowJobNoteModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddJobNote}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Assignment Modal */}
      {showTaskAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Assign Task</h3>
              <button
                onClick={() => {
                  setShowTaskAssignmentModal(false);
                  setSelectedTask(null);
                }}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Task</label>
                <select
                  value={selectedTask?.id || ''}
                  onChange={(e) => {
                    const task = executionTasks.find(t => t.id === parseInt(e.target.value));
                    setSelectedTask(task);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a task...</option>
                  {executionTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.task}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Assign to Team Member</label>
                <select
                  value={selectedTeamMember}
                  onChange={(e) => setSelectedTeamMember(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a team member...</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowTaskAssignmentModal(false);
                    setSelectedTask(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTask}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                >
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedTaskForReminder ? 'Set Task Reminder' : 'Add Reminder'}
              </h3>
              <button
                onClick={() => {
                  setShowReminderModal(false);
                  setSelectedTaskForReminder(null);
                }}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-6">
              {selectedTaskForReminder ? (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="text-sm font-medium text-blue-900">Task</div>
                    <div className="text-sm font-bold text-gray-900 mt-1">{selectedTaskForReminder.task}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Reminder Time</label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setShowReminderModal(false);
                        setSelectedTaskForReminder(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleAddTaskReminder(selectedTaskForReminder.id);
                      }}
                      className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all"
                    >
                      Set Reminder
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Reminder Message</label>
                    <textarea
                      value={reminderText}
                      onChange={(e) => setReminderText(e.target.value)}
                      placeholder="What should you be reminded about?"
                      className="w-full h-24 p-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Reminder Time</label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowReminderModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddReminder}
                      className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all"
                    >
                      Create Reminder
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function JobDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <JobDetailContent />
    </Suspense>
  )
}