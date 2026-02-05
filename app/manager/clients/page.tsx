'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ManagerSidebar } from '../_components/sidebar';
import { Building2, Mail, Phone, MapPin, DollarSign, Briefcase, Menu, X, Star } from 'lucide-react';

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
      permissions: storedSession.permissions || ['view_dashboard', 'view_clients'],
      department: storedSession.department || 'Management',
      loginTime: storedSession.loginTime || new Date().toISOString(),
      expiresAt: storedSession.expiresAt || new Date(Date.now() + 3600000).toISOString(),
      user: storedSession.user || {
        uid: storedSession.userId || 'unknown',
        email: storedSession.email || null,
        name: storedSession.userName || null
      },
      allowedPages: storedSession.allowedPages || ['/manager/dashboard', '/manager/clients']
    };
  } catch {
    return null;
  }
};

const clients = [
  { id: '1', name: 'Al Futtaim Group', email: 'contact@alfuttaim.ae', phone: '+971501111111', location: 'Dubai', activeJobs: 1, totalSpent: 97500, rating: 4.8 },
  { id: '2', name: 'Emirates NBD', email: 'facilities@emiratesnbd.ae', phone: '+971501111112', location: 'Abu Dhabi', activeJobs: 1, totalSpent: 32000, rating: 4.5 },
  { id: '3', name: 'ADNOC', email: 'procurement@adnoc.ae', phone: '+971501111113', location: 'Ruwais', activeJobs: 1, totalSpent: 37500, rating: 4.9 },
  { id: '4', name: 'Emaar Properties', email: 'operations@emaar.ae', phone: '+971501111114', location: 'Downtown Dubai', activeJobs: 1, totalSpent: 96000, rating: 4.7 },
  { id: '5', name: 'Etihad Airways', email: 'terminals@etihad.ae', phone: '+971501111115', location: 'Abu Dhabi', activeJobs: 0, totalSpent: 498000, rating: 5.0 },
];

export default function Clients() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);

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

  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <ManagerSidebar session={session} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Client Relations</h1>
            <p className="text-sm text-slate-400 mt-1">Manage client information and relationships</p>
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
                  <p className="text-sm text-slate-400">Total Clients</p>
                  <p className="text-2xl font-bold text-white mt-1">{clients.length}</p>
                </div>
                <Building2 className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-white mt-1">AED {(totalRevenue / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Projects</p>
                  <p className="text-2xl font-bold text-white mt-1">{clients.filter(c => c.activeJobs > 0).length}</p>
                </div>
                <Briefcase className="w-10 h-10 text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map(client => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-indigo-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white">{client.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(client.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`}
                        />
                      ))}
                      <span className="text-xs text-slate-400 ml-2">{client.rating}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">{client.activeJobs} active</span>
                </div>

                <div className="space-y-2 text-sm text-slate-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{client.location}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Total Spent</p>
                  <p className="text-lg font-semibold text-white">AED {client.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg max-w-md w-full border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedClient.name}</h2>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(selectedClient.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm mb-6">
              <div>
                <p className="text-slate-400">Email</p>
                <p className="text-white">{selectedClient.email}</p>
              </div>
              <div>
                <p className="text-slate-400">Phone</p>
                <p className="text-white">{selectedClient.phone}</p>
              </div>
              <div>
                <p className="text-slate-400">Location</p>
                <p className="text-white">{selectedClient.location}</p>
              </div>
              <div>
                <p className="text-slate-400">Active Projects</p>
                <p className="text-white">{selectedClient.activeJobs}</p>
              </div>
              <div>
                <p className="text-slate-400">Total Revenue</p>
                <p className="text-green-400 font-semibold">AED {selectedClient.totalSpent.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedClient(null)}
                className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => setSelectedClient(null)}
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