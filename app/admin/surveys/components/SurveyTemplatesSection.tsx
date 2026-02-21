'use client'

import { Copy, Eye } from 'lucide-react'
import { SURVEY_TEMPLATES } from '@/lib/surveys-data'

interface Props {
  onUseTemplate: (templateId: string) => void
}

export default function SurveyTemplatesSection({ onUseTemplate }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-black mb-1">Survey Templates</h2>
        <p className="text-sm text-gray-600">Choose from pre-designed templates to start quickly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SURVEY_TEMPLATES.map((template) => (
          <div key={template.id} className="bg-white rounded border border-gray-300 overflow-hidden hover:border-black transition-colors">
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-bold text-black mb-1">{template.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded p-2 mb-3">
                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold tracking-tight">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Sections</span>
                    <span className="text-black">{template.sections.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Questions</span>
                    <span className="text-black">{template.sections.reduce((acc, s) => acc + s.questions.length, 0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {template.sections.map((section) => (
                  <div key={section.id} className="text-[11px]">
                    <p className="font-bold text-gray-800 mb-0.5">{section.title}</p>
                    <ul className="ml-1 text-gray-500 space-y-0.5">
                      {section.questions.slice(0, 1).map((q) => (
                        <li key={q.id} className="truncate">• {q.text}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onUseTemplate(template.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors font-medium border border-black"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Use Template
                </button>
                <button title="Preview" className="flex items-center justify-center px-3 py-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
