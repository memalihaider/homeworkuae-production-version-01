'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ManagerSidebar } from '../_components/sidebar';
import { Calendar, Clock, Users, MapPin, Plus, Menu, X, Video } from 'lucide-react';

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
      permissions: storedSession.permissions || ['view_dashboard', 'view_meetings'],
      department: storedSession.department || 'Management',
      loginTime: storedSession.loginTime || new Date().toISOString(),
      expiresAt: storedSession.expiresAt || new Date(Date.now() + 3600000).toISOString(),
      user: storedSession.user || {
        uid: storedSession.userId || 'unknown',
        email: storedSession.email || null,
        name: storedSession.userName || null
      },
      allowedPages: storedSession.allowedPages || ['/manager/dashboard', '/manager/meetings']
    };
  } catch {
    return null;
  }
};

const meetings = [
  { id: '1', title: 'Team Weekly Standup', date: '2024-02-01', time: '09:00 AM', duration: '30 mins', location: 'Conference Room A', attendees: ['Ahmed Hassan', 'Sara Al Maktoum', 'Mohammed Ali', 'Omar Rashid', 'Layla Mansour'], type: 'in-person', status: 'scheduled' },
  { id: '2', title: 'Client Review - Al Futtaim', date: '2024-02-01', time: '02:00 PM', duration: '1 hour', location: 'Video Call', attendees: ['Sara Al Maktoum', 'Omar Rashid'], type: 'virtual', status: 'scheduled' },
  { id: '3', title: 'Project Planning Session', date: '2024-02-02', time: '10:00 AM', duration: '1.5 hours', location: 'Conference Room B', attendees: ['Ahmed Hassan', 'Mohammed Ali', 'Fatima Khalid', 'Layla Mansour'], type: 'in-person', status: 'scheduled' },
  { id: '4', title: 'Budget Review Meeting', date: '2024-02-03', time: '03:00 PM', duration: '45 mins', location: 'Video Call', attendees: ['Sara Al Maktoum'], type: 'virtual', status: 'scheduled' },
  { id: '5', title: 'Safety Briefing', date: '2024-02-05', time: '11:00 AM', duration: '1 hour', location: 'Training Room', attendees: ['All Team Members'], type: 'in-person', status: 'scheduled' },
];

export default function Meetings() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<typeof meetings[0] | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'in-person' | 'virtual'>('all');

  useEffect(() => {
    const sessionData = getSessionData();
    if (!sessionData || sessionData.portal !== 'manager') {
      router.push('/login/manager');
      return;
    }
    setSession(sessionData);
  }, [router]);

  const filteredMeetings = meetings.filter(m => filterType === 'all' || m.type === filterType);

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
            <h1 className="text-2xl font-bold text-white">Meetings & Calendar</h1>
            <p className="text-sm text-slate-400 mt-1">Schedule and manage team meetings</p>
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
                  <p className="text-sm text-slate-400">Upcoming</p>
                  <p className="text-2xl font-bold text-white mt-1">{meetings.length}</p>
                </div>
                <Calendar className="w-10 h-10 text-indigo-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">This Week</p>
                  <p className="text-2xl font-bold text-white mt-1">{meetings.filter(m => m.date <= '2024-02-05').length}</p>
                </div>
                <Clock className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">In-Person</p>
                  <p className="text-2xl font-bold text-white mt-1">{meetings.filter(m => m.type === 'in-person').length}</p>
                </div>
                <MapPin className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Virtual</p>
                  <p className="text-2xl font-bold text-white mt-1">{meetings.filter(m => m.type === 'virtual').length}</p>
                </div>
                <Video className="w-10 h-10 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Filters and Action */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div className="flex gap-2">
              {['all', 'in-person', 'virtual'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === type
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {type === 'in-person' ? 'In-Person' : type === 'virtual' ? 'Virtual' : 'All'}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </button>
          </div>

          {/* Meetings List */}
          <div className="space-y-4">
            {filteredMeetings.map(meeting => (
              <div
                key={meeting.id}
                onClick={() => setSelectedMeeting(meeting)}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-indigo-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{meeting.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        meeting.type === 'virtual' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {meeting.type === 'virtual' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        {meeting.type === 'virtual' ? 'Virtual' : 'In-Person'}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {meeting.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-sm">
                    <p className="text-slate-400 flex items-center gap-1"><Calendar className="w-4 h-4" />Date</p>
                    <p className="text-white">{new Date(meeting.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-400 flex items-center gap-1"><Clock className="w-4 h-4" />Time</p>
                    <p className="text-white">{meeting.time}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-400 flex items-center gap-1"><MapPin className="w-4 h-4" />Location</p>
                    <p className="text-white truncate">{meeting.location}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-400 flex items-center gap-1"><Users className="w-4 h-4" />Attendees</p>
                    <p className="text-white">{meeting.attendees.length} people</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg max-w-md w-full border border-slate-700 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedMeeting.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedMeeting.type === 'virtual' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedMeeting.type === 'virtual' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                    {selectedMeeting.type === 'virtual' ? 'Virtual' : 'In-Person'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm mb-6">
              <div>
                <p className="text-slate-400">Date</p>
                <p className="text-white flex items-center gap-2 mt-1"><Calendar className="w-4 h-4" />{new Date(selectedMeeting.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Time</p>
                <p className="text-white flex items-center gap-2 mt-1"><Clock className="w-4 h-4" />{selectedMeeting.time}</p>
              </div>
              <div>
                <p className="text-slate-400">Duration</p>
                <p className="text-white">{selectedMeeting.duration}</p>
              </div>
              <div>
                <p className="text-slate-400">Location</p>
                <p className="text-white flex items-center gap-2 mt-1"><MapPin className="w-4 h-4" />{selectedMeeting.location}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-2">Attendees ({selectedMeeting.attendees.length})</p>
                <div className="space-y-1">
                  {selectedMeeting.attendees.map((attendee, idx) => (
                    <p key={idx} className="text-white text-xs px-2 py-1 bg-slate-700/50 rounded inline-block mr-2 mb-2">{attendee}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMeeting(null)}
                className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
              >
                Join
              </button>
              <button
                onClick={() => setSelectedMeeting(null)}
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