import { useState } from "react"

const TIERS = [
  {
    name: "Public Tier",
    description: "Load balancers, API gateways",
    subnets: ["10.0.1.0/24", "10.0.2.0/24"],
    allowedInbound: ["Internet (HTTPS)", "CDN/WAF"],
    allowedOutbound: ["Private Tier"],
    color: "red",
  },
  {
    name: "Private Tier",
    description: "Application servers",
    subnets: ["10.0.10.0/24", "10.0.11.0/24"],
    allowedInbound: ["Public Tier"],
    allowedOutbound: ["Data Tier", "Internet (updates via NAT)", "Observability"] ,
    color: "blue",
  },
  {
    name: "Data Tier",
    description: "Databases, caches",
    subnets: ["10.0.20.0/24"],
    allowedInbound: ["Private Tier"],
    allowedOutbound: ["None (isolated)", "Backup network only"],
    color: "green",
  },
]

const colorClasses = {
  red: "bg-red-50 border-red-200 text-red-900",
  blue: "bg-blue-50 border-blue-200 text-blue-900",
  green: "bg-green-50 border-green-200 text-green-900",
}

export default function NetworkSegmentationDesigner() {
  const [selectedTier, setSelectedTier] = useState(null)

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl">
          🌐
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Network Segmentation Designer</h4>
          <div className="text-xs text-slate-500">VPC/subnet/security group visualization</div>
        </div>
      </div>

      <div className="space-y-3">
        {TIERS.map((tier, index) => (
          <div
            key={tier.name}
            onClick={() => setSelectedTier(selectedTier === index ? null : index)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedTier === index
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-slate-900">{tier.name}</div>
                <div className="text-xs text-slate-600">{tier.description}</div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${colorClasses[tier.color]}`}>
                Tier {index + 1}
              </div>
            </div>

            {selectedTier === index && (
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Subnets:</div>
                  <div className="text-xs text-slate-600 space-y-1">
                    {tier.subnets.map((subnet) => (
                      <div key={subnet} className="font-mono">
                        {subnet}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Allowed Inbound:</div>
                  <div className="text-xs text-slate-600">{tier.allowedInbound.join(", ")}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Allowed Outbound:</div>
                  <div className="text-xs text-slate-600">{tier.allowedOutbound.join(", ")}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 bg-indigo-50 rounded-lg p-3 text-xs text-slate-700">
        <div className="font-semibold mb-1">Security Best Practices</div>
        <ul className="space-y-1 ml-4">
          <li>• Use security groups to restrict traffic between tiers</li>
          <li>• No direct internet access to private/data tiers</li>
          <li>• NAT gateway for controlled egress; enable VPC Flow Logs</li>
          <li>• Pair with WAF + DDoS protection at the edge</li>
        </ul>
      </div>
    </div>
  )
}
