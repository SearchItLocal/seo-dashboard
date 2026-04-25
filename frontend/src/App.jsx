import React, { useState } from 'react';
import { MultiSiteDashboard } from './MultiSiteDashboard';

export default function App() {
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {!isConnected ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h1 className="text-3xl font-bold mb-2 text-slate-900">📊 SEO Dashboard</h1>
            <p className="text-slate-600 mb-6">120 Website Portfolio Manager</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Google OAuth Token
                </label>
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your ya29.a0Aa... token"
                  className="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm h-20"
                />
              </div>
              
              <button
                onClick={() => {
                  if (token.trim()) {
                    setIsConnected(true);
                  }
                }}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold transition"
              >
                Connect & Load Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <MultiSiteDashboard token={token} />
      )}
    </div>
  );
}
