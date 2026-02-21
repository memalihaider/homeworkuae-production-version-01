'use client'

import { useState, useMemo, Suspense } from 'react'
import { MessageSquare, ThumbsUp, Zap, TrendingUp, AlertCircle, Send, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function FeedbackCollectionContent() {
  const searchParams = useSearchParams()
  const jobIdParam = searchParams?.get('jobId')
  const [jobs, setJobs] = useState<any[]>([
    {
      id: 1,
      clientName: 'Acme Corporation',
      serviceType: 'Deep Cleaning',
      completionDate: '2025-12-23',
      feedback: {
        collected: true,
        npsScore: 9,
        sentiment: 'Very Positive',
        sentimentScore: 0.95,
        satisfactionRating: 5,
        categories: {
          cleaning: 5,
          professionalism: 5,
          timeliness: 4,
          communication: 5,
          valueForMoney: 5
        },
        comment: 'Excellent work! The team was professional and efficient. Would definitely use again.',
        collectedAt: '2025-12-23 15:45'
      }
    },
    {
      id: 2,
      clientName: 'Tech Solutions Inc',
      serviceType: 'Office Maintenance',
      completionDate: '2025-12-22',
      feedback: {
        collected: true,
        npsScore: 8,
        sentiment: 'Positive',
        sentimentScore: 0.82,
        satisfactionRating: 4,
        categories: {
          cleaning: 4,
          professionalism: 5,
          timeliness: 4,
          communication: 4,
          valueForMoney: 4
        },
        comment: 'Very good service overall. Minor issues with timing but addressed promptly.',
        collectedAt: '2025-12-22 17:30'
      }
    },
    {
      id: 3,
      clientName: 'Medical Center West',
      serviceType: 'Post-Construction Cleaning',
      completionDate: '2025-12-21',
      feedback: {
        collected: false,
        npsScore: null,
        sentiment: 'Pending',
        sentimentScore: 0,
        satisfactionRating: 0,
        categories: {
          cleaning: 0,
          professionalism: 0,
          timeliness: 0,
          communication: 0,
          valueForMoney: 0
        },
        comment: '',
        collectedAt: null
      }
    },
    {
      id: 4,
      clientName: 'Downtown Plaza',
      serviceType: 'Regular Maintenance',
      completionDate: '2025-12-20',
      feedback: {
        collected: true,
        npsScore: 7,
        sentiment: 'Positive',
        sentimentScore: 0.75,
        satisfactionRating: 4,
        categories: {
          cleaning: 4,
          professionalism: 4,
          timeliness: 5,
          communication: 3,
          valueForMoney: 4
        },
        comment: 'Good job overall. Wish there was better communication about arrival time.',
        collectedAt: '2025-12-20 18:15'
      }
    }
  ])

  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [selectedJobId, setSelectedJobId] = useState(1)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({
    npsScore: 5,
    satisfactionRating: 5,
    cleaning: 5,
    professionalism: 5,
    timeliness: 5,
    communication: 5,
    valueForMoney: 5,
    comment: ''
  })

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0]

  const stats = useMemo(() => ({
    total: jobs.length,
    collected: jobs.filter(j => j.feedback.collected).length,
    avgNps: jobs.filter(j => j.feedback.npsScore !== null).length > 0
      ? Math.round(jobs.filter(j => j.feedback.npsScore !== null).reduce((sum, j) => sum + (j.feedback.npsScore || 0), 0) / jobs.filter(j => j.feedback.npsScore !== null).length)
      : 0,
    promoters: jobs.filter(j => j.feedback.npsScore && j.feedback.npsScore >= 9).length,
    detractors: jobs.filter(j => j.feedback.npsScore && j.feedback.npsScore <= 6).length,
    avgSentiment: jobs.filter(j => j.feedback.sentimentScore > 0).length > 0
      ? ((jobs.filter((j: any) => j.feedback.sentimentScore > 0).reduce((sum: number, j: any) => sum + j.feedback.sentimentScore, 0) / jobs.filter((j: any) => j.feedback.sentimentScore > 0).length) * 100).toFixed(0)
      : 0,
    veryPositive: jobs.filter(j => j.feedback.sentiment === 'Very Positive').length,
    positive: jobs.filter(j => j.feedback.sentiment === 'Positive').length,
    neutral: jobs.filter(j => j.feedback.sentiment === 'Neutral').length,
    negative: jobs.filter(j => j.feedback.sentiment === 'Negative').length
  }), [jobs])

  const handleSubmitFeedback = () => {
    const sentimentScore = (feedbackForm.satisfactionRating / 5)
    const sentimentMap: any = {
      5: { text: 'Very Positive', score: 0.95 },
      4: { text: 'Positive', score: 0.75 },
      3: { text: 'Neutral', score: 0.5 },
      2: { text: 'Negative', score: 0.25 },
      1: { text: 'Very Negative', score: 0.1 }
    }
    const sentiment = sentimentMap[feedbackForm.satisfactionRating]

    setJobs(jobs.map(j => 
      j.id === selectedJob.id 
        ? {
            ...j,
            feedback: {
              collected: true,
              npsScore: feedbackForm.npsScore,
              sentiment: sentiment.text,
              sentimentScore: sentiment.score,
              satisfactionRating: feedbackForm.satisfactionRating,
              categories: {
                cleaning: feedbackForm.cleaning,
                professionalism: feedbackForm.professionalism,
                timeliness: feedbackForm.timeliness,
                communication: feedbackForm.communication,
                valueForMoney: feedbackForm.valueForMoney
              },
              comment: feedbackForm.comment,
              collectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          }
        : j
    ))
    setShowFeedbackModal(false)
    setFeedbackForm({
      npsScore: 5,
      satisfactionRating: 5,
      cleaning: 5,
      professionalism: 5,
      timeliness: 5,
      communication: 5,
      valueForMoney: 5,
      comment: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {jobIdParam && (
          <Link href={`/admin/jobs/${jobIdParam}`} className="text-purple-600 hover:text-purple-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white flex-1">
          <h1 className="text-3xl font-bold">Feedback Collection</h1>
          <p className="text-purple-100 mt-1">NPS scoring, sentiment analysis, and customer satisfaction tracking</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Feedback Collected</p>
          <p className="text-2xl font-bold text-purple-600">{stats.collected}/{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Average NPS Score</p>
          <p className="text-2xl font-bold text-blue-600">{stats.avgNps}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.promoters} promoters, {stats.detractors} detractors</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Avg Sentiment Score</p>
          <p className="text-2xl font-bold text-green-600">{stats.avgSentiment}%</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Sentiment Distribution</p>
          <p className="text-sm mt-2 space-y-1">
            <span className="block text-green-600 font-semibold">✓ Positive: {stats.veryPositive + stats.positive}</span>
            <span className="block text-red-600 font-semibold">✗ Negative: {stats.negative}</span>
          </p>
        </div>
      </div>

      {/* Job Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {jobs.map(job => (
          <button
            key={job.id}
            onClick={() => setSelectedJobId(job.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedJobId === job.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {job.clientName}
            {job.feedback.collected && <span className="ml-1">✓</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Feedback Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Feedback Summary
          </h2>
          <div className="space-y-4">
            {selectedJob.feedback.collected ? (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-2">NPS Score</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-purple-600">{selectedJob.feedback.npsScore}</span>
                    <span className="text-gray-500 mb-1">/ 10</span>
                  </div>
                  <p className={`text-sm mt-2 px-3 py-1 rounded w-fit ${
                    selectedJob.feedback.npsScore >= 9 ? 'bg-green-100 text-green-700' :
                    selectedJob.feedback.npsScore >= 7 ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedJob.feedback.npsScore >= 9 ? 'Promoter' : selectedJob.feedback.npsScore >= 7 ? 'Neutral' : 'Detractor'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Overall Satisfaction</p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded ${
                          i < selectedJob.feedback.satisfactionRating
                            ? 'bg-purple-600'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold mt-2">{selectedJob.feedback.satisfactionRating}/5 Stars</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">AI Sentiment Analysis</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-green-500 to-green-600"
                        style={{ width: `${selectedJob.feedback.sentimentScore * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold text-sm">{Math.round(selectedJob.feedback.sentimentScore * 100)}%</span>
                  </div>
                  <p className={`text-sm mt-2 px-3 py-1 rounded w-fit font-semibold ${
                    selectedJob.feedback.sentiment === 'Very Positive' ? 'bg-green-100 text-green-700' :
                    selectedJob.feedback.sentiment === 'Positive' ? 'bg-blue-100 text-blue-700' :
                    selectedJob.feedback.sentiment === 'Neutral' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedJob.feedback.sentiment}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Collected At</p>
                  <p className="font-semibold text-sm">{selectedJob.feedback.collectedAt}</p>
                </div>
              </>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">No feedback collected yet</p>
                  <p className="text-sm text-yellow-800 mt-1">Click "Send Feedback Request" to collect customer satisfaction data</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Ratings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Category Ratings
          </h2>
          {selectedJob.feedback.collected ? (
            <div className="space-y-4">
              {Object.entries(selectedJob.feedback.categories).map(([category, rating]: any) => (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-sm font-bold text-purple-600">{rating}/5</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded ${
                          i < rating ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Awaiting feedback collection</p>
          )}
        </div>

        {/* Customer Comment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Customer Comment
          </h2>
          {selectedJob.feedback.collected && selectedJob.feedback.comment ? (
            <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded">
              <p className="text-gray-800 italic">"{selectedJob.feedback.comment}"</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No comment provided yet</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Feedback Actions
          </h2>
          <button
            onClick={() => {
              if (selectedJob.feedback.collected) {
                setFeedbackForm({
                  npsScore: selectedJob.feedback.npsScore,
                  satisfactionRating: selectedJob.feedback.satisfactionRating,
                  cleaning: selectedJob.feedback.categories.cleaning,
                  professionalism: selectedJob.feedback.categories.professionalism,
                  timeliness: selectedJob.feedback.categories.timeliness,
                  communication: selectedJob.feedback.categories.communication,
                  valueForMoney: selectedJob.feedback.categories.valueForMoney,
                  comment: selectedJob.feedback.comment
                })
              }
              setShowFeedbackModal(true)
            }}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {selectedJob.feedback.collected ? 'Update Feedback' : 'Send Feedback Request'}
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Collect Customer Feedback</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NPS Score (0-10)
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={feedbackForm.npsScore}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, npsScore: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-center font-bold mt-1 text-purple-600">{feedbackForm.npsScore}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Satisfaction (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setFeedbackForm({ ...feedbackForm, satisfactionRating: star })}
                      className={`px-3 py-2 rounded ${
                        feedbackForm.satisfactionRating === star
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {star}⭐
                    </button>
                  ))}
                </div>
              </div>

              {['cleaning', 'professionalism', 'timeliness', 'communication', 'valueForMoney'].map(category => (
                <div key={category}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()} (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={(feedbackForm as any)[category]}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, [category]: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-right text-sm font-semibold text-gray-600">{(feedbackForm as any)[category]}/5</p>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Comment
                </label>
                <textarea
                  value={feedbackForm.comment}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                  placeholder="What did the customer say about the service?"
                  className="w-full p-2 border border-gray-300 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Navigation */}
      {jobIdParam && (
        <div className="bg-linear-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-2">Feedback Collected</h3>
              <p className="text-sm text-muted-foreground">Request formal review from client for portfolio</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/jobs/${jobIdParam}`} className="flex items-center gap-2 px-4 py-2 border border-purple-300 bg-white rounded-lg hover:bg-purple-50 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Job
              </Link>
              <Link href={`/admin/jobs/review-request?jobId=${jobIdParam}`} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Request Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FeedbackCollectionPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <FeedbackCollectionContent />
    </Suspense>
  )
}
