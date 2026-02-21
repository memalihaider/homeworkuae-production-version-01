'use client'

import { useState, Suspense } from 'react'
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  Tag, 
  DollarSign, 
  ArrowRight, 
  MessageSquare, 
  Star, 
  Zap, 
  ClipboardCheck, 
  Navigation, 
  AlertTriangle, 
  CheckSquare, 
  MessageCircle,
  Calendar,
  Timer,
  ShieldCheck,
  Download,
  History,
  Paperclip,
  Plus,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

function JobDetailContent() {
  const params = useParams()
  const jobId = params?.id || '1'
  const [activeTab, setActiveTab] = useState<'overview' | 'pre-execution' | 'execution' | 'completion'>('overview')
  
  const job = {
    id: 1,
    title: 'Office Deep Cleaning - Downtown Tower',
    client: 'Downtown Business Tower',
    status: 'Scheduled',
    priority: 'High',
    scheduledDate: '2025-01-20',
    scheduledTime: '08:00 - 16:00',
    location: 'Downtown, Dubai',
    estimatedDuration: '8 hours',
    teamRequired: 4,
    assignedTeam: ['Ahmed Hassan', 'Fatima Al-Mazrouei', 'Mohammed Bin Ali'],
    permits: ['Building Access Pass', 'Commercial Permit'],
    slaDeadline: '2025-01-20',
    daysUntilSLA: 2,
    riskLevel: 'medium',
    requiredSkills: ['Floor Cleaning', 'Window Cleaning', 'Safety Certification', 'Team Lead'],
    dependencies: ['Building access authorization', 'Equipment delivery'],
    budget: 5000,
    description: 'Complete office floor deep cleaning with window and cubicle sanitization',
    notes: 'Building manager is Ahmed. Access from rear entrance. Equipment storage in basement.',
    history: [
      { action: 'Created', user: 'Sales Team', timestamp: '2025-01-10 10:30', details: 'Job created from quotation' },
      { action: 'Scheduled', user: 'Scheduling Team', timestamp: '2025-01-12 14:00', details: 'Date and time confirmed' },
      { action: 'Team Assigned', user: 'HR Manager', timestamp: '2025-01-15 09:00', details: '3 team members assigned' }
    ],
    attachments: [
      { name: 'Building Layout', type: 'PDF', size: '2.4 MB' },
      { name: 'Safety Instructions', type: 'PDF', size: '1.1 MB' },
      { name: 'Client Requirements', type: 'DOC', size: '450 KB' }
    ]
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/jobs" className="p-2 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                job.status === 'Scheduled' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {job.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {job.client}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all border border-gray-400">
            <Edit2 className="w-4 h-4" />
            <span>Edit Job</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all border border-red-300">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Scheduled Date', value: job.scheduledDate, sub: job.scheduledTime, icon: Calendar, color: 'text-blue-600' },
          { label: 'Duration', value: job.estimatedDuration, sub: 'Estimated', icon: Timer, color: 'text-indigo-600' },
          { label: 'Budget', value: `AED ${job.budget.toLocaleString()}`, sub: 'Fixed Price', icon: DollarSign, color: 'text-emerald-600' },
          { label: 'SLA Deadline', value: job.slaDeadline, sub: `${job.daysUntilSLA} days left`, icon: ShieldCheck, color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-300 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-4 gap-2 p-1 bg-white border border-gray-300 rounded-2xl shadow-sm">
        {[
          { id: 'overview', label: 'Overview', icon: FileText },
          { id: 'pre-execution', label: 'Pre-Execution', icon: ClipboardCheck },
          { id: 'execution', label: 'Execution', icon: Navigation },
          { id: 'completion', label: 'Completion', icon: CheckSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="line-clamp-2 text-center">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Workflow Quick Actions */}
      {job.status === 'Scheduled' && (
        <div className="bg-blue-50 border border-blue-300 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-widest">Workflow Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link 
              href={`/admin/jobs/pre-job-checklist?jobId=${jobId}`}
              className="p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all group"
            >
              <ClipboardCheck className="w-5 h-5 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-blue-900">Pre-Job Checklist</span>
            </Link>
            <Link 
              href={`/admin/jobs/assignment?jobId=${jobId}`}
              className="p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all group"
            >
              <Users className="w-5 h-5 text-purple-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-purple-900">Assign Team</span>
            </Link>
            <Link 
              href={`/admin/jobs/permit-tracker?jobId=${jobId}`}
              className="p-4 bg-green-100 hover:bg-green-200 border border-green-400 rounded-xl text-center transition-all group"
            >
              <FileText className="w-5 h-5 text-green-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-green-900">Permit Tracker</span>
            </Link>
            <Link 
              href={`/admin/jobs/equipment-readiness?jobId=${jobId}`}
              className="p-4 bg-orange-100 hover:bg-orange-200 border border-orange-400 rounded-xl text-center transition-all group"
            >
              <Zap className="w-5 h-5 text-orange-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-orange-900">Equipment</span>
            </Link>
          </div>
        </div>
      )}

      {job.status === 'In Progress' && (
        <div className="bg-green-50 border border-green-300 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-green-900 mb-4 uppercase tracking-widest">Execution Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link 
              href={`/admin/jobs/live-job-view?jobId=${jobId}`}
              className="p-4 bg-green-100 hover:bg-green-200 border border-green-400 rounded-xl text-center transition-all group"
            >
              <Navigation className="w-5 h-5 text-green-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-green-900">Live View</span>
            </Link>
            <Link 
              href={`/admin/jobs/task-progress?jobId=${jobId}`}
              className="p-4 bg-blue-100 hover:bg-blue-200 border border-blue-400 rounded-xl text-center transition-all group"
            >
              <CheckSquare className="w-5 h-5 text-blue-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-blue-900">Task Progress</span>
            </Link>
            <Link 
              href={`/admin/jobs/damage-check?jobId=${jobId}`}
              className="p-4 bg-orange-100 hover:bg-orange-200 border border-orange-400 rounded-xl text-center transition-all group"
            >
              <AlertTriangle className="w-5 h-5 text-orange-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-orange-900">Damage Check</span>
            </Link>
            <Link 
              href={`/admin/jobs/incident-log?jobId=${jobId}`}
              className="p-4 bg-red-100 hover:bg-red-200 border border-red-400 rounded-xl text-center transition-all group"
            >
              <AlertCircle className="w-5 h-5 text-red-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-red-900">Incidents</span>
            </Link>
          </div>
        </div>
      )}

      {job.status === 'Completed' && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-emerald-900 mb-4 uppercase tracking-widest">Completion Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link 
              href={`/admin/jobs/job-closure?jobId=${jobId}`}
              className="p-4 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-xl text-center transition-all group"
            >
              <CheckCircle className="w-5 h-5 text-emerald-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-emerald-900">Job Closure</span>
            </Link>
            <Link 
              href={`/admin/jobs/feedback-collection?jobId=${jobId}`}
              className="p-4 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-xl text-center transition-all group"
            >
              <Star className="w-5 h-5 text-indigo-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-indigo-900">Feedback</span>
            </Link>
            <Link 
              href={`/admin/jobs/review-request?jobId=${jobId}`}
              className="p-4 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-xl text-center transition-all group"
            >
              <MessageSquare className="w-5 h-5 text-purple-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-purple-900">Review</span>
            </Link>
            <Link 
              href={`/admin/jobs/client-summary?jobId=${jobId}`}
              className="p-4 bg-pink-100 hover:bg-pink-200 border border-pink-400 rounded-xl text-center transition-all group"
            >
              <Users className="w-5 h-5 text-pink-700 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-pink-900">Summary</span>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Description & Notes */}
              <div className="bg-white border border-gray-300 rounded-3xl p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    Job Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>
                <div className="p-6 bg-indigo-50 border border-indigo-300 rounded-2xl">
                  <h4 className="text-sm font-bold text-indigo-900 mb-2">Operational Notes</h4>
                  <p className="text-sm text-gray-800">{job.notes}</p>
                </div>
              </div>

              {/* Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-xs font-bold border border-blue-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Permits & Access</h3>
                  <div className="space-y-3">
                    {job.permits.map((permit, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-gray-700">{permit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'pre-execution' && (
            <div className="bg-white border border-gray-300 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Pre-Job Readiness</h3>
                <span className="text-xs font-bold text-indigo-900 px-3 py-1 bg-indigo-100 rounded-full">85% Ready</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Equipment Readiness', status: 'Ready', icon: Zap, color: 'text-emerald-600' },
                  { label: 'Team Briefing', status: 'Pending', icon: MessageCircle, color: 'text-amber-600' },
                  { label: 'Site Access Pass', status: 'Verified', icon: ShieldCheck, color: 'text-emerald-600' },
                  { label: 'Safety Checklist', status: 'In Progress', icon: ClipboardCheck, color: 'text-blue-600' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-300 flex items-center justify-between group hover:bg-gray-100 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-200 rounded-lg">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Team & History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Team Section */}
          <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Assigned Team</h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline">Manage</button>
            </div>
            <div className="space-y-4">
              {job.assignedTeam.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {member.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{member}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Technician</div>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 text-sm font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Attachments</h3>
            <div className="space-y-3">
              {job.attachments.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{file.name}</div>
                      <div className="text-[10px] text-gray-500">{file.size} • {file.type}</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* History Timeline */}
          <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-500" />
              Activity Log
            </h3>
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gray-300">
              {job.history.map((event, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-3 top-1.5 w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]" />
                  <div className="text-xs font-bold text-gray-900 mb-1">{event.action}</div>
                  <div className="text-[10px] text-gray-600 mb-1">{event.timestamp} • {event.user}</div>
                  <div className="text-[10px] text-gray-500 italic">{event.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JobDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <JobDetailContent />
    </Suspense>
  )
}
