import React, { useState, useMemo } from 'react';

export default function SLODashboard() {
  const [slo, setSlo] = useState(99.9);
  const [burnRate, setBurnRate] = useState(1.5);

  const stats = useMemo(() => {
    const budget = 100 - slo;
    const remaining = Math.max(0, budget - (burnRate * 0.05)); // Mock calculation
    const daysRemaining = burnRate > 1 ? (remaining / (burnRate * 0.001)).toFixed(1) : '∞';
    
    return {
      budget: budget.toFixed(3),
      remaining: remaining.toFixed(3),
      daysRemaining,
      status: remaining > 0 ? 'Healthy' : 'Exhausted'
    };
  }, [slo, burnRate]);

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl">
          📈
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">SLO & Burn Rate Dashboard</h4>
          <div className="text-xs text-slate-500">Monitor your error budget health</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              SLO Target: {slo}%
            </label>
            <input
              type="range"
              min="99"
              max="99.99"
              step="0.01"
              value={slo}
              onChange={(e) => setSlo(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Current Burn Rate: {burnRate}x
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={burnRate}
              onChange={(e) => setBurnRate(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 space-y-4 border border-slate-100">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] uppercase text-slate-400 font-bold">Error Budget</div>
              <div className="text-2xl font-black text-slate-900">{stats.budget}%</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Remaining</div>
              <div className={`text-2xl font-black ${Number(stats.remaining) < 0.02 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.remaining}%
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${Number(stats.remaining) < 0.02 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${(Number(stats.remaining) / Number(stats.budget)) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-xs text-slate-600">
              Budget will last approx: <span className="font-bold text-slate-900">{stats.daysRemaining} days</span>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${stats.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {stats.status}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 italic">
          * Burn rate &gt; 1.0 means you are consuming your error budget faster than the 30-day window allows.
        </div>
      </div>
    </div>
  );
}
