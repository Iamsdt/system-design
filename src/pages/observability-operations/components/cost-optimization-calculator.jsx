import React, { useState, useMemo } from 'react';

export default function CostOptimizationCalculator() {
  const [instances, setInstances] = useState(10);
  const [utilization, setUtilization] = useState(20); // %
  const [instanceType, setInstanceType] = useState('m5.large');

  const COSTS = {
    'm5.large': 0.096,
    'm5.xlarge': 0.192,
    'm5.2xlarge': 0.384,
  };

  const calculations = useMemo(() => {
    const hourlyCost = instances * COSTS[instanceType];
    const monthlyCost = hourlyCost * 24 * 30;
    
    // Rightsizing logic: if utilization < 40%, we can probably downsize or reduce count
    const recommendedInstances = Math.ceil(instances * (utilization / 50));
    const optimizedMonthlyCost = recommendedInstances * COSTS[instanceType] * 24 * 30;
    const savings = monthlyCost - optimizedMonthlyCost;

    return {
      current: monthlyCost.toFixed(2),
      optimized: optimizedMonthlyCost.toFixed(2),
      savings: savings.toFixed(2),
      percent: ((savings / monthlyCost) * 100).toFixed(0)
    };
  }, [instances, utilization, instanceType]);

  return (
    <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl">
          💰
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Cost Optimization Calculator</h4>
          <div className="text-xs text-slate-500">Rightsize your resources and save</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Instance Type
            </label>
            <select
              value={instanceType}
              onChange={(e) => setInstanceType(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="m5.large">m5.large ($0.096/hr)</option>
              <option value="m5.xlarge">m5.xlarge ($0.192/hr)</option>
              <option value="m5.2xlarge">m5.2xlarge ($0.384/hr)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Instance Count: {instances}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={instances}
              onChange={(e) => setInstances(Number(e.target.value))}
              className="w-full accent-green-600"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Avg CPU Utilization: {utilization}%
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={utilization}
            onChange={(e) => setUtilization(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Under-provisioned</span>
            <span>Over-provisioned</span>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 space-y-3 border border-green-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Current Monthly Spend:</span>
            <span className="text-lg font-bold text-slate-900">${calculations.current}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Optimized Spend:</span>
            <span className="text-lg font-bold text-green-700">${calculations.optimized}</span>
          </div>
          <div className="pt-2 border-t border-green-200 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Potential Savings:</span>
            <div className="text-right">
              <div className="text-xl font-black text-emerald-600">${calculations.savings}</div>
              <div className="text-[10px] font-bold text-emerald-700 uppercase">Save {calculations.percent}%</div>
            </div>
          </div>
        </div>

        {utilization < 30 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            💡 <strong>Recommendation:</strong> Your utilization is very low. Consider using smaller instances or implementing aggressive auto-scaling.
          </div>
        )}
      </div>
    </div>
  );
}
