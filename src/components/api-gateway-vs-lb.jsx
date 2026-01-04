import {
  Server,
  Shield,
  Zap,
  Lock,
  BarChart3,
  GitBranch,
  CheckCircle,
  XCircle,
  ArrowRight,
  Cloud,
  Settings,
} from "lucide-react"
import { useState } from "react"

/**
 *
 */
export default function ApiGatewayVsLoadBalancer() {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [showArchitecture, setShowArchitecture] = useState(false)

  const features = {
    gateway: {
      name: "API Gateway",
      icon: Cloud,
      color: "emerald",
      tagline: "Application Layer (Layer 7)",
      purpose: "Intelligent request routing, transformation, and management",
      when: "When you need API-specific features like authentication, rate limiting, request transformation",
      features: [
        {
          name: "Request/Response Transformation",
          has: true,
          desc: "Modify headers, body, format",
        },
        {
          name: "Authentication & Authorization",
          has: true,
          desc: "OAuth, JWT, API keys",
        },
        {
          name: "Rate Limiting & Throttling",
          has: true,
          desc: "Per-user, per-API limits",
        },
        {
          name: "API Versioning",
          has: true,
          desc: "Route to different versions",
        },
        { name: "Request Validation", has: true, desc: "Schema validation" },
        {
          name: "Protocol Translation",
          has: true,
          desc: "REST → gRPC, HTTP → WebSocket",
        },
        {
          name: "Analytics & Monitoring",
          has: true,
          desc: "Detailed API metrics",
        },
        { name: "Caching", has: true, desc: "Response caching" },
        { name: "Health Checks", has: true, desc: "Basic health monitoring" },
        { name: "SSL Termination", has: true, desc: "Handles TLS" },
      ],
      tools: [
        { name: "Kong", desc: "Open-source, plugin ecosystem" },
        { name: "AWS API Gateway", desc: "Managed service, serverless" },
        { name: "Azure API Management", desc: "Enterprise features" },
        { name: "Google Cloud Endpoints", desc: "OpenAPI support" },
        { name: "Tyk", desc: "Open-source alternative" },
      ],
      useCases: [
        "Microservices architecture",
        "Public-facing APIs",
        "Multi-tenant applications",
        "Mobile app backends",
        "Serverless applications",
      ],
    },
    loadbalancer: {
      name: "Load Balancer",
      icon: Server,
      color: "blue",
      tagline:
        "Transport/Network Layer (Layer 4) or Application Layer (Layer 7)",
      purpose: "Distribute traffic efficiently across multiple servers",
      when: "When you need high-performance traffic distribution without API-specific logic",
      features: [
        {
          name: "Request/Response Transformation",
          has: false,
          desc: "Not a primary feature",
        },
        {
          name: "Authentication & Authorization",
          has: false,
          desc: "Not handled",
        },
        {
          name: "Rate Limiting & Throttling",
          has: false,
          desc: "Basic at best",
        },
        { name: "API Versioning", has: false, desc: "Not API-aware" },
        { name: "Request Validation", has: false, desc: "No validation" },
        {
          name: "Protocol Translation",
          has: false,
          desc: "Typically not supported",
        },
        {
          name: "Analytics & Monitoring",
          has: true,
          desc: "Connection & traffic metrics",
        },
        { name: "Caching", has: false, desc: "Not a focus" },
        {
          name: "Health Checks",
          has: true,
          desc: "Advanced health monitoring",
        },
        { name: "SSL Termination", has: true, desc: "Excellent TLS support" },
      ],
      additional: [
        {
          name: "Traffic Distribution",
          has: true,
          desc: "Round-robin, least connections, IP hash",
        },
        { name: "Session Persistence", has: true, desc: "Sticky sessions" },
        {
          name: "Connection Pooling",
          has: true,
          desc: "Efficient connection reuse",
        },
        {
          name: "DDoS Protection",
          has: true,
          desc: "Rate limiting at network layer",
        },
      ],
      tools: [
        { name: "NGINX", desc: "High-performance, widely used" },
        { name: "HAProxy", desc: "Reliable, battle-tested" },
        { name: "AWS ELB/ALB/NLB", desc: "Managed load balancers" },
        { name: "Traefik", desc: "Cloud-native, Kubernetes-friendly" },
        { name: "Envoy", desc: "Service mesh proxy" },
      ],
      useCases: [
        "High-traffic websites",
        "Database connection pooling",
        "Internal service communication",
        "WebSocket servers",
        "Video streaming",
      ],
    },
  }

  const architectureData = {
    separate: {
      title: "Separate (Recommended)",
      desc: "Use both - API Gateway in front, Load Balancer behind",
      diagram: ["Client", "API Gateway", "Load Balancer", "Backend Servers"],
      benefits: [
        "API Gateway handles business logic (auth, rate limiting, transformation)",
        "Load Balancer handles efficient traffic distribution",
        "Separation of concerns - easier to scale and maintain",
        "Each component optimized for its purpose",
      ],
      example: "Client → Kong/AWS API Gateway → ALB/NGINX → Microservices",
    },
    gatewayOnly: {
      title: "API Gateway Only",
      desc: "Gateway handles both routing and load balancing",
      diagram: ["Client", "API Gateway", "Backend Servers"],
      benefits: [
        "Simpler architecture",
        "Fewer components to manage",
        "Good for smaller applications",
        "Lower latency (one less hop)",
      ],
      tradeoffs: [
        "May not scale as well",
        "Gateway becomes a bottleneck",
        "Less specialized load balancing",
      ],
      example: "Client → AWS API Gateway → Lambda Functions",
    },
    lbOnly: {
      title: "Load Balancer Only",
      desc: "Just distribute traffic, no API management",
      diagram: ["Client", "Load Balancer", "Backend Servers"],
      benefits: [
        "Maximum performance",
        "Simple and reliable",
        "Lower latency",
        "Good for internal services",
      ],
      tradeoffs: [
        "No API management features",
        "Authentication in each service",
        "Manual rate limiting implementation",
      ],
      example: "Client → NGINX/HAProxy → Web Servers",
    },
  }

  return (
    <div className="space-y-8">
      {/* Main Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Gateway Card */}
        <div className="bg-white rounded-xl border-2 border-emerald-200 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-emerald-100">
              <Cloud className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {features.gateway.name}
              </h3>
              <p className="text-sm text-emerald-600 font-medium">
                {features.gateway.tagline}
              </p>
            </div>
          </div>
          <p className="text-slate-700 mb-4">{features.gateway.purpose}</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-emerald-900">When to use:</p>
            <p className="text-sm text-slate-700">{features.gateway.when}</p>
          </div>

          <h4 className="font-semibold text-slate-900 mb-3">Key Features:</h4>
          <div className="space-y-2 mb-4">
            {features.gateway.features.slice(0, 8).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                {feature.has ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span
                    className={`text-sm ${feature.has ? "text-slate-900 font-medium" : "text-slate-400"}`}
                  >
                    {feature.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mb-2 text-sm">
            Popular Tools:
          </h4>
          <div className="flex flex-wrap gap-2">
            {features.gateway.tools.map((tool, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded"
              >
                {tool.name}
              </span>
            ))}
          </div>
        </div>

        {/* Load Balancer Card */}
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Server className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {features.loadbalancer.name}
              </h3>
              <p className="text-sm text-blue-600 font-medium">
                {features.loadbalancer.tagline}
              </p>
            </div>
          </div>
          <p className="text-slate-700 mb-4">{features.loadbalancer.purpose}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-blue-900">When to use:</p>
            <p className="text-sm text-slate-700">
              {features.loadbalancer.when}
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mb-3">Key Features:</h4>
          <div className="space-y-2 mb-4">
            {features.loadbalancer.features
              .slice(0, 8)
              .map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  {feature.has ? (
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span
                      className={`text-sm ${feature.has ? "text-slate-900 font-medium" : "text-slate-400"}`}
                    >
                      {feature.name}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <h4 className="font-semibold text-slate-900 mb-2 text-sm">
            Popular Tools:
          </h4>
          <div className="flex flex-wrap gap-2">
            {features.loadbalancer.tools.map((tool, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
              >
                {tool.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Feature Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Detailed Feature Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">
                  Feature
                </th>
                <th className="text-center py-3 px-4 font-semibold text-emerald-700">
                  API Gateway
                </th>
                <th className="text-center py-3 px-4 font-semibold text-blue-700">
                  Load Balancer
                </th>
              </tr>
            </thead>
            <tbody>
              {features.gateway.features.map((feature, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-3 px-4 text-slate-700">{feature.name}</td>
                  <td className="py-3 px-4 text-center">
                    {features.gateway.features[index].has ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {features.loadbalancer.features[index].has ? (
                      <CheckCircle className="w-5 h-5 text-blue-600 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Patterns */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Can They Coexist?
        </h3>
        <p className="text-slate-600 mb-6">
          Yes! Here are three common architecture patterns:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(architectureData).map(([key, arch]) => (
            <button
              key={key}
              onClick={() => setShowArchitecture(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                showArchitecture === key
                  ? "border-indigo-500 bg-indigo-50 shadow-lg"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
            >
              <h4 className="font-semibold text-slate-900 mb-1">
                {arch.title}
              </h4>
              <p className="text-sm text-slate-600">{arch.desc}</p>
            </button>
          ))}
        </div>

        {showArchitecture && (
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4">
              {architectureData[showArchitecture].title} Architecture
            </h4>

            {/* Flow Diagram */}
            <div className="flex items-center justify-start flex-wrap gap-3 mb-6 p-4 bg-white rounded-lg">
              {architectureData[showArchitecture].diagram.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-900 font-medium text-sm whitespace-nowrap">
                    {step}
                  </div>
                  {index <
                    architectureData[showArchitecture].diagram.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="mb-4">
              <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Benefits:
              </h5>
              <ul className="space-y-1">
                {architectureData[showArchitecture].benefits.map(
                  (benefit, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-700 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Tradeoffs */}
            {architectureData[showArchitecture].tradeoffs && (
              <div className="mb-4">
                <h5 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-600" />
                  Trade-offs:
                </h5>
                <ul className="space-y-1">
                  {architectureData[showArchitecture].tradeoffs.map(
                    (tradeoff, index) => (
                      <li
                        key={index}
                        className="text-sm text-slate-700 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        {tradeoff}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Example */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900 mb-1">
                Real-World Example:
              </p>
              <p className="text-sm text-slate-600 font-mono">
                {architectureData[showArchitecture].example}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Decision Guide */}
      <div className="border border-indigo-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Decision Guide: Which Should You Use?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-emerald-900 mb-3">
              Choose API Gateway when:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                You need authentication/authorization
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                You want API versioning and routing
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                Rate limiting and throttling are required
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                Request/response transformation needed
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                Building public-facing APIs
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">
              Choose Load Balancer when:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                Maximum performance is critical
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                Simple traffic distribution needed
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                Internal service communication
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                TCP/UDP protocols (non-HTTP)
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                High-traffic scenarios
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
          <p className="text-sm text-slate-700">
            <strong className="text-indigo-900">Pro Tip:</strong> In production,
            use both! API Gateway for intelligent routing and API management,
            Load Balancer for efficient traffic distribution. Example: AWS API
            Gateway → ALB → EC2 instances or ECS containers.
          </p>
        </div>
      </div>
    </div>
  )
}
