'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { AlertCircle, Download, TrendingUp, BarChart3, PieChart, User, Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

interface Survey {
  id: string
  title: string
  description: string
  status: string
  responsesCount: number
  selectedClient?: {
    id: string
    name: string
    company: string
    type: 'client' | 'lead'
  }
  clientName?: string
  company?: string
  sendCount?: number
  completionRate?: number
  priority?: string
  serviceType?: string
  createdAt?: any
}

interface SurveyResponse {
  id: string
  surveyId: string
  surveyTitle: string
  responses: Array<{
    questionId: string
    questionText: string
    questionType: string
    answer: any
    imageCount?: number
    thumbnail?: string
  }>
  submittedAt: any
  timestamp: string
  userAgent: string
  images?: Record<string, string[]>
}

interface Props {
  surveys: Survey[]
}

// Image Modal Component for full-size view
const ImageModal = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onPrev, 
  onNext 
}: { 
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onPrev: () => void
  onNext: () => void
}) => {
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, onPrev, onNext])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10 text-white"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      
      {/* Image */}
      <div 
        className="max-w-6xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Full size ${currentIndex + 1}`} 
          className="max-w-full max-h-[90vh] object-contain cursor-default"
        />
        
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  )
}

// Image Gallery Component for displaying multiple images
const ImageGallery = ({ images }: { images: string[] }) => {
  const [showModal, setShowModal] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }, [images.length])

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }, [images.length])

  const openModal = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(index)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  if (!images || images.length === 0) return null

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="relative group cursor-pointer"
            onClick={(e) => openModal(idx, e)}
          >
            <img 
              src={img} 
              alt={`Upload ${idx + 1}`} 
              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <ImageModal
        isOpen={showModal}
        onClose={closeModal}
        images={images}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  )
}

