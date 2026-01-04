import { useState } from "react"
import { Radio, RefreshCw, Zap, AlertTriangle, Server, Users, ArrowRight, Check, X } from "lucide-react"

export default function WebSocketDeepDive() {
  const [lifecycleStep, setLifecycleStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState("sticky")
  const [selectedFallback, setSelectedFallback] = useState("sse")

  const lifecycleSteps = [
    {
      id: 1,
      name: "HTTP Handshake",
      desc: "Client sends Upgrade request",
      detail: "GET /chat HTTP/1.1\nUpgrade: websocket\nConnection: Upgrade",
      color: "blue",
    },
    {
      id: 2,
      name: "Server Accepts",
      desc: "Server responds with 101 Switching Protocols",
      detail: "HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade",
      color: "green",
    },
    {
      id: 3,
      name: "Connection Established",
      desc: "Full-duplex communication active",
      detail: "Both client and server can send messages anytime",
      color: "purple",
    },
    {
      id: 4,
      name: "Data Exchange",
      desc: "Bidirectional real-time messages",
      detail: "Low latency, efficient binary/text frames",
      color: "indigo",
    },
    {
      id: 5,
      name: "Close Handshake",
      desc: "Either party can initiate close",
      detail: "Graceful shutdown with close frame",
      color: "orange",
    },
  ]

  const playLifecycle = () => {
    if (isPlaying) return
    setIsPlaying(true)
    setLifecycleStep(0)

    let step = 0
    const interval = setInterval(() => {
      step++
      setLifecycleStep(step)
      if (step >= lifecycleSteps.length) {
        clearInterval(interval)
        setTimeout(() => {
          setIsPlaying(false)
          setLifecycleStep(0)
        }, 2000)
      }
    }, 1500)
  }

  const challenges = {
    sticky: {
      title: "Sticky Sessions (Session Affinity)",
      problem: "WebSocket connections are stateful - each client must reconnect to same server",
      solutions: [
        {
          name: "IP Hash Load Balancing",
          desc: "Route based on client IP to same backend",
          pros: ["Simple to implement", "Works at Layer 4"],
          cons: ["NAT causes issues", "Uneven distribution behind proxies"],
        },
        {
          name: "Cookie-based Affinity",
          desc: "Load balancer sets cookie during handshake",
          pros: ["More reliable than IP", "Better distribution"],
          cons: ["Requires Layer 7 LB", "Cookie manipulation risk"],
        },
        {
          name: "Shared State (Redis)",
          desc: "Store session state in Redis, any server can handle request",
          pros: ["Perfect distribution", "Server failures don't kill sessions"],
          cons: ["Added complexity", "Network latency for state access"],
        },
      ],
    },
    draining: {
      title: "Connection Draining",
      problem: "How to gracefully shut down servers without dropping connections?",
      solutions: [
        {
          name: "Graceful Shutdown",
          desc: "Stop accepting new connections, wait for existing to close",
          pros: ["No dropped connections", "Clean shutdown"],
          cons: ["Can take long time", "May need timeout"],
        },
        {
          name: "Close Frame with Reconnect",
          desc: "Send close frame with 1012 (Service Restart) code",
          pros: ["Client knows to reconnect", "Fast shutdown"],
          cons: ["Momentary disruption", "Client must handle reconnect"],
        },
        {
          name: "Connection Migration",
          desc: "Transfer connections to other servers",
          pros: ["Zero downtime", "Seamless for users"],
          cons: ["Very complex", "Requires sophisticated infrastructure"],
        },
      ],
    },
    scaling: {
      title: "Horizontal Scaling",
      problem: "Multiple servers need to communicate with each other for broadcasting",
      solutions: [
        {
          name: "Message Queue (Redis Pub/Sub)",
          desc: "Servers publish messages, all subscribers receive",
          pros: ["Simple architecture", "Fast in-memory"],
          cons: ["Redis SPOF", "Message ordering challenges"],
        },
        {
          name: "Message Broker (RabbitMQ/Kafka)",
          desc: "Reliable message delivery across servers",
          pros: ["Durable messaging", "Replay capability"],
          cons: ["Higher latency", "More infrastructure"],
        },
        {
          name: "Service Mesh",
          desc: "Envoy/Istio handles inter-service communication",
          pros: ["Advanced routing", "Observability built-in"],
          cons: ["Complex setup", "Learning curve"],
        },
      ],
    },
  }

  const fallbacks = {
    sse: {
      name: "Server-Sent Events (SSE)",
      desc: "One-way server-to-client streaming over HTTP",
      when: "When you only need server → client (e.g., notifications, live updates)",
      pros: [
        "Native browser API (EventSource)",
        "Automatic reconnection",
        "Text-based, easier debugging",
        "Works over HTTP/2",
      ],
      cons: ["One-way only (no client → server)", "Limited to text", "6 connection limit per domain"],
      code: `const eventSource = new EventSource('/api/events');
eventSource.onmessage = (event) => {
  console.log('New message:', event.data);
};`,
    },
    longPolling: {
      name: "Long Polling",
      desc: "Client makes HTTP request, server holds until data available",
      when: "When WebSocket is blocked by corporate firewalls",
      pros: [
        "Works everywhere (pure HTTP)",
        "No special server support",
        "Firewall-friendly",
        "Simple to implement",
      ],
      cons: [
        "Higher latency than WebSocket",
        "More overhead (HTTP headers each request)",
        "Server resource intensive",
        "Doesn't scale well",
      ],
      code: `async function poll() {
  const response = await fetch('/api/poll');
  const data = await response.json();
  handleData(data);
  poll(); // Immediately poll again
}`,
    },
    polling: {
      name: "Short Polling",
      desc: "Client repeatedly requests data at fixed intervals",
      when: "Legacy systems or when real-time isn't critical",
      pros: ["Simplest approach", "Works anywhere", "Easy to debug", "No server-side state"],
      cons: [
        "Very inefficient",
        "High latency (up to poll interval)",
        "Wastes bandwidth",
        "Server load from constant requests",
      ],
      code: `setInterval(async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  updateUI(data);
}, 5000); // Poll every 5 seconds`,
    },
  }

  const lbStrategies = [
    {
      name: "Layer 4 (TCP) LB",
      desc: "Hash client IP to route to same backend",
      good: "Fast, low overhead",
      bad: "Problems with NAT, proxies",
    },
    {
      name: "Layer 7 (HTTP) LB",
      desc: "Parse HTTP headers, set sticky session cookie",
      good: "Reliable routing, better distribution",
      bad: "Higher overhead, more complex",
    },
    {
      name: "DNS-based",
      desc: "Return same server IP for same client",
      good: "Offloads LB, works at scale",
      bad: "DNS caching issues, no health checks",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Connection Lifecycle */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">WebSocket Connection Lifecycle</h3>
            <p className="text-slate-600">From handshake to close - understand the full journey</p>
          </div>
          <button
            onClick={playLifecycle}
            disabled={isPlaying}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isPlaying
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <Zap className="w-4 h-4" />
            {isPlaying ? "Playing..." : "Play Animation"}
          </button>
        </div>

        <div className="space-y-4">
          {lifecycleSteps.map((step, index) => {
            const isActive = lifecycleStep === index + 1
            const isComplete = lifecycleStep > index + 1

            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? `border-${step.color}-500 bg-${step.color}-50 shadow-lg scale-105`
                    : isComplete
                      ? "border-green-300 bg-green-50"
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isComplete
                        ? "bg-green-500 text-white"
                        : isActive
                          ? `bg-${step.color}-500 text-white`
                          : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {isComplete ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{step.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{step.desc}</p>
                    {(isActive || isComplete) && (
                      <pre className="text-xs bg-slate-800 text-green-400 p-3 rounded font-mono overflow-x-auto">
                        {step.detail}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scaling Challenges */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Scaling Challenges & Solutions
        </h3>
        <p className="text-slate-600 mb-6">WebSockets are stateful - this creates unique scaling problems</p>

        {/* Challenge Selector */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(challenges).map(([key, challenge]) => (
            <button
              key={key}
              onClick={() => setSelectedChallenge(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedChallenge === key
                  ? "bg-amber-500 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {challenge.title.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Selected Challenge */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-bold text-amber-900 mb-2">{challenges[selectedChallenge].title}</h4>
          <p className="text-slate-700 mb-6 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            {challenges[selectedChallenge].problem}
          </p>

          <h5 className="font-semibold text-slate-900 mb-4">Solutions:</h5>
          <div className="space-y-4">
            {challenges[selectedChallenge].solutions.map((solution, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                <h6 className="font-semibold text-slate-900 mb-2">{solution.name}</h6>
                <p className="text-sm text-slate-600 mb-3">{solution.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Pros:
                    </p>
                    <ul className="space-y-1">
                      {solution.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                      <X className="w-3 h-3" /> Cons:
                    </p>
                    <ul className="space-y-1">
                      {solution.cons.map((con, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Load Balancing WebSockets */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Server className="w-6 h-6 text-blue-600" />
          Load Balancing Strategies
        </h3>
        <p className="text-slate-600 mb-6">Different approaches to distribute WebSocket connections</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lbStrategies.map((strategy, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">{strategy.name}</h4>
              <p className="text-sm text-slate-600 mb-3">{strategy.desc}</p>
              <div className="space-y-2">
                <p className="text-xs">
                  <span className="font-medium text-green-700">✓ Good:</span>
                  <span className="text-slate-600"> {strategy.good}</span>
                </p>
                <p className="text-xs">
                  <span className="font-medium text-red-700">✗ Bad:</span>
                  <span className="text-slate-600"> {strategy.bad}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fallback Strategies */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-purple-600" />
          Fallback Strategies
        </h3>
        <p className="text-slate-600 mb-6">When WebSocket isn't available (firewalls, old browsers)</p>

        {/* Fallback Selector */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(fallbacks).map(([key, fallback]) => (
            <button
              key={key}
              onClick={() => setSelectedFallback(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedFallback === key
                  ? "bg-purple-500 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {fallback.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Selected Fallback */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-bold text-purple-900 mb-2">{fallbacks[selectedFallback].name}</h4>
          <p className="text-slate-700 mb-4">{fallbacks[selectedFallback].desc}</p>

          <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
            <p className="text-sm font-medium text-purple-900 mb-1">When to use:</p>
            <p className="text-sm text-slate-700">{fallbacks[selectedFallback].when}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                <Check className="w-4 h-4" /> Advantages:
              </p>
              <ul className="space-y-1">
                {fallbacks[selectedFallback].pros.map((pro, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                <X className="w-4 h-4" /> Disadvantages:
              </p>
              <ul className="space-y-1">
                {fallbacks[selectedFallback].cons.map((con, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">Example Code:</p>
            <pre className="text-sm text-green-400 font-mono overflow-x-auto">{fallbacks[selectedFallback].code}</pre>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <Radio className="w-5 h-5" />
          Production Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">Do's:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Implement heartbeat/ping-pong to detect dead connections
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Use exponential backoff for reconnection
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Close connections gracefully with proper codes
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Monitor connection counts and memory usage
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">Don'ts:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                Don't use WebSocket for everything - REST is fine for CRUD
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                Don't forget to clean up resources on close
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                Don't assume connections will stay alive forever
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                Don't send large payloads - chunk them instead
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
