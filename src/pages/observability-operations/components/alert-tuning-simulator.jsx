import React, { useState, useMemo } from 'react';

export default function AlertTuningSimulator() {
  const [threshold, setThreshold] = useState(50);
  const [windowSize, setWindowSize] = useState(5); // minutes

  // Generate some mock data for "error rate"
  const data = useMemo(() => {
    const points = [];
    for (let i = 0; i < 60; i++) {
      // Random walk with some spikes
      const base = 20 + Math.sin(i / 5) * 10;
      const spike = Math.random() > 0.9 ? Math.random() * 60 : 0;
      points.push(Math.max(0, Math.min(100, base + spike)));
    }
    return points;
  }, []);

  const alerts = useMemo(() => {
    let count = 0;
    let active = false;
    
    for (let i = 0; i < data.length; i++) {
      const window = data.slice(Math.max(0, i - windowSize + 1), i + 1);
      const avg = window.reduce((a, b) => a + b, 0) / window.length;
      
      if (avg > threshold) {
        if (!active) {
          count++;
          active = true;
        }
      } else {
        active = false;
      }
    }
    return count;
  }, [data, threshold, windowSize]);

  return (
    <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl">
          🔔
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Alert Tuning Simulator</h4>
          <div className="text-xs text-slate-500">Balance sensitivity vs alert fatigue</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-32 flex items-end gap-1 bg-slate-50 rounded-lg p-2 relative overflow-hidden border border-slate-100">
          {data.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-400 rounded-t-sm transition-all duration-300"
              style={{ height: `${val}%`, opacity: val > threshold ? 1 : 0.4 }}
            />
          ))}
          <div 
            className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed transition-all duration-300"
            style={{ bottom: `${threshold}%` }}
          >
            <span className="absolute right-2 -top-5 text-[10px] font-bold text-red-600 bg-white px-1 rounded">
              Threshold: {threshold}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Threshold (%)
            </label>
            <input
              type="range"
              min="10"
              max="90"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-orange-600"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Window (min)
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={windowSize}
              onChange={(e) => setWindowSize(Number(e.target.value))}
              className="w-full accent-orange-600"
            />
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900">Alerts Triggered</div>
            <div className="text-xs text-slate-500">In the last 60 minutes</div>
          </div>
          <div className={`text-3xl font-black ${alerts > 5 ? 'text-red-600' : alerts > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {alerts}
          </div>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed">
          {alerts > 5 ? (
            <p className="text-red-600 font-medium">⚠️ High alert fatigue! Engineers will likely ignore these.</p>
          ) : alerts === 0 ? (
            <p className="text-blue-600 font-medium">ℹ️ Very quiet. You might miss subtle incidents.</p>
          ) : (
            <p className="text-green-600 font-medium">✅ Good balance. Alerts on significant deviations only.</p>
          )}
        </div>
      </div>
    </div>
  );
}
