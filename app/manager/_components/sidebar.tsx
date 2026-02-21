'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  BarChart3,
  CheckCircle,
  Calendar,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { clearSession, type SessionData } from '@/lib/auth';

interface ManagerSidebarProps {
  session: SessionData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const sidebarItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/manager/dashboard' },
  { id: 'team', name: 'Team Management', icon: Users, href: '/manager/team' },
  { id: 'jobs', name: 'Jobs', icon: Briefcase, href: '/manager/jobs' },
  { id: 'clients', name: 'Clients', icon: Building2, href: '/manager/clients' },
  { id: 'reports', name: 'Reports', icon: BarChart3, href: '/manager/reports' },
  { id: 'approvals', name: 'Approvals', icon: CheckCircle, href: '/manager/approvals' },
  { id: 'meetings', name: 'Meetings', icon: Calendar, href: '/manager/meetings' },
];

export function ManagerSidebar({ session, open, onOpenChange }: ManagerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  // Get user initials
  const getUserInitials = () => {
    if (!session?.user?.name) return 'M';
    const nameParts = session.user.name.split(' ');
    const initials = nameParts.map((n: string) => n[0]).join('');
    return initials || 'M';
  };

  // Get user display name
  const getUserDisplayName = () => {
    return session?.user?.name || 'Manager';
  };

  // Get user role - Fixed version
  const getUserRole = () => {
    // Check multiple possible locations for role
    if (!session) return 'Manager';
    
    // Option 1: Direct role property (if exists in some session formats)
    if ((session as any)?.role) {
      return (session as any).role;
    }
    
    // Option 2: roleName property (if exists in some session formats)
    if ((session as any)?.roleName) {
      return (session as any).roleName;
    }
    
    // Option 3: role in user object
    if ((session.user as any)?.role) {
      return (session.user as any).role;
    }
    
    // Default fallback
    return 'Manager';
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-slate-800/95 backdrop-blur border-r border-slate-700 z-40 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">Manager</p>
              <p className="text-xs text-slate-400">Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-slate-700 p-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {getUserInitials()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-slate-400">
                    {getUserRole()}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-700 rounded-lg border border-slate-600 overflow-hidden shadow-lg">
                <button
                  onClick={() => {
                    handleLogout();
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-slate-600/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => onOpenChange(false)}
        ></div>
      )}
    </>
  );
}