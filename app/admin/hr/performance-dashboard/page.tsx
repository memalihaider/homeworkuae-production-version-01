'use client'

import { useState, useMemo } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Brain, 
  Award, 
  Activity, 
  Zap, 
  Target, 
  FileText,
  Search,
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  Heart,
  Star,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  ArrowDownRight,
  Loader
} from 'lucide-react'

export default function PerformanceDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [viewMode, setViewMode] = useState<'heatmap' | 'burnout'>('heatmap')
  const [showAISummary, setShowAISummary] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showInterventionPlan, setShowInterventionPlan] = useState(false)
  const [isGeneratingIntervention, setIsGeneratingIntervention] = useState(false)

  const performanceData = [
    { id: 1, employee: 'Ahmed Al-Mazrouei', department: 'Operations', rating: 4.8, kpi: 98, engagement: 92, turnover_risk: 'Low', burnout_score: 15 },
    { id: 2, employee: 'Fatima Al-Ketbi', department: 'HR', rating: 4.9, kpi: 99, engagement: 95, turnover_risk: 'Low', burnout_score: 12 },
    { id: 3, employee: 'Mohammed Bin Ali', department: 'Operations', rating: 4.6, kpi: 87, engagement: 78, turnover_risk: 'Low', burnout_score: 42 },
    { id: 4, employee: 'Sara Al-Noor', department: 'HR', rating: 4.7, kpi: 92, engagement: 88, turnover_risk: 'Low', burnout_score: 18 },
    { id: 5, employee: 'Hassan Al-Mazrouei', department: 'Operations', rating: 4.5, kpi: 79, engagement: 65, turnover_risk: 'Medium', burnout_score: 68 },
    { id: 6, employee: 'Layla Al-Mansouri', department: 'HR', rating: 4.8, kpi: 95, engagement: 90, turnover_risk: 'Low', burnout_score: 16 },
    { id: 7, employee: 'Omar Khan', department: 'Operations', rating: 4.3, kpi: 81, engagement: 72, turnover_risk: 'Medium', burnout_score: 38 },
    { id: 8, employee: 'Khalid Al-Shehhi', department: 'Operations', rating: 4.4, kpi: 84, engagement: 75, turnover_risk: 'Low', burnout_score: 25 },
  ]

  const burnoutRiskAssessment = useMemo(() => {
    return performanceData.map(emp => {
      let riskLevel = 'Low'
      if (emp.burnout_score >= 60) riskLevel = 'Critical'
      else if (emp.burnout_score >= 45) riskLevel = 'High'
      else if (emp.burnout_score >= 30) riskLevel = 'Medium'

      return {
        ...emp,
        riskLevel,
        factors: [
          emp.engagement < 70 ? 'Low engagement' : '',
          emp.burnout_score > 50 ? 'High workload indicators' : '',
          emp.turnover_risk === 'Medium' ? 'Flight risk detected' : '',
          emp.rating < 4.3 ? 'Performance decline' : ''
        ].filter(Boolean)
      }
    })
  }, [])

  const departmentMetrics = useMemo(() => {
    const depts: Record<string, any> = {}
    performanceData.forEach(emp => {
      if (!depts[emp.department]) {
        depts[emp.department] = { count: 0, avgRating: 0, avgKPI: 0, avgBurnout: 0, highRiskCount: 0 }
      }
      depts[emp.department].count++
      depts[emp.department].avgRating += emp.rating
      depts[emp.department].avgKPI += emp.kpi
      depts[emp.department].avgBurnout += emp.burnout_score
      if (emp.burnout_score >= 45) depts[emp.department].highRiskCount++
    })

    Object.keys(depts).forEach(dept => {
      depts[dept].avgRating = (depts[dept].avgRating / depts[dept].count).toFixed(1)
      depts[dept].avgKPI = Math.round(depts[dept].avgKPI / depts[dept].count)
      depts[dept].avgBurnout = Math.round(depts[dept].avgBurnout / depts[dept].count)
    })

    return depts
  }, [])

  const kpiMetrics = {
    avgPerformance: (performanceData.reduce((sum, e) => sum + e.rating, 0) / performanceData.length).toFixed(1),
    avgKPI: Math.round(performanceData.reduce((sum, e) => sum + e.kpi, 0) / performanceData.length),
    highPerformers: performanceData.filter(e => e.rating >= 4.7).length,
    atRiskEmployees: burnoutRiskAssessment.filter(e => e.riskLevel === 'Critical' || e.riskLevel === 'High').length,
  }

  const filteredData = selectedDepartment === 'all' 
    ? performanceData 
    : performanceData.filter(e => e.department === selectedDepartment)

  const handleGenerateSummary = () => {
    setIsGenerating(true)
    // Simulate AI processing time
    setTimeout(() => {
      setIsGenerating(false)
      setShowAISummary(true)
    }, 2500) // 2.5 seconds to simulate AI processing
  }

  const handleGenerateInterventionPlan = () => {
    setIsGeneratingIntervention(true)
    // Simulate AI processing time for intervention plan
    setTimeout(() => {
      setIsGeneratingIntervention(false)
      setShowInterventionPlan(true)
    }, 3000) // 3 seconds to simulate AI processing
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-white p-8 md:p-12 text-black shadow-2xl border border-gray-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-300">
                <Activity className="h-5 w-5 text-rose-600" />
              </div>
              <span className="text-rose-600 font-bold tracking-wider text-sm uppercase">Workforce Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">Performance Dashboard</h1>
            <p className="text-gray-600 mt-3 text-lg font-medium max-w-xl">
              AI-driven performance heatmaps, burnout detection, and real-time KPI tracking.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="group relative flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98]">
              <FileText className="h-5 w-5" />
              Export Analysis
            </button>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-rose-100 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-purple-100 blur-[100px]"></div>
      </div>

      {/* AI Analysis Summary */}
      {isGenerating ? (
        <div className="bg-white p-8 rounded-[32px] border border-gray-300 shadow-lg">
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-300">
              <Loader className="h-6 w-6 text-rose-600 animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-black mb-2">Generating AI Analysis</h2>
              <p className="text-gray-600 font-medium">AI is analyzing performance data and generating insights...</p>
              <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>
        </div>
      ) : !showAISummary ? (
        <div className="bg-white p-8 rounded-[32px] border border-gray-300 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-300">
                <Brain className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black">AI Performance Analysis</h2>
                <p className="text-gray-600 font-medium">Generate comprehensive insights and recommendations</p>
              </div>
            </div>
            <button
              onClick={handleGenerateSummary}
              className="group relative flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Brain className="h-5 w-5" />
              Generate Summary
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[32px] border border-gray-300 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-300">
                <Brain className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black">AI Performance Analysis</h2>
                <p className="text-gray-600 font-medium">Comprehensive insights and recommendations</p>
              </div>
            </div>
            <button
              onClick={() => setShowAISummary(false)}
              className="group relative flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Hide Summary
            </button>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              The current performance dashboard reveals a workforce with an average rating of <strong className="text-black">{kpiMetrics.avgPerformance} out of 5.0</strong>, 
              demonstrating strong overall performance across departments. KPI achievement stands at <strong className="text-black">{kpiMetrics.avgKPI}%</strong>, 
              indicating effective goal attainment, while employee engagement measures at <strong className="text-black">{performanceData.reduce((sum, e) => sum + e.engagement, 0) / performanceData.length}%</strong>, 
              suggesting a motivated and committed team.
            </p>
            
            <p className="mb-4">
              However, burnout risk levels at <strong className="text-black">{Math.round(performanceData.reduce((sum, e) => sum + e.burnout_score, 0) / performanceData.length)}%</strong> warrant immediate attention, with 
              <strong className="text-black">{kpiMetrics.atRiskEmployees}</strong> employees currently identified as high or critical risk. The Operations department shows 
              particular vulnerability with an average burnout score of <strong className="text-black">{departmentMetrics.Operations?.avgBurnout || 'N/A'}</strong>, 
              compared to HR's more favorable <strong className="text-black">{departmentMetrics.HR?.avgBurnout || 'N/A'}</strong>.
            </p>
            
            <p className="mb-4">
              Departmental analysis highlights Operations leading with <strong className="text-black">{departmentMetrics.Operations?.avgRating || 'N/A'}</strong> average rating 
              and <strong className="text-black">{departmentMetrics.Operations?.avgKPI || 'N/A'}%</strong> KPI achievement, while HR maintains exceptional performance with 
              <strong className="text-black">{departmentMetrics.HR?.avgRating || 'N/A'}</strong> rating. The presence of <strong className="text-black">{kpiMetrics.highPerformers}</strong> 
              high performers (rating 4.7+) indicates strong talent within the organization.
            </p>
            
            <p className="mb-4">
              Key recommendations include implementing workload redistribution strategies for Operations personnel, scheduling targeted engagement interventions for employees 
              with scores below 75%, and establishing proactive monitoring systems to prevent burnout escalation. The current turnover risk assessment shows most employees 
              at low risk, providing a foundation for retention-focused initiatives.
            </p>
            
            <p>
              Overall, the organization demonstrates robust performance metrics with room for improvement in burnout prevention and engagement optimization. Strategic 
              interventions targeting high-risk areas could enhance productivity while maintaining employee well-being and organizational stability.
            </p>
          </div>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex bg-white border border-gray-300 rounded-2xl p-1 w-fit shadow-lg">
        {[
          { id: 'heatmap', label: 'Performance Heatmap', icon: BarChart3 },
          { id: 'burnout', label: 'Burnout Detection', icon: Brain }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === tab.id 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Department Filter */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-300 flex flex-col md:flex-row items-center gap-6 shadow-lg">
        <div className="flex items-center gap-4 flex-1">
          <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-300">
            <LayoutGrid className="h-6 w-6 text-rose-600" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Filter by Department</p>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-transparent text-black font-black text-sm focus:outline-none w-full appearance-none cursor-pointer"
            >
              <option value="all" className="bg-white">All Departments</option>
              <option value="Operations" className="bg-white">Operations</option>
              <option value="HR" className="bg-white">HR</option>
              <option value="Finance" className="bg-white">Finance</option>
            </select>
          </div>
        </div>
        <div className="h-12 w-px bg-gray-300 hidden md:block"></div>
        <div className="flex items-center gap-4 flex-1">
          <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-300">
            <Search className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Quick Search</p>
            <input
              type="text"
              placeholder="Search employee..."
              className="bg-transparent text-black font-black text-lg focus:outline-none w-full placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* PERFORMANCE HEATMAP */}
      {viewMode === 'heatmap' && (
        <div className="bg-white border border-gray-300 rounded-[32px] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Employee</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Department</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Rating</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">KPI Achievement</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Engagement</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Turnover Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((emp) => (
                  <tr key={emp.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-black font-black text-xs">
                          {emp.employee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="font-black text-black text-sm group-hover:text-rose-600 transition-colors">{emp.employee}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-black text-black">{emp.rating}</span>
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        </div>
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-linear-to-r from-rose-500 to-purple-500 rounded-full"
                            style={{ width: `${(emp.rating / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-black text-black">{emp.kpi}%</span>
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"
                            style={{ width: `${Math.min(emp.kpi, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-black text-black">{emp.engagement}%</span>
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${emp.engagement >= 80 ? 'bg-linear-to-r from-blue-500 to-indigo-500' : 'bg-linear-to-r from-amber-500 to-orange-500'}`}
                            style={{ width: `${emp.engagement}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        emp.turnover_risk === 'Low' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-amber-100 text-amber-700 border-amber-300'
                      }`}>
                        {emp.turnover_risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BURNOUT DETECTION */}
      {viewMode === 'burnout' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {burnoutRiskAssessment.map((emp) => (
              <div key={emp.id} className="bg-white p-8 rounded-[32px] border border-gray-300 group hover:border-rose-500/30 transition-all shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gray-100 border border-gray-300 flex items-center justify-center text-black font-black text-lg">
                      {emp.employee.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-black text-lg">{emp.employee}</h4>
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">{emp.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-black ${emp.burnout_score >= 60 ? 'text-rose-600' : emp.burnout_score >= 45 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {emp.burnout_score}
                    </div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Burnout Score</p>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${emp.burnout_score >= 60 ? 'bg-rose-500' : emp.burnout_score >= 45 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(emp.burnout_score, 100)}%` }}
                    />
                  </div>
                </div>
                {emp.factors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {emp.factors.map((factor, idx) => (
                      <span key={idx} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg">
                        {factor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="bg-linear-to-br from-rose-600 to-purple-600 rounded-[32px] p-8 text-white shadow-2xl shadow-rose-600/20">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <Brain className="h-6 w-6" />
                AI Risk Analysis
              </h3>
              <div className="space-y-6">
                <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                  <p className="text-3xl font-black">{burnoutRiskAssessment.filter(e => e.riskLevel === 'Critical').length}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-1">Critical Risk Employees</p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                  <p className="text-3xl font-black">{burnoutRiskAssessment.filter(e => e.riskLevel === 'High').length}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-1">High Risk Employees</p>
                </div>
              </div>
              {!isGeneratingIntervention && !showInterventionPlan ? (
                <button 
                  onClick={handleGenerateInterventionPlan}
                  className="w-full mt-8 py-4 bg-white text-rose-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Generate Intervention Plan
                </button>
              ) : isGeneratingIntervention ? (
                <div className="w-full mt-8 py-4 bg-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating Plan...
                </div>
              ) : (
                <button 
                  onClick={() => setShowInterventionPlan(false)}
                  className="w-full mt-8 py-4 bg-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/30 transition-all"
                >
                  Hide Intervention Plan
                </button>
              )}
            </div>

            {showInterventionPlan && (
              <div className="bg-white border border-gray-300 rounded-[32px] p-8 shadow-lg">
                <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-rose-600" />
                  AI-Generated Intervention Plan
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <h4 className="font-black text-red-800">Critical Priority - Hassan Al-Mazrouei</h4>
                    </div>
                    <div className="space-y-3 text-sm text-red-700">
                      <p><strong>Immediate Actions:</strong> Schedule emergency 1-on-1 meeting within 24 hours</p>
                      <p><strong>Workload Reduction:</strong> Reassign 2 major projects to team members</p>
                      <p><strong>Monitoring:</strong> Daily check-ins for next 2 weeks</p>
                      <p><strong>Expected Outcome:</strong> Burnout score reduction to below 50 within 7 days</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Flame className="h-4 w-4 text-amber-600" />
                      </div>
                      <h4 className="font-black text-amber-800">High Priority - Operations Team</h4>
                    </div>
                    <div className="space-y-3 text-sm text-amber-700">
                      <p><strong>Team Intervention:</strong> Mandatory team-building session this week</p>
                      <p><strong>Workload Audit:</strong> Review and redistribute tasks across department</p>
                      <p><strong>Engagement Survey:</strong> Follow-up survey in 2 weeks to measure improvement</p>
                      <p><strong>Expected Outcome:</strong> Average burnout score reduction by 25% in 30 days</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="font-black text-blue-800">Preventive Measures - All Employees</h4>
                    </div>
                    <div className="space-y-3 text-sm text-blue-700">
                      <p><strong>Wellness Program:</strong> Launch monthly wellness workshops</p>
                      <p><strong>Recognition System:</strong> Implement peer recognition program</p>
                      <p><strong>Flexible Hours:</strong> Introduce flexible working arrangements</p>
                      <p><strong>Expected Outcome:</strong> Overall engagement increase by 15% in 3 months</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Target className="h-4 w-4 text-emerald-600" />
                      </div>
                      <h4 className="font-black text-emerald-800">Success Metrics & Timeline</h4>
                    </div>
                    <div className="space-y-3 text-sm text-emerald-700">
                      <p><strong>Week 1:</strong> Complete critical interventions and initial workload adjustments</p>
                      <p><strong>Week 2:</strong> Monitor progress and adjust strategies as needed</p>
                      <p><strong>Month 1:</strong> Achieve 20% reduction in high-risk burnout scores</p>
                      <p><strong>Month 3:</strong> Implement preventive measures organization-wide</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-300 rounded-[32px] p-8 shadow-lg">
              <h3 className="text-lg font-black text-black mb-6 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-rose-600" />
                Retention Strategy
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-xs font-black text-black uppercase tracking-widest mb-2">Workload Balance</p>
                  <p className="text-xs text-gray-600 leading-relaxed">Redistribute tasks for Operations team to reduce burnout scores.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-xs font-black text-black uppercase tracking-widest mb-2">Engagement Boost</p>
                  <p className="text-xs text-gray-600 leading-relaxed">Schedule 1-on-1 sessions for employees with engagement below 75%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
