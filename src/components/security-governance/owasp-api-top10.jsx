import { useState } from "react"

const RISKS = [
  {
    id: "API1",
    title: "Broken Object Level Authorization",
    description: "Missing object-level access checks on IDs or paths.",
    defense: ["Enforce per-object authorization on every request", "Avoid exposing predictable IDs; use UUIDs"],
  },
  {
    id: "API2",
    title: "Broken Authentication",
    description: "Weak login flows, poor session handling, credential stuffing.",
    defense: ["Use MFA + rate limiting", "Rotate refresh tokens, detect reuse"],
  },
  {
    id: "API3",
    title: "Broken Object Property Level Authorization",
    description: "Unauthorized read/write of individual fields (mass assignment).",
    defense: ["Use allowlists for bindable fields", "Validate ownership in service layer"],
  },
  {
    id: "API4",
    title: "Unrestricted Resource Consumption",
    description: "Lack of pagination, rate limits, or cost controls leading to DoS costs.",
    defense: ["Enforce pagination + rate limits", "Protect expensive flows with quotas/circuit breakers"],
  },
  {
    id: "API5",
    title: "Broken Function Level Authorization",
    description: "Admin or privileged routes exposed without role checks.",
    defense: ["Centralize RBAC/ABAC checks", "Deny-by-default and test privileged paths"],
  },
  {
    id: "API6",
    title: "Unrestricted Access to Sensitive Business Flows",
    description: "Business actions abused at scale (e.g., gift-card draining).",
    defense: ["Add velocity limits and business rules", "Threat model automation paths"],
  },
  {
    id: "API7",
    title: "Server Side Request Forgery",
    description: "API fetches attacker-controlled URLs and reaches internal services.",
    defense: ["Allow-list outbound destinations", "Disable redirects and resolve IPs before fetch"],
  },
  {
    id: "API8",
    title: "Security Misconfiguration",
    description: "Debug endpoints, verbose errors, default creds, missing TLS.",
    defense: ["Harden configs as code", "Automated scans + CIS benchmarks"],
  },
  {
    id: "API9",
    title: "Improper Inventory Management",
    description: "Shadow/old APIs untracked or unpatched.",
    defense: ["Maintain versioned API catalog", "Sunset and block deprecated versions"],
  },
  {
    id: "API10",
    title: "Unsafe Consumption of APIs",
    description: "Trusting unvalidated third-party API responses.",
    defense: ["Validate and sanitize 3rd-party inputs", "Apply timeouts and schema validation"],
  },
]

export default function OwaspApiTop10() {
  const [expanded, setExpanded] = useState("API1")

  return (
    <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl">
          🧭
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">OWASP API Top 10 (2023)</h4>
          <div className="text-xs text-slate-500">Common risks + fixes</div>
        </div>
      </div>

      <div className="space-y-3">
        {RISKS.map((risk) => (
          <div
            key={risk.id}
            className={`border rounded-xl p-4 cursor-pointer transition-colors ${
              expanded === risk.id ? "border-amber-400 bg-amber-50" : "border-slate-200 bg-white hover:border-amber-200"
            }`}
            onClick={() => setExpanded(expanded === risk.id ? null : risk.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-700">{risk.id}</div>
                <div className="text-sm font-semibold text-slate-900">{risk.title}</div>
              </div>
              <span className="text-xs text-slate-600">{expanded === risk.id ? "Hide" : "Details"}</span>
            </div>
            {expanded === risk.id && (
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>{risk.description}</p>
                <div>
                  <div className="text-xs font-bold text-slate-900 mb-1">Defenses</div>
                  <ul className="list-disc ml-4 space-y-1 text-xs">
                    {risk.defense.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
