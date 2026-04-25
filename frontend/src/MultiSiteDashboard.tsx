import React, { useState, useEffect } from 'react';

interface Website {
  url: string;
  specialist: string;
  qtv?: number;
  leads?: number;
  topPages?: any[];
  status?: 'loading' | 'success' | 'error';
}

interface PortfolioState {
  websites: Website[];
  token: string | null;
  loading: boolean;
  totalQTV: number;
  totalLeads: number;
}

export const MultiSiteDashboard: React.FC = () => {
  const [state, setState] = useState<PortfolioState>({
    websites: [],
    token: null,
    loading: false,
    totalQTV: 0,
    totalLeads: 0,
  });

  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Load websites from your Excel sheet
  const WEBSITES = [
    { url: 'https://joyfulwarriorprincess.com.au/', specialist: 'Rand Halasa' },
    { url: 'https://www.garyhamerinteriors.com.au/', specialist: 'Eugene Lumanlan' },
    { url: 'https://dkcdents.com.au', specialist: 'Eugene Lumanlan' },
    { url: 'http://astonandcopaintingdecorating.com.au', specialist: 'Eugene Lumanlan' },
    { url: 'http://petesupholsteryandtrimming.com.au/', specialist: 'Eugene Lumanlan' },
    { url: 'http://hivesdemolition.com.au', specialist: 'Rand Halasa' },
    { url: 'http://pearlscreations.com.au/', specialist: 'Rand Halasa' },
    { url: 'http://mrroadsidemobilemechanic.com.au/', specialist: 'Rand Halasa' },
    { url: 'https://www.cessnocktankworks.com.au/', specialist: 'Rand Halasa' },
    { url: 'https://thesoundlab.com.au/', specialist: 'Eugene Lumanlan' },
    { url: 'https://spidersecurity.com.au', specialist: 'Rand Halasa' },
    { url: 'https://www.abcdbuilder.com.au/', specialist: 'Eugene Lumanlan' },
    { url: 'http://blackwoodosteopathy.com.au', specialist: 'Diego Varoli' },
    { url: 'http://livingconsciously.com.au', specialist: 'Eugene Lumanlan' },
    { url: 'http://mountainhollowragdolls.com.au', specialist: 'Diana Rodriguez' },
    { url: 'https://chihouseclinic.com/', specialist: 'Georgia Rose' },
    { url: 'https://glengilbertsonfloorsanding.com.au/', specialist: 'Diana Rodriguez' },
    { url: 'http://fiestaloca.com.au', specialist: 'Diego Varoli' },
    { url: 'http://maryvalleypetcremation.com.au', specialist: 'Eugene Lumanlan' },
    // Add more from your sheet...
  ];

  const handleConnectGSC = async () => {
    if (!tokenInput.trim()) {
      alert('Please paste your access token');
      return;
    }

    setState(prev => ({ ...prev, token: tokenInput, loading: true }));
    setShowTokenInput(false);

    // Initialize websites
    const websitesWithData: Website[] = WEBSITES.map(w => ({
      ...w,
      status: 'loading',
      qtv: 0,
      leads: 0,
      topPages: []
    }));

    setState(prev => ({
      ...prev,
      websites: websitesWithData
    }));

    // Fetch data for each website
    for (let i = 0; i < websitesWithData.length; i++) {
      await fetchSiteData(websitesWithData[i], tokenInput, i);
    }
  };

  const fetchSiteData = async (website: Website, token: string, index: number) => {
    try {
      // Format site URL for GSC API
      const siteUrl = website.url.startsWith('http') 
        ? website.url 
        : `https://${website.url}`;

      // Query top pages
      const response = await fetch('https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(siteUrl) + '/searchAnalytics/query', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          dimensions: ['page'],
          metrics: ['clicks', 'impressions', 'ctr', 'position'],
          orderBy: [{ name: 'clicks', isDescending: true }],
          rowLimit: 5
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rows = data.rows || [];

        // Calculate QTV
        const totalClicks = rows.reduce((sum: number, row: any) => sum + row.clicks, 0);
        const conversionRate = 0.02; // 2%
        const leadValue = 500;
        const qtv = Math.round(totalClicks * conversionRate * leadValue);
        const leads = Math.round(totalClicks * conversionRate);

        // Update state
        setState(prev => {
          const updated = [...prev.websites];
          updated[index] = {
            ...updated[index],
            status: 'success',
            qtv,
            leads,
            topPages: rows
          };

          const newTotal = updated.reduce((sum, w) => sum + (w.qtv || 0), 0);
          const newLeads = updated.reduce((sum, w) => sum + (w.leads || 0), 0);

          return {
            ...prev,
            websites: updated,
            totalQTV: newTotal,
            totalLeads: newLeads
          };
        });
      } else {
        setState(prev => {
          const updated = [...prev.websites];
          updated[index].status = 'error';
          return { ...prev, websites: updated };
        });
      }
    } catch (error) {
      console.error(`Error fetching ${website.url}:`, error);
      setState(prev => {
        const updated = [...prev.websites];
        updated[index].status = 'error';
        return { ...prev, websites: updated };
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          📊 Multi-Site SEO Portfolio Dashboard
        </h1>
        <p className="text-slate-600">
          Real-time lead attribution across {WEBSITES.length} websites
        </p>
      </div>

      {/* Token Input */}
      {showTokenInput && (
        <div className="max-w-7xl mx-auto mb-8 bg-white rounded-xl border-2 border-indigo-200 p-8">
          <h2 className="text-2xl font-bold mb-4">🔑 Connect Google Search Console</h2>
          <p className="text-slate-600 mb-4">
            Paste your OAuth access token to start pulling real data from all {WEBSITES.length} websites:
          </p>
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Paste your ya29.a0Aa... token here"
            className="w-full p-4 border border-slate-300 rounded-lg font-mono text-sm mb-4 h-24"
          />
          <button
            onClick={handleConnectGSC}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold"
          >
            Connect GSC & Load Data
          </button>
        </div>
      )}

      {/* Master KPI Card */}
      {state.token && (
        <div className="max-w-7xl mx-auto mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl border border-indigo-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-bold text-indigo-600 uppercase">Total Portfolio QTV</p>
              <p className="text-4xl font-black text-slate-900 mt-2">
                ${state.totalQTV.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">/month estimated</p>
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-600 uppercase">Est. Monthly Leads</p>
              <p className="text-4xl font-black text-slate-900 mt-2">
                {state.totalLeads.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">across {state.websites.length} sites</p>
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-600 uppercase">Active Sites</p>
              <p className="text-4xl font-black text-slate-900 mt-2">
                {state.websites.filter(w => w.status === 'success').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">of {state.websites.length} connected</p>
            </div>
          </div>
        </div>
      )}

      {/* Websites Grid */}
      {state.websites.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Websites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.websites.map((website, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Status Badge */}
                <div className="bg-slate-50 p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 text-sm truncate flex-1">
                      {website.url.replace(/https?:\/\//, '').replace(/\/$/, '')}
                    </h3>
                    {website.status === 'loading' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Loading...
                      </span>
                    )}
                    {website.status === 'success' && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        ✓ Live
                      </span>
                    )}
                    {website.status === 'error' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        Error
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{website.specialist}</p>
                </div>

                {/* Metrics */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">QTV</p>
                      <p className="text-2xl font-black text-indigo-600 mt-1">
                        ${website.qtv?.toLocaleString() || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Leads</p>
                      <p className="text-2xl font-black text-emerald-600 mt-1">
                        {website.leads?.toLocaleString() || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Top Pages */}
                  {website.topPages && website.topPages.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-xs font-bold text-slate-600 uppercase mb-3">Top Pages</p>
                      <div className="space-y-2">
                        {website.topPages.slice(0, 3).map((page, pidx) => (
                          <div key={pidx} className="text-xs">
                            <p className="text-slate-700 truncate font-medium">
                              {page.keys[0]?.split('/').pop() || 'Homepage'}
                            </p>
                            <p className="text-slate-500">
                              {page.clicks} clicks • {page.impressions} impressions
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {state.loading && state.websites.length > 0 && (
        <div className="fixed bottom-8 right-8 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            <div>
              <p className="font-bold text-slate-900">Syncing Data</p>
              <p className="text-sm text-slate-500">
                {state.websites.filter(w => w.status === 'success').length} of {state.websites.length} sites
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
