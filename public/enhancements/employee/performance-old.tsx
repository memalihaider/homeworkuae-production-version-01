'use client'

import { useState, useCallback, useMemo } from 'react'
import { Star, TrendingUp, Award, Target, MessageSquare, Download, Filter } from 'lucide-react'

interface Rating {
  id: string
  manager: string
  score: number
  date: string
  feedback: string
  category: 'Quality' | 'Reliability' | 'Teamwork' | 'Communication' | 'Leadership'
}

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  status: 'In Progress' | 'Completed' | 'Not Started'
  dueDate: string
  category: string
}

interface Achievement {
  id: string
  title: string
  description: string
  awardDate: string
  icon: string
  category: string
}

export default function PerformancePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  // Mock performance data
  const performanceRatings: Rating[] = [
    {
      id: '1',
      manager: 'John Smith',
      score: 4.5,
      date: '2024-01-15',
      feedback: 'Excellent work on the Q1 project. Shows great initiative and problem-solving skills.',
      category: 'Quality'
    },
    {
      id: '2',
      manager: 'Sarah Johnson',
      score: 4.8,
      date: '2024-01-10',
      feedback: 'Outstanding reliability. Always meets deadlines and maintains high quality standards.',
      category: 'Reliability'
    },
    {
      id: '3',
      manager: 'Mike Chen',
      score: 4.2,
      date: '2024-01-05',
      feedback: 'Good collaboration with team members. Could improve communication in large meetings.',
      category: 'Teamwork'
    },
    {
      id: '4',
      manager: 'Jane Wilson',
      score: 4.6,
      date: '2023-12-20',
      feedback: 'Effective communicator. Clear and concise in presentations and documentation.',
      category: 'Communication'
    }
  ]

  const performanceGoals: Goal[] = [
    {
      id: '1',
      title: 'Complete Advanced TypeScript Course',
      description: 'Finish TypeScript fundamentals and advanced patterns course',
      progress: 75,
      status: 'In Progress',
      dueDate: '2024-03-31',
      category: 'Development'
    },
    {
      id: '2',
      title: 'Lead Team Presentation',
      description: 'Present Q1 results to company leadership',
      progress: 30,
      status: 'In Progress',
      dueDate: '2024-02-28',
      category: 'Leadership'
    },
    {
      id: '3',
      title: 'Mentor Junior Developer',
      description: 'Provide guidance and mentoring to one junior team member',
      progress: 100,
      status: 'Completed',
      dueDate: '2024-01-31',
      category: 'Mentorship'
    },
    {
      id: '4',
      title: 'Improve Code Documentation',
      description: 'Document all critical code modules with examples',
      progress: 50,
      status: 'In Progress',
      dueDate: '2024-04-15',
      category: 'Development'
    }
  ]

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Employee of the Month',
      description: 'Awarded for exceptional performance in January',
      awardDate: '2024-01-31',
      icon: '🏆',
      category: 'Recognition'
    },
    {
      id: '2',
      title: 'Project Excellence Award',
      description: 'Recognized for delivering complex project ahead of schedule',
      awardDate: '2024-01-15',
      icon: '⭐',
      category: 'Achievement'
    },
    {
      id: '3',
      title: 'Team Player Award',
      description: 'Acknowledged for great collaboration and teamwork',
      awardDate: '2023-12-20',
      icon: '👥',
      category: 'Teamwork'
    },
    {
      id: '4',
      title: 'Innovation Award',
      description: 'Recognized for implementing process improvement initiative',
      awardDate: '2023-12-01',
      icon: '💡',
      category: 'Innovation'
    }
  ]

  // Calculate overall performance metrics
  const overallRating = useMemo(() => {
    if (performanceRatings.length === 0) return 0
    return (performanceRatings.reduce((sum, r) => sum + r.score, 0) / performanceRatings.length).toFixed(1)
  }, [])

  const completedGoals = useMemo(() => {
    return performanceGoals.filter(g => g.status === 'Completed').length
  }, [])

  const totalAchievements = achievements.length

  const ratingsByCategory = useMemo(() => {
    const categories: { [key: string]: number[] } = {}
    performanceRatings.forEach(rating => {
      if (!categories[rating.category]) {
        categories[rating.category] = []
      }
      categories[rating.category].push(rating.score)
    })
    return Object.entries(categories).map(([name, scores]) => ({
      name,
      average: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    }))
  }, [])

  // Filtered ratings
  const filteredRatings = useMemo(() => {
    return performanceRatings.filter(rating => {
      const matchesSearch = rating.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rating.feedback.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || rating.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, filterCategory])

  // Filtered goals
  const filteredGoals = useMemo(() => {
    return performanceGoals.filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          goal.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || goal.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, filterCategory])

  // Handler functions
  const handleViewRating = useCallback((rating: Rating) => {
    setSelectedRating(rating)
    setShowRatingModal(true)
  }, [])

  const handleViewGoal = useCallback((goal: Goal) => {
    setSelectedGoal(goal)
    setShowGoalModal(true)
  }, [])

  const handleUpdateGoalProgress = useCallback((goalId: string) => {
    alert(`Goal progress updated! You can now sync this with your manager.`)
  }, [])

  const handleDownloadReport = useCallback(() => {
    alert('Performance report downloaded as PDF. Check your downloads folder.')
  }, [])

  const handleRequestFeedback = useCallback(() => {
    alert('Feedback request sent to your manager. You will receive response within 2-3 business days.')
  }, [])

  const handleScheduleReview = useCallback(() => {
    alert('Review meeting scheduled with your manager for next week.')
  }, [])

  const getStarRating = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.round(score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
      />
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Not Started':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Review</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track your goals, ratings, and achievements</p>
            </div>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Download size={18} />
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Overall Rating */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Overall Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{overallRating}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <Star size={24} className="text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
              </div>
            </div>
            <div className="flex gap-1 mt-3">{getStarRating(parseFloat(overallRating))}</div>
          </div>

          {/* Goals Completed */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Goals Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedGoals}/{performanceGoals.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <Target size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              {Math.round((completedGoals / performanceGoals.length) * 100)}% completion rate
            </p>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Achievements</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalAchievements}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Award size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Career milestones</p>
          </div>

          {/* Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Trend</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">↑ +0.3</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">vs. last quarter</p>
          </div>
        </div>

        {/* Rating by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ratings by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ratingsByCategory.map((category) => (
              <div key={category.name} className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{category.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{category.average}</p>
                <div className="flex justify-center gap-1 mt-2">
                  {getStarRating(parseFloat(category.average))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowHistoryModal(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Latest Ratings
          </button>
          <button
            onClick={handleRequestFeedback}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Request Feedback
          </button>
          <button
            onClick={handleScheduleReview}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Schedule Review
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4 flex-col md:flex-row">
          <input
            type="text"
            placeholder="Search ratings or goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="Quality">Quality</option>
            <option value="Reliability">Reliability</option>
            <option value="Teamwork">Teamwork</option>
            <option value="Communication">Communication</option>
            <option value="Leadership">Leadership</option>
          </select>
        </div>

        {/* Performance Ratings Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Ratings</h2>
          <div className="space-y-4">
            {filteredRatings.map((rating) => (
              <div key={rating.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{rating.manager}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rating.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{rating.score}</span>
                    <div className="flex gap-1">{getStarRating(rating.score)}</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{rating.feedback}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    rating.category === 'Quality' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    rating.category === 'Reliability' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    rating.category === 'Teamwork' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {rating.category}
                  </span>
                  <button
                    onClick={() => handleViewRating(rating)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Goals Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Performance Goals</h2>
          <div className="space-y-4">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{goal.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Due: {goal.dueDate}</span>
                  <button
                    onClick={() => handleViewGoal(goal)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{achievement.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{achievement.awardDate}</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-400 rounded text-xs">
                        {achievement.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Detail Modal */}
      {showRatingModal && selectedRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rating Details</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manager</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRating.manager}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{selectedRating.score}</span>
                  <div className="flex gap-1">{getStarRating(selectedRating.score)}</div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Feedback</p>
                <p className="text-gray-900 dark:text-white">{selectedRating.feedback}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                <p className="text-gray-900 dark:text-white font-medium">{selectedRating.category}</p>
              </div>
            </div>
            <button
              onClick={() => setShowRatingModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Goal Detail Modal */}
      {showGoalModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Goal Details</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedGoal.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                <p className="text-gray-900 dark:text-white">{selectedGoal.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Progress</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${selectedGoal.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">{selectedGoal.progress}%</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className={`text-sm font-semibold ${
                    selectedGoal.status === 'Completed' ? 'text-green-600 dark:text-green-400' :
                    selectedGoal.status === 'In Progress' ? 'text-blue-600 dark:text-blue-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>{selectedGoal.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedGoal.dueDate}</p>
                </div>
              </div>
            </div>
            {selectedGoal.status === 'In Progress' && (
              <button
                onClick={() => {
                  handleUpdateGoalProgress(selectedGoal.id)
                  setShowGoalModal(false)
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition mb-2"
              >
                Update Progress
              </button>
            )}
            <button
              onClick={() => setShowGoalModal(false)}
              className="w-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
