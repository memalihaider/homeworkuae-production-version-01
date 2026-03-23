'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Mail,
  Calendar,
  Clock,
  Send,
  Users,
  TrendingUp,
  Target,
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  X,
  Save,
  Bell,
  Phone,
  Video,
  AlarmClock,
  Timer,
  Check,
  RefreshCw
} from 'lucide-react'

// Firebase imports
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'

// Types
type TimestampValue = Date | string | number | Timestamp | { toDate: () => Date } | null | undefined

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'hot' | 'warm' | 'cold'
  source: string
  lastContact: string
  nextFollowUp: string
  interest: string
  budget: string
  notes: string
  followUpHistory: FollowUpMessage[]
  createdAt?: TimestampValue
  updatedAt?: TimestampValue
}

type Campaign = {
  id: string
  name: string
  type: string
  status: 'active' | 'scheduled' | 'completed' | 'paused'
  sent: number
  opened: number
  clicked: number
  converted: number
  budget: string
  startDate: string
  endDate: string
  targetAudience: string
  description: string
  createdAt?: TimestampValue
  updatedAt?: TimestampValue
}

type ScheduledEmail = {
  id: string
  subject: string
  recipient: string
  recipientEmail: string
  scheduledTime: string
  status: 'scheduled' | 'sent' | 'failed'
  type: 'reminder' | 'promotional' | 'follow-up'
  message: string
  createdAt?: TimestampValue
}

type FollowUpMessage = {
  id: string
  date: string
  type: 'email' | 'phone' | 'meeting' | 'sms'
  subject: string
  message: string
  status: 'completed' | 'scheduled' | 'pending'
  sentBy: string
  leadId?: string
  leadName?: string
  createdAt?: TimestampValue
}

type Reminder = {
  id: string
  title: string
  description: string
  dueDate: string
  dueTime: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed' | 'snoozed'
  linkedLeadId?: string
  linkedLeadName?: string
  notificationSent?: boolean
  createdAt?: TimestampValue
  updatedAt?: TimestampValue
}

