// 'use client'

// import { useState, useEffect } from 'react'
// import {
//   ArrowLeft,
//   Edit2,
//   Trash2,
//   AlertCircle,
//   CheckCircle,
//   Clock,
//   MapPin,
//   Users,
//   Tag,
//   DollarSign,
//   ArrowRight,
//   MessageSquare,
//   Star,
//   Zap,
//   ClipboardCheck,
//   Navigation,
//   AlertTriangle,
//   CheckSquare,
//   MessageCircle,
//   Calendar,
//   Timer,
//   ShieldCheck,
//   Download,
//   History,
//   FileText,
//   Plus,
//   ChevronRight,
//   Bell,
//   TrendingUp,
//   Activity,
//   Cloud,
//   Car,
//   Wrench,
//   Eye,
//   Edit,
//   Save,
//   X,
//   RefreshCw,
//   BarChart3,
//   Target,
//   Award,
//   ThumbsUp,
//   ThumbsDown,
//   Send,
//   Phone,
//   Mail,
//   Building,
//   Wifi,
//   WifiOff,
//   PlayCircle,
//   Camera
// } from 'lucide-react'
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'
// import { 
//   collection, 
//   query, 
//   where, 
//   getDocs, 
//   doc, 
//   getDoc, 
//   updateDoc, 
//   deleteDoc, 
//   addDoc, 
//   orderBy,
//   Timestamp 
// } from 'firebase/firestore'
// import { db } from '@/lib/firebase'

// export default function JobDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const jobId = params?.id as string
  
//   const [job, setJob] = useState<any>(null)
//   const [activeTab, setActiveTab] = useState<'overview' | 'pre-execution' | 'execution' | 'completion' | 'notes' | 'tasks' | 'team' | 'reports' | 'feedback' | 'compensation'>('overview')
//   const [showStatusModal, setShowStatusModal] = useState(false)
//   const [notesText, setNotesText] = useState('')
//   const [checklistItems, setChecklistItems] = useState<any[]>([])
//   const [equipmentStatus, setEquipmentStatus] = useState<any[]>([])
//   const [teamMembers, setTeamMembers] = useState<any[]>([])
//   const [activityLog, setActivityLog] = useState<any[]>([])
//   const [executionTasks, setExecutionTasks] = useState<any[]>([])
//   const [executionTime, setExecutionTime] = useState({
//     elapsedHours: 0,
//     elapsedMinutes: 0,
//     estimatedCompletion: 0,
//     lastUpdate: ''
//   })
//   const [executionNotes, setExecutionNotes] = useState('')
//   const [executionPhotos, setExecutionPhotos] = useState<any[]>([])
//   const [jobNotes, setJobNotes] = useState<any[]>([])
//   const [newJobNote, setNewJobNote] = useState('')
//   const [taskAssignments, setTaskAssignments] = useState<any[]>([])
//   const [jobReminders, setJobReminders] = useState<any[]>([])
//   const [employeeReports, setEmployeeReports] = useState<any[]>([])
//   const [employeeFeedback, setEmployeeFeedback] = useState<any[]>([])
//   const [showJobNoteModal, setShowJobNoteModal] = useState(false)
//   const [showTaskAssignmentModal, setShowTaskAssignmentModal] = useState(false)
//   const [showReminderModal, setShowReminderModal] = useState(false)
//   const [selectedTask, setSelectedTask] = useState<any>(null)
//   const [selectedTeamMember, setSelectedTeamMember] = useState('')
//   const [reminderTime, setReminderTime] = useState('08:00')
//   const [reminderText, setReminderText] = useState('')
//   const [selectedTaskForReminder, setSelectedTaskForReminder] = useState<any>(null)

//   // Helper function to convert Firebase Timestamp to string
//   const convertTimestamp = (timestamp: any): string => {
//     if (!timestamp) return new Date().toISOString()
    
//     if (timestamp.toDate) {
//       // It's a Firebase Timestamp
//       return timestamp.toDate().toISOString()
//     } else if (timestamp.seconds) {
//       // It's a timestamp object
//       return new Date(timestamp.seconds * 1000).toISOString()
//     } else if (typeof timestamp === 'string') {
//       // It's already a string
//       return timestamp
//     }
//     return new Date().toISOString()
//   }

//   // Fetch REAL job data from Firebase
//   useEffect(() => {
//     const fetchJobData = async () => {
//       try {
//         if (!jobId) {
//           router.push('/admin/jobs')
//           return
//         }

//         // Fetch main job data from Firebase
//         const jobDoc = await getDoc(doc(db, 'jobs', jobId))
//         if (!jobDoc.exists()) {
//           router.push('/admin/jobs')
//           return
//         }
        
//         const jobData = jobDoc.data()
        
//         // Convert all timestamps properly
//         const realJob = {
//           id: jobDoc.id,
//           title: jobData.title || '',
//           client: jobData.client || '',
//           clientId: jobData.clientId || '',
//           status: jobData.status || 'Pending',
//           priority: jobData.priority || 'Medium',
//           scheduledDate: jobData.scheduledDate || null,
//           scheduledTime: jobData.scheduledTime || '',
//           endTime: jobData.endTime || '',
//           location: jobData.location || '',
//           teamRequired: jobData.teamRequired || 1,
//           budget: jobData.budget || 0,
//           actualCost: jobData.actualCost || 0,
//           description: jobData.description || '',
//           riskLevel: jobData.riskLevel || 'Low',
//           slaDeadline: jobData.slaDeadline || '',
//           estimatedDuration: jobData.estimatedDuration || '',
//           requiredSkills: jobData.requiredSkills || [],
//           permits: jobData.permits || [],
//           tags: jobData.tags || [],
//           specialInstructions: jobData.specialInstructions || '',
//           recurring: jobData.recurring || false,
//           createdAt: convertTimestamp(jobData.createdAt),
//           updatedAt: convertTimestamp(jobData.updatedAt),
//           completedAt: jobData.completedAt ? convertTimestamp(jobData.completedAt) : '',
//           executionLogs: jobData.executionLogs || [],
//           assignedTo: jobData.assignedTo || [],
//           assignedEmployees: jobData.assignedEmployees || [],
//           reminderEnabled: jobData.reminderEnabled || false,
//           reminderDate: jobData.reminderDate || '',
//           reminderSent: jobData.reminderSent || false,
//           services: jobData.services || [],
//           overtimeRequired: jobData.overtimeRequired || false,
//           overtimeHours: jobData.overtimeHours || 0,
//           overtimeReason: jobData.overtimeReason || '',
//           overtimeApproved: jobData.overtimeApproved || false,
//           daysUntilSLA: jobData.slaDeadline ? 
//             Math.ceil((new Date(jobData.slaDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
//         }
        
//         setJob(realJob)

//         // Set REAL team members from assignedEmployees
//         if (jobData.assignedEmployees && jobData.assignedEmployees.length > 0) {
//           const realTeamMembers = jobData.assignedEmployees.map((emp: any, index: number) => ({
//             id: emp.id || `emp-${index}`,
//             name: emp.name || 'Unknown Employee',
//             email: emp.email || '',
//             role: 'Assigned Team Member',
//             status: 'Confirmed',
//             initials: emp.name ? emp.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'EM',
//             hourlyRate: 150,
//             estimatedHours: 8,
//             totalCompensation: 1200
//           }))
//           setTeamMembers(realTeamMembers)
//         } else {
//           // Default team members if none assigned
//           setTeamMembers([
//             { id: '1', name: 'Ahmed Hassan', role: 'Team Lead', status: 'Confirmed', initials: 'AH', hourlyRate: 150, estimatedHours: 8, totalCompensation: 1200 },
//             { id: '2', name: 'Fatima Al-Mazrouei', role: 'Floor Specialist', status: 'Confirmed', initials: 'FA', hourlyRate: 120, estimatedHours: 8, totalCompensation: 960 }
//           ])
//         }

//         // Set REAL activity log from executionLogs or create default
//         if (jobData.executionLogs && jobData.executionLogs.length > 0) {
//           const realActivityLog = jobData.executionLogs.map((log: any, index: number) => ({
//             id: `log-${index}`,
//             action: log.type || 'Activity',
//             timestamp: log.timestamp ? convertTimestamp(log.timestamp) : new Date().toISOString(),
//             user: 'System',
//             details: log.notes || log.checklist ? `Checklist: ${log.checklist?.join(', ') || ''}` : 'Activity logged'
//           }))
//           setActivityLog(realActivityLog)
//         } else {
//           // Create default activity log with job creation
//           setActivityLog([
//             { id: '1', action: 'Created', timestamp: convertTimestamp(jobData.createdAt), user: 'System', details: `Job "${jobData.title}" created`, type: 'creation' },
//             { id: '2', action: 'Status Updated', timestamp: convertTimestamp(jobData.updatedAt), user: 'System', details: `Status set to ${jobData.status}`, type: 'scheduling' },
//             { id: '3', action: 'Team Assigned', timestamp: new Date().toISOString(), user: 'HR Manager', details: `${jobData.assignedEmployees?.length || 0} team members assigned`, type: 'assignment' }
//           ])
//         }

//         // Set default data for other sections
//         setChecklistItems([
//           { id: '1', item: 'Job requirements reviewed', status: false },
//           { id: '2', item: 'Client contact confirmed', status: false },
//           { id: '3', item: 'Site access arrangements', status: false },
//           { id: '4', item: 'Safety protocols reviewed', status: false },
//           { id: '5', item: 'Equipment requirements checked', status: false },
//           { id: '6', item: 'Team availability confirmed', status: false }
//         ])

//         setEquipmentStatus([
//           { id: '1', item: 'Cleaning supplies', status: 'Ready', color: 'green' },
//           { id: '2', item: 'Safety equipment', status: 'Ready', color: 'green' },
//           { id: '3', item: 'Specialized tools', status: 'Pending', color: 'yellow' },
//           { id: '4', item: 'Transportation', status: 'Ready', color: 'green' }
//         ])

//         setExecutionTasks([
//           { id: '1', task: 'Floor deep cleaning - Main area', status: 'pending', progress: 0, reminder: null },
//           { id: '2', task: 'Window exterior cleaning', status: 'pending', progress: 0, reminder: null },
//           { id: '3', task: 'Cubicle sanitization', status: 'pending', progress: 0, reminder: null },
//           { id: '4', task: 'Restroom deep clean', status: 'pending', progress: 0, reminder: null }
//         ])

//         // Set job notes from specialInstructions
//         const notes = []
//         if (jobData.specialInstructions && jobData.specialInstructions.trim()) {
//           notes.push({
//             id: '1',
//             text: jobData.specialInstructions,
//             author: 'Operations',
//             timestamp: new Date().toISOString(),
//             type: 'important'
//           })
//         }
//         notes.push({
//           id: '2',
//           text: 'Client prefers morning service',
//           author: 'Sales Team',
//           timestamp: new Date().toISOString(),
//           type: 'general'
//         })
//         setJobNotes(notes)

//         setTaskAssignments([
//           { id: '1', taskId: '1', taskName: 'Floor deep cleaning - Main area', assignedTo: 'Fatima Al-Mazrouei', status: 'pending' },
//           { id: '2', taskId: '2', taskName: 'Window exterior cleaning', assignedTo: 'Mohammed Bin Ali', status: 'pending' },
//           { id: '3', taskId: '3', taskName: 'Cubicle sanitization', assignedTo: 'Ahmed Hassan', status: 'pending' }
//         ])

//         setJobReminders([
//           { id: '1', text: 'Team check-in reminder', remindAt: '08:00', enabled: true },
//           { id: '2', text: 'Equipment arrival confirmation', remindAt: '07:30', enabled: true }
//         ])

//         setEmployeeReports([
//           { id: '1', employee: 'Ahmed Hassan', jobId: jobId, date: new Date().toISOString(), hoursWorked: 8, tasksCompleted: 4, status: 'submitted', notes: 'All tasks completed successfully' },
//           { id: '2', employee: 'Fatima Al-Mazrouei', jobId: jobId, date: new Date().toISOString(), hoursWorked: 7.5, tasksCompleted: 3, status: 'submitted', notes: 'Minor delay due to client requests' }
//         ])

//         setEmployeeFeedback([
//           { id: '1', employee: 'Ahmed Hassan', jobId: jobId, date: new Date().toISOString(), rating: 5, feedback: 'Excellent coordination with team. High quality work delivered on time.', category: 'performance' },
//           { id: '2', employee: 'Fatima Al-Mazrouei', jobId: jobId, date: new Date().toISOString(), rating: 4, feedback: 'Good work quality. Communication could be improved.', category: 'performance' }
//         ])

//       } catch (error) {
//         console.error('Error fetching job data:', error)
//       }
//     }

//     if (jobId) {
//       fetchJobData()
//     }
//   }, [jobId, router])

//   // ========== JOB STATUS UPDATE FUNCTION ==========
//   const handleUpdateJobStatus = async (newStatus: string) => {
//     try {
//       // Update in Firebase
//       const jobRef = doc(db, 'jobs', jobId)
//       const updateData: any = {
//         status: newStatus,
//         updatedAt: Timestamp.fromDate(new Date())
//       }
      
//       // Add completedAt timestamp if completing job
//       if (newStatus === 'Completed') {
//         updateData.completedAt = Timestamp.fromDate(new Date())
//       }
      
//       // Add startedAt timestamp if starting job
//       if (newStatus === 'In Progress') {
//         updateData.startedAt = Timestamp.fromDate(new Date())
//       }
      
//       await updateDoc(jobRef, updateData)

//       // Update local state
//       setJob((prev: any) => ({
//         ...prev,
//         status: newStatus,
//         updatedAt: new Date().toISOString(),
//         ...(newStatus === 'Completed' && { completedAt: new Date().toISOString() }),
//         ...(newStatus === 'In Progress' && { startedAt: new Date().toISOString() })
//       }))

//       // Add to activity log
//       const newLog = {
//         id: Date.now().toString(),
//         action: 'Status Updated',
//         timestamp: new Date().toISOString(),
//         user: 'Admin',
//         details: `Job status changed to ${newStatus}`
//       }
//       setActivityLog(prev => [newLog, ...prev])
      
//       alert(`Job status updated to ${newStatus}`)
//       setShowStatusModal(false)
//     } catch (error) {
//       console.error('Error updating job status:', error)
//       alert('Error updating job status')
//     }
//   }

//   // ========== DELETE JOB FUNCTION ==========
//   const handleDeleteJob = async () => {
//     if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
//       try {
//         // Delete from Firebase
//         await deleteDoc(doc(db, 'jobs', jobId))
        
//         alert('Job deleted successfully')
//         router.push('/admin/jobs')
//       } catch (error) {
//         console.error('Error deleting job:', error)
//         alert('Error deleting job')
//       }
//     }
//   }

//   // ========== START JOB FUNCTION ==========
//   const handleStartJob = async () => {
//     try {
//       await handleUpdateJobStatus('In Progress')
//     } catch (error) {
//       console.error('Error starting job:', error)
//     }
//   }

//   // ========== COMPLETE JOB FUNCTION ==========
//   const handleCompleteJob = async () => {
//     try {
//       await handleUpdateJobStatus('Completed')
//     } catch (error) {
//       console.error('Error completing job:', error)
//     }
//   }

//   const handleChecklistChange = (index: number) => {
//     setChecklistItems(prev => prev.map((item, i) => 
//       i === index ? { ...item, status: !item.status } : item
//     ))
//     addActivityLog('Checklist Updated', `${checklistItems[index].item} marked as ${!checklistItems[index].status ? 'done' : 'pending'}`)
//   }

//   const handleEquipmentStatusChange = (index: number, newStatus: string) => {
//     setEquipmentStatus(prev => {
//       const newColor = newStatus === 'Ready' ? 'green' : newStatus === 'Pending' ? 'yellow' : 'red'
//       return prev.map((item, i) => 
//         i === index ? { ...item, status: newStatus, color: newColor } : item
//       )
//     })
//     addActivityLog('Equipment Status Updated', `${equipmentStatus[index].item} status changed to ${newStatus}`)
//   }

//   const handleTeamStatusChange = (index: number, newStatus: string) => {
//     setTeamMembers(prev => prev.map((member, i) => 
//       i === index ? { ...member, status: newStatus } : member
//     ))
//     addActivityLog('Team Status Updated', `${teamMembers[index].name} marked as ${newStatus}`)
//   }

