'use client';

import { useState } from 'react';
import { validateCredentials, DEMO_CREDENTIALS } from '@/lib/auth';

export default function AuthDebugPage() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testAllCredentials = async () => {
    setIsLoading(true);
    setResults([]);
    
    // Sirf admin aur employee portals test karo
    const portals = ['admin', 'employee'] as const;
    const testResults = [];

    for (const portal of portals) {
      const creds = DEMO_CREDENTIALS[portal];
      console.log(`Testing ${portal}:`, creds);

      try {
        const result = await validateCredentials(portal, creds.email, creds.password);
        testResults.push({
          portal,
          email: creds.email,
          password: creds.password,
          success: result.success,
          message: result.message,
          error: result.error,
          redirectTo: result.redirectTo
        });
      } catch (error: any) {
        testResults.push({
          portal,
          email: creds.email,
          password: creds.password,
          success: false,
          error: error.message
        });
      }
    }

    setResults(testResults);
    setIsLoading(false);
  };

  const testSingleCredential = async (portal: 'admin' | 'employee') => {
    setIsLoading(true);
    setResults([]);
    
    const creds = DEMO_CREDENTIALS[portal];
    const testResults = [];

    try {
      const result = await validateCredentials(portal, creds.email, creds.password);
      testResults.push({
        portal,
        email: creds.email,
        password: creds.password,
        success: result.success,
        message: result.message,
        error: result.error,
        redirectTo: result.redirectTo
      });
    } catch (error: any) {
      testResults.push({
        portal,
        email: creds.email,
        password: creds.password,
        success: false,
        error: error.message
      });
    }

    setResults(testResults);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Auth Credentials Debug</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={testAllCredentials}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Admin & Employee'}
          </button>
          
          <button
            onClick={() => testSingleCredential('admin')}
            disabled={isLoading}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            Test Admin Only
          </button>
          
          <button
            onClick={() => testSingleCredential('employee')}
            disabled={isLoading}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            Test Employee Only
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Test Results</h2>
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  result.success
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-red-500 bg-red-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-white">{result.portal.toUpperCase()}</span>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      result.success
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  <p><strong>Email:</strong> {result.email}</p>
                  <p><strong>Password:</strong> {result.password}</p>
                  <p><strong>Message:</strong> {result.message || 'No message'}</p>
                  {result.error && <p className="text-red-400"><strong>Error:</strong> {result.error}</p>}
                  {result.redirectTo && <p className="text-green-400"><strong>Redirect:</strong> {result.redirectTo}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">DEMO_CREDENTIALS Content</h2>
          <pre className="bg-slate-800 p-4 rounded-lg text-slate-300 overflow-x-auto">
            {JSON.stringify(DEMO_CREDENTIALS, null, 2)}
          </pre>
        </div>

        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">⚠️ Note</h3>
          <p className="text-sm text-yellow-300">
            Only <strong className="text-white">admin</strong> and <strong className="text-white">employee</strong> portals are supported for login. 
            Other portal types (manager, supervisor, client, guest) are not implemented in the authentication system.
          </p>
        </div>
      </div>
    </div>
  );
}