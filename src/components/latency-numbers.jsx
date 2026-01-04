import {
  Zap,
  Clock,
  Database,
  Globe,
  HardDrive,
  Cpu,
  Radio,
} from "lucide-react"
import { useState } from "react"

/**
 *
 */
export default function LatencyNumbers() {
  const [selectedScale, setSelectedScale] = useState("log")

  // Latency numbers (in nanoseconds for consistency)
  const latencies = [
    {
      name: "L1 cache reference",
      ns: 0.5,
      icon: <Cpu className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      category: "CPU",
    },
    {
      name: "Branch mispredict",
      ns: 5,
      icon: <Cpu className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      category: "CPU",
    },
    {
      name: "L2 cache reference",
      ns: 7,
      icon: <Cpu className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      category: "CPU",
    },
    {
      name: "Mutex lock/unlock",
      ns: 25,
      icon: <Cpu className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      category: "CPU",
    },
    {
      name: "Main memory reference",
      ns: 100,
      icon: <HardDrive className="w-5 h-5" />,
      color: "from-indigo-500 to-purple-500",
      category: "Memory",
    },
    {
      name: "Compress 1K with Zippy",
      ns: 3000,
      icon: <Cpu className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      category: "CPU",
    },
    {
      name: "Send 1K over 1 Gbps network",
      ns: 10000,
      icon: <Radio className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
      category: "Network",
    },
    {
      name: "SSD random read",
      ns: 150000,
      icon: <HardDrive className="w-5 h-5" />,
      color: "from-red-500 to-rose-500",
      category: "Storage",
    },
    {
      name: "Read 1 MB sequentially from memory",
      ns: 250000,
      icon: <HardDrive className="w-5 h-5" />,
      color: "from-rose-500 to-pink-500",
      category: "Memory",
    },
    {
      name: "Round trip within datacenter",
      ns: 500000,
      icon: <Globe className="w-5 h-5" />,
      color: "from-amber-500 to-orange-500",
      category: "Network",
    },
    {
      name: "Read 1 MB sequentially from SSD",
      ns: 1000000,
      icon: <HardDrive className="w-5 h-5" />,
      color: "from-yellow-500 to-amber-500",
      category: "Storage",
    },
    {
      name: "Disk seek",
      ns: 10000000,
      icon: <Database className="w-5 h-5" />,
      color: "from-red-600 to-rose-600",
      category: "Storage",
    },
    {
      name: "Read 1 MB sequentially from disk",
      ns: 20000000,
      icon: <Database className="w-5 h-5" />,
      color: "from-red-600 to-rose-600",
      category: "Storage",
    },
    {
      name: "Send packet CA → Netherlands → CA",
      ns: 150000000,
      icon: <Globe className="w-5 h-5" />,
      color: "from-purple-600 to-indigo-600",
      category: "Network",
    },
  ]

  // Convert to human-readable format
  const formatLatency = (ns) => {
    if (ns < 1000) return `${ns} ns`
    if (ns < 1000000) return `${(ns / 1000).toFixed(1)} μs`
    if (ns < 1000000000) return `${(ns / 1000000).toFixed(1)} ms`
    return `${(ns / 1000000000).toFixed(1)} s`
  }

  // Get max value for scaling
  const maxNs = Math.max(...latencies.map((l) => l.ns))

  // Calculate bar width based on scale
  const getBarWidth = (ns) => {
    if (selectedScale === "log") {
      const maxLog = Math.log10(maxNs)
      const currentLog = Math.log10(ns)
      return (currentLog / maxLog) * 100
    } else {
      return (ns / maxNs) * 100
    }
  }

  // Human-friendly analogy
  const getAnalogy = (ns) => {
    const seconds = ns / 1000000000
    const scaled = seconds * 1000000000 // Scale to 1 second = 1 second

    if (scaled < 1) return `Blink of an eye`
    if (scaled < 60) return `${Math.round(scaled)} seconds`
    if (scaled < 3600) return `${Math.round(scaled / 60)} minutes`
    if (scaled < 86400) return `${Math.round(scaled / 3600)} hours`
    if (scaled < 2592000) return `${Math.round(scaled / 86400)} days`
    return `${Math.round(scaled / 2592000)} months`
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                Latency Numbers Every Programmer Should Know
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Updated for modern hardware (2024) • Originally by Jeff Dean
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setSelectedScale("log")}
              
            >
              Logarithmic
            </button>
            <button
              onClick={() => setSelectedScale("linear")}
              
            >
              Linear
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Key Insight */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 text-lg mb-2">
                Why This Matters
              </h4>
              <p className="text-blue-800 leading-relaxed">
                Understanding these numbers helps you make better architectural
                decisions. Memory is ~100x faster than SSD, SSD is ~10x faster
                than disk, and network calls can be orders of magnitude slower.{" "}
                <strong>
                  Avoid unnecessary network hops and optimize data access
                  patterns accordingly.
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Latency Bars */}
        <div className="space-y-4 mb-8">
          {latencies.map((item, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg  ${item.color} flex items-center justify-center text-white`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">
                    {formatLatency(item.ns)}
                  </div>
                  <div className="text-xs text-slate-500 hidden group-hover:block">
                    {item.ns.toLocaleString()} ns
                  </div>
                </div>
              </div>
              <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0  ${item.color} transition-all duration-500 flex items-center justify-end px-3`}
                  style={{ width: `${Math.max(getBarWidth(item.ns), 2)}%` }}
                >
                  <span className="text-xs font-semibold text-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    {getBarWidth(item.ns).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Reference Table */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            Quick Comparisons
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Memory vs Storage
              </div>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• RAM: ~100 ns</li>
                <li>• SSD: ~150,000 ns (1,500x slower)</li>
                <li>• HDD: ~10,000,000 ns (100,000x slower)</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Local vs Network
              </div>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• L1 cache: 0.5 ns</li>
                <li>• Datacenter round trip: 500,000 ns</li>
                <li>• Internet round trip: 150,000,000 ns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Practical Takeaways */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <span className="text-lg">✓</span> Do This
            </div>
            <ul className="text-sm text-green-800 space-y-2">
              <li>• Cache frequently accessed data</li>
              <li>• Use in-memory databases for hot data</li>
              <li>• Batch network requests</li>
              <li>• Use CDNs for static content</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <span className="text-lg">✗</span> Avoid This
            </div>
            <ul className="text-sm text-red-800 space-y-2">
              <li>• N+1 query problems</li>
              <li>• Disk seeks in hot paths</li>
              <li>• Chatty APIs (many small requests)</li>
              <li>• Sequential network calls</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span className="text-lg">⚡</span> Pro Tips
            </div>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Read 1MB from memory = 1 disk seek</li>
              <li>• SSD is 10-100x faster than HDD</li>
              <li>• Network within datacenter is cheap</li>
              <li>• Cross-region is expensive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