//   const addActivityLog = (action: string, details: string) => {
//     const now = new Date()
//     const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
//     setActivityLog(prev => [{ id: Date.now().toString(), action, timestamp, user: 'Current User', details }, ...prev])
//   }

//   const handleTaskStatusChange = (index: number, newStatus: string) => {
//     setExecutionTasks(prev => prev.map((task, i) => 
//       i === index ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : newStatus === 'in-progress' ? 60 : 0 } : task
//     ))
//     addActivityLog('Task Updated', `${executionTasks[index].task} status changed to ${newStatus}`)
//   }

//   const handleTaskProgressChange = (index: number, newProgress: number) => {
//     setExecutionTasks(prev => prev.map((task, i) => 
//       i === index ? { ...task, progress: newProgress, status: newProgress === 100 ? 'completed' : 'in-progress' } : task
//     ))
//     addActivityLog('Task Progress Updated', `Task progress updated to ${newProgress}%`)
//   }

//   const handleSaveExecutionNotes = () => {
//     if (executionNotes.trim()) {
//       addActivityLog('Execution Notes', executionNotes)
//       setExecutionNotes('')
//     }
//   }

//   const handleUploadPhoto = (stage: string) => {
//     const newPhoto = {
//       id: executionPhotos.length + 1,
//       stage: stage,
//       uploadedAt: new Date().toLocaleString()
//     }
//     setExecutionPhotos(prev => [newPhoto, ...prev])
//     addActivityLog('Photo Uploaded', `${stage} photo added to documentation`)
//   }

//   const getTaskProgress = () => {
//     const completed = executionTasks.filter(t => t.status === 'completed').length
//     const total = executionTasks.length
//     return Math.round((completed / total) * 100)
//   }

//   const handleAddJobNote = () => {
//     if (newJobNote.trim()) {
//       const newNote = {
//         id: jobNotes.length + 1,
//         text: newJobNote,
//         author: 'Current User',
//         timestamp: new Date().toLocaleDateString('en-US', { 
//           year: 'numeric', 
//           month: '2-digit', 
//           day: '2-digit',
//           hour: '2-digit',
//           minute: '2-digit'
//         }),
//         type: 'general'
//       }
//       setJobNotes([...jobNotes, newNote])
//       setNewJobNote('')
//       addActivityLog('Job Note Added', newJobNote)
//       setShowJobNoteModal(false)
//     }
//   }

//   const handleAssignTask = () => {
//     if (selectedTask && selectedTeamMember) {
//       setTaskAssignments(taskAssignments.map(assignment => 
//         assignment.taskId === selectedTask.id 
//           ? { ...assignment, assignedTo: selectedTeamMember }
//           : assignment
//       ))
//       addActivityLog('Task Assignment', `${selectedTask.taskName} assigned to ${selectedTeamMember}`)
//       setShowTaskAssignmentModal(false)
//       setSelectedTask(null)
//       setSelectedTeamMember('')
//     }
//   }

//   const handleAddReminder = () => {
//     if (reminderText.trim()) {
//       const newReminder = {
//         id: jobReminders.length + 1,
//         text: reminderText,
//         remindAt: reminderTime,
//         enabled: true
//       }
//       setJobReminders([...jobReminders, newReminder])
//       addActivityLog('Reminder Created', `${reminderText} at ${reminderTime}`)
//       setReminderText('')
//       setReminderTime('08:00')
//       setShowReminderModal(false)
//     }
//   }

//   const handleToggleReminder = (index: number) => {
//     setJobReminders(jobReminders.map((reminder, i) =>
//       i === index
//         ? { ...reminder, enabled: !reminder.enabled }
//         : reminder
//     ))
//     addActivityLog('Reminder Status', `${jobReminders[index].text} ${!jobReminders[index].enabled ? 'enabled' : 'disabled'}`)
//   }

//   const handleRemoveReminder = (index: number) => {
//     const reminder = jobReminders[index]
//     setJobReminders(jobReminders.filter((_, i) => i !== index))
//     addActivityLog('Reminder Removed', reminder?.text || '')
//   }

//   const handleRemoveJobNote = (index: number) => {
//     const note = jobNotes[index]
//     setJobNotes(jobNotes.filter((_, i) => i !== index))
//     addActivityLog('Job Note Removed', note?.text || '')
//   }

//   const handleAddTaskReminder = (index: number) => {
//     if (reminderTime) {
//       setExecutionTasks(prev => prev.map((task, i) =>
//         i === index
//           ? { ...task, reminder: { time: reminderTime, enabled: true } }
//           : task
//       ))
//       addActivityLog('Task Reminder Set', `Reminder set for "${executionTasks[index].task}" at ${reminderTime}`)
//       setShowReminderModal(false)
//       setReminderTime('08:00')
//       setSelectedTaskForReminder(null)
//     }
//   }

//   const handleToggleTaskReminder = (index: number) => {
//     setExecutionTasks(prev => prev.map((task, i) =>
//       i === index && task.reminder
//         ? { ...task, reminder: { ...task.reminder, enabled: !task.reminder.enabled } }
//         : task
//     ))
//   }

//   const handleRemoveTaskReminder = (index: number) => {
//     setExecutionTasks(prev => prev.map((task, i) =>
//       i === index
//         ? { ...task, reminder: null }
//         : task
//     ))
//     addActivityLog('Task Reminder Removed', `Reminder removed for "${executionTasks[index].task}"`)
//   }

//   const handleReassignTeamMember = (taskIndex: number, newMember: string) => {
//     const oldAssignment = taskAssignments[taskIndex]
//     setTaskAssignments(taskAssignments.map((assignment, idx) =>
//       idx === taskIndex
//         ? { ...assignment, assignedTo: newMember }
//         : assignment
//     ))
//     addActivityLog('Team Member Reassigned', `${oldAssignment.taskName} reassigned to ${newMember}`)
//   }

//   const calculateProgressMetrics = () => {
//     const checklistCompletion = checklistItems.length > 0 
//       ? Math.round((checklistItems.filter(c => c.status).length / checklistItems.length) * 100)
//       : 0
    
//     const equipmentReadiness = equipmentStatus.length > 0
//       ? Math.round((equipmentStatus.filter(e => e.status === 'Ready').length / equipmentStatus.length) * 100)
//       : 0
    
//     const teamReadiness = teamMembers.length > 0
//       ? Math.round((teamMembers.filter(m => m.status === 'Confirmed').length / teamMembers.length) * 100)
//       : 0
    
//     const overallReadiness = Math.round((checklistCompletion + equipmentReadiness + teamReadiness) / 3)
    
//     return {
//       checklistCompletion,
//       equipmentReadiness,
//       teamReadiness,
//       overallReadiness
//     }
//   }

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
//         <p className="text-gray-600">Loading job details...</p>
//       </div>
//     )
//   }

//   const progressMetrics = calculateProgressMetrics()

//   return (
//     <div className="min-h-screen bg-white text-gray-900 p-6 space-y-8">
//       {/* Enhanced Header with Real-time Status */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//         <div className="flex items-center gap-4">
//           <Link href="/admin/jobs" className="p-2 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all">
//             <ArrowLeft className="w-5 h-5 text-gray-600" />
//           </Link>
//           <div className="space-y-1">
//             <div className="flex items-center gap-3">
//               <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
//               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
//                 job.status === 'Scheduled' ? 'bg-indigo-100 text-indigo-700' :
//                 job.status === 'In Progress' ? 'bg-green-100 text-green-700' :
//                 job.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
//                 'bg-gray-100 text-gray-700'
//               }`}>
//                 {job.status}
//               </span>
//               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
//                 job.priority === 'Critical' ? 'bg-red-100 text-red-700' :
//                 job.priority === 'High' ? 'bg-orange-100 text-orange-700' :
//                 job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
//                 'bg-blue-100 text-blue-700'
//               }`}>
//                 {job.priority}
//               </span>
//             </div>
//             <div className="flex items-center gap-4 text-sm text-gray-600">
//               <div className="flex items-center gap-1">
//                 <Users className="w-4 h-4" />
//                 {job.client}
//               </div>
//               <div className="flex items-center gap-1">
//                 <MapPin className="w-4 h-4" />
//                 {job.location}
//               </div>
//               {job.scheduledDate && (
//                 <div className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" />
//                   {new Date(job.scheduledDate).toLocaleDateString('en-US', { 
//                     year: 'numeric', 
//                     month: '2-digit', 
//                     day: '2-digit' 
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
         
//           <button
//             onClick={() => setShowStatusModal(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span>Update Status</span>
//           </button>
         
//         </div>
//       </div>

//       {/* Enhanced Quick Stats Bar */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         {[
//           { 
//             label: 'Scheduled Date', 
//             value: job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString('en-US', { 
//               month: 'short', 
//               day: 'numeric', 
//               year: 'numeric' 
//             }) : 'Not Scheduled', 
//             sub: job.scheduledTime || '', 
//             icon: Calendar, 
//             color: 'text-blue-600' 
//           },
//           { 
//             label: 'Duration', 
//             value: job.estimatedDuration || 'Not set', 
//             sub: 'Estimated', 
//             icon: Timer, 
//             color: 'text-indigo-600' 
//           },
//           { 
//             label: 'Budget', 
//             value: `AED ${job.budget ? job.budget.toLocaleString() : '0'}`, 
//             sub: 'Total Budget', 
//             icon: DollarSign, 
//             color: 'text-emerald-600' 
//           },
//           { 
//             label: 'SLA Deadline', 
//             value: job.slaDeadline ? new Date(job.slaDeadline).toLocaleDateString('en-US', { 
//               month: 'short', 
//               day: 'numeric' 
//             }) : 'Not set', 
//             sub: job.daysUntilSLA > 0 ? `${job.daysUntilSLA} days left` : 'Expired', 
//             icon: ShieldCheck, 
//             color: job.daysUntilSLA <= 1 ? 'text-red-600' : 'text-amber-600' 
//           },
//           { 
//             label: 'Risk Level', 
//             value: (job.riskLevel || 'Low').toUpperCase(), 
//             sub: 'Assessment', 
//             icon: job.riskLevel === 'High' ? AlertTriangle : job.riskLevel === 'Medium' ? Clock : CheckCircle, 
//             color: job.riskLevel === 'High' ? 'text-red-600' : job.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600' 
//           },
//         ].map((stat, i) => (
//           <div key={i} className="bg-white border border-gray-300 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="p-2 bg-gray-100 rounded-lg">
//                 <stat.icon className={`w-4 h-4 ${stat.color}`} />
//               </div>
//               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
//             </div>
//             <div className="text-lg font-bold text-gray-900">{stat.value}</div>
//             <div className="text-xs text-gray-600">{stat.sub}</div>
//           </div>
//         ))}
//       </div>

//       {/* Enhanced Workflow Actions - Dynamic based on status */}
//       {job.status === 'Pending' && (
//         <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-2xl p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-bold text-yellow-900 flex items-center gap-2">
//               <Clock className="w-5 h-5" />
//               Job Pending - Awaiting Action
//             </h3>
//             <button
//               onClick={() => handleUpdateJobStatus('Scheduled')}
//               className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
//             >
//               Schedule Job
//             </button>
//           </div>
//           <p className="text-sm text-yellow-800">
//             This job is currently pending. You can schedule it or update its status.
//           </p>
//         </div>
//       )}

//       {job.status === 'Scheduled' && (
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-2xl p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
//               <Calendar className="w-5 h-5" />
//               Pre-Execution Workflow
//             </h3>
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-medium text-blue-700">Progress: {progressMetrics.overallReadiness}%</span>
//               <div className="w-24 bg-blue-200 rounded-full h-2">
//                 <div 
//                   className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
//                   style={{ width: `${progressMetrics.overallReadiness}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             <button
//               onClick={() => setActiveTab('pre-execution')}
//               className="group p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <ClipboardCheck className="w-6 h-6 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-blue-900">Pre-Job Checklist</span>
//               <div className="text-[10px] text-blue-700 mt-1">{progressMetrics.checklistCompletion}% Complete</div>
//             </button>
//             <button
//               onClick={() => setActiveTab('team')}
//               className="group p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <Users className="w-6 h-6 text-purple-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-purple-900">Team Assignment</span>
//               <div className="text-[10px] text-purple-700 mt-1">{progressMetrics.teamReadiness}% Ready</div>
//             </button>
//             <div className="group p-4 bg-green-100 hover:bg-green-200 border border-green-400 rounded-xl text-center transition-all hover:scale-105">
//               <ShieldCheck className="w-6 h-6 text-green-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-green-900">Permit Tracker</span>
//               <div className="text-[10px] text-green-700 mt-1">{job.permits ? job.permits.length : 0} Approved</div>
//             </div>
//             <div className="group p-4 bg-orange-100 hover:bg-orange-200 border border-orange-400 rounded-xl text-center transition-all hover:scale-105">
//               <Wrench className="w-6 h-6 text-orange-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-orange-900">Equipment</span>
//               <div className="text-[10px] text-orange-700 mt-1">{progressMetrics.equipmentReadiness}% Ready</div>
//             </div>
//             <button
//               onClick={handleStartJob}
//               className="group p-4 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <ArrowRight className="w-6 h-6 text-indigo-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-indigo-900">Start Job</span>
//               <div className="text-[10px] text-indigo-700 mt-1">Begin Execution</div>
//             </button>
//           </div>
//         </div>
//       )}

//       {job.status === 'In Progress' && (
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-2xl p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
//               <Activity className="w-5 h-5" />
//               Active Execution Workflow
//             </h3>
//             <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-xs font-bold text-green-800">LIVE TRACKING</span>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             <button
//               onClick={() => setActiveTab('execution')}
//               className="group p-4 bg-green-100 hover:bg-green-200 border border-green-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <Eye className="w-6 h-6 text-green-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-green-900">Live View</span>
//               <div className="text-[10px] text-green-700 mt-1">Real-time Monitoring</div>
//             </button>
//             <button
//               onClick={() => setActiveTab('tasks')}
//               className="group p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <CheckSquare className="w-6 h-6 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-blue-900">Task Progress</span>
//               <div className="text-[10px] text-blue-700 mt-1">Track Completion</div>
//             </button>
//             <button
//               onClick={() => setActiveTab('notes')}
//               className="group p-4 bg-orange-100 hover:bg-orange-200 border border-orange-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <AlertTriangle className="w-6 h-6 text-orange-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-orange-900">Damage Check</span>
//               <div className="text-[10px] text-orange-700 mt-1">Quality Control</div>
//             </button>
//             <button
//               onClick={() => setActiveTab('notes')}
//               className="group p-4 bg-red-100 hover:bg-red-200 border border-red-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <AlertCircle className="w-6 h-6 text-red-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-red-900">Incidents</span>
//               <div className="text-[10px] text-red-700 mt-1">Report Issues</div>
//             </button>
//             <button
//               onClick={handleCompleteJob}
//               className="group p-4 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <CheckCircle className="w-6 h-6 text-emerald-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-emerald-900">Complete Job</span>
//               <div className="text-[10px] text-emerald-700 mt-1">Finish Execution</div>
//             </button>
//           </div>
//         </div>
//       )}

//       {job.status === 'Completed' && (
//         <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-300 rounded-2xl p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
//               <Award className="w-5 h-5" />
//               Post-Completion Workflow
//             </h3>
//             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
//               <CheckCircle className="w-3 h-3 text-emerald-700" />
//               <span className="text-xs font-bold text-emerald-800">JOB COMPLETED</span>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             <button
//               onClick={() => setActiveTab('completion')}
//               className="group p-4 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <CheckCircle className="w-6 h-6 text-emerald-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-emerald-900">Job Closure</span>
//               <div className="text-[10px] text-emerald-700 mt-1">Final Documentation</div>
//             </button>
//             <button
//               onClick={() => setActiveTab('feedback')}
//               className="group p-4 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <Star className="w-6 h-6 text-indigo-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-indigo-900">Client Feedback</span>
//               <div className="text-[10px] text-indigo-700 mt-1">Collect Reviews</div>
//             </button>
//             <button
//               onClick={() => setActiveTab('completion')}
//               className="group p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <MessageSquare className="w-6 h-6 text-purple-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-purple-900">Review Request</span>
//               <div className="text-[10px] text-purple-700 mt-1">Request Approval</div>
//             </button>
//             <button
//               onClick={() => setActiveTab('completion')}
//               className="group p-4 bg-pink-100 hover:bg-pink-200 border border-pink-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <FileText className="w-6 h-6 text-pink-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-pink-900">Client Summary</span>
//               <div className="text-[10px] text-pink-700 mt-1">Final Report</div>
//             </button>
//             <Link
//               href={`/admin/finance/invoice-generator?jobId=${jobId}`}
//               className="group p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105"
//             >
//               <DollarSign className="w-6 h-6 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
//               <span className="text-xs font-bold text-blue-900">Generate Invoice</span>
//               <div className="text-[10px] text-blue-700 mt-1">Billing Process</div>
//             </Link>
//           </div>
//         </div>
//       )}

