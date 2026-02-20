
'use client'

import { useState, useCallback, useMemo, useEffect, DragEvent } from 'react'
// Other imports ke saath yeh add karein
import { autoCreateSurveyFromLead } from '@/lib/autoCreateSurvey'
import { 
  Plus, 
  Trash2, 
  X, 
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle2,
  Activity,
  Clock,
  GripVertical,
  Briefcase,
  Search,
  Filter,
  Kanban,
  Users,
  Eye,
  Database,
  Sparkles,
  Brain,
  UserCheck,
  Zap,
  Save,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Globe,
  BarChart,
  User,
  Calendar as CalendarIcon,
  FileText,
  CreditCard,
  Star,
  Tag,
  MessageSquare,
  Linkedin,
  Twitter,
  Instagram,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Bot,
  Cpu,
  Lightbulb,
  UserPlus,
  PhoneCall,
  Award,
  FileCheck,
  Handshake,
  UsersRound
} from 'lucide-react'

// Firebase imports
import { db } from '@/lib/firebase'
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'

interface Lead {
  id: string;
  name: string;
  company: string;
  status: 'Contacter' | 'Negotiation' | 'Contacted' | 'Qualified' | 'Won' | 'New';
  value: number;
  daysInStage: number;
  priority: 'High' | 'Medium' | 'Low';
  email: string;
  phone: string;
  tier: string;
  joinDate: string;
  address: string;
  industry: string;
  source: string[];
  lastContact: string;
  notes: string;
  website: string;
  employees: number;
  annualRevenue: string;
  secondaryContacts: Array<{ name: string; role: string; email: string; phone: string }>;
  linkedin: string;
  twitter: string;
  instagram: string;
  budgetRange: string;
  decisionTimeline: string;
  painPoints: string;
  goals: string;
  competitors: string;
  currentContract: {
    startDate: string;
    endDate: string;
    value: number;
    services: string[];
  } | null;
  serviceHistory: Array<{ date: string; service: string; value: number; rating: number }>;
  preferredContactMethod: string;
  preferredContactTime: string;
  timezone: string;
  language: string;
  paymentTerms: string;
  creditLimit: number;
  outstandingBalance: number;
  lastPaymentDate: string | null;
  satisfactionScore: number | null;
  responseTime: string;
  contractRenewalProbability: number | null;
  lifetimeValue: number;
  createdAt: string;
  updatedAt: string;
  // New field for survey type
  surveyType: string;
}

interface StageData {
  stage: string;
  leads: Lead[];
  total: number;
  count: number;
}

interface EnhancedData {
  selectedLeadId: string | null;
  address: string;
  industry: string;
  website: string;
  employees: string;
  annualRevenue: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  budgetRange: string;
  decisionTimeline: string;
  painPoints: string;
  goals: string;
  competitors: string;
  preferredContactMethod: string;
  preferredContactTime: string;
  timezone: string;
  language: string;
  paymentTerms: string;
  creditLimit: string;
  secondaryContacts: Array<{ name: string; role: string; email: string; phone: string }>;
}

interface AIPersona {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: string;
  priority: string;
  tier: string;
  source: string[];
  industry: string;
  employees: number;
  budgetRange: string;
  painPoints: string;
  goals: string;
}

