'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Filter, Check, X, AlertCircle, TrendingUp, DollarSign, BarChart3, Clock, Star, Shield, Eye, CheckCircle, XCircle, FileText, User, Building, MapPin } from 'lucide-react'

// Shared client data (same as used throughout the app)
const sharedClients = [
  {
    id: 1,
    name: 'Ahmed Al-Mansouri',
    company: 'Dubai Properties LLC',
    email: 'ahmed@dubaiprop.ae',
    phone: '+971-50-1111111',
    location: 'Dubai Marina',
    joinDate: '2024-01-15',
    totalSpent: 275000,
    projects: 4,
    lastService: '2025-12-22',
    status: 'Active',
    tier: 'Gold',
    notes: 'Premium client, high satisfaction'
  },
  {
    id: 2,
    name: 'Layla Hassan',
    company: 'Paradise Hotels',
    email: 'layla@paradisehotels.ae',
    phone: '+971-50-4444444',
    location: 'Palm Jumeirah',
    joinDate: '2024-06-10',
    totalSpent: 450000,
    projects: 6,
    lastService: '2025-12-21',
    status: 'Active',
    tier: 'Platinum',
    notes: 'Strategic partner, regular volume'
  },
  {
    id: 3,
    name: 'Fatima Al-Noor',
    company: 'Al Noor Logistics',
    email: 'fatima@alnoorlogistics.ae',
    phone: '+971-50-2222222',
    location: 'Dubai Industrial City',
    joinDate: '2024-03-20',
    totalSpent: 180000,
    projects: 3,
    lastService: '2025-12-20',
    status: 'Active',
    tier: 'Silver',
    notes: 'Growing client, warehouse focus'
  },
  {
    id: 4,
    name: 'Mohammed Al-Zahra',
    company: 'Emirates Medical Center',
    email: 'mohammed@emmc.ae',
    phone: '+971-50-3333333',
    location: 'Dubai Healthcare City',
    joinDate: '2024-08-15',
    totalSpent: 320000,
    projects: 5,
    lastService: '2025-12-19',
    status: 'Active',
    tier: 'Platinum',
    notes: 'Medical facility, critical account'
  },
  {
    id: 5,
    name: 'Sara Al-Mahmoud',
    company: 'Royal Mall Group',
    email: 'sara@royalmall.ae',
    phone: '+971-50-5555555',
    location: 'Dubai Mall Area',
    joinDate: '2024-11-01',
    totalSpent: 150000,
    projects: 2,
    lastService: '2025-12-18',
    status: 'Active',
    tier: 'Silver',
    notes: 'New client, shopping mall'
  }
]

interface SurveyResponse {
  questionId: number
  answer: string | number | string[]
  rating?: number
}

interface CompletedSurvey {
  id: number
  clientId: number
  clientName: string
  clientEmail: string
  company: string
  location: string
  serviceType: string
  surveyDate: string
  status: 'completed' | 'under_review' | 'approved' | 'rejected'
  responses: SurveyResponse[]
  overallRating?: number
  comments?: string
  reviewStatus?: 'pending' | 'approved' | 'rejected'
  reviewDate?: string
  reviewer?: string
  reviewNotes?: string
  complianceScore?: number
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical'
  mediaFiles?: string[]
  followUpRequired?: boolean
  followUpActions?: string[]
}

interface SurveyQuestion {
  id: number
  type: 'rating' | 'yesno' | 'multiple' | 'text'
  question: string
  options?: string[]
  required: boolean
}

const surveyQuestions: SurveyQuestion[] = [
  { id: 1, type: 'rating', question: 'How satisfied are you with our overall service?', required: true },
  { id: 2, type: 'rating', question: 'How would you rate the cleanliness of your facility after our service?', required: true },
  { id: 3, type: 'rating', question: 'How professional was our team?', required: true },
  { id: 4, type: 'yesno', question: 'Did we complete the service within the agreed timeframe?', required: true },
  { id: 5, type: 'yesno', question: 'Would you recommend our services to others?', required: true },
  { id: 6, type: 'multiple', question: 'Which services are you most satisfied with?', options: ['Deep Cleaning', 'Regular Maintenance', 'Sanitization', 'Equipment Cleaning', 'Other'], required: false },
  { id: 7, type: 'text', question: 'Please share any additional feedback or suggestions for improvement.', required: false }
]

