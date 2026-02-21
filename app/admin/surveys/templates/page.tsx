'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, ChevronRight, Copy, Eye } from 'lucide-react'
import { SURVEY_TEMPLATES } from '@/lib/surveys-data'

export default function SurveyTemplates() {
  const [templates] = useState(SURVEY_TEMPLATES)

  const createFromTemplate = (templateId: string) => {
    // Redirect to form page with template ID
    window.location.href = `/admin/surveys/form?template=${templateId}`
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Survey Templates</h1>
            <p className="text-gray-600 dark:text-gray-400">Choose from pre-designed templates or create custom surveys</p>
          </div>
          <Link href="/admin/surveys/form" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            Blank Survey
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{template.description}</p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sections:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{template.sections.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{template.sections.reduce((acc, s) => acc + s.questions.length, 0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {template.sections.map((section) => (
                  <div key={section.id} className="text-xs">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{section.title}</p>
                    <ul className="ml-2 text-gray-600 dark:text-gray-400 space-y-0.5">
                      {section.questions.slice(0, 2).map((q) => (
                        <li key={q.id} className="truncate">• {q.text}</li>
                      ))}
                      {section.questions.length > 2 && (
                        <li className="text-gray-500 dark:text-gray-500">+ {section.questions.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                <button onClick={() => createFromTemplate(template.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                  <Copy className="w-4 h-4" />
                  Use Template
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
