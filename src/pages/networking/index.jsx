import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

/**
 *
 */
export default function Networking() {
  const nav = useNavigate()
  const [activeLayer, setActiveLayer] = useState(null)
  const [dnsStep, setDnsStep] = useState(0)
  const [protocol, setProtocol] = useState("tcp")
  const sectionsReference = useRef([])

  // New State for Advanced Features
  const [showNat, setShowNat] = useState(false)
  const [dnsTtl, setDnsTtl] = useState(300)
  const [geoRegion, setGeoRegion] = useState("us")

  // CDN Demo State
  const [cdnStatus, setCdnStatus] = useState("idle")
  // idle, request, origin-fetch, edge-store, delivered
  const [isCacheHit, setIsCacheHit] = useState(false)

  // OSI Model Data
  const osiLayers = [
    {
      id: 7,
      name: "Application",
      desc: "End-user processes (HTTP, SMTP)",
      protocols: ["HTTP/S", "DNS", "SMTP", "SSH"],
      color: "bg-indigo-500",
    },
    {
      id: 6,
      name: "Presentation",
      desc: "Data translation/encryption (SSL/TLS)",
      protocols: ["SSL", "TLS", "JPEG", "ASCII"],
      color: "bg-indigo-400",
    },
    {
      id: 5,
      name: "Session",
      desc: "Session management",
      protocols: ["Sockets", "RPC"],
      color: "bg-indigo-300",
    },
    {
      id: 4,
      name: "Transport",
      desc: "End-to-end connections (TCP/UDP)",
      protocols: ["TCP", "UDP"],
      color: "bg-blue-500",
    },
    {
      id: 3,
      name: "Network",
      desc: "Routing & Addressing (IP)",
      protocols: ["IPv4", "IPv6", "ICMP"],
      color: "bg-blue-400",
    },
    {
      id: 2,
      name: "Data Link",
      desc: "Physical addressing (MAC)",
      protocols: ["Ethernet", "WiFi"],
      color: "bg-blue-300",
    },
    {
      id: 1,
      name: "Physical",
      desc: "Cables & Signals (Bits)",
      protocols: ["Fiber", "Cat6"],
      color: "bg-blue-200",
    },
  ]

  // DNS Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDnsStep((previous) => (previous + 1) % 5)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-8")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    )

    sectionsReference.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative gradient-overlay py-20 md:py-32 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="text-sm font-medium text-blue-700">
                Module 2
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Networking, Delivery & <span className="text-gradient">Edge</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Master the networking fundamentals that power the internet. From
              IP addressing and DNS resolution to CDNs, load balancers, and
              modern protocols. Interactive demos and real-world examples
              included.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-16 space-y-20">
        {/* Section 1: OSI Model */}
        <section
          ref={(element) => (sectionsReference.current[0] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="mb-8">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              01 — Fundamentals
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              OSI 7-Layer Model
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl">
              The conceptual framework identifying the parts of network
              communication. Focus on Layer 4 (Transport) and Layer 7
              (Application).
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="space-y-2">
                {osiLayers.map((layer) => (
                  <div
                    key={layer.id}
                    onMouseEnter={() => setActiveLayer(layer.id)}
                    onMouseLeave={() => setActiveLayer(null)}
                    className={`
                      relative p-4 rounded-lg cursor-pointer transition-all duration-300 transform
                      ${activeLayer === layer.id ? "scale-105 shadow-md z-10" : "hover:bg-slate-50"}
                      ${activeLayer === layer.id ? "bg-white ring-2 ring-blue-500" : ""}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm
                        ${layer.color}
                      `}
                      >
                        L{layer.id}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">
                          {layer.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {layer.desc}
                        </div>
                      </div>
                      {activeLayer === layer.id && (
                        <div className="text-xs font-semibold text-blue-600 animate-fade-in px-2 py-1 bg-blue-50 rounded">
                          {layer.protocols.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 h-full flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Key Distinctions
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                  <div className="font-bold text-blue-800 mb-1">
                    Layer 4 (Transport)
                  </div>
                  <p className="text-sm text-slate-600">
                    Focuses on end-to-end delivery (TCP/UDP). Load balancers
                    here are faster but "dumber" - they route based on IP:Port.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                  <div className="font-bold text-indigo-800 mb-1">
                    Layer 7 (Application)
                  </div>
                  <p className="text-sm text-slate-600">
                    Focuses on content (HTTP). Load balancers here are slower
                    but smarter - they can route based on URL paths, headers,
                    etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: DNS & IP */}
        <section
          ref={(element) => (sectionsReference.current[1] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="mb-8">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              02 — Addressing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              IP/DNS Basics, TTL & Geo-Routing
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl">
              How domain names become IP addresses. The phonebook of the
              internet.
            </p>
          </div>

          {/* Why/How/When/Trade-offs - DNS */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Why This Matters
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Every request starts with finding the server. Performance depends on routing users to the closest healthy node. DNS is the foundation of distributed systems.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span> How It Works
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  DNS records (A, CNAME, NS), Anycast IP for geo-routing, and TTL for caching. Resolver queries flow: Client → Root → TLD → Authoritative NS.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⏰</span> When To Use
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Designing global systems or debugging connectivity/latency issues. Essential for multi-region deployments and failover strategies.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚖️</span> Trade-offs
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Low TTL = fresher data but higher DNS load/latency. High TTL = better caching but risk of stale endpoints during failover.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <h3 className="text-xl font-bold mb-8 text-center">
              DNS Recursive Resolution Flow
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 relative z-10">
              {[
                { icon: "💻", label: "Client" },
                { icon: "📡", label: "Resolver" },
                { icon: "ROOT", label: "Root (.)" },
                { icon: "TLD", label: ".com" },
                { icon: "NS", label: "aws.com" },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`
                  flex flex-col items-center transition-all duration-500
                  ${index === dnsStep ? "scale-110 opacity-100" : "opacity-50"}
                `}
                >
                  <div
                    className={`
                    w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2
                    ${index === dnsStep ? "bg-blue-500 shadow-lg shadow-blue-500/50" : "bg-slate-700"}
                  `}
                  >
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium">{step.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-cyan-400 font-mono text-lg">
                {dnsStep === 0 && "Where is example.com?"}
                {dnsStep === 1 && "Asking Root Server..."}
                {dnsStep === 2 && "Root says: Check .com TLD"}
                {dnsStep === 3 && "TLD says: Check AWS NS"}
                {dnsStep === 4 && "NS says: IP is 93.184.216.34"}
              </div>
            </div>
          </div>

          {/* IP Fundamentals Deep Dive */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Public vs Private IPs
              </h3>
              <div className="relative h-60 bg-slate-50 rounded-lg border border-slate-100 p-4 flex items-center justify-center overflow-hidden">
                {!showNat ? (
                  <div
                    className="text-center space-y-4 cursor-pointer"
                    onClick={() => setShowNat(true)}
                  >
                    <div className="text-4xl">🏠</div>
                    <div className="text-sm font-semibold text-slate-600">
                      Private Network
                    </div>
                    <div className="text-xs text-slate-500">192.168.1.X</div>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold animate-bounce">
                      Click to see NAT
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-between relative animate-fade-in"
                    onClick={() => setShowNat(false)}
                  >
                    {/* Home */}
                    <div className="flex flex-col items-center z-10">
                      <div className="bg-white p-2 rounded shadow-sm border text-xs mb-1">
                        192.168.1.5
                      </div>
                      <div className="text-2xl">💻</div>
                    </div>

                    {/* Router / NAT */}
                    <div className="flex flex-col items-center z-10">
                      <div className="bg-orange-100 p-2 rounded shadow-sm border border-orange-200 text-xs mb-1 font-bold">
                        203.0.113.1
                      </div>
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                        NAT
                      </div>
                      <div className="bg-slate-100 p-2 rounded shadow-sm border text-xs mt-1">
                        192.168.1.1
                      </div>
                    </div>

                    {/* Internet */}
                    <div className="flex flex-col items-center z-10">
                      <div className="bg-blue-50 p-2 rounded shadow-sm border border-blue-100 text-xs mb-1">
                        8.8.8.8
                      </div>
                      <div className="text-2xl">☁️</div>
                    </div>

                    {/* Connection Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -mt-4 z-0"></div>
                    <div className="absolute top-1/2 left-1/4 -mt-6 text-[10px] text-slate-400">
                      Private
                    </div>
                    <div className="absolute top-1/2 right-1/4 -mt-6 text-[10px] text-slate-400">
                      Public
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Devices get <b>Private IPs</b> (free, reusable) locally. The
                Router uses <b>NAT</b> to map them to one <b>Public IP</b> to
                talk to the internet.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                IP Versions
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="font-bold text-blue-800 w-16">IPv4</div>
                  <div className="text-sm text-slate-700">
                    <div className="font-mono text-xs bg-white/50 inline-block px-1 rounded mb-1">
                      192.168.1.1
                    </div>
                    <div>
                      32-bit. ~4.3 billion addresses. Exhausted long ago. Relies
                      on NAT to survive.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="font-bold text-purple-800 w-16">IPv6</div>
                  <div className="text-sm text-slate-700">
                    <div className="font-mono text-xs bg-white/50 inline-block px-1 rounded mb-1">
                      2001:0db8:85a3...
                    </div>
                    <div>
                      128-bit. 340 undecillion addresses. Every atom on Earth
                      could have an IP. No NAT needed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DNS Advanced Features */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Advanced DNS Concepts
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* TTL Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-800">
                    TTL (Time To Live)
                  </h4>
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                    {dnsTtl}s
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="3600"
                  step="60"
                  value={dnsTtl}
                  onChange={(e) => setDnsTtl(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-4Accent-blue-600"
                />
                <div className="flex items-center gap-4 text-sm mt-4">
                  <div
                    className={`
                    w-4 h-4 rounded-full 
                    ${dnsTtl < 300 ? "bg-orange-500" : "bg-green-500"}
                  `}
                  ></div>
                  <p className="text-slate-600">
                    {dnsTtl < 300
                      ? "Fast updates, higher load on DNS servers."
                      : "Slower updates, better caching performance."}
                  </p>
                </div>
              </div>

              {/* Geo-Routing Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4">
                  Geo-Latency Routing
                </h4>
                <div className="flex gap-2 mb-4">
                  {["us", "eu", "asia"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setGeoRegion(r)}
                      className={`
                        px-3 py-1 rounded text-sm font-medium uppercase transition-colors
                        ${geoRegion === r ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}
                      `}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="relative h-32 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center font-mono text-sm">
                  <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-10 bg-center bg-no-repeat bg-contain"></div>

                  {/* Simulation */}
                  <div className="z-10 text-center">
                    <div className="text-slate-400 text-xs mb-1">
                      Resolved IP for {geoRegion.toUpperCase()} User:
                    </div>
                    <div className="text-green-400 font-bold text-lg animate-pulse">
                      {geoRegion === "us" && "104.21.55.1 (New York)"}
                      {geoRegion === "eu" && "185.199.108.153 (London)"}
                      {geoRegion === "asia" && "202.168.1.1 (Singapore)"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: TCP vs UDP */}
        <section
          ref={(element) => (sectionsReference.current[2] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="mb-8">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              03 — Protocols
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              TCP vs UDP: Transport Protocol Trade-offs
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mb-6">
              Understanding the fundamental difference between reliable and fast transport.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setProtocol("tcp")}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${protocol === "tcp" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                TCP (Reliable)
              </button>
              <button
                onClick={() => setProtocol("udp")}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${protocol === "udp" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                UDP (Fast)
              </button>
            </div>
          </div>

          {/* Why/How/When/Trade-offs - TCP/UDP */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Why This Matters
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Protocols dictate performance. TCP is reliable but slow; UDP is fast but unreliable. Choosing wrong protocol can make or break real-time applications.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span> How To Choose
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Use TCP for data integrity (web, email, file transfer). Use UDP for speed-critical apps (gaming, streaming, VoIP) where occasional packet loss is acceptable.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⏰</span> When To Use
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  TCP: REST APIs, databases, file transfers. UDP: Video streaming, online gaming, DNS lookups, real-time monitoring.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚖️</span> Trade-offs
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  TCP: Guaranteed delivery but higher latency. UDP: Fast but requires custom reliability logic. QUIC (HTTP/3) gets best of both.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm transition-all duration-500 min-h-[400px]">
            {protocol === "tcp" ? (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🤝</div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600">
                      Transmission Control Protocol
                    </h3>
                    <p className="text-slate-600">
                      Connection-oriented, reliable, ordered
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-4">
                      How it works (3-Way Handshake)
                    </h4>
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Client</span>
                        <span>Server</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-200 flex justify-between">
                        <span>SYN →</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-200 flex justify-between">
                        <span>← SYN-ACK</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-200 flex justify-between">
                        <span>ACK →</span>
                      </div>
                      <div className="text-center text-green-600 text-xs font-bold py-1">
                        ✨ Connected! Data flows...
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4">
                      Properties
                    </h4>
                    <ul className="space-y-3">
                      {[
                        "Guaranteed Delivery (No packet loss)",
                        "Ordered Packets (1, 2, 3...)",
                        "Flow Control & Congestion Control",
                        "Slower (due to overhead)",
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-slate-700"
                        >
                          <span className="text-blue-500">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Use Cases:
                      </span>
                      <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm">
                          Web (HTTP)
                        </span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm">
                          Email
                        </span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm">
                          File Transfer
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🚀</div>
                  <div>
                    <h3 className="text-2xl font-bold text-orange-500">
                      User Datagram Protocol
                    </h3>
                    <p className="text-slate-600">
                      Connectionless, fast, fire-and-forget
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-orange-50 p-6 rounded-xl">
                    <h4 className="font-bold text-slate-900 mb-4">
                      How it works
                    </h4>
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Client</span>
                        <span>Server</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-orange-200">
                        DATA Packet 1 →
                      </div>
                      <div className="bg-white p-2 rounded border border-orange-200">
                        DATA Packet 2 →
                      </div>
                      <div className="bg-white p-2 rounded border border-orange-200">
                        DATA Packet 3 → (Lost? Don't care!)
                      </div>
                      <div className="bg-white p-2 rounded border border-orange-200">
                        DATA Packet 4 →
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4">
                      Properties
                    </h4>
                    <ul className="space-y-3">
                      {[
                        "No Handshake (Instant start)",
                        "Packets may arrive out of order",
                        "No Retries (Fire and forget)",
                        "Extremely Fast & Lightweight",
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-slate-700"
                        >
                          <span className="text-orange-500">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Use Cases:
                      </span>
                      <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm">
                          Video Streaming
                        </span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm">
                          Gaming
                        </span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm">
                          VoIP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 3B: HTTP Evolution */}
        <section
          ref={(element) => (sectionsReference.current[2.5] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="mb-8">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              03B — Evolution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              HTTP/1.1 vs HTTP/2 vs HTTP/3
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl">
              How the web protocol evolved to be faster and more efficient.
            </p>
          </div>

          {/* Why/How/When/Trade-offs - HTTP Evolution */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Why Evolution Matters
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  HTTP/2+3 fix head-of-line blocking and improve performance significantly. Modern web apps need these protocols for optimal user experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span> How To Implement
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Use HTTP/2 for multiplexing over TCP; HTTP/3 (QUIC) for lossy networks. Offload TLS at load balancer to save app server CPU.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⏰</span> When To Upgrade
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  High-traffic web apps benefit from HTTP/2. Mobile apps and video streaming should use HTTP/3. Most CDNs support both automatically.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚖️</span> Trade-offs
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  HTTP/3 requires UDP support (some firewalls block it). HTTP/2 still uses TCP, so TCP head-of-line blocking remains. Migration requires infrastructure updates.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="text-2xl font-bold text-slate-300 mb-2">1997</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                HTTP/1.1
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Text-based protocol. One request per connection (head-of-line
                blocking).
              </p>
              <div className="bg-slate-50 p-3 rounded text-xs font-mono text-slate-700">
                GET /index.html
                <br />
                Wait...
                <br />
                GET /style.css
                <br />
                Wait...
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm border-t-4 border-t-blue-500">
              <div className="text-2xl font-bold text-blue-200 mb-2">2015</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">HTTP/2</h3>
              <p className="text-sm text-slate-600 mb-4">
                Binary protocol. Multiplexing (many requests at once). Header
                compression.
              </p>
              <div className="bg-blue-50 p-3 rounded text-xs font-mono text-blue-900">
                Stream 1: GET /index.html
                <br />
                Stream 2: GET /style.css
                <br />
                (Parallel over 1 TCP conn)
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm border-t-4 border-t-purple-500">
              <div className="text-2xl font-bold text-purple-200 mb-2">
                2022
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                HTTP/3 (QUIC)
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Based on UDP! No TCP HoL blocking. Better for mobile/lossy
                networks.
              </p>
              <div className="bg-purple-50 p-3 rounded text-xs font-mono text-purple-900">
                QUIC Packet (UDP)
                <br />
                Built-in TLS 1.3
                <br />
                Native Multiplexing
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: CDN & Edge (Interactive) */}
        <section
          ref={(element) => (sectionsReference.current[3] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="mb-8">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              04 — Delivery
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Content Delivery Networks (CDN) Deep Dive
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl">
              Understand how CDNs dramatically reduce latency by caching content
              closer to users. See it in action with our interactive demo.
            </p>
          </div>

          {/* Why/How/When/Trade-offs - CDN */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Why CDNs Are Critical
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Serve static content from the edge (close to user) to reduce latency and origin load. Can improve performance by 80-90% for global audiences.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span> How To Choose
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Pull (fetch on miss) for automation and dynamic content. Push (upload) for control and static sites. Invalidate via TTL or explicit purge.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⏰</span> When To Use
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Serving images, CSS, JS, or video to a distributed audience. Essential for media sites, e-commerce, and global SaaS applications.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚖️</span> Trade-offs
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Pull is easier but has "cold start" latency on first request. Push ensures availability but adds deployment complexity and storage costs.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive CDN Demo */}
          <div className="bg-slate-900 rounded-2xl p-8 mb-8 text-white relative overflow-hidden min-h-[400px]">
            {/* Controls */}
            <div className="absolute top-6 right-6 z-20 flex gap-4">
              <button
                onClick={() => {
                  if (cdnStatus !== "idle") return
                  setCdnStatus("request")
                  setTimeout(() => {
                    // Check if hit
                    if (isCacheHit) {
                      setCdnStatus("delivered")
                      setTimeout(() => setCdnStatus("idle"), 2000)
                    } else {
                      setCdnStatus("origin-fetch")
                      setTimeout(() => {
                        setCdnStatus("edge-store")
                        setTimeout(() => {
                          setIsCacheHit(true)
                          setCdnStatus("delivered")
                          setTimeout(() => setCdnStatus("idle"), 2000)
                        }, 1500)
                      }, 1500)
                    }
                  }, 1000)
                }}
                disabled={cdnStatus !== "idle"}
                className={`
                   px-6 py-2 rounded-full font-bold shadow-lg transition-all
                   ${cdnStatus === "idle" ? "bg-blue-600 hover:bg-blue-500 hover:scale-105" : "bg-slate-700 cursor-not-allowed"}
                 `}
              >
                {cdnStatus === "idle" ? "Request Data 🚀" : "Processing..."}
              </button>
              {isCacheHit && (
                <button
                  onClick={() => setIsCacheHit(false)}
                  className="px-4 py-2 rounded-full font-bold border border-red-500 text-red-500 hover:bg-red-500/10"
                >
                  Purge Cache 🗑️
                </button>
              )}
            </div>

            {/* Visualization */}
            <div className="flex items-center justify-between h-full pt-12 relative z-10">
              {/* User */}
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-2">🧑‍💻</div>
                <div className="font-bold">User</div>
                <div className="text-xs text-slate-400">San Francisco</div>
              </div>

              {/* Edge Node */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`
                   w-24 h-24 rounded-2xl border-2 flex items-center justify-center text-3xl transition-all duration-300
                   ${isCacheHit ? "bg-green-500/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]" : "bg-slate-800 border-slate-600"}
                 `}
                >
                  {isCacheHit ? "💾" : "❌"}
                </div>
                <div className="font-bold mt-4">Edge Node</div>
                <div className="text-xs text-slate-400">
                  Los Angeles (Close!)
                </div>
                <div className="text-xs mt-1 font-mono text-blue-400">
                  {isCacheHit ? "Cache: HIT" : "Cache: MISS"}
                </div>
              </div>

              {/* Origin */}
              <div
                className={`flex flex-col items-center transition-opacity duration-300 ${isCacheHit ? "opacity-30 blur-[1px]" : "opacity-100"}`}
              >
                <div className="text-4xl mb-2">🏢</div>
                <div className="font-bold">Origin Server</div>
                <div className="text-xs text-slate-400">New York (Far!)</div>
              </div>
            </div>

            {/* Animated Packets */}
            {cdnStatus !== "idle" && (
              <>
                {/* User to Edge */}
                <div
                  className={`
                   absolute top-1/2 left-[10%] w-3 h-3 bg-blue-400 rounded-full z-20 animate-ping
                   ${cdnStatus === "request" ? "translate-x-[200px] transition-transform duration-1000" : ""}
                 `}
                ></div>

                {/* Edge to Origin (Only on Miss) */}
                {cdnStatus === "origin-fetch" && (
                  <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-orange-500 rounded-full z-20 animate-ping translate-x-[200px] transition-transform duration-1500"></div>
                )}
                {/* Origin to Edge (Return) */}
                {cdnStatus === "edge-store" && (
                  <div className="absolute top-1/2 right-[20%] w-3 h-3 bg-green-400 rounded-full z-20 animate-ping -translate-x-[200px] transition-transform duration-1500"></div>
                )}

                {/* Edge to User (Delivery) */}
                {cdnStatus === "delivered" && (
                  <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-green-400 rounded-full z-20 animate-ping -translate-x-[350px] transition-transform duration-1000"></div>
                )}
              </>
            )}

            {/* Status Text Area */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <code className="bg-black/30 px-4 py-2 rounded text-cyan-300 font-mono">
                {cdnStatus === "idle" && "Ready for request..."}
                {cdnStatus === "request" && "User requesting content..."}
                {cdnStatus === "origin-fetch" &&
                  "MISS! Fetching from Origin (High Latency)..."}
                {cdnStatus === "edge-store" &&
                  "Origin responding... Caching at Edge..."}
                {cdnStatus === "delivered" &&
                  isCacheHit &&
                  "HIT! Served instantly from Edge!"}
                {cdnStatus === "delivered" &&
                  !isCacheHit &&
                  "Content delivered (and now cached)."}
              </code>
            </div>
          </div>

          {/* Push vs Pull CDN */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl">
                  📤
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Push CDN</h3>
              </div>

              <p className="text-slate-700 mb-6">
                You manually upload content to CDN servers when it changes. You
                control exactly what's cached.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    How It Works
                  </h4>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
                      <li>You deploy new content (images, JS, CSS)</li>
                      <li>You push it directly to CDN nodes</li>
                      <li>CDN stores it until you update/delete</li>
                      <li>Users get served from CDN immediately</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-green-600 mb-2">
                    ✓ Advantages
                  </h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Minimized traffic from origin</li>
                    <li>• Full control over content timing</li>
                    <li>• Good for sites with infrequent updates</li>
                    <li>• Predictable storage costs</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-red-600 mb-2">
                    ✗ Disadvantages
                  </h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Requires manual maintenance</li>
                    <li>• Must manage uploads yourself</li>
                    <li>• Pay for storage even if not accessed</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Best For:
                  </div>
                  <div className="text-sm text-slate-600">
                    Static sites, marketing sites, assets that rarely change
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl">
                  📥
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Pull CDN</h3>
              </div>

              <p className="text-slate-700 mb-6">
                CDN automatically fetches content from your origin server when
                first requested by a user.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    How It Works
                  </h4>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
                      <li>User requests content for first time</li>
                      <li>CDN doesn't have it (cache MISS)</li>
                      <li>CDN pulls from your origin server</li>
                      <li>CDN caches it and serves to user</li>
                      <li>Next requests = cache HIT (fast!)</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-green-600 mb-2">
                    ✓ Advantages
                  </h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Automatic content distribution</li>
                    <li>• No manual uploads needed</li>
                    <li>• Only popular content cached</li>
                    <li>• Lower storage costs</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-red-600 mb-2">
                    ✗ Disadvantages
                  </h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• First request always slower (cold start)</li>
                    <li>• Origin must handle initial traffic</li>
                    <li>• Stale content if not managed properly</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Best For:
                  </div>
                  <div className="text-sm text-slate-600">
                    High-traffic sites, dynamic content, frequently updated
                    assets
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CDN Cache Strategies */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              CDN Cache Invalidation Strategies
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="text-3xl mb-3">⏰</div>
                <h4 className="font-bold text-slate-900 mb-3">
                  Time-Based (TTL)
                </h4>
                <p className="text-sm text-slate-700 mb-3">
                  Content expires after a set time period
                </p>
                <div className="bg-white rounded p-3 text-xs font-mono text-slate-700 mb-3">
                  Cache-Control: max-age=3600
                  <br />
                  Expires: Tue, 10 Dec 2024 12:00:00 GMT
                </div>
                <div className="text-xs text-slate-600">
                  <strong>Use:</strong> Static assets, images, CSS, JS
                  <br />
                  <strong>TTL:</strong> Hours or days
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="text-3xl mb-3">🔄</div>
                <h4 className="font-bold text-slate-900 mb-3">Version-Based</h4>
                <p className="text-sm text-slate-700 mb-3">
                  Change URL when content updates
                </p>
                <div className="bg-white rounded p-3 text-xs font-mono text-slate-700 mb-3">
                  Old: /style.css
                  <br />
                  New: /style.v2.css
                  <br />
                  Or: /style.css?v=123
                </div>
                <div className="text-xs text-slate-600">
                  <strong>Use:</strong> Deployed assets
                  <br />
                  <strong>Benefit:</strong> Instant updates, no purge needed
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="text-3xl mb-3">🗑️</div>
                <h4 className="font-bold text-slate-900 mb-3">Manual Purge</h4>
                <p className="text-sm text-slate-700 mb-3">
                  Explicitly remove cached content via API
                </p>
                <div className="bg-white rounded p-3 text-xs font-mono text-slate-700 mb-3">
                  POST /purge
                  <br />
                  {"{"}"files": ["/index.html"]{"}"}
                </div>
                <div className="text-xs text-slate-600">
                  <strong>Use:</strong> Emergency updates, critical fixes
                  <br />
                  <strong>Note:</strong> Propagation takes minutes
                </div>
              </div>
            </div>
          </div>

          {/* Real-World CDN Metrics */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              CDN Performance Impact
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-slate-800 mb-4">
                  Without CDN 🐌
                </h4>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Latency (US to Asia)
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        250ms
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Page Load Time
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        5.2s
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-4">With CDN 🚀</h4>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Latency (Edge Server)
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        15ms
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "6%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Page Load Time
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        0.8s
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "15%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  85% Faster
                </div>
                <div className="text-sm text-slate-600">
                  CDNs can reduce page load times by 80-90% for global audiences
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Traffic Control (LB vs Proxy) */}
        <section
          ref={(element) => (sectionsReference.current[4] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="mb-8">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              05 — Traffic Control
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Load Balancer vs Reverse Proxy
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl">
              Often confused, but distinct tools for managing traffic flow.
            </p>
          </div>

          {/* Why/How/When/Trade-offs - Load Balancing */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-cyan-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Why You Need Both
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Scale beyond one server and secure the internal network. Load balancers distribute traffic; reverse proxies add security, caching, and SSL termination.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span> How To Implement
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  L4 LB (IP+Port) for raw speed and simple routing. L7 LB (HTTP headers/path) for smart routing by URL, user ID, or A/B testing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⏰</span> When To Deploy
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Always, for production systems requiring availability and scale. Start with managed solutions like ALB, NLB, or cloud load balancers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚖️</span> Trade-offs
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  L7 offers smarter routing (e.g., by user ID) but is more CPU-intensive than L4. L4 is faster but can't inspect HTTP content for routing decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border-2 border-indigo-100 rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-indigo-900 mb-4">
                Reverse Proxy
              </h3>
              <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex items-center justify-between text-sm">
                <span>🌍 Internet</span>
                <span>→</span>
                <span className="p-2 bg-indigo-600 text-white rounded font-bold">
                  Proxy
                </span>
                <span>→</span>
                <span>🖥️ Server</span>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li>
                  🛡️ <b>Security</b>: Hides server identity (IP).
                </li>
                <li>
                  📦 <b>Caching</b>: Caches responses.
                </li>
                <li>
                  🔒 <b>SSL Termination</b>: Handles encryption.
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-blue-100 rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Load Balancer
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center justify-between text-sm">
                <span>🌍</span>
                <span>→</span>
                <span className="p-2 bg-blue-600 text-white rounded font-bold">
                  LB
                </span>
                <span>→</span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs">🖥️ S1</span>
                  <span className="text-xs">🖥️ S2</span>
                </div>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li>
                  ⚖️ <b>Distribution</b>: Spreads traffic across servers.
                </li>
                <li>
                  🚑 <b>Health Checks</b>: Skips dead servers.
                </li>
                <li>
                  📈 <b>Scaling</b>: Add more servers easily.
                </li>
              </ul>
            </div>
          </div>

          {/* Load Balancing Algorithms - Detailed */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Load Balancing Algorithms Deep Dive
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: "Round Robin",
                  icon: "🔄",
                  desc: "Distributes requests sequentially across servers",
                  pros: "Simple, fair distribution, works well with identical servers",
                  cons: "Doesnt account for server load or capacity",
                  useCase: "Stateless applications with uniform servers",
                  example:
                    "Request 1 → Server A, Request 2 → Server B, Request 3 → Server C, repeat",
                },
                {
                  name: "Weighted Round Robin",
                  icon: "⚖️",
                  desc: "Round robin but with server capacity weighting",
                  pros: "Accounts for different server capacities",
                  cons: "Requires manual weight configuration",
                  useCase:
                    "Servers with different specs (2x capacity = 2x weight)",
                  example:
                    "Server A (weight 2): 4GB RAM, Server B (weight 1): 2GB RAM",
                },
                {
                  name: "Least Connections",
                  icon: "📊",
                  desc: "Routes to server with fewest active connections",
                  pros: "Better for long-lived connections, adapts to load",
                  cons: "Slightly more complex tracking",
                  useCase:
                    "WebSocket connections, database connections, chat apps",
                  example:
                    "Server A: 5 connections, Server B: 3 connections → Route to B",
                },
                {
                  name: "IP Hash",
                  icon: "🔑",
                  desc: "Hash client IP to consistently route to same server",
                  pros: "Session persistence without sticky sessions",
                  cons: "Uneven distribution if users clustered by IP",
                  useCase: "Applications requiring session affinity",
                  example: "hash(192.168.1.5) % 3 = 2 → Always Server C",
                },
                {
                  name: "Least Response Time",
                  icon: "⚡",
                  desc: "Routes to server with fastest response time",
                  pros: "Optimizes for performance, adapts to server health",
                  cons: "Requires active monitoring and more overhead",
                  useCase: "Performance-critical applications",
                  example:
                    "Server A: 50ms avg, Server B: 30ms avg → Route to B",
                },
                {
                  name: "Random",
                  icon: "🎲",
                  desc: "Randomly selects a server for each request",
                  pros: "Very simple, no state needed, good for large server pools",
                  cons: "No intelligence, uneven distribution in short term",
                  useCase: "Large server farms, simple load distribution",
                  example: "Random number generator picks Server A, B, or C",
                },
              ].map((algo, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{algo.icon}</span>
                    <h4 className="text-xl font-bold text-slate-900">
                      {algo.name}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">{algo.desc}</p>

                  <div className="space-y-2 mb-3">
                    <div className="text-xs">
                      <span className="text-green-600 font-semibold">
                        ✓ Pros:
                      </span>
                      <span className="text-slate-600"> {algo.pros}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-red-600 font-semibold">
                        ✗ Cons:
                      </span>
                      <span className="text-slate-600"> {algo.cons}</span>
                    </div>
                  </div>

                  <div className="bg-white/60 rounded p-3 border border-blue-100">
                    <div className="text-xs font-semibold text-blue-900 mb-1">
                      Use Case:
                    </div>
                    <div className="text-xs text-slate-700 mb-2">
                      {algo.useCase}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">
                      Example:
                    </div>
                    <code className="text-xs text-slate-600">
                      {algo.example}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Checks */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Health Checks & High Availability
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">✅</span>
                  <h4 className="font-bold text-green-900">
                    Active Health Checks
                  </h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  Load balancer periodically pings servers with HTTP requests
                </p>
                <div className="bg-white rounded p-3 text-xs font-mono text-slate-700">
                  GET /health every 5s
                  <br />
                  200 OK → Healthy
                  <br />
                  Timeout → Unhealthy
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚠️</span>
                  <h4 className="font-bold text-yellow-900">
                    Passive Health Checks
                  </h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  Monitor actual traffic to detect failures
                </p>
                <div className="bg-white rounded p-3 text-xs font-mono text-slate-700">
                  Track errors per server
                  <br />
                  5xx errors → Mark degraded
                  <br />
                  Timeouts → Remove from pool
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🔄</span>
                  <h4 className="font-bold text-blue-900">
                    Graceful Degradation
                  </h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                  Automatic failover and recovery strategies
                </p>
                <div className="bg-white rounded p-3 text-xs font-mono text-slate-700">
                  Server fails → Remove
                  <br />
                  Redistribute traffic
                  <br />
                  Auto-recover when healthy
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Optimizations */}
        <section
          ref={(element) => (sectionsReference.current[5] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="mb-8">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              06 — Optimizations
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Performance Toolbox: TLS, Connection Pooling & Compression
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mb-6">
              Essential optimization techniques to reduce latency and save resources.
            </p>
          </div>

          {/* Why/How/When/Trade-offs - Optimizations */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-slate-300 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> Why Optimize
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Every millisecond counts at scale. TLS termination saves CPU, connection pooling reduces latency, and compression saves 70%+ bandwidth.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span> How To Apply
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Offload TLS at load balancer. Pool DB connections at application layer. Enable Gzip/Brotli compression for text assets (JSON, HTML, CSS).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⏰</span> When To Implement
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Early in production for TLS and compression. Add connection pooling when DB becomes a bottleneck. Monitor and optimize continuously.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚖️</span> Trade-offs
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  TLS termination requires secure internal network. Connection pooling adds complexity. Compression uses CPU but saves bandwidth—measure impact.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl">
              <div className="text-3xl mb-4">🔐</div>
              <h4 className="font-bold text-lg mb-2">TLS Termination</h4>
              <p className="text-sm text-slate-300">
                Decrypting HTTPS at the Load Balancer/Proxy instead of the web
                server. Saves CPU on application servers.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl">
              <div className="text-3xl mb-4">🏊‍♂️</div>
              <h4 className="font-bold text-lg mb-2">Connection Pooling</h4>
              <p className="text-sm text-slate-300">
                Reusing existing DB/Service connections instead of opening a new
                one for every request. Avoids handshake overhead.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl">
              <div className="text-3xl mb-4">🗜️</div>
              <h4 className="font-bold text-lg mb-2">Compression</h4>
              <p className="text-sm text-slate-300">
                Using Gzip/Brotli to shrink payloads. Large text files
                (JSON/HTML) can shrink by 70%+, saving bandwidth.
              </p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section
          ref={(element) => (sectionsReference.current[6] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Network Mastered! 🌐
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              You now understand how the internet connects. Let's move to data.
            </p>
            <button
              onClick={() => nav("/")}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Back to Home →
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  )
}
