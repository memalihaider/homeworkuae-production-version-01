'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye as EyeIcon, EyeOff, ArrowLeft, Loader2, Megaphone, Package, Info } from 'lucide-react';
import { validateCredentials, storeSession } from '@/lib/auth';

export default function GuestLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email, password: '***', portal: 'guest' });
      const authResponse = await validateCredentials('guest', email, password);
      console.log('Auth response:', authResponse);
      
      if (authResponse.success && authResponse.session) {
        console.log('Login successful, storing session...');
        storeSession(authResponse.session);
        router.push('/guest/dashboard');
      } else {
        console.log('Login failed:', authResponse.message);
        setError(authResponse.message || authResponse.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    }
    
    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail('guest@homeware.ae');
    setPassword('Demo@123');
  };

  const handleQuickAccess = async () => {
    setIsLoading(true);
    // Simulate quick guest access
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const session = {
      id: `sess_guest_${Date.now()}`,
      userId: 'guest-temp',
      userName: 'Guest User',
      email: 'guest@homeware.ae',
      role: 'guest' as const,
      roleId: 'role_guest',
      roleName: 'Guest',
      portal: 'guest' as const,
      permissions: ['view_announcements', 'view_catalog'],
      department: 'External',
      loginTime: new Date(),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
      // Adding missing properties for SessionData type
      user: {
        uid: 'guest-temp', // uid is required
        email: 'guest@homeware.ae',
        name: 'Guest User'
      },
      allowedPages: ['/guest/dashboard', '/guest/announcements', '/guest/catalog']
    };
    
    storeSession(session);
    router.push('/guest/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800/20 to-slate-900 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <Link
          href="/login"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portal Selection
        </Link>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-gray-500/20 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-500/20 rounded-xl mb-4">
              <EyeIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Guest Portal</h1>
            <p className="text-slate-400">Limited read-only access</p>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <Megaphone className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">News</span>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <Package className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Catalog</span>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <Info className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-slate-400">About</span>
            </div>
          </div>

          {/* Quick Access Button */}
          <button
            type="button"
            onClick={handleQuickAccess}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-medium rounded-lg transition-all duration-200 mb-6 flex items-center justify-center gap-2"
          >
            <EyeIcon className="w-5 h-5" />
            Continue as Guest
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-800/50 px-4 text-slate-400">or sign in with credentials</span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="guest@homeware.ae"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white placeholder-slate-400 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-gray-500 focus:ring-gray-500"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in to Guest Portal'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg">
            <p className="text-xs text-slate-400 mb-2 text-center">Demo Credentials</p>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="text-slate-300 font-mono text-xs">guest@homeware.ae</p>
                <p className="text-slate-400 font-mono text-xs">Demo@123</p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-gray-400 hover:text-gray-300 font-medium"
              >
                Use Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          © 2026 Homeware. All rights reserved.
        </p>
      </div>
    </div>
  );
}