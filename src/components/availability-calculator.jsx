import { useMemo, useState } from "react"

export default function AvailabilityCalculator({ className }) {
  const [availability, setAvailability] = useState(99.9)
  const [numServers, setNumServers] = useState(3)
  const [serverAvailability, setServerAvailability] = useState(99.9)

  const downtimeStr = (avail) => {
    const uptime = avail / 100
    const downtimePerYear = (1 - uptime) * 365 * 24 * 60 // minutes
    if (downtimePerYear > 24 * 60) {
      return `${(downtimePerYear / (24 * 60)).toFixed(2)} days/year`
    } else if (downtimePerYear > 60) {
      return `${(downtimePerYear / 60).toFixed(2)} hours/year`
    } else {
      return `${downtimePerYear.toFixed(2)} minutes/year`
    }
  }

  const parallelAvailability = useMemo(() => {
    const singleFailure = (100 - serverAvailability) / 100
    const allFail = Math.pow(singleFailure, numServers)
    return ((1 - allFail) * 100).toFixed(3)
  }, [numServers, serverAvailability])

  return (
    <div
      className={`bg-white border-2 border-green-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow ${className || ""}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg  from-green-500 to-green-600 flex items-center justify-center text-white text-xl">
              ✅
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Availability Calculator
              </h4>
              <div className="text-xs text-slate-500">
                SLOs & downtime estimates
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs font-semibold text-green-600 bg-green-50 py-1.5 px-3 rounded-full">
          Interactive
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-5">
        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Target Availability (%)
          </label>
          <input
            type="range"
            min={90}
            max={100}
            step={0.01}
            value={availability}
            onChange={(e) => setAvailability(Number(e.target.value))}
            className="w-full mt-2 accent-green-600"
          />
          <div className="text-sm font-bold text-green-600 mt-2">
            {availability}% → {downtimeStr(availability)}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Server Availability (%)
          </label>
          <input
            type="range"
            min={90}
            max={100}
            step={0.01}
            value={serverAvailability}
            onChange={(e) => setServerAvailability(Number(e.target.value))}
            className="w-full mt-2 accent-green-600"
          />
          <div className="text-sm font-bold text-green-600 mt-2">
            {serverAvailability}% per node
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Number of Nodes
          </label>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={numServers}
            onChange={(e) => setNumServers(Number(e.target.value))}
            className="w-full mt-2 accent-green-600"
          />
          <div className="text-sm font-bold text-green-600 mt-2">
            {numServers} nodes
          </div>
        </div>
      </div>

      <div className=" from-green-50 to-emerald-100 border-2 border-green-300 rounded-xl p-5 text-center">
        <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
          Parallel Availability
        </div>
        <div className="text-4xl font-extrabold text-green-900 mb-1">
          {parallelAvailability}%
        </div>
        <div className="text-xs text-green-700">
          with {numServers} nodes @ {serverAvailability}% each
        </div>
      </div>
    </div>
  )
}
