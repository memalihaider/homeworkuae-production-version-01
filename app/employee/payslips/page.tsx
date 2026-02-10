'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, FileText, Download, User, Building, Mail, Phone, Eye, Calendar, Globe, CreditCard, Shield, Briefcase, Award, PhoneCall, MapPin, File } from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Employee {
  id: string;
  bankAccount: string;
  bankName: string;
  burnoutRisk: string;
  createdAt: string;
  dateOfBirth: string;
  department: string;
  documents: Array<any>;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  emiratesIdNumber: string;
  joinDate: string;
  lastUpdated: string;
  name: string;
  nationality: string;
  passportNumber: string;
  phone: string;
  position: string;
  rating: number;
  role: string;
  salary: number;
  salaryStructure: string;
  status: string;
  supervisor: string;
  team: Array<any>;
  visaExpiryDate: string;
  visaNumber: string;
}

export default function EmployeePayslipsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession) {
      router.push('/login/employee');
      return;
    }
    setSession(storedSession);
    fetchAllEmployees();
  }, [router]);

  const fetchAllEmployees = async () => {
    try {
      setLoading(true);
      const employeesRef = collection(db, 'employees');
      const querySnapshot = await getDocs(employeesRef);
      
      const employeesData: Employee[] = [];
      querySnapshot.forEach((doc) => {
        employeesData.push({
          id: doc.id,
          ...doc.data()
        } as Employee);
      });
      
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <EmployeeSidebar session={session} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur border-b border-slate-700">
          <div className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-700 rounded-lg">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">All Employees</h1>
                <p className="text-sm text-slate-400">Total employees: {employees.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12 bg-slate-800 rounded-xl">
              <p className="text-slate-400 text-lg">No employees found in database</p>
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700/50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-300">Employee</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-300">Department</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-300">Position</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-300">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-300">Salary</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-300">Contact</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{employee.name}</p>
                              <p className="text-sm text-slate-400">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-slate-400" />
                            <span className="text-white">{employee.department}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white">{employee.position}</span>
                          <p className="text-sm text-slate-400">{employee.role}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            employee.status === 'Active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-white font-medium">AED {employee.salary?.toLocaleString() || '0'}</p>
                            <p className="text-sm text-slate-400">{employee.salaryStructure}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-white truncate max-w-[150px]">{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-400">{employee.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => openEmployeeDetails(employee)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                            title="View Full Details"
                          >
                            <Eye className="w-5 h-5 text-slate-400 group-hover:text-violet-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ✅ Employee Details Modal/Popup */}
          {showDetailsModal && selectedEmployee && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedEmployee.name}'s Complete Details</h2>
                    <p className="text-slate-400">Employee ID: {selectedEmployee.id}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-slate-700 rounded-lg"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-violet-400" />
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <DetailItem label="Full Name" value={selectedEmployee.name} />
                        <DetailItem label="Email" value={selectedEmployee.email} icon={<Mail className="w-4 h-4" />} />
                        <DetailItem label="Phone" value={selectedEmployee.phone} icon={<Phone className="w-4 h-4" />} />
                        <DetailItem label="Date of Birth" value={formatDate(selectedEmployee.dateOfBirth)} icon={<Calendar className="w-4 h-4" />} />
                        <DetailItem label="Nationality" value={selectedEmployee.nationality} icon={<Globe className="w-4 h-4" />} />
                      </div>
                    </div>

                    {/* Employment Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-violet-400" />
                        Employment Details
                      </h3>
                      <div className="space-y-3">
                        <DetailItem label="Department" value={selectedEmployee.department} />
                        <DetailItem label="Position" value={selectedEmployee.position} />
                        <DetailItem label="Role" value={selectedEmployee.role} />
                        <DetailItem label="Join Date" value={formatDate(selectedEmployee.joinDate)} icon={<Calendar className="w-4 h-4" />} />
                        <DetailItem label="Supervisor" value={selectedEmployee.supervisor} />
                        <DetailItem label="Rating" value={selectedEmployee.rating?.toString()} icon={<Award className="w-4 h-4" />} />
                      </div>
                    </div>
                  </div>

                  {/* Financial & Legal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-violet-400" />
                        Financial Information
                      </h3>
                      <div className="space-y-3">
                        <DetailItem label="Salary" value={`AED ${selectedEmployee.salary?.toLocaleString()}`} />
                        <DetailItem label="Salary Structure" value={selectedEmployee.salaryStructure} />
                        <DetailItem label="Bank Name" value={selectedEmployee.bankName} />
                        <DetailItem label="Bank Account" value={selectedEmployee.bankAccount} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-violet-400" />
                        Legal Documents
                      </h3>
                      <div className="space-y-3">
                        <DetailItem label="Emirates ID" value={selectedEmployee.emiratesIdNumber} />
                        <DetailItem label="Passport Number" value={selectedEmployee.passportNumber} />
                        <DetailItem label="Visa Number" value={selectedEmployee.visaNumber} />
                        <DetailItem label="Visa Expiry" value={formatDate(selectedEmployee.visaExpiryDate)} icon={<Calendar className="w-4 h-4" />} />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <PhoneCall className="w-5 h-5 text-violet-400" />
                        Emergency Contact
                      </h3>
                      <div className="space-y-3">
                        <DetailItem label="Contact Person" value={selectedEmployee.emergencyContact} />
                        <DetailItem label="Phone" value={selectedEmployee.emergencyPhone} />
                        <DetailItem label="Relation" value={selectedEmployee.emergencyRelation || 'N/A'} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-violet-400" />
                        Status & Other Info
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Status</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedEmployee.status === 'Active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {selectedEmployee.status}
                          </span>
                        </div>
                        <DetailItem label="Burnout Risk" value={selectedEmployee.burnoutRisk} />
                        <DetailItem label="Last Updated" value={formatDate(selectedEmployee.lastUpdated)} />
                        <DetailItem label="Created At" value={formatDate(selectedEmployee.createdAt)} />
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  {selectedEmployee.documents && selectedEmployee.documents.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <File className="w-5 h-5 text-violet-400" />
                        Uploaded Documents
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedEmployee.documents.map((doc, index) => (
                          <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                            <p className="text-white font-medium">{doc.name}</p>
                            <p className="text-sm text-slate-400 truncate">{doc.fileName}</p>
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                              <span>Uploaded: {doc.uploadDate}</span>
                              <span>Valid until: {doc.validDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ✅ Helper Component for Detail Items
function DetailItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
      <span className="text-slate-400 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-white font-medium">{value || 'N/A'}</span>
    </div>
  );
}