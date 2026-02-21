'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Briefcase,
  Star,
  Shield,
  Download,
  Eye,
  Edit,
  MoreVertical,
  Filter,
  X,
  Heart
} from 'lucide-react'
import { MOCK_EMPLOYEES, MOCK_ATTENDANCE, Employee } from '@/lib/hr-data'

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPosition, setFilterPosition] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const [employees] = useState<Employee[]>(MOCK_EMPLOYEES)

  // Get unique values for filters
  const departments = useMemo(() => {
    return [...new Set(employees.map(e => e.department))]
  }, [employees])

  const positions = useMemo(() => {
    return [...new Set(employees.map(e => e.position))]
  }, [employees])

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm)
      const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment
      const matchesStatus = filterStatus === 'all' || emp.status === filterStatus
      const matchesPosition = filterPosition === 'all' || emp.position === filterPosition

      return matchesSearch && matchesDepartment && matchesStatus && matchesPosition
    })
  }, [employees, searchTerm, filterDepartment, filterStatus, filterPosition])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter(e => e.status === 'Active').length,
      onLeave: employees.filter(e => e.status === 'On Leave').length,
      inactive: employees.filter(e => e.status === 'Inactive').length,
      avgRating: (employees.reduce((sum, e) => sum + e.rating, 0) / employees.length).toFixed(1)
    }
  }, [employees])

  // Get employee attendance history
  const getEmployeeAttendance = (employeeId: string) => {
    return MOCK_ATTENDANCE.filter(a => a.employeeId === employeeId)
  }

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowDetails(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black">Employee Directory</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage employee profiles, contacts, documents, and visa information
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">Total</p>
          <p className="text-2xl font-black text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">Active</p>
          <p className="text-2xl font-black text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">On Leave</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.onLeave}</p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">Inactive</p>
          <p className="text-2xl font-black text-red-600 mt-1">{stats.inactive}</p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">Avg Rating</p>
          <p className="text-2xl font-black text-yellow-600 mt-1">{stats.avgRating}⭐</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border rounded-2xl p-4 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-muted/50 border rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-muted/50 border rounded-lg text-sm"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-3 py-2 bg-muted/50 border rounded-lg text-sm"
          >
            <option value="all">All Positions</option>
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterDepartment('all')
              setFilterStatus('all')
              setFilterPosition('all')
            }}
            className="px-3 py-2 bg-muted/50 border rounded-lg text-sm font-bold hover:bg-muted transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              {/* Profile Section */}
              <div className="p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                <div className="flex items-start gap-3 mb-3">
                  {employee.profileImage ? (
                    <img
                      src={employee.profileImage}
                      alt={employee.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {employee.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-black">{employee.name}</h3>
                    <p className="text-xs text-muted-foreground">{employee.position}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{employee.rating}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${
                  employee.status === 'Active' ? 'bg-green-100 text-green-700' :
                  employee.status === 'On Leave' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {employee.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="p-4 space-y-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">{employee.location}</span>
                </div>
              </div>

              {/* Salary Info */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base Salary</span>
                  <span className="font-black">AED {employee.salary.basic.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Total Package</span>
                  <span className="font-black text-green-600">AED {employee.salary.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleViewDetails(employee)}
                className="w-full px-4 py-3 border-t font-bold text-sm text-blue-600 hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredEmployees.map(employee => {
            const attendance = getEmployeeAttendance(employee.id)
            const presentDays = attendance.filter(a => a.status === 'Present').length
            const onJobDays = attendance.filter(a => a.status === 'On Job').length

            return (
              <div key={employee.id} className="bg-card border rounded-2xl p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {employee.profileImage ? (
                      <img
                        src={employee.profileImage}
                        alt={employee.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {employee.name.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-black">{employee.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {employee.position} • {employee.department}
                      </p>
                    </div>

                    <div className="hidden md:grid grid-cols-4 gap-4 text-sm flex-1">
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-bold text-xs truncate">{employee.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-bold text-xs">{employee.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Attendance</p>
                        <p className="font-bold text-xs">{presentDays}P / {onJobDays}J</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <p className="font-bold text-xs">{employee.rating}⭐</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-700' :
                      employee.status === 'On Leave' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {employee.status}
                    </span>
                    <button
                      onClick={() => handleViewDetails(employee)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="bg-card border rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No employees found matching your filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetails && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b">
              <h2 className="text-2xl font-black">Employee Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-bold">{selectedEmployee.name}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-bold text-sm">{selectedEmployee.email}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-bold">{selectedEmployee.phone}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="font-bold">{selectedEmployee.dateOfBirth}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Nationality</p>
                    <p className="font-bold">{selectedEmployee.nationalityCountry}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-bold">{selectedEmployee.location}</p>
                  </div>
                </div>
              </div>

              {/* Work Info */}
              <div>
                <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Work Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Position</p>
                    <p className="font-bold">{selectedEmployee.position}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="font-bold">{selectedEmployee.department}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="font-bold">{selectedEmployee.role}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      selectedEmployee.status === 'Active' ? 'bg-green-100 text-green-700' :
                      selectedEmployee.status === 'On Leave' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Join Date</p>
                    <p className="font-bold">{selectedEmployee.joinDate}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="font-bold flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {selectedEmployee.rating}
                    </p>
                  </div>
                </div>
              </div>

              {/* Salary */}
              <div>
                <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Salary Package
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-100/50 rounded-lg p-4 border-2 border-green-600">
                    <p className="text-xs text-green-700 font-bold uppercase">Base Salary</p>
                    <p className="text-xl font-black text-green-700">AED {selectedEmployee.salary.basic.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100/50 rounded-lg p-4 border-2 border-blue-600">
                    <p className="text-xs text-blue-700 font-bold uppercase">Housing</p>
                    <p className="text-xl font-black text-blue-700">AED {selectedEmployee.salary.housing.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-100/50 rounded-lg p-4 border-2 border-purple-600">
                    <p className="text-xs text-purple-700 font-bold uppercase">Total</p>
                    <p className="text-xl font-black text-purple-700">AED {selectedEmployee.salary.total.toLocaleString()}</p>
                  </div>
                </div>
                {selectedEmployee.salary.allowances && selectedEmployee.salary.allowances.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Allowances</p>
                    {selectedEmployee.salary.allowances.map((allowance, idx) => (
                      <div key={idx} className="flex justify-between text-sm bg-muted/50 rounded-lg p-2 px-3">
                        <span>{allowance.name}</span>
                        <span className="font-bold">AED {allowance.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Documents & Visa */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Documents
                  </h3>
                  {selectedEmployee.documents && selectedEmployee.documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedEmployee.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                          <span className="text-sm">{doc.name}</span>
                          <button className="p-1.5 hover:bg-muted rounded text-orange-600">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No documents</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Visa Details
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Passport Number</p>
                      <p className="font-bold text-sm">{selectedEmployee.passportNumber}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Emirates ID</p>
                      <p className="font-bold text-sm">{selectedEmployee.emiratesIdNumber}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Visa Type</p>
                      <p className="font-bold text-sm">{selectedEmployee.visa?.type || 'N/A'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Visa Expiry</p>
                      <p className="font-bold text-sm">{selectedEmployee.visa?.expiryDate || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div>
                <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Emergency Contacts
                </h3>
                {selectedEmployee.emergencyContacts && selectedEmployee.emergencyContacts.length > 0 ? (
                  <div className="space-y-2">
                    {selectedEmployee.emergencyContacts.map((contact, idx) => (
                      <div key={idx} className="bg-muted/50 rounded-lg p-3">
                        <p className="font-bold text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                        <p className="text-xs font-bold mt-1">{contact.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No emergency contacts</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
