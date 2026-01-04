import { useMemo, useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import RetryJitterDemo from "@/components/reliability/retry-jitter-demo"

/**
 * Reliability & Resilience page component
 * Comprehensive guide to SLOs, error budgets, circuit breakers, DR, and distributed consensus
 */

// SLO/Error Budget Calculator Component
function SLOErrorBudgetCalculator() {
  const [slo, setSlo] = useState(99.9)
  const [timeWindow, setTimeWindow] = useState("month")

  const calculations = useMemo(() => {
    const uptime = slo / 100
    const downtime = 1 - uptime

    const windows = {
      year: { total: 365 * 24 * 60, label: "year" },
      month: { total: 30 * 24 * 60, label: "month" },
      week: { total: 7 * 24 * 60, label: "week" },
      day: { total: 24 * 60, label: "day" },
    }

    const window = windows[timeWindow]
    const downtimeMinutes = downtime * window.total
    const errorBudget = downtime * 100

    return {
      uptime: (uptime * 100).toFixed(4),
      downtime: (downtime * 100).toFixed(4),
      downtimeMinutes: downtimeMinutes.toFixed(2),
      errorBudget: errorBudget.toFixed(4),
      windowLabel: window.label,
    }
  }, [slo, timeWindow])

  return (
    <div className="bg-white border-2 border-red-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-red-500 to-pink-600 flex items-center justify-center text-white text-2xl">
          📊
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">
            SLO/Error Budget Calculator
          </h4>
          <div className="text-xs text-slate-500">
            Calculate downtime and error budgets
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            SLO (Service Level Objective): {slo}%
          </label>
          <input
            type="range"
            min={90}
            max={99.999}
            step={0.01}
            value={slo}
            onChange={(e) => setSlo(Number(e.target.value))}
            className="w-full accent-red-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>90%</span>
            <span>99.999%</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Time Window
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["day", "week", "month", "year"].map((window) => (
              <button
                key={window}
                type="button"
                onClick={() => setTimeWindow(window)}
                className={`text-xs font-semibold rounded-lg px-3 py-2 border transition-colors ${
                  timeWindow === window
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {window}
              </button>
            ))}
          </div>
        </div>

        <div className=" from-red-50 to-pink-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700">Uptime:</span>
            <span className="font-bold text-green-700">{calculations.uptime}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700">Downtime:</span>
            <span className="font-bold text-red-700">{calculations.downtime}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700">
              Downtime per {calculations.windowLabel}:
            </span>
            <span className="font-bold text-slate-900">
              {calculations.downtimeMinutes} minutes
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-red-200">
            <span className="text-sm font-semibold text-slate-900">Error Budget:</span>
            <span className="font-bold text-indigo-700">{calculations.errorBudget}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Rate Limiter Simulator Component
function RateLimiterSimulator() {
  const [algorithm, setAlgorithm] = useState("token-bucket")
  const [rate, setRate] = useState(10) // requests per second
  const [burst, setBurst] = useState(20) // burst capacity
  const [requests, setRequests] = useState([])

  const handleRequest = () => {
    const now = Date.now()
    const recentRequests = requests.filter((r) => now - r < 1000)
    
    let allowed = false
    if (algorithm === "token-bucket") {
      allowed = recentRequests.length < burst
    } else if (algorithm === "sliding-window") {
      allowed = recentRequests.length < rate
    } else {
      // fixed window
      const windowStart = Math.floor(now / 1000) * 1000
      const windowRequests = requests.filter((r) => r >= windowStart)
      allowed = windowRequests.length < rate
    }

    if (allowed) {
      setRequests([...requests, now].slice(-100)) // keep last 100
    }
  }

  const stats = useMemo(() => {
    const now = Date.now()
    const lastSecond = requests.filter((r) => now - r < 1000).length
    return {
      total: requests.length,
      lastSecond,
      allowed: lastSecond <= (algorithm === "token-bucket" ? burst : rate),
    }
  }, [requests, algorithm, rate, burst])

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl">
          🚦
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Rate Limiter Simulator</h4>
          <div className="text-xs text-slate-500">
            Compare token bucket vs sliding window
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Algorithm
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "token-bucket", label: "Token Bucket" },
              { id: "sliding-window", label: "Sliding Window" },
              { id: "fixed-window", label: "Fixed Window" },
            ].map((alg) => (
              <button
                key={alg.id}
                type="button"
                onClick={() => setAlgorithm(alg.id)}
                className={`text-xs font-semibold rounded-lg px-3 py-2 border transition-colors ${
                  algorithm === alg.id
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {alg.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Rate: {rate} req/sec
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
          {algorithm === "token-bucket" && (
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Burst: {burst} requests
              </label>
              <input
                type="range"
                min={1}
                max={50}
                value={burst}
                onChange={(e) => setBurst(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          )}
        </div>

        <div className="bg-indigo-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-700">Requests (last second):</span>
            <span className={`font-bold ${stats.allowed ? "text-green-700" : "text-red-700"}`}>
              {stats.lastSecond} / {algorithm === "token-bucket" ? burst : rate}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRequest}
            className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-indigo-700 transition-colors"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  )
}

// Circuit Breaker State Machine Component
function CircuitBreakerSimulator() {
  const [state, setState] = useState("closed") // closed, open, half-open
  const [failures, setFailures] = useState(0)
  const [successes, setSuccesses] = useState(0)
  const [threshold, setThreshold] = useState(5)

  const handleRequest = (willFail) => {
    if (state === "open") {
      return // circuit is open, requests are rejected
    }

    if (willFail) {
      const newFailures = failures + 1
      setFailures(newFailures)
      if (newFailures >= threshold) {
        setState("open")
        setTimeout(() => setState("half-open"), 5000) // auto-recover after 5s
      }
    } else {
      const newSuccesses = successes + 1
      setSuccesses(newSuccesses)
      if (state === "half-open" && newSuccesses >= 2) {
        setState("closed")
        setFailures(0)
        setSuccesses(0)
      }
    }
  }

  const stateColors = {
    closed: "bg-green-600",
    open: "bg-red-600",
    "half-open": "bg-yellow-600",
  }

  return (
    <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl">
          ⚡
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Circuit Breaker Simulator</h4>
          <div className="text-xs text-slate-500">
            Visualize open/half-open/closed states
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Failure Threshold: {threshold}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>

        <div className={`${stateColors[state]} text-white rounded-xl p-4 text-center`}>
          <div className="text-sm font-semibold mb-1">Current State</div>
          <div className="text-2xl font-bold uppercase">{state}</div>
          <div className="text-xs mt-2 opacity-90">
            {state === "closed" && "Normal operation, requests allowed"}
            {state === "open" && "Circuit open, requests rejected (auto-recover in 5s)"}
            {state === "half-open" && "Testing recovery, allowing limited requests"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-sm text-slate-700">Failures</div>
            <div className="text-2xl font-bold text-red-700">{failures}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-sm text-slate-700">Successes</div>
            <div className="text-2xl font-bold text-green-700">{successes}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleRequest(true)}
            className="bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-700 transition-colors"
          >
            Simulate Failure
          </button>
          <button
            type="button"
            onClick={() => handleRequest(false)}
            className="bg-green-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-green-700 transition-colors"
          >
            Simulate Success
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setState("closed")
            setFailures(0)
            setSuccesses(0)
          }}
          className="w-full bg-slate-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-slate-700 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// DR Scenario Planner Component
function DRScenarioPlanner() {
  const [rto, setRto] = useState(4) // hours
  const [rpo, setRpo] = useState(1) // hours
  const [backupFrequency, setBackupFrequency] = useState("hourly")

  const recommendations = useMemo(() => {
    const needsActiveActive = rto < 1
    const needsContinuousBackup = rpo < 0.5
    const recommendedFrequency = rpo < 1 ? "continuous" : rpo < 4 ? "hourly" : "daily"

    return {
      needsActiveActive,
      needsContinuousBackup,
      recommendedFrequency,
      strategy: needsActiveActive ? "Active-Active" : "Active-Passive",
    }
  }, [rto, rpo])

  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-blue-500 to-cyan-600 flex items-center justify-center text-white text-2xl">
          🛡️
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">DR Scenario Planner</h4>
          <div className="text-xs text-slate-500">
            Calculate RTO/RPO and backup strategies
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            RTO (Recovery Time Objective): {rto} hours
          </label>
          <input
            type="range"
            min={0.5}
            max={24}
            step={0.5}
            value={rto}
            onChange={(e) => setRto(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="text-xs text-slate-500 mt-1">
            Maximum acceptable downtime
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            RPO (Recovery Point Objective): {rpo} hours
          </label>
          <input
            type="range"
            min={0.1}
            max={24}
            step={0.1}
            value={rpo}
            onChange={(e) => setRpo(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="text-xs text-slate-500 mt-1">
            Maximum acceptable data loss
          </div>
        </div>

        <div className=" from-blue-50 to-cyan-50 rounded-xl p-4 space-y-3">
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-1">
              Recommended Strategy:
            </div>
            <div className="text-lg font-bold text-blue-700">
              {recommendations.strategy}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900 mb-1">
              Backup Frequency:
            </div>
            <div className="text-lg font-bold text-indigo-700">
              {recommendations.recommendedFrequency}
            </div>
          </div>

          {recommendations.needsActiveActive && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-xs text-yellow-800">
              ⚠️ Low RTO requires Active-Active setup (higher cost)
            </div>
          )}

          {recommendations.needsContinuousBackup && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-xs text-yellow-800">
              ⚠️ Low RPO requires continuous replication
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReliabilityResilience() {
  const nav = useNavigate()
  const sectionsReference = useRef([])

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
      {/* Hero Section */}
      <section className="relative gradient-overlay py-20 md:py-32 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-6">
              <span className="text-sm font-medium text-red-700">Module 6</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Reliability & <span className="text-gradient">Resilience</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 mx-auto">
              Master SLO-driven design, error budgets, graceful degradation,
              circuit breakers, disaster recovery, and distributed consensus.
              Build systems that fail gracefully and recover quickly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => nav("/")} className="btn-secondary">
                Back to Home
              </button>
              <button onClick={() => nav("/topics")} className="btn-secondary">
                View All Topics
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Section 1: SLO-driven Design */}
        <section
          ref={(el) => (sectionsReference.current[0] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-sm">
                  01
                </span>
                SLO-DRIVEN DESIGN
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              SLO-driven Design, Error Budgets & Testing
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Define clear reliability targets that align engineering effort with
              business outcomes. Use error budgets to make data-driven decisions
              about reliability vs features.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className=" from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💡</div>
                  <div>
                    <h3 className="text-2xl font-bold text-red-900 mb-3">Why This Matters</h3>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      Without clear reliability targets, teams optimize for the wrong
                      metrics. SLOs align engineering effort with business outcomes.
                      Error budgets provide a quantitative way to decide when to
                      prioritize reliability work vs new features.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Key Concepts
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-slate-900 mb-2">
                      SLI (Service Level Indicator)
                    </div>
                    <p className="text-sm text-slate-700">
                      Measured metric: latency p99, error rate, availability
                      percentage. What you actually measure.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-2">
                      SLO (Service Level Objective)
                    </div>
                    <p className="text-sm text-slate-700">
                      Target: p99 &lt; 200ms, error rate &lt; 0.1%, 99.9% uptime.
                      What you commit to.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-2">
                      Error Budget
                    </div>
                    <p className="text-sm text-slate-700">
                      Error budget = 100% - SLO. If SLO is 99.9%, error budget is
                      0.1%. Use this to decide when to stop feature work and focus
                      on reliability.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SLOErrorBudgetCalculator />
            </div>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Chaos Engineering & Load Testing
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold text-slate-900 mb-2">Chaos Engineering</div>
                <p className="text-sm text-slate-700 mb-3">
                  Intentionally inject failures to test resilience:
                </p>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• Kill pods/containers randomly</li>
                  <li>• Inject network latency/partitions</li>
                  <li>• Simulate database failures</li>
                  <li>• Test failover procedures</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-900 mb-2">Load Testing</div>
                <p className="text-sm text-slate-700 mb-3">
                  Simulate production traffic patterns:
                </p>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• Baseline: normal traffic</li>
                  <li>• Stress: beyond normal capacity</li>
                  <li>• Spike: sudden traffic increases</li>
                  <li>• Soak: sustained load over time</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Graceful Degradation */}
        <section
          ref={(el) => (sectionsReference.current[1] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm">
                  02
                </span>
                GRACEFUL DEGRADATION
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Graceful Degradation & Tail-Latency Mitigation
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Not all failures are catastrophic. Systems should degrade
              functionality rather than fail completely.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Graceful Degradation
              </h3>
              <p className="text-sm text-slate-700">
                Disable non-critical features (recommendations, analytics) when
                under load. Keep core functionality working.
              </p>
            </div>
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">📉</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Brownouts</h3>
              <p className="text-sm text-slate-700">
                Reduce quality (lower video resolution, simplified UI) instead of
                rejecting requests. Better user experience than errors.
              </p>
            </div>
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Hedged Requests
              </h3>
              <p className="text-sm text-slate-700">
                Send duplicate requests to multiple servers, use first response,
                cancel others. Reduces tail latency significantly.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Rate Limiting & Circuit Breakers */}
        <section
          ref={(el) => (sectionsReference.current[2] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                  03
                </span>
                RATE LIMITING & CIRCUIT BREAKERS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Rate Limiting, Throttling & Circuit Breaking
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Protect systems from traffic spikes, abuse, and cascading failures.
            </p>
          </div>

          <div className="mb-8">
            <RetryJitterDemo />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <RateLimiterSimulator />
            </div>
            <div>
              <CircuitBreakerSimulator />
            </div>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Rate Limiting Algorithms
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="font-semibold text-slate-900 mb-2">Token Bucket</div>
                <p className="text-sm text-slate-700">
                  Tokens added at fixed rate, requests consume tokens. Allows bursts
                  up to bucket size. Good for traffic smoothing.
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 mb-2">Sliding Window</div>
                <p className="text-sm text-slate-700">
                  Track requests in time windows. Most accurate but higher memory
                  cost. Best for precise rate limiting.
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 mb-2">Fixed Window</div>
                <p className="text-sm text-slate-700">
                  Simple counters per time period. Suffers from edge-case spikes at
                  window boundaries. Fastest to implement.
                </p>
              </div>
            </div>
          </div>

          <div className=" from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 mt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Bulkheads</h3>
            <p className="text-slate-700 leading-relaxed">
              Isolate resources (thread pools, connections) so one failing component
              doesn't starve others. Like watertight compartments on a ship. If one
              service fails, others continue operating with their allocated resources.
            </p>
          </div>
        </section>

        {/* Section 4: Disaster Recovery */}
        <section
          ref={(el) => (sectionsReference.current[3] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  04
                </span>
                DISASTER RECOVERY
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              DR/Backup/Restore & RTO/RPO Planning
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Disasters happen. Recovery planning determines business continuity.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <DRScenarioPlanner />
            </div>
            <div className="space-y-6">
              <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Active-Active vs Active-Passive
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-blue-900 mb-2">
                      Active-Passive
                    </div>
                    <p className="text-sm text-slate-700">
                      Primary region serves traffic, secondary region is standby.
                      Lower cost, higher RTO (recovery time). Good for most
                      applications.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 mb-2">Active-Active</div>
                    <p className="text-sm text-slate-700">
                      Both regions serve traffic simultaneously. Lower RTO, higher
                      cost and complexity. Required for critical systems with &lt;1
                      hour RTO.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Backup Strategies
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">Full Backups</div>
                    <p className="text-sm text-slate-700">
                      Complete snapshot. Simple but storage-intensive. Good for
                      periodic archives.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">Incremental</div>
                    <p className="text-sm text-slate-700">
                      Changes since last backup. Efficient storage, requires full +
                      incrementals for restore.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">Continuous</div>
                    <p className="text-sm text-slate-700">
                      Streaming replication. Lowest RPO, highest cost. Best for
                      critical systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Distributed Consensus */}
        <section
          ref={(el) => (sectionsReference.current[4] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">
                  05
                </span>
                DISTRIBUTED CONSENSUS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Distributed Consensus & Leader Election
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Distributed systems need agreement on state, leader selection, and
              configuration changes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Raft Algorithm</h3>
              <div className="space-y-3">
                <p className="text-slate-700">
                  Leader-based consensus algorithm. Simpler to understand than Paxos.
                </p>
                <div>
                  <div className="font-semibold text-purple-900 mb-2">How it works:</div>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>• Leader handles all writes</li>
                    <li>• Replicates logs to followers</li>
                    <li>• Leader election via majority vote</li>
                    <li>• Requires majority of nodes healthy</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-sm text-slate-700">
                  Used in: etcd, Consul, CockroachDB
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Paxos Algorithm</h3>
              <div className="space-y-3">
                <p className="text-slate-700">
                  Classic consensus algorithm, more complex but proven. Multi-round
                  voting process.
                </p>
                <div>
                  <div className="font-semibold text-purple-900 mb-2">Characteristics:</div>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>• Multi-round voting</li>
                    <li>• Handles network partitions</li>
                    <li>• More complex to implement</li>
                    <li>• Industry-proven algorithm</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-sm text-slate-700">
                  Used in: Chubby, Google's distributed systems
                </div>
              </div>
            </div>
          </div>

          <div className=" from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Leader Election Use Cases
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="font-semibold text-slate-900 mb-2">Distributed Locks</div>
                <p className="text-sm text-slate-700">
                  Coordinate access to shared resources across multiple nodes.
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 mb-2">Master Selection</div>
                <p className="text-sm text-slate-700">
                  Elect a single leader to coordinate work (e.g., job schedulers).
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 mb-2">
                  Configuration Management
                </div>
                <p className="text-sm text-slate-700">
                  Centralized config store with strong consistency guarantees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-6">
          <div className="flex justify-between items-center">
            <button onClick={() => nav("/topics")} className="btn-secondary">
              ← Back to Topics
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => nav("/apis-integration")} className="btn-secondary">
                ← Previous: APIs
              </button>
              <button onClick={() => nav("/security-governance")} className="btn-primary">
                Next: Security →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

