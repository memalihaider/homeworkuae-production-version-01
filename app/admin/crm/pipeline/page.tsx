'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  ChevronRight, 
  Plus, 
  Trash2, 
  X, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowUpRight,
  Activity,
  Target,
  Zap,
  Clock,
  MoreHorizontal,
  ExternalLink,
  Filter,
  Search,
  LayoutGrid,
  Kanban,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  GripVertical
} from 'lucide-react'

export default function PipelineView() {
  const [leads, setLeads] = useState([
    { id: 1, name: 'Ahmed Al-Mansouri', company: 'Dubai Properties LLC', status: 'Qualified', value: 75000, daysInStage: 3, priority: 'High' },
    { id: 2, name: 'Fatima Al-Noor', company: 'Al Noor Logistics', status: 'Contacted', value: 45000, daysInStage: 5, priority: 'Medium' },
    { id: 3, name: 'Layla Hassan', company: 'Paradise Hotels', status: 'Proposal', value: 120000, daysInStage: 2, priority: 'High' },
    { id: 4, name: 'Hassan Khan', company: 'Khan Consulting', status: 'New', value: 50000, daysInStage: 1, priority: 'Medium' },
    { id: 5, name: 'Sara Ali', company: 'Ali Trading', status: 'Negotiation', value: 95000, daysInStage: 8, priority: 'High' },
    { id: 6, name: 'Mohammed Hassan', company: 'Hassan Group', status: 'Won', value: 180000, daysInStage: 0, priority: 'High' },
  ])

  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [draggedLead, setDraggedLead] = useState<any>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', company: '', value: '', priority: 'Medium' })

  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won']
  
  const leadsByStage = useMemo(() => {
    return stages.map(stage => ({
      stage,
      leads: leads.filter(l => l.status === stage),
      total: leads.filter(l => l.status === stage).reduce((sum, l) => sum + l.value, 0),
      count: leads.filter(l => l.status === stage).length
    }))
  }, [leads])

  const handleMoveStage = useCallback((lead: any, newStage: any) => {
    const updatedLeads = leads.map(l => l.id === lead.id ? { ...l, status: newStage, daysInStage: 0 } : l)
    setLeads(updatedLeads)

    // If lead is moved to Won stage, create assignment automatically
    if (newStage === 'Won') {
      createAssignmentFromWonLead(lead)
    }
  }, [leads])

  const createAssignmentFromWonLead = useCallback((lead: any) => {
    // In a real app, this would send data to the assignment page or API
    // For now, we'll simulate by storing in localStorage or showing a notification
    const assignmentData = {
      id: Date.now(), // Simple ID generation
      leadId: lead.id,
      name: lead.name,
      company: lead.company,
      value: lead.value,
      priority: lead.priority,
      wonDate: new Date().toISOString().split('T')[0],
      serviceType: determineServiceType(lead.company, lead.value),
      surveyRequired: lead.value > 100000 // High-value leads require surveys
    }

    // Store in localStorage to simulate data sharing between pages
    const existingAssignments = JSON.parse(localStorage.getItem('wonLeadsForAssignment') || '[]')
    localStorage.setItem('wonLeadsForAssignment', JSON.stringify([...existingAssignments, assignmentData]))

    // Show success notification (in real app, use a toast system)
    alert(`Assignment created for ${lead.name} from ${lead.company}. Check the Assignment page.`)
  }, [])

  const determineServiceType = (company: string, value: number): string => {
    // Simple logic to determine service type based on company and value
    if (company.toLowerCase().includes('medical') || company.toLowerCase().includes('hospital')) {
      return 'Medical Facility Cleaning'
    } else if (company.toLowerCase().includes('office') || value > 150000) {
      return 'Office Cleaning'
    } else if (company.toLowerCase().includes('warehouse') || company.toLowerCase().includes('logistics')) {
      return 'Warehouse Sanitization'
    } else {
      return 'General Cleaning'
    }
  }

  const handleDeleteLead = useCallback((leadId: any) => {
    setLeads(leads.filter(l => l.id !== leadId))
  }, [leads])

  // Drag and Drop Handlers
  const handleDragStart = (e: any, lead: any) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: any, stageData: any) => {
    e.preventDefault()
    if (draggedLead && draggedLead.status !== stageData.stage) {
      handleMoveStage(draggedLead, stageData.stage)
    }
    setDraggedLead(null)
  }

  const handleDragEnd = () => {
    setDraggedLead(null)
  }

  const handleAddNewLead = () => {
    if (formData.name && formData.company && formData.value) {
      const newLead = {
        id: Math.max(...leads.map(l => l.id), 0) + 1,
        name: formData.name,
        company: formData.company,
        status: 'New',
        value: parseInt(formData.value),
        daysInStage: 0,
        priority: formData.priority
      }
      setLeads([...leads, newLead])
      setFormData({ name: '', company: '', value: '', priority: 'Medium' })
      setShowNewForm(false)
    }
  }

  const totalPipeline = leads.reduce((sum, l) => sum + l.value, 0)
  const avgDealSize = leads.length > 0 ? leads.reduce((sum, l) => sum + l.value, 0) / leads.length : 0

  return (
    <div className="space-y-4 pb-10">
      {/* Compact Header */}
      <div className="relative overflow-hidden rounded-xl bg-white p-4 md:p-6 text-gray-900 shadow-sm border border-gray-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-300">
                <Kanban className="h-4 w-4 text-blue-700" />
              </div>
              <span className="text-blue-700 font-bold text-xs uppercase">Sales Pipeline</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Deal Manager</h1>
          </div>
          <button onClick={() => setShowNewForm(true)} className="group relative flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>
        
        {/* Subtle background */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-40 w-40 rounded-full bg-blue-100 blur-[80px] opacity-30"></div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: 'Pipeline', value: `AED ${(totalPipeline / 1000).toFixed(0)}K`, icon: DollarSign, color: 'blue' },
          { label: 'Active', value: leads.length, icon: Target, color: 'purple' },
          { label: 'Avg Deal', value: `AED ${(avgDealSize / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'green' },
          { label: 'Won', value: leads.filter(l => l.status === 'Won').length, icon: CheckCircle2, color: 'emerald' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-lg font-black mt-0.5 ${stat.color === 'blue' ? 'text-blue-700' : stat.color === 'purple' ? 'text-purple-700' : stat.color === 'green' ? 'text-green-700' : 'text-emerald-700'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-100 text-blue-700' : stat.color === 'purple' ? 'bg-purple-100 text-purple-700' : stat.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Kanban Board with Drag & Drop */}
      <div className="flex gap-3 overflow-x-auto pb-6 snap-x scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {leadsByStage.map((stageData) => (
          <div key={stageData.stage} className="shrink-0 w-72 snap-start">
            {/* Stage Header */}
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{stageData.stage}</h3>
                <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[9px] font-bold text-gray-700">
                  {stageData.count}
                </span>
              </div>
              <p className="text-[9px] font-bold text-blue-700 uppercase">
                AED {(stageData.total / 1000).toFixed(0)}K
              </p>
            </div>

            {/* Drop Zone */}
            <div 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stageData)}
              className="space-y-2 min-h-[400px] rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 p-3 transition-all hover:border-blue-400 hover:bg-blue-50"
            >
              {stageData.leads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  onDragEnd={handleDragEnd}
                  onClick={() => { setSelectedLead(lead); setShowDetails(true) }}
                  className={`bg-white border-l-4 rounded-lg p-3 cursor-move hover:shadow-md transition-all group ${
                    draggedLead?.id === lead.id ? 'opacity-50 scale-95' : 'hover:border-l-blue-500'
                  } ${
                    lead.priority === 'High' ? 'border-l-red-500' :
                    lead.priority === 'Medium' ? 'border-l-amber-500' :
                    'border-l-green-500'
                  }`}
                  style={{ cursor: draggedLead?.id === lead.id ? 'grabbing' : 'grab' }}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-xs group-hover:text-blue-600 truncate">
                        {lead.name.split(' ')[0]} {lead.name.split(' ')[1]?.charAt(0)}.
                      </h4>
                      <p className="text-[10px] text-gray-600 font-medium truncate mt-0.5">
                        {lead.company.substring(0, 20)}...
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs font-bold text-blue-700">
                          AED {(lead.value / 1000).toFixed(0)}K
                        </span>
                        <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {lead.daysInStage}d
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 ml-5">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                      lead.priority === 'High' ? 'bg-red-100 text-red-700 border-red-300' :
                      lead.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                      'bg-green-100 text-green-700 border-green-300'
                    }`}>
                      {lead.priority}
                    </span>
                  </div>
                </div>
              ))}
              
              {stageData.leads.length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center text-gray-400">
                  <Activity className="h-5 w-5 mb-2 opacity-40" />
                  <span className="text-[9px] font-bold uppercase opacity-50">No deals</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Compact Lead Details Modal */}
      {showDetails && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-linear-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-300">
                  <Target className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">{selectedLead.name}</h2>
                  <p className="text-gray-600 text-xs font-medium mt-0.5 uppercase">{selectedLead.company.substring(0, 25)}</p>
                </div>
              </div>
              <button onClick={() => setShowDetails(false)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-300">
                  <p className="text-[9px] font-bold text-blue-700 uppercase tracking-wider mb-1">Deal Value</p>
                  <p className="text-lg font-black text-blue-900">AED {(selectedLead.value / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-300">
                  <p className="text-[9px] font-bold text-purple-700 uppercase tracking-wider mb-1">Priority</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[9px] font-bold uppercase border ${
                    selectedLead.priority === 'High' ? 'bg-red-100 text-red-700 border-red-300' :
                    selectedLead.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                    'bg-green-100 text-green-700 border-green-300'
                  }`}>
                    {selectedLead.priority}
                  </span>
                </div>
              </div>

              {/* Pipeline Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Pipeline Progress</p>
                  <span className="text-xs font-black text-gray-900">{selectedLead.status}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500" 
                    style={{ width: `${((stages.indexOf(selectedLead.status) + 1) / stages.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Days & Quick Move */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Days in Stage</p>
                  <div className="flex items-center gap-1 text-gray-900 font-bold">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {selectedLead.daysInStage}d
                  </div>
                </div>
                {selectedLead.status !== stages[stages.length - 1] && (
                  <div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Next Stage</p>
                    <select
                      defaultValue={selectedLead.status}
                      onChange={(e) => {
                        handleMoveStage(selectedLead, e.target.value)
                        setShowDetails(false)
                      }}
                      className="w-full px-2 py-1.5 bg-blue-50 border border-blue-300 rounded text-xs text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {stages.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-300 flex gap-3">
              <button 
                onClick={() => setShowDetails(false)} 
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold text-sm uppercase transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDeleteLead(selectedLead.id)
                  setShowDetails(false)
                }}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold text-sm uppercase transition-all border border-red-300 flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Opportunity Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-linear-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-300">
                  <Plus className="h-5 w-5 text-blue-700" />
                </div>
                <h2 className="text-lg font-black text-gray-900">New Opportunity</h2>
              </div>
              <button onClick={() => setShowNewForm(false)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Name Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Contact Name</label>
                <input
                  type="text"
                  placeholder="Enter contact name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Company Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Company Name</label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Deal Value Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Deal Value (AED)</label>
                <input
                  type="number"
                  placeholder="Enter deal value"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Priority Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 font-bold"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-300 flex gap-3">
              <button 
                onClick={() => setShowNewForm(false)} 
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold text-sm uppercase transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewLead}
                disabled={!formData.name || !formData.company || !formData.value}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-bold text-sm uppercase transition-all flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
