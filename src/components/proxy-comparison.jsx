import {
  Server,
  Users,
  Shield,
  Lock,
  Globe,
  Eye,
  EyeOff,
  ArrowRight,
  Database,
} from "lucide-react"
import { useState } from "react"

/**
 *
 */
export default function ProxyComparison() {
  const [activeType, setActiveType] = useState("forward")
  const [showExample, setShowExample] = useState(false)

  const proxyTypes = {
    forward: {
      name: "Forward Proxy",
      icon: Users,
      color: "blue",
      tagline: "Client's Representative",
      description:
        "Sits in front of clients, intercepts outbound requests, acts on behalf of clients",
      flow: ["Client", "Forward Proxy", "Internet", "Server"],
      useCases: [
        {
          icon: Shield,
          title: "Content Filtering",
          desc: "Block access to certain websites (corporate firewall)",
        },
        {
          icon: EyeOff,
          title: "Anonymity",
          desc: "Hide client IP address from destination servers",
        },
        {
          icon: Globe,
          title: "Bypass Geo-Restrictions",
          desc: "Access content blocked in your region (VPN-like)",
        },
        {
          icon: Database,
          title: "Caching",
          desc: "Cache frequently accessed content to save bandwidth",
        },
      ],
      tools: [
        { name: "Squid", desc: "Popular open-source proxy" },
        {
          name: "Apache Traffic Server",
          desc: "High-performance caching proxy",
        },
        { name: "NGINX", desc: "Can act as forward proxy with modules" },
      ],
      security: [
        "Controls what users can access",
        "Can inspect and block malicious outbound traffic",
        "Logs all client requests",
        "Enforces company policies",
      ],
      realWorld:
        "Corporate networks use forward proxies to monitor and control employee internet access",
    },
    reverse: {
      name: "Reverse Proxy",
      icon: Server,
      color: "purple",
      tagline: "Server's Representative",
      description:
        "Sits in front of servers, intercepts inbound requests, acts on behalf of servers",
      flow: ["Client", "Internet", "Reverse Proxy", "Backend Servers"],
      useCases: [
        {
          icon: Shield,
          title: "Load Balancing",
          desc: "Distribute traffic across multiple backend servers",
        },
        {
          icon: Lock,
          title: "SSL Termination",
          desc: "Handle SSL/TLS encryption/decryption",
        },
        {
          icon: Eye,
          title: "Hide Backend",
          desc: "Protect server IPs and infrastructure details",
        },
        {
          icon: Database,
          title: "Caching & Compression",
          desc: "Cache responses and compress data before sending",
        },
      ],
      tools: [
        { name: "NGINX", desc: "Industry standard reverse proxy" },
        { name: "HAProxy", desc: "High-availability load balancer" },
        { name: "Apache", desc: "With mod_proxy module" },
        { name: "Traefik", desc: "Modern cloud-native proxy" },
      ],
      security: [
        "Protects backend servers from direct exposure",
        "Can implement Web Application Firewall (WAF)",
        "Rate limiting and DDoS protection",
        "Centralized authentication",
      ],
      realWorld:
        "Netflix uses reverse proxies (NGINX) to handle millions of requests and protect backend services",
    },
  }

  const current = proxyTypes[activeType]
  const Icon = current.icon

  return (
    <div className="space-y-8">
      {/* Type Selector */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setActiveType("forward")}
          className={`flex-1 p-6 rounded-xl border-2 transition-all ${
            activeType === "forward"
              ? "border-blue-500 bg-blue-50 shadow-lg"
              : "border-slate-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Users
              className={`w-6 h-6 ${activeType === "forward" ? "text-blue-600" : "text-slate-500"}`}
            />
            <h3
              className={`font-semibold ${activeType === "forward" ? "text-blue-900" : "text-slate-700"}`}
            >
              Forward Proxy
            </h3>
          </div>
          <p className="text-sm text-slate-600">Client's Representative</p>
        </button>

        <button
          onClick={() => setActiveType("reverse")}
          className={`flex-1 p-6 rounded-xl border-2 transition-all ${
            activeType === "reverse"
              ? "border-purple-500 bg-purple-50 shadow-lg"
              : "border-slate-200 hover:border-purple-300"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Server
              className={`w-6 h-6 ${activeType === "reverse" ? "text-purple-600" : "text-slate-500"}`}
            />
            <h3
              className={`font-semibold ${activeType === "reverse" ? "text-purple-900" : "text-slate-700"}`}
            >
              Reverse Proxy
            </h3>
          </div>
          <p className="text-sm text-slate-600">Server's Representative</p>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-lg bg-${current.color}-100`}>
            <Icon className={`w-8 h-8 text-${current.color}-600`} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {current.name}
            </h3>
            <p className={`text-lg font-medium text-${current.color}-600 mb-2`}>
              {current.tagline}
            </p>
            <p className="text-slate-700">{current.description}</p>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Request Flow
          </h4>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {current.flow.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`px-4 py-2 rounded-lg font-medium ${
                    step.includes("Proxy")
                      ? `bg-${current.color}-500 shadow-lg`
                      : "bg-white border-2 border-slate-200 text-slate-700"
                  }`}
                >
                  {step}
                </div>
                {index < current.flow.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-8">
          <h4 className="font-semibold text-slate-900 mb-4">
            Common Use Cases
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.useCases.map((useCase, index) => {
              const UseCaseIcon = useCase.icon
              return (
                <div
                  key={index}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    <UseCaseIcon
                      className={`w-5 h-5 text-${current.color}-600 flex-shrink-0 mt-0.5`}
                    />
                    <div>
                      <h5 className="font-medium text-slate-900 mb-1">
                        {useCase.title}
                      </h5>
                      <p className="text-sm text-slate-600">{useCase.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tools */}
        <div className="mb-8">
          <h4 className="font-semibold text-slate-900 mb-4">Popular Tools</h4>
          <div className="flex flex-wrap gap-3">
            {current.tools.map((tool, index) => (
              <div
                key={index}
                className={`px-4 py-2 bg-${current.color}-50 border border-${current.color}-200 rounded-lg`}
              >
                <span className="font-medium text-slate-900">{tool.name}</span>
                <span className="text-sm text-slate-600"> • {tool.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Implications */}
        <div className="mb-6">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Implications
          </h4>
          <ul className="space-y-2">
            {current.security.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-${current.color}-500 mt-2 flex-shrink-0`}
                />
                <span className="text-slate-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Real World Example */}
        <div
          className={`p-4 bg-${current.color}-50 border border-${current.color}-200 rounded-lg`}
        >
          <div className="flex items-start gap-2">
            <Globe
              className={`w-5 h-5 text-${current.color}-600 flex-shrink-0 mt-0.5`}
            />
            <div>
              <h5 className={`font-medium text-${current.color}-900 mb-1`}>
                Real-World Example
              </h5>
              <p className="text-sm text-slate-700">{current.realWorld}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Differences Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Key Differences at a Glance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">
                  Aspect
                </th>
                <th className="text-left py-3 px-4 font-semibold text-blue-700">
                  Forward Proxy
                </th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">
                  Reverse Proxy
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium text-slate-700">
                  Position
                </td>
                <td className="py-3 px-4 text-slate-600">
                  In front of clients
                </td>
                <td className="py-3 px-4 text-slate-600">
                  In front of servers
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium text-slate-700">
                  Acts on behalf of
                </td>
                <td className="py-3 px-4 text-slate-600">Clients</td>
                <td className="py-3 px-4 text-slate-600">Servers</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium text-slate-700">
                  Direction
                </td>
                <td className="py-3 px-4 text-slate-600">Outbound requests</td>
                <td className="py-3 px-4 text-slate-600">Inbound requests</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium text-slate-700">
                  Primary Use
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Control client access, anonymity
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Load balancing, security, caching
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium text-slate-700">
                  Server knows
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Proxy IP (not client IP)
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Usually forwarded client IP
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-700">
                  Typical Setting
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Corporate networks, schools
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Production web servers, CDNs
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interview Tips */}
      <div className=" from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
        <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <span className="text-xl">💡</span>
          Interview Tip
        </h4>
        <p className="text-slate-700 mb-2">
          <strong>Remember:</strong> Forward proxy = client-side, hides clients.
          Reverse proxy = server-side, hides servers.
        </p>
        <p className="text-slate-600 text-sm">
          In system design interviews, you'll typically discuss reverse proxies
          (NGINX, HAProxy) for load balancing and security. Forward proxies are
          less common but important for corporate network discussions.
        </p>
      </div>
    </div>
  )
}