// Single Image Component for thumbnail-only images
const SingleImage = ({ image }: { image: string }) => {
  const [showModal, setShowModal] = useState(false)

  const openModal = useCallback(() => {
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const handlePrev = useCallback(() => {}, [])
  const handleNext = useCallback(() => {}, [])

  return (
    <>
      <div 
        className="relative group cursor-pointer inline-block mt-2"
        onClick={openModal}
      >
        <img 
          src={image} 
          alt="Thumbnail" 
          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
          <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <ImageModal
        isOpen={showModal}
        onClose={closeModal}
        images={[image]}
        currentIndex={0}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  )
}

export default function SurveyResultsSection({ surveys }: Props) {
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null)
  const [allResponses, setAllResponses] = useState<SurveyResponse[]>([])

  // Fetch all survey responses from Firebase
  useEffect(() => {
    const responsesRef = collection(db, 'survey_submissions')
    const q = query(responsesRef, orderBy('submittedAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const responsesList: SurveyResponse[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        responsesList.push({
          id: doc.id,
          surveyId: data.surveyId,
          surveyTitle: data.surveyTitle,
          responses: data.responses || [],
          submittedAt: data.submittedAt,
          timestamp: data.timestamp || new Date().toISOString(),
          userAgent: data.userAgent || '',
          images: data.images || {}
        })
      })
      setAllResponses(responsesList)
    })
    
    return () => unsubscribe()
  }, [])

  // Helper function to get client info
  const getClientInfo = (survey: Survey) => {
    if (survey.selectedClient) {
      return {
        name: survey.selectedClient.name,
        company: survey.selectedClient.company,
        type: survey.selectedClient.type
      }
    }
    return {
      name: survey.clientName || 'General Client',
      company: survey.company || 'General Company',
      type: null
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalResponses = allResponses.length
    const totalSurveys = surveys.length
    
    let totalCompletionRate = 0
    let surveysWithCompletion = 0
    
    surveys.forEach(survey => {
      const surveyResponses = allResponses.filter(r => r.surveyId === survey.id)
      if (survey.sendCount && survey.sendCount > 0) {
        const completionRate = Math.round((surveyResponses.length / survey.sendCount) * 100)
        totalCompletionRate += completionRate
        surveysWithCompletion++
      }
    })
    
    const avgCompletionRate = surveysWithCompletion > 0 
      ? Math.round(totalCompletionRate / surveysWithCompletion)
      : 0
    
    let totalRating = 0
    let ratingCount = 0
    
    allResponses.forEach(response => {
      response.responses.forEach(resp => {
        if (resp.questionType === 'rating' && typeof resp.answer === 'number') {
          totalRating += resp.answer
          ratingCount++
        }
      })
    })
    
    const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 'N/A'
    
    // Count total images uploaded
    const totalImages = allResponses.reduce((acc, response) => {
      const imageCount = Object.values(response.images || {}).reduce((sum, imgs) => sum + imgs.length, 0)
      return acc + imageCount
    }, 0)
    
    return { 
      totalResponses, 
      avgCompletionRate, 
      totalSurveys, 
      avgRating,
      totalRatingCount: ratingCount,
      totalImages
    }
  }, [allResponses, surveys])

  // Get responses for selected survey
  const surveyResponses = useMemo(() => {
    if (!selectedSurvey) return []
    return allResponses.filter(r => r.surveyId === selectedSurvey)
  }, [selectedSurvey, allResponses])

  // Get selected survey data
  const selectedSurveyData = selectedSurvey ? surveys.find(s => s.id === selectedSurvey) : null

  // Get client info for selected survey
  const selectedClientInfo = selectedSurveyData ? getClientInfo(selectedSurveyData) : null

  // Get unique questions from selected survey responses
  const uniqueQuestions = useMemo(() => {
    if (!selectedSurvey || surveyResponses.length === 0) return []
    
    const questionsMap = new Map()
    
    surveyResponses.forEach(response => {
      response.responses.forEach(resp => {
        if (!questionsMap.has(resp.questionId)) {
          questionsMap.set(resp.questionId, {
            id: resp.questionId,
            text: resp.questionText,
            type: resp.questionType,
            answers: []
          })
        }
        questionsMap.get(resp.questionId).answers.push(resp.answer)
      })
    })
    
    return Array.from(questionsMap.values())
  }, [selectedSurvey, surveyResponses])

  // Analyze question answers
  const analyzeQuestion = (question: any) => {
    const { type, answers } = question
    
    if (answers.length === 0) {
      return { summary: 'No responses yet', details: [] }
    }
    
    switch(type) {
      case 'text':
      case 'textarea':
      case 'email':
        return {
          summary: `${answers.length} text responses`,
          details: answers
        }
      
      case 'number':
        const numbers = answers.filter((a: any) => !isNaN(parseFloat(a)))
        const avg = numbers.length > 0 
          ? (numbers.reduce((sum: number, a: any) => sum + parseFloat(a), 0) / numbers.length).toFixed(2)
          : 0
        return {
          summary: `Average: ${avg}`,
          details: answers
        }
      
      case 'rating':
        const ratings = answers.filter((a: any) => !isNaN(parseInt(a)))
        const avgRating = ratings.length > 0 
          ? (ratings.reduce((sum: number, a: any) => sum + parseInt(a), 0) / ratings.length).toFixed(1)
          : 0
        return {
          summary: `Average rating: ${avgRating}/5`,
          details: answers
        }
      
      case 'multiple-choice':
      case 'dropdown':
      case 'checkbox':
        const optionCounts: Record<string, number> = {}
        answers.forEach((answer: any) => {
          if (Array.isArray(answer)) {
            answer.forEach((opt: string) => {
              optionCounts[opt] = (optionCounts[opt] || 0) + 1
            })
          } else {
            optionCounts[answer] = (optionCounts[answer] || 0) + 1
          }
        })
        
        const details = Object.entries(optionCounts)
          .map(([option, count]) => ({
            option,
            count,
            percentage: Math.round((count / answers.length) * 100)
          }))
          .sort((a, b) => b.count - a.count)
        
        return {
          summary: `${answers.length} selections`,
          details
        }
      
      case 'scale':
      case 'NPS':
        const scaleAnswers = answers.filter((a: any) => !isNaN(parseInt(a)))
        const avgScale = scaleAnswers.length > 0 
          ? (scaleAnswers.reduce((sum: number, a: any) => sum + parseInt(a), 0) / scaleAnswers.length).toFixed(1)
          : 0
        return {
          summary: `Average score: ${avgScale}`,
          details: answers.map((a: any) => parseInt(a))
        }
      
      case 'date':
        return {
          summary: `${answers.length} date responses`,
          details: answers
        }
      
      case 'image-upload':
        return {
          summary: `${answers.length} image uploads`,
          details: answers
        }
      
      default:
        return {
          summary: `${answers.length} responses`,
          details: answers
        }
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    if (!selectedSurvey || surveyResponses.length === 0) return
    
    const headers = ['Response ID', 'Submission Date', 'Question', 'Answer', 'Image Count']
    const rows: string[][] = []
    
    surveyResponses.forEach(response => {
      response.responses.forEach(resp => {
        let answerText = ''
        if (resp.questionType === 'image-upload') {
          const images = response.images?.[resp.questionId] || []
          answerText = `${images.length} image(s) uploaded`
        } else {
          answerText = typeof resp.answer === 'object' ? JSON.stringify(resp.answer) : String(resp.answer)
        }
        
        rows.push([
          response.id.substring(0, 8),
          new Date(response.timestamp).toLocaleDateString(),
          resp.questionText,
          answerText,
          resp.questionType === 'image-upload' ? String(resp.imageCount || 0) : 'N/A'
        ])
      })
    })
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedSurveyData?.title || 'survey'}_responses_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded border border-gray-300 p-3 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Total Surveys</p>
              <p className="text-xl font-bold text-black">{stats.totalSurveys}</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-300 opacity-30" />
          </div>
        </div>
        
        <div className="bg-white rounded border border-gray-300 p-3 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Total Responses</p>
              <p className="text-xl font-bold text-black">{stats.totalResponses}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-300 opacity-30" />
          </div>
        </div>
        
        <div className="bg-white rounded border border-gray-300 p-3 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Avg Completion</p>
              <p className="text-xl font-bold text-black">{stats.avgCompletionRate}%</p>
            </div>
            <PieChart className="w-5 h-5 text-gray-300 opacity-30" />
          </div>
        </div>
        
        <div className="bg-white rounded border border-gray-300 p-3 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Avg Rating</p>
              <p className="text-xl font-bold text-black">{stats.avgRating}</p>
            </div>
            <User className="w-5 h-5 text-gray-300 opacity-30" />
          </div>
        </div>

        <div className="bg-white rounded border border-gray-300 p-3 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Total Images</p>
              <p className="text-xl font-bold text-black">{stats.totalImages}</p>
            </div>
            <ImageIcon className="w-5 h-5 text-gray-300 opacity-30" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Survey Selector */}
        <div className="bg-white rounded border border-gray-300 p-3 shadow-none">
          <h3 className="text-sm font-bold text-black mb-3">Survey List</h3>
          
          <div className="space-y-1">
            {surveys.map((survey) => {
              const surveyResponseCount = allResponses.filter(r => r.surveyId === survey.id).length
              const clientInfo = getClientInfo(survey)
              
              return (
                <button
                  key={survey.id}
                  onClick={() => setSelectedSurvey(survey.id)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedSurvey === survey.id
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-900 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[13px] truncate">{survey.title}</p>
                      <p className={`text-[10px] uppercase font-medium ${selectedSurvey === survey.id ? 'text-gray-300' : 'text-gray-500'}`}>
                        {clientInfo.name} • {clientInfo.company}
                      </p>
                      <p className={`text-[9px] ${selectedSurvey === survey.id ? 'text-gray-400' : 'text-gray-400'}`}>
                        {surveyResponseCount} responses
                      </p>
                    </div>
                    {surveyResponseCount > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        selectedSurvey === survey.id 
                          ? 'bg-white text-black' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {surveyResponseCount}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          {selectedSurveyData ? (
            <div className="space-y-4">
              {/* Survey Info */}
              <div className="bg-white rounded border border-gray-300 p-4 shadow-none">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-bold text-black mb-1">{selectedSurveyData.title}</h3>
                    {selectedSurveyData.description && (
                      <p className="text-sm text-gray-600">{selectedSurveyData.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    selectedSurveyData.status === 'published' ? 'bg-green-100 text-green-800' :
                    selectedSurveyData.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    selectedSurveyData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedSurveyData.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 border border-gray-200 rounded p-2">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Client</p>
                    <p className="text-[11px] font-bold text-black truncate">
                      {selectedClientInfo?.name || 'General Client'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded p-2">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Company</p>
                    <p className="text-[11px] font-bold text-black truncate">
                      {selectedClientInfo?.company || 'General Company'}
                    </p>
                    {selectedClientInfo?.type && (
                      <span className={`text-[8px] px-1 py-0.5 rounded ${
                        selectedClientInfo.type === 'client' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedClientInfo.type.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded p-2">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Responses</p>
                    <p className="text-[11px] font-bold text-black">
                      {selectedSurveyData.responsesCount || 0}/{selectedSurveyData.sendCount || 0}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded p-2">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Completion</p>
                    <p className="text-[11px] font-bold text-black">
                      {selectedSurveyData.completionRate || 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Question Analysis */}
              {uniqueQuestions.length > 0 && (
                <div className="bg-white rounded border border-gray-300 p-4 shadow-none">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-black text-sm">Question Analysis</h4>
                    <p className="text-xs text-gray-500">
                      Based on {surveyResponses.length} response{surveyResponses.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {uniqueQuestions.map((question) => {
                      const analysis = analyzeQuestion(question)
                      
                      return (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-3">
                          <h5 className="font-medium text-sm text-black mb-2">
                            {question.text} <span className="text-xs text-gray-500">({question.type})</span>
                          </h5>
                          
                          <div className="mb-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {analysis.summary}
                            </span>
                          </div>
                          
                          {analysis.details && analysis.details.length > 0 && (
                            <div className="mt-2">
                              {question.type === 'multiple-choice' || 
                               question.type === 'dropdown' || 
                               question.type === 'checkbox' ? (
                                <div className="space-y-1">
                                  {analysis.details.map((detail: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                      <span className="text-gray-700">{detail.option}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-600">{detail.count} ({detail.percentage}%)</span>
                                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-blue-600"
                                            style={{ width: `${detail.percentage}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="max-h-32 overflow-y-auto">
                                  {analysis.details.slice(0, 10).map((answer: any, idx: number) => (
                                    <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-1">
                                      {typeof answer === 'object' ? JSON.stringify(answer) : String(answer)}
                                    </div>
                                  ))}
                                  {analysis.details.length > 10 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      ... and {analysis.details.length - 10} more
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Responses List */}
              {surveyResponses.length > 0 && (
                <div className="bg-white rounded border border-gray-300 p-4 shadow-none">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-black text-sm">Individual Responses ({surveyResponses.length})</h4>
                    <button 
                      onClick={exportToCSV}
                      className="flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase font-bold bg-black text-white rounded hover:bg-gray-800 transition-colors border border-black"
                    >
                      <Download className="w-3 h-3" />
                      Export CSV
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {surveyResponses.map((response) => (
                      <div key={response.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Response ID: {response.id.substring(0, 8)}...
                            </p>
                            <p className="text-xs text-gray-500">
                              Submitted: {new Date(response.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {response.responses.length} answers
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {response.responses.slice(0, 3).map((resp, idx) => (
                            <div key={`${response.id}-${resp.questionId}-${idx}`} className="bg-white border border-gray-300 rounded p-2">
                              <p className="text-xs font-medium text-gray-900 mb-1">{resp.questionText}</p>
                              
                              {resp.questionType === 'image-upload' ? (
                                <div>
                                  <p className="text-xs text-blue-600 mb-2">
                                    {resp.imageCount || 0} image(s) uploaded
                                  </p>
                                  
                                  {/* Show all images for this question */}
                                  {response.images && response.images[resp.questionId] && (
                                    <ImageGallery images={response.images[resp.questionId]} />
                                  )}
                                  
                                  {/* Show thumbnail if available and no full images array */}
                                  {resp.thumbnail && !response.images?.[resp.questionId] && (
                                    <SingleImage image={resp.thumbnail} />
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-black">
                                  {typeof resp.answer === 'object' ? JSON.stringify(resp.answer) : String(resp.answer)}
                                </p>
                              )}
                              
                              <p className="text-[10px] text-gray-500 mt-1">Type: {resp.questionType}</p>
                            </div>
                          ))}
                          
                          {response.responses.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              ... and {response.responses.length - 3} more questions
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {surveyResponses.length === 0 && (
                <div className="bg-white rounded border border-gray-300 p-8 text-center shadow-none">
                  <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-gray-500 mb-1">No responses yet for this survey</p>
                  <p className="text-xs text-gray-400">Share the survey link to start collecting responses</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded border border-gray-300 p-10 text-center shadow-none">
              <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-gray-500">Select a survey to view analysis</p>
              {allResponses.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {allResponses.length} total responses across {surveys.length} surveys
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}