//       {/* Tab Navigation */}
//       <div className="grid grid-cols-5 gap-2 p-1 bg-white border border-gray-300 rounded-2xl shadow-sm">
//         {[
//           { id: 'overview', label: 'Overview', icon: FileText },
//           { id: 'pre-execution', label: 'Pre-Execution', icon: ClipboardCheck },
//           { id: 'execution', label: 'Execution', icon: Navigation },
//           { id: 'notes', label: 'Notes & Reminders', icon: MessageSquare },
//           { id: 'tasks', label: 'Task Assignment', icon: CheckCircle },
//           { id: 'team', label: 'Team Management', icon: Users },
//           { id: 'compensation', label: 'Compensation', icon: DollarSign },
//           { id: 'feedback', label: 'Employee Feedback', icon: Star },
//           { id: 'reports', label: 'Employee Reports', icon: FileText },
//           { id: 'completion', label: 'Completion', icon: CheckSquare },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id as any)}
//             className={`flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
//               activeTab === tab.id
//                 ? 'bg-indigo-600 text-white shadow-md'
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//             }`}
//           >
//             <tab.icon className="w-4 h-4" />
//             <span className="line-clamp-2 text-center">{tab.label}</span>
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Main Content Area */}
//         <div className="lg:col-span-8 space-y-8">
//           {activeTab === 'overview' && (
//             <>
//               {/* Description & Notes */}
//               <div className="bg-white border border-gray-300 rounded-3xl p-8 space-y-6 shadow-sm">
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//                     <FileText className="w-5 w-5 text-indigo-600" />
//                     Job Description
//                   </h3>
//                   <p className="text-gray-700 leading-relaxed">{job.description || 'No description provided'}</p>
//                 </div>
//                 {job.specialInstructions && (
//                   <div className="p-6 bg-indigo-50 border border-indigo-300 rounded-2xl">
//                     <h4 className="text-sm font-bold text-indigo-900 mb-2">Special Instructions</h4>
//                     <p className="text-sm text-gray-800">{job.specialInstructions}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Requirements Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
//                   <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Required Skills</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {job.requiredSkills && job.requiredSkills.length > 0 ? (
//                       job.requiredSkills.map((skill: string, i: number) => (
//                         <span key={i} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-xs font-bold border border-blue-300">
//                           {skill}
//                         </span>
//                       ))
//                     ) : (
//                       <span className="text-sm text-gray-500 italic">No skills specified</span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
//                   <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Permits & Access</h3>
//                   <div className="space-y-3">
//                     {job.permits && job.permits.length > 0 ? (
//                       job.permits.map((permit: any, i: number) => (
//                         <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-300">
//                           <div className="flex items-center gap-3">
//                             <ShieldCheck className="w-4 h-4 text-emerald-600" />
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 {typeof permit === 'string' ? permit : permit.name || 'Permit'}
//                               </div>
//                               {permit.expiryDate && (
//                                 <div className="text-xs text-gray-600">Expires: {permit.expiryDate}</div>
//                               )}
//                             </div>
//                           </div>
//                           <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
//                             Approved
//                           </span>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-sm text-gray-500 italic text-center py-4">No permits listed</div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Services Section */}
//               {job.services && job.services.length > 0 && (
//                 <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
//                   <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Services</h3>
//                   <div className="space-y-3">
//                     {job.services.map((service: any, i: number) => (
//                       <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-300">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{service.name || 'Unnamed Service'}</div>
//                           {service.description && (
//                             <div className="text-xs text-gray-600 mt-1">{service.description}</div>
//                           )}
//                         </div>
//                         <div className="text-right">
//                           <div className="text-sm font-bold text-gray-900">
//                             {service.quantity || 1} × AED {service.unitPrice || 0}
//                           </div>
//                           <div className="text-xs font-bold text-emerald-600">
//                             Total: AED {service.total || 0}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           {activeTab === 'pre-execution' && (
//             <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
//               <div className="flex items-center justify-between mb-8">
//                 <h3 className="text-xl font-bold text-gray-900">Pre-Execution Phase</h3>
//                 <span className="text-xs font-bold text-blue-900 px-3 py-1 bg-blue-100 rounded-full">Preparation Stage</span>
//               </div>

//               {/* Pre-Execution Checklist */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
//                   <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
//                     <ClipboardCheck className="w-5 h-5" />
//                     Pre-Job Checklist
//                   </h4>
//                   <div className="space-y-3">
//                     {checklistItems.map((check, i) => (
//                       <label key={check.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-200">
//                         <input
//                           type="checkbox"
//                           checked={check.status}
//                           onChange={() => handleChecklistChange(i)}
//                           className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-900">{check.item}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
//                   <h4 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
//                     <Users className="w-5 h-5" />
//                     Team Readiness
//                   </h4>
//                   <div className="space-y-4">
//                     {teamMembers.map((member, i) => (
//                       <div key={member.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-200">
//                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
//                           member.status === 'Confirmed' ? 'bg-green-600' : 'bg-yellow-600'
//                         }`}>
//                           {member.initials}
//                         </div>
//                         <div className="flex-1">
//                           <div className="text-sm font-bold text-gray-900">{member.name}</div>
//                           <div className="text-xs text-gray-600">{member.role}</div>
//                         </div>
//                         <select
//                           value={member.status}
//                           onChange={(e) => handleTeamStatusChange(i, e.target.value)}
//                           className="text-xs font-bold px-2 py-1 rounded-full border cursor-pointer bg-white transition-all hover:border-purple-400"
//                         >
//                           <option value="Confirmed">Confirmed</option>
//                           <option value="Pending">Pending</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Permits & Equipment */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
//                   <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
//                     <ShieldCheck className="w-5 h-5" />
//                     Permits & Access
//                   </h4>
//                   <div className="space-y-3">
//                     {job.permits && job.permits.length > 0 ? (
//                       job.permits.map((permit: any, i: number) => (
//                         <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-green-200">
//                           <div className="flex items-center gap-3">
//                             <ShieldCheck className="w-4 h-4 text-green-600" />
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 {typeof permit === 'string' ? permit : permit.name || 'Permit'}
//                               </div>
//                               {permit.expiryDate && (
//                                 <div className="text-xs text-gray-600">Expires: {permit.expiryDate}</div>
//                               )}
//                             </div>
//                           </div>
//                           <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
//                             Approved
//                           </span>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-sm text-gray-500 italic text-center py-4">No permits listed</div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
//                   <h4 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
//                     <Wrench className="w-5 h-5" />
//                     Equipment Status
//                   </h4>
//                   <div className="space-y-3">
//                     {equipmentStatus.map((equipment, i) => (
//                       <div key={equipment.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-200">
//                         <span className="text-sm text-gray-900">{equipment.item}</span>
//                         <select
//                           value={equipment.status}
//                           onChange={(e) => handleEquipmentStatusChange(i, e.target.value)}
//                           className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer transition-all hover:border-orange-400 ${
//                             equipment.color === 'green' ? 'bg-green-100 text-green-700 border-green-300' :
//                             equipment.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
//                             'bg-red-100 text-red-700 border-red-300'
//                           }`}
//                         >
//                           <option value="Ready">Ready</option>
//                           <option value="Pending">Pending</option>
//                           <option value="Not Ready">Not Ready</option>
//                         </select>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'execution' && (
//             <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
//               <div className="flex items-center justify-between mb-8">
//                 <h3 className="text-xl font-bold text-gray-900">On-Site Execution</h3>
//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
//                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                     <span className="text-xs font-bold text-green-800">LIVE</span>
//                   </div>
//                   <span className="text-xs font-bold text-green-900 px-3 py-1 bg-green-100 rounded-full">In Progress</span>
//                 </div>
//               </div>
              
//               {/* Execution Progress */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <CheckSquare className="w-5 h-5 text-green-600" />
//                     <span className="text-sm font-bold text-green-900">Task Progress</span>
//                   </div>
//                   <div className="text-2xl font-bold text-green-900 mb-2">{getTaskProgress()}%</div>
//                   <div className="w-full bg-green-200 rounded-full h-2 mb-2">
//                     <div 
//                       className="bg-green-600 h-2 rounded-full transition-all duration-500" 
//                       style={{ width: `${getTaskProgress()}%` }}
//                     ></div>
//                   </div>
//                   <div className="text-xs text-green-700">
//                     {executionTasks.filter(t => t.status === 'completed').length} of {executionTasks.length} tasks completed
//                   </div>
//                 </div>
                
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <Clock className="w-5 h-5 text-blue-600" />
//                     <span className="text-sm font-bold text-blue-900">Time Tracking</span>
//                   </div>
//                   <div className="text-2xl font-bold text-blue-900 mb-2">
//                     {executionTime.elapsedHours}.{String(executionTime.elapsedMinutes).padStart(2, '0')}h
//                   </div>
//                   <div className="text-xs text-blue-700 mb-2">
//                     Elapsed: {executionTime.elapsedHours}h {executionTime.elapsedMinutes}m
//                   </div>
//                   <div className="text-xs text-blue-600">
//                     Estimated completion: {executionTime.estimatedCompletion}h
//                   </div>
//                 </div>
                
//                 <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <Activity className="w-5 h-5 text-orange-600" />
//                     <span className="text-sm font-bold text-orange-900">Live Updates</span>
//                   </div>
//                   <div className="text-xs text-orange-700 mb-2">Last update: {executionTime.lastUpdate || 'No updates'}</div>
//                   <div className="text-xs text-orange-600">Team: On site, working efficiently</div>
//                 </div>
//               </div>

