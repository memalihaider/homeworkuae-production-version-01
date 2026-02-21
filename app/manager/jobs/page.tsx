'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ManagerSidebar } from '../_components/sidebar';
import { Briefcase, Search, Filter, Calendar, MapPin, DollarSign, Users, TrendingUp, Menu, X } from 'lucide-react';

// Define SessionData type to match ManagerSidebar expectations
type SessionData = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  roleId: string;
  roleName: string;
  portal: 'manager' | 'guest' | 'employee' | 'supervisor';
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

// Temporary function to replace getStoredSession
const getSessionData = (): SessionData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const sessionStr = localStorage.getItem('session');
    if (!sessionStr) return null;
    
    const storedSession = JSON.parse(sessionStr);
    if (!storedSession) return null;
    
    // Transform stored session to SessionData format
    return {
      id: storedSession.id || `sess_${Date.now()}`,
      userId: storedSession.userId || storedSession.user?.uid || 'unknown',
      userName: storedSession.userName || storedSession.user?.name || 'Manager',
      email: storedSession.email || storedSession.user?.email || '',
      role: storedSession.role || 'manager',
      roleId: storedSession.roleId || 'role_manager',
      roleName: storedSession.roleName || storedSession.role || 'Manager',
      portal: 'manager',
      permissions: storedSession.permissions || ['view_dashboard', 'view_jobs'],
      department: storedSession.department || 'Management',
      loginTime: storedSession.loginTime || new Date().toISOString(),
      expiresAt: storedSession.expiresAt || new Date(Date.now() + 3600000).toISOString(),
      user: storedSession.user || {
        uid: storedSession.userId || 'unknown',
        email: storedSession.email || null,
        name: storedSession.userName || null
      },
      allowedPages: storedSession.allowedPages || ['/manager/dashboard', '/manager/jobs']
    };
  } catch {
    return null;
  }
};

const jobs = [
  { id: 'JOB-2024-001', client: 'Al Futtaim Group', title: 'Office Renovation', location: 'Dubai', status: 'In Progress', progress: 65, budget: 150000, spent: 97500, startDate: '2024-01-15', dueDate: '2024-02-15', teamSize: 4, priority: 'high' },
  { id: 'JOB-2024-002', client: 'Emirates NBD', title: 'Branch Maintenance', location: 'Abu Dhabi', status: 'In Progress', progress: 40, budget: 80000, spent: 32000, startDate: '2024-01-25', dueDate: '2024-02-20', teamSize: 3, priority: 'medium' },
  { id: 'JOB-2024-003', client: 'ADNOC', title: 'Facility Upgrade', location: 'Ruwais', status: 'Planning', progress: 15, budget: 250000, spent: 37500, startDate: '2024-02-01', dueDate: '2024-03-01', teamSize: 5, priority: 'high' },
  { id: 'JOB-2024-004', client: 'Emaar Properties', title: 'HVAC Installation', location: 'Downtown Dubai', status: 'In Progress', progress: 80, budget: 120000, spent: 96000, startDate: '2024-01-01', dueDate: '2024-02-10', teamSize: 2, priority: 'medium' },
  { id: 'JOB-2024-005', client: 'Etihad Airways', title: 'Terminal Renovation', location: 'Abu Dhabi', status: 'Completed', progress: 100, budget: 500000, spent: 498000, startDate: '2023-11-01', dueDate: '2024-01-20', teamSize: 8, priority: 'high' },
];

const statusColors = {
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Planning': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'On Hold': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function Jobs() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);

  useEffect(() => {
    const sessionData = getSessionData();
    if (!sessionData || sessionData.portal !== 'manager') {
      router.push('/login/manager');
      return;
    }
    setSession(sessionData);
  }, [router]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const totalBudget = jobs.reduce((sum, j) => sum + j.budget, 0);
  const totalSpent = jobs.reduce((sum, j) => sum + j.spent, 0);
  const completedJobs = jobs.filter(j => j.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-900 flex">
    

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Jobs Management</h1>
            <p className="text-sm text-slate-400 mt-1">Track and manage all projects</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Jobs</p>
                  <p className="text-2xl font-bold text-white mt-1">{jobs.filter(j => j.status !== 'Completed').length}</p>
                </div>
                <Briefcase className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-white mt-1">{completedJobs}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Budget</p>
                  <p className="text-2xl font-bold text-white mt-1">AED {(totalBudget / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="w-10 h-10 text-indigo-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Spent</p>
                  <p className="text-2xl font-bold text-white mt-1">AED {(totalSpent / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="w-10 h-10 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'In Progress', 'Planning', 'Completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-indigo-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white">{job.title}</h3>
                    <p className="text-sm text-slate-400">{job.client}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[job.status as keyof typeof statusColors] || 'bg-slate-700'}`}>
                    {job.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-sm">
                    <p className="text-slate-400">Location</p>
                    <p className="text-white flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-400">Due Date</p>
                    <p className="text-white">{new Date(job.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-400">Team Size</p>
                    <p className="text-white flex items-center gap-1"><Users className="w-4 h-4" />{job.teamSize}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-400">Budget Used</p>
                    <p className="text-white">{Math.round((job.spent / job.budget) * 100)}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-xs text-slate-300">{job.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full transition-all"
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full border border-slate-700 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedJob.title}</h2>
                <p className="text-sm text-slate-400">{selectedJob.client}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-white font-medium">{selectedJob.status}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Priority</p>
                <p className="text-white font-medium capitalize">{selectedJob.priority}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Location</p>
                <p className="text-white">{selectedJob.location}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Team Size</p>
                <p className="text-white">{selectedJob.teamSize} members</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Start Date</p>
                <p className="text-white">{new Date(selectedJob.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Due Date</p>
                <p className="text-white">{new Date(selectedJob.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-slate-400 text-sm mb-2">Progress</p>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full transition-all"
                  style={{ width: `${selectedJob.progress}%` }}
                ></div>
              </div>
              <p className="text-white font-semibold">{selectedJob.progress}% Complete</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-700/50 rounded-lg mb-6">
              <div>
                <p className="text-slate-400 text-sm">Budget</p>
                <p className="text-white font-bold">AED {selectedJob.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Spent</p>
                <p className="text-orange-400 font-bold">AED {selectedJob.spent.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedJob(null)}
                className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => setSelectedJob(null)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}