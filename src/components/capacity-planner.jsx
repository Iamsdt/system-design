import { useMemo, useState } from "react"

export default function CapacityPlanner({ className }) {
  const [dau, setDau] = useState(1000000)
  const [requestsPerUser, setRequestsPerUser] = useState(50)
  const [requestSizeKB, setRequestSizeKB] = useState(10)
  const [readWriteRatio, setReadWriteRatio] = useState(90)
  const [retentionDays, setRetentionDays] = useState(365)

  const results = useMemo(() => {
    const totalRequests = dau * requestsPerUser
    const qps = Math.round(totalRequests / 86400)
    const peakQps = Math.round(qps * 2.5)
    const dailyDataKB = totalRequests * requestSizeKB
    const dailyDataGB = dailyDataKB / (1024 * 1024)
    const storageGB = Math.round(dailyDataGB * retentionDays)
    const bandwidthMbps = Math.round(
      (qps * requestSizeKB * 1024 * 8) / (1024 * 1024)
    )

    return {
      totalRequests,
      qps,
      peakQps,
      storageGB,
      dailyDataGB,
      bandwidthMbps,
    }
  }, [dau, requestsPerUser, requestSizeKB, retentionDays])

  return (
    <div
      className={`bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow ${className || ""}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg  from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl">
              📊
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Back-of-Envelope Capacity Planner
              </h4>
              <div className="text-xs text-slate-500">
                Estimate QPS, storage & bandwidth
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs font-semibold text-blue-600 bg-blue-50 py-1.5 px-3 rounded-full">
          Interactive
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            DAU (Daily Active Users)
          </label>
          <input
            type="range"
            min={1000}
            max={10000000}
            step={1000}
            value={dau}
            onChange={(e) => setDau(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
          <div className="text-sm font-bold text-blue-600 mt-2">
            {dau.toLocaleString()} users
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Requests / user
          </label>
          <input
            type="range"
            min={1}
            max={500}
            step={1}
            value={requestsPerUser}
            onChange={(e) => setRequestsPerUser(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
          <div className="text-sm font-bold text-blue-600 mt-2">
            {requestsPerUser} requests / DAU
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Avg request size (KB)
          </label>
          <input
            type="range"
            min={1}
            max={200}
            step={1}
            value={requestSizeKB}
            onChange={(e) => setRequestSizeKB(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
          <div className="text-sm font-bold text-blue-600 mt-2">
            {requestSizeKB} KB
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Retention (days)
          </label>
          <input
            type="range"
            min={1}
            max={3650}
            step={1}
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
          <div className="text-sm font-bold text-blue-600 mt-2">
            Keep data for {retentionDays} days
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Read/Write Ratio (%)
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={readWriteRatio}
            onChange={(e) => setReadWriteRatio(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
          <div className="text-sm font-bold text-blue-600 mt-2">
            {readWriteRatio}% reads, {100 - readWriteRatio}% writes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2  gap-3 mb-5">
        <div className=" from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
            QPS (avg)
          </div>
          <div className="text-2xl font-extrabold text-blue-900">
            {results.qps?.toLocaleString() || "--"}
          </div>
        </div>

        <div className=" from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 text-center">
          <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">
            Peak QPS
          </div>
          <div className="text-2xl font-extrabold text-purple-900">
            {results.peakQps?.toLocaleString() || "--"}
          </div>
        </div>

        <div className=" from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
            Daily Data (GB)
          </div>
          <div className="text-2xl font-extrabold text-green-900">
            {results.dailyDataGB?.toFixed(2) || "--"}
          </div>
        </div>

        <div className=" from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 text-center">
          <div className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">
            Storage (GB)
          </div>
          <div className="text-2xl font-extrabold text-orange-900">
            {results.storageGB?.toLocaleString() || "--"}
          </div>
        </div>
      </div>
    </div>
  )
}
