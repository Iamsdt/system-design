import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

function clampPercent(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function formatMs(value) {
  return `${Math.round(value)}ms`
}

function DeploymentStrategySimulator() {
  const [strategy, setStrategy] = useState("canary")
  const [progress, setProgress] = useState(30) // used for rolling
  const [trafficToNew, setTrafficToNew] = useState(10) // used for canary/blue-green
  const [oldErrorPct, setOldErrorPct] = useState(0.2)
  const [newErrorPct, setNewErrorPct] = useState(1.0)
  const [oldP95, setOldP95] = useState(180)
  const [newP95, setNewP95] = useState(320)

  const effectiveNewTraffic = useMemo(() => {
    if (strategy === "rolling") return clampPercent(progress)
    if (strategy === "blue-green") return trafficToNew >= 50 ? 100 : 0
    return clampPercent(trafficToNew)
  }, [strategy, progress, trafficToNew])

  const effectiveOldTraffic = 100 - effectiveNewTraffic

  const totals = useMemo(() => {
    const totalErrorPct =
      (effectiveOldTraffic / 100) * oldErrorPct +
      (effectiveNewTraffic / 100) * newErrorPct

    const totalP95 =
      (effectiveOldTraffic / 100) * oldP95 + (effectiveNewTraffic / 100) * newP95

    return {
      totalErrorPct,
      totalP95,
    }
  }, [effectiveOldTraffic, effectiveNewTraffic, oldErrorPct, newErrorPct, oldP95, newP95])

  const recommendation = useMemo(() => {
    const errorBudgetThreshold = 1.0
    const latencyBudgetThreshold = 300

    const errorBad = totals.totalErrorPct > errorBudgetThreshold
    const latencyBad = totals.totalP95 > latencyBudgetThreshold

    if (errorBad || latencyBad) {
      return {
        label: "Rollback / stop rollout",
        tone: "bg-red-50 border-red-200 text-red-800",
        reason: `Budget exceeded: ${errorBad ? "error rate" : ""}${errorBad && latencyBad ? " + " : ""}${latencyBad ? "p95 latency" : ""}.`,
      }
    }

    if (effectiveNewTraffic === 100) {
      return {
        label: "Promote to 100%",
        tone: "bg-green-50 border-green-200 text-green-800",
        reason: "Within budget at full traffic.",
      }
    }

    return {
      label: "Continue gradually",
      tone: "bg-amber-50 border-amber-200 text-amber-800",
      reason: "Within budget so far — increase slowly and watch telemetry.",
    }
  }, [totals.totalErrorPct, totals.totalP95, effectiveNewTraffic])

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">
              🚦
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Deployment Strategy Simulator
              </h4>
              <div className="text-xs text-slate-500">
                Compare rolling vs blue/green vs canary
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 py-1.5 px-3 rounded-full">
          Interactive
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Strategy
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              { id: "rolling", label: "Rolling" },
              { id: "blue-green", label: "Blue/Green" },
              { id: "canary", label: "Canary" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStrategy(item.id)}
                className={`text-xs font-semibold rounded-lg px-2 py-2 border transition-colors ${
                  strategy === item.id
                    ? "bg-white border-indigo-300 text-indigo-700"
                    : "bg-white/60 border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Traffic to new version (%)
          </label>

          {strategy === "rolling" ? (
            <>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600"
              />
              <div className="text-sm font-bold text-indigo-700 mt-2">
                {clampPercent(progress)}% (rollout progress)
              </div>
            </>
          ) : (
            <>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={trafficToNew}
                onChange={(e) => setTrafficToNew(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600"
              />
              <div className="text-sm font-bold text-indigo-700 mt-2">
                {strategy === "blue-green"
                  ? `${trafficToNew >= 50 ? 100 : 0}% (switch)`
                  : `${clampPercent(trafficToNew)}%`}
              </div>
            </>
          )}

          <div className="text-xs text-slate-500 mt-1">
            Effective split: {effectiveOldTraffic}% old / {effectiveNewTraffic}% new
          </div>
        </div>

        <div className={`rounded-lg p-3 border ${recommendation.tone}`}>
          <div className="text-xs font-semibold uppercase tracking-wide">
            Recommendation
          </div>
          <div className="text-lg font-extrabold mt-1">{recommendation.label}</div>
          <div className="text-xs mt-1">{recommendation.reason}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Version health inputs
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Old error rate (%)
                </label>
                <span className="text-xs font-bold text-slate-800">
                  {oldErrorPct.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={oldErrorPct}
                onChange={(e) => setOldErrorPct(Number(e.target.value))}
                className="w-full mt-2 accent-slate-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  New error rate (%)
                </label>
                <span className="text-xs font-bold text-slate-800">
                  {newErrorPct.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={newErrorPct}
                onChange={(e) => setNewErrorPct(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Old p95
                  </label>
                  <span className="text-xs font-bold text-slate-800">
                    {formatMs(oldP95)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={800}
                  step={10}
                  value={oldP95}
                  onChange={(e) => setOldP95(Number(e.target.value))}
                  className="w-full mt-2 accent-slate-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    New p95
                  </label>
                  <span className="text-xs font-bold text-slate-800">
                    {formatMs(newP95)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={800}
                  step={10}
                  value={newP95}
                  onChange={(e) => setNewP95(Number(e.target.value))}
                  className="w-full mt-2 accent-indigo-600"
                />
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Heuristic budgets (for the demo): error ≤ 1.0%, p95 ≤ 300ms
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-3">
            What users experience
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/70 border border-indigo-100 rounded-xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">
                Overall error rate
              </div>
              <div className="text-2xl font-extrabold text-indigo-900">
                {totals.totalErrorPct.toFixed(2)}%
              </div>
            </div>

            <div className="bg-white/70 border border-indigo-100 rounded-xl p-4 text-center">
              <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">
                Overall p95
              </div>
              <div className="text-2xl font-extrabold text-indigo-900">
                {formatMs(totals.totalP95)}
              </div>
            </div>
          </div>

          <div className="bg-white/60 border border-indigo-100 rounded-xl p-4">
            <div className="text-sm font-bold text-slate-900 mb-2">How to read this</div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Canary reduces blast radius by limiting new traffic.</li>
              <li>• Blue/green is fast to rollback but the cutover is abrupt.</li>
              <li>• Rolling depends heavily on readiness + safe surge/unavailable limits.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
            Rolling
          </div>
          <div className="text-sm text-slate-700">
            Gradually replace pods/instances. Requires strong probes and rollout tuning.
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
            Blue/Green
          </div>
          <div className="text-sm text-slate-700">
            Maintain two environments. Flip traffic. Costs extra capacity.
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
            Canary
          </div>
          <div className="text-sm text-slate-700">
            Shift a small % first. Needs observability + rollback automation.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComputeRuntime() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative gradient-overlay py-20 md:py-28 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
              <span className="text-sm font-medium text-indigo-700">
                Module 4
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Compute & <span className="text-gradient">Runtime Models</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 mx-auto">
              Learn how to choose between containers, serverless, and Kubernetes — and how to deploy safely using rolling, blue/green, and canary strategies.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => nav("/")}
                className="btn-secondary"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("deployment-sim")
                  if (el) el.scrollIntoView({ behavior: "smooth" })
                }}
                className="btn-primary"
              >
                Try the Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Runtime Decision */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                01
              </span>
              RUNTIME CHOICES
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Understanding compute models
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mb-6">
              Before choosing a platform, decide what you want to scale: a whole VM, a container/pod, a request-driven instance, or a single function invocation. Each model offers different trade-offs between control, operational overhead, cost, and scalability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">🖥️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">VM / Instance</h3>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                Maximum control. Great for legacy stacks, special networking needs, or custom kernels.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Full OS control
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Legacy app support
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Manual patching
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Slow boot times
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t pt-3">
                <strong>Use when:</strong> Running databases, stateful apps, or legacy systems that need specific OS configurations.
              </div>
            </div>

            <div className="bg-white border-2 border-indigo-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Container / Pod</h3>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                Portable packaging with predictable runtime. Ideal for web services and background workers.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Fast startup
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Portable
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Orchestration complexity
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Learning curve
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t pt-3">
                <strong>Use when:</strong> Building microservices, APIs, or batch jobs that need portability and fast scaling.
              </div>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Serverless</h3>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                Pay-per-use and fast iteration. Great for event-driven workloads and simpler HTTP APIs.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Zero ops
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Auto-scaling
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Cold starts
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Vendor lock-in
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t pt-3">
                <strong>Use when:</strong> Building event handlers, simple APIs, or workloads with unpredictable traffic patterns.
              </div>
            </div>
          </div>

          {/* Architecture Patterns */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Architecture Evolution: Monolith → Modular → Microservices</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h4 className="text-lg font-bold text-slate-900 mb-3">🏢 Monolith</h4>
                <p className="text-sm text-slate-700 mb-4">
                  Single deployable unit with all features bundled together. Simple to develop and deploy initially.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-900">When to use:</div>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Small teams (2-5 developers)</li>
                    <li>• Early-stage products (MVP)</li>
                    <li>• Simple domain models</li>
                    <li>• Low traffic (&lt;10K RPS)</li>
                  </ul>
                  <div className="font-semibold text-slate-900 mt-3">Watch out:</div>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Tight coupling limits changes</li>
                    <li>• Single failure point</li>
                    <li>• Scaling requires entire app</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-indigo-200">
                <h4 className="text-lg font-bold text-slate-900 mb-3">🧩 Modular Monolith</h4>
                <p className="text-sm text-slate-700 mb-4">
                  Single deployment with clear internal module boundaries. Best of both worlds for many teams.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-900">When to use:</div>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Growing teams (5-20 devs)</li>
                    <li>• Mature products</li>
                    <li>• Need code boundaries</li>
                    <li>• Want simpler ops</li>
                  </ul>
                  <div className="font-semibold text-slate-900 mt-3">Benefits:</div>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Clear boundaries, simple deploy</li>
                    <li>• Easy refactoring</li>
                    <li>• Can extract modules later</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-purple-200">
                <h4 className="text-lg font-bold text-slate-900 mb-3">🔗 Microservices</h4>
                <p className="text-sm text-slate-700 mb-4">
                  Independently deployable services. High operational overhead but enables team autonomy.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-900">When to use:</div>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Large teams (20+ devs)</li>
                    <li>• Multiple products/domains</li>
                    <li>• Independent scaling needs</li>
                    <li>• Strong DevOps culture</li>
                  </ul>
                  <div className="font-semibold text-slate-900 mt-3">Challenges:</div>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Distributed tracing needed</li>
                    <li>• Network latency</li>
                    <li>• Complex deployment orchestration</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="font-bold text-amber-900 mb-2">Golden Rule: Start with a monolith</div>
                  <p className="text-sm text-amber-800">
                    Most systems should start as a well-structured monolith and only extract services when team size, 
                    deployment frequency, or scaling requirements justify the operational complexity. Premature microservices 
                    can slow down development by 3-5x due to cross-service changes, testing overhead, and debugging difficulty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kubernetes */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                02
              </span>
              CONTAINERS & K8S
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Orchestrate safely
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl">
              Kubernetes gives you declarative rollouts, autoscaling, and self-healing — but it only works well when probes, resource requests, and disruption settings are tuned.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Core primitives</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Deployment / ReplicaSet: stateless rollouts and replica management</li>
                <li>• Service / Ingress: stable routing and traffic entry points</li>
                <li>• ConfigMaps / Secrets: configuration and credentials</li>
                <li>• StatefulSet: stable identities for stateful workloads</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">Scaling + disruptions</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• HPA scales pods based on CPU/memory/custom metrics</li>
                <li>• VPA rightsizes requests/limits (use carefully with HPA)</li>
                <li>• PDBs limit voluntary evictions during node drains</li>
                <li>• Readiness/startup probes prevent scaling on “warming” pods</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section id="deployment-sim" className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">
                03
              </span>
              INTERACTIVE
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Deployment strategy simulator
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl">
              Play with traffic shifting and see how error rate and latency combine across versions.
            </p>
          </div>

          <DeploymentStrategySimulator />
        </section>

        {/* Deployment Strategies Deep Dive */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-rose-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center text-sm">
                04
              </span>
              DEPLOYMENT STRATEGIES
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Safe production rollouts
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mb-6">
              Choosing the right deployment strategy can mean the difference between a smooth release and a production outage. Let's explore each approach in depth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Rolling Deployment</h3>
              <p className="text-sm text-slate-700 mb-4">
                Gradually replaces old pods with new ones. Default Kubernetes strategy.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-slate-900">Pros:</div>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Zero downtime (if configured right)</li>
                  <li>• Resource efficient (no extra capacity)</li>
                  <li>• Built into Kubernetes</li>
                </ul>
                <div className="text-xs font-bold text-slate-900 mt-3">Cons:</div>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Both versions run simultaneously</li>
                  <li>• Rollback slower (gradual)</li>
                  <li>• Requires careful probe tuning</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                <strong>Best for:</strong> Stateless apps with backward-compatible changes. Set <code className="bg-white px-1.5 rounded">maxUnavailable: 0</code> for zero downtime.
              </div>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">🔵🟢</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Blue/Green</h3>
              <p className="text-sm text-slate-700 mb-4">
                Run two identical environments. Switch traffic instantly.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-slate-900">Pros:</div>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Instant rollback (flip switch)</li>
                  <li>• Test in production-like environment</li>
                  <li>• Clean cutover</li>
                </ul>
                <div className="text-xs font-bold text-slate-900 mt-3">Cons:</div>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Requires 2x capacity</li>
                  <li>• Abrupt switchover</li>
                  <li>• Database migrations tricky</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                <strong>Best for:</strong> Critical services where instant rollback is worth the cost. Use external load balancer for traffic switching.
              </div>
            </div>

            <div className="bg-white border-2 border-amber-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">🕊️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Canary</h3>
              <p className="text-sm text-slate-700 mb-4">
                Route small % of traffic to new version. Gradually increase if healthy.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-slate-900">Pros:</div>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Minimizes blast radius</li>
                  <li>• Real production validation</li>
                  <li>• Gradual confidence building</li>
                </ul>
                <div className="text-xs font-bold text-slate-900 mt-3">Cons:</div>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Needs advanced routing (service mesh)</li>
                  <li>• Requires strong observability</li>
                  <li>• Manual or automated promotion logic</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                <strong>Best for:</strong> High-risk changes. Start with 1-5%, monitor metrics, gradually increase to 100% over hours/days.
              </div>
            </div>
          </div>

          {/* Advanced Patterns */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Advanced Deployment Patterns</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-7">
                <h4 className="text-lg font-bold text-slate-900 mb-3">🚩 Feature Flags</h4>
                <p className="text-sm text-slate-700 mb-4">
                  Deploy code but enable features selectively. Decouple deploy from release.
                </p>
                <div className="space-y-3 text-xs">
                  <div className="bg-white rounded p-3 border border-purple-200">
                    <strong>Benefits:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• Test in production without user impact</li>
                      <li>• A/B test new features</li>
                      <li>• Kill switches for problematic features</li>
                      <li>• Gradual rollout by user segment</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <strong>Tools:</strong> LaunchDarkly, Split.io, Unleash, or roll your own with database toggle.
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <strong>Warning:</strong> Flag technical debt accumulates. Clean up old flags regularly!
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-7">
                <h4 className="text-lg font-bold text-slate-900 mb-3">🎯 Shadow/Dark Launching</h4>
                <p className="text-sm text-slate-700 mb-4">
                  Route production traffic to new version but don't return responses to users.
                </p>
                <div className="space-y-3 text-xs">
                  <div className="bg-white rounded p-3 border border-cyan-200">
                    <strong>How it works:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• Fork traffic to canary (async)</li>
                      <li>• Users only see responses from stable version</li>
                      <li>• Monitor canary for errors/performance</li>
                      <li>• No user impact if canary fails</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <strong>Perfect for:</strong> Testing algorithm changes, database migrations, or new code paths with real load.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rollback Strategy */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-red-900 mb-6">🚨 Rollback & Incident Response</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4">Rollback Checklist</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg p-4 border border-red-300">
                    <div className="font-bold text-slate-900 mb-2">1. Detect Issues Fast</div>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• Automated alerts on error rate spikes</li>
                      <li>• Latency p95/p99 thresholds</li>
                      <li>• Business metric canaries (conversion rate)</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-300">
                    <div className="font-bold text-slate-900 mb-2">2. Rollback Process</div>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• Kubernetes: <code className="bg-slate-100 px-1.5 rounded">kubectl rollout undo deployment/my-app</code></li>
                      <li>• Blue/Green: flip load balancer back</li>
                      <li>• Canary: shift traffic back to stable</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-300">
                    <div className="font-bold text-slate-900 mb-2">3. Post-Incident</div>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>• Root cause analysis (RCA)</li>
                      <li>• Add tests to prevent regression</li>
                      <li>• Improve monitoring/alerts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4">Prevention Techniques</h4>
                <div className="space-y-3 text-xs">
                  <div className="bg-white rounded-lg p-4 border border-red-300">
                    <strong className="text-slate-900">Automated Rollback</strong>
                    <p className="text-slate-700 mt-2">
                      Use Flagger, Argo Rollouts, or custom scripts to automatically rollback when metrics degrade.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-300">
                    <strong className="text-slate-900">Progressive Delivery</strong>
                    <p className="text-slate-700 mt-2">
                      1% → 5% → 10% → 25% → 50% → 100% with bake time between each stage. Any alert = halt + rollback.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-300">
                    <strong className="text-slate-900">Circuit Breakers</strong>
                    <p className="text-slate-700 mt-2">
                      Automatically stop routing to failing services. Prevents cascading failures.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-300">
                    <strong className="text-slate-900">Database Migrations</strong>
                    <p className="text-slate-700 mt-2">
                      Always backward-compatible. Deploy schema changes separately from code changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-red-300 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-bold text-slate-900 mb-2">Deployment Success Metrics</div>
                  <div className="grid md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <strong>MTTR (Mean Time To Recovery):</strong> Target &lt;5 min with automated rollback.
                    </div>
                    <div>
                      <strong>Change Failure Rate:</strong> % of deploys causing incidents. Target &lt;5%.
                    </div>
                    <div>
                      <strong>Deploy Frequency:</strong> How often you can safely ship. High performers: 10-100x/day.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Serverless vs managed */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm">
                05
              </span>
              SERVERLESS & MANAGED RUNTIMES
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              When to go serverless
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mb-6">
              For many teams, serverless or managed container platforms are the sweet spot: you keep container portability while delegating infra ops, traffic management, and autoscaling to the provider.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Functions (FaaS)</h3>
              <p className="text-sm text-slate-700 mb-4">
                Lambda, Cloud Functions, Azure Functions. Code runs per-request.
              </p>
              <div className="space-y-2 text-xs mb-4">
                <div className="font-bold text-slate-900">Best for:</div>
                <ul className="space-y-1 text-slate-700">
                  <li>• Event-driven: S3 upload triggers processing</li>
                  <li>• Scheduled jobs: daily ETL, cleanup</li>
                  <li>• Low-traffic APIs (sporadic usage)</li>
                  <li>• Webhooks and integrations</li>
                </ul>
                <div className="font-bold text-slate-900 mt-3">Watch out:</div>
                <ul className="space-y-1 text-slate-700">
                  <li>• Cold starts: 100ms - 3s</li>
                  <li>• 15 min timeout (Lambda)</li>
                  <li>• Vendor lock-in (different APIs)</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-3 text-xs">
                <strong>Cost model:</strong> Pay per request + GB-second. First 1M requests/month often free.
              </div>
            </div>

            <div className="bg-white border-2 border-amber-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Container Serverless</h3>
              <p className="text-sm text-slate-700 mb-4">
                Cloud Run, App Runner, Container Apps. Bring your own container.
              </p>
              <div className="space-y-2 text-xs mb-4">
                <div className="font-bold text-slate-900">Best for:</div>
                <ul className="space-y-1 text-slate-700">
                  <li>• HTTP APIs and web services</li>
                  <li>• Background workers (queue consumers)</li>
                  <li>• Services needing custom dependencies</li>
                  <li>• Microservices without K8s complexity</li>
                </ul>
                <div className="font-bold text-slate-900 mt-3">Benefits:</div>
                <ul className="space-y-1 text-slate-700">
                  <li>• Fast cold starts (&lt;500ms)</li>
                  <li>• Built-in traffic splitting</li>
                  <li>• Scale to zero</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs">
                <strong>Sweet spot:</strong> Most web apps and APIs. Portable containers + zero ops.
              </div>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">☸️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Managed Kubernetes</h3>
              <p className="text-sm text-slate-700 mb-4">
                GKE, EKS, AKS. Full K8s control with managed control plane.
              </p>
              <div className="space-y-2 text-xs mb-4">
                <div className="font-bold text-slate-900">Best for:</div>
                <ul className="space-y-1 text-slate-700">
                  <li>• Multi-workload platforms</li>
                  <li>• Complex stateful apps</li>
                  <li>• Custom networking needs</li>
                  <li>• Organizations already on K8s</li>
                </ul>
                <div className="font-bold text-slate-900 mt-3">Trade-offs:</div>
                <ul className="space-y-1 text-slate-700">
                  <li>• Higher learning curve</li>
                  <li>• More operational overhead</li>
                  <li>• Need 24/7 on-call</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
                <strong>When to choose:</strong> 10+ services or need advanced K8s features (custom CRDs, operators).
              </div>
            </div>
          </div>

          {/* Cold Start Optimization */}
          <div className="bg-gradient-to-br from-slate-50 to-purple-50 border-2 border-slate-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">🧊 Cold Start Optimization</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4">What Causes Cold Starts?</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <strong>1. Container/Runtime Initialization</strong>
                    <p className="text-xs text-slate-700 mt-1">Platform provisions compute, downloads image, starts runtime. 500ms - 3s.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <strong>2. Code Loading</strong>
                    <p className="text-xs text-slate-700 mt-1">Import dependencies, parse code. Node.js/Python faster than Java/C#.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <strong>3. App Initialization</strong>
                    <p className="text-xs text-slate-700 mt-1">DB connections, config loading, cache warming. Your code runs here.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4">Mitigation Strategies</h4>
                <div className="space-y-2 text-xs">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <strong>Provisioned Concurrency</strong>
                    <p className="text-slate-700 mt-1">Keep N instances warm 24/7. Costs more but guarantees fast response. Use for latency-sensitive endpoints.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <strong>Smaller Dependencies</strong>
                    <p className="text-slate-700 mt-1">Trim unused libraries. Use tree-shaking. Smaller bundle = faster load.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <strong>Lazy Loading</strong>
                    <p className="text-slate-700 mt-1">Import heavy dependencies only when needed. Initialize connections after first request.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <strong>Keep-Alive Pings</strong>
                    <p className="text-slate-700 mt-1">CloudWatch Events/Scheduler to ping every 5 min. Prevents instance shutdown during low traffic.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <strong>Connection Pooling</strong>
                    <p className="text-slate-700 mt-1">Reuse DB connections across invocations. Store outside handler function (Lambda) or use global state.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Observability & Monitoring */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                06
              </span>
              OBSERVABILITY
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Monitor what matters
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mb-6">
              You can't improve what you don't measure. Build observability into your deployment pipeline from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-7">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Metrics</h3>
              <p className="text-sm text-slate-700 mb-4">
                Time-series data: CPU, memory, request rate, latency percentiles.
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-white rounded p-3 border border-blue-200">
                  <strong>Golden Signals (SRE):</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Latency (p50, p95, p99)</li>
                    <li>• Traffic (requests/sec)</li>
                    <li>• Errors (% of requests)</li>
                    <li>• Saturation (resource usage)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <strong>Tools:</strong> Prometheus, Datadog, Grafana, CloudWatch
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-7">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Logs</h3>
              <p className="text-sm text-slate-700 mb-4">
                Discrete events: errors, debug info, audit trail.
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-white rounded p-3 border border-purple-200">
                  <strong>Best Practices:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Structured logging (JSON)</li>
                    <li>• Include request ID</li>
                    <li>• Log levels (DEBUG → ERROR)</li>
                    <li>• Centralized aggregation</li>
                  </ul>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <strong>Tools:</strong> ELK Stack, Loki, CloudWatch Logs, Splunk
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-7">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Traces</h3>
              <p className="text-sm text-slate-700 mb-4">
                Request journey across services. Shows latency breakdown.
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-white rounded p-3 border border-emerald-200">
                  <strong>What You Get:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• End-to-end request flow</li>
                    <li>• Latency per service/operation</li>
                    <li>• Dependency visualization</li>
                    <li>• Error attribution</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                  <strong>Tools:</strong> Jaeger, Zipkin, AWS X-Ray, OpenTelemetry
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-amber-900 mb-6">🚨 Alerting Strategy</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4">Alert on Symptoms, Not Causes</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <strong className="text-green-700">✓ Good: "Error rate &gt; 1%"</strong>
                    <p className="text-xs text-slate-700 mt-1">Users are impacted. This is what matters.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <strong className="text-green-700">✓ Good: "p95 latency &gt; 500ms"</strong>
                    <p className="text-xs text-slate-700 mt-1">UX is degraded. Actionable signal.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <strong className="text-red-700">✗ Bad: "CPU &gt; 80%"</strong>
                    <p className="text-xs text-slate-700 mt-1">May not impact users. Use as info/dashboard metric.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <strong className="text-red-700">✗ Bad: "Disk &gt; 90%"</strong>
                    <p className="text-xs text-slate-700 mt-1">Alert when requests start failing, not disk usage alone.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4">Alert Severity Levels</h4>
                <div className="space-y-2 text-xs">
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                    <strong className="text-red-900">🔴 P0 (Page immediately)</strong>
                    <p className="text-slate-800 mt-1">Service down, data loss risk, security breach. Wake someone up.</p>
                    <p className="text-slate-700 mt-2"><strong>Example:</strong> Error rate &gt; 5% for 5 min</p>
                  </div>
                  <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                    <strong className="text-orange-900">🟠 P1 (Alert, no page)</strong>
                    <p className="text-slate-800 mt-1">Degraded performance, partial outage. Address in business hours.</p>
                    <p className="text-slate-700 mt-2"><strong>Example:</strong> p95 latency 2x baseline</p>
                  </div>
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                    <strong className="text-yellow-900">🟡 P2 (Ticket/dashboard)</strong>
                    <p className="text-slate-800 mt-1">Early warning, not yet impacting users. Monitor and plan fix.</p>
                    <p className="text-slate-700 mt-2"><strong>Example:</strong> Disk 85% full</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white border border-amber-300 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="font-bold text-slate-900 mb-2">On-Call Best Practice</div>
                  <p className="text-sm text-slate-700">
                    If an alert fires and no action is taken, either the alert threshold is wrong or the issue isn't important enough to alert. 
                    Review and adjust alerts monthly. Target: &lt;2 pages/week per person. More = alert fatigue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-6">
          <div className="flex justify-between items-center">
            <button onClick={() => nav("/networking")} className="btn-secondary">
              ← Previous: Networking
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => nav("/")}
                className="btn-tertiary"
              >
                Home
              </button>
              <button onClick={() => nav("/data-architecture")} className="btn-primary">
                Next: Data Architecture →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
