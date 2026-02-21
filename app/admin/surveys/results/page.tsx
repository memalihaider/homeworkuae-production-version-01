'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, Download } from 'lucide-react'
import { MOCK_SURVEYS, MOCK_RESPONSES } from '@/lib/surveys-data'

export default function SurveyResults() {
  const [surveys] = useState(MOCK_SURVEYS)
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null)

  const stats = useMemo(() => {
    const totalResponses = MOCK_RESPONSES.length
    const avgCompletionRate = Math.round(surveys.reduce((acc, s) => acc + s.completionRate, 0) / surveys.length)
    const totalSurveys = surveys.length
    const avgRating = totalResponses > 0 
      ? (MOCK_RESPONSES.reduce((acc, r) => acc + (r.overallRating || 0), 0) / totalResponses).toFixed(1)
      : 'N/A'

    return { totalResponses, avgCompletionRate, totalSurveys, avgRating }
  }, [surveys])

  const selectedSurveyData = selectedSurvey ? surveys.find(s => s.id === selectedSurvey) : null
  const surveyResponses = selectedSurvey ? MOCK_RESPONSES.filter(r => r.surveyId === selectedSurvey) : []

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/surveys" className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Survey Results & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">View detailed survey responses and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Surveys</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSurveys}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Responses</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalResponses}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgCompletionRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Rating</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgRating}/5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Survey Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Surveys</h2>
          <div className="space-y-2">
            {surveys.map((survey) => (
              <button
                key={survey.id}
                onClick={() => setSelectedSurvey(survey.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedSurvey === survey.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600'
                }`}
              >
                <p className="font-semibold text-sm">{survey.title}</p>
                <p className={`text-xs ${selectedSurvey === survey.id ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {MOCK_RESPONSES.filter(r => r.surveyId === survey.id).length} responses
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          {selectedSurveyData ? (
            <div className="space-y-6">
              {/* Survey Info */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedSurveyData.title}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Client</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedSurveyData.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Company</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedSurveyData.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">{selectedSurveyData.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Responses</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedSurveyData.responseCount}/{selectedSurveyData.sendCount}</p>
                  </div>
                </div>
              </div>

              {/* Responses */}
              {surveyResponses.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Responses ({surveyResponses.length})</h3>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <div className="space-y-3">
                    {surveyResponses.map((response) => (
                      <div key={response.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{response.clientName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{response.submittedDate}</p>
                        </div>
                        {response.overallRating && (
                          <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded-lg">
                            <span className="font-bold text-yellow-800 dark:text-yellow-200">{response.overallRating}</span>
                            <span className="text-sm text-yellow-700 dark:text-yellow-300">/5</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-600 dark:text-gray-400">Select a survey to view responses and analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