export default function SurveyReviewAndPricing() {
  const [quotations, setQuotations] = useState([
    {
      id: 1,
      clientName: 'Al Manara Hotel',
      serviceType: 'Deep Cleaning',
      area: 5000,
      basePrice: 15000,
      recommendedPrice: 16500,
      variance: 10,
      riskScore: 65,
      approvalStatus: 'Pending',
      createdDate: '2024-12-20',
      factors: {
        complexity: 1.2,
        accessibility: 1.0,
        urgency: 1.1,
        seasonality: 1.0
      }
    },
    {
      id: 2,
      clientName: 'Emirates Hospital',
      serviceType: 'Medical Facility Sanitization',
      area: 8500,
      basePrice: 35000,
      recommendedPrice: 42000,
      variance: 20,
      riskScore: 78,
      approvalStatus: 'Approved',
      createdDate: '2024-12-19',
      factors: {
        complexity: 1.5,
        accessibility: 0.9,
        urgency: 1.3,
        seasonality: 1.0
      }
    },
    {
      id: 3,
      clientName: 'Paradise Mall',
      serviceType: 'Regular Cleaning',
      area: 12000,
      basePrice: 24000,
      recommendedPrice: 26400,
      variance: 10,
      riskScore: 52,
      approvalStatus: 'Pending',
      createdDate: '2024-12-18',
      factors: {
        complexity: 1.0,
        accessibility: 1.1,
        urgency: 0.9,
        seasonality: 1.0
      }
    },
    {
      id: 4,
      clientName: 'Tech Hub Office',
      serviceType: 'Office Cleaning',
      area: 3500,
      basePrice: 8750,
      recommendedPrice: 9100,
      variance: 4,
      riskScore: 35,
      approvalStatus: 'Approved',
      createdDate: '2024-12-15',
      factors: {
        complexity: 0.8,
        accessibility: 1.2,
        urgency: 1.0,
        seasonality: 1.0
      }
    }
  ])

  const [surveys, setSurveys] = useState<CompletedSurvey[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [selectedSurvey, setSelectedSurvey] = useState<CompletedSurvey | null>(null)
  const [approvalComment, setApprovalComment] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [followUpActions, setFollowUpActions] = useState<string[]>([])
  const [newAction, setNewAction] = useState('')
  const [activeTab, setActiveTab] = useState<'pricing' | 'reviews'>('pricing')

  // Calculate compliance score based on responses
  const calculateComplianceScore = useCallback((responses: SurveyResponse[]) => {
    let score = 0
    let maxScore = 0

    responses.forEach(response => {
      const question = surveyQuestions.find(q => q.id === response.questionId)
      if (!question) return

      maxScore += 10 // Each question worth 10 points

      if (question.type === 'rating') {
        const rating = response.rating || 0
        score += (rating / 5) * 10
      } else if (question.type === 'yesno') {
        score += response.answer === 'Yes' ? 10 : 0
      } else if (question.type === 'multiple') {
        score += Array.isArray(response.answer) && response.answer.length > 0 ? 10 : 5
      } else if (question.type === 'text') {
        score += response.answer && (response.answer as string).length > 10 ? 10 : 5
      }
    })

    return Math.round((score / maxScore) * 100)
  }, [])

  // Calculate risk level based on responses and rating
  const calculateRiskLevel = useCallback((responses: SurveyResponse[], overallRating?: number) => {
    let riskScore = 0

    // Low rating increases risk
    if (overallRating && overallRating < 3) riskScore += 3
    else if (overallRating && overallRating < 4) riskScore += 1

    // Check for negative responses
    responses.forEach(response => {
      if (response.questionId === 4 && response.answer === 'No') riskScore += 2 // Late service
      if (response.questionId === 5 && response.answer === 'No') riskScore += 2 // Won't recommend
      if (response.questionId === 7 && response.answer) {
        const feedback = response.answer as string
        if (feedback.toLowerCase().includes('complaint') || feedback.toLowerCase().includes('problem')) {
          riskScore += 1
        }
      }
    })

    if (riskScore >= 4) return 'Critical'
    if (riskScore >= 3) return 'High'
    if (riskScore >= 2) return 'Medium'
    return 'Low'
  }, [])

  // Load surveys from localStorage (shared with results page)
  useEffect(() => {
    const loadSurveys = () => {
      let storedSurveys = JSON.parse(localStorage.getItem('clientSurveys') || '[]')

      // If no surveys in localStorage, initialize with mock data
      if (storedSurveys.length === 0) {
        storedSurveys = [
          {
            id: 1,
            clientId: 1,
            clientName: 'Ahmed Al-Mansouri',
            clientEmail: 'ahmed@dubaiprop.ae',
            company: 'Dubai Properties LLC',
            location: 'Dubai Marina',
            serviceType: 'Deep Cleaning',
            surveyDate: '2025-12-20',
            status: 'completed',
            reviewStatus: 'approved',
            reviewDate: '2025-12-21',
            reviewer: 'Admin User',
            reviewNotes: 'Excellent feedback from premium client. High satisfaction with service quality.',
            overallRating: 4.8,
            comments: 'Outstanding service as always. The team was professional and thorough.',
            complianceScore: 95,
            riskLevel: 'Low',
            followUpRequired: false,
            followUpActions: [],
            mediaFiles: ['before_cleaning.jpg', 'after_cleaning.jpg'],
            responses: [
              { questionId: 1, answer: '', rating: 5 },
              { questionId: 2, answer: '', rating: 5 },
              { questionId: 3, answer: '', rating: 5 },
              { questionId: 4, answer: 'Yes' },
              { questionId: 5, answer: 'Yes' },
              { questionId: 6, answer: ['Deep Cleaning', 'Regular Maintenance'] },
              { questionId: 7, answer: 'Keep up the excellent work!' }
            ]
          },
          {
            id: 2,
            clientId: 2,
            clientName: 'Layla Hassan',
            clientEmail: 'layla@paradisehotels.ae',
            company: 'Paradise Hotels',
            location: 'Palm Jumeirah',
            serviceType: 'Medical Facility Sanitization',
            surveyDate: '2025-12-19',
            status: 'completed',
            reviewStatus: 'approved',
            reviewDate: '2025-12-20',
            reviewer: 'Admin User',
            reviewNotes: 'Strategic partner survey. Good compliance but some areas for improvement noted.',
            overallRating: 4.2,
            comments: 'Generally satisfied but would like faster response times.',
            complianceScore: 88,
            riskLevel: 'Medium',
            followUpRequired: true,
            followUpActions: ['Schedule follow-up meeting to discuss response times', 'Review service level agreement'],
            mediaFiles: [],
            responses: [
              { questionId: 1, answer: '', rating: 4 },
              { questionId: 2, answer: '', rating: 4 },
              { questionId: 3, answer: '', rating: 5 },
              { questionId: 4, answer: 'No' },
              { questionId: 5, answer: 'Yes' },
              { questionId: 6, answer: ['Sanitization', 'Equipment Cleaning'] },
              { questionId: 7, answer: 'Please improve response times for urgent requests.' }
            ]
          },
          {
            id: 3,
            clientId: 3,
            clientName: 'Fatima Al-Noor',
            clientEmail: 'fatima@alnoorlogistics.ae',
            company: 'Al Noor Logistics',
            location: 'Dubai Industrial City',
            serviceType: 'Regular Cleaning',
            surveyDate: '2025-12-18',
            status: 'completed',
            reviewStatus: 'pending',
            overallRating: 3.5,
            comments: 'Service was adequate but not exceptional.',
            complianceScore: 72,
            riskLevel: 'High',
            followUpRequired: false,
            followUpActions: [],
            mediaFiles: ['warehouse_before.jpg'],
            responses: [
              { questionId: 1, answer: '', rating: 3 },
              { questionId: 2, answer: '', rating: 4 },
              { questionId: 3, answer: '', rating: 4 },
              { questionId: 4, answer: 'Yes' },
              { questionId: 5, answer: 'No' },
              { questionId: 6, answer: ['Regular Maintenance'] },
              { questionId: 7, answer: 'Could improve on thoroughness in some areas.' }
            ]
          },
          {
            id: 4,
            clientId: 4,
            clientName: 'Mohammed Al-Zahra',
            clientEmail: 'mohammed@emmc.ae',
            company: 'Emirates Medical Center',
            location: 'Dubai Healthcare City',
            serviceType: 'Medical Facility Sanitization',
            surveyDate: '2025-12-17',
            status: 'completed',
            reviewStatus: 'approved',
            reviewDate: '2025-12-18',
            reviewer: 'Admin User',
            reviewNotes: 'Critical medical facility account. High compliance maintained.',
            overallRating: 4.6,
            comments: 'Excellent sanitization service. Critical for our operations.',
            complianceScore: 92,
            riskLevel: 'Low',
            followUpRequired: false,
            followUpActions: [],
            mediaFiles: ['medical_facility.jpg', 'sanitization_report.pdf'],
            responses: [
              { questionId: 1, answer: '', rating: 5 },
              { questionId: 2, answer: '', rating: 4 },
              { questionId: 3, answer: '', rating: 5 },
              { questionId: 4, answer: 'Yes' },
              { questionId: 5, answer: 'Yes' },
              { questionId: 6, answer: ['Sanitization', 'Equipment Cleaning'] },
              { questionId: 7, answer: 'Very satisfied with the medical-grade cleaning standards.' }
            ]
          },
          {
            id: 5,
            clientId: 5,
            clientName: 'Sara Al-Mahmoud',
            clientEmail: 'sara@royalmall.ae',
            company: 'Royal Mall Group',
            location: 'Dubai Mall Area',
            serviceType: 'Regular Cleaning',
            surveyDate: '2025-12-16',
            status: 'completed',
            reviewStatus: 'rejected',
            reviewDate: '2025-12-17',
            reviewer: 'Admin User',
            reviewNotes: 'Rejected due to low compliance and negative feedback. Requires immediate follow-up.',
            overallRating: 2.1,
            comments: 'Very disappointed with the service quality.',
            complianceScore: 45,
            riskLevel: 'Critical',
            followUpRequired: true,
            followUpActions: ['Schedule emergency meeting with client', 'Conduct internal review of service team', 'Provide compensation offer'],
            mediaFiles: ['complaint_photos.jpg'],
            responses: [
              { questionId: 1, answer: '', rating: 2 },
              { questionId: 2, answer: '', rating: 2 },
              { questionId: 3, answer: '', rating: 2 },
              { questionId: 4, answer: 'No' },
              { questionId: 5, answer: 'No' },
              { questionId: 6, answer: ['Other'] },
              { questionId: 7, answer: 'Service was incomplete and team was unprofessional. Will consider switching providers.' }
            ]
          },
          {
            id: 6,
            clientId: 1,
            clientName: 'Ahmed Al-Mansouri',
            clientEmail: 'ahmed@dubaiprop.ae',
            company: 'Dubai Properties LLC',
            location: 'Dubai Marina',
            serviceType: 'Office Cleaning',
            surveyDate: '2025-12-15',
            status: 'completed',
            reviewStatus: 'approved',
            reviewDate: '2025-12-16',
            reviewer: 'Admin User',
            reviewNotes: 'Consistent high performance from premium client.',
            overallRating: 4.9,
            comments: 'Always reliable and professional.',
            complianceScore: 97,
            riskLevel: 'Low',
            followUpRequired: false,
            followUpActions: [],
            mediaFiles: [],
            responses: [
              { questionId: 1, answer: '', rating: 5 },
              { questionId: 2, answer: '', rating: 5 },
              { questionId: 3, answer: '', rating: 5 },
              { questionId: 4, answer: 'Yes' },
              { questionId: 5, answer: 'Yes' },
              { questionId: 6, answer: ['Regular Maintenance', 'Equipment Cleaning'] },
              { questionId: 7, answer: 'Excellent service as expected.' }
            ]
          },
          {
            id: 7,
            clientId: 3,
            clientName: 'Fatima Al-Noor',
            clientEmail: 'fatima@alnoorlogistics.ae',
            company: 'Al Noor Logistics',
            location: 'Dubai Industrial City',
            serviceType: 'Deep Cleaning',
            surveyDate: '2025-12-14',
            status: 'completed',
            reviewStatus: 'pending',
            overallRating: 3.8,
            comments: 'Service was okay but could be better.',
            complianceScore: 78,
            riskLevel: 'Medium',
            followUpRequired: false,
            followUpActions: [],
            mediaFiles: ['warehouse_cleaning.jpg'],
            responses: [
              { questionId: 1, answer: '', rating: 4 },
              { questionId: 2, answer: '', rating: 3 },
              { questionId: 3, answer: '', rating: 4 },
              { questionId: 4, answer: 'Yes' },
              { questionId: 5, answer: 'No' },
              { questionId: 6, answer: ['Deep Cleaning'] },
              { questionId: 7, answer: 'Need more attention to detail in storage areas.' }
            ]
          },
          {
            id: 8,
            clientId: 2,
            clientName: 'Layla Hassan',
            clientEmail: 'layla@paradisehotels.ae',
            company: 'Paradise Hotels',
            location: 'Palm Jumeirah',
            serviceType: 'Regular Cleaning',
            surveyDate: '2025-12-13',
            status: 'completed',
            reviewStatus: 'approved',
            reviewDate: '2025-12-14',
            reviewer: 'Admin User',
            reviewNotes: 'Good performance from strategic partner.',
            overallRating: 4.3,
            comments: 'Consistent service quality.',
            complianceScore: 85,
            riskLevel: 'Low',
            followUpRequired: false,
            followUpActions: [],
            mediaFiles: [],
            responses: [
              { questionId: 1, answer: '', rating: 4 },
              { questionId: 2, answer: '', rating: 4 },
              { questionId: 3, answer: '', rating: 5 },
              { questionId: 4, answer: 'Yes' },
              { questionId: 5, answer: 'Yes' },
              { questionId: 6, answer: ['Regular Maintenance', 'Sanitization'] },
              { questionId: 7, answer: 'Satisfied with the overall service.' }
            ]
          }
        ]
        localStorage.setItem('clientSurveys', JSON.stringify(storedSurveys))
      }

      const enhancedSurveys = storedSurveys.map((survey: any) => ({
        ...survey,
        status: survey.status || 'completed',
        reviewStatus: survey.reviewStatus || 'pending',
        company: sharedClients.find(c => c.id === survey.clientId)?.company || '',
        location: sharedClients.find(c => c.id === survey.clientId)?.location || '',
        complianceScore: survey.complianceScore || calculateComplianceScore(survey.responses),
        riskLevel: survey.riskLevel || calculateRiskLevel(survey.responses, survey.overallRating),
        mediaFiles: survey.mediaFiles || [],
        followUpRequired: survey.followUpRequired || false,
        followUpActions: survey.followUpActions || []
      }))
      setSurveys(enhancedSurveys)
    }

    loadSurveys()
    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(loadSurveys, 30000)
    return () => clearInterval(interval)
  }, [calculateComplianceScore, calculateRiskLevel])

  // Base pricing by service type
  const basePricingMap: any = {
    'Deep Cleaning': 3,
    'Regular Cleaning': 2,
    'Medical Facility Sanitization': 4,
    'Office Cleaning': 2.5,
    'Carpet Cleaning': 2.8
  }

  // Enhanced AI price recommendation considering survey data
  const calculateAIPriceRecommendation = useCallback((quote: any) => {
    const basePerSqm = basePricingMap[quote.serviceType] || 2.5
    const calculatedBase = quote.area * basePerSqm

    let multiplier = 1.0
    multiplier *= quote.factors.complexity
    multiplier *= quote.factors.accessibility
    multiplier *= quote.factors.urgency
    multiplier *= quote.factors.seasonality

    // Find related survey data for this client
    const clientSurveys = surveys.filter(s => s.clientName === quote.clientName && s.serviceType === quote.serviceType)
    const latestSurvey = clientSurveys.sort((a, b) => new Date(b.surveyDate).getTime() - new Date(a.surveyDate).getTime())[0]

    // Adjust pricing based on survey feedback
    if (latestSurvey) {
      const rating = latestSurvey.overallRating || 0
      const compliance = latestSurvey.complianceScore || 0

      // Premium pricing for high satisfaction
      if (rating >= 4.5 && compliance >= 90) {
        multiplier *= 1.15 // 15% premium for excellent feedback
      } else if (rating >= 4.0 && compliance >= 80) {
        multiplier *= 1.08 // 8% premium for good feedback
      } else if (rating < 3.0 || compliance < 70) {
        multiplier *= 0.95 // 5% discount for poor feedback
      }

      // Risk adjustment based on survey risk level
      if (latestSurvey.riskLevel === 'High') {
        multiplier *= 1.1 // 10% risk premium
      } else if (latestSurvey.riskLevel === 'Critical') {
        multiplier *= 1.2 // 20% risk premium
      }
    }

    const aiRecommendedPrice = Math.round(calculatedBase * multiplier)
    const variance = Math.round(((aiRecommendedPrice - calculatedBase) / calculatedBase) * 100)

    return {
      aiRecommendedPrice,
      variance,
      calculatedBase,
      surveyInsights: latestSurvey ? {
        rating: latestSurvey.overallRating,
        compliance: latestSurvey.complianceScore,
        riskLevel: latestSurvey.riskLevel,
        reviewStatus: latestSurvey.reviewStatus
      } : null
    }
  }, [basePricingMap, surveys])

  // Variance detection and approval rules
  const analyzeVariance = useCallback((quote: any) => {
    const { variance } = calculateAIPriceRecommendation(quote)

    let rule = 'Standard'
    let requiresApproval = false
    let riskLevel = 'Low'

    if (variance > 30) {
      requiresApproval = true
      riskLevel = 'High'
      rule = 'High Variance - Requires Manager Approval'
    } else if (variance > 15) {
      rule = 'Medium Variance - Auto-Approved'
      riskLevel = 'Medium'
    } else if (variance < -15) {
      requiresApproval = true
      riskLevel = 'High'
      rule = 'Below Baseline - Requires Manager Review'
    }

    return { rule, requiresApproval, riskLevel, variance }
  }, [calculateAIPriceRecommendation])

  const filteredQuotes = useMemo(() => {
    return quotations.filter(quote => {
      const matchesSearch = quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quote.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'All' || quote.approvalStatus === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [quotations, searchTerm, filterStatus])

  const filteredSurveys = useMemo(() => {
    return surveys.filter(survey => {
      const matchesSearch = survey.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           survey.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           survey.company.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'All' || survey.reviewStatus === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [surveys, searchTerm, filterStatus])

  const stats = useMemo(() => {
    const pricingStats = {
      total: quotations.length,
      pending: quotations.filter(q => q.approvalStatus === 'Pending').length,
      approved: quotations.filter(q => q.approvalStatus === 'Approved').length,
      rejected: quotations.filter(q => q.approvalStatus === 'Rejected').length,
      totalRevenue: quotations.reduce((sum, q) => sum + q.recommendedPrice, 0)
    }

    const surveyStats = {
      total: filteredSurveys.length,
      pending: filteredSurveys.filter(s => s.reviewStatus === 'pending').length,
      approved: filteredSurveys.filter(s => s.reviewStatus === 'approved').length,
      rejected: filteredSurveys.filter(s => s.reviewStatus === 'rejected').length,
      avgRating: filteredSurveys.length > 0 ? filteredSurveys.reduce((sum, s) => sum + (s.overallRating || 0), 0) / filteredSurveys.length : 0,
      avgCompliance: filteredSurveys.length > 0 ? filteredSurveys.reduce((sum, s) => sum + (s.complianceScore || 0), 0) / filteredSurveys.length : 0
    }

    return { pricing: pricingStats, surveys: surveyStats }
  }, [quotations, filteredSurveys])

  const handleApproveQuote = useCallback((quote: any) => {
    setQuotations(quotations.map(q => q.id === quote.id ? { ...q, approvalStatus: 'Approved' } : q))
    setSelectedQuote(null)
    alert('Quote approved!')
  }, [quotations])

  const handleRejectQuote = useCallback((quote: any) => {
    if (!approvalComment) {
      alert('Please provide a reason for rejection')
      return
    }
    setQuotations(quotations.map(q => q.id === quote.id ? { ...q, approvalStatus: 'Rejected', rejectionReason: approvalComment } : q))
    setApprovalComment('')
    setSelectedQuote(null)
    alert('Quote rejected!')
  }, [quotations, approvalComment])

  // Handle survey approval
  const handleApproveSurvey = useCallback((surveyId: number) => {
    const updatedSurveys = surveys.map(survey =>
      survey.id === surveyId
        ? {
            ...survey,
            reviewStatus: 'approved' as const,
            reviewDate: new Date().toISOString().split('T')[0],
            reviewer: 'Admin User',
            reviewNotes: reviewNotes,
            followUpRequired: followUpActions.length > 0,
            followUpActions: followUpActions
          }
        : survey
    )
    setSurveys(updatedSurveys)
    localStorage.setItem('clientSurveys', JSON.stringify(updatedSurveys))

    // Update survey management page data
    const managementSurveys = JSON.parse(localStorage.getItem('surveyAssignments') || '[]')
    const updatedManagement = managementSurveys.map((s: any) =>
      s.id === surveyId ? { ...s, status: 'reviewed', reviewStatus: 'approved' } : s
    )
    localStorage.setItem('surveyAssignments', JSON.stringify(updatedManagement))

    setSelectedSurvey(null)
    setReviewNotes('')
    setFollowUpActions([])
  }, [surveys, reviewNotes, followUpActions])

  // Handle survey rejection
  const handleRejectSurvey = useCallback((surveyId: number) => {
    const updatedSurveys = surveys.map(survey =>
      survey.id === surveyId
        ? {
            ...survey,
            reviewStatus: 'rejected' as const,
            reviewDate: new Date().toISOString().split('T')[0],
            reviewer: 'Admin User',
            reviewNotes: reviewNotes,
            followUpRequired: followUpActions.length > 0,
            followUpActions: followUpActions
          }
        : survey
    )
    setSurveys(updatedSurveys)
    localStorage.setItem('clientSurveys', JSON.stringify(updatedSurveys))

    // Update survey management page data
    const managementSurveys = JSON.parse(localStorage.getItem('surveyAssignments') || '[]')
    const updatedManagement = managementSurveys.map((s: any) =>
      s.id === surveyId ? { ...s, status: 'reviewed', reviewStatus: 'rejected' } : s
    )
    localStorage.setItem('surveyAssignments', JSON.stringify(updatedManagement))

    setSelectedSurvey(null)
    setReviewNotes('')
    setFollowUpActions([])
  }, [surveys, reviewNotes, followUpActions])

  // Add follow-up action
  const addFollowUpAction = useCallback(() => {
    if (newAction.trim()) {
      setFollowUpActions([...followUpActions, newAction.trim()])
      setNewAction('')
    }
  }, [newAction, followUpActions])

  // Remove follow-up action
  const removeFollowUpAction = useCallback((index: number) => {
    setFollowUpActions(followUpActions.filter((_, i) => i !== index))
  }, [followUpActions])

  // Get risk level color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'High': return 'text-orange-600 bg-orange-50'
      case 'Critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-600 bg-blue-50'
      case 'approved': return 'text-green-600 bg-green-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Survey Review & Pricing</h1>
          <p className="text-gray-600">AI-powered survey reviews and intelligent pricing recommendations based on client feedback</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pricing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💰 AI Pricing Recommendations
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Survey Reviews
              </button>
            </nav>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {activeTab === 'pricing' ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pricing.total}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.pricing.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.pricing.approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-pink-600">AED {(stats.pricing.totalRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-pink-500" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.surveys.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.surveys.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.surveys.avgRating.toFixed(1)}★</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                    <p className="text-2xl font-bold text-green-600">{stats.surveys.avgCompliance.toFixed(0)}%</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search surveys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'pricing' ? (
          /* Pricing Table */
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Recommended</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Survey Insights</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuotes.map((quote) => {
                    const { aiRecommendedPrice, variance, surveyInsights } = calculateAIPriceRecommendation(quote)
                    const { requiresApproval } = analyzeVariance(quote)
                    return (
                      <tr key={quote.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{quote.clientName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{quote.serviceType}</div>
                          <div className="text-sm text-gray-500">{quote.area.toLocaleString()} sqm</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {quote.area.toLocaleString()} sqm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">AED {aiRecommendedPrice.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Base: AED {quote.basePrice.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            variance > 15
                              ? 'bg-red-100 text-red-800'
                              : variance > 5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {variance > 0 ? '+' : ''}{variance}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {surveyInsights ? (
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-sm font-medium">{surveyInsights.rating?.toFixed(1)}</span>
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(surveyInsights.riskLevel || 'Low')}`}>
                                {surveyInsights.riskLevel}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No survey data</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.approvalStatus)}`}>
                            {quote.approvalStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedQuote(quote)
                              setApprovalComment('')
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No quotes found</h3>
                <p className="mt-1 text-sm text-gray-500">No quotes match your current filters.</p>
              </div>
            )}
          </div>
        ) : (
          /* Survey Reviews Table */
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSurveys.map((survey) => (
                    <tr key={survey.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{survey.clientName}</div>
                            <div className="text-sm text-gray-500">{survey.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{survey.serviceType}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {survey.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">{survey.overallRating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{survey.complianceScore}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${survey.complianceScore}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(survey.riskLevel || 'Low')}`}>
                          {survey.riskLevel || 'Low'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(survey.reviewStatus || 'pending')}`}>
                          {survey.reviewStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(survey.surveyDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedSurvey(survey)
                            setReviewNotes(survey.reviewNotes || '')
                            setFollowUpActions(survey.followUpActions || [])
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSurveys.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No surveys found</h3>
                <p className="mt-1 text-sm text-gray-500">No surveys match your current filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Quote Detail Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">AI Price Recommendation Review</h3>
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Quote Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedQuote.clientName}</p>
                        <p><span className="font-medium">Service:</span> {selectedQuote.serviceType}</p>
                        <p><span className="font-medium">Area:</span> {selectedQuote.area.toLocaleString()} sqm</p>
                        <p><span className="font-medium">Risk Score:</span> {selectedQuote.riskScore}/100</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">AI Analysis</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Base Price:</span> AED {selectedQuote.basePrice.toLocaleString()}</p>
                        <p><span className="font-medium">AI Recommended:</span> AED {calculateAIPriceRecommendation(selectedQuote).aiRecommendedPrice.toLocaleString()}</p>
                        <p><span className="font-medium">Variance:</span> {calculateAIPriceRecommendation(selectedQuote).variance > 0 ? '+' : ''}{calculateAIPriceRecommendation(selectedQuote).variance}%</p>
                        <p><span className="font-medium">Approval Required:</span> {analyzeVariance(selectedQuote).requiresApproval ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">🤖 AI Recommendations & Insights</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="space-y-3">
                      {(() => {
                        const insights = calculateAIPriceRecommendation(selectedQuote)
                        const surveyData = insights.surveyInsights

                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Pricing Factors Applied:</span>
                              <div className="text-sm">
                                <span className="font-bold">Complexity:</span> {selectedQuote.factors.complexity}x •
                                <span className="font-bold ml-2">Accessibility:</span> {selectedQuote.factors.accessibility}x •
                                <span className="font-bold ml-2">Urgency:</span> {selectedQuote.factors.urgency}x
                              </div>
                            </div>

                            {surveyData ? (
                              <>
                                <div className="border-t pt-3">
                                  <p className="text-sm font-medium mb-2">📊 Survey-Based Adjustments:</p>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Client Rating:</span> {surveyData.rating?.toFixed(1)}/5 ⭐
                                    </div>
                                    <div>
                                      <span className="font-medium">Compliance Score:</span> {surveyData.compliance}% ✅
                                    </div>
                                    <div>
                                      <span className="font-medium">Risk Level:</span>
                                      <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(surveyData.riskLevel || 'Low')}`}>
                                        {surveyData.riskLevel}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium">Review Status:</span>
                                      <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(surveyData.reviewStatus || 'pending')}`}>
                                        {surveyData.reviewStatus}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white rounded p-3 text-sm">
                                  <p className="font-medium mb-1">💡 AI Recommendation:</p>
                                  <p>
                                    {surveyData.rating && surveyData.compliance && surveyData.rating >= 4.5 && surveyData.compliance >= 90
                                      ? "Premium pricing recommended due to excellent client satisfaction and high compliance scores."
                                      : surveyData.rating && surveyData.compliance && surveyData.rating >= 4.0 && surveyData.compliance >= 80
                                      ? "Standard pricing with slight premium for good client feedback."
                                      : surveyData.rating && surveyData.compliance && (surveyData.rating < 3.0 || surveyData.compliance < 70)
                                      ? "Consider discount pricing to improve client satisfaction and address concerns."
                                      : "Standard pricing recommended based on current survey data."
                                    }
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                                <p className="font-medium">⚠️ No Survey Data Available</p>
                                <p>Pricing recommendation based on standard factors only. Consider collecting client feedback for more accurate pricing.</p>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                {/* Approval Section */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Approval Actions</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Approval Notes
                      </label>
                      <textarea
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add your approval notes and reasoning..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setSelectedQuote(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRejectQuote(selectedQuote)}
                      className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Quote
                    </button>
                    <button
                      onClick={() => handleApproveQuote(selectedQuote)}
                      className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Survey Review Modal */}
        {selectedSurvey && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Review Survey</h3>
                  <button
                    onClick={() => setSelectedSurvey(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Survey Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedSurvey.clientName}</p>
                        <p><span className="font-medium">Company:</span> {selectedSurvey.company}</p>
                        <p><span className="font-medium">Email:</span> {selectedSurvey.clientEmail}</p>
                        <p><span className="font-medium">Location:</span> {selectedSurvey.location}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Survey Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Service:</span> {selectedSurvey.serviceType}</p>
                        <p><span className="font-medium">Date:</span> {new Date(selectedSurvey.surveyDate).toLocaleDateString()}</p>
                        <p><span className="font-medium">Rating:</span> {selectedSurvey.overallRating?.toFixed(1)} ★</p>
                        <p><span className="font-medium">Compliance:</span> {selectedSurvey.complianceScore}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Survey Responses */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Survey Responses</h4>
                  <div className="space-y-4">
                    {selectedSurvey.responses.map((response) => {
                      const question = surveyQuestions.find(q => q.id === response.questionId)
                      if (!question) return null

                      return (
                        <div key={response.questionId} className="border rounded-lg p-4">
                          <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                          <div className="text-gray-700">
                            {question.type === 'rating' && (
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < (response.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                                <span className="ml-2">{response.rating}/5</span>
                              </div>
                            )}
                            {question.type === 'yesno' && (
                              <span className={`px-2 py-1 rounded text-sm ${response.answer === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {response.answer}
                              </span>
                            )}
                            {question.type === 'multiple' && (
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(response.answer) ? response.answer.map((ans, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                    {ans}
                                  </span>
                                )) : (
                                  <span className="text-gray-500">No selection</span>
                                )}
                              </div>
                            )}
                            {question.type === 'text' && (
                              <p className="text-gray-700 whitespace-pre-wrap">{response.answer || 'No response'}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Review Form */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Review Actions</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Notes
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add your review notes and observations..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Follow-up Actions
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newAction}
                          onChange={(e) => setNewAction(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addFollowUpAction()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add follow-up action..."
                        />
                        <button
                          onClick={addFollowUpAction}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {followUpActions.map((action, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">{action}</span>
                            <button
                              onClick={() => removeFollowUpAction(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setSelectedSurvey(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRejectSurvey(selectedSurvey.id)}
                      className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Survey
                    </button>
                    <button
                      onClick={() => handleApproveSurvey(selectedSurvey.id)}
                      className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve Survey
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