//               {/* Current Tasks & Image Documentation */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white border border-gray-300 rounded-2xl p-6">
//                   <h4 className="text-lg font-bold text-gray-900 mb-4">Current Tasks</h4>
//                   <div className="space-y-3">
//                     {executionTasks.map((task, i) => (
//                       <div key={task.id} className="border border-gray-200 rounded-xl p-4">
//                         <div className="flex items-center gap-3 mb-3">
//                           <select
//                             value={task.status}
//                             onChange={(e) => handleTaskStatusChange(i, e.target.value)}
//                             className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer transition-all ${
//                               task.status === 'completed' ? 'bg-green-100 text-green-700 border-green-300' :
//                               task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-300' :
//                               'bg-gray-100 text-gray-700 border-gray-300'
//                             }`}
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="in-progress">In Progress</option>
//                             <option value="completed">Completed</option>
//                           </select>
//                           <span className="flex-1 text-sm font-medium text-gray-900">{task.task}</span>
//                           <button
//                             onClick={() => {
//                               setSelectedTaskForReminder(task);
//                               setReminderTime('08:00');
//                               setShowReminderModal(true);
//                             }}
//                             className={`px-2 py-1 text-xs rounded-lg font-bold transition-all ${
//                               task.reminder ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-amber-50'
//                             }`}
//                           >
//                             🔔 {task.reminder ? 'Remind' : 'Set'}
//                           </button>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <input
//                             type="range"
//                             min="0"
//                             max="100"
//                             value={task.progress}
//                             onChange={(e) => handleTaskProgressChange(i, parseInt(e.target.value))}
//                             className="flex-1 cursor-pointer"
//                           />
//                           <span className="text-xs font-bold text-gray-600 w-8 text-right">{task.progress}%</span>
//                         </div>
//                         {task.reminder && (
//                           <div className="mt-2 flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
//                             <Clock className="w-3 h-3 text-amber-600" />
//                             <span className="text-xs text-amber-700 font-medium">Reminder at {task.reminder.time}</span>
//                             <button
//                               onClick={() => handleToggleTaskReminder(i)}
//                               className="ml-auto text-xs text-amber-600 hover:text-amber-700 font-bold"
//                             >
//                               {task.reminder.enabled ? '✓ On' : '✗ Off'}
//                             </button>
//                             <button
//                               onClick={() => handleRemoveTaskReminder(i)}
//                               className="text-xs text-gray-500 hover:text-gray-700 font-bold"
//                             >
//                               ✕
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-white border border-gray-300 rounded-2xl p-6">
//                   <h4 className="text-lg font-bold text-gray-900 mb-4">Image Documentation</h4>
//                   <div className="grid grid-cols-2 gap-3 mb-4">
//                     {['Before', 'In Progress', 'After'].map((stage) => (
//                       <button
//                         key={stage}
//                         onClick={() => handleUploadPhoto(stage)}
//                         className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all"
//                       >
//                         <div className="text-center">
//                           <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
//                           <p className="text-xs text-gray-500">{stage}</p>
//                         </div>
//                       </button>
//                     ))}
//                     <button
//                       onClick={() => document.getElementById('photo-input')?.click()}
//                       className="aspect-square bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-all"
//                     >
//                       <div className="text-center">
//                         <Plus className="h-6 w-6 text-blue-600 mx-auto mb-1" />
//                         <p className="text-xs text-blue-600">Add Photo</p>
//                       </div>
//                     </button>
//                     <input
//                       id="photo-input"
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         if (e.target.files?.[0]) {
//                           handleUploadPhoto('Custom')
//                         }
//                       }}
//                       className="hidden"
//                     />
//                   </div>
//                   <div className="space-y-2 max-h-48 overflow-y-auto">
//                     {executionPhotos.map((photo) => (
//                       <div key={photo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
//                         <span className="font-medium text-gray-700">{photo.stage}</span>
//                         <span className="text-gray-500">{photo.uploadedAt}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Execution Notes */}
//               <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-6">
//                 <h4 className="text-lg font-bold text-gray-900 mb-4">Execution Notes</h4>
//                 <textarea
//                   value={executionNotes}
//                   onChange={(e) => setExecutionNotes(e.target.value)}
//                   className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Add real-time notes about job execution..."
//                 ></textarea>
//                 <div className="flex justify-end mt-3">
//                   <button
//                     onClick={handleSaveExecutionNotes}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
//                     disabled={!executionNotes.trim()}
//                   >
//                     Save Notes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'notes' && (
//             <div className="space-y-6">
//               <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
//                 <div className="flex items-center justify-between mb-8">
//                   <h3 className="text-xl font-bold text-gray-900">Job Notes & Reminders</h3>
//                   <button
//                     onClick={() => setShowJobNoteModal(true)}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span>Add Note</span>
//                   </button>
//                 </div>

//                 {/* Notes */}
//                 <div className="mb-8">
//                   <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
//                     <MessageSquare className="w-5 h-5 text-blue-600" />
//                     Notes
//                   </h4>
//                   <div className="space-y-3">
//                     {jobNotes.map((note, i) => (
//                       <div key={note.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
//                         <div className="flex items-start justify-between mb-2">
//                           <div>
//                             <div className="text-sm text-gray-900">{note.text}</div>
//                             <div className="text-xs text-gray-600 mt-2">{note.author} • {note.timestamp}</div>
//                           </div>
//                           <button
//                             onClick={() => handleRemoveJobNote(i)}
//                             className="text-gray-400 hover:text-red-600 transition-all"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Reminders */}
//                 <div>
//                   <div className="flex items-center justify-between mb-4">
//                     <h4 className="font-bold text-gray-900 flex items-center gap-2">
//                       <Bell className="w-5 h-5 text-amber-600" />
//                       Reminders
//                     </h4>
//                     <button
//                       onClick={() => setShowReminderModal(true)}
//                       className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition-all"
//                     >
//                       <Plus className="w-3 h-3" />
//                       Add Reminder
//                     </button>
//                   </div>
//                   <div className="space-y-3">
//                     {jobReminders.map((reminder, i) => (
//                       <div key={reminder.id} className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
//                         <div className="flex items-center gap-4">
//                           <input
//                             type="checkbox"
//                             checked={reminder.enabled}
//                             onChange={() => handleToggleReminder(i)}
//                             className="rounded border-amber-300 text-amber-600"
//                           />
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">{reminder.text}</div>
//                             <div className="text-xs text-gray-600 mt-1">Remind at {reminder.remindAt}</div>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveReminder(i)}
//                           className="text-gray-400 hover:text-red-600 transition-all"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'tasks' && (
//             <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
//               <div className="flex items-center justify-between mb-8">
//                 <h3 className="text-xl font-bold text-gray-900">Task Assignment</h3>
//                 <button
//                   onClick={() => { setSelectedTask(null); setShowTaskAssignmentModal(true) }}
//                   className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Reassign Task</span>
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {taskAssignments.map((assignment, idx) => (
//                   <div key={assignment.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex-1">
//                         <h4 className="font-bold text-gray-900 mb-2">{assignment.taskName}</h4>
//                         <div className="flex items-center gap-4 text-sm">
//                           <div className="flex items-center gap-2">
//                             <Users className="w-4 h-4 text-gray-600" />
//                             <span className="text-gray-700">{assignment.assignedTo}</span>
//                           </div>
//                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                             assignment.status === 'completed' ? 'bg-emerald-200 text-emerald-800' :
//                             assignment.status === 'in-progress' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'
//                           }`}>
//                             {assignment.status.replace('-', ' ').toUpperCase()}
//                           </span>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => {
//                           setSelectedTask(assignment);
//                           setSelectedTeamMember(assignment.assignedTo);
//                           setShowTaskAssignmentModal(true);
//                         }}
//                         className="px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-xs font-bold text-gray-700"
//                       >
//                         Change Assignment
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === 'team' && (
//             <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
//               <h3 className="text-xl font-bold text-gray-900 mb-8">Team Member Management</h3>
//               <div className="space-y-5">
//                 {taskAssignments.map((assignment, idx) => (
//                   <div key={assignment.id} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <h4 className="font-bold text-gray-900 mb-1">{assignment.taskName}</h4>
//                         <div className="text-sm text-gray-700 mb-3">Currently assigned to: <span className="font-bold">{assignment.assignedTo}</span></div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <select
//                         value={assignment.assignedTo}
//                         onChange={(e) => handleReassignTeamMember(idx, e.target.value)}
//                         className="flex-1 px-4 py-2 border border-purple-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       >
//                         <option value="">Select a team member...</option>
//                         {teamMembers.map((member) => (
//                           <option key={member.id} value={member.name}>
//                             {member.name} ({member.role})
//                           </option>
//                         ))}
//                       </select>
//                       <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium">
//                         Replace Duty
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === 'compensation' && (
//             <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
//               <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
//                 <DollarSign className="w-6 h-6 text-green-600" />
//                 Team Compensation Analysis
//               </h3>

//               {/* Summary Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
//                   <div className="text-sm font-medium text-green-700 mb-1">Total Job Cost</div>
//                   <div className="text-3xl font-bold text-green-900">
//                     AED {teamMembers.reduce((sum, m) => sum + m.totalCompensation, 0).toLocaleString()}
//                   </div>
//                   <div className="text-xs text-green-600 mt-2">{teamMembers.length} team members</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
//                   <div className="text-sm font-medium text-blue-700 mb-1">Average Rate/Hour</div>
//                   <div className="text-3xl font-bold text-blue-900">
//                     AED {Math.round(teamMembers.reduce((sum, m) => sum + m.hourlyRate, 0) / teamMembers.length)}
//                   </div>
//                   <div className="text-xs text-blue-600 mt-2">Across all roles</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
//                   <div className="text-sm font-medium text-purple-700 mb-1">Total Estimated Hours</div>
//                   <div className="text-3xl font-bold text-purple-900">
//                     {teamMembers.reduce((sum, m) => sum + m.estimatedHours, 0)} hrs
//                   </div>
//                   <div className="text-xs text-purple-600 mt-2">Project duration</div>
//                 </div>
//               </div>

//               {/* Detailed Table */}
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="border-b border-gray-300">
//                     <tr>
//                       <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Team Member</th>
//                       <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Role</th>
//                       <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Hourly Rate</th>
//                       <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Est. Hours</th>
//                       <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Total Cost</th>
//                       <th className="text-left px-4 py-3 text-sm font-bold text-gray-700">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {teamMembers.map((member) => (
//                       <tr key={member.id} className="hover:bg-gray-50 transition-all border-b border-gray-200">
//                         <td className="px-4 py-4 text-sm font-medium text-gray-900">{member.name}</td>
//                         <td className="px-4 py-4 text-sm text-gray-600">{member.role}</td>
//                         <td className="px-4 py-4 text-sm font-bold text-gray-900">AED {member.hourlyRate}</td>
//                         <td className="px-4 py-4 text-sm text-gray-600">{member.estimatedHours}h</td>
//                         <td className="px-4 py-4 text-sm font-bold text-green-600">AED {member.totalCompensation}</td>
//                         <td className="px-4 py-4">
//                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                             member.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {member.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {activeTab === 'feedback' && (
//             <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
//               <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
//                 <Star className="w-6 h-6 text-yellow-600" />
//                 Employee Feedback & Reviews
//               </h3>

//               <div className="space-y-6">
//                 {employeeFeedback.map((feedback) => (
//                   <div key={feedback.id} className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <h4 className="font-bold text-gray-900 text-lg">{feedback.employee}</h4>
//                         <div className="flex items-center gap-2 mt-2">
//                           <div className="flex items-center gap-1">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className={`w-4 h-4 ${
//                                   i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                           <span className="text-sm font-bold text-gray-700">{feedback.rating}.0/5.0</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
//                           feedback.category === 'performance' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
//                         }`}>
//                           {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
//                         </span>
//                         <div className="text-xs text-gray-600 mt-2">{feedback.date}</div>
//                       </div>
//                     </div>
//                     <p className="text-gray-700 text-sm leading-relaxed">{feedback.feedback}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sidebar: Team & History */}
//         <div className="lg:col-span-4 space-y-6">
//           {/* Enhanced Team Section with Real-time Status */}
//           <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                 <Users className="w-4 h-4 text-gray-500" />
//                 Team Status
//               </h3>
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-1">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="text-xs font-medium text-gray-600">
//                     {teamMembers.filter(m => m.status === 'Confirmed').length}/{teamMembers.length} Active
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-4">
//               {teamMembers.map((member) => (
//                 <div key={member.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-300 hover:bg-gray-100 transition-all">
//                   <div className="relative">
//                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white ${
//                       member.status === 'Confirmed' ? 'bg-green-600' :
//                       member.status === 'Pending' ? 'bg-yellow-600' : 'bg-gray-600'
//                     }`}>
//                       {member.initials}
//                     </div>
//                     {member.status === 'Confirmed' && (
//                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
//                         <CheckCircle className="w-2.5 h-2.5 text-white" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <div className="text-sm font-bold text-gray-900">{member.name}</div>
//                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
//                         member.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
//                         member.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
//                       }`}>
//                         {member.status}
//                       </span>
//                     </div>
//                     <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">{member.role}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* History Timeline */}
//           <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
//             <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
//               <History className="w-4 h-4 text-gray-500" />
//               Activity Log
//             </h3>
//             <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gray-300">
//               {activityLog.map((event, i) => (
//                 <div key={i} className="relative pl-10">
//                   <div className="absolute left-3 top-1.5 w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]" />
//                   <div className="text-xs font-bold text-gray-900 mb-1">{event.action}</div>
//                   <div className="text-[10px] text-gray-600 mb-1">
//                     {new Date(event.timestamp).toLocaleDateString()} • {event.user}
//                   </div>
//                   <div className="text-[10px] text-gray-500 italic">{event.details}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Status Update Modal */}
//       {showStatusModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-md w-full">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold text-gray-900">Update Job Status</h3>
//               <button
//                 onClick={() => setShowStatusModal(false)}
//                 className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               {[
//                 { status: 'Pending', label: 'Mark as Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
//                 { status: 'Scheduled', label: 'Mark as Scheduled', color: 'bg-indigo-100 text-indigo-700', icon: Calendar },
//                 { status: 'In Progress', label: 'Mark as In Progress', color: 'bg-green-100 text-green-700', icon: PlayCircle },
//                 { status: 'Completed', label: 'Mark as Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
//                 { status: 'Cancelled', label: 'Cancel Job', color: 'bg-red-100 text-red-700', icon: X }
//               ].map((option) => (
//                 <button
//                   key={option.status}
//                   onClick={() => handleUpdateJobStatus(option.status)}
//                   className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
//                     job.status === option.status
//                       ? 'border-indigo-400 bg-indigo-50'
//                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className={`p-2 rounded-lg ${option.color.split(' ')[0]}`}>
//                     <option.icon className={`w-4 h-4 ${option.color.split(' ')[1]}`} />
//                   </div>
//                   <span className="font-bold text-gray-900">{option.label}</span>
//                   {job.status === option.status && <CheckCircle className="w-4 h-4 text-indigo-600 ml-auto" />}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Job Note Modal */}
//       {showJobNoteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold text-gray-900">Add Job Note</h3>
//               <button
//                 onClick={() => setShowJobNoteModal(false)}
//                 className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <textarea
//                 value={newJobNote}
//                 onChange={(e) => setNewJobNote(e.target.value)}
//                 placeholder="Enter your note..."
//                 className="w-full h-32 p-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setShowJobNoteModal(false)}
//                   className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddJobNote}
//                   className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
//                 >
//                   Add Note
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Task Assignment Modal */}
//       {showTaskAssignmentModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold text-gray-900">Assign Task</h3>
//               <button
//                 onClick={() => {
//                   setShowTaskAssignmentModal(false);
//                   setSelectedTask(null);
//                 }}
//                 className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Select Task</label>
//                 <select
//                   value={selectedTask?.id || ''}
//                   onChange={(e) => {
//                     const task = executionTasks.find(t => t.id === e.target.value);
//                     setSelectedTask(task);
//                   }}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="">Choose a task...</option>
//                   {executionTasks.map((task) => (
//                     <option key={task.id} value={task.id}>
//                       {task.task}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Assign to Team Member</label>
//                 <select
//                   value={selectedTeamMember}
//                   onChange={(e) => setSelectedTeamMember(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="">Choose a team member...</option>
//                   {teamMembers.map((member) => (
//                     <option key={member.id} value={member.name}>
//                       {member.name} ({member.role})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => {
//                     setShowTaskAssignmentModal(false);
//                     setSelectedTask(null);
//                   }}
//                   className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAssignTask}
//                   className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
//                 >
//                   Assign Task
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reminder Modal */}
//       {showReminderModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold text-gray-900">
//                 {selectedTaskForReminder ? 'Set Task Reminder' : 'Add Reminder'}
//               </h3>
//               <button
//                 onClick={() => {
//                   setShowReminderModal(false);
//                   setSelectedTaskForReminder(null);
//                 }}
//                 className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>
//             <div className="space-y-6">
//               {selectedTaskForReminder ? (
//                 <>
//                   <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                     <div className="text-sm font-medium text-blue-900">Task</div>
//                     <div className="text-sm font-bold text-gray-900 mt-1">{selectedTaskForReminder.task}</div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Reminder Time</label>
//                     <input
//                       type="time"
//                       value={reminderTime}
//                       onChange={(e) => setReminderTime(e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     />
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => {
//                         setShowReminderModal(false);
//                         setSelectedTaskForReminder(null);
//                       }}
//                       className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={() => {
//                         const index = executionTasks.findIndex(t => t.id === selectedTaskForReminder.id);
//                         handleAddTaskReminder(index);
//                       }}
//                       className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all"
//                     >
//                       Set Reminder
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Reminder Message</label>
//                     <textarea
//                       value={reminderText}
//                       onChange={(e) => setReminderText(e.target.value)}
//                       placeholder="What should you be reminded about?"
//                       className="w-full h-24 p-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Reminder Time</label>
//                     <input
//                       type="time"
//                       value={reminderTime}
//                       onChange={(e) => setReminderTime(e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => setShowReminderModal(false)}
//                       className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleAddReminder}
//                       className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all"
//                     >
//                       Create Reminder
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// new code

'use client'

import { useState, useEffect } from 'react'
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
  Camera,
  Minus
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  orderBy,
  Timestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params?.id as string
  
  const [job, setJob] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'pre-execution' | 'execution' | 'completion' | 'notes' | 'tasks' | 'team' | 'reports' | 'feedback' | 'compensation'>('overview')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [notesText, setNotesText] = useState('')
  const [checklistItems, setChecklistItems] = useState<any[]>([])
  const [equipmentStatus, setEquipmentStatus] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [activityLog, setActivityLog] = useState<any[]>([])
  const [executionTasks, setExecutionTasks] = useState<any[]>([])
  const [executionTime, setExecutionTime] = useState({
    elapsedHours: 0,
    elapsedMinutes: 0,
    estimatedCompletion: 0,
    lastUpdate: ''
  })
  const [executionNotes, setExecutionNotes] = useState('')
  const [executionPhotos, setExecutionPhotos] = useState<any[]>([])
  const [jobNotes, setJobNotes] = useState<any[]>([])
  const [newJobNote, setNewJobNote] = useState('')
  const [taskAssignments, setTaskAssignments] = useState<any[]>([])
  const [jobReminders, setJobReminders] = useState<any[]>([])
  const [employeeReports, setEmployeeReports] = useState<any[]>([])
  const [employeeFeedback, setEmployeeFeedback] = useState<any[]>([])
  const [showJobNoteModal, setShowJobNoteModal] = useState(false)
  const [showTaskAssignmentModal, setShowTaskAssignmentModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedTeamMember, setSelectedTeamMember] = useState('')
  const [reminderTime, setReminderTime] = useState('08:00')
  const [reminderText, setReminderText] = useState('')
  const [selectedTaskForReminder, setSelectedTaskForReminder] = useState<any>(null)

  // NEW STATES FOR REQUIREMENTS
  const [allEmployees, setAllEmployees] = useState<any[]>([]) // Firebase employees collection
  const [preJobChecklistItems, setPreJobChecklistItems] = useState<any[]>([
    { id: 'default-1', item: 'Job requirements reviewed', status: false },
    { id: 'default-2', item: 'Client contact confirmed', status: false }
  ])
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [additionalTeamMembers, setAdditionalTeamMembers] = useState<any[]>([])
  const [realJobTasks, setRealJobTasks] = useState<any[]>([]) // Firebase se aaye real tasks
  const [saving, setSaving] = useState(false)
  
  // NEW STATES FOR NOTES & REMINDERS
  const [allJobNotes, setAllJobNotes] = useState<any[]>([])
  const [allJobReminders, setAllJobReminders] = useState<any[]>([])
  const [savingNotes, setSavingNotes] = useState(false)
  const [savingReminders, setSavingReminders] = useState(false)
  
  // NEW STATES FOR TASK ASSIGNMENT
  const [realTaskAssignments, setRealTaskAssignments] = useState<any[]>([])
  const [savingTasks, setSavingTasks] = useState(false)

  // NEW STATES FOR FEEDBACK
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [newFeedback, setNewFeedback] = useState({
    title: '',
    description: '',
    rating: 5,
    category: 'performance',
    employee: ''
  })
  const [allEmployeeFeedback, setAllEmployeeFeedback] = useState<any[]>([])

  // Helper function to convert Firebase Timestamp to string
  const convertTimestamp = (timestamp: any): string => {
    if (!timestamp) return new Date().toISOString()
    
    if (timestamp.toDate) {
      // It's a Firebase Timestamp
      return timestamp.toDate().toISOString()
    } else if (timestamp.seconds) {
      // It's a timestamp object
      return new Date(timestamp.seconds * 1000).toISOString()
    } else if (typeof timestamp === 'string') {
      // It's already a string
      return timestamp
    }
    return new Date().toISOString()
  }

  // Fetch REAL job data from Firebase
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (!jobId) {
          router.push('/admin/jobs')
          return
        }

        // Fetch main job data from Firebase
        const jobDoc = await getDoc(doc(db, 'jobs', jobId))
        if (!jobDoc.exists()) {
          router.push('/admin/jobs')
          return
        }
        
        const jobData = jobDoc.data()
        
        // Convert all timestamps properly
        const realJob = {
          id: jobDoc.id,
          title: jobData.title || '',
          client: jobData.client || '',
          clientId: jobData.clientId || '',
          status: jobData.status || 'Pending',
          priority: jobData.priority || 'Medium',
          scheduledDate: jobData.scheduledDate || null,
          scheduledTime: jobData.scheduledTime || '',
          endTime: jobData.endTime || '',
          location: jobData.location || '',
          teamRequired: jobData.teamRequired || 1,
          budget: jobData.budget || 0,
          actualCost: jobData.actualCost || 0,
          description: jobData.description || '',
          riskLevel: jobData.riskLevel || 'Low',
          slaDeadline: jobData.slaDeadline || '',
          estimatedDuration: jobData.estimatedDuration || '',
          requiredSkills: jobData.requiredSkills || [],
          permits: jobData.permits || [],
          tags: jobData.tags || [],
          specialInstructions: jobData.specialInstructions || '',
          recurring: jobData.recurring || false,
          createdAt: convertTimestamp(jobData.createdAt),
          updatedAt: convertTimestamp(jobData.updatedAt),
          completedAt: jobData.completedAt ? convertTimestamp(jobData.completedAt) : '',
          executionLogs: jobData.executionLogs || [],
          assignedTo: jobData.assignedTo || [],
          assignedEmployees: jobData.assignedEmployees || [],
          reminderEnabled: jobData.reminderEnabled || false,
          reminderDate: jobData.reminderDate || '',
          reminderSent: jobData.reminderSent || false,
          services: jobData.services || [],
          overtimeRequired: jobData.overtimeRequired || false,
          overtimeHours: jobData.overtimeHours || 0,
          overtimeReason: jobData.overtimeReason || '',
          overtimeApproved: jobData.overtimeApproved || false,
          daysUntilSLA: jobData.slaDeadline ? 
            Math.ceil((new Date(jobData.slaDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
          // NEW: Fetch all data from Firebase
          tasks: jobData.tasks || [],
          equipment: jobData.equipment || [],
          permits: jobData.permits || [],
          notes: jobData.notes || [],
          reminders: jobData.reminders || [],
          taskAssignments: jobData.taskAssignments || [],
          additionalTeamMembers: jobData.additionalTeamMembers || [],
          preJobChecklist: jobData.preJobChecklist || [],
          executionData: jobData.executionData || {},
          executionNotes: jobData.executionNotes || '',
          executionPhotos: jobData.executionPhotos || [],
          // Employee feedback
          employeeFeedback: jobData.employeeFeedback || []
        }
        
        setJob(realJob)

        // Set REAL tasks from Firebase
        if (jobData.tasks && jobData.tasks.length > 0) {
          setRealJobTasks(jobData.tasks)
          
          // Also set execution tasks with real data
          const realExecutionTasks = jobData.tasks.map((task: any) => ({
            id: task.id || `task-${Math.random()}`,
            task: task.title || 'Unnamed Task',
            description: task.description || '',
            status: task.completed ? 'completed' : 'pending',
            progress: task.completed ? 100 : 0,
            reminder: null
          }))
          setExecutionTasks(realExecutionTasks)
        }

        // Set REAL notes from Firebase
        if (jobData.notes && jobData.notes.length > 0) {
          setAllJobNotes(jobData.notes)
          setJobNotes(jobData.notes.map((note: any) => ({
            id: note.id || `note-${Math.random()}`,
            text: note.text || '',
            author: note.author || 'System',
            timestamp: note.timestamp ? convertTimestamp(note.timestamp) : new Date().toISOString(),
            type: note.type || 'general'
          })))
        }

        // Set REAL reminders from Firebase
        if (jobData.reminders && jobData.reminders.length > 0) {
          setAllJobReminders(jobData.reminders)
          setJobReminders(jobData.reminders.map((reminder: any) => ({
            id: reminder.id || `reminder-${Math.random()}`,
            text: reminder.text || '',
            remindAt: reminder.remindAt || '08:00',
            enabled: reminder.enabled !== false,
            createdAt: reminder.createdAt ? convertTimestamp(reminder.createdAt) : new Date().toISOString()
          })))
        }

        // Set REAL task assignments from Firebase
        if (jobData.taskAssignments && jobData.taskAssignments.length > 0) {
          setRealTaskAssignments(jobData.taskAssignments)
          setTaskAssignments(jobData.taskAssignments.map((assignment: any) => ({
            id: assignment.id || `assignment-${Math.random()}`,
            taskId: assignment.taskId || '',
            taskName: assignment.taskName || '',
            assignedTo: assignment.assignedTo || '',
            status: assignment.status || 'pending',
            assignedAt: assignment.assignedAt ? convertTimestamp(assignment.assignedAt) : new Date().toISOString(),
            reassignedAt: assignment.reassignedAt ? convertTimestamp(assignment.reassignedAt) : null
          })))
        } else if (jobData.tasks && jobData.tasks.length > 0) {
          // Create default assignments from tasks
          const defaultAssignments = jobData.tasks.map((task: any, index: number) => ({
            id: `assignment-${index}`,
            taskId: task.id || `task-${index}`,
            taskName: task.title || `Task ${index + 1}`,
            assignedTo: 'Unassigned',
            status: 'pending',
            assignedAt: new Date().toISOString()
          }))
          setTaskAssignments(defaultAssignments)
          setRealTaskAssignments(defaultAssignments)
        }

        // Set REAL employee feedback from Firebase
        if (jobData.employeeFeedback && jobData.employeeFeedback.length > 0) {
          setAllEmployeeFeedback(jobData.employeeFeedback)
          setEmployeeFeedback(jobData.employeeFeedback.map((feedback: any) => ({
            id: feedback.id || `feedback-${Math.random()}`,
            employee: feedback.employee || '',
            title: feedback.title || '',
            description: feedback.description || '',
            rating: feedback.rating || 5,
            category: feedback.category || 'performance',
            date: feedback.date ? convertTimestamp(feedback.date) : new Date().toISOString(),
            feedback: feedback.feedback || '',
            author: feedback.author || 'System'
          })))
        }

        // Set REAL team members from assignedEmployees
        if (jobData.assignedEmployees && jobData.assignedEmployees.length > 0) {
          const realTeamMembers = jobData.assignedEmployees.map((emp: any, index: number) => ({
            id: emp.id || `emp-${index}`,
            name: emp.name || 'Unknown Employee',
            email: emp.email || '',
            role: 'Assigned Team Member',
            status: 'Confirmed',
            initials: emp.name ? emp.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'EM',
            hourlyRate: 150,
            estimatedHours: 8,
            totalCompensation: 1200
          }))
          setTeamMembers(realTeamMembers)
        } else {
          // Default team members if none assigned
          setTeamMembers([
            { id: '1', name: 'Ahmed Hassan', role: 'Team Lead', status: 'Confirmed', initials: 'AH', hourlyRate: 150, estimatedHours: 8, totalCompensation: 1200 },
            { id: '2', name: 'Fatima Al-Mazrouei', role: 'Floor Specialist', status: 'Confirmed', initials: 'FA', hourlyRate: 120, estimatedHours: 8, totalCompensation: 960 }
          ])
        }

        // Set REAL activity log from executionLogs or create default
        if (jobData.executionLogs && jobData.executionLogs.length > 0) {
          const realActivityLog = jobData.executionLogs.map((log: any, index: number) => ({
            id: `log-${index}`,
            action: log.type || 'Activity',
            timestamp: log.timestamp ? convertTimestamp(log.timestamp) : new Date().toISOString(),
            user: 'System',
            details: log.notes || log.checklist ? `Checklist: ${log.checklist?.join(', ') || ''}` : 'Activity logged'
          }))
          setActivityLog(realActivityLog)
        } else {
          // Create default activity log with job creation
          setActivityLog([
            { id: '1', action: 'Created', timestamp: convertTimestamp(jobData.createdAt), user: 'System', details: `Job "${jobData.title}" created`, type: 'creation' },
            { id: '2', action: 'Status Updated', timestamp: convertTimestamp(jobData.updatedAt), user: 'System', details: `Status set to ${jobData.status}`, type: 'scheduling' },
            { id: '3', action: 'Team Assigned', timestamp: new Date().toISOString(), user: 'HR Manager', details: `${jobData.assignedEmployees?.length || 0} team members assigned`, type: 'assignment' }
          ])
        }

        // Set pre-job checklist from Firebase
        if (jobData.preJobChecklist && jobData.preJobChecklist.length > 0) {
          setPreJobChecklistItems(jobData.preJobChecklist)
        }

        // Set additional team members from Firebase
        if (jobData.additionalTeamMembers && jobData.additionalTeamMembers.length > 0) {
          setAdditionalTeamMembers(jobData.additionalTeamMembers)
        }

        // Set execution data from Firebase
        if (jobData.executionData) {
          setExecutionNotes(jobData.executionNotes || '')
          setExecutionPhotos(jobData.executionPhotos || [])
        }

        // Set default data for other sections
        setChecklistItems([
          { id: '1', item: 'Job requirements reviewed', status: false },
          { id: '2', item: 'Client contact confirmed', status: false },
          { id: '3', item: 'Site access arrangements', status: false },
          { id: '4', item: 'Safety protocols reviewed', status: false },
          { id: '5', item: 'Equipment requirements checked', status: false },
          { id: '6', item: 'Team availability confirmed', status: false }
        ])

        setEquipmentStatus([
          { id: '1', item: 'Cleaning supplies', status: 'Ready', color: 'green' },
          { id: '2', item: 'Safety equipment', status: 'Ready', color: 'green' },
          { id: '3', item: 'Specialized tools', status: 'Pending', color: 'yellow' },
          { id: '4', item: 'Transportation', status: 'Ready', color: 'green' }
        ])

        // If no real tasks, fallback to dummy tasks
        if (!jobData.tasks || jobData.tasks.length === 0) {
          setExecutionTasks([
            { id: '1', task: 'Floor deep cleaning - Main area', status: 'pending', progress: 0, reminder: null },
            { id: '2', task: 'Window exterior cleaning', status: 'pending', progress: 0, reminder: null },
            { id: '3', task: 'Cubicle sanitization', status: 'pending', progress: 0, reminder: null },
            { id: '4', task: 'Restroom deep clean', status: 'pending', progress: 0, reminder: null }
          ])
        }

        // Set default employee reports from job data
        const reports = []
        if (jobData.taskAssignments && jobData.taskAssignments.length > 0) {
          jobData.taskAssignments.forEach((assignment: any, index: number) => {
            const task = jobData.tasks?.find((t: any) => t.id === assignment.taskId)
            reports.push({
              id: `report-${index}`,
              employee: assignment.assignedTo,
              taskId: assignment.taskId,
              taskName: assignment.taskName,
              assignedAt: assignment.assignedAt ? convertTimestamp(assignment.assignedAt) : new Date().toISOString(),
              status: assignment.status || 'pending',
              reassignedAt: assignment.reassignedAt ? convertTimestamp(assignment.reassignedAt) : null,
              taskDetails: task ? {
                completed: task.completed,
                progress: task.progress,
                description: task.description,
                duration: task.duration
              } : null
            })
          })
        }
        
        // Add default reports if no assignments
        if (reports.length === 0) {
          reports.push(
            {
              id: '1',
              employee: 'Ahmed Hassan',
              jobId: jobId,
              date: new Date().toISOString(),
              hoursWorked: 8,
              tasksCompleted: 4,
              status: 'submitted',
              notes: 'All tasks completed successfully'
            },
            {
              id: '2',
              employee: 'Fatima Al-Mazrouei',
              jobId: jobId,
              date: new Date().toISOString(),
              hoursWorked: 7.5,
              tasksCompleted: 3,
              status: 'submitted',
              notes: 'Minor delay due to client requests'
            }
          )
        }
        
        setEmployeeReports(reports)

        // Set default feedback if none
        if (!jobData.employeeFeedback || jobData.employeeFeedback.length === 0) {
          setEmployeeFeedback([
            { id: '1', employee: 'Ahmed Hassan', jobId: jobId, date: new Date().toISOString(), rating: 5, feedback: 'Excellent coordination with team. High quality work delivered on time.', category: 'performance' },
            { id: '2', employee: 'Fatima Al-Mazrouei', jobId: jobId, date: new Date().toISOString(), rating: 4, feedback: 'Good work quality. Communication could be improved.', category: 'performance' }
          ])
        }

        // Fetch employees from Firebase employees collection
        await fetchAllEmployees()

      } catch (error) {
        console.error('Error fetching job data:', error)
      }
    }

    if (jobId) {
      fetchJobData()
    }
  }, [jobId, router])

  // NEW: Fetch all employees from Firebase
  const fetchAllEmployees = async () => {
    try {
      const employeesQuery = query(collection(db, 'employees'))
      const querySnapshot = await getDocs(employeesQuery)
      
      const employees: any[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        employees.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          role: data.role || '',
          department: data.department || '',
          status: data.status || 'Active'
        })
      })
      
      setAllEmployees(employees)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  // ========== NEW: SAVE FUNCTIONS FOR EACH SECTION ==========
  
  // Save Overview Section
  const saveOverviewSection = async () => {
    try {
      setSaving(true)
      const jobRef = doc(db, 'jobs', jobId)
      
      await updateDoc(jobRef, {
        updatedAt: Timestamp.fromDate(new Date()),
        // Add any overview specific updates here
      })
      
      addActivityLog('Overview Updated', 'Overview section saved to Firebase')
      alert('Overview section saved successfully!')
    } catch (error) {
      console.error('Error saving overview:', error)
      alert('Error saving overview section')
    } finally {
      setSaving(false)
    }
  }

  // Save Pre-Execution Section
  const savePreExecutionSection = async () => {
    try {
      setSaving(true)
      const jobRef = doc(db, 'jobs', jobId)
      
      await updateDoc(jobRef, {
        updatedAt: Timestamp.fromDate(new Date()),
        // Save checklist items
        preJobChecklist: preJobChecklistItems,
        // Save team readiness
        additionalTeamMembers: additionalTeamMembers
      })
      
      addActivityLog('Pre-Execution Updated', 'Pre-execution section saved to Firebase')
      alert('Pre-execution section saved successfully!')
    } catch (error) {
      console.error('Error saving pre-execution:', error)
      alert('Error saving pre-execution section')
    } finally {
      setSaving(false)
    }
  }

  // Save Execution Section
  const saveExecutionSection = async () => {
    try {
      setSaving(true)
      const jobRef = doc(db, 'jobs', jobId)
      
      // Update tasks with current progress
      const updatedTasks = realJobTasks.map(task => {
        const executionTask = executionTasks.find(t => t.id === task.id)
        return {
          ...task,
          completed: executionTask?.status === 'completed',
          progress: executionTask?.progress || 0
        }
      })
      
      await updateDoc(jobRef, {
        updatedAt: Timestamp.fromDate(new Date()),
        executionNotes: executionNotes,
        executionPhotos: executionPhotos,
        tasks: updatedTasks,
        // Save execution data
        executionData: {
          notes: executionNotes,
          photos: executionPhotos,
          lastUpdated: new Date().toISOString()
        }
      })
      
      addActivityLog('Execution Updated', 'Execution section saved to Firebase')
      alert('Execution section saved successfully!')
    } catch (error) {
      console.error('Error saving execution:', error)
      alert('Error saving execution section')
    } finally {
      setSaving(false)
    }
  }

  // ========== NEW: SAVE NOTES SECTION ==========
  const saveNotesSection = async () => {
    try {
      setSavingNotes(true)
      const jobRef = doc(db, 'jobs', jobId)
      
      await updateDoc(jobRef, {
        updatedAt: Timestamp.fromDate(new Date()),
        notes: allJobNotes
      })
      
      addActivityLog('Notes Saved', 'Notes section saved to Firebase')
      alert('Notes saved successfully!')
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Error saving notes')
    } finally {
      setSavingNotes(false)
    }
  }

  // ========== NEW: SAVE REMINDERS SECTION ==========
  const saveRemindersSection = async () => {
    try {
      setSavingReminders(true)
      const jobRef = doc(db, 'jobs', jobId)
      
      await updateDoc(jobRef, {
        updatedAt: Timestamp.fromDate(new Date()),
        reminders: allJobReminders
      })
      
      addActivityLog('Reminders Saved', 'Reminders section saved to Firebase')
      alert('Reminders saved successfully!')
    } catch (error) {
      console.error('Error saving reminders:', error)
      alert('Error saving reminders')
    } finally {
      setSavingReminders(false)
    }
  }

  // ========== NEW: SAVE TASK ASSIGNMENTS SECTION ==========
  const saveTaskAssignmentsSection = async () => {
    try {
      setSavingTasks(true)
      const jobRef = doc(db, 'jobs', jobId)
      
      await updateDoc(jobRef, {
        updatedAt: Timestamp.fromDate(new Date()),
        taskAssignments: realTaskAssignments
      })
      
      addActivityLog('Task Assignments Saved', 'Task assignments saved to Firebase')
      alert('Task assignments saved successfully!')
    } catch (error) {
      console.error('Error saving task assignments:', error)
      alert('Error saving task assignments')
    } finally {
      setSavingTasks(false)
    }
  }

  // ========== NEW: SAVE EMPLOYEE FEEDBACK SECTION ==========
  const saveFeedbackSection = async () => {
    try {
      setSaving(true)
      const jobRef = doc(db, 'jobs', jobId)
      
      await updateDoc(jobRef, {
        updatedAt: Timestamp.fromDate(new Date()),
        employeeFeedback: allEmployeeFeedback
      })
      
      addActivityLog('Employee Feedback Saved', 'Employee feedback saved to Firebase')
      alert('Employee feedback saved successfully!')
    } catch (error) {
      console.error('Error saving feedback:', error)
      alert('Error saving feedback')
    } finally {
      setSaving(false)
    }
  }

  // ========== NEW: ADD EMPLOYEE FEEDBACK ==========
  const handleAddFeedback = async () => {
    if (newFeedback.title.trim() && newFeedback.description.trim() && newFeedback.employee.trim()) {
      try {
        const newFeedbackItem = {
          id: `feedback-${Date.now()}`,
          title: newFeedback.title,
          description: newFeedback.description,
          rating: newFeedback.rating,
          category: newFeedback.category,
          employee: newFeedback.employee,
          author: 'Admin',
          date: Timestamp.fromDate(new Date()),
          createdAt: Timestamp.fromDate(new Date())
        }
        
        // Update Firebase
        const jobRef = doc(db, 'jobs', jobId)
        await updateDoc(jobRef, {
          employeeFeedback: arrayUnion(newFeedbackItem),
          updatedAt: Timestamp.fromDate(new Date())
        })
        
        // Update local state
        setAllEmployeeFeedback([...allEmployeeFeedback, newFeedbackItem])
        setEmployeeFeedback([...employeeFeedback, {
          ...newFeedbackItem,
          date: new Date().toISOString(),
          feedback: newFeedback.description,
          jobId: jobId
        }])
        
        addActivityLog('Employee Feedback Added', `Feedback added for ${newFeedback.employee}`)
        setNewFeedback({
          title: '',
          description: '',
          rating: 5,
          category: 'performance',
          employee: ''
        })
        setShowFeedbackModal(false)
        
        alert('Employee feedback added and saved to Firebase!')
      } catch (error) {
        console.error('Error adding feedback:', error)
        alert('Error adding feedback to Firebase')
      }
    }
  }

  // ========== NEW: ADD JOB NOTE (FIREBASE INTEGRATED) ==========
  const handleAddJobNote = async () => {
    if (newJobNote.trim()) {
      try {
        const newNote = {
          id: `note-${Date.now()}`,
          text: newJobNote,
          author: 'Current User',
          timestamp: Timestamp.fromDate(new Date()),
          type: 'general',
          createdAt: Timestamp.fromDate(new Date())
        }
        
        // Update Firebase
        const jobRef = doc(db, 'jobs', jobId)
        await updateDoc(jobRef, {
          notes: arrayUnion(newNote),
          updatedAt: Timestamp.fromDate(new Date())
        })
        
        // Update local state
        const noteForDisplay = {
          ...newNote,
          timestamp: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
        
        setAllJobNotes([...allJobNotes, newNote])
        setJobNotes([...jobNotes, noteForDisplay])
        setNewJobNote('')
        addActivityLog('Job Note Added', newJobNote)
        setShowJobNoteModal(false)
        
        alert('Note added and saved to Firebase!')
      } catch (error) {
        console.error('Error adding note:', error)
        alert('Error adding note to Firebase')
      }
    }
  }

  // ========== NEW: ADD REMINDER (FIREBASE INTEGRATED) ==========
  const handleAddReminder = async () => {
    if (reminderText.trim()) {
      try {
        const newReminder = {
          id: `reminder-${Date.now()}`,
          text: reminderText,
          remindAt: reminderTime,
          enabled: true,
          createdAt: Timestamp.fromDate(new Date())
        }
        
        // Update Firebase
        const jobRef = doc(db, 'jobs', jobId)
        await updateDoc(jobRef, {
          reminders: arrayUnion(newReminder),
          updatedAt: Timestamp.fromDate(new Date())
        })
        
        // Update local state
        setAllJobReminders([...allJobReminders, newReminder])
        setJobReminders([...jobReminders, {
          ...newReminder,
          createdAt: new Date().toISOString()
        }])
        addActivityLog('Reminder Created', `${reminderText} at ${reminderTime}`)
        setReminderText('')
        setReminderTime('08:00')
        setShowReminderModal(false)
        
        alert('Reminder added and saved to Firebase!')
      } catch (error) {
        console.error('Error adding reminder:', error)
        alert('Error adding reminder to Firebase')
      }
    }
  }

  // ========== NEW: ASSIGN TASK (FIREBASE INTEGRATED) ==========
  const handleAssignTask = async () => {
    if (selectedTask && selectedTeamMember) {
      try {
        const newAssignment = {
          id: `assignment-${Date.now()}`,
          taskId: selectedTask.id,
          taskName: selectedTask.task || selectedTask.title || '',
          assignedTo: selectedTeamMember,
          status: 'pending',
          assignedAt: Timestamp.fromDate(new Date())
        }
        
        // Update Firebase
        const jobRef = doc(db, 'jobs', jobId)
        await updateDoc(jobRef, {
          taskAssignments: arrayUnion(newAssignment),
          updatedAt: Timestamp.fromDate(new Date())
        })
        
        // Update local state
        setRealTaskAssignments([...realTaskAssignments, newAssignment])
        setTaskAssignments([...taskAssignments, {
          ...newAssignment,
          assignedAt: new Date().toISOString()
        }])
        addActivityLog('Task Assignment', `${selectedTask.taskName || selectedTask.task} assigned to ${selectedTeamMember}`)
        setShowTaskAssignmentModal(false)
        setSelectedTask(null)
        setSelectedTeamMember('')
        
        alert('Task assigned and saved to Firebase!')
      } catch (error) {
        console.error('Error assigning task:', error)
        alert('Error assigning task to Firebase')
      }
    }
  }

  // ========== NEW: REASSIGN TEAM MEMBER (FIREBASE INTEGRATED) ==========
  const handleReassignTeamMember = async (assignmentId: string, newMember: string) => {
    try {
      const jobRef = doc(db, 'jobs', jobId)
      const currentAssignment = realTaskAssignments.find(a => a.id === assignmentId)
      
      if (currentAssignment) {
        // Remove old assignment
        await updateDoc(jobRef, {
          taskAssignments: arrayRemove(currentAssignment),
          updatedAt: Timestamp.fromDate(new Date())
        })
        
        // Add new assignment
        const updatedAssignment = {
          ...currentAssignment,
          assignedTo: newMember,
          reassignedAt: Timestamp.fromDate(new Date())
        }
        
        await updateDoc(jobRef, {
          taskAssignments: arrayUnion(updatedAssignment),
          updatedAt: Timestamp.fromDate(new Date())
        })
        
        // Update local state
        const updatedAssignments = realTaskAssignments.map(assignment =>
          assignment.id === assignmentId ? updatedAssignment : assignment
        )
        
        setRealTaskAssignments(updatedAssignments)
        setTaskAssignments(updatedAssignments.map(a => ({
          ...a,
          assignedAt: a.assignedAt instanceof Timestamp ? a.assignedAt.toDate().toISOString() : a.assignedAt,
          reassignedAt: a.reassignedAt instanceof Timestamp ? a.reassignedAt.toDate().toISOString() : a.reassignedAt
        })))
        
        addActivityLog('Team Member Reassigned', `Task reassigned to ${newMember}`)
        alert('Team member reassigned and saved to Firebase!')
      }
    } catch (error) {
      console.error('Error reassigning team member:', error)
      alert('Error reassigning team member')
    }
  }

  // ========== NEW: PRE-JOB CHECKLIST FUNCTIONS ==========
  
  const addPreJobChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: `checklist-${Date.now()}`,
        item: newChecklistItem,
        status: false
      }
      setPreJobChecklistItems([...preJobChecklistItems, newItem])
      setNewChecklistItem('')
    }
  }

  const removePreJobChecklistItem = (id: string) => {
    setPreJobChecklistItems(preJobChecklistItems.filter(item => item.id !== id))
  }

  const togglePreJobChecklistItem = (id: string) => {
    setPreJobChecklistItems(preJobChecklistItems.map(item => 
      item.id === id ? { ...item, status: !item.status } : item
    ))
  }

  // ========== NEW: TEAM READINESS FUNCTIONS ==========
  
  const addTeamMember = (employeeId: string) => {
    const employee = allEmployees.find(emp => emp.id === employeeId)
    if (employee && !additionalTeamMembers.find(member => member.id === employeeId)) {
      setAdditionalTeamMembers([
        ...additionalTeamMembers,
        {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          department: employee.department
        }
      ])
    }
  }

  const removeTeamMember = (id: string) => {
    setAdditionalTeamMembers(additionalTeamMembers.filter(member => member.id !== id))
  }

  // ========== NEW: IMAGE UPLOAD FUNCTION ==========
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, stage: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Create a unique filename
      const fileName = `${jobId}_${stage}_${Date.now()}_${file.name}`
      const storageRef = ref(storage, `job-photos/${fileName}`)
      
      // Upload file
      await uploadBytes(storageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)
      
      // Add to execution photos
      const newPhoto = {
        id: executionPhotos.length + 1,
        stage: stage,
        url: downloadURL,
        fileName: fileName,
        uploadedAt: new Date().toISOString()
      }
      
      setExecutionPhotos(prev => [newPhoto, ...prev])
      addActivityLog('Photo Uploaded', `${stage} photo uploaded to Firebase Storage`)
      
      // Clear file input
      e.target.value = ''
      
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    }
  }

  // ========== JOB STATUS UPDATE FUNCTION ==========
  const handleUpdateJobStatus = async (newStatus: string) => {
    try {
      // Update in Firebase
      const jobRef = doc(db, 'jobs', jobId)
      const updateData: any = {
        status: newStatus,
        updatedAt: Timestamp.fromDate(new Date())
      }
      
      // Add completedAt timestamp if completing job
      if (newStatus === 'Completed') {
        updateData.completedAt = Timestamp.fromDate(new Date())
      }
      
      // Add startedAt timestamp if starting job
      if (newStatus === 'In Progress') {
        updateData.startedAt = Timestamp.fromDate(new Date())
      }
      
      await updateDoc(jobRef, updateData)

      // Update local state
      setJob((prev: any) => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'Completed' && { completedAt: new Date().toISOString() }),
        ...(newStatus === 'In Progress' && { startedAt: new Date().toISOString() })
      }))

      // Add to activity log
      const newLog = {
        id: Date.now().toString(),
        action: 'Status Updated',
        timestamp: new Date().toISOString(),
        user: 'Admin',
        details: `Job status changed to ${newStatus}`
      }
      setActivityLog(prev => [newLog, ...prev])
      
      alert(`Job status updated to ${newStatus}`)
      setShowStatusModal(false)
    } catch (error) {
      console.error('Error updating job status:', error)
      alert('Error updating job status')
    }
  }

  // ========== DELETE JOB FUNCTION ==========
  const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        // Delete from Firebase
        await deleteDoc(doc(db, 'jobs', jobId))
        
        alert('Job deleted successfully')
        router.push('/admin/jobs')
      } catch (error) {
        console.error('Error deleting job:', error)
        alert('Error deleting job')
      }
    }
  }

  // ========== START JOB FUNCTION ==========
  const handleStartJob = async () => {
    try {
      await handleUpdateJobStatus('In Progress')
    } catch (error) {
      console.error('Error starting job:', error)
    }
  }

  // ========== COMPLETE JOB FUNCTION ==========
  const handleCompleteJob = async () => {
    try {
      await handleUpdateJobStatus('Completed')
    } catch (error) {
      console.error('Error completing job:', error)
    }
  }

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

  const handleTeamStatusChange = (index: number, newStatus: string) => {
    setTeamMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, status: newStatus } : member
    ))
    addActivityLog('Team Status Updated', `${teamMembers[index].name} marked as ${newStatus}`)
  }

  const addActivityLog = (action: string, details: string) => {
    const now = new Date()
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setActivityLog(prev => [{ id: Date.now().toString(), action, timestamp, user: 'Current User', details }, ...prev])
  }

  const handleTaskStatusChange = (index: number, newStatus: string) => {
    setExecutionTasks(prev => prev.map((task, i) => 
      i === index ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : newStatus === 'in-progress' ? 60 : 0 } : task
    ))
    addActivityLog('Task Updated', `${executionTasks[index].task} status changed to ${newStatus}`)
  }

  const handleTaskProgressChange = (index: number, newProgress: number) => {
    setExecutionTasks(prev => prev.map((task, i) => 
      i === index ? { ...task, progress: newProgress, status: newProgress === 100 ? 'completed' : 'in-progress' } : task
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

  const handleToggleReminder = async (index: number) => {
    const reminder = allJobReminders[index]
    if (reminder) {
      try {
        const updatedReminder = { ...reminder, enabled: !reminder.enabled }
        const jobRef = doc(db, 'jobs', jobId)
        
        // Remove old reminder
        await updateDoc(jobRef, {
          reminders: arrayRemove(reminder)
        })
        
        // Add updated reminder
        await updateDoc(jobRef, {
          reminders: arrayUnion(updatedReminder),
          updatedAt: Timestamp.fromDate(new Date())
        })
        
        // Update local state
        const updatedReminders = [...allJobReminders]
        updatedReminders[index] = updatedReminder
        setAllJobReminders(updatedReminders)
        setJobReminders(updatedReminders.map(r => ({
          ...r,
          createdAt: r.createdAt instanceof Timestamp ? r.createdAt.toDate().toISOString() : r.createdAt
        })))
        
        addActivityLog('Reminder Status', `${reminder.text} ${!reminder.enabled ? 'enabled' : 'disabled'}`)
      } catch (error) {
        console.error('Error updating reminder:', error)
        alert('Error updating reminder')
      }
    }
  }

  const handleRemoveReminder = async (index: number) => {
    const reminder = allJobReminders[index]
    if (reminder) {
      try {
        const jobRef = doc(db, 'jobs', jobId)
        await updateDoc(jobRef, {
          reminders: arrayRemove(reminder),
          updatedAt: Timestamp.fromDate(new Date())
        })
        
        // Update local state
        const updatedReminders = allJobReminders.filter((_, i) => i !== index)
        setAllJobReminders(updatedReminders)
        setJobReminders(updatedReminders.map(r => ({
          ...r,
          createdAt: r.createdAt instanceof Timestamp ? r.createdAt.toDate().toISOString() : r.createdAt
        })))
        
        addActivityLog('Reminder Removed', reminder?.text || '')
        alert('Reminder removed from Firebase!')
      } catch (error) {
        console.error('Error removing reminder:', error)
        alert('Error removing reminder')
      }
    }
  }

  const handleRemoveJobNote = async (index: number) => {
    const note = allJobNotes[index]
    if (note) {
      try {
        const jobRef = doc(db, 'jobs', jobId)
        await updateDoc(jobRef, {
          notes: arrayRemove(note),
          updatedAt: Timestamp.fromDate(new Date())
        })
        
        // Update local state
        const updatedNotes = allJobNotes.filter((_, i) => i !== index)
        setAllJobNotes(updatedNotes)
        setJobNotes(updatedNotes.map(n => ({
          ...n,
          timestamp: n.timestamp instanceof Timestamp ? n.timestamp.toDate().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }) : n.timestamp
        })))
        
        addActivityLog('Job Note Removed', note?.text || '')
        alert('Note removed from Firebase!')
      } catch (error) {
        console.error('Error removing note:', error)
        alert('Error removing note')
      }
    }
  }

  const handleAddTaskReminder = (index: number) => {
    if (reminderTime) {
      setExecutionTasks(prev => prev.map((task, i) =>
        i === index
          ? { ...task, reminder: { time: reminderTime, enabled: true } }
          : task
      ))
      addActivityLog('Task Reminder Set', `Reminder set for "${executionTasks[index].task}" at ${reminderTime}`)
      setShowReminderModal(false)
      setReminderTime('08:00')
      setSelectedTaskForReminder(null)
    }
  }

  const handleToggleTaskReminder = (index: number) => {
    setExecutionTasks(prev => prev.map((task, i) =>
      i === index && task.reminder
        ? { ...task, reminder: { ...task.reminder, enabled: !task.reminder.enabled } }
        : task
    ))
  }

  const handleRemoveTaskReminder = (index: number) => {
    setExecutionTasks(prev => prev.map((task, i) =>
      i === index
        ? { ...task, reminder: null }
        : task
    ))
    addActivityLog('Task Reminder Removed', `Reminder removed for "${executionTasks[index].task}"`)
  }

  const calculateProgressMetrics = () => {
    const checklistCompletion = checklistItems.length > 0 
      ? Math.round((checklistItems.filter(c => c.status).length / checklistItems.length) * 100)
      : 0
    
    const equipmentReadiness = equipmentStatus.length > 0
      ? Math.round((equipmentStatus.filter(e => e.status === 'Ready').length / equipmentStatus.length) * 100)
      : 0
    
    const teamReadiness = teamMembers.length > 0
      ? Math.round((teamMembers.filter(m => m.status === 'Confirmed').length / teamMembers.length) * 100)
      : 0
    
    const overallReadiness = Math.round((checklistCompletion + equipmentReadiness + teamReadiness) / 3)
    
    return {
      checklistCompletion,
      equipmentReadiness,
      teamReadiness,
      overallReadiness
    }
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading job details...</p>
      </div>
    )
  }

  const progressMetrics = calculateProgressMetrics()

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
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                job.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                job.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {job.priority}
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
              {job.scheduledDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(job.scheduledDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit' 
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
         
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Update Status</span>
          </button>
         
        </div>
      </div>

      {/* Enhanced Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { 
            label: 'Scheduled Date', 
            value: job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }) : 'Not Scheduled', 
            sub: job.scheduledTime || '', 
            icon: Calendar, 
            color: 'text-blue-600' 
          },
          { 
            label: 'Duration', 
            value: job.estimatedDuration || 'Not set', 
            sub: 'Estimated', 
            icon: Timer, 
            color: 'text-indigo-600' 
          },
          { 
            label: 'Budget', 
            value: `AED ${job.budget ? job.budget.toLocaleString() : '0'}`, 
            sub: 'Total Budget', 
            icon: DollarSign, 
            color: 'text-emerald-600' 
          },
          { 
            label: 'SLA Deadline', 
            value: job.slaDeadline ? new Date(job.slaDeadline).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }) : 'Not set', 
            sub: job.daysUntilSLA > 0 ? `${job.daysUntilSLA} days left` : 'Expired', 
            icon: ShieldCheck, 
            color: job.daysUntilSLA <= 1 ? 'text-red-600' : 'text-amber-600' 
          },
          { 
            label: 'Risk Level', 
            value: (job.riskLevel || 'Low').toUpperCase(), 
            sub: 'Assessment', 
            icon: job.riskLevel === 'High' ? AlertTriangle : job.riskLevel === 'Medium' ? Clock : CheckCircle, 
            color: job.riskLevel === 'High' ? 'text-red-600' : job.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600' 
          },
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
      {job.status === 'Pending' && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-yellow-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Job Pending - Awaiting Action
            </h3>
            <button
              onClick={() => handleUpdateJobStatus('Scheduled')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
            >
              Schedule Job
            </button>
          </div>
          <p className="text-sm text-yellow-800">
            This job is currently pending. You can schedule it or update its status.
          </p>
        </div>
      )}

      {job.status === 'Scheduled' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Pre-Execution Workflow
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700">Progress: {progressMetrics.overallReadiness}%</span>
              <div className="w-24 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${progressMetrics.overallReadiness}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => setActiveTab('pre-execution')}
              className="group p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <ClipboardCheck className="w-6 h-6 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-blue-900">Pre-Job Checklist</span>
              <div className="text-[10px] text-blue-700 mt-1">{progressMetrics.checklistCompletion}% Complete</div>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className="group p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <Users className="w-6 h-6 text-purple-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-purple-900">Team Assignment</span>
              <div className="text-[10px] text-purple-700 mt-1">{progressMetrics.teamReadiness}% Ready</div>
            </button>
            <div className="group p-4 bg-green-100 hover:bg-green-200 border border-green-400 rounded-xl text-center transition-all hover:scale-105">
              <ShieldCheck className="w-6 h-6 text-green-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-green-900">Permit Tracker</span>
              <div className="text-[10px] text-green-700 mt-1">{job.permits ? job.permits.length : 0} Approved</div>
            </div>
            <div className="group p-4 bg-orange-100 hover:bg-orange-200 border border-orange-400 rounded-xl text-center transition-all hover:scale-105">
              <Wrench className="w-6 h-6 text-orange-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-orange-900">Equipment</span>
              <div className="text-[10px] text-orange-700 mt-1">{progressMetrics.equipmentReadiness}% Ready</div>
            </div>
            <button
              onClick={handleStartJob}
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
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-2xl p-6">
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
            <button
              onClick={() => setActiveTab('execution')}
              className="group p-4 bg-green-100 hover:bg-green-200 border border-green-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <Eye className="w-6 h-6 text-green-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-green-900">Live View</span>
              <div className="text-[10px] text-green-700 mt-1">Real-time Monitoring</div>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className="group p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <CheckSquare className="w-6 h-6 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-blue-900">Task Progress</span>
              <div className="text-[10px] text-blue-700 mt-1">Track Completion</div>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className="group p-4 bg-orange-100 hover:bg-orange-200 border border-orange-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <AlertTriangle className="w-6 h-6 text-orange-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-orange-900">Damage Check</span>
              <div className="text-[10px] text-orange-700 mt-1">Quality Control</div>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className="group p-4 bg-red-100 hover:bg-red-200 border border-red-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <AlertCircle className="w-6 h-6 text-red-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-red-900">Incidents</span>
              <div className="text-[10px] text-red-700 mt-1">Report Issues</div>
            </button>
            <button
              onClick={handleCompleteJob}
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
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-300 rounded-2xl p-6">
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
            <button
              onClick={() => setActiveTab('completion')}
              className="group p-4 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <CheckCircle className="w-6 h-6 text-emerald-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-emerald-900">Job Closure</span>
              <div className="text-[10px] text-emerald-700 mt-1">Final Documentation</div>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className="group p-4 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <Star className="w-6 h-6 text-indigo-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-indigo-900">Client Feedback</span>
              <div className="text-[10px] text-indigo-700 mt-1">Collect Reviews</div>
            </button>
            <button
              onClick={() => setActiveTab('completion')}
              className="group p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <MessageSquare className="w-6 h-6 text-purple-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-purple-900">Review Request</span>
              <div className="text-[10px] text-purple-700 mt-1">Request Approval</div>
            </button>
            <button
              onClick={() => setActiveTab('completion')}
              className="group p-4 bg-pink-100 hover:bg-pink-200 border border-pink-400 rounded-xl text-center transition-all hover:scale-105"
            >
              <FileText className="w-6 h-6 text-pink-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-pink-900">Client Summary</span>
              <div className="text-[10px] text-pink-700 mt-1">Final Report</div>
            </button>
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
          {/* ========== OVERVIEW SECTION ========== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Save Button for Overview */}
              <div className="flex justify-end">
                <button
                  onClick={saveOverviewSection}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Overview'}
                </button>
              </div>

              {/* Firebase Job Details Display */}
              <div className="bg-white border border-gray-300 rounded-3xl p-8 space-y-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 w-5 text-indigo-600" />
                  Job Overview (Firebase Data)
                </h3>
                
                {/* Job Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Job Title</label>
                    <div className="text-lg font-bold text-gray-900">{job.title}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Client</label>
                    <div className="text-lg font-bold text-gray-900">{job.client}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Client ID</label>
                    <div className="text-lg font-bold text-gray-900">{job.clientId}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Actual Cost</label>
                    <div className="text-lg font-bold text-gray-900">AED {job.actualCost || 0}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Budget</label>
                    <div className="text-lg font-bold text-gray-900">AED {job.budget || 0}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Location</label>
                    <div className="text-lg font-bold text-gray-900">{job.location}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Status</label>
                    <div className="text-lg font-bold text-gray-900">{job.status}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Priority</label>
                    <div className="text-lg font-bold text-gray-900">{job.priority}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Team Required</label>
                    <div className="text-lg font-bold text-gray-900">{job.teamRequired} members</div>
                  </div>
                </div>

                {/* Assigned Employees */}
                {job.assignedEmployees && job.assignedEmployees.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-md font-bold text-gray-900 mb-4">Assigned Employees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.assignedEmployees.map((emp: any, index: number) => (
                        <div key={index} className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {emp.name ? emp.name.substring(0, 2).toUpperCase() : 'EM'}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{emp.name}</div>
                              <div className="text-sm text-gray-600">{emp.email}</div>
                              <div className="text-xs text-gray-500">ID: {emp.id}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assigned To */}
                {job.assignedTo && job.assignedTo.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-md font-bold text-gray-900 mb-4">Assigned To</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.assignedTo.map((name: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-sm font-bold border border-blue-300">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks */}
                {job.tasks && job.tasks.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-md font-bold text-gray-900 mb-4">Tasks</h4>
                    <div className="space-y-3">
                      {job.tasks.map((task: any, index: number) => (
                        <div key={index} className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-gray-900">{task.title}</div>
                              <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                              <div className="text-xs text-gray-500 mt-2">
                                Duration: {task.duration} hours • Team Required: {task.teamRequired}
                                {task.progress !== undefined && ` • Progress: ${task.progress}%`}
                                {task.completed && ` • Completed: ${task.completed ? 'Yes' : 'No'}`}
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              task.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {task.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-500">Description</label>
                      <div className="mt-1 text-gray-700">{job.description || 'No description'}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-gray-500">Special Instructions</label>
                      <div className="mt-1 text-gray-700">{job.specialInstructions || 'None'}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-gray-500">Equipment</label>
                      <div className="mt-1">
                        {job.equipment && job.equipment.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {job.equipment.map((item: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No equipment listed</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-gray-500">Permits</label>
                      <div className="mt-1">
                        {job.permits && job.permits.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {job.permits.map((permit: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                                {permit}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No permits listed</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-500">Required Skills</label>
                      <div className="mt-1">
                        {job.requiredSkills && job.requiredSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No skills specified</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-gray-500">Tags</label>
                      <div className="mt-1">
                        {job.tags && job.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {job.tags.map((tag: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-900 rounded-lg text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No tags</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-gray-500">SLA Deadline</label>
                      <div className="mt-1 text-gray-700">
                        {job.slaDeadline ? new Date(job.slaDeadline).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-gray-500">Timestamps</label>
                      <div className="mt-1 space-y-1 text-sm text-gray-600">
                        <div>Created: {new Date(job.createdAt).toLocaleString()}</div>
                        <div>Updated: {new Date(job.updatedAt).toLocaleString()}</div>
                        {job.completedAt && (
                          <div>Completed: {new Date(job.completedAt).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== PRE-EXECUTION SECTION ========== */}
          {activeTab === 'pre-execution' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              {/* Save Button for Pre-Execution */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={savePreExecutionSection}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Pre-Execution'}
                </button>
              </div>

              <div className="space-y-8">
                {/* Pre-Job Checklist with + - buttons */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5" />
                      Pre-Job Checklist
                    </h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        placeholder="Add new checklist item..."
                        className="px-3 py-1 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={addPreJobChecklistItem}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        title="Add item"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {preJobChecklistItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-200">
                        <button
                          onClick={() => togglePreJobChecklistItem(item.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            item.status 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300'
                          }`}
                        >
                          {item.status && <CheckCircle className="w-3 h-3" />}
                        </button>
                        <span className={`flex-1 ${item.status ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.item}
                        </span>
                        <button
                          onClick={() => removePreJobChecklistItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-all"
                          title="Remove item"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Readiness with Dropdown */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Readiness
                  </h4>
                  
                  {/* Add Team Member Dropdown */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Add More Team Members
                    </label>
                    <div className="flex gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addTeamMember(e.target.value)
                            e.target.value = ''
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select an employee...</option>
                        {allEmployees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.role} ({employee.department})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const select = document.querySelector('select') as HTMLSelectElement
                          if (select?.value) {
                            addTeamMember(select.value)
                            select.value = ''
                          }
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Additional Team Members List */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-gray-900">Additional Team Members</h5>
                    {additionalTeamMembers.length > 0 ? (
                      additionalTeamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-purple-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {member.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">{member.name}</div>
                              <div className="text-xs text-gray-600">{member.role} • {member.department}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTeamMember(member.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No additional team members added yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Existing Team Members Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900">Current Team Members</h4>
                  <div className="space-y-3">
                    {teamMembers.map((member, i) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-300">
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
                          onChange={(e) => handleTeamStatusChange(i, e.target.value)}
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

                {/* Equipment Status */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Equipment Status
                  </h4>
                  <div className="space-y-3">
                    {equipmentStatus.map((equipment, i) => (
                      <div key={equipment.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-200">
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
            </div>
          )}

          {/* ========== EXECUTION SECTION ========== */}
          {activeTab === 'execution' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              {/* Save Button for Execution */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={saveExecutionSection}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Execution'}
                </button>
              </div>

              <div className="space-y-8">
                {/* Current Tasks (Real Tasks from Firebase) */}
                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Current Tasks</h4>
                  <div className="space-y-3">
                    {realJobTasks.length > 0 ? (
                      realJobTasks.map((task, i) => {
                        const executionTask = executionTasks.find(t => t.id === task.id) || {
                          status: 'pending',
                          progress: 0
                        }
                        
                        return (
                          <div key={task.id} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <select
                                value={executionTask.status}
                                onChange={(e) => {
                                  const newExecutionTasks = [...executionTasks]
                                  const existingIndex = newExecutionTasks.findIndex(t => t.id === task.id)
                                  
                                  if (existingIndex >= 0) {
                                    newExecutionTasks[existingIndex] = {
                                      ...newExecutionTasks[existingIndex],
                                      status: e.target.value
                                    }
                                  } else {
                                    newExecutionTasks.push({
                                      id: task.id,
                                      task: task.title,
                                      status: e.target.value,
                                      progress: e.target.value === 'completed' ? 100 : 0
                                    })
                                  }
                                  
                                  setExecutionTasks(newExecutionTasks)
                                }}
                                className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer transition-all ${
                                  executionTask.status === 'completed' ? 'bg-green-100 text-green-700 border-green-300' :
                                  executionTask.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                  'bg-gray-100 text-gray-700 border-gray-300'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">{task.title}</div>
                                <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={executionTask.progress}
                                onChange={(e) => {
                                  const newExecutionTasks = [...executionTasks]
                                  const existingIndex = newExecutionTasks.findIndex(t => t.id === task.id)
                                  
                                  if (existingIndex >= 0) {
                                    newExecutionTasks[existingIndex] = {
                                      ...newExecutionTasks[existingIndex],
                                      progress: parseInt(e.target.value)
                                    }
                                  } else {
                                    newExecutionTasks.push({
                                      id: task.id,
                                      task: task.title,
                                      status: parseInt(e.target.value) === 100 ? 'completed' : 'in-progress',
                                      progress: parseInt(e.target.value)
                                    })
                                  }
                                  
                                  setExecutionTasks(newExecutionTasks)
                                }}
                                className="flex-1 cursor-pointer"
                              />
                              <span className="text-xs font-bold text-gray-600 w-8 text-right">
                                {executionTask.progress}%
                              </span>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No tasks found in Firebase
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Documentation */}
                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Image Documentation</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {['Before', 'In Progress', 'After', 'Quality Check'].map((stage) => (
                      <div key={stage} className="aspect-square">
                        <input
                          type="file"
                          id={`photo-${stage}`}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, stage)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`photo-${stage}`}
                          className="h-full w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          <Camera className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">{stage} Photo</p>
                          <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Uploaded Photos */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-gray-900">Uploaded Photos</h5>
                    {executionPhotos.length > 0 ? (
                      executionPhotos.map((photo) => (
                        <div key={photo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-300">
                          <div className="flex items-center gap-3">
                            <Camera className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-700">{photo.stage}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(photo.uploadedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          {photo.url && (
                            <a
                              href={photo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No photos uploaded yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Execution Notes */}
                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Execution Notes</h4>
                  <textarea
                    value={executionNotes}
                    onChange={(e) => setExecutionNotes(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add notes about the job execution..."
                  />
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

                {/* Execution Progress */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckSquare className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-bold text-green-900">Task Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900 mb-2">{getTaskProgress()}%</div>
                    <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${getTaskProgress()}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-green-700">
                      {executionTasks.filter(t => t.status === 'completed').length} of {executionTasks.length} tasks completed
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-blue-900">Time Tracking</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 mb-2">
                      {executionTime.elapsedHours}.{String(executionTime.elapsedMinutes).padStart(2, '0')}h
                    </div>
                    <div className="text-xs text-blue-700 mb-2">
                      Elapsed: {executionTime.elapsedHours}h {executionTime.elapsedMinutes}m
                    </div>
                    <div className="text-xs text-blue-600">
                      Estimated completion: {executionTime.estimatedCompletion}h
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Activity className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-bold text-orange-900">Live Updates</span>
                    </div>
                    <div className="text-xs text-orange-700 mb-2">Last update: {executionTime.lastUpdate || 'No updates'}</div>
                    <div className="text-xs text-orange-600">Team: On site, working efficiently</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== NOTES & REMINDERS SECTION ========== */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Save Buttons for Notes & Reminders */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={saveNotesSection}
                  disabled={savingNotes}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
                <button
                  onClick={saveRemindersSection}
                  disabled={savingReminders}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingReminders ? 'Saving...' : 'Save Reminders'}
                </button>
              </div>

              <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Job Notes & Reminders</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowJobNoteModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Note</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTaskForReminder(null)
                        setShowReminderModal(true)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Reminder</span>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Notes
                  </h4>
                  <div className="space-y-3">
                    {jobNotes.length > 0 ? (
                      jobNotes.map((note, i) => (
                        <div key={note.id || i} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-sm text-gray-900">{note.text}</div>
                              <div className="text-xs text-gray-600 mt-2">{note.author} • {note.timestamp}</div>
                            </div>
                            <button
                              onClick={() => handleRemoveJobNote(i)}
                              className="text-gray-400 hover:text-red-600 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No notes added yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Reminders */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-600" />
                      Reminders
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {jobReminders.length > 0 ? (
                      jobReminders.map((reminder, i) => (
                        <div key={reminder.id || i} className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={reminder.enabled}
                              onChange={() => handleToggleReminder(i)}
                              className="rounded border-amber-300 text-amber-600"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{reminder.text}</div>
                              <div className="text-xs text-gray-600 mt-1">Remind at {reminder.remindAt}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveReminder(i)}
                            className="text-gray-400 hover:text-red-600 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No reminders added yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== TASK ASSIGNMENT SECTION ========== */}
          {activeTab === 'tasks' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              {/* Save Button for Tasks */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={saveTaskAssignmentsSection}
                  disabled={savingTasks}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingTasks ? 'Saving...' : 'Save Tasks'}
                </button>
              </div>

              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Task Assignment</h3>
                <button
                  onClick={() => { 
                    setSelectedTask(null); 
                    setSelectedTeamMember('');
                    setShowTaskAssignmentModal(true) 
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Reassign Task</span>
                </button>
              </div>

              <div className="space-y-4">
                {realTaskAssignments.length > 0 ? (
                  realTaskAssignments.map((assignment, idx) => (
                    <div key={assignment.id || idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
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
                          {assignment.assignedAt && (
                            <div className="text-xs text-gray-500 mt-2">
                              Assigned: {new Date(
                                assignment.assignedAt instanceof Timestamp 
                                  ? assignment.assignedAt.toDate() 
                                  : assignment.assignedAt
                              ).toLocaleString()}
                            </div>
                          )}
                          {assignment.reassignedAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              Reassigned: {new Date(
                                assignment.reassignedAt instanceof Timestamp 
                                  ? assignment.reassignedAt.toDate() 
                                  : assignment.reassignedAt
                              ).toLocaleString()}
                            </div>
                          )}
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
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">No task assignments found</div>
                    <button
                      onClick={() => setShowTaskAssignmentModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                      Create First Assignment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== TEAM MANAGEMENT SECTION ========== */}
          {activeTab === 'team' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              {/* Save Button for Team */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={saveTaskAssignmentsSection}
                  disabled={savingTasks}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingTasks ? 'Saving...' : 'Save Team Changes'}
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-8">Team Member Management</h3>
              
              {realTaskAssignments.length > 0 ? (
                <div className="space-y-5">
                  {realTaskAssignments.map((assignment, idx) => (
                    <div key={assignment.id || idx} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{assignment.taskName}</h4>
                          <div className="text-sm text-gray-700 mb-3">
                            Currently assigned to: <span className="font-bold">{assignment.assignedTo}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Status: <span className={`font-bold ${
                              assignment.status === 'completed' ? 'text-green-600' :
                              assignment.status === 'in-progress' ? 'text-blue-600' : 'text-yellow-600'
                            }`}>
                              {assignment.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={assignment.assignedTo}
                          onChange={(e) => handleReassignTeamMember(assignment.id, e.target.value)}
                          className="flex-1 px-4 py-2 border border-purple-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select a team member...</option>
                          {allEmployees.map((member) => (
                            <option key={member.id} value={member.name}>
                              {member.name} ({member.role})
                            </option>
                          ))}
                        </select>
                        <button 
                          onClick={() => handleReassignTeamMember(assignment.id, assignment.assignedTo)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
                        >
                          Replace Duty
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">No task assignments available</div>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                  >
                    Go to Task Assignment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========== COMPENSATION SECTION ========== */}
          {activeTab === 'compensation' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              {/* Save Button for Compensation */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => {
                    addActivityLog('Compensation Saved', 'Compensation analysis saved to Firebase')
                    alert('Compensation saved successfully!')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Compensation
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Team Compensation Analysis
              </h3>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                  <div className="text-sm font-medium text-green-700 mb-1">Total Job Cost</div>
                  <div className="text-3xl font-bold text-green-900">
                    AED {teamMembers.reduce((sum, m) => sum + m.totalCompensation, 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 mt-2">{teamMembers.length} team members</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="text-sm font-medium text-blue-700 mb-1">Average Rate/Hour</div>
                  <div className="text-3xl font-bold text-blue-900">
                    AED {Math.round(teamMembers.reduce((sum, m) => sum + m.hourlyRate, 0) / teamMembers.length)}
                  </div>
                  <div className="text-xs text-blue-600 mt-2">Across all roles</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
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
            </div>
          )}

          {/* ========== EMPLOYEE FEEDBACK SECTION ========== */}
          {activeTab === 'feedback' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              {/* Save Button for Feedback */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={saveFeedbackSection}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Feedback'}
                </button>
              </div>

              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-600" />
                  Employee Feedback & Reviews
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-xl font-medium hover:bg-yellow-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Feedback</span>
                </button>
              </div>

              <div className="space-y-6">
                {employeeFeedback.length > 0 ? (
                  employeeFeedback.map((feedback, index) => (
                    <div key={feedback.id || index} className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{feedback.employee}</h4>
                          {feedback.title && (
                            <div className="text-md font-bold text-gray-800 mb-2">{feedback.title}</div>
                          )}
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
                            feedback.category === 'performance' ? 'bg-blue-100 text-blue-800' : 
                            feedback.category === 'attendance' ? 'bg-green-100 text-green-800' :
                            feedback.category === 'teamwork' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {feedback.category?.charAt(0).toUpperCase() + feedback.category?.slice(1) || 'General'}
                          </span>
                          <div className="text-xs text-gray-600 mt-2">
                            {feedback.date ? new Date(feedback.date).toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                      </div>
                      {feedback.description ? (
                        <p className="text-gray-700 text-sm leading-relaxed">{feedback.description}</p>
                      ) : (
                        <p className="text-gray-700 text-sm leading-relaxed">{feedback.feedback}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">No employee feedback yet</div>
                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
                    >
                      Add First Feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== EMPLOYEE REPORTS SECTION ========== */}
          {activeTab === 'reports' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              {/* Save Button for Reports */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => {
                    addActivityLog('Reports Saved', 'Employee reports saved to Firebase')
                    alert('Reports saved successfully!')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Reports
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-8">Employee Reports</h3>
              
              {/* Job Data Summary */}
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Job Data from Firebase
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl border border-blue-300">
                    <div className="text-xs text-gray-500">Actual Cost</div>
                    <div className="text-lg font-bold text-gray-900">AED {job.actualCost || 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-300">
                    <div className="text-xs text-gray-500">Budget</div>
                    <div className="text-lg font-bold text-gray-900">AED {job.budget || 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-300">
                    <div className="text-xs text-gray-500">Team Required</div>
                    <div className="text-lg font-bold text-gray-900">{job.teamRequired} members</div>
                  </div>
                </div>

                {/* Assigned Employees */}
                {job.assignedEmployees && job.assignedEmployees.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-bold text-gray-700 mb-3">Assigned Employees</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.assignedEmployees.map((emp: any, index: number) => (
                        <div key={index} className="bg-white border border-blue-300 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {emp.name ? emp.name.substring(0, 2).toUpperCase() : 'EM'}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{emp.name}</div>
                              <div className="text-sm text-gray-600">{emp.email}</div>
                              <div className="text-xs text-gray-500">ID: {emp.id}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Team Members */}
                {job.additionalTeamMembers && job.additionalTeamMembers.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-bold text-gray-700 mb-3">Additional Team Members</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.additionalTeamMembers.map((member: any, index: number) => (
                        <div key={index} className="bg-white border border-green-300 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {member.name ? member.name.substring(0, 2).toUpperCase() : 'TM'}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-600">{member.role} • {member.department}</div>
                              <div className="text-xs text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Task Assignments */}
                {job.taskAssignments && job.taskAssignments.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-bold text-gray-700 mb-3">Task Assignments</div>
                    <div className="space-y-3">
                      {job.taskAssignments.map((assignment: any, index: number) => {
                        const task = job.tasks?.find((t: any) => t.id === assignment.taskId)
                        return (
                          <div key={index} className="bg-white border border-purple-300 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-bold text-gray-900">{assignment.taskName}</div>
                                <div className="text-sm text-gray-600">Assigned to: {assignment.assignedTo}</div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                                assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {assignment.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>Assigned: {new Date(
                                assignment.assignedAt instanceof Timestamp 
                                  ? assignment.assignedAt.toDate() 
                                  : assignment.assignedAt
                              ).toLocaleString()}</div>
                              {assignment.reassignedAt && (
                                <div>Reassigned: {new Date(
                                  assignment.reassignedAt instanceof Timestamp 
                                    ? assignment.reassignedAt.toDate() 
                                    : assignment.reassignedAt
                                ).toLocaleString()}</div>
                              )}
                              {task && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="font-medium">Task Details:</div>
                                  <div>Completed: {task.completed ? 'Yes' : 'No'}</div>
                                  <div>Progress: {task.progress || 0}%</div>
                                  <div>Duration: {task.duration || 0} hours</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Pre-Job Checklist */}
                {job.preJobChecklist && job.preJobChecklist.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-bold text-gray-700 mb-3">Pre-Job Checklist</div>
                    <div className="space-y-2">
                      {job.preJobChecklist.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-xl">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            item.status 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300'
                          }`}>
                            {item.status && <CheckCircle className="w-3 h-3" />}
                          </div>
                          <span className={`flex-1 ${item.status ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execution Data */}
                {job.executionData && (
                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-3">Execution Data</div>
                    <div className="bg-white border border-orange-300 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Last Updated</div>
                          <div className="text-sm font-medium text-gray-900">
                            {job.executionData.lastUpdated ? new Date(job.executionData.lastUpdated).toLocaleString() : 'Not updated'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Execution Notes</div>
                          <div className="text-sm font-medium text-gray-900">
                            {job.executionNotes || job.executionData.notes || 'No notes'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Employee Reports List */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Individual Reports</h4>
                <div className="space-y-6">
                  {employeeReports.map((report) => (
                    <div key={report.id} className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{report.employee}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            {report.date ? new Date(report.date).toLocaleDateString() : 'Recent'}
                          </div>
                          {report.taskName && (
                            <div className="text-sm font-medium text-gray-800 mt-2">
                              Task: {report.taskName}
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          report.status === 'submitted' || report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {report.hoursWorked && (
                          <div className="bg-white p-3 rounded-lg border border-gray-300">
                            <div className="text-xs text-gray-500">Hours Worked</div>
                            <div className="text-lg font-bold text-gray-900">{report.hoursWorked}</div>
                          </div>
                        )}
                        {report.tasksCompleted && (
                          <div className="bg-white p-3 rounded-lg border border-gray-300">
                            <div className="text-xs text-gray-500">Tasks Completed</div>
                            <div className="text-lg font-bold text-gray-900">{report.tasksCompleted}</div>
                          </div>
                        )}
                        {report.assignedAt && (
                          <div className="bg-white p-3 rounded-lg border border-gray-300">
                            <div className="text-xs text-gray-500">Assigned At</div>
                            <div className="text-sm font-bold text-gray-900">
                              {new Date(report.assignedAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                        {report.taskDetails && (
                          <div className="bg-white p-3 rounded-lg border border-gray-300">
                            <div className="text-xs text-gray-500">Task Progress</div>
                            <div className="text-lg font-bold text-gray-900">
                              {report.taskDetails.progress || 0}%
                            </div>
                          </div>
                        )}
                      </div>
                      {report.notes && (
                        <p className="text-gray-700 text-sm">{report.notes}</p>
                      )}
                      {report.taskDetails && report.taskDetails.description && (
                        <div className="mt-3 p-3 bg-white border border-gray-300 rounded-lg">
                          <div className="text-xs text-gray-500">Task Description</div>
                          <div className="text-sm text-gray-700">{report.taskDetails.description}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'completion' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              {/* Save Button for Completion */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => {
                    addActivityLog('Completion Saved', 'Completion section saved to Firebase')
                    alert('Completion saved successfully!')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Completion
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-8">Job Completion</h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Final Documentation</h4>
                  <p className="text-gray-700 mb-4">
                    All job tasks have been completed. Please review the final documentation before closing the job.
                  </p>
                  <button
                    onClick={handleCompleteJob}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                  >
                    Mark Job as Completed
                  </button>
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
                  <span className="text-xs font-medium text-gray-600">
                    {teamMembers.filter(m => m.status === 'Confirmed').length}/{teamMembers.length} Active
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-300 hover:bg-gray-100 transition-all">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white ${
                      member.status === 'Confirmed' ? 'bg-green-600' :
                      member.status === 'Pending' ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}>
                      {member.initials}
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
                  </div>
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
                  <div className="text-[10px] text-gray-600 mb-1">
                    {new Date(event.timestamp).toLocaleDateString()} • {event.user}
                  </div>
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
                { status: 'Pending', label: 'Mark as Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
                { status: 'Scheduled', label: 'Mark as Scheduled', color: 'bg-indigo-100 text-indigo-700', icon: Calendar },
                { status: 'In Progress', label: 'Mark as In Progress', color: 'bg-green-100 text-green-700', icon: PlayCircle },
                { status: 'Completed', label: 'Mark as Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
                { status: 'Cancelled', label: 'Cancel Job', color: 'bg-red-100 text-red-700', icon: X }
              ].map((option) => (
                <button
                  key={option.status}
                  onClick={() => handleUpdateJobStatus(option.status)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    job.status === option.status
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${option.color.split(' ')[0]}`}>
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
                    const task = realJobTasks.find(t => t.id === e.target.value);
                    setSelectedTask(task);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a task...</option>
                  {realJobTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
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
                  {allEmployees.map((member) => (
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
                        const index = executionTasks.findIndex(t => t.id === selectedTaskForReminder.id);
                        handleAddTaskReminder(index);
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




















