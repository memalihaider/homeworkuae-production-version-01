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
  Award,
  Target,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface ReviewRequest {
  id: string
  employeeName: string
  role: string
  reviewerName: string
  reviewerRole: string
  status: 'pending' | 'in_progress' | 'completed'
  dueDate: string
  categories: {
    quality: number
    efficiency: number
    teamwork: number
    communication: number
    initiative: number
  }
  comments: string
  submittedAt?: string
}

export default function ReviewRequest() {
  const params = useParams()
  const jobId = params?.id as string || '1'

  const job = {
    id: parseInt(jobId),
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower'
  }

  const [reviews, setReviews] = useState<ReviewRequest[]>([
    {
      id: '1',
      employeeName: 'Fatima Al-Mazrouei',
      role: 'Team Lead',
      reviewerName: 'Sarah Johnson',
      reviewerRole: 'Operations Manager',
      status: 'pending',
      dueDate: '2025-01-25',
      categories: {
        quality: 0,
        efficiency: 0,
        teamwork: 0,
        communication: 0,
        initiative: 0
      },
      comments: ''
    },
    {
      id: '2',
      employeeName: 'Ahmed Hassan',
      role: 'Cleaner',
      reviewerName: 'Fatima Al-Mazrouei',
      reviewerRole: 'Team Lead',
      status: 'in_progress',
      dueDate: '2025-01-25',
      categories: {
        quality: 4,
        efficiency: 4,
        teamwork: 5,
        communication: 4,
        initiative: 3
      },
      comments: 'Ahmed demonstrated excellent attention to detail and maintained high standards throughout the job.'
    },
    {
      id: '3',
      employeeName: 'Maria Rodriguez',
      role: 'Cleaner',
      reviewerName: 'Fatima Al-Mazrouei',
      reviewerRole: 'Team Lead',
      status: 'completed',
      dueDate: '2025-01-25',
      categories: {
        quality: 5,
        efficiency: 4,
        teamwork: 5,
        communication: 4,
        initiative: 4
      },
      comments: 'Maria was proactive in identifying areas that needed extra attention and communicated effectively with the team.',
      submittedAt: '2025-01-22 10:30'
    }
  ])

  const [selectedReview, setSelectedReview] = useState<ReviewRequest | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateRating = useCallback((reviewId: string, category: string, rating: number) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId ? {
        ...review,
        categories: { ...review.categories, [category]: rating }
      } : review
    ))
  }, [])

  const updateComments = useCallback((reviewId: string, comments: string) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId ? { ...review, comments } : review
    ))
  }, [])

  const submitReview = useCallback(async (reviewId: string) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setReviews(prev => prev.map(review =>
      review.id === reviewId ? {
        ...review,
        status: 'completed',
        submittedAt: new Date().toLocaleString()
      } : review
    ))
    setIsSubmitting(false)
    setSelectedReview(null)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300'
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const renderStars = (rating: number, onRate: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
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

  const completedCount = reviews.filter(r => r.status === 'completed').length
  const totalCount = reviews.length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/admin/jobs/${jobId}`} className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance Reviews</h1>
            <p className="text-sm text-gray-600">{job.title}</p>
          </div>
        </div>
        <div className="text-sm font-bold text-gray-900">{completedCount}/{totalCount} Completed</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{review.employeeName}</div>
                    <div className="text-sm text-gray-600">{review.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(review.status)}`}>
                    {review.status.replace('_', ' ')}
                  </span>
                  {review.status !== 'completed' && (
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                Reviewer: {review.reviewerName} ({review.reviewerRole})
              </div>
              <div className="text-sm text-gray-600">
                Due: {review.dueDate}
              </div>

              {review.status === 'completed' && review.submittedAt && (
                <div className="mt-3 text-xs text-gray-500">
                  Submitted: {review.submittedAt}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedReview && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{selectedReview.employeeName}</div>
                <div className="text-sm text-gray-600">{selectedReview.role}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Reviewing as: {selectedReview.reviewerName}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(selectedReview.categories).map(([category, rating]) => (
                <div key={category}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {category}
                  </label>
                  {renderStars(rating, (newRating) => updateRating(selectedReview.id, category, newRating))}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments
                </label>
                <textarea
                  value={selectedReview.comments}
                  onChange={(e) => updateComments(selectedReview.id, e.target.value)}
                  placeholder="Provide detailed feedback..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => submitReview(selectedReview.id)}
                  disabled={Object.values(selectedReview.categories).some(r => r === 0) || isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  onClick={() => setSelectedReview(null)}
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