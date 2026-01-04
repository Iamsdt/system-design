import React, { useState, useMemo } from 'react';

const TOOLS = {
  metrics: [
    { id: 'prometheus', name: 'Prometheus (Self-hosted)', cost: 100, retention: '15 days', overhead: 'High' },
    { id: 'datadog-metrics', name: 'Datadog Metrics', cost: 500, retention: '15 months', overhead: 'Low' },
    { id: 'cloudwatch-metrics', name: 'AWS CloudWatch', cost: 300, retention: '15 months', overhead: 'None' },
  ],
  logs: [
    { id: 'elk', name: 'ELK Stack (Self-hosted)', cost: 400, retention: '7 days', overhead: 'Very High' },
    { id: 'splunk', name: 'Splunk', cost: 1200, retention: '90 days', overhead: 'Low' },
    { id: 'loki', name: 'Grafana Loki', cost: 200, retention: '30 days', overhead: 'Medium' },
  ],
  traces: [
    { id: 'jaeger', name: 'Jaeger (Self-hosted)', cost: 150, retention: '2 days', overhead: 'High' },
    { id: 'honeycomb', name: 'Honeycomb', cost: 600, retention: '60 days', overhead: 'Low' },
    { id: 'aws-xray', name: 'AWS X-Ray', cost: 250, retention: '30 days', overhead: 'None' },
  ]
};

export default function ObservabilityStackBuilder() {
  const [selections, setSelections] = useState({
    metrics: TOOLS.metrics[0].id,
    logs: TOOLS.logs[0].id,
    traces: TOOLS.traces[0].id,
  });

  const selectedTools = useMemo(() => {
    return {
      metrics: TOOLS.metrics.find(t => t.id === selections.metrics),
      logs: TOOLS.logs.find(t => t.id === selections.logs),
      traces: TOOLS.traces.find(t => t.id === selections.traces),
    };
  }, [selections]);

  const totalCost = useMemo(() => {
    return Object.values(selectedTools).reduce((sum, t) => sum + t.cost, 0);
  }, [selectedTools]);

  return (
    <div className="bg-white border-2 border-cyan-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl">
          🏗️
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Observability Stack Builder</h4>
          <div className="text-xs text-slate-500">Choose your tools and see the impact</div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(TOOLS).map(([category, options]) => (
          <div key={category}>
            <label className="text-sm font-semibold text-slate-700 mb-2 block capitalize">
              {category}
            </label>
            <select
              value={selections[category]}
              onChange={(e) => setSelections(prev => ({ ...prev, [category]: e.target.value }))}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              {options.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>
        ))}

        <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Estimated Monthly Cost:</span>
            <span className="text-lg font-bold text-cyan-700">${totalCost}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
            <div className="text-center">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Retention</div>
              <div className="text-xs font-semibold text-slate-700">
                {selectedTools.metrics.retention} (Avg)
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Ops Overhead</div>
              <div className="text-xs font-semibold text-slate-700">
                {selectedTools.metrics.overhead}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Vendor Lock</div>
              <div className="text-xs font-semibold text-slate-700">
                {selectedTools.metrics.id.includes('aws') || selectedTools.metrics.id.includes('datadog') ? 'High' : 'Low'}
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          * Costs are illustrative and vary based on data volume and ingestion rates.
        </div>
      </div>
    </div>
  );
}
