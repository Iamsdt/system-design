import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import AlertTuningSimulator from "./components/alert-tuning-simulator"
import CostOptimizationCalculator from "./components/cost-optimization-calculator"
import ObservabilityStackBuilder from "./components/observability-stack-builder"
import SLODashboard from "./components/slo-dashboard"
import LogAggregation from "./components/log-aggregation"
import StructuredLogging from "./components/structured-logging"
import DistributedTracing from "./components/distributed-tracing"
import APMTools from "./components/apm-tools"
import SyntheticMonitoring from "./components/synthetic-monitoring"
import RealUserMonitoring from "./components/real-user-monitoring"
import SREPractices from "./components/sre-practices"
import OnCallBestPractices from "./components/oncall-best-practices"
import CapacityPlanning from "./components/capacity-planning"
import ServiceCatalog from "./components/service-catalog"

/**
 * Observability & Operations page component
 * Comprehensive guide to Metrics, Logs, Traces, Dashboards, Alerts, and Incident Response
 */
export default function ObservabilityOperations() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 mb-6">
              <span className="text-sm font-medium text-cyan-700">Module 8</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Observability & <span className="text-gradient">Operations</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 mx-auto">
              Master the three pillars of observability, design effective alerting
              strategies, manage incidents with confidence, and optimize cloud
              costs through data-driven operations.
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
        {/* Section 1: The Three Pillars */}
        <section
          ref={(element) => (sectionsReference.current[0] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-sm">
                  01
                </span>
                THE THREE PILLARS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Metrics, Logs & Traces
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              You can&apos;t fix what you can&apos;t see. Modern observability requires a
              unified approach to telemetry data using OpenTelemetry standards.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-cyan-900 mb-4">Telemetry Types</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="text-2xl">📊</div>
                    <div>
                      <div className="font-bold text-slate-900">Metrics</div>
                      <p className="text-sm text-slate-700">Numerical data over time (CPU, Error Rate). Great for alerting and trends.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-2xl">📜</div>
                    <div>
                      <div className="font-bold text-slate-900">Logs</div>
                      <p className="text-sm text-slate-700">Immutable records of events. Essential for root cause analysis.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-2xl">🔗</div>
                    <div>
                      <div className="font-bold text-slate-900">Traces</div>
                      <p className="text-sm text-slate-700">End-to-end request flow across services. Vital for microservices.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">OpenTelemetry (OTel)</h3>
                <p className="text-slate-700 mb-4">
                  A vendor-neutral standard for collecting telemetry. It provides a single set of APIs and libraries to instrument your applications.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold block mb-1">No Vendor Lock-in</span>
                    Switch backends without changing code.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold block mb-1">Unified SDK</span>
                    One library for metrics, logs, and traces.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ObservabilityStackBuilder />
            </div>
          </div>
        </section>

        {/* Section: Log Aggregation */}
        <section
          ref={(element) => (sectionsReference.current[1] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <LogAggregation />
        </section>

        {/* Section: Structured Logging */}
        <section
          ref={(element) => (sectionsReference.current[2] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <StructuredLogging />
        </section>

        {/* Section: Distributed Tracing */}
        <section
          ref={(element) => (sectionsReference.current[3] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <DistributedTracing />
        </section>

        {/* Section: APM Tools */}
        <section
          ref={(element) => (sectionsReference.current[4] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <APMTools />
        </section>

        {/* Section: Synthetic Monitoring */}
        <section
          ref={(element) => (sectionsReference.current[5] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <SyntheticMonitoring />
        </section>

        {/* Section: Real User Monitoring */}
        <section
          ref={(element) => (sectionsReference.current[6] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <RealUserMonitoring />
        </section>

        {/* Section: SRE Practices */}
        <section
          ref={(element) => (sectionsReference.current[7] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <SREPractices />
        </section>

        {/* Section: On-Call Best Practices */}
        <section
          ref={(element) => (sectionsReference.current[8] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <OnCallBestPractices />
        </section>

        {/* Section: Capacity Planning */}
        <section
          ref={(element) => (sectionsReference.current[9] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <CapacityPlanning />
        </section>

        {/* Section: Service Catalog */}
        <section
          ref={(element) => (sectionsReference.current[10] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <ServiceCatalog />
        </section>

        {/* Section 2: Dashboards & Alerts */}
        <section
          ref={(element) => (sectionsReference.current[11] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center text-sm">
                  02
                </span>
                DASHBOARDS & ALERTS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Alert Design & SLO Tracking
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Avoid alert fatigue by alerting on symptoms, not causes. Use
              multi-window burn rates to detect SLO violations early.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <AlertTuningSimulator />
            </div>
            <div>
              <SLODashboard />
            </div>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Effective Alerting Principles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">1</div>
                <h4 className="font-bold">Actionable</h4>
                <p className="text-sm text-slate-600">Every alert should have a clear, documented response procedure.</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">2</div>
                <h4 className="font-bold">Symptom-Based</h4>
                <p className="text-sm text-slate-600">Alert on "Users can't login" rather than "CPU is 90%".</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">3</div>
                <h4 className="font-bold">Tiered Severity</h4>
                <p className="text-sm text-slate-600">Critical (Page), Warning (Slack), Info (Dashboard only).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Incident Response */}
        <section
          ref={(element) => (sectionsReference.current[12] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-sm">
                  03
                </span>
                INCIDENT RESPONSE
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Playbooks, On-call & Game Days
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Incidents are inevitable. Success is measured by how quickly you
              detect, mitigate, and learn from them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Runbooks</h3>
              <p className="text-sm text-slate-600">Step-by-step guides for common tasks and troubleshooting. Keep them updated and automated where possible.</p>
            </div>
            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">On-call Hygiene</h3>
              <p className="text-sm text-slate-600">Fair rotations, clear escalation paths, and compensation. Prevent burnout to maintain system health.</p>
            </div>
            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Game Days</h3>
              <p className="text-sm text-slate-600">Scheduled chaos exercises to test your response. Practice makes perfect before a real outage hits.</p>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">The Blameless Postmortem</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-slate-300 mb-4">
                  Focus on <strong>how</strong> the system failed, not <strong>who</strong> failed. The goal is to identify systemic improvements.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> What happened? (Timeline)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Why did it happen? (Root Cause)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> How did we respond?
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Action items to prevent recurrence.
                  </li>
                </ul>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Pro Tip</div>
                <p className="text-sm italic text-slate-300">
                  "If you can't find a way to make the system more resilient to human error, you haven't finished the postmortem."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Cost Optimization */}
        <section
          ref={(element) => (sectionsReference.current[13] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center text-sm">
                  04
                </span>
                COST OPTIMIZATION
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Rightsizing & Resource Efficiency
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Cloud costs can spiral out of control. Use observability data to
              rightsize resources and eliminate waste.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <CostOptimizationCalculator />
            </div>
            <div className="space-y-6">
              <div className="bg-white border-2 border-green-200 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">FinOps Strategies</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="font-bold text-green-900">Reserved Instances / Savings Plans</div>
                    <p className="text-sm text-slate-700">Commit to usage for 1-3 years to get up to 70% discount on predictable workloads.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="font-bold text-green-900">Spot Instances</div>
                    <p className="text-sm text-slate-700">Use spare capacity for fault-tolerant workloads (batch processing, CI/CD) at 90% discount.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="font-bold text-green-900">Auto-scaling</div>
                    <p className="text-sm text-slate-700">Dynamically adjust resources based on demand to avoid paying for idle capacity.</p>
                  </div>
                </div>
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
              <button onClick={() => nav("/security-governance")} className="btn-secondary">
                ← Previous: Security
              </button>
              <button onClick={() => nav("/cloud-comparisons")} className="btn-primary">
                Next: Cloud Comparisons →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