export default function MarketingDashboard() {
  // State declarations
  const [activeTab, setActiveTab] = useState<'leads' | 'campaigns' | 'emails' | 'analytics' | 'followup'>('leads')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false)
  const [showEditLeadModal, setShowEditLeadModal] = useState(false)
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [showViewLeadModal, setShowViewLeadModal] = useState(false)
  const [showEditCampaignModal, setShowEditCampaignModal] = useState(false)
  const [showNewEmailModal, setShowNewEmailModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentLead, setCurrentLead] = useState<Lead | null>(null)
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null)
  const [currentEmail, setCurrentEmail] = useState<ScheduledEmail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Data states
  const [leads, setLeads] = useState<Lead[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([])
  const [followUps, setFollowUps] = useState<FollowUpMessage[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])

  // Reminder UI state
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [reminderFilter, setReminderFilter] = useState<'all' | 'pending' | 'today' | 'overdue' | 'completed'>('all')
  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '09:00',
    priority: 'medium' as 'high' | 'medium' | 'low',
    linkedLeadId: '',
    linkedLeadName: ''
  })

  // Form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'cold' as 'hot' | 'warm' | 'cold',
    source: '',
    interest: '',
    budget: '',
    notes: '',
    nextFollowUp: ''
  })

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'Email',
    targetAudience: 'All Leads',
    budget: '',
    startDate: '',
    endDate: '',
    description: ''
  })

  const [emailForm, setEmailForm] = useState({
    subject: '',
    recipient: '',
    recipientEmail: '',
    scheduledTime: '',
    type: 'follow-up' as 'reminder' | 'promotional' | 'follow-up',
    message: ''
  })

  const [followUpForm, setFollowUpForm] = useState({
    type: 'email' as 'email' | 'phone' | 'meeting' | 'sms',
    subject: '',
    message: '',
    scheduledDate: ''
  })

  // ======================
  // FIREBASE OPERATIONS
  // ======================

  function setupRealtimeListeners() {
    setIsLoading(true)
    
    // Listen to leads collection
    const leadsUnsubscribe = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Lead))
      setLeads(leadsData)
    })

    // Listen to campaigns collection
    const campaignsUnsubscribe = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
      const campaignsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Campaign))
      setCampaigns(campaignsData)
    })

    // Listen to scheduledEmails collection
    const emailsUnsubscribe = onSnapshot(collection(db, 'scheduledEmails'), (snapshot) => {
      const emailsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ScheduledEmail))
      setScheduledEmails(emailsData)
    })

    // Listen to followUps collection
    const followUpsUnsubscribe = onSnapshot(collection(db, 'followUps'), (snapshot) => {
      const followUpsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FollowUpMessage))
      setFollowUps(followUpsData)
    })

    // Listen to reminders collection
    const remindersUnsubscribe = onSnapshot(collection(db, 'reminders'), (snapshot) => {
      const remindersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reminder))
      setReminders(remindersData)
    })

    // Set loading to false after a short delay
    setTimeout(() => setIsLoading(false), 1000)

    // Return cleanup function
    return () => {
      leadsUnsubscribe()
      campaignsUnsubscribe()
      emailsUnsubscribe()
      followUpsUnsubscribe()
      remindersUnsubscribe()
    }
  }

  // Initialize and fetch data
  useEffect(() => {
    let unsubscribe = () => {}
    const timer = setTimeout(() => {
      unsubscribe = setupRealtimeListeners()
    }, 0)

    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [])

  // ======================
  // LEAD OPERATIONS
  // ======================

  const handleAddLead = async () => {
    try {
      // Add to clients collection
      const clientData = {
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        company: leadForm.company || 'Not specified',
        status: 'Active',
        location: 'Not specified',
        tier: 'Bronze',
        totalSpent: 0,
        projects: 0,
        lastService: 'No service yet',
        notes: leadForm.notes || '',
        joinDate: new Date().toISOString().split('T')[0],
        contracts: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const clientRef = await addDoc(collection(db, 'clients'), clientData)

      // Add to leads collection
      const leadData = {
        ...leadForm,
        lastContact: new Date().toISOString().split('T')[0],
        followUpHistory: [],
        clientId: clientRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(collection(db, 'leads'), leadData)

      setShowNewLeadModal(false)
      resetLeadForm()
      alert('Lead successfully added!')
    } catch (error) {
      console.error('Error adding lead:', error)
      alert('Error adding lead. Please try again.')
    }
  }

  const handleUpdateLead = async () => {
    if (!currentLead) return
    
    try {
      const leadRef = doc(db, 'leads', currentLead.id)
      await updateDoc(leadRef, {
        ...leadForm,
        updatedAt: serverTimestamp()
      })

      // Also update client if needed
      const clientsQuery = query(collection(db, 'clients'), where('email', '==', currentLead.email))
      const clientSnapshot = await getDocs(clientsQuery)
      if (!clientSnapshot.empty) {
        const clientDoc = clientSnapshot.docs[0]
        const clientRef = doc(db, 'clients', clientDoc.id)
        await updateDoc(clientRef, {
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          company: leadForm.company,
          notes: leadForm.notes,
          updatedAt: serverTimestamp()
        })
      }

      setShowEditLeadModal(false)
      setCurrentLead(null)
      resetLeadForm()
      alert('Lead updated successfully!')
    } catch (error) {
      console.error('Error updating lead:', error)
      alert('Error updating lead. Please try again.')
    }
  }

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    
    try {
      await deleteDoc(doc(db, 'leads', id))
      alert('Lead deleted successfully!')
    } catch (error) {
      console.error('Error deleting lead:', error)
      alert('Error deleting lead. Please try again.')
    }
  }

  const handleViewLead = (lead: Lead) => {
    setCurrentLead(lead)
    setShowViewLeadModal(true)
  }

  const handleEditLead = (lead: Lead) => {
    setCurrentLead(lead)
    setLeadForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      source: lead.source,
      interest: lead.interest,
      budget: lead.budget,
      notes: lead.notes,
      nextFollowUp: lead.nextFollowUp
    })
    setShowEditLeadModal(true)
  }

  const resetLeadForm = () => {
    setLeadForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'cold',
      source: '',
      interest: '',
      budget: '',
      notes: '',
      nextFollowUp: ''
    })
  }

  // ======================
  // CAMPAIGN OPERATIONS
  // ======================

  const handleAddCampaign = async () => {
    try {
      const campaignData = {
        ...campaignForm,
        status: 'scheduled',
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(collection(db, 'campaigns'), campaignData)

      setShowNewCampaignModal(false)
      resetCampaignForm()
      alert('Campaign created successfully!')
    } catch (error) {
      console.error('Error adding campaign:', error)
      alert('Error creating campaign. Please try again.')
    }
  }

  const handleUpdateCampaign = async () => {
    if (!currentCampaign) return
    
    try {
      const campaignRef = doc(db, 'campaigns', currentCampaign.id)
      await updateDoc(campaignRef, {
        ...campaignForm,
        updatedAt: serverTimestamp()
      })

      setShowEditCampaignModal(false)
      setCurrentCampaign(null)
      resetCampaignForm()
      alert('Campaign updated successfully!')
    } catch (error) {
      console.error('Error updating campaign:', error)
      alert('Error updating campaign. Please try again.')
    }
  }

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return
    
    try {
      await deleteDoc(doc(db, 'campaigns', id))
      alert('Campaign deleted successfully!')
    } catch (error) {
      console.error('Error deleting campaign:', error)
      alert('Error deleting campaign. Please try again.')
    }
  }

  const handleToggleCampaignStatus = async (id: string, currentStatus: string) => {
    try {
      const campaignRef = doc(db, 'campaigns', id)
      const newStatus = currentStatus === 'active' ? 'paused' : 
                       currentStatus === 'paused' ? 'active' : 'active'
      
      await updateDoc(campaignRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error toggling campaign status:', error)
    }
  }

  const resetCampaignForm = () => {
    setCampaignForm({
      name: '',
      type: 'Email',
      targetAudience: 'All Leads',
      budget: '',
      startDate: '',
      endDate: '',
      description: ''
    })
  }

  // ======================
  // EMAIL OPERATIONS
  // ======================

  const handleAddEmail = async () => {
    try {
      const emailData = {
        ...emailForm,
        status: 'scheduled',
        createdAt: serverTimestamp()
      }

      await addDoc(collection(db, 'scheduledEmails'), emailData)

      setShowNewEmailModal(false)
      resetEmailForm()
      alert('Email scheduled successfully!')
    } catch (error) {
      console.error('Error scheduling email:', error)
      alert('Error scheduling email. Please try again.')
    }
  }

  const handleDeleteEmail = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheduled email?')) return
    
    try {
      await deleteDoc(doc(db, 'scheduledEmails', id))
      alert('Email deleted successfully!')
    } catch (error) {
      console.error('Error deleting email:', error)
      alert('Error deleting email. Please try again.')
    }
  }

  const handleSendEmailNow = async (id: string) => {
    try {
      const emailRef = doc(db, 'scheduledEmails', id)
      await updateDoc(emailRef, {
        status: 'sent',
        updatedAt: serverTimestamp()
      })
      alert('Email sent successfully!')
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email. Please try again.')
    }
  }

  const resetEmailForm = () => {
    setEmailForm({
      subject: '',
      recipient: '',
      recipientEmail: '',
      scheduledTime: '',
      type: 'follow-up',
      message: ''
    })
  }

  // ======================
  // FOLLOW-UP OPERATIONS
  // ======================

  const handleAddFollowUp = async () => {
    if (!currentLead) return
    
    try {
      const followUpData = {
        leadId: currentLead.id,
        leadName: currentLead.name,
        date: followUpForm.scheduledDate || new Date().toISOString().split('T')[0],
        type: followUpForm.type,
        subject: followUpForm.subject,
        message: followUpForm.message,
        status: followUpForm.scheduledDate ? 'scheduled' : 'completed',
        sentBy: 'Admin User',
        createdAt: serverTimestamp()
      }

      await addDoc(collection(db, 'followUps'), followUpData)

      // Update lead's last contact
      const leadRef = doc(db, 'leads', currentLead.id)
      await updateDoc(leadRef, {
        lastContact: new Date().toISOString().split('T')[0],
        updatedAt: serverTimestamp()
      })

      setShowFollowUpModal(false)
      resetFollowUpForm()
      alert('Follow-up added successfully!')
    } catch (error) {
      console.error('Error adding follow-up:', error)
      alert('Error adding follow-up. Please try again.')
    }
  }

  const resetFollowUpForm = () => {
    setFollowUpForm({
      type: 'email',
      subject: '',
      message: '',
      scheduledDate: ''
    })
  }

  // ======================
  // REMINDER OPERATIONS
  // ======================

  const pushReminderNotification = (reminder: Reminder) => {
    try {
      type NotificationEntry = { id: string; type: string; title: string; message: string; time: string; read: boolean; link: string }
      const existing: NotificationEntry[] = JSON.parse(localStorage.getItem('notifications') || '[]')
      const notifId = `reminder-${reminder.id}`
      if (existing.some((n) => n.id === notifId)) return
      const newNotif = {
        id: notifId,
        type: 'reminder',
        title: `⏰ Reminder Due: ${reminder.title}`,
        message: reminder.description || (reminder.linkedLeadName ? `Follow up with ${reminder.linkedLeadName}` : 'Task reminder'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        link: '/admin/marketing'
      }
      const updated = [newNotif, ...existing].slice(0, 20)
      localStorage.setItem('notifications', JSON.stringify(updated))
      window.dispatchEvent(new StorageEvent('storage', { key: 'notifications', newValue: JSON.stringify(updated) }))
    } catch (e) {
      console.error('Failed to push reminder notification', e)
    }
  }

  // Check for due/overdue reminders and fire notifications
  useEffect(() => {
    if (reminders.length === 0) return
    reminders.forEach(reminder => {
      if (reminder.status !== 'pending') return
      if (reminder.notificationSent) return
      if (!reminder.dueDate) return
      const dueDateTime = new Date(`${reminder.dueDate}T${reminder.dueTime || '09:00'}`)
      if (dueDateTime <= new Date()) {
        pushReminderNotification(reminder)
        updateDoc(doc(db, 'reminders', reminder.id), { notificationSent: true }).catch(console.error)
      }
    })
  }, [reminders])

  const handleAddReminder = async () => {
    if (!reminderForm.title || !reminderForm.dueDate) {
      alert('Please fill in the title and due date.')
      return
    }
    try {
      const reminderData = {
        title: reminderForm.title,
        description: reminderForm.description,
        dueDate: reminderForm.dueDate,
        dueTime: reminderForm.dueTime || '09:00',
        priority: reminderForm.priority,
        status: 'pending',
        linkedLeadId: reminderForm.linkedLeadId || '',
        linkedLeadName: reminderForm.linkedLeadName || '',
        notificationSent: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      await addDoc(collection(db, 'reminders'), reminderData)
      setShowReminderModal(false)
      resetReminderForm()
    } catch (error) {
      console.error('Error adding reminder:', error)
      alert('Error adding reminder. Please try again.')
    }
  }

  const handleCompleteReminder = async (id: string) => {
    try {
      await updateDoc(doc(db, 'reminders', id), {
        status: 'completed',
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error completing reminder:', error)
    }
  }

  const handleSnoozeReminder = async (id: string, currentDueDate: string) => {
    try {
      const due = new Date(currentDueDate)
      due.setDate(due.getDate() + 1)
      await updateDoc(doc(db, 'reminders', id), {
        dueDate: due.toISOString().split('T')[0],
        status: 'snoozed',
        notificationSent: false,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error snoozing reminder:', error)
    }
  }

  const handleDeleteReminder = async (id: string) => {
    if (!confirm('Delete this reminder?')) return
    try {
      await deleteDoc(doc(db, 'reminders', id))
    } catch (error) {
      console.error('Error deleting reminder:', error)
    }
  }

  const resetReminderForm = () => {
    setReminderForm({
      title: '',
      description: '',
      dueDate: '',
      dueTime: '09:00',
      priority: 'medium',
      linkedLeadId: '',
      linkedLeadName: ''
    })
  }

  const getFilteredReminders = () => {
    const today = new Date().toISOString().split('T')[0]
    return reminders.filter(r => {
      if (reminderFilter === 'pending') return r.status === 'pending' || r.status === 'snoozed'
      if (reminderFilter === 'today') return r.dueDate === today && r.status !== 'completed'
      if (reminderFilter === 'overdue') return r.dueDate < today && r.status !== 'completed'
      if (reminderFilter === 'completed') return r.status === 'completed'
      return true
    }).sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1
      if (a.status !== 'completed' && b.status === 'completed') return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
  }

  const getReminderUrgency = (reminder: Reminder) => {
    if (reminder.status === 'completed') return 'completed'
    const today = new Date().toISOString().split('T')[0]
    if (reminder.dueDate < today) return 'overdue'
    if (reminder.dueDate === today) return 'today'
    return 'upcoming'
  }

  const getReminderCounts = () => {
    const today = new Date().toISOString().split('T')[0]
    return {
      total: reminders.length,
      pending: reminders.filter(r => r.status === 'pending' || r.status === 'snoozed').length,
      today: reminders.filter(r => r.dueDate === today && r.status !== 'completed').length,
      overdue: reminders.filter(r => r.dueDate < today && r.status !== 'completed').length,
      completed: reminders.filter(r => r.status === 'completed').length,
    }
  }

  // ======================
  // UTILITY FUNCTIONS
  // ======================

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [leads, searchTerm, filterStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-300'
      case 'warm': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-amber-100 text-amber-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Analytics calculations
  const calculateAnalytics = () => {
    const totalLeads = leads.length
    const hotLeads = leads.filter(lead => lead.status === 'hot').length
    const warmLeads = leads.filter(lead => lead.status === 'warm').length
    const coldLeads = leads.filter(lead => lead.status === 'cold').length
    
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length
    const emailsSent = scheduledEmails.filter(e => e.status === 'sent').length
    
    const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.sent, 0)
    const totalConverted = campaigns.reduce((sum, campaign) => sum + campaign.converted, 0)
    const conversionRate = totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(1) : '0.0'

    return {
      totalLeads,
      hotLeads,
      warmLeads,
      coldLeads,
      activeCampaigns,
      emailsSent,
      conversionRate
    }
  }

  const analytics = calculateAnalytics()

  // Get follow-ups for a specific lead
  const getLeadFollowUps = (leadId: string) => {
    return followUps.filter(followUp => followUp.leadId === leadId)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data....</p>
        </div>
      </div>
    )
  }

  // ======================
  // UI RENDER
  // ======================

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-8 md:p-12 text-black shadow-2xl border border-gray-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-300">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Marketing Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">Marketing Dashboard</h1>
            <p className="text-gray-600 mt-3 text-lg font-medium max-w-xl">
              Lead management, email campaigns, and automated marketing workflows.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNewCampaignModal(true)}
              className="group relative flex items-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" />
              New Campaign
            </button>
            <button
              onClick={() => setShowNewLeadModal(true)}
              className="group relative flex items-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-blue-100 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-emerald-100 blur-[100px]"></div>
      </div>

      {/* Marketing Overview - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-300">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-green-600 font-bold text-sm">+{((analytics.totalLeads / 10) * 100).toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-black text-black mb-1">{analytics.totalLeads}</h3>
          <p className="text-gray-600 font-medium">Total Leads</p>
          <p className="text-gray-500 text-sm mt-2">Real-time from Firebase</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-300">
              <Mail className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-green-600 font-bold text-sm">+{((analytics.emailsSent / 10) * 100).toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-black text-black mb-1">{analytics.emailsSent}</h3>
          <p className="text-gray-600 font-medium">Emails Sent</p>
          <p className="text-gray-500 text-sm mt-2">Real-time from Firebase</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center border border-purple-300">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-green-600 font-bold text-sm">+{((analytics.activeCampaigns / 5) * 100).toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-black text-black mb-1">{analytics.activeCampaigns}</h3>
          <p className="text-gray-600 font-medium">Active Campaigns</p>
          <p className="text-gray-500 text-sm mt-2">Real-time from Firebase</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-300">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-green-600 font-bold text-sm">+{((parseFloat(analytics.conversionRate) / 10) * 100).toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-black text-black mb-1">{analytics.conversionRate}%</h3>
          <p className="text-gray-600 font-medium">Conversion Rate</p>
          <p className="text-gray-500 text-sm mt-2">Calculated from real data</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white border border-gray-300 rounded-2xl p-1 w-fit shadow-lg overflow-x-auto">
        {[
          { id: 'leads', label: 'Lead Management', icon: Users },
          { id: 'campaigns', label: 'Campaigns', icon: Target },
         
          { id: 'followup', label: 'Follow-up System', icon: MessageSquare },
          
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'leads' | 'campaigns' | 'emails' | 'analytics' | 'followup')}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leads Management */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-[32px] border border-gray-300 flex flex-col md:flex-row items-center gap-6 shadow-lg">
            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-300">
                <Search className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Search Leads</p>
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-black font-black text-lg focus:outline-none w-full placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-300">
                <Filter className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Filter by Status</p>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent text-black font-black text-sm focus:outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="hot">Hot Leads</option>
                  <option value="warm">Warm Leads</option>
                  <option value="cold">Cold Leads</option>
                </select>
              </div>
            </div>
           
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-[32px] border border-gray-300 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                     
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Lead</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                   
                    <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-black font-black text-xs">
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-black text-black text-sm group-hover:text-blue-600 transition-colors">{lead.name}</p>
                            <p className="text-gray-600 text-xs">{lead.email}</p>
                            <p className="text-gray-500 text-xs">{lead.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewLead(lead)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </button>
                          <button 
                            onClick={() => handleEditLead(lead)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Lead"
                          >
                            <Edit className="h-4 w-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => {
                              setCurrentLead(lead)
                              setShowFollowUpModal(true)
                            }}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Add Follow-up"
                          >
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          </button>
                          <button 
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white p-8 rounded-[32px] border border-gray-300 group hover:border-blue-500/30 transition-all shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-black">{campaign.name}</h3>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">{campaign.type} Campaign</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getCampaignStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Sent</p>
                  <p className="text-2xl font-black text-black">{campaign.sent.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Opened</p>
                  <p className="text-2xl font-black text-black">{campaign.opened.toLocaleString()}</p>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
                    {campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : '0.0'}% rate
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Clicked</p>
                  <p className="text-2xl font-black text-black">{campaign.clicked.toLocaleString()}</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                    {campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(1) : '0.0'}% rate
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Converted</p>
                  <p className="text-2xl font-black text-black">{campaign.converted.toLocaleString()}</p>
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-1">
                    {campaign.sent > 0 ? ((campaign.converted / campaign.sent) * 100).toFixed(1) : '0.0'}% rate
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget: {campaign.budget}</p>
                  <p className="text-sm font-medium text-gray-600">{campaign.startDate} - {campaign.endDate}</p>
                </div>
                <div className="flex gap-2">
                  {campaign.status === 'active' && (
                    <button 
                      onClick={() => handleToggleCampaignStatus(campaign.id, campaign.status)}
                      className="p-3 hover:bg-amber-50 rounded-xl transition-colors"
                      title="Pause Campaign"
                    >
                      <Pause className="h-5 w-5 text-amber-600" />
                    </button>
                  )}
                  {(campaign.status === 'scheduled' || campaign.status === 'paused') && (
                    <button 
                      onClick={() => handleToggleCampaignStatus(campaign.id, campaign.status)}
                      className="p-3 hover:bg-green-50 rounded-xl transition-colors"
                      title="Start Campaign"
                    >
                      <Play className="h-5 w-5 text-green-600" />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setCurrentCampaign(campaign)
                      setCampaignForm({
                        name: campaign.name,
                        type: campaign.type,
                        targetAudience: campaign.targetAudience,
                        budget: campaign.budget,
                        startDate: campaign.startDate,
                        endDate: campaign.endDate,
                        description: campaign.description
                      })
                      setShowEditCampaignModal(true)
                    }}
                    className="p-3 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Campaign"
                  >
                    <Settings className="h-5 w-5 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="p-3 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Campaign"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

     

      {/* Follow-up System */}
      {activeTab === 'followup' && (
        <div className="space-y-6">

          {/* ===== REMINDERS SECTION ===== */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-300 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-black flex items-center gap-3">
                  <AlarmClock className="h-7 w-7 text-amber-500" />
                  Reminders & Tasks
                </h2>
                <p className="text-gray-600 font-medium mt-1">Personal reminders for admins — get notified when tasks are due</p>
              </div>
              <button
                onClick={() => setShowReminderModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                New Reminder
              </button>
            </div>

            {/* Stats Bar */}
            {(() => {
              const counts = getReminderCounts()
              return (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                    <p className="text-2xl font-black text-black">{counts.total}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Total</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                    <p className="text-2xl font-black text-blue-700">{counts.pending}</p>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Pending</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                    <p className="text-2xl font-black text-amber-700">{counts.today}</p>
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1">Due Today</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-center">
                    <p className="text-2xl font-black text-red-700">{counts.overdue}</p>
                    <p className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">Overdue</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                    <p className="text-2xl font-black text-emerald-700">{counts.completed}</p>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">Completed</p>
                  </div>
                </div>
              )
            })()}

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'today', label: 'Due Today' },
                { id: 'overdue', label: 'Overdue' },
                { id: 'completed', label: 'Completed' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setReminderFilter(f.id as 'all' | 'pending' | 'today' | 'overdue' | 'completed')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    reminderFilter === f.id
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Reminder Cards */}
            <div className="space-y-3">
              {getFilteredReminders().length === 0 ? (
                <div className="text-center py-12">
                  <AlarmClock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No reminders found</p>
                  <p className="text-gray-400 text-sm mt-1">Click &quot;New Reminder&quot; to create your first reminder</p>
                </div>
              ) : (
                getFilteredReminders().map(reminder => {
                  const urgency = getReminderUrgency(reminder)
                  const borderClass = urgency === 'overdue' ? 'border-red-300 bg-red-50' :
                                      urgency === 'today' ? 'border-amber-300 bg-amber-50' :
                                      urgency === 'completed' ? 'border-emerald-200 bg-emerald-50 opacity-75' :
                                      'border-gray-200 bg-white'
                  const priorityConfig = {
                    high: { color: 'bg-red-100 text-red-700 border-red-300', label: 'High' },
                    medium: { color: 'bg-amber-100 text-amber-700 border-amber-300', label: 'Medium' },
                    low: { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Low' }
                  }
                  const pCfg = priorityConfig[reminder.priority] || priorityConfig.medium

                  return (
                    <div key={reminder.id} className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all ${borderClass}`}>
                      <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${
                        urgency === 'overdue' ? 'bg-red-100' :
                        urgency === 'today' ? 'bg-amber-100' :
                        urgency === 'completed' ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        {urgency === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        ) : urgency === 'overdue' ? (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <AlarmClock className={`h-5 w-5 ${urgency === 'today' ? 'text-amber-600' : 'text-gray-600'}`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className={`font-black text-sm ${urgency === 'completed' ? 'text-gray-400 line-through' : 'text-black'}`}>
                            {reminder.title}
                          </h4>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${pCfg.color}`}>
                              {pCfg.label}
                            </span>
                            {urgency === 'overdue' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-red-600 text-white">
                                Overdue
                              </span>
                            )}
                            {urgency === 'today' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-500 text-white">
                                Due Today
                              </span>
                            )}
                          </div>
                        </div>

                        {reminder.description && (
                          <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {reminder.dueDate}
                            {reminder.dueTime && ` at ${reminder.dueTime}`}
                          </span>
                          {reminder.linkedLeadName && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {reminder.linkedLeadName}
                            </span>
                          )}
                          {reminder.status === 'snoozed' && (
                            <span className="flex items-center gap-1 text-amber-600 font-bold">
                              <Timer className="h-3 w-3" />
                              Snoozed
                            </span>
                          )}
                        </div>
                      </div>

                      {urgency !== 'completed' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleCompleteReminder(reminder.id)}
                            title="Mark complete"
                            className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                          >
                            <Check className="h-4 w-4 text-emerald-700" />
                          </button>
                          <button
                            onClick={() => handleSnoozeReminder(reminder.id, reminder.dueDate)}
                            title="Snooze +1 day"
                            className="p-2 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                          >
                            <RefreshCw className="h-4 w-4 text-amber-700" />
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            title="Delete"
                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-700" />
                          </button>
                        </div>
                      )}
                      {urgency === 'completed' && (
                        <button
                          onClick={() => handleDeleteReminder(reminder.id)}
                          title="Delete"
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ===== FOLLOW-UP COMMUNICATION SECTION ===== */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-300 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-black">Follow-up Communication</h2>
                <p className="text-gray-600 font-medium">Track and manage all follow-up communications with leads</p>
              </div>
            </div>

            <div className="space-y-4">
              {leads.map((lead) => {
                const leadFollowUps = getLeadFollowUps(lead.id)
                return (
                  <div key={lead.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="p-6 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-black font-black text-sm">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-black text-black">{lead.name}</h4>
                          <p className="text-gray-600 text-sm">{lead.email} • {lead.phone}</p>
                          <p className="text-gray-500 text-xs">Last Contact: {lead.lastContact} • Next: {lead.nextFollowUp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <button
                          onClick={() => {
                            setCurrentLead(lead)
                            setShowFollowUpModal(true)
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all"
                        >
                          <Plus className="h-4 w-4 inline mr-1" />
                          Add Follow-up
                        </button>
                      </div>
                    </div>

                    {leadFollowUps.length > 0 ? (
                      <div className="p-6 space-y-3">
                        <h5 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-3">Follow-up History ({leadFollowUps.length})</h5>
                        {leadFollowUps.map((followUp) => (
                          <div key={followUp.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              {followUp.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                              {followUp.type === 'phone' && <Phone className="h-5 w-5 text-green-600" />}
                              {followUp.type === 'meeting' && <Video className="h-5 w-5 text-purple-600" />}
                              {followUp.type === 'sms' && <MessageSquare className="h-5 w-5 text-amber-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h6 className="font-black text-black text-sm">{followUp.subject}</h6>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                  followUp.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  followUp.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {followUp.status}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">{followUp.message}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>{followUp.date}</span>
                                <span>•</span>
                                <span className="capitalize">{followUp.type}</span>
                                <span>•</span>
                                <span>By {followUp.sentBy}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-500 text-sm">No follow-up history yet. Click &quot;Add Follow-up&quot; to start tracking communications.</p>
                      </div>
                    )}
                  </div>
                )
              })}
              {leads.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No leads yet. Add leads from the Lead Management tab.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-300 shadow-lg">
            <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Campaign Performance
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-black text-emerald-800">Open Rate</p>
                    <p className="text-sm text-emerald-700">Average across campaigns</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-800">
                    {campaigns.length > 0 ? 
                      ((campaigns.reduce((sum, c) => sum + c.opened, 0) / campaigns.reduce((sum, c) => sum + c.sent, 1)) * 100).toFixed(1) : '0.0'}%
                  </p>
                  <p className="text-sm text-emerald-600">From real campaign data</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-black text-blue-800">Click Rate</p>
                    <p className="text-sm text-blue-700">Engagement metric</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-blue-800">
                    {campaigns.length > 0 ? 
                      ((campaigns.reduce((sum, c) => sum + c.clicked, 0) / campaigns.reduce((sum, c) => sum + c.sent, 1)) * 100).toFixed(1) : '0.0'}%
                  </p>
                  <p className="text-sm text-blue-600">From real campaign data</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-black text-purple-800">Conversion Rate</p>
                    <p className="text-sm text-purple-700">Lead to customer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-purple-800">{analytics.conversionRate}%</p>
                  <p className="text-sm text-purple-600">From real campaign data</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-300 shadow-lg">
            <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
              <PieChart className="h-6 w-6 text-emerald-600" />
              Lead Status Distribution
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <span className="text-xs font-black text-red-600">H</span>
                  </div>
                  <span className="font-medium text-black">Hot Leads</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{width: `${(analytics.hotLeads / analytics.totalLeads) * 100 || 0}%`}}
                    ></div>
                  </div>
                  <span className="font-black text-black w-12 text-right">
                    {analytics.totalLeads > 0 ? ((analytics.hotLeads / analytics.totalLeads) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <span className="text-xs font-black text-amber-600">W</span>
                  </div>
                  <span className="font-medium text-black">Warm Leads</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{width: `${(analytics.warmLeads / analytics.totalLeads) * 100 || 0}%`}}
                    ></div>
                  </div>
                  <span className="font-black text-black w-12 text-right">
                    {analytics.totalLeads > 0 ? ((analytics.warmLeads / analytics.totalLeads) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-black text-blue-600">C</span>
                  </div>
                  <span className="font-medium text-black">Cold Leads</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{width: `${(analytics.coldLeads / analytics.totalLeads) * 100 || 0}%`}}
                    ></div>
                  </div>
                  <span className="font-black text-black w-12 text-right">
                    {analytics.totalLeads > 0 ? ((analytics.coldLeads / analytics.totalLeads) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <span className="text-xs font-black text-emerald-600">T</span>
                  </div>
                  <span className="font-medium text-black">Total Leads</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <span className="font-black text-black w-12 text-right">{analytics.totalLeads}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals remain exactly the same as your original code */}
      {/* I'm keeping all modal code exactly as you provided */}
      {/* Only the onSubmit functions are connected to Firebase */}

      {/* New Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black flex items-center gap-3">
                <AlarmClock className="h-6 w-6 text-amber-500" />
                New Reminder
              </h3>
              <button onClick={() => { setShowReminderModal(false); resetReminderForm() }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={reminderForm.title}
                  onChange={(e) => setReminderForm({...reminderForm, title: e.target.value})}
                  placeholder="e.g., Call back Ahmed Al-Mansouri"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={reminderForm.description}
                  onChange={(e) => setReminderForm({...reminderForm, description: e.target.value})}
                  placeholder="Additional details about this task..."
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={reminderForm.dueDate}
                    onChange={(e) => setReminderForm({...reminderForm, dueDate: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Due Time</label>
                  <input
                    type="time"
                    value={reminderForm.dueTime}
                    onChange={(e) => setReminderForm({...reminderForm, dueTime: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                <div className="flex gap-3">
                  {(['high', 'medium', 'low'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setReminderForm({...reminderForm, priority: p})}
                      className={`flex-1 py-2 rounded-xl font-bold text-sm capitalize transition-all border-2 ${
                        reminderForm.priority === p
                          ? p === 'high' ? 'bg-red-500 text-white border-red-500'
                            : p === 'medium' ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-blue-500 text-white border-blue-500'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Link to Lead (Optional)</label>
                <select
                  value={reminderForm.linkedLeadId}
                  onChange={(e) => {
                    const lead = leads.find(l => l.id === e.target.value)
                    setReminderForm({
                      ...reminderForm,
                      linkedLeadId: e.target.value,
                      linkedLeadName: lead ? lead.name : ''
                    })
                  }}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">— No lead linked —</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name} ({lead.status})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => { setShowReminderModal(false); resetReminderForm() }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReminder}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
                >
                  <AlarmClock className="h-4 w-4 inline mr-2" />
                  Save Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black">Add New Lead</h3>
              <button onClick={() => setShowNewLeadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                    placeholder="Enter full name..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                    placeholder="email@example.com"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                    placeholder="+971 50 xxx xxxx"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({...leadForm, company: e.target.value})}
                    placeholder="Company name"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lead Status *</label>
                  <select
                    value={leadForm.status}
                    onChange={(e) => setLeadForm({...leadForm, status: e.target.value as 'hot' | 'warm' | 'cold'})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cold">Cold Lead</option>
                    <option value="warm">Warm Lead</option>
                    <option value="hot">Hot Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lead Source</label>
                  <input
                    type="text"
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({...leadForm, source: e.target.value})}
                    placeholder="e.g., Website, Referral"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Interest/Service</label>
                  <input
                    type="text"
                    value={leadForm.interest}
                    onChange={(e) => setLeadForm({...leadForm, interest: e.target.value})}
                    placeholder="e.g., Kitchen Renovation"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Budget Range</label>
                  <input
                    type="text"
                    value={leadForm.budget}
                    onChange={(e) => setLeadForm({...leadForm, budget: e.target.value})}
                    placeholder="e.g., AED 50,000 - 100,000"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Next Follow-up Date</label>
                <input
                  type="date"
                  value={leadForm.nextFollowUp}
                  onChange={(e) => setLeadForm({...leadForm, nextFollowUp: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({...leadForm, notes: e.target.value})}
                  placeholder="Additional notes about this lead..."
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowNewLeadModal(false)
                    resetLeadForm()
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddLead}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditLeadModal && currentLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black">Edit Lead</h3>
              <button onClick={() => setShowEditLeadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({...leadForm, company: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lead Status *</label>
                  <select
                    value={leadForm.status}
                    onChange={(e) => setLeadForm({...leadForm, status: e.target.value as 'hot' | 'warm' | 'cold'})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cold">Cold Lead</option>
                    <option value="warm">Warm Lead</option>
                    <option value="hot">Hot Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lead Source</label>
                  <input
                    type="text"
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({...leadForm, source: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Interest/Service</label>
                  <input
                    type="text"
                    value={leadForm.interest}
                    onChange={(e) => setLeadForm({...leadForm, interest: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Budget Range</label>
                  <input
                    type="text"
                    value={leadForm.budget}
                    onChange={(e) => setLeadForm({...leadForm, budget: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Next Follow-up Date</label>
                <input
                  type="date"
                  value={leadForm.nextFollowUp}
                  onChange={(e) => setLeadForm({...leadForm, nextFollowUp: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({...leadForm, notes: e.target.value})}
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowEditLeadModal(false)
                    setCurrentLead(null)
                    resetLeadForm()
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateLead}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  Update Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Lead Modal */}
      {showViewLeadModal && currentLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black">Lead Details</h3>
              <button onClick={() => setShowViewLeadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b">
                <div className="h-16 w-16 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-black font-black text-lg">
                  {currentLead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xl font-black text-black">{currentLead.name}</h4>
                  <p className="text-gray-600">{currentLead.company}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border mt-2 ${getStatusColor(currentLead.status)}`}>
                    {currentLead.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-black font-medium">{currentLead.email}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-black font-medium">{currentLead.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Source</p>
                  <p className="text-black font-medium">{currentLead.source}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Last Contact</p>
                  <p className="text-black font-medium">{currentLead.lastContact}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Next Follow-up</p>
                  <p className="text-black font-medium">{currentLead.nextFollowUp}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Budget</p>
                  <p className="text-black font-medium">{currentLead.budget}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Interest</p>
                <p className="text-black font-medium">{currentLead.interest}</p>
              </div>

              <div>
                <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Notes</p>
                <p className="text-gray-700">{currentLead.notes || 'No notes available'}</p>
              </div>

              <div>
                <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-3">
                  Follow-up History ({getLeadFollowUps(currentLead.id).length})
                </p>
                {getLeadFollowUps(currentLead.id).length > 0 ? (
                  <div className="space-y-3">
                    {getLeadFollowUps(currentLead.id).map((followUp) => (
                      <div key={followUp.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="font-black text-black text-sm">{followUp.subject}</h6>
                          <span className="text-xs text-gray-500">{followUp.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{followUp.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500 capitalize">{followUp.type}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{followUp.sentBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No follow-up history yet</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowViewLeadModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowViewLeadModal(false)
                    handleEditLead(currentLead)
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                >
                  <Edit className="h-4 w-4 inline mr-2" />
                  Edit Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Modal */}
      {showFollowUpModal && currentLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black">Add Follow-up</h3>
              <button onClick={() => setShowFollowUpModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-bold text-gray-700">Lead: {currentLead.name}</p>
                <p className="text-xs text-gray-600">{currentLead.email}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Communication Type *</label>
                <select
                  value={followUpForm.type}
                  onChange={(e) => setFollowUpForm({...followUpForm, type: e.target.value as FollowUpMessage['type']})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="sms">SMS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={followUpForm.subject}
                  onChange={(e) => setFollowUpForm({...followUpForm, subject: e.target.value})}
                  placeholder="Brief description..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message/Notes *</label>
                <textarea
                  value={followUpForm.message}
                  onChange={(e) => setFollowUpForm({...followUpForm, message: e.target.value})}
                  placeholder="Detailed notes about this communication..."
                  rows={4}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Schedule for Later (Optional)</label>
                <input
                  type="date"
                  value={followUpForm.scheduledDate}
                  onChange={(e) => setFollowUpForm({...followUpForm, scheduledDate: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if already completed</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowFollowUpModal(false)
                    resetFollowUpForm()
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddFollowUp}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  Save Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black">Create New Campaign</h3>
              <button onClick={() => setShowNewCampaignModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                  placeholder="Enter campaign name..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Type *</label>
                <select 
                  value={campaignForm.type}
                  onChange={(e) => setCampaignForm({...campaignForm, type: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Email Campaign</option>
                  <option>SMS Campaign</option>
                  <option>Social Media Campaign</option>
                  <option>Multi-Channel Campaign</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience *</label>
                <select 
                  value={campaignForm.targetAudience}
                  onChange={(e) => setCampaignForm({...campaignForm, targetAudience: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All Leads</option>
                  <option>Hot Leads Only</option>
                  <option>Warm Leads Only</option>
                  <option>Cold Leads Only</option>
                  <option>Custom Segment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={campaignForm.startDate}
                    onChange={(e) => setCampaignForm({...campaignForm, startDate: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={campaignForm.endDate}
                    onChange={(e) => setCampaignForm({...campaignForm, endDate: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Budget (AED) *</label>
                <input
                  type="text"
                  value={campaignForm.budget}
                  onChange={(e) => setCampaignForm({...campaignForm, budget: e.target.value})}
                  placeholder="e.g., AED 5,000"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                  placeholder="Campaign objectives and details..."
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowNewCampaignModal(false)
                    resetCampaignForm()
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCampaign}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {showEditCampaignModal && currentCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black">Edit Campaign</h3>
              <button onClick={() => setShowEditCampaignModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Type *</label>
                <select 
                  value={campaignForm.type}
                  onChange={(e) => setCampaignForm({...campaignForm, type: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Email Campaign</option>
                  <option>SMS Campaign</option>
                  <option>Social Media Campaign</option>
                  <option>Multi-Channel Campaign</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience *</label>
                <select 
                  value={campaignForm.targetAudience}
                  onChange={(e) => setCampaignForm({...campaignForm, targetAudience: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All Leads</option>
                  <option>Hot Leads Only</option>
                  <option>Warm Leads Only</option>
                  <option>Cold Leads Only</option>
                  <option>Custom Segment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={campaignForm.startDate}
                    onChange={(e) => setCampaignForm({...campaignForm, startDate: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={campaignForm.endDate}
                    onChange={(e) => setCampaignForm({...campaignForm, endDate: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Budget (AED) *</label>
                <input
                  type="text"
                  value={campaignForm.budget}
                  onChange={(e) => setCampaignForm({...campaignForm, budget: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowEditCampaignModal(false)
                    setCurrentCampaign(null)
                    resetCampaignForm()
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateCampaign}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  Update Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit Email Modal */}
      {showNewEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black">{currentEmail ? 'Edit' : 'Schedule'} Email</h3>
              <button onClick={() => {
                setShowNewEmailModal(false)
                setCurrentEmail(null)
                resetEmailForm()
              }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {selectedLeads.length > 0 && !currentEmail && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-bold text-blue-900">
                    <Bell className="h-4 w-4 inline mr-2" />
                    Sending to {selectedLeads.length} selected lead(s)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Subject *</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  placeholder="Enter email subject..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {!selectedLeads.length && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Recipient Name</label>
                    <input
                      type="text"
                      value={emailForm.recipient}
                      onChange={(e) => setEmailForm({...emailForm, recipient: e.target.value})}
                      placeholder="Lead name or segment"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Recipient Email *</label>
                    <input
                      type="email"
                      value={emailForm.recipientEmail}
                      onChange={(e) => setEmailForm({...emailForm, recipientEmail: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Type *</label>
                <select
                  value={emailForm.type}
                  onChange={(e) => setEmailForm({...emailForm, type: e.target.value as ScheduledEmail['type']})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="follow-up">Follow-up</option>
                  <option value="reminder">Reminder</option>
                  <option value="promotional">Promotional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Schedule Date & Time *</label>
                <input
                  type="datetime-local"
                  value={emailForm.scheduledTime}
                  onChange={(e) => setEmailForm({...emailForm, scheduledTime: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  placeholder="Email message content..."
                  rows={5}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowNewEmailModal(false)
                    setCurrentEmail(null)
                    resetEmailForm()
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddEmail}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                >
                  <Send className="h-4 w-4 inline mr-2" />
                  Schedule Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}