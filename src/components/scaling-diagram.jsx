import React, { useState } from "react"

export default function ScalingDiagram({ className }) {
  const [scale, setScale] = useState("horizontal")
  const [serverCount, setServerCount] = useState(3)

  return (
    <div
      className={`bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ${className || ""}`}
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-orange-100">
        <div className="text-3xl">📊</div>
        <div className="flex-1">
          <h4 className="text-2xl font-bold  from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Vertical vs Horizontal Scaling
          </h4>
          <div className="text-sm text-slate-600 mt-1">
            Visualize options and trade-offs
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center mb-6 bg-slate-50 rounded-xl p-3">
        <button
          onClick={() => setScale("vertical")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            scale === "vertical"
              ? " from-orange-500 to-amber-500 text-white shadow-lg scale-105"
              : "bg-white text-slate-700 hover:bg-slate-100 hover:scale-102"
          }`}
        >
          ⬆️ Vertical
        </button>
        <button
          onClick={() => setScale("horizontal")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            scale === "horizontal"
              ? " from-orange-500 to-amber-500 text-white shadow-lg scale-105"
              : "bg-white text-slate-700 hover:bg-slate-100 hover:scale-102"
          }`}
        >
          ➡️ Horizontal
        </button>

        {scale === "horizontal" && (
          <div className="ml-auto flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-orange-100">
            <label className="text-sm font-semibold text-slate-700">
              Nodes:
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={serverCount}
              onChange={(e) => setServerCount(Number(e.target.value))}
              className="accent-orange-500"
            />
            <div className="text-sm font-bold text-orange-600 min-w-[2rem] text-right">
              {serverCount}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        {scale === "vertical" ? (
          <div className="flex-1 flex flex-col items-center gap-4 p-6  from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
            <div className="w-48 h-48 rounded-2xl border-4 border-orange-300 flex flex-col items-center justify-center  from-orange-100 to-white shadow-lg">
              <div className="text-4xl mb-2">🖥️</div>
              <div className="text-slate-900 font-bold text-lg">
                Bigger Server
              </div>
              <div className="text-xs text-slate-600 mt-2">
                More CPU, RAM, Network
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                ⬆️ Upgrade CPU, RAM, Network
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-100 shadow-inner">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-orange-700">
                    ⚖️ Trade-offs:
                  </span>{" "}
                  Single point of failure, limited capacity growth, simpler ops
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6  from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              {Array.from({ length: Math.min(serverCount, 12) }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-lg border-2 border-orange-300  from-white to-orange-50 flex flex-col items-center justify-center shadow-md hover:scale-105 transition-transform duration-200"
                >
                  <div className="text-xl">📦</div>
                  <div className="text-xs font-semibold text-slate-600">
                    S{i + 1}
                  </div>
                </div>
              ))}
              {serverCount > 12 && (
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-orange-300 bg-white/50 flex items-center justify-center">
                  <div className="text-sm text-slate-500">
                    +{serverCount - 12}
                  </div>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                ➡️ Distribute load across many small instances
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-100 shadow-inner">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-orange-700">
                    ⚖️ Trade-offs:
                  </span>{" "}
                  More engineering for state & coordination, better fault
                  tolerance.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="lg:w-56 p-4  from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl shadow-inner">
          <div className="font-bold text-orange-900 mb-3 text-base">
            🎯 When to choose:
          </div>
          {scale === "vertical" ? (
            <ul className="text-sm list-none space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Small-scale projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Stateful legacy systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Fewer moving parts to manage</span>
              </li>
            </ul>
          ) : (
            <ul className="text-sm list-none space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>High throughput requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Highly-available distributed systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Microservices & cloud-native apps</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
