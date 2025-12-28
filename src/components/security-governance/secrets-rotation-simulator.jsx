import { useMemo, useState } from "react"

const STRATEGIES = [
  { id: "zero-downtime", label: "Zero-Downtime", notes: ["Run old + new keys in parallel", "Gracefully deprecate"], color: "bg-green-50 border-green-300" },
  { id: "scheduled", label: "Scheduled", notes: ["Rotate during maintenance", "Synchronous updates"], color: "bg-yellow-50 border-yellow-300" },
]

export default function SecretsRotationSimulator() {
  const [rotationPeriod, setRotationPeriod] = useState(90)
  const [currentKey, setCurrentKey] = useState(1)
  const [rotationStrategy, setRotationStrategy] = useState("zero-downtime")

  const rotationTimeline = useMemo(() => {
    const timeline = []
    const now = new Date()
    for (let i = 0; i < 5; i += 1) {
      const date = new Date(now)
      date.setDate(date.getDate() + i * rotationPeriod)
      timeline.push({
        date,
        keyVersion: currentKey + i,
        status: i === 0 ? "active" : i === 1 ? "next" : "future",
      })
    }
    return timeline
  }, [rotationPeriod, currentKey])

  return (
    <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl">
          🔑
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Secrets Rotation Simulator</h4>
          <div className="text-xs text-slate-500">Key rotation timeline and strategies</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Rotation Period: {rotationPeriod} days
          </label>
          <input
            type="range"
            min={30}
            max={365}
            step={30}
            value={rotationPeriod}
            onChange={(event) => setRotationPeriod(Number(event.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>30 days (high-risk)</span>
            <span>365 days (low-risk)</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Rotation Strategy</label>
          <div className="grid grid-cols-2 gap-2">
            {STRATEGIES.map((strategy) => (
              <button
                key={strategy.id}
                type="button"
                onClick={() => setRotationStrategy(strategy.id)}
                className={`text-xs font-semibold rounded-lg px-3 py-2 border transition-colors ${
                  rotationStrategy === strategy.id
                    ? `${strategy.color} text-amber-800`
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {strategy.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-sm font-semibold text-slate-900 mb-3">Rotation Timeline</div>
          <div className="space-y-2">
            {rotationTimeline.map((item) => (
              <div
                key={item.keyVersion}
                className={`p-3 rounded-lg border-2 ${
                  item.status === "active"
                    ? "bg-green-50 border-green-300"
                    : item.status === "next"
                    ? "bg-yellow-50 border-yellow-300"
                    : "bg-slate-100 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">Key Version {item.keyVersion}</div>
                    <div className="text-xs text-slate-600">{item.date.toLocaleDateString()}</div>
                  </div>
                  <div className="text-xs font-semibold">
                    {item.status === "active" && "✓ Active"}
                    {item.status === "next" && "→ Next"}
                    {item.status === "future" && "○ Future"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-800">
          <div className="font-semibold mb-1">
            {rotationStrategy === "zero-downtime" ? "Zero-Downtime Strategy" : "Scheduled Strategy"}
          </div>
          {rotationStrategy === "zero-downtime" ? (
            <ul className="space-y-1 ml-4">
              <li>• Create new key version alongside current</li>
              <li>• Update services to accept both keys</li>
              <li>• Deprecate old key after grace period</li>
              <li>• No service interruption</li>
            </ul>
          ) : (
            <ul className="space-y-1 ml-4">
              <li>• Rotate during maintenance window</li>
              <li>• Update all services simultaneously</li>
              <li>• Brief downtime is acceptable</li>
              <li>• Simpler implementation</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
