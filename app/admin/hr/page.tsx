'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Award,
  Filter,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Briefcase,
  BarChart3,
  Navigation
} from 'lucide-react'
import { MOCK_EMPLOYEES, MOCK_ATTENDANCE, MOCK_SHIFTS, getEmployeeStats, Employee, Attendance } from '@/lib/hr-data'

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES)
  const [attendance, setAttendance] = useState<Attendance[]>(MOCK_ATTENDANCE)

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDept = filterDepartment === 'all' || emp.department === filterDepartment
      const matchesStatus = filterStatus === 'all' || emp.status === filterStatus
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [employees, searchTerm, filterDepartment, filterStatus])

  // Today's attendance
  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = attendance.filter(a => a.date === today)
  const presentCount = todayAttendance.filter(a => ['Present', 'On Job'].includes(a.status)).length
  const absentCount = todayAttendance.filter(a => a.status === 'Absent').length
  const onJobCount = todayAttendance.filter(a => a.status === 'On Job').length
  const lateCount = todayAttendance.filter(a => a.status === 'Late').length

  // Statistics
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'Active').length
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary.total, 0)
  const avgRating = (employees.reduce((sum, e) => sum + e.rating, 0) / employees.length).toFixed(1)
  const totalOvertime = attendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0)

  // Department breakdown
  const departments = useMemo(() => {
    const depts: Record<string, number> = {}
    employees.forEach(emp => {
      depts[emp.department] = (depts[emp.department] || 0) + 1
    })
    return depts
  }, [employees])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">HR Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Unified HR system with real-time attendance and job assignments
          </p>
        </div>
        <Link href="/admin/hr/attendance">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Clock className="h-4 w-4" />
            Mark Attendance
          </button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Total Staff</p>
              <p className="text-2xl font-black text-foreground mt-1">{totalEmployees}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Present Today</p>
              <p className="text-2xl font-black text-green-600 mt-1">{presentCount}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">On Job</p>
              <p className="text-2xl font-black text-purple-600 mt-1">{onJobCount}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Absent</p>
              <p className="text-2xl font-black text-red-600 mt-1">{absentCount}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Payroll</p>
              <p className="text-lg font-black text-green-700 mt-1">AED {totalPayroll.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'employees', label: 'Employees', icon: Users },
            { id: 'attendance', label: 'Today\'s Attendance', icon: Clock },
            { id: 'jobs', label: 'Job Assignments', icon: Briefcase }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="text-sm font-black mb-4">Department Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(departments).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{dept}</span>
                    <span className="font-black">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6">
              <h3 className="text-sm font-black mb-4">Today's Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Present</span>
                  <span className="font-black text-green-600">{presentCount}/{totalEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">On Job</span>
                  <span className="font-black text-purple-600">{onJobCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Late</span>
                  <span className="font-black text-amber-600">{lateCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Absent</span>
                  <span className="font-black text-red-600">{absentCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6">
              <h3 className="text-sm font-black mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Rating</span>
                  <span className="font-black text-yellow-600">{avgRating}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Staff</span>
                  <span className="font-black text-green-600">{activeEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Overtime</span>
                  <span className="font-black">{totalOvertime.toFixed(1)}h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="text-sm font-black mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/admin/hr/employee-directory">
                <button className="w-full p-4 bg-muted/50 hover:bg-muted rounded-xl border transition-all flex flex-col items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-bold">Employee Directory</span>
                </button>
              </Link>
              <Link href="/admin/hr/attendance">
                <button className="w-full p-4 bg-muted/50 hover:bg-muted rounded-xl border transition-all flex flex-col items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-xs font-bold">Attendance</span>
                </button>
              </Link>
              <Link href="/admin/hr/payroll">
                <button className="w-full p-4 bg-muted/50 hover:bg-muted rounded-xl border transition-all flex flex-col items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-xs font-bold">Payroll</span>
                </button>
              </Link>
              <Link href="/admin/jobs">
                <button className="w-full p-4 bg-muted/50 hover:bg-muted rounded-xl border transition-all flex flex-col items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <span className="text-xs font-bold">Job Management</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Departments</option>
              {Object.keys(departments).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          {/* Employees List */}
          <div className="space-y-3">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(emp => (
                <div key={emp.id} className="bg-card border rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center font-black text-blue-600">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.position} • {emp.department}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{emp.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{emp.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Rating: {emp.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">AED {emp.salary.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {emp.status}
                      </span>
                      <Link href={`/admin/hr/employee-directory?id=${emp.id}`}>
                        <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">No employees found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Today's Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {todayAttendance.length > 0 ? (
            todayAttendance.map(att => (
              <div key={att.id} className="bg-card border rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        att.status === 'Present' ? 'bg-green-600' :
                        att.status === 'On Job' ? 'bg-purple-600' :
                        att.status === 'Late' ? 'bg-amber-600' : 'bg-red-600'
                      }`} />
                      <p className="font-black">{att.employeeName}</p>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        att.status === 'Present' ? 'bg-green-100 text-green-700' :
                        att.status === 'On Job' ? 'bg-purple-100 text-purple-700' :
                        att.status === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {att.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Shift</p>
                        <p className="font-bold">{att.shift}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Clock In</p>
                        <p className="font-bold">{att.clockIn || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Clock Out</p>
                        <p className="font-bold">{att.clockOut || '—'}</p>
                      </div>
                      {att.jobTitle && (
                        <div>
                          <p className="text-xs text-muted-foreground">Job</p>
                          <p className="font-bold text-purple-600">{att.jobTitle}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground">No attendance records for today</p>
            </div>
          )}
        </div>
      )}

      {/* Job Assignments Tab */}
      {activeTab === 'jobs' && (
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="text-sm font-black mb-4">Active Job Assignments</h3>
          <div className="space-y-3">
            {todayAttendance
              .filter(a => a.jobId)
              .map(att => (
                <div key={att.id} className="p-3 bg-muted/50 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-bold">{att.employeeName}</p>
                    <p className="text-sm text-muted-foreground">{att.jobTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Clock In: {att.clockIn}</p>
                    {att.clockOut && <p className="text-xs text-muted-foreground">Clock Out: {att.clockOut}</p>}
                  </div>
                </div>
              ))}
            {todayAttendance.filter(a => a.jobId).length === 0 && (
              <p className="text-muted-foreground text-sm">No active job assignments</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
