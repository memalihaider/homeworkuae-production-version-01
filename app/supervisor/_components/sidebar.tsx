'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { clearSession, type SessionData } from '@/lib/auth';

interface SupervisorSidebarProps {
  session: SessionData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const sidebarItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/supervisor/dashboard' },
  { id: 'team', name: 'Team', icon: Users, href: '/supervisor/team' },
  { id: 'jobs', name: 'Jobs', icon: Briefcase, href: '/supervisor/jobs' },
  { id: 'approvals', name: 'Approvals', icon: CheckSquare, href: '/supervisor/approvals' },
  { id: 'reports', name: 'Reports', icon: FileText, href: '/supervisor/reports' },
];

export function SupervisorSidebar({ session, open, onOpenChange }: SupervisorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  // Get user initials
  const getUserInitials = () => {
    if (!session?.user?.name) return 'S';
    const nameParts = session.user.name.split(' ');
    const initials = nameParts.map((n: string) => n[0]).join('');
    return initials || 'S';
  };

  // Get user display name
  const getUserDisplayName = () => {
    return session?.user?.name || 'Supervisor';
  };

  // Get user role - Fixed version
  const getUserRole = () => {
    if (!session) return 'Supervisor';
    
    // Check multiple possible locations for role
    if (session.roleName) {
      return session.roleName;
    }
    
    // Check if role exists in user object
    if ((session.user as any)?.role) {
      return (session.user as any).role;
    }
    
    // Default fallback
    return 'Supervisor';
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-emerald-900/95 backdrop-blur border-r border-emerald-800 z-40 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">Supervisor</p>
              <p className="text-xs text-emerald-200">Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'text-emerald-100 hover:bg-emerald-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-emerald-800 p-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-emerald-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {getUserInitials()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-emerald-200">
                    {getUserRole()}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-emerald-200 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-emerald-800 rounded-lg border border-emerald-700 overflow-hidden shadow-lg">
                <button
                  onClick={() => {
                    handleLogout();
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-emerald-700/50 transition-colors"
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