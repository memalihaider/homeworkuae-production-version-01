
'use client';
import Link from 'next/link';
import { Crown, Building2, Sparkles, ChevronRight } from 'lucide-react';

export default function PortalSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-32 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-500"></div>
      
      {/* Floating Icons */}
      <Sparkles className="absolute top-20 right-20 text-yellow-400 w-8 h-8 animate-bounce" />
      <Sparkles className="absolute bottom-20 left-20 text-pink-400 w-6 h-6 animate-bounce delay-300" />

      <div className="relative z-10 max-w-md w-full">
        
        {/* Header with Animation */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Choose your portal to continue your journey
          </p>
        </div>

        {/* Portal Cards */}
        <div className="space-y-6">
          
          {/* Admin Portal - Royal Design */}
          <Link 
            href="/login"
            className="group block relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-1 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="bg-white rounded-xl p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 group-hover:scale-110 transition-transform">
                    <Crown className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
                    <p className="text-gray-500 text-sm">Full system access & control</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-purple-400 group-hover:translate-x-2 transition-transform" />
              </div>
              
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </Link>

          {/* Employee Portal - Professional Design */}
          <Link 
            href="/login/employee"
            className="group block relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-1 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="bg-white rounded-xl p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 group-hover:scale-110 transition-transform">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-800">Employee Portal</h2>
                    <p className="text-gray-500 text-sm">Work dashboard & resources</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-blue-400 group-hover:translate-x-2 transition-transform" />
              </div>
              
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </Link>

        </div>

        {/* Footer with Decorative Elements */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Secure access • Enterprise ready • 24/7 Support
          </p>
        </div>

      </div>

      {/* Add custom animations to Tailwind config if needed */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}