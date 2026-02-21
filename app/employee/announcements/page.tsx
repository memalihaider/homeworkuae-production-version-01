'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Bell, AlertCircle, Info, CheckCircle, Megaphone } from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High';
  date: string;
  read: boolean;
  category: 'General' | 'Safety' | 'Event' | 'Update';
}

const mockAnnouncements: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'New Safety Guidelines Update',
    content: 'Please review the updated safety guidelines for all job sites. Changes include new PPE requirements and emergency procedures.',
    priority: 'High',
    date: '2024-01-30',
    read: false,
    category: 'Safety'
  },
  {
    id: 'ANN-002',
    title: 'Company Holiday - National Day',
    content: 'The office will be closed on February 1st for National Day. All staff are entitled to this paid holiday.',
    priority: 'Medium',
    date: '2024-01-29',
    read: false,
    category: 'Event'
  },
  {
    id: 'ANN-003',
    title: 'Monthly Town Hall Meeting',
    content: 'Join us for our monthly town hall meeting on February 5th at 2:00 PM. Agenda includes Q&A and company updates.',
    priority: 'Low',
    date: '2024-01-28',
    read: true,
    category: 'General'
  },
  {
    id: 'ANN-004',
    title: 'New Mobile App Launch',
    content: 'We are excited to announce the launch of our new mobile app for job tracking and attendance. Download it today!',
    priority: 'Medium',
    date: '2024-01-25',
    read: true,
    category: 'Update'
  },
  {
    id: 'ANN-005',
    title: 'Overtime Compensation Policy Update',
    content: 'Starting February 1st, overtime compensation will increase by 15%. Thank you for your hard work!',
    priority: 'High',
    date: '2024-01-24',
    read: true,
    category: 'Update'
  },
];

export default function EmployeeAnnouncementsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession) {
      router.push('/login/employee');
      return;
    }
    setSession(storedSession);
  }, [router]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-900/20 text-red-300 border-red-800';
      case 'Medium': return 'bg-amber-900/20 text-amber-300 border-amber-800';
      case 'Low': return 'bg-green-900/20 text-green-300 border-green-800';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Safety': return 'bg-red-900/20 text-red-300';
      case 'Event': return 'bg-blue-900/20 text-blue-300';
      case 'Update': return 'bg-purple-900/20 text-purple-300';
      case 'General': return 'bg-green-900/20 text-green-300';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'Medium': return <Info className="w-5 h-5 text-amber-400" />;
      case 'Low': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return null;
    }
  };

  const filteredAnnouncements = filter === 'All' 
    ? announcements 
    : announcements.filter(a => a.category === filter);

  const unreadCount = announcements.filter(a => !a.read).length;

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
                <h1 className="text-2xl font-bold text-white">Announcements</h1>
                <p className="text-sm text-slate-400">{unreadCount} unread announcements</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto space-y-6">

          {/* Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All', 'General', 'Safety', 'Event', 'Update'].map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filter === category
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Announcements */}
          <div className="space-y-4">
            {filteredAnnouncements.map(announcement => (
              <div
                key={announcement.id}
                className={`border rounded-xl p-6 transition-colors ${
                  announcement.read
                    ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    : 'bg-violet-900/20 border-violet-700 hover:border-violet-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(announcement.priority)}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                      {!announcement.read && (
                        <div className="w-2 h-2 bg-violet-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mb-3">{announcement.content}</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority} Priority
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(announcement.category)}`}>
                        {announcement.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {!announcement.read && (
                    <div className="ml-4">
                      <Megaphone className="w-5 h-5 text-violet-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No announcements in this category</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}