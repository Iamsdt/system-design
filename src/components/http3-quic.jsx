import { useState } from "react"
import { Zap, Shield, ArrowRight, CheckCircle, XCircle, Clock, Network, Server } from "lucide-react"

export default function Http3Quic() {
  const [selectedVersion, setSelectedVersion] = useState("http3")
  const [showComparison, setShowComparison] = useState("features")

  const httpVersions = {
    http1: {
      name: "HTTP/1.1",
      year: 1997,
      transport: "TCP",
      color: "slate",
      features: [
        { name: "Text-based protocol", supported: true },
        { name: "Head-of-line blocking", supported: false },
        { name: "Multiple connections needed", supported: false },
        { name: "Connection reuse", supported: true, note: "Keep-Alive" },
        { name: "Compression", supported: true, note: "gzip, deflate" },
        { name: "Multiplexing", supported: false },
      ],
      pros: ["Simple", "Universal support", "Easy to debug"],
      cons: ["Head-of-line blocking", "6-8 connections per domain", "No multiplexing"],
    },
    http2: {
      name: "HTTP/2",
      year: 2015,
      transport: "TCP + TLS",
      color: "blue",
      features: [
        { name: "Binary protocol", supported: true },
        { name: "Multiplexing", supported: true },
        { name: "Server Push", supported: true },
        { name: "Header compression (HPACK)", supported: true },
        { name: "Stream prioritization", supported: true },
        { name: "Head-of-line blocking", supported: false, note: "Still at TCP level" },
      ],
      pros: ["Single connection", "Multiplexed streams", "Header compression", "Better performance"],
      cons: ["TCP head-of-line blocking", "Complex to debug", "Server push rarely used"],
    },
    http3: {
      name: "HTTP/3",
      year: 2022,
      transport: "QUIC (UDP)",
      color: "purple",
      features: [
        { name: "QUIC protocol (UDP-based)", supported: true },
        { name: "No head-of-line blocking", supported: true },
        { name: "0-RTT connection resumption", supported: true },
        { name: "Connection migration", supported: true },
        { name: "Built-in encryption", supported: true, note: "TLS 1.3 integrated" },
        { name: "Multiplexing", supported: true },
      ],
      pros: [
        "Eliminates TCP head-of-line blocking",
        "Faster connection establishment",
        "Better on mobile (connection migration)",
        "Built-in encryption",
      ],
      cons: ["UDP blocked by some firewalls", "Less mature ecosystem", "Harder to debug"],
    },
  }

  const quicFeatures = [
    {
      icon: Zap,
      title: "0-RTT Connection Resumption",
      desc: "Resume previous connection instantly without handshake",
      detail:
        "After first connection, client can send encrypted data immediately on next connection. Reduces latency from 1-2 RTT to 0 RTT.",
      example: "Perfect for mobile apps that frequently reconnect",
    },
    {
      icon: Network,
      title: "Connection Migration",
      desc: "Switch networks without dropping connection",
      detail:
        "Connection identified by Connection ID (not IP). When switching from WiFi to cellular, connection continues seamlessly.",
      example: "User walks out of WiFi range - connection stays alive on cellular",
    },
    {
      icon: Server,
      title: "Independent Streams",
      desc: "Packet loss affects only one stream, not all",
      detail:
        "Unlike TCP where one lost packet blocks all streams, QUIC allows other streams to continue processing.",
      example: "Image loading failure doesn't block HTML/CSS delivery",
    },
    {
      icon: Shield,
      title: "Built-in Encryption (TLS 1.3)",
      desc: "Encryption is mandatory and integrated",
      detail: "TLS handshake happens during QUIC handshake, not separately. All packets are encrypted by default.",
      example: "Cannot use QUIC without encryption - security by default",
    },
  ]

  const timeline = [
    {
      version: "HTTP/1.0",
      year: 1996,
      key: "Basic request-response",
      desc: "One request per connection",
    },
    {
      version: "HTTP/1.1",
      year: 1997,
      key: "Keep-Alive connections",
      desc: "Connection reuse, chunked encoding",
    },
    {
      version: "SPDY",
      year: 2012,
      key: "Google's experiment",
      desc: "Multiplexing, server push - basis for HTTP/2",
    },
    {
      version: "HTTP/2",
      year: 2015,
      key: "Binary multiplexing",
      desc: "Single connection, header compression",
    },
    {
      version: "QUIC (gQUIC)",
      year: 2013,
      key: "Google's UDP experiment",
      desc: "Fast, encrypted, multiplexed over UDP",
    },
    {
      version: "HTTP/3",
      year: 2022,
      key: "QUIC standardized",
      desc: "HTTP over QUIC, no TCP head-of-line blocking",
    },
  ]

  const browserSupport = [
    { browser: "Chrome", version: "87+", support: "full", notes: "Enabled by default" },
    { browser: "Firefox", version: "88+", support: "full", notes: "Enabled by default" },
    { browser: "Safari", version: "14+", support: "full", notes: "macOS 11+, iOS 14+" },
    { browser: "Edge", version: "87+", support: "full", notes: "Chromium-based" },
    { browser: "Opera", version: "73+", support: "full", notes: "Chromium-based" },
  ]

  const whenToUse = [
    {
      scenario: "Mobile Applications",
      recommended: "http3",
      reason: "Connection migration handles network switches gracefully",
      impact: "Better user experience when switching WiFi/cellular",
    },
    {
      scenario: "High-latency Networks",
      recommended: "http3",
      reason: "0-RTT resumption reduces connection establishment overhead",
      impact: "Faster page loads on slow networks",
    },
    {
      scenario: "Media Streaming",
      recommended: "http3",
      reason: "Independent streams prevent packet loss from blocking everything",
      impact: "Smoother streaming with fewer stutters",
    },
    {
      scenario: "Corporate Networks",
      recommended: "http2",
      reason: "UDP often blocked by firewalls, HTTP/2 over TCP more reliable",
      impact: "Better compatibility, automatic fallback",
    },
    {
      scenario: "REST APIs",
      recommended: "http2",
      reason: "Multiplexing sufficient, simpler debugging",
      impact: "Good performance without UDP complexity",
    },
  ]

  return (
    <div className="space-y-8">
      {/* HTTP Evolution Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Evolution of HTTP</h3>
        <p className="text-slate-600 mb-6">From HTTP/1.0 to HTTP/3 - 26 years of optimization</p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 via-blue-400 to-purple-600" />

          <div className="space-y-6">
            {timeline.map((item, index) => {
              const isHttp3 = item.version === "HTTP/3"
              const isHttp2 = item.version === "HTTP/2"

              return (
                <div key={index} className="relative pl-12">
                  <div
                    className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      isHttp3
                        ? "bg-purple-600"
                        : isHttp2
                          ? "bg-blue-600"
                          : "bg-slate-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={`bg-slate-50 rounded-lg p-4 border ${
                      isHttp3
                        ? "border-purple-300 bg-purple-50"
                        : isHttp2
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900">{item.version}</h4>
                      <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded">
                        {item.year}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-purple-700 mb-1">{item.key}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Version Comparison */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Compare HTTP Versions</h3>
        <p className="text-slate-600 mb-6">See how each version improved upon the last</p>

        {/* Version Selector */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(httpVersions).map(([key, version]) => (
            <button
              key={key}
              onClick={() => setSelectedVersion(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedVersion === key
                  ? `bg-${version.color}-600 text-white shadow-lg`
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {version.name}
            </button>
          ))}
        </div>

        {/* Selected Version Details */}
        <div className=" from-slate-50 to-blue-50 rounded-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-bold text-slate-900">{httpVersions[selectedVersion].name}</h4>
            <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded-full">
              Released: {httpVersions[selectedVersion].year}
            </span>
          </div>

          <div className="mb-4">
            <span className="text-sm font-medium text-slate-700">Transport:</span>
            <span className="ml-2 text-sm font-semibold text-purple-700">
              {httpVersions[selectedVersion].transport}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-slate-900 mb-3">Features:</h5>
              <div className="space-y-2">
                {httpVersions[selectedVersion].features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {feature.supported ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm text-slate-900">{feature.name}</p>
                      {feature.note && <p className="text-xs text-slate-600">{feature.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-slate-900 mb-3">Pros & Cons:</h5>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-green-700 mb-2">✓ Advantages:</p>
                  <ul className="space-y-1">
                    {httpVersions[selectedVersion].pros.map((pro, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-700 mb-2">✗ Disadvantages:</p>
                  <ul className="space-y-1">
                    {httpVersions[selectedVersion].cons.map((con, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUIC Key Features */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-600" />
          QUIC Protocol - Key Innovations
        </h3>
        <p className="text-slate-600 mb-6">What makes QUIC special compared to TCP</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quicFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900">{feature.title}</h4>
                    <p className="text-sm text-slate-700 mt-1">{feature.desc}</p>
                  </div>
                </div>
                <div className="bg-white rounded p-3 mb-2 border border-purple-100">
                  <p className="text-xs font-medium text-purple-900 mb-1">How it works:</p>
                  <p className="text-xs text-slate-600">{feature.detail}</p>
                </div>
                <div className=" from-purple-100 to-blue-100 rounded p-3">
                  <p className="text-xs font-medium text-purple-900 mb-1">Real-world example:</p>
                  <p className="text-xs text-slate-700">{feature.example}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Browser Support */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Browser Support for HTTP/3</h3>
        <p className="text-slate-600 mb-6">As of 2024, all major browsers support HTTP/3</p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Browser</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Version</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Support</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              {browserSupport.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{item.browser}</td>
                  <td className="py-3 px-4 text-slate-700">{item.version}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      <CheckCircle className="w-3 h-3" />
                      Full
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Browsers automatically fall back to HTTP/2 or HTTP/1.1 if HTTP/3 is unavailable.
            No special handling needed in most cases.
          </p>
        </div>
      </div>

      {/* When to Use What */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-600" />
          Decision Guide: When to Use What
        </h3>
        <p className="text-slate-600 mb-6">Choose the right protocol based on your use case</p>

        <div className="space-y-4">
          {whenToUse.map((item, index) => {
            const isHttp3 = item.recommended === "http3"
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  isHttp3
                    ? "border-purple-300 bg-purple-50"
                    : "border-blue-300 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-900">{item.scenario}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isHttp3
                        ? "bg-purple-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    Use {item.recommended.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                  <strong>Why:</strong> {item.reason}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Impact:</strong> {item.impact}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Interview Tips */}
      <div className=" from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Server className="w-5 h-5" />
          Interview Tips: HTTP/3 & QUIC
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <p className="text-sm font-semibold text-purple-900 mb-2">
              Q: What problem does HTTP/3 solve that HTTP/2 doesn't?
            </p>
            <p className="text-sm text-slate-700">
              <strong>A:</strong> TCP head-of-line blocking. In HTTP/2, one lost TCP packet blocks all multiplexed
              streams. HTTP/3 uses QUIC (UDP) where streams are independent - packet loss only affects one stream.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <p className="text-sm font-semibold text-purple-900 mb-2">
              Q: Why is HTTP/3 better for mobile?
            </p>
            <p className="text-sm text-slate-700">
              <strong>A:</strong> Connection migration. QUIC connections are identified by Connection ID, not IP address.
              When switching from WiFi to cellular, the connection continues seamlessly without re-establishing.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <p className="text-sm font-semibold text-purple-900 mb-2">Q: What is 0-RTT and why is it significant?</p>
            <p className="text-sm text-slate-700">
              <strong>A:</strong> Zero Round-Trip Time resumption lets clients send encrypted application data
              immediately on reconnection, without waiting for handshake. Reduces latency dramatically for repeat
              connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
