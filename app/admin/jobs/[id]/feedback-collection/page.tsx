'use client'

import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Send,
  User,
  CheckCircle,
  Clock,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Feedback {
  id: string
  type: 'client' | 'team'
  name: string
  role: string
  rating: number
  comments: string
  submittedAt: string
  status: 'pending' | 'submitted'
}

export default function FeedbackCollection() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower'
  }

  const [feedback, setFeedback] = useState<Feedback[]>([
    {
      id: '1',
      type: 'client',
      name: 'Sarah Johnson',
      role: 'Facility Manager',
      rating: 0,
      comments: '',
      submittedAt: '',
      status: 'pending'
    },
    {
      id: '2',
      type: 'team',
      name: 'Fatima Al-Mazrouei',
      role: 'Team Lead',
      rating: 0,
      comments: '',
      submittedAt: '',
      status: 'pending'
    },
    {
      id: '3',
      type: 'team',
      name: 'Ahmed Hassan',
      role: 'Cleaner',
      rating: 0,
      comments: '',
      submittedAt: '',
      status: 'pending'
    },
    {
      id: '4',
      type: 'team',
      name: 'Maria Rodriguez',
      role: 'Cleaner',
      rating: 0,
      comments: '',
      submittedAt: '',
      status: 'pending'
    }
  ])

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateRating = useCallback((id: string, rating: number) => {
    setFeedback(prev => prev.map(f =>
      f.id === id ? { ...f, rating } : f
    ))
  }, [])

  const updateComments = useCallback((id: string, comments: string) => {
    setFeedback(prev => prev.map(f =>
      f.id === id ? { ...f, comments } : f
    ))
  }, [])

  const submitFeedback = useCallback(async (id: string) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setFeedback(prev => prev.map(f =>
      f.id === id ? {
        ...f,
        status: 'submitted',
        submittedAt: new Date().toLocaleString()
      } : f
    ))
    setIsSubmitting(false)
    setSelectedFeedback(null)
  }, [])

  const submittedCount = feedback.filter(f => f.status === 'submitted').length
  const totalCount = feedback.length

  const renderStars = (rating: number, onRate: (rating: number) => void, readonly = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !readonly && onRate(star)}
            disabled={readonly}
            className={`w-6 h-6 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star
              className={`w-full h-full ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/admin/jobs/${jobId}`} className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback Collection</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="text-sm font-bold text-gray-900">{submittedCount}/{totalCount} Submitted</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === 'client' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <User className={`w-5 h-5 ${
                      item.type === 'client' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'submitted' ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Submitted</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedFeedback(item)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Provide Feedback
                    </button>
                  )}
                </div>
              </div>

              {item.status === 'submitted' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    {renderStars(item.rating, () => {}, true)}
                  </div>
                  {item.comments && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Comments:</div>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {item.comments}
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Submitted: {item.submittedAt}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedFeedback && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedFeedback.type === 'client' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                <User className={`w-6 h-6 ${
                  selectedFeedback.type === 'client' ? 'text-blue-600' : 'text-green-600'
                }`} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{selectedFeedback.name}</div>
                <div className="text-sm text-gray-600">{selectedFeedback.role}</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                {renderStars(selectedFeedback.rating, (rating) => updateRating(selectedFeedback.id, rating))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments
                </label>
                <textarea
                  value={selectedFeedback.comments}
                  onChange={(e) => updateComments(selectedFeedback.id, e.target.value)}
                  placeholder="Share your feedback..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => submitFeedback(selectedFeedback.id)}
                  disabled={selectedFeedback.rating === 0 || isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}