import React, { useState, useMemo } from "react"

/**
 * Cloud Cost Estimator component
 * Compares estimated costs for a simple stack across providers
 */
const CloudCostEstimator = () => {
  const [stack, setStack] = useState({
    compute: 2, // instances
    storage: 500, // GB
    bandwidth: 1000, // GB
  })

  const PROVIDERS = {
    gcp: {
      name: "Google Cloud",
      compute: 0.04, // per instance/hr (Cloud Run avg)
      storage: 0.02, // per GB
      bandwidth: 0.08, // per GB
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    aws: {
      name: "AWS",
      compute: 0.045,
      storage: 0.023,
      bandwidth: 0.09,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    azure: {
      name: "Azure",
      compute: 0.042,
      storage: 0.021,
      bandwidth: 0.085,
      color: "text-blue-400",
      bg: "bg-blue-50",
    },
  }

  const estimates = useMemo(() => {
    return Object.entries(PROVIDERS).map(([id, p]) => {
      const computeCost = stack.compute * p.compute * 24 * 30
      const storageCost = stack.storage * p.storage
      const bandwidthCost = stack.bandwidth * p.bandwidth
      const total = computeCost + storageCost + bandwidthCost
      return { id, ...p, total: total.toFixed(2) }
    })
  }, [stack])

  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl">
          💰
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Cloud Cost Estimator</h4>
          <div className="text-xs text-slate-500">Rough monthly estimate comparison</div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Compute (Instances/Containers): {stack.compute}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={stack.compute}
            onChange={(e) => setStack({ ...stack, compute: Number(e.target.value) })}
            className="w-full accent-blue-600"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Storage (GB): {stack.storage}
          </label>
          <input
            type="range"
            min="10"
            max="2000"
            step="10"
            value={stack.storage}
            onChange={(e) => setStack({ ...stack, storage: Number(e.target.value) })}
            className="w-full accent-blue-600"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Egress Bandwidth (GB): {stack.bandwidth}
          </label>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={stack.bandwidth}
            onChange={(e) => setStack({ ...stack, bandwidth: Number(e.target.value) })}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {estimates.map((est) => (
          <div key={est.id} className={`${est.bg} rounded-xl p-4 flex items-center justify-between border border-slate-100`}>
            <div>
              <div className={`font-bold ${est.color}`}>{est.name}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Estimated Monthly</div>
            </div>
            <div className="text-2xl font-black text-slate-900">${est.total}</div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[10px] text-slate-400 italic">
        * Estimates are based on average list prices and do not include free tiers, 
        committed use discounts, or regional variations.
      </p>
    </div>
  )
}

export default CloudCostEstimator
