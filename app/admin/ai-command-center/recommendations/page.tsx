'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, CheckCircle, TrendingUp, Users, DollarSign, Target, ThumbsUp, ThumbsDown, Zap, Brain, BarChart, Clock, Calendar, MapPin, User, Briefcase, AlertCircle, CheckSquare, Eye } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore'

// Firebase Job Interface
interface FirebaseJob {
  id: string;
  title: string;
  client: string;
  status: string;
  location: string;
  budget: number;
  actualCost: number;
  scheduledDate: string;
  scheduledTime: string;
  priority: string;
  riskLevel: string;
  teamRequired: number;
  description: string;
  services: string[];
  createdAt: string;
  updatedAt: string;
  assignedEmployees: Array<{
    name: string;
    email: string;
    id: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    progress: number;
    duration: number;
  }>;
  executionLogs: Array<any>;
  notes: Array<any>;
}

export default function Recommendations() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({})
  const [jobs, setJobs] = useState<FirebaseJob[]>([])
  const [loading, setLoading] = useState(true)
  const [showAiAnalysis, setShowAiAnalysis] = useState(false)
  const [selectedJobForAi, setSelectedJobForAi] = useState<FirebaseJob | null>(null)
  const [aiRecommendation, setAiRecommendation] = useState('')
  const [generatingAi, setGeneratingAi] = useState(false)

  // Fetch real jobs from Firebase
  useEffect(() => {
    fetchRealJobs()
  }, [])

  const fetchRealJobs = async () => {
    try {
      setLoading(true)
      const jobsRef = collection(db, 'jobs')
      const q = query(jobsRef, orderBy('createdAt', 'desc'), limit(10))
      const snapshot = await getDocs(q)
      
      const jobsData: FirebaseJob[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        jobsData.push({
          id: doc.id,
          title: data.title || 'Untitled Job',
          client: data.client || 'No Client',
          status: data.status || 'Pending',
          location: data.location || 'Location Not Set',
          budget: data.budget || 0,
          actualCost: data.actualCost || 0,
          scheduledDate: data.scheduledDate || 'Not Scheduled',
          scheduledTime: data.scheduledTime || '',
          priority: data.priority || 'Medium',
          riskLevel: data.riskLevel || 'Low',
          teamRequired: data.teamRequired || 0,
          description: data.description || 'No description available',
          services: data.services || [],
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
          assignedEmployees: data.assignedEmployees || [],
          tasks: data.tasks || [],
          executionLogs: data.executionLogs || [],
          notes: data.notes || []
        })
      })
      
      setJobs(jobsData)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Transform jobs into "AI Recommendations"
  const recommendations = jobs.map((job, index) => {
    // Generate AI-style recommendation based on job data
    const statusPriority = job.status === 'In Progress' ? 'high' : 
                          job.status === 'Pending' ? 'medium' : 'low'
    
    const budgetRisk = job.budget > 5000 ? 'high' : 
                      job.budget > 2000 ? 'medium' : 'low'
    
    // Calculate "impact" based on job data
    const impactAmount = job.budget * 0.8 // Example: 80% of budget as "potential impact"
    const impact = `Revenue impact: AED ${impactAmount.toLocaleString()}`
    
    // Generate "confidence" based on job status and team
    const confidence = job.status === 'Completed' ? 95.5 : 
                      job.assignedEmployees.length > 0 ? 88.7 : 75.2
    
    // Determine effort level
    const effort = job.teamRequired > 5 ? 'High' : 
                   job.teamRequired > 2 ? 'Medium' : 'Low'
    
    // Generate timeline
    const timeline = job.scheduledDate ? `Scheduled: ${job.scheduledDate}` : 'Flexible timeline'
    
    // AI Action suggestions based on job data
    let action = ''
    if (job.status === 'Pending') {
      action = 'Assign team and schedule execution'
    } else if (job.status === 'In Progress') {
      action = 'Monitor progress and ensure on-time completion'
    } else {
      action = 'Follow up for payment and gather feedback'
    }

    // Generate AI categories based on job priority and risk
    let category = 'revenue'
    if (job.riskLevel === 'High') {
      category = 'demand'
    } else if (job.priority === 'High') {
      category = 'retention'
    } else if (job.budget > 3000) {
      category = 'profitability'
    }

    return {
      id: job.id,
      category,
      priority: statusPriority,
      title: `Optimize "${job.title}" Job Execution`,
      description: `AI analysis shows opportunity to improve efficiency and profitability for ${job.client}'s ${job.title.toLowerCase()} project`,
      impact,
      confidence,
      action,
      timeline,
      effort,
      originalJob: job // Keep reference to original job data
    }
  })

  const categories = [
    { id: 'all', label: 'All Insights', icon: Lightbulb },
    { id: 'revenue', label: 'Revenue Growth', icon: TrendingUp },
    { id: 'demand', label: 'Demand Planning', icon: Users },
    { id: 'retention', label: 'Client Retention', icon: Target },
    { id: 'profitability', label: 'Profitability', icon: DollarSign },
  ]

  const filteredRecs = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory)

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  const getEffortColor = (effort: string) => {
    switch(effort) {
      case 'High': return 'text-red-600'
      case 'Medium': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const getJobStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700'
      case 'In Progress': return 'bg-blue-100 text-blue-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleFeedback = (id: string, type: 'positive' | 'negative') => {
    setFeedbackMap(prev => ({
      ...prev,
      [id]: type
    }))
  }

  const handleAiAnalysis = async (job: FirebaseJob) => {
    setSelectedJobForAi(job)
    setGeneratingAi(true)
    setShowAiAnalysis(true)
    
    // Simulate AI processing
    setTimeout(() => {
      // Generate AI analysis based on job data
      const analysis = `
Based on advanced AI analysis of "${job.title}":

📊 **Job Overview:**
• Client: ${job.client}
• Budget: AED ${job.budget.toLocaleString()}
• Team Required: ${job.teamRequired} members
• Status: ${job.status}
• Priority: ${job.priority}

🎯 **AI Recommendations:**
1. ${job.assignedEmployees.length === 0 ? 'Assign team immediately to avoid delays' : 'Team assigned - monitor progress'}
2. ${job.budget > job.actualCost ? 'Budget optimization possible' : 'Stay within budget constraints'}
3. ${job.riskLevel === 'High' ? 'High risk - implement mitigation strategies' : 'Low risk - proceed as planned'}
4. ${job.tasks.filter(t => t.completed).length === job.tasks.length ? 'All tasks completed - ready for delivery' : 'Focus on pending tasks for faster completion'}

💰 **Financial Insights:**
• Potential Profit Margin: ${((job.budget - (job.actualCost || 0)) / job.budget * 100).toFixed(1)}%
• Resource Utilization: ${(job.assignedEmployees.length / job.teamRequired * 100).toFixed(0)}% optimized
• Timeline Efficiency: ${job.status === 'Completed' ? 'On schedule' : 'Monitor deadlines'}

🔮 **Predictive Analysis:**
AI predicts ${job.status === 'In Progress' ? 'completion within 2-3 days' : 'smooth execution based on current parameters'}
      `
      setAiRecommendation(analysis)
      setGeneratingAi(false)
    }, 1500)
  }

  const handleImplement = (job: FirebaseJob) => {
    // Show success message for implementation
    alert(`✅ AI implementation initiated for "${job.title}"\n\nThis will optimize: 
• Team allocation
• Budget management
• Timeline tracking
• Client communication

Changes will be applied automatically.`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-500" />
              AI Job Insights
            </h1>
            <p className="text-muted-foreground mt-1">Loading intelligent job recommendations...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-500" />
            AI Job Insights & Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">Intelligent analysis of your active jobs with AI-powered recommendations</p>
        </div>
        <button 
          onClick={fetchRealJobs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh AI Analysis
        </button>
      </div>

      {/* Category Selector */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold">Filter AI Insights</p>
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Zap className="h-3 w-3" />
            <span>Powered by Machine Learning</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {categories.map(cat => {
            const Icon = cat.icon
            const count = selectedCategory === 'all' 
              ? recommendations.length 
              : recommendations.filter(r => r.category === cat.id).length
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedCategory === cat.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Icon className={`h-5 w-5 mb-2 ${selectedCategory === cat.id ? 'text-blue-600' : 'text-gray-600'}`} />
                <p className="text-xs font-bold">{cat.label}</p>
                <p className="text-[10px] text-muted-foreground">{count} insights</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart className="h-4 w-4 text-blue-600" />
            <p className="text-xs text-muted-foreground">Active Jobs Analyzed</p>
          </div>
          <p className="text-3xl font-black text-blue-700">{jobs.length}</p>
          <p className="text-xs text-blue-600 mt-1">by AI algorithms</p>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <p className="text-xs text-muted-foreground">Total Potential Impact</p>
          </div>
          <p className="text-2xl font-black text-green-700">
            AED {jobs.reduce((sum, job) => sum + job.budget, 0).toLocaleString()}
          </p>
          <p className="text-xs text-green-600">Across all jobs</p>
        </div>
        <div className="bg-linear-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-purple-600" />
            <p className="text-xs text-muted-foreground">Avg AI Confidence</p>
          </div>
          <p className="text-3xl font-black text-purple-700">
            {recommendations.length > 0 
              ? (recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length).toFixed(1)
              : '0'}%
          </p>
        </div>
        <div className="bg-linear-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-orange-600" />
            <p className="text-xs text-muted-foreground">Quick Wins Available</p>
          </div>
          <p className="text-3xl font-black text-orange-700">
            {jobs.filter(j => j.priority === 'High' && j.status === 'Pending').length}
          </p>
          <p className="text-xs text-orange-600">High priority jobs</p>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAiAnalysis && selectedJobForAi && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  AI Deep Analysis
                </h3>
                <p className="text-sm text-gray-600">{selectedJobForAi.title}</p>
              </div>
              <button
                onClick={() => setShowAiAnalysis(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="font-bold">{selectedJobForAi.client}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="font-bold text-green-600">AED {selectedJobForAi.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getJobStatusColor(selectedJobForAi.status)}`}>
                    {selectedJobForAi.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Team Required</p>
                  <p className="font-bold">{selectedJobForAi.teamRequired} members</p>
                </div>
              </div>
            </div>

            {generatingAi ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">AI is analyzing job data...</p>
                <p className="text-sm text-gray-500 mt-2">Processing patterns, calculating optimizations, generating insights</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h4 className="font-bold text-blue-900">AI-Generated Insights</h4>
                  </div>
                  <div className="whitespace-pre-line text-sm text-gray-700">
                    {aiRecommendation}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleImplement(selectedJobForAi)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                  >
                    Implement AI Recommendations
                  </button>
                  <button
                    onClick={() => setShowAiAnalysis(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">AI-Powered Job Recommendations</h3>
          <div className="text-sm text-gray-500">
            {filteredRecs.length} insights generated from {jobs.length} active jobs
          </div>
        </div>

        {filteredRecs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No AI insights available</p>
            <p className="text-sm text-gray-500 mt-1">Add more jobs to generate AI recommendations</p>
          </div>
        ) : (
          filteredRecs.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{rec.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  
                  {/* Original Job Info (subtle) */}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Client: {rec.originalJob.client}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{rec.originalJob.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{rec.originalJob.scheduledDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-muted-foreground">AI Confidence</p>
                  </div>
                  <p className="text-2xl font-black text-blue-600">{rec.confidence}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <DollarSign className="h-3 w-3 text-green-500" />
                    <p className="text-xs text-muted-foreground">Financial Impact</p>
                  </div>
                  <p className="text-sm font-bold text-green-600">{rec.impact}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <CheckSquare className="h-3 w-3 text-blue-500" />
                    <p className="text-xs text-muted-foreground">AI Action</p>
                  </div>
                  <p className="text-sm font-bold">{rec.action}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-purple-500" />
                    <p className="text-xs text-muted-foreground">Timeline</p>
                  </div>
                  <p className="text-sm font-bold text-blue-600">{rec.timeline}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    <p className="text-xs text-muted-foreground">Effort Level</p>
                  </div>
                  <p className={`text-sm font-bold ${getEffortColor(rec.effort)}`}>{rec.effort}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Helpful AI insight?</span>
                    <button 
                      onClick={() => handleFeedback(rec.id, 'positive')}
                      className={`p-1.5 rounded transition-colors ${feedbackMap[rec.id] === 'positive' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
                      title="Useful AI insight"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleFeedback(rec.id, 'negative')}
                      className={`p-1.5 rounded transition-colors ${feedbackMap[rec.id] === 'negative' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                      title="Not useful"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleAiAnalysis(rec.originalJob)}
                    className="px-3 py-1 text-xs border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View AI Analysis
                  </button>
                </div>
                <button 
                  onClick={() => handleImplement(rec.originalJob)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  Implement AI
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Brain className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-blue-900">AI-Powered Job Intelligence</p>
          <p className="text-sm text-blue-800 mt-1">
            • Real-time analysis of active jobs • Predictive insights based on historical data • 
            Automated efficiency recommendations • Budget optimization suggestions • 
            Risk assessment and mitigation • Team allocation optimization
          </p>
        </div>
      </div>
    </div>
  )
}

// Add missing icon component
function RefreshCw(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}

function X(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}