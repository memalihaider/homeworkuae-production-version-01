'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ManagerSidebar } from '../_components/sidebar';
import { CheckCircle, Clock, AlertCircle, Menu, X, Calendar, DollarSign, User } from 'lucide-react';

// Temporary function to replace getStoredSession
const getSessionData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

// Define SessionData type to match ManagerSidebar expectations
type SessionData = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  roleId: string;
  roleName: string;
  portal: 'manager' | 'guest' | 'employee';
  permissions: string[];
  department: string;
  loginTime: string;
  expiresAt: string;
  user: {
    uid: string;
    email: string | null;
    name: string | null;
  };
  allowedPages: string[];
};

const approvals = [
  { id: 'APR-001', type: 'Leave Request', requester: 'Ahmed Hassan', requestDate: '2024-01-28', details: '3 days annual leave', status: 'pending', amount: null },
  { id: 'APR-002', type: 'Expense Claim', requester: 'Sara Al Maktoum', requestDate: '2024-01-29', details: 'AED 450 - Transportation', status: 'pending', amount: 450 },
  { id: 'APR-003', type: 'Overtime Request', requester: 'Mohammed Ali', requestDate: '2024-01-30', details: '4 hours overtime', status: 'pending', amount: null },
  { id: 'APR-004', type: 'Material Request', requester: 'Omar Rashid', requestDate: '2024-01-30', details: 'HVAC spare parts', status: 'approved', amount: 2500 },
  { id: 'APR-005', type: 'Leave Request', requester: 'Fatima Khalid', requestDate: '2024-01-30', details: 'Sick leave extension', status: 'rejected', amount: null },
];

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function Approvals() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<typeof approvals[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    const storedSession = getSessionData();
    if (!storedSession || storedSession.portal !== 'manager') {
      router.push('/login/manager');
      return;
    }
    
    // Transform stored session to SessionData format
    const sessionData: SessionData = {
      id: storedSession.id || `sess_${Date.now()}`,
      userId: storedSession.userId || storedSession.user?.uid || 'unknown',
      userName: storedSession.userName || storedSession.user?.name || 'Manager',
      email: storedSession.email || storedSession.user?.email || '',
      role: storedSession.role || 'manager',
      roleId: storedSession.roleId || 'role_manager',
      roleName: storedSession.roleName || storedSession.role || 'Manager',
      portal: 'manager',
      permissions: storedSession.permissions || ['view_dashboard', 'view_approvals'],
      department: storedSession.department || 'Management',
      loginTime: storedSession.loginTime || new Date().toISOString(),
      expiresAt: storedSession.expiresAt || new Date(Date.now() + 3600000).toISOString(),
      user: storedSession.user || {
        uid: storedSession.userId || 'unknown',
        email: storedSession.email || null,
        name: storedSession.userName || null
      },
      allowedPages: storedSession.allowedPages || ['/manager/dashboard', '/manager/approvals']
    };
    
    setSession(sessionData);
  }, [router]);

  const filteredApprovals = approvals.filter(a => filterStatus === 'all' || a.status === filterStatus);

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const stats = {
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <ManagerSidebar session={session} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Approvals Workflow</h1>
            <p className="text-sm text-slate-400 mt-1">Review and manage pending approvals</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-700 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Approved</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.approved}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Rejected</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.rejected}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Approvals List */}
          <div className="space-y-4">
            {filteredApprovals.map(approval => (
              <div
                key={approval.id}
                onClick={() => setSelectedApproval(approval)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-indigo-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{approval.type}</h3>
                    <p className="text-sm text-slate-400">From: {approval.requester}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[approval.status as keyof typeof statusColors]}`}>
                    {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-sm">
                    <p className="text-slate-400">Requested</p>
                    <p className="text-white">{new Date(approval.requestDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-400">Type</p>
                    <p className="text-white">{approval.type}</p>
                  </div>
                  {approval.amount && (
                    <div className="text-sm">
                      <p className="text-slate-400">Amount</p>
                      <p className="text-white">AED {approval.amount.toLocaleString()}</p>
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="text-slate-400">Details</p>
                    <p className="text-white truncate">{approval.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg max-w-md w-full border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedApproval.type}</h2>
                <p className="text-sm text-slate-400">Request ID: {selectedApproval.id}</p>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm mb-6">
              <div>
                <p className="text-slate-400">Requester</p>
                <p className="text-white flex items-center gap-2"><User className="w-4 h-4" />{selectedApproval.requester}</p>
              </div>
              <div>
                <p className="text-slate-400">Request Date</p>
                <p className="text-white flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(selectedApproval.requestDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedApproval.status as keyof typeof statusColors]}`}>
                    {selectedApproval.status.charAt(0).toUpperCase() + selectedApproval.status.slice(1)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-slate-400">Details</p>
                <p className="text-white">{selectedApproval.details}</p>
              </div>
              {selectedApproval.amount && (
                <div>
                  <p className="text-slate-400">Amount</p>
                  <p className="text-white flex items-center gap-2"><DollarSign className="w-4 h-4" />AED {selectedApproval.amount.toLocaleString()}</p>
                </div>
              )}
            </div>

            {selectedApproval.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Reject
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedApproval(null)}
              className={`w-full px-4 py-2 mt-2 rounded-lg font-medium transition-colors ${
                selectedApproval.status === 'pending'
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}