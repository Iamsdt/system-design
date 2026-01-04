import { useState, useEffect } from "react"
import { Server, Database, Plus, Minus, Shuffle, RotateCcw } from "lucide-react"

export default function ConsistentHashing() {
  const [numServers, setNumServers] = useState(3)
  const [numVirtualNodes, setNumVirtualNodes] = useState(3)
  const [numKeys, setNumKeys] = useState(20)
  const [showVirtualNodes, setShowVirtualNodes] = useState(true)
  const [hashRing, setHashRing] = useState([])
  const [keys, setKeys] = useState([])
  const [highlightedServer, setHighlightedServer] = useState(null)

  // Simple hash function for demonstration
  const simpleHash = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash) % 360
  }

  // Color mapping for servers (using actual hex colors for SVG)
  const colorMap = {
    "from-blue-500 to-cyan-500": { start: "#3b82f6", end: "#06b6d4", tailwind: "from-blue-500 to-cyan-500" },
    "from-purple-500 to-pink-500": { start: "#a855f7", end: "#ec4899", tailwind: "from-purple-500 to-pink-500" },
    "from-green-500 to-emerald-500": { start: "#22c55e", end: "#10b981", tailwind: "from-green-500 to-emerald-500" },
    "from-orange-500 to-red-500": { start: "#f97316", end: "#ef4444", tailwind: "from-orange-500 to-red-500" },
    "from-yellow-500 to-amber-500": { start: "#eab308", end: "#f59e0b", tailwind: "from-yellow-500 to-amber-500" },
    "from-indigo-500 to-blue-500": { start: "#6366f1", end: "#3b82f6", tailwind: "from-indigo-500 to-blue-500" },
    "from-slate-400 to-slate-500": { start: "#94a3b8", end: "#64748b", tailwind: "from-slate-400 to-slate-500" }
  }

  // Generate servers and their virtual nodes
  useEffect(() => {
    const servers = []
    const serverColors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-yellow-500 to-amber-500",
      "from-indigo-500 to-blue-500"
    ]

    for (let i = 0; i < numServers; i++) {
      const serverName = `Server-${i + 1}`
      const color = serverColors[i % serverColors.length]

      // Add actual server
      servers.push({
        id: `server-${i}`,
        name: serverName,
        angle: simpleHash(serverName),
        isVirtual: false,
        color
      })

      // Add virtual nodes
      if (showVirtualNodes) {
        for (let v = 0; v < numVirtualNodes; v++) {
          const virtualName = `${serverName}-vnode-${v}`
          servers.push({
            id: `vnode-${i}-${v}`,
            name: serverName,
            displayName: `${serverName} (v${v + 1})`,
            angle: simpleHash(virtualName),
            isVirtual: true,
            color
          })
        }
      }
    }

    setHashRing(servers.sort((a, b) => a.angle - b.angle))
  }, [numServers, numVirtualNodes, showVirtualNodes])

  // Generate keys
  useEffect(() => {
    const newKeys = []
    for (let i = 0; i < numKeys; i++) {
      const keyName = `key-${i}`
      const angle = simpleHash(keyName)
      
      // Find which server this key maps to
      let assignedServer = hashRing.find(node => node.angle >= angle)
      if (!assignedServer) {
        assignedServer = hashRing[0]
      }

      newKeys.push({
        id: keyName,
        name: keyName,
        angle,
        server: assignedServer ? assignedServer.name : null,
        color: assignedServer ? assignedServer.color : "from-slate-400 to-slate-500"
      })
    }

    setKeys(newKeys)
  }, [hashRing, numKeys])

  // Calculate key distribution
  const getDistribution = () => {
    const dist = {}
    keys.forEach(key => {
      if (key.server) {
        dist[key.server] = (dist[key.server] || 0) + 1
      }
    })
    return dist
  }

  const distribution = getDistribution()

  // Get position on circle
  const getCirclePosition = (angle, radius) => {
    const radian = (angle * Math.PI) / 180
    return {
      x: 200 + radius * Math.cos(radian - Math.PI / 2),
      y: 200 + radius * Math.sin(radian - Math.PI / 2)
    }
  }

  const addServer = () => {
    if (numServers < 6) setNumServers(numServers + 1)
  }

  const removeServer = () => {
    if (numServers > 1) setNumServers(numServers - 1)
  }

  const redistributeKeys = () => {
    setNumKeys(Math.floor(Math.random() * 30) + 10)
  }

  const reset = () => {
    setNumServers(3)
    setNumVirtualNodes(3)
    setNumKeys(20)
    setShowVirtualNodes(true)
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              Consistent Hashing Visualizer
            </h3>
            <p className="text-sm mt-1">
              See how keys are distributed across servers using a hash ring
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Server Controls */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                Servers
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={removeServer}
                  disabled={numServers <= 1}
                  className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900">
                  {numServers}
                </div>
                <button
                  onClick={addServer}
                  disabled={numServers >= 6}
                  className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-xs text-slate-600">
              Add or remove servers to see how keys are redistributed
            </div>
          </div>

          {/* Virtual Nodes Control */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-slate-900">Virtual Nodes</div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVirtualNodes}
                    onChange={(e) => setShowVirtualNodes(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
                {showVirtualNodes && (
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={numVirtualNodes}
                    onChange={(e) => setNumVirtualNodes(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-center font-bold text-slate-900"
                  />
                )}
              </div>
            </div>
            <div className="text-xs text-slate-600">
              Virtual nodes improve load distribution
            </div>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-slate-700">
              Keys: {numKeys}
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={numKeys}
              onChange={(e) => setNumKeys(parseInt(e.target.value))}
              className="w-48 accent-purple-600"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={redistributeKeys}
              className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle Keys
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg bg-slate-500 text-white text-sm font-semibold hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Hash Ring Visualization */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4 text-center">
              Hash Ring (0° - 360°)
            </h4>
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Ring */}
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />
                
                {/* Servers */}
                {hashRing.map((node, index) => {
                  const pos = getCirclePosition(node.angle, 150)
                  const isHighlighted = highlightedServer === node.name
                  const colors = colorMap[node.color] || colorMap["from-slate-400 to-slate-500"]
                  
                  return (
                    <g key={index}>
                      <defs>
                        <linearGradient id={`gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={colors.start} />
                          <stop offset="100%" stopColor={colors.end} />
                        </linearGradient>
                      </defs>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={node.isVirtual ? 6 : 10}
                        className={`cursor-pointer transition-all ${isHighlighted ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                        fill={`url(#gradient-${node.id})`}
                        stroke="white"
                        strokeWidth="2"
                        onMouseEnter={() => setHighlightedServer(node.name)}
                        onMouseLeave={() => setHighlightedServer(null)}
                      />
                    </g>
                  )
                })}


                {/* Keys */}
                {keys.map((key, index) => {
                  const pos = getCirclePosition(key.angle, 120)
                  const isHighlighted = highlightedServer === key.server
                  
                  return (
                    <circle
                      key={index}
                      cx={pos.x}
                      cy={pos.y}
                      r="3"
                      className={`transition-all ${isHighlighted ? 'opacity-100' : 'opacity-40'}`}
                      fill={isHighlighted ? "#fbbf24" : "#94a3b8"}
                    />
                  )
                })}

                {/* Center text */}
                <text
                  x="200"
                  y="195"
                  textAnchor="middle"
                  className="text-xs font-bold fill-slate-500"
                >
                  {keys.length} keys
                </text>
                <text
                  x="200"
                  y="210"
                  textAnchor="middle"
                  className="text-xs fill-slate-400"
                >
                  {hashRing.length} nodes
                </text>
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full  from-blue-500 to-cyan-500"></div>
                <span className="text-slate-600">Physical Server</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full  from-purple-500 to-pink-500"></div>
                <span className="text-slate-600">Virtual Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <span className="text-slate-600">Key</span>
              </div>
            </div>
          </div>

          {/* Distribution Stats */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-4">Key Distribution</h4>
              <div className="space-y-3">
                {Object.entries(distribution).map(([server, count]) => {
                  const percentage = ((count / keys.length) * 100).toFixed(1)
                  const serverData = hashRing.find(n => n.name === server && !n.isVirtual)
                  
                  return (
                    <div
                      key={server}
                      className="cursor-pointer"
                      onMouseEnter={() => setHighlightedServer(server)}
                      onMouseLeave={() => setHighlightedServer(null)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full  ${serverData?.color || 'from-slate-400 to-slate-500'}`}></div>
                          <span className="text-sm font-semibold text-slate-900">{server}</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {count} keys ({percentage}%)
                        </div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full  ${serverData?.color || 'from-slate-400 to-slate-500'} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 mb-3">How It Works</h4>
              <ol className="text-sm text-blue-800 space-y-2">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Hash servers and keys to positions on a ring (0-360°)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Each key goes to the next server clockwise</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Virtual nodes improve distribution balance</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>Adding/removing servers only affects adjacent keys</span>
                </li>
              </ol>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h4 className="font-bold text-green-900 mb-3">Benefits</h4>
              <ul className="text-sm text-green-800 space-y-2">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span><strong>Minimal redistribution:</strong> Only ~1/N keys move when scaling</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span><strong>Load balancing:</strong> Virtual nodes ensure even distribution</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span><strong>Fault tolerant:</strong> Handles server failures gracefully</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
