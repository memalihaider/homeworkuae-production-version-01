'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ManagerSidebar } from '../_components/sidebar';
import { BarChart3, TrendingUp, Users, Clock, DollarSign, CheckCircle, Menu, X } from 'lucide-react';

// Temporary function to replace getStoredSession
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
      permissions: storedSession.permissions || ['view_dashboard', 'view_reports'],
      department: storedSession.department || 'Management',
      loginTime: storedSession.loginTime || new Date().toISOString(),
      expiresAt: storedSession.expiresAt || new Date(Date.now() + 3600000).toISOString(),
      user: storedSession.user || {
        uid: storedSession.userId || 'unknown',
        email: storedSession.email || null,
        name: storedSession.userName || null
      },
      allowedPages: storedSession.allowedPages || ['/manager/dashboard', '/manager/reports']
    };
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

type UserSession = {
  id: string;
  name: string;
  email: string;
  role: string;
  portal: 'manager' | 'guest' | 'employee' | 'supervisor';
};

const reports = [
  { id: '1', title: 'Team Performance', period: 'January 2024', completionRate: 87, teamProductivity: 92, avgTaskTime: 4.5 },
  { id: '2', title: 'Project Status', period: 'January 2024', onTime: 4, delayed: 0, completed: 1 },
  { id: '3', title: 'Financial Summary', period: 'January 2024', totalRevenue: 762000, totalCost: 262500, margin: 65.6 },
  { id: '4', title: 'Resource Utilization', period: 'January 2024', utilizationRate: 89, avgHoursPerEmployee: 162, efficiency: 94 },
];

export default function Reports() {
  const router = useRouter();
 
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);
useEffect(() => {
  const sessionData = getSessionData();
  if (!sessionData || sessionData.portal !== 'manager') {
    router.push('/login/manager');
    return;
  }
  setSession(sessionData);
}, [router]);

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
     

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
            <p className="text-sm text-slate-400 mt-1">Monitor performance metrics and insights</p>
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Completion Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">87%</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Team Productivity</p>
                  <p className="text-2xl font-bold text-white mt-1">92%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-indigo-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Profit Margin</p>
                  <p className="text-2xl font-bold text-white mt-1">65.6%</p>
                </div>
                <DollarSign className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Utilization</p>
                  <p className="text-2xl font-bold text-white mt-1">89%</p>
                </div>
                <Users className="w-10 h-10 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(report => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{report.title}</h3>
                    <p className="text-sm text-slate-400">{report.period}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-indigo-400" />
                </div>

                {'completionRate' in report && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">Completion Rate</span>
                        <span className="text-sm font-medium text-white">{report.completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${report.completionRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {'utilizationRate' in report && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-400">Utilization Rate</span>
                        <span className="text-sm font-medium text-white">{report.utilizationRate}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: `${report.utilizationRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {'totalRevenue' in report && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Revenue</span>
                      <span className="text-green-400 font-semibold">AED {(report.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Cost</span>
                      <span className="text-orange-400 font-semibold">AED {(report.totalCost || 0).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full border border-slate-700 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedReport.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{selectedReport.period}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {'completionRate' in selectedReport && (
                <>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Completion Rate</p>
                    <p className="text-2xl font-bold text-white mt-2">{selectedReport.completionRate}%</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Team Productivity</p>
                    <p className="text-2xl font-bold text-white mt-2">{selectedReport.teamProductivity}%</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Avg Task Time</p>
                    <p className="text-2xl font-bold text-white mt-2">{selectedReport.avgTaskTime} hrs</p>
                  </div>
                </>
              )}

              {'utilizationRate' in selectedReport && (
                <>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Utilization Rate</p>
                    <p className="text-2xl font-bold text-white mt-2">{selectedReport.utilizationRate}%</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Avg Hours/Employee</p>
                    <p className="text-2xl font-bold text-white mt-2">{selectedReport.avgHoursPerEmployee}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Efficiency</p>
                    <p className="text-2xl font-bold text-white mt-2">{selectedReport.efficiency}%</p>
                  </div>
                </>
              )}

              {'totalRevenue' in selectedReport && (
                <>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-400 mt-2">AED {(selectedReport.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Total Cost</p>
                    <p className="text-2xl font-bold text-orange-400 mt-2">AED {(selectedReport.totalCost || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 col-span-2">
                    <p className="text-slate-400 text-sm">Profit Margin</p>
                    <p className="text-2xl font-bold text-white mt-2">{selectedReport.margin}%</p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}