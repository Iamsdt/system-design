import {
  Calculator,
  Globe,
  Database,
  Server,
  Zap,
  Shield,
  Lock,
  Activity,
  Cloud,
  BookOpen,
  BarChart,
  Rocket,
  ChevronRight,
} from "lucide-react"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

/**
 * Topics page component - System Design & Cloud Engineering Essentials
 * Displays the comprehensive topics guide with interactive sections
 */
export default function Topics() {
  const nav = useNavigate()
  const sectionsReference = useRef([])

  // Intersection Observer for fade-in animations
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    sectionsReference.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const topics = [
    {
      id: 1,
      number: "01",
      title: "Core Principles & Sizing",
      color: "blue",
      icon: <Calculator className="w-8 h-8" />,
      description:
        "Interview flow, performance vs scalability, back-of-envelope estimates, and scaling strategies",
      keyPoints: [
        "Interview flow & requirements mapping",
        "Performance vs scalability",
        "Back-of-envelope estimates",
        "Vertical vs horizontal scaling",
      ],
      demos: [
        "Capacity/QPS planner",
        "Availability calculator",
        "CAP theorem visualizer",
        "Scaling comparison tool",
      ],
    },
    {
      id: 2,
      number: "02",
      title: "Networking & Edge Delivery",
      color: "indigo",
      icon: <Globe className="w-8 h-8" />,
      description: "DNS, protocols, load balancing, CDN, and edge computing",
      keyPoints: [
        "IP/DNS basics & geo-routing",
        "HTTP/2/3 & TCP vs UDP",
        "Load balancers (L4/L7)",
        "CDN strategies",
      ],
      demos: [
        "DNS resolution flow",
        "CDN cache simulator",
        "OSI model diagram",
        "Load balancer algorithms",
      ],
    },
    {
      id: 3,
      number: "03",
      title: "Data Architecture & Storage",
      color: "purple",
      icon: <Database className="w-8 h-8" />,
      description:
        "Database selection, storage models, replication, sharding, and caching",
      keyPoints: [
        "SQL vs NoSQL selection",
        "Storage models (KV, document, graph)",
        "Replication & sharding",
        "Caching patterns",
      ],
      demos: [
        "Database selector",
        "Caching strategy simulator",
        "Sharding calculator",
        "Consistent hashing visualizer",
      ],
    },
    {
      id: 4,
      number: "04",
      title: "Compute & Runtime Models",
      color: "amber",
      icon: <Server className="w-8 h-8" />,
      description:
        "Containers, serverless, Kubernetes, and deployment strategies",
      keyPoints: [
        "Runtime choices (VM/container/function)",
        "Monolith vs microservices",
        "Kubernetes orchestration",
        "Deployment strategies",
      ],
      demos: [
        "Deployment simulator",
        "K8s rollout visualizer",
        "Runtime decision tree",
        "Autoscaling simulator",
      ],
    },
    {
      id: 5,
      number: "05",
      title: "APIs, Integration & Data Movement",
      color: "teal",
      icon: <Zap className="w-8 h-8" />,
      description:
        "REST/gRPC/GraphQL, API gateways, messaging, and real-time communication",
      keyPoints: [
        "REST vs gRPC vs GraphQL",
        "API Gateway patterns",
        "Async messaging (queues/pub-sub)",
        "Real-time (WebSockets/SSE)",
      ],
      demos: [
        "API Gateway simulator",
        "Protocol comparator",
        "Rate limiter sandbox",
        "Message queue simulator",
      ],
    },
    {
      id: 6,
      number: "06",
      title: "Reliability & Resilience",
      color: "red",
      icon: <Shield className="w-8 h-8" />,
      description:
        "SLOs, error budgets, graceful degradation, circuit breakers, and disaster recovery",
      keyPoints: [
        "SLO-driven design",
        "Graceful degradation",
        "Circuit breakers & bulkheads",
        "DR/backup strategies",
        "Distributed consensus (Raft)",
      ],
      demos: [
        "SLO/Error Budget calculator",
        "Circuit breaker simulator",
        "DR scenario planner",
        "Raft leader election",
      ],
    },
    {
      id: 7,
      number: "07",
      title: "Security, Governance & Compliance",
      color: "green",
      icon: <Lock className="w-8 h-8" />,
      description:
        "AuthN/AuthZ, network security, secrets management, and zero-trust",
      keyPoints: [
        "OAuth2/OIDC/JWT",
        "mTLS & key management",
        "VPC segmentation & WAF",
        "Secrets management",
        "Zero-trust architecture",
      ],
      demos: [
        "OAuth2 flow visualizer",
        "JWT token decoder",
        "IAM policy builder",
        "Network segmentation designer",
      ],
    },
    {
      id: 8,
      number: "08",
      title: "Observability & Operations",
      color: "cyan",
      icon: <Activity className="w-8 h-8" />,
      description:
        "Metrics, logs, traces, dashboards, alerts, and incident response",
      keyPoints: [
        "Metrics/logs/traces",
        "OpenTelemetry",
        "Dashboard & alert design",
        "Incident response playbooks",
        "Cost optimization",
      ],
      demos: [
        "Observability stack builder",
        "Alert tuning simulator",
        "SLO dashboard",
        "Cost optimization calculator",
      ],
    },
    {
      id: 9,
      number: "09",
      title: "Cloud Service Comparisons",
      color: "orange",
      icon: <Cloud className="w-8 h-8" />,
      description: "Managed service comparisons across GCP, AWS, and Azure",
      keyPoints: [
        "Database services (SQL, NoSQL, Data Warehouses)",
        "Messaging/streaming platforms",
        "Compute options (serverless, containers, K8s)",
        "Storage & caching services",
        "Networking & CDN",
      ],
      demos: [
        "Service comparison matrix",
        "Cost calculator",
        "Feature comparison tool",
      ],
    },
    {
      id: 10,
      number: "10",
      title: "Real-World Case Studies",
      color: "emerald",
      icon: <BookOpen className="w-8 h-8" />,
      description:
        "Learning from Netflix, Uber, Discord, WhatsApp, and Twitter",
      keyPoints: [
        "Netflix: Chaos Engineering",
        "Uber: Geospatial Scaling (H3)",
        "Discord: Trillions of Messages",
        "WhatsApp: Extreme Efficiency",
        "Twitter: Fan-out Hybrid Model",
      ],
      demos: [
        "Timeline fan-out simulator",
        "Geospatial visualizer",
        "Chaos sandbox",
        "Message sharding lab",
      ],
    },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        badge: "bg-blue-600",
        hover: "hover:border-blue-400",
      },
      indigo: {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text: "text-indigo-700",
        badge: "bg-indigo-600",
        hover: "hover:border-indigo-400",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        badge: "bg-purple-600",
        hover: "hover:border-purple-400",
      },
      amber: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        badge: "bg-amber-600",
        hover: "hover:border-amber-400",
      },
      teal: {
        bg: "bg-teal-50",
        border: "border-teal-200",
        text: "text-teal-700",
        badge: "bg-teal-600",
        hover: "hover:border-teal-400",
      },
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        badge: "bg-red-600",
        hover: "hover:border-red-400",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        badge: "bg-green-600",
        hover: "hover:border-green-400",
      },
      cyan: {
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        text: "text-cyan-700",
        badge: "bg-cyan-600",
        hover: "hover:border-cyan-400",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        badge: "bg-orange-600",
        hover: "hover:border-orange-400",
      },
      pink: {
        bg: "bg-pink-50",
        border: "border-pink-200",
        text: "text-pink-700",
        badge: "bg-pink-600",
        hover: "hover:border-pink-400",
      },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative gradient-overlay py-20 md:py-32 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-blue-700">
                Complete Topics Guide
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              System Design &{" "}
              <span className="text-gradient">Cloud Engineering</span>{" "}
              Essentials
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 mx-auto leading-relaxed">
              A comprehensive guide to system design and cloud fundamentals.
              Learn to pick the right data/compute patterns and compare managed
              cloud options through interactive tutorials and real-world
              examples.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 my-5">
              <button onClick={() => nav("/")} className="btn-secondary">
                Back to Home
              </button>
              <button
                onClick={() => nav("/foundations")}
                className="btn-primary"
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-16  from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              All Topics Covered
            </h2>
            <p className="text-lg text-slate-600 mx-auto">
              Explore 10 comprehensive modules covering everything from core
              principles to advanced cloud engineering practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => {
              const colors = getColorClasses(topic.color)
              const topicRoutes = {
                1: "/foundations",
                2: "/networking",
                3: "/data-architecture",
                4: "/compute-runtime",
                5: "/apis-integration",
                6: "/reliability-resilience",
                7: "/security-governance",
                8: "/observability-operations",
                9: "/cloud-comparisons",
                10: "/case-studies",
              }
              const topicRoute = topicRoutes[topic.id]
              return (
                <div
                  key={topic.id}
                  ref={(element) =>
                    (sectionsReference.current[index] = element)
                  }
                  onClick={topicRoute ? () => nav(topicRoute) : undefined}
                  className={`transition-all duration-700 bg-white border-2 ${colors.border} rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${colors.hover} flex flex-col ${topicRoute ? "cursor-pointer" : ""}`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-14 h-14 rounded-xl ${colors.badge} flex items-center justify-center font-bold text-lg flex-shrink-0`}
                    >
                      <span className={`${colors.text}`}>{topic.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {topic.number}. {topic.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 my-2">
                    {topic.description}
                  </p>

                  <div className="mb-6 flex-1 my-5">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">
                        Key Topics:
                      </h4>
                      <ul className="space-y-1 my-2">
                        {topic.keyPoints.map((point, index_) => (
                          <li
                            key={index_}
                            className="text-xs text-slate-700 flex items-start gap-2"
                          >
                            <span className={`${colors.text} mt-1`}>•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">
                        Interactive Demos:
                      </h4>
                      <div className="flex flex-wrap gap-2 my-2">
                        {topic.demos.map((demo, index_) => (
                          <span
                            key={index_}
                            className={`text-xs px-2 py-1 rounded-md ${colors.bg} ${colors.text} border ${colors.border}`}
                          >
                            {demo}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Topic {topic.number}
                      </span>
                      <div
                        className={`text-xs font-semibold ${colors.text} flex items-center gap-1`}
                      >
                        <span>Explore</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demos Overview */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Interactive Demos & Tools
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Hands-on interactive tools to help you understand and practice
              system design concepts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Capacity Planning",
                icon: <Calculator className="w-8 h-8 text-blue-600" />,
                description: "Calculate QPS, bandwidth, and storage needs",
                link: "/foundations",
              },
              {
                title: "Availability Calculator",
                icon: <BarChart className="w-8 h-8 text-indigo-600" />,
                description: "Understand downtime math and nines",
                link: "/foundations",
              },
              {
                title: "Database Selector",
                icon: <Database className="w-8 h-8 text-purple-600" />,
                description: "Choose the right database for your workload",
                link: "/data-architecture",
              },
              {
                title: "Caching Simulator",
                icon: <Zap className="w-8 h-8 text-amber-600" />,
                description: "Visualize cache-aside vs write-through",
                link: "/data-architecture",
              },
              {
                title: "API Gateway",
                icon: <Zap className="w-8 h-8 text-teal-600" />,
                description: "Simulate rate limiting and routing",
                link: "/apis-integration",
              },
              {
                title: "Deployment Strategies",
                icon: <Rocket className="w-8 h-8 text-red-600" />,
                description: "Compare rolling, blue/green, and canary",
                link: "/compute-runtime",
              },
              {
                title: "Chaos Sandbox",
                icon: <Activity className="w-8 h-8 text-emerald-600" />,
                description: "Simulate cascading failures (Netflix style)",
                link: "/case-studies",
              },
            ].map((demo, index) => (
              <div
                key={index}
                onClick={() => nav(demo.link)}
                className="bg-white border-2 border-slate-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 hover:border-blue-200"
              >
                <div className="mb-4">{demo.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {demo.title}
                </h3>
                <p className="text-sm text-slate-600">{demo.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Learning Path */}
      {/* <section className="py-16  from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Recommended Learning Path
            </h2>
            <p className="text-lg text-slate-600">
              Follow this sequence for the best learning experience
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: 1,
                topic: "Core Principles & Sizing",
                link: "/foundations",
              },
              {
                step: 2,
                topic: "Networking & Edge Delivery",
                link: "/networking",
              },
              {
                step: 3,
                topic: "Data Architecture & Storage",
                link: "/data-architecture",
              },
              {
                step: 4,
                topic: "Compute & Runtime Models",
                link: "/compute-runtime",
              },
              {
                step: 5,
                topic: "APIs, Integration & Data Movement",
                link: "/apis-integration",
              },
              {
                step: 6,
                topic: "Reliability & Resilience",
                link: "/reliability-resilience",
              },
              {
                step: 7,
                topic: "Security & Governance",
                link: "/security-governance",
              },
              {
                step: 8,
                topic: "Observability & Operations",
                link: "/observability-operations",
              },
              {
                step: 9,
                topic: "Cloud Comparisons",
                link: "/cloud-comparisons",
              },
              {
                step: 10,
                topic: "Real-World Case Studies",
                link: "/case-studies",
              },
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => nav(item.link)}
                className="bg-white rounded-xl p-6 border-2 border-indigo-200 cursor-pointer hover:border-indigo-400 hover:shadow-lg transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.topic}
                  </h3>
                </div>
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Navigation */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <button onClick={() => nav("/")} className="btn-secondary">
              ← Back to Home
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => nav("/foundations")}
                className="btn-primary"
              >
                Start Learning →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