export default function UnifiedCRMDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [showEnhancedDataForm, setShowEnhancedDataForm] = useState(false)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showAIPersonaModal, setShowAIPersonaModal] = useState(false)
  const [aiPersonaResults, setAiPersonaResults] = useState<AIPersona[]>([])
  const [formData, setFormData] = useState({ 
    name: '', 
    company: '', 
    value: '', 
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    status: 'New' as Lead['status'],
    email: '', 
    phone: '', 
    sources: [] as string[],
    surveyType: '' // New field for survey type
  })
  const [availableSources] = useState([
    'Social Media',
    'Google Ads',
    'Facebook Ads',
    'E-Movers ',
    'sister companies ',
    'LinkedIn Ads',
    'Website Inquiry',
    'Referral',
    'Cold Call',
    'Trade Show',
    'Email Campaign',
    'Direct Mail',
    'Partnership',
    'SEO',
    'Content Marketing',
    'Other'
  ])
  const [enhancedData, setEnhancedData] = useState<EnhancedData>({
    selectedLeadId: null,
    address: '',
    industry: '',
    website: '',
    employees: '',
    annualRevenue: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    budgetRange: '',
    decisionTimeline: '',
    painPoints: '',
    goals: '',
    competitors: '',
    preferredContactMethod: 'Email',
    preferredContactTime: '',
    timezone: 'GST (UTC+4)',
    language: 'English',
    paymentTerms: 'Net 30 days',
    creditLimit: '',
    secondaryContacts: []
  })
  const [showEditForm, setShowEditForm] = useState(false)
  const [editFormData, setEditFormData] = useState<{
    id: string;
    name: string;
    company: string;
    value: string;
    status: Lead['status'];
    priority: Lead['priority'];
    email: string;
    phone: string;
    sources: string[];
    surveyType: string; // New field for survey type in edit form
  } | null>(null)

  // Calendar filter state
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dateFilterType, setDateFilterType] = useState<'joinDate' | 'lastContact' | 'createdAt'>('joinDate')
  const [calendarView, setCalendarView] = useState<'month' | 'year'>('month')
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())

  const stages = ['Contacter', 'Contacted', 'Qualified', 'Negotiation', 'Won', 'New'] as const

  // Firebase se data fetch
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const leadsRef = collection(db, 'leads')
      const q = query(leadsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const leadsData: Lead[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        
        const lead: Lead = {
          id: doc.id,
          name: data.name || '',
          company: data.company || '',
          status: (data.status || 'New') as Lead['status'],
          value: data.value || 0,
          daysInStage: data.daysInStage || 0,
          priority: (data.priority || 'Medium') as Lead['priority'],
          email: data.email || '',
          phone: data.phone || '',
          tier: data.tier || 'Bronze',
          joinDate: data.joinDate || new Date().toISOString().split('T')[0],
          address: data.address || '',
          industry: data.industry || '',
          source: Array.isArray(data.source) ? data.source : data.source ? [data.source] : [],
          lastContact: data.lastContact || new Date().toISOString().split('T')[0],
          notes: data.notes || '',
          website: data.website || '',
          employees: data.employees || 0,
          annualRevenue: data.annualRevenue || '0 AED',
          secondaryContacts: data.secondaryContacts || [],
          linkedin: data.linkedin || '',
          twitter: data.twitter || '',
          instagram: data.instagram || '',
          budgetRange: data.budgetRange || '',
          decisionTimeline: data.decisionTimeline || '',
          painPoints: data.painPoints || '',
          goals: data.goals || '',
          competitors: data.competitors || '',
          currentContract: data.currentContract || null,
          serviceHistory: data.serviceHistory || [],
          preferredContactMethod: data.preferredContactMethod || 'Email',
          preferredContactTime: data.preferredContactTime || '',
          timezone: data.timezone || 'GST (UTC+4)',
          language: data.language || 'English',
          paymentTerms: data.paymentTerms || 'Net 30 days',
          creditLimit: data.creditLimit || 0,
          outstandingBalance: data.outstandingBalance || 0,
          lastPaymentDate: data.lastPaymentDate || null,
          satisfactionScore: data.satisfactionScore || null,
          responseTime: data.responseTime || '',
          contractRenewalProbability: data.contractRenewalProbability || null,
          lifetimeValue: data.lifetimeValue || 0,
          createdAt: formatFirebaseTimestamp(data.createdAt),
          updatedAt: formatFirebaseTimestamp(data.updatedAt),
          surveyType: data.surveyType || '' // Fetching surveyType from Firebase
        }
        
        leadsData.push(lead)
      })
      
      setLeads(leadsData)
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  // Firebase timestamp ko format karna
  const formatFirebaseTimestamp = (timestamp: any): string => {
    if (!timestamp) return new Date().toISOString().split('T')[0]
    
    if (timestamp.toDate) {
      return timestamp.toDate().toISOString().split('T')[0]
    }
    
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toISOString().split('T')[0]
    }
    
    return timestamp as string
  }

  // Fetch AI suggestions (top 3 leads by value)
  const fetchAISuggestions = useCallback(async () => {
    try {
      const leadsRef = collection(db, 'leads')
      const q = query(leadsRef, orderBy('value', 'desc'), limit(3))
      const querySnapshot = await getDocs(q)
      
      const topLeads: AIPersona[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        topLeads.push({
          id: doc.id,
          name: data.name || 'Unknown',
          company: data.company || 'No Company',
          email: data.email || 'No Email',
          phone: data.phone || 'No Phone',
          value: data.value || 0,
          status: data.status || 'New',
          priority: data.priority || 'Medium',
          tier: data.tier || 'Bronze',
          source: data.source || ['Unknown'],
          industry: data.industry || 'Not specified',
          employees: data.employees || 0,
          budgetRange: data.budgetRange || 'Not specified',
          painPoints: data.painPoints || 'No data',
          goals: data.goals || 'No data'
        })
      })
      
      setAiPersonaResults(topLeads)
      setShowAIPersonaModal(true)
    } catch (error) {
      console.error('Error fetching AI suggestions:', error)
      alert('Failed to fetch top leads!')
    }
  }, [])

  // Filter leads based on search, priority, and date
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Priority filter
      const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority
      
      // Date filter
      let matchesDate = true
      if (selectedDate && dateFilterType) {
        const leadDate = new Date(lead[dateFilterType])
        const filterDate = new Date(selectedDate)
        
        if (calendarView === 'month') {
          matchesDate = 
            leadDate.getFullYear() === filterDate.getFullYear() &&
            leadDate.getMonth() === filterDate.getMonth()
        } else {
          matchesDate = leadDate.getFullYear() === filterDate.getFullYear()
        }
      }
      
      return matchesSearch && matchesPriority && matchesDate
    })
  }, [leads, searchTerm, filterPriority, selectedDate, dateFilterType, calendarView])

  const leadsByStage = useMemo((): StageData[] => {
    return stages.map(stage => ({
      stage,
      leads: filteredLeads.filter(l => l.status === stage),
      total: filteredLeads.filter(l => l.status === stage).reduce((sum, l) => sum + l.value, 0),
      count: filteredLeads.filter(l => l.status === stage).length,
    }))
  }, [filteredLeads])

  const handleMoveStage = useCallback(async (lead: Lead, newStage: string) => {
    try {
      // Firebase mein update
      const leadRef = doc(db, 'leads', lead.id)
      await updateDoc(leadRef, {
        status: newStage,
        daysInStage: 0,
        updatedAt: serverTimestamp()
      })
      
      // Local state update
      setLeads(leads.map(l => 
        l.id === lead.id ? { 
          ...l, 
          status: newStage as Lead['status'], 
          daysInStage: 0 
        } : l
      ))
    } catch (error) {
      console.error('Error updating stage:', error)
      alert('Failed to update stage!')
    }
  }, [leads])

  const handleDeleteLead = useCallback(async (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        // Firebase se delete
        await deleteDoc(doc(db, 'leads', leadId))
        
        // Local state se remove
        setLeads(leads.filter(l => l.id !== leadId))
        setShowLeadModal(false)
      } catch (error) {
        console.error('Error deleting lead:', error)
        alert('Failed to delete lead!')
      }
    }
  }, [leads])

 const handleAddNewLead = async () => {
  if (!formData.name) {
    alert('Please enter name')
    return
  }

  try {
    const newLeadData = {
      name: formData.name,
      company: formData.company,
      status: formData.status,
      value: parseInt(formData.value) || 0,
      daysInStage: 0,
      priority: formData.priority,
      email: formData.email,
      phone: formData.phone,
      tier: 'Bronze',
      joinDate: new Date().toISOString().split('T')[0],
      address: '',
      industry: '',
      source: formData.sources.length > 0 ? formData.sources : ['Manual Entry'],
      lastContact: new Date().toISOString().split('T')[0],
      notes: '',
      website: '',
      employees: 0,
      annualRevenue: '0 AED',
      secondaryContacts: [],
      linkedin: '',
      twitter: '',
      instagram: '',
      budgetRange: '',
      decisionTimeline: '',
      painPoints: '',
      goals: '',
      competitors: '',
      currentContract: null,
      serviceHistory: [],
      preferredContactMethod: 'Email',
      preferredContactTime: '',
      timezone: 'GST (UTC+4)',
      language: 'English',
      paymentTerms: 'Net 30 days',
      creditLimit: 0,
      outstandingBalance: 0,
      lastPaymentDate: null,
      satisfactionScore: null,
      responseTime: '',
      contractRenewalProbability: null,
      lifetimeValue: parseInt(formData.value) || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      surveyType: formData.surveyType
    }

    // Firebase mein add
    const docRef = await addDoc(collection(db, 'leads'), newLeadData)
    
    // 🚀 **NEW: Auto-create survey based on surveyType**
    if (formData.surveyType !== 'needed or not') {
      try {
        const surveyId = await autoCreateSurveyFromLead({
          leadId: docRef.id,
          leadName: formData.name,
          leadCompany: formData.company,
          surveyType: formData.surveyType,
          email: formData.email,
          phone: formData.phone
        })
        
        if (surveyId) {
          console.log(`✨ Survey created with ID: ${surveyId}`)
          // Optionally: Update lead with survey reference
          await updateDoc(docRef, {
            autoGeneratedSurveyId: surveyId,
            surveyGeneratedAt: serverTimestamp()
          })
        }
      } catch (surveyError) {
        console.error('Error creating auto survey:', surveyError)
        // Don't fail lead creation if survey creation fails
      }
    }
    
    // Local state mein add
    const newLead: Lead = {
      id: docRef.id,
      name: newLeadData.name,
      company: newLeadData.company,
      status: formData.status,
      value: newLeadData.value,
      daysInStage: newLeadData.daysInStage,
      priority: formData.priority,
      email: newLeadData.email,
      phone: newLeadData.phone,
      tier: newLeadData.tier,
      joinDate: newLeadData.joinDate,
      address: newLeadData.address,
      industry: newLeadData.industry,
      source: newLeadData.source,
      lastContact: newLeadData.lastContact,
      notes: newLeadData.notes,
      website: newLeadData.website,
      employees: newLeadData.employees,
      annualRevenue: newLeadData.annualRevenue,
      secondaryContacts: newLeadData.secondaryContacts,
      linkedin: newLeadData.linkedin,
      twitter: newLeadData.twitter,
      instagram: newLeadData.instagram,
      budgetRange: newLeadData.budgetRange,
      decisionTimeline: newLeadData.decisionTimeline,
      painPoints: newLeadData.painPoints,
      goals: newLeadData.goals,
      competitors: newLeadData.competitors,
      currentContract: newLeadData.currentContract,
      serviceHistory: newLeadData.serviceHistory,
      preferredContactMethod: newLeadData.preferredContactMethod,
      preferredContactTime: newLeadData.preferredContactTime,
      timezone: newLeadData.timezone,
      language: newLeadData.language,
      paymentTerms: newLeadData.paymentTerms,
      creditLimit: newLeadData.creditLimit,
      outstandingBalance: newLeadData.outstandingBalance,
      lastPaymentDate: newLeadData.lastPaymentDate,
      satisfactionScore: newLeadData.satisfactionScore,
      responseTime: newLeadData.responseTime,
      contractRenewalProbability: newLeadData.contractRenewalProbability,
      lifetimeValue: newLeadData.lifetimeValue,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      surveyType: newLeadData.surveyType
    }
    
    setLeads([...leads, newLead])
    
    // Show success message with survey info
    if (formData.surveyType === 'survey-Online') {
      alert(`✅ Lead created successfully!\n📝 Online survey has been auto-created.`)
    } else if (formData.surveyType === 'physical ur') {
      alert(`✅ Lead created successfully!\n📝 Physical survey has been auto-created.`)
    } else {
      alert('✅ Lead created successfully!')
    }
    
    setFormData({ 
      name: '', 
      company: '', 
      value: '', 
      priority: 'Medium',
      status: 'New',
      email: '', 
      phone: '', 
      sources: [],
      surveyType: ''
    })
    setShowNewForm(false)
  } catch (error) {
    console.error('Error adding lead:', error)
    alert('Failed to add lead!')
  }
}

  const handleDragStart = (e: DragEvent<HTMLDivElement>, lead: Lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>, stageData: StageData) => {
    e.preventDefault()
    if (draggedLead && draggedLead.status !== stageData.stage) {
      await handleMoveStage(draggedLead, stageData.stage)
    }
    setDraggedLead(null)
  }

  const handleDragEnd = () => {
    setDraggedLead(null)
  }

  const updateEnhancedData = async () => {
    if (!enhancedData.selectedLeadId) {
      alert('Please select a lead first!')
      return
    }

    try {
      const leadRef = doc(db, 'leads', enhancedData.selectedLeadId)
      await updateDoc(leadRef, {
        address: enhancedData.address,
        industry: enhancedData.industry,
        website: enhancedData.website,
        employees: parseInt(enhancedData.employees) || 0,
        annualRevenue: enhancedData.annualRevenue,
        linkedin: enhancedData.linkedin,
        twitter: enhancedData.twitter,
        instagram: enhancedData.instagram,
        budgetRange: enhancedData.budgetRange,
        decisionTimeline: enhancedData.decisionTimeline,
        painPoints: enhancedData.painPoints,
        goals: enhancedData.goals,
        competitors: enhancedData.competitors,
        preferredContactMethod: enhancedData.preferredContactMethod,
        preferredContactTime: enhancedData.preferredContactTime,
        timezone: enhancedData.timezone,
        language: enhancedData.language,
        paymentTerms: enhancedData.paymentTerms,
        creditLimit: parseInt(enhancedData.creditLimit) || 0,
        secondaryContacts: enhancedData.secondaryContacts,
        updatedAt: serverTimestamp()
      })

      // Local state update
      setLeads(leads.map(lead =>
        lead.id === enhancedData.selectedLeadId
          ? {
              ...lead,
              address: enhancedData.address,
              industry: enhancedData.industry,
              website: enhancedData.website,
              employees: parseInt(enhancedData.employees) || lead.employees,
              annualRevenue: enhancedData.annualRevenue,
              linkedin: enhancedData.linkedin,
              twitter: enhancedData.twitter,
              instagram: enhancedData.instagram,
              budgetRange: enhancedData.budgetRange,
              decisionTimeline: enhancedData.decisionTimeline,
              painPoints: enhancedData.painPoints,
              goals: enhancedData.goals,
              competitors: enhancedData.competitors,
              preferredContactMethod: enhancedData.preferredContactMethod,
              preferredContactTime: enhancedData.preferredContactTime,
              timezone: enhancedData.timezone,
              language: enhancedData.language,
              paymentTerms: enhancedData.paymentTerms,
              creditLimit: parseInt(enhancedData.creditLimit) || lead.creditLimit,
              secondaryContacts: enhancedData.secondaryContacts
            }
          : lead
      ))

      setShowEnhancedDataForm(false)
      setEnhancedData({
        selectedLeadId: null,
        address: '',
        industry: '',
        website: '',
        employees: '',
        annualRevenue: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        budgetRange: '',
        decisionTimeline: '',
        painPoints: '',
        goals: '',
        competitors: '',
        preferredContactMethod: 'Email',
        preferredContactTime: '',
        timezone: 'GST (UTC+4)',
        language: 'English',
        paymentTerms: 'Net 30 days',
        creditLimit: '',
        secondaryContacts: []
      })
      
      alert('Client data updated successfully!')
    } catch (error) {
      console.error('Error updating enhanced data:', error)
      alert('Failed to update client data!')
    }
  }

  const handleEditLead = (lead: Lead) => {
    setEditFormData({
      id: lead.id,
      name: lead.name,
      company: lead.company,
      value: lead.value.toString(),
      status: lead.status,
      priority: lead.priority,
      email: lead.email,
      phone: lead.phone,
      sources: Array.isArray(lead.source) ? lead.source : (lead.source ? [lead.source] : []),
      surveyType: lead.surveyType || '' // Set surveyType from lead data
    })
    setShowEditForm(true)
  }

  const handleUpdateLead = async () => {
    if (!editFormData || !editFormData.name || !editFormData.company || !editFormData.value) {
      alert('Please fill in all required fields!')
      return
    }

    try {
      const leadRef = doc(db, 'leads', editFormData.id)
      await updateDoc(leadRef, {
        name: editFormData.name,
        company: editFormData.company,
        value: parseInt(editFormData.value),
        status: editFormData.status,
        priority: editFormData.priority,
        email: editFormData.email,
        phone: editFormData.phone,
        source: editFormData.sources.length > 0 ? editFormData.sources : ['Manual Entry'],
        surveyType: editFormData.surveyType, // Update surveyType in Firebase
        updatedAt: serverTimestamp()
      })

      // Local state update
      setLeads(leads.map(l =>
        l.id === editFormData.id
          ? {
              ...l,
              name: editFormData.name,
              company: editFormData.company,
              value: parseInt(editFormData.value),
              status: editFormData.status,
              priority: editFormData.priority,
              email: editFormData.email,
              phone: editFormData.phone,
              source: editFormData.sources,
              surveyType: editFormData.surveyType // Update local state
            }
          : l
      ))

      setShowEditForm(false)
      setEditFormData(null)
    } catch (error) {
      console.error('Error updating lead:', error)
      alert('Failed to update lead!')
    }
  }

  const totalPipeline = filteredLeads.reduce((sum, l) => sum + l.value, 0)
  const avgDealSize = filteredLeads.length > 0 ? filteredLeads.reduce((sum, l) => sum + l.value, 0) / filteredLeads.length : 0
  const activeLead = filteredLeads.filter(l => l.status !== 'Won').length
  const wonDeals = filteredLeads.filter(l => l.status === 'Won').reduce((sum, l) => sum + l.value, 0)

  // Calculate counts for each status
  const newLeadsCount = filteredLeads.filter(l => l.status === 'New').length
  const contactedLeadsCount = filteredLeads.filter(l => l.status === 'Contacted').length
  const qualifiedLeadsCount = filteredLeads.filter(l => l.status === 'Qualified').length
  const negotiationLeadsCount = filteredLeads.filter(l => l.status === 'Negotiation').length
  const wonLeadsCount = filteredLeads.filter(l => l.status === 'Won').length
  const contacterLeadsCount = filteredLeads.filter(l => l.status === 'Contacter').length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return { bg: 'bg-red-100', text: 'text-red-900', badge: 'bg-red-50 text-red-700 border-red-300' }
      case 'Medium': return { bg: 'bg-amber-100', text: 'text-amber-900', badge: 'bg-amber-50 text-amber-700 border-amber-300' }
      default: return { bg: 'bg-green-100', text: 'text-green-900', badge: 'bg-green-50 text-green-700 border-green-300' }
    }
  }

  const handleLeadSelectChange = (leadId: string) => {
    const selectedLead = leads.find(l => l.id === leadId);
    if (selectedLead) {
      setEnhancedData({
        ...enhancedData,
        selectedLeadId: leadId,
        address: selectedLead.address || '',
        industry: selectedLead.industry || '',
        website: selectedLead.website || '',
        employees: selectedLead.employees?.toString() || '',
        annualRevenue: selectedLead.annualRevenue || '',
        linkedin: selectedLead.linkedin || '',
        twitter: selectedLead.twitter || '',
        instagram: selectedLead.instagram || '',
        budgetRange: selectedLead.budgetRange || '',
        decisionTimeline: selectedLead.decisionTimeline || '',
        painPoints: selectedLead.painPoints || '',
        goals: selectedLead.goals || '',
        competitors: selectedLead.competitors || '',
        preferredContactMethod: selectedLead.preferredContactMethod || 'Email',
        preferredContactTime: selectedLead.preferredContactTime || '',
        timezone: selectedLead.timezone || 'GST (UTC+4)',
        language: selectedLead.language || 'English',
        paymentTerms: selectedLead.paymentTerms || 'Net 30 days',
        creditLimit: selectedLead.creditLimit?.toString() || '',
        secondaryContacts: selectedLead.secondaryContacts || []
      });
    }
  }

  const formatSocialMediaUrl = (url: string, platform: 'linkedin' | 'twitter' | 'instagram') => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    
    switch (platform) {
      case 'linkedin':
        return `https://${url}`;
      case 'twitter':
        return `https://${url}`;
      case 'instagram':
        return `https://${url}`;
      default:
        return url;
    }
  }

  // Mobile-style calendar functions
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Generate years (current year ± 4 years)
  const years = Array.from({ length: 9 }, (_, i) => currentYear - 4 + i)

  // Handle month selection
  const handleMonthSelect = (monthIndex: number) => {
    const date = new Date(currentYear, monthIndex, 1)
    setSelectedDate(date)
    setCalendarView('month')
  }

  // Handle year selection
  const handleYearSelect = (year: number) => {
    const date = new Date(year, currentMonth, 1)
    setSelectedDate(date)
    setCalendarView('year')
    setCurrentYear(year)
  }

  // Navigate years
  const navigateYears = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentYear(prev => prev - 1)
    } else {
      setCurrentYear(prev => prev + 1)
    }
  }

  // Navigate months
  const navigateMonths = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(prev => prev - 1)
      } else {
        setCurrentMonth(prev => prev - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(prev => prev + 1)
      } else {
        setCurrentMonth(prev => prev + 1)
      }
    }
  }

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(null)
    setShowCalendar(false)
    setCurrentYear(new Date().getFullYear())
    setCurrentMonth(new Date().getMonth())
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-white p-6 text-gray-900 shadow-lg border border-gray-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-300">
                <Kanban className="h-4 w-4 text-blue-700" />
              </div>
              <span className="text-blue-700 font-bold text-xs uppercase">CRM Management</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Lead & Pipeline Hub</h1>
            <p className="text-gray-600 mt-2 text-sm"> {filteredLeads.length} leads found</p>
          </div>
          <div className="flex gap-3">
            {/* FANCY AI BUTTON */}
          

            <button onClick={() => setShowNewForm(true)} className="group relative flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              New Lead
            </button>
            <button onClick={() => setShowEnhancedDataForm(true)} className="group relative flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]">
              <Database className="h-4 w-4" />
              Add Client Data
            </button>
              <button 
              onClick={fetchAISuggestions}
              className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/20"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Persona Leads</span>
              <Cpu className="h-3 w-3 animate-spin" />
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-40 w-40 rounded-full bg-blue-100 blur-[80px] opacity-30"></div>
      </div>

      {/* Stats Grid - Updated with all status counts */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* New Leads Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">New Leads</p>
              <p className="text-lg font-black mt-0.5 text-blue-700">{newLeadsCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <UserPlus className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Contacted Leads Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contacted</p>
              <p className="text-lg font-black mt-0.5 text-indigo-700">{contactedLeadsCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <PhoneCall className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Qualified Leads Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Qualified</p>
              <p className="text-lg font-black mt-0.5 text-purple-700">{qualifiedLeadsCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Negotiation Leads Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Negotiation</p>
              <p className="text-lg font-black mt-0.5 text-amber-700">{negotiationLeadsCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Handshake className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Won Leads Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Won</p>
              <p className="text-lg font-black mt-0.5 text-green-700">{wonLeadsCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-100 text-green-700">
              <Award className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Contacter Leads Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contacter</p>
              <p className="text-lg font-black mt-0.5 text-rose-700">{contacterLeadsCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <UsersRound className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter with MOBILE-STYLE CALENDAR */}
      <div className="flex px-25 flex-col md:flex-row gap-4 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search leads by name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[750px] pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-500 transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-w-40"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          
          {/* Mobile-Style Calendar Filter */}
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all flex items-center gap-2 hover:bg-gray-50 min-w-48"
            >
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              {selectedDate ? 
                calendarView === 'month' ? 
                  `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : 
                  `Year ${selectedDate.getFullYear()}`
                : 'Filter by Date'
              }
              {showCalendar ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-72">
                <div className="mb-3">
                  <label className="text-xs font-bold text-gray-700 uppercase block mb-2">
                    Filter by:
                  </label>
                  <select
                    value={dateFilterType}
                    onChange={(e) => setDateFilterType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="joinDate">Join Date</option>
                    <option value="lastContact">Last Contact</option>
                    <option value="createdAt">Created Date</option>
                  </select>
                </div>
                
                <div className="mb-3 flex gap-2">
                  <button
                    onClick={() => setCalendarView('month')}
                    className={`flex-1 px-3 py-1.5 text-sm rounded-lg ${calendarView === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setCalendarView('year')}
                    className={`flex-1 px-3 py-1.5 text-sm rounded-lg ${calendarView === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Year
                  </button>
                </div>
                
                {calendarView === 'month' ? (
                  <div className="space-y-3">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => navigateMonths('prev')}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-gray-900">
                        {months[currentMonth]} {currentYear}
                      </span>
                      <button
                        onClick={() => navigateMonths('next')}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Year Navigation */}
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <button
                        onClick={() => navigateYears('prev')}
                        className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                      >
                        ← {currentYear - 1}
                      </button>
                      <span className="font-bold text-blue-600">{currentYear}</span>
                      <button
                        onClick={() => navigateYears('next')}
                        className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
                      >
                        {currentYear + 1} →
                      </button>
                    </div>
                    
                    {/* Month Grid - Mobile Style */}
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month, index) => (
                        <button
                          key={month}
                          onClick={() => handleMonthSelect(index)}
                          className={`p-2.5 text-xs rounded-lg text-center transition-all ${
                            selectedDate && 
                            selectedDate.getMonth() === index && 
                            selectedDate.getFullYear() === currentYear
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-sm'
                          } ${currentMonth === index ? 'font-bold border border-blue-300' : ''}`}
                        >
                          {month.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Year Navigation */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => navigateYears('prev')}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-gray-900">{currentYear}</span>
                      <button
                        onClick={() => navigateYears('next')}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Year Grid - Mobile Style */}
                    <div className="max-h-48 overflow-y-auto">
                      <div className="grid grid-cols-3 gap-2">
                        {years.map(year => (
                          <button
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className={`p-3 text-sm rounded-lg text-center transition-all ${
                              selectedDate && selectedDate.getFullYear() === year
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-sm'
                            } ${currentYear === year ? 'font-bold border border-blue-300' : ''}`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Quick Year Select */}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleYearSelect(new Date().getFullYear())}
                          className="flex-1 px-3 py-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200"
                        >
                          Current Year
                        </button>
                        <button
                          onClick={() => handleYearSelect(new Date().getFullYear() - 1)}
                          className="flex-1 px-3 py-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200"
                        >
                          Last Year
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                  <button
                    onClick={clearDateFilter}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                  >
                    Clear Filter
                  </button>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Kanban className="h-5 w-5 text-blue-700" />
          <h2 className="text-xl font-black text-gray-900">Pipeline Board</h2>
          <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">{filteredLeads.length} Leads</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-6 snap-x scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {leadsByStage.map((stageData) => (
            <div key={stageData.stage} className="shrink-0 w-72 snap-start">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{stageData.stage}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[9px] font-bold text-gray-700">
                    {stageData.count}
                  </span>
                </div>
                <p className="text-[9px] font-bold text-blue-700 uppercase">
                  AED {(stageData.total / 1000).toFixed(0)}K
                </p>
              </div>

              <div 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stageData)}
                className="space-y-2 min-h-87.5 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 p-3 transition-all hover:border-blue-400 hover:bg-blue-50"
              >
                {stageData.leads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                    onClick={() => { setSelectedLead(lead); setShowLeadModal(true) }}
                    className={`bg-white border-l-4 rounded-lg p-3 cursor-move hover:shadow-md transition-all group ${
                      draggedLead?.id === lead.id ? 'opacity-50 scale-95' : 'hover:border-l-blue-500'
                    } ${
                      lead.priority === 'High' ? 'border-l-red-500' :
                      lead.priority === 'Medium' ? 'border-l-amber-500' :
                      'border-l-green-500'
                    }`}
                    style={{ cursor: draggedLead?.id === lead.id ? 'grabbing' : 'grab' }}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-xs group-hover:text-blue-600 truncate">
                          {lead.name.split(' ')[0]} {lead.name.split(' ')[1]?.charAt(0)}.
                        </h4>
                        <p className="text-[10px] text-gray-600 font-medium truncate mt-0.5">
                          {lead.company.substring(0, 20)}...
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <span className="text-xs font-bold text-blue-700">
                            AED {(lead.value / 1000).toFixed(0)}K
                          </span>
                          <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {lead.daysInStage}d
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 ml-5">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${getPriorityColor(lead.priority).badge}`}>
                        {lead.priority}
                      </span>
                    </div>
                  </div>
                ))}
                
                {stageData.leads.length === 0 && (
                  <div className="h-24 flex flex-col items-center justify-center text-gray-400">
                    <Activity className="h-5 w-5 mb-2 opacity-40" />
                    <span className="text-[9px] font-bold uppercase opacity-50">No leads</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leads Table Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-green-700" />
          <h2 className="text-xl font-black text-gray-900">All Leads Directory</h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left font-black text-gray-900 uppercase text-[10px] tracking-wider">Lead Name</th>
                <th className="px-4 py-3 text-left font-black text-gray-900 uppercase text-[10px] tracking-wider">Company</th>
                <th className="px-4 py-3 text-left font-black text-gray-900 uppercase text-[10px] tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left font-black text-gray-900 uppercase text-[10px] tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left font-black text-gray-900 uppercase text-[10px] tracking-wider">Tier</th>
                <th className="px-4 py-3 text-left font-black text-gray-900 uppercase text-[10px] tracking-wider">Source</th>
                <th className="px-4 py-3 text-left font-black text-gray-900 uppercase text-[10px] tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{lead.name}</p>
                      <p className="text-[9px] text-gray-600 mt-0.5">{lead.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-700">{lead.company}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[9px] font-bold uppercase border ${
                      lead.status === 'Won' ? 'bg-green-100 text-green-700 border-green-300' :
                      lead.status === 'Negotiation' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                      lead.status === 'New' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                      lead.status === 'Qualified' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                      lead.status === 'Contacted' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                      'bg-yellow-100 text-yellow-700 border-yellow-300'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase border ${getPriorityColor(lead.priority).badge}`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase ${
                      lead.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                      lead.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                      lead.tier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {lead.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-32">
                      {lead.source && Array.isArray(lead.source) ? (
                        lead.source.slice(0, 2).map((src: string, index: number) => (
                          <span key={index} className="inline-flex items-center px-1.5 py-0.5 bg-green-100 text-green-800 text-[8px] font-bold rounded-full uppercase">
                            {src.length > 8 ? `${src.substring(0, 8)}...` : src}
                          </span>
                        ))
                      ) : (
                        <span className="text-[8px] text-gray-500 italic">-</span>
                      )}
                      {lead.source && lead.source.length > 2 && (
                        <span className="text-[8px] text-gray-500 font-medium">+{lead.source.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => { setSelectedLead(lead); setShowLeadModal(true) }}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditLead(lead)}
                        className="p-1.5 hover:bg-blue-200 rounded-lg transition-colors text-blue-600"
                        title="Edit Lead"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Lead Details Modal - WITH SCROLLBAR */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-xl shadow-2xl w-full max-w-4xl max-h-[100vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center border-2 border-blue-300">
                  <Users className="h-7 w-7 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{selectedLead.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-gray-600 text-sm font-medium">{selectedLead.company}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase border ${getPriorityColor(selectedLead.priority).badge}`}>
                      {selectedLead.priority}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      selectedLead.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                      selectedLead.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                      selectedLead.tier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {selectedLead.tier}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowLeadModal(false)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                   
                  </div>
                  <p className="text-xl font-black text-blue-900">AED {selectedLead.value.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart className="h-4 w-4 text-purple-600" />
                    <p className="text-xs font-bold text-purple-700 uppercase">Lifetime Value</p>
                  </div>
                  <p className="text-xl font-black text-purple-900">AED {selectedLead.lifetimeValue.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <p className="text-xs font-bold text-green-700 uppercase">Credit Limit</p>
                  </div>
                  <p className="text-xl font-black text-green-900">AED {selectedLead.creditLimit?.toLocaleString() || '0'}</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <p className="text-xs font-bold text-amber-700 uppercase">Employees</p>
                  </div>
                  <p className="text-xl font-black text-amber-900">{selectedLead.employees}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2 pb-2 border-b">
                      <User className="h-4 w-4 text-blue-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900">{selectedLead.email || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{selectedLead.phone || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="text-sm font-medium text-gray-900">{selectedLead.address || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Website</p>
                          {selectedLead.website ? (
                            <a href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                              {selectedLead.website}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <p className="text-sm text-gray-500">Not specified</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {(selectedLead.linkedin || selectedLead.twitter || selectedLead.instagram) && (
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2 pb-2 border-b">
                        <Globe className="h-4 w-4 text-pink-600" />
                        Social Media Links
                      </h3>
                      <div className="space-y-3">
                        {selectedLead.linkedin && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Linkedin className="h-4 w-4 text-blue-700" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600">LinkedIn</p>
                              </div>
                            </div>
                            <a href={formatSocialMediaUrl(selectedLead.linkedin, 'linkedin')} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                              View
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                        
                        {selectedLead.twitter && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-sky-100 flex items-center justify-center">
                                <Twitter className="h-4 w-4 text-sky-700" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600">Twitter</p>
                              </div>
                            </div>
                            <a href={formatSocialMediaUrl(selectedLead.twitter, 'twitter')} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="text-sm font-medium text-sky-600 hover:underline flex items-center gap-1">
                              View
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                        
                        {selectedLead.instagram && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center">
                                <Instagram className="h-4 w-4 text-pink-700" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600">Instagram</p>
                              </div>
                            </div>
                            <a href={formatSocialMediaUrl(selectedLead.instagram, 'instagram')} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="text-sm font-medium text-pink-600 hover:underline flex items-center gap-1">
                              View
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2 pb-2 border-b">
                      <Briefcase className="h-4 w-4 text-green-600" />
                      Company Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Industry:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.industry || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Annual Revenue:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.annualRevenue || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Budget Range:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.budgetRange || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Competitors:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.competitors || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Language:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.language || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2 pb-2 border-b">
                      <CalendarIcon className="h-4 w-4 text-amber-600" />
                      Timeline & Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Status:</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                          selectedLead.status === 'Won' ? 'bg-green-100 text-green-700' :
                          selectedLead.status === 'Negotiation' ? 'bg-blue-100 text-blue-700' :
                          selectedLead.status === 'New' ? 'bg-gray-100 text-gray-700' :
                          selectedLead.status === 'Qualified' ? 'bg-purple-100 text-purple-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {selectedLead.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Decision Timeline:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.decisionTimeline || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Join Date:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.joinDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Contact:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.lastContact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2 pb-2 border-b">
                      <Target className="h-4 w-4 text-purple-600" />
                      Business Intelligence
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Pain Points:</p>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900">{selectedLead.painPoints || 'Not specified'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Goals:</p>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900">{selectedLead.goals || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2 pb-2 border-b">
                      <MessageSquare className="h-4 w-4 text-sky-600" />
                      Communication & Financial
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Preferred Contact:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.preferredContactMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Contact Time:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.preferredContactTime || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Timezone:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.timezone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment Terms:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.paymentTerms}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm ">
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2 pb-2 border-b">
                    <Tag className="h-4 w-4 text-green-600" />
                    Lead Sources & Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedLead.source && selectedLead.source.length > 0 ? (
                          selectedLead.source.map((src: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 text-xs font-bold rounded-full border border-green-200">
                              {src}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 italic">No sources specified</span>
                        )}
                      </div>
                    </div>
                    
                    {selectedLead.notes && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Additional Notes:</p>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedLead.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-300 flex flex-wrap gap-3">
              <button 
                onClick={() => setShowLeadModal(false)} 
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold text-sm uppercase transition-all flex-1 min-w-[120px]"
              >
                Close
              </button>
              
              <button
                onClick={() => handleEditLead(selectedLead)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm uppercase transition-all flex-1 min-w-[120px] flex items-center justify-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Lead
              </button>
              
              {selectedLead.status !== 'Won' && (
                <select
                  defaultValue={selectedLead.status}
                  onChange={(e) => {
                    handleMoveStage(selectedLead, e.target.value)
                    setShowLeadModal(false)
                  }}
                  className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none flex-1 min-w-[120px]"
                >
                  <option value="">Move to Stage...</option>
                  {stages.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this lead?')) {
                    handleDeleteLead(selectedLead.id)
                  }
                }}
                className="px-6 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold text-sm uppercase transition-all border border-red-300 flex-1 min-w-[120px] flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal - WITH SCROLLBAR */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-md overflow-hidden mt-10">
            <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-linear-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-300">
                  <Plus className="h-5 w-5 text-blue-700" />
                </div>
                <h2 className="text-lg font-black text-gray-900">New Lead</h2>
              </div>
              <button onClick={() => setShowNewForm(false)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Contact Name *</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Company *</label>
                <input
                  type="text"
                  placeholder="Enter company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Lead['status']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 font-bold"
                >
                  <option value="New">New</option>
                  <option value="Contacter">Contacter</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                </select>
              </div>

              {/* New Survey Type Field */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-2">Which type of survey ? *</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                    <input
                      type="radio"
                      name="surveyType"
                      value="survey-Online"
                      checked={formData.surveyType === 'survey-Online'}
                      onChange={(e) => setFormData({...formData, surveyType: e.target.value})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">Online Survey</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                    <input
                      type="radio"
                      name="surveyType"
                      value="needed or not"
                      checked={formData.surveyType === 'needed or not'}
                      onChange={(e) => setFormData({...formData, surveyType: e.target.value})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">No Survey</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                    <input
                      type="radio"
                      name="surveyType"
                      value="physical ur"
                      checked={formData.surveyType === 'physical ur'}
                      onChange={(e) => setFormData({...formData, surveyType: e.target.value})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">Onsite Survey</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="email@company.ae"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+971-50-1111111"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Lead Sources (Select Multiple)</label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {availableSources.map((source) => (
                    <label key={source} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={formData.sources.includes(source)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, sources: [...formData.sources, source]})
                          } else {
                            setFormData({...formData, sources: formData.sources.filter(s => s !== source)})
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{source}</span>
                    </label>
                  ))}
                </div>
                {formData.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {formData.sources.map((source) => (
                      <span key={source} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {source}
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, sources: formData.sources.filter(s => s !== source)})}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as 'High' | 'Medium' | 'Low'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 font-bold"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-300 flex gap-3">
              <button 
                onClick={() => setShowNewForm(false)} 
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold text-sm uppercase transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewLead}
                // disabled={!formData.name || !formData.company || !formData.value}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-bold text-sm uppercase transition-all flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal - WITH SCROLLBAR */}
      {showEditForm && editFormData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-md overflow-hidden mt-20">
            <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-linear-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-300">
                  <Edit2 className="h-5 w-5 text-blue-700" />
                </div>
                <h2 className="text-lg font-black text-gray-900 ">Edit Lead</h2>
              </div>
              <button onClick={() => setShowEditForm(false)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Contact Name *</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Company *</label>
                <input
                  type="text"
                  placeholder="Enter company"
                  value={editFormData.company}
                  onChange={(e) => setEditFormData({...editFormData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Status *</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value as Lead['status']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 font-bold"
                >
                  <option value="New">New</option>
                  <option value="Contacter">Contacter</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                </select>
              </div>

              {/* Edit Survey Type Field */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-2">Which type of survey ? *</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                    <input
                      type="radio"
                      name="editSurveyType"
                      value="survey-Online"
                      checked={editFormData.surveyType === 'survey-Online'}
                      onChange={(e) => setEditFormData({...editFormData, surveyType: e.target.value})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">Survey-Online</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                    <input
                      type="radio"
                      name="editSurveyType"
                      value="needed or not"
                      checked={editFormData.surveyType === 'needed or not'}
                      onChange={(e) => setEditFormData({...editFormData, surveyType: e.target.value})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">No Need</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                    <input
                      type="radio"
                      name="editSurveyType"
                      value="physical ur"
                      checked={editFormData.surveyType === 'physical ur'}
                      onChange={(e) => setEditFormData({...editFormData, surveyType: e.target.value})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">Physical </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="email@company.ae"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+971-50-1111111"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Lead Sources (Select Multiple)</label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {availableSources.map((source) => (
                    <label key={source} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={Array.isArray(editFormData.sources) && editFormData.sources.includes(source)}
                        onChange={(e) => {
                          const currentSources = Array.isArray(editFormData.sources) ? editFormData.sources : [];
                          if (e.target.checked) {
                            setEditFormData({...editFormData, sources: [...currentSources, source]})
                          } else {
                            setEditFormData({...editFormData, sources: currentSources.filter(s => s !== source)})
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{source}</span>
                    </label>
                  ))}
                </div>
                {Array.isArray(editFormData.sources) && editFormData.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {editFormData.sources.map((source: string) => (
                      <span key={source} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {source}
                        <button
                          type="button"
                          onClick={() => {
                            const currentSources = Array.isArray(editFormData.sources) ? editFormData.sources : [];
                            setEditFormData({...editFormData, sources: currentSources.filter(s => s !== source)})
                          }}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Priority</label>
                <select
                  value={editFormData.priority}
                  onChange={(e) => setEditFormData({...editFormData, priority: e.target.value as Lead['priority']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 font-bold"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-300 flex gap-3">
              <button 
                onClick={() => setShowEditForm(false)} 
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold text-sm uppercase transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateLead}
                disabled={!editFormData.name || !editFormData.company || !editFormData.value}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-bold text-sm uppercase transition-all flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Update Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Client Data Form Modal - WITH SCROLLBAR */}
      {showEnhancedDataForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-300 bg-linear-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center border border-green-300">
                  <Database className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Add Enhanced Client Data</h3>
                  <p className="text-sm text-gray-600">Add comprehensive business intelligence and contact details</p>
                </div>
              </div>
              <button onClick={() => setShowEnhancedDataForm(false)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-700 uppercase block mb-3">Select Lead to Enhance</label>
                <select
                  value={enhancedData.selectedLeadId || ''}
                  onChange={(e) => handleLeadSelectChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900 font-medium"
                >
                  <option value="">Choose a lead...</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} - {lead.company}
                    </option>
                  ))}
                </select>
              </div>

              {enhancedData.selectedLeadId && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Business Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Address</label>
                        <input
                          type="text"
                          placeholder="Business Bay, Dubai, UAE"
                          value={enhancedData.address}
                          onChange={(e) => setEnhancedData({...enhancedData, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Industry</label>
                        <input
                          type="text"
                          placeholder="Real Estate, Construction, etc."
                          value={enhancedData.industry}
                          onChange={(e) => setEnhancedData({...enhancedData, industry: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Website</label>
                        <input
                          type="url"
                          placeholder="www.company.com"
                          value={enhancedData.website}
                          onChange={(e) => setEnhancedData({...enhancedData, website: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Employees</label>
                        <input
                          type="number"
                          placeholder="150"
                          value={enhancedData.employees}
                          onChange={(e) => setEnhancedData({...enhancedData, employees: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Annual Revenue</label>
                        <input
                          type="text"
                          placeholder="50M AED"
                          value={enhancedData.annualRevenue}
                          onChange={(e) => setEnhancedData({...enhancedData, annualRevenue: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Credit Limit</label>
                        <input
                          type="number"
                          placeholder="100000"
                          value={enhancedData.creditLimit}
                          onChange={(e) => setEnhancedData({...enhancedData, creditLimit: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Social Media & Online Presence
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">LinkedIn</label>
                        <input
                          type="url"
                          placeholder="linkedin.com/company/name"
                          value={enhancedData.linkedin}
                          onChange={(e) => setEnhancedData({...enhancedData, linkedin: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Twitter</label>
                        <input
                          type="text"
                          placeholder="@companyname"
                          value={enhancedData.twitter}
                          onChange={(e) => setEnhancedData({...enhancedData, twitter: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Instagram</label>
                        <input
                          type="text"
                          placeholder="@companyname"
                          value={enhancedData.instagram}
                          onChange={(e) => setEnhancedData({...enhancedData, instagram: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Business Intelligence
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Budget Range</label>
                        <input
                          type="text"
                          placeholder="50K-100K AED/month"
                          value={enhancedData.budgetRange}
                          onChange={(e) => setEnhancedData({...enhancedData, budgetRange: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Decision Timeline</label>
                        <input
                          type="text"
                          placeholder="2-3 months"
                          value={enhancedData.decisionTimeline}
                          onChange={(e) => setEnhancedData({...enhancedData, decisionTimeline: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Pain Points</label>
                        <textarea
                          placeholder="Describe the main challenges and pain points..."
                          value={enhancedData.painPoints}
                          onChange={(e) => setEnhancedData({...enhancedData, painPoints: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Goals & Objectives</label>
                        <textarea
                          placeholder="What are their business goals and objectives..."
                          value={enhancedData.goals}
                          onChange={(e) => setEnhancedData({...enhancedData, goals: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Competitors</label>
                        <input
                          type="text"
                          placeholder="CleanCorp, ShineServices, etc."
                          value={enhancedData.competitors}
                          onChange={(e) => setEnhancedData({...enhancedData, competitors: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Communication Preferences
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Preferred Contact Method</label>
                        <select
                          value={enhancedData.preferredContactMethod}
                          onChange={(e) => setEnhancedData({...enhancedData, preferredContactMethod: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-900 font-medium"
                        >
                          <option value="Email">Email</option>
                          <option value="Phone">Phone</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="LinkedIn">LinkedIn</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Preferred Contact Time</label>
                        <input
                          type="text"
                          placeholder="9:00 AM - 11:00 AM"
                          value={enhancedData.preferredContactTime}
                          onChange={(e) => setEnhancedData({...enhancedData, preferredContactTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Timezone</label>
                        <input
                          type="text"
                          placeholder="GST (UTC+4)"
                          value={enhancedData.timezone}
                          onChange={(e) => setEnhancedData({...enhancedData, timezone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Language</label>
                        <input
                          type="text"
                          placeholder="English, Arabic"
                          value={enhancedData.language}
                          onChange={(e) => setEnhancedData({...enhancedData, language: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-700 uppercase block mb-1">Payment Terms</label>
                        <select
                          value={enhancedData.paymentTerms}
                          onChange={(e) => setEnhancedData({...enhancedData, paymentTerms: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-900 font-medium"
                        >
                          <option value="Net 15 days">Net 15 days</option>
                          <option value="Net 30 days">Net 30 days</option>
                          <option value="Net 45 days">Net 45 days</option>
                          <option value="Net 60 days">Net 60 days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-1 bg-gray-50 border-t border-gray-300 flex gap-3">
              <button
                onClick={() => setShowEnhancedDataForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold text-sm uppercase transition-all"
              >
                Cancel
              </button>
              <button
                onClick={updateEnhancedData}
                disabled={!enhancedData.selectedLeadId}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-bold text-sm uppercase transition-all flex items-center justify-center gap-2"
              >
                <Database className="h-4 w-4" />
                Update Client Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Persona Generation Modal - FANCY VERSION */}
      {showAIPersonaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-yellow-400" />
                    AI Lead Intelligence
                    <Sparkles className="h-6 w-6 text-yellow-400" />
                  </h2>
                  <p className="text-purple-200 text-sm">Powered by advanced analytics • Top 3 high-potential leads</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAIPersonaModal(false)} 
                className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 rounded-xl p-2 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {aiPersonaResults.length === 0 ? (
                <div className="bg-gray-800/50 rounded-xl p-12 text-center border border-gray-700">
                  <Lightbulb className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No leads found in database</p>
                  <p className="text-gray-600 text-sm mt-2">Add some leads to get AI-powered suggestions</p>
                </div>
              ) : (
                aiPersonaResults.map((lead, index) => (
                  <div
                    key={lead.id}
                    className="bg-gradient-to-r from-gray-800/80 to-gray-800 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                          'bg-gradient-to-br from-amber-700 to-amber-800 text-white'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              lead.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              lead.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {lead.priority} Priority
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{lead.company}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span className="text-xs">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Phone className="h-3 w-3" />
                              <span className="text-xs">{lead.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">AED {lead.value.toLocaleString()}</div>
                        <div className="flex items-center gap-2 mt-2 justify-end">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            lead.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            lead.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            lead.tier === 'Silver' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                            'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}>
                            {lead.tier}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Industry</p>
                        <p className="text-sm text-gray-300">{lead.industry}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Employees</p>
                        <p className="text-sm text-gray-300">{lead.employees}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-bold text-gray-500 uppercase">Budget Range</p>
                        <p className="text-sm text-gray-300">{lead.budgetRange}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Pain Points</p>
                      <p className="text-sm text-gray-300">{lead.painPoints}</p>
                      
                      <p className="text-xs font-bold text-gray-500 uppercase mt-3 mb-2">Goals</p>
                      <p className="text-sm text-gray-300">{lead.goals}</p>
                    </div>
                    
                    
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-purple-500/30 bg-gray-800/50 flex justify-between items-center">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                AI confidence: 95% • Based on deal value analysis
              </p>
              <button
                onClick={() => setShowAIPersonaModal(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

