'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, FileText, Download, User, Building, Mail, Phone, Eye, Calendar, Globe, CreditCard, Shield, Briefcase, Award, PhoneCall, MapPin, File, AlertCircle } from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

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
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession) {
      router.push('/login/employee');
      return;
    }
    setSession(storedSession);
    
    // ✅ Fetch only the logged-in employee based on session
    if (storedSession.employeeId) {
      fetchLoggedInEmployee(storedSession.employeeId);
    } else {
      // If no employeeId in session, try to find by email
      fetchEmployeeByEmail(storedSession.user.email);
    }
  }, [router]);

  // ✅ Fetch employee by ID (from session.employeeId)
  const fetchLoggedInEmployee = async (employeeId: string) => {
    try {
      setLoading(true);
      console.log('🔍 Fetching employee with ID:', employeeId);
      
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef, where('__name__', '==', employeeId)); // Query by document ID
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const employeeData = {
          id: doc.id,
          ...doc.data()
        } as Employee;
        
        console.log('✅ Employee found:', employeeData.name);
        setEmployee(employeeData);
      } else {
        console.log('❌ No employee found with ID:', employeeId);
        // Fallback to email search
        await fetchEmployeeByEmail(session?.user.email);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fallback: Fetch employee by email
  const fetchEmployeeByEmail = async (email: string | null) => {
    if (!email) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 Fetching employee with email:', email);
      
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const employeeData = {
          id: doc.id,
          ...doc.data()
        } as Employee;
        
        console.log('✅ Employee found by email:', employeeData.name);
        setEmployee(employeeData);
      } else {
        console.log('❌ No employee found with email:', email);
        setEmployee(null);
      }
    } catch (error) {
      console.error('Error fetching employee by email:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEmployeeDetails = () => {
    if (employee) {
      setShowDetailsModal(true);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
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
                <h1 className="text-2xl font-bold text-white">My Salary & Details</h1>
                <p className="text-sm text-slate-400">
                  {employee ? `Welcome, ${employee.name}` : 'Loading your information...'}
                </p>
              </div>
            </div>
            
            {/* Session Info Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-violet-900/30 border border-violet-700 rounded-lg">
              <User className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">
                Logged in as: {session.user.email}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          ) : !employee ? (
            <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
              <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No employee record found for your account</p>
              <p className="text-slate-500 text-sm mt-2">Please contact HR if you believe this is an error</p>
              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg inline-block">
                <p className="text-slate-300 text-sm">Session Email: {session.user.email}</p>
                <p className="text-slate-300 text-sm">Employee ID: {session.employeeId || 'Not linked'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Employee Profile Header */}
              <div className="bg-gradient-to-br from-violet-900/50 to-slate-800 rounded-2xl border border-violet-700/30 p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/20">
                    <span className="text-4xl font-bold text-white">
                      {employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  
                  {/* Employee Info */}
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white">{employee.name}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <span className="flex items-center gap-2 text-slate-300">
                        <Briefcase className="w-4 h-4 text-violet-400" />
                        {employee.position}
                      </span>
                      <span className="flex items-center gap-2 text-slate-300">
                        <Building className="w-4 h-4 text-violet-400" />
                        {employee.department}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'Active' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {employee.status}
                      </span>
                    </div>
                    
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="text-sm text-white truncate">{employee.email}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Phone</p>
                        <p className="text-sm text-white">{employee.phone}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Join Date</p>
                        <p className="text-sm text-white">{formatDate(employee.joinDate)}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Supervisor</p>
                        <p className="text-sm text-white">{employee.supervisor || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={openEmployeeDetails}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-violet-600/20"
                  >
                    <Eye className="w-5 h-5" />
                    View Full Details
                  </button>
                </div>
              </div>

              {/* Salary Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Salary */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Current Salary</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">{formatCurrency(employee.salary)}</p>
                  <p className="text-sm text-slate-400">{employee.salaryStructure}</p>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Monthly Net</span>
                      <span className="text-white font-medium">{formatCurrency(employee.salary)}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Bank Details</h3>
                  </div>
                  <p className="text-white font-medium mb-1">{employee.bankName || 'N/A'}</p>
                  <p className="text-sm text-slate-400 mb-4">Account: {employee.bankAccount || 'N/A'}</p>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Salary Transfer</span>
                      <span className="text-white font-medium">End of Month</span>
                    </div>
                  </div>
                </div>

                {/* Tax & Benefits */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Rating & Performance</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-white">{employee.rating || '0'}</span>
                    <span className="text-sm text-slate-400">/ 5.0</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= Math.round(employee.rating || 0) ? 'text-yellow-400' : 'text-slate-600'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Burnout Risk</span>
                      <span className={`font-medium ${
                        employee.burnoutRisk === 'High' ? 'text-red-400' :
                        employee.burnoutRisk === 'Medium' ? 'text-amber-400' :
                        'text-green-400'
                      }`}>
                        {employee.burnoutRisk || 'Low'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            
            </div>
          )}

          {/* ✅ Employee Details Modal/Popup */}
          {showDetailsModal && employee && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{employee.name}'s Complete Details</h2>
                    <p className="text-slate-400">Employee ID: {employee.id}</p>
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
                        <DetailItem label="Full Name" value={employee.name} />
                        <DetailItem label="Email" value={employee.email} icon={<Mail className="w-4 h-4" />} />
                        <DetailItem label="Phone" value={employee.phone} icon={<Phone className="w-4 h-4" />} />
                        <DetailItem label="Date of Birth" value={formatDate(employee.dateOfBirth)} icon={<Calendar className="w-4 h-4" />} />
                        <DetailItem label="Nationality" value={employee.nationality} icon={<Globe className="w-4 h-4" />} />
                      </div>
                    </div>

                    {/* Employment Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-violet-400" />
                        Employment Details
                      </h3>
                      <div className="space-y-3">
                        <DetailItem label="Department" value={employee.department} />
                        <DetailItem label="Position" value={employee.position} />
                        <DetailItem label="Role" value={employee.role} />
                        <DetailItem label="Join Date" value={formatDate(employee.joinDate)} icon={<Calendar className="w-4 h-4" />} />
                        <DetailItem label="Supervisor" value={employee.supervisor} />
                        <DetailItem label="Rating" value={employee.rating?.toString()} icon={<Award className="w-4 h-4" />} />
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
                        <DetailItem label="Salary" value={formatCurrency(employee.salary)} />
                        <DetailItem label="Salary Structure" value={employee.salaryStructure} />
                        <DetailItem label="Bank Name" value={employee.bankName} />
                        <DetailItem label="Bank Account" value={employee.bankAccount} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-violet-400" />
                        Legal Documents
                      </h3>
                      <div className="space-y-3">
                        <DetailItem label="Emirates ID" value={employee.emiratesIdNumber} />
                        <DetailItem label="Passport Number" value={employee.passportNumber} />
                        <DetailItem label="Visa Number" value={employee.visaNumber} />
                        <DetailItem label="Visa Expiry" value={formatDate(employee.visaExpiryDate)} icon={<Calendar className="w-4 h-4" />} />
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
                        <DetailItem label="Contact Person" value={employee.emergencyContact} />
                        <DetailItem label="Phone" value={employee.emergencyPhone} />
                        <DetailItem label="Relation" value={employee.emergencyRelation || 'N/A'} />
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
                            employee.status === 'Active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {employee.status}
                          </span>
                        </div>
                        <DetailItem label="Burnout Risk" value={employee.burnoutRisk} />
                        <DetailItem label="Last Updated" value={formatDate(employee.lastUpdated)} />
                        <DetailItem label="Created At" value={formatDate(employee.createdAt)} />
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  {employee.documents && employee.documents.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <File className="w-5 h-5 text-violet-400" />
                        Uploaded Documents
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {employee.documents.map((doc, index) => (
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