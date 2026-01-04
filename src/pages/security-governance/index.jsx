import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import AccessControlComparison from "@/components/security-governance/access-control-comparison"
import CorsOverview from "@/components/security-governance/cors-overview"
import CspGuide from "@/components/security-governance/csp-guide"
import EncryptionKeyManagement from "@/components/security-governance/encryption-key-management"
import IAMPolicyBuilder from "@/components/security-governance/iam-policy-builder"
import JWTTokenDecoder from "@/components/security-governance/jwt-token-decoder"
import NetworkSegmentationDesigner from "@/components/security-governance/network-segmentation-designer"
import OAuth2FlowVisualizer from "@/components/security-governance/oauth2-flow-visualizer"
import OwaspApiTop10 from "@/components/security-governance/owasp-api-top10"
import PenTestingEssentials from "@/components/security-governance/pen-testing-essentials"
import PiiCompliance from "@/components/security-governance/pii-compliance"
import SecretsRotationSimulator from "@/components/security-governance/secrets-rotation-simulator"
import SqlXssLab from "@/components/security-governance/sql-xss-lab"
import SsoPlaybook from "@/components/security-governance/sso-playbook"

const accentClasses = {
  green: { text: "text-green-600", bg: "bg-green-600" },
  indigo: { text: "text-indigo-600", bg: "bg-indigo-600" },
  amber: { text: "text-amber-600", bg: "bg-amber-600" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-600" },
  teal: { text: "text-teal-600", bg: "bg-teal-600" },
}

const SectionHeader = ({ number, accent, label, title, description }) => {
  const classes = accentClasses[accent] || accentClasses.green

  return (
    <div className="mb-12">
      <div className="inline-block">
        <div
          className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${classes.text}`}
        >
          <span className={`w-8 h-8 rounded-lg ${classes.bg} text-white flex items-center justify-center text-sm`}>
            {number}
          </span>
          {label}
        </div>
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{title}</h2>
      <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">{description}</p>
    </div>
  )
}

export default function SecurityGovernance() {
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
      <section className="relative gradient-overlay py-20 md:py-32 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-6">
              <span className="text-sm font-medium text-green-700">Module 7</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Security, Governance & <span className="text-gradient">Compliance</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 mx-auto">
              Master authentication, authorization, web security, encryption, and compliance with a zero-trust mindset.
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
        <section
          ref={(el) => (sectionsReference.current[0] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <SectionHeader
            number="01"
            accent="green"
            label="AUTHENTICATION & AUTHORIZATION"
            title="AuthN/AuthZ: OAuth2, OIDC, JWT & mTLS"
            description="Authentication (who you are) and authorization (what you can do) are foundational controls."
          />

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <OAuth2FlowVisualizer />
            <JWTTokenDecoder />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">OAuth2</h3>
              <p className="text-sm text-slate-700 mb-3">Delegated authorization framework for API access and third-party apps.</p>
              <div className="text-xs text-slate-600">Scopes, audiences, short-lived access tokens.</div>
            </div>
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🆔</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">OIDC</h3>
              <p className="text-sm text-slate-700 mb-3">Identity layer on OAuth2; ID tokens and claims for SSO.</p>
              <div className="text-xs text-slate-600">Use PKCE for SPAs/mobile; validate iss/aud/nonce.</div>
            </div>
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">mTLS</h3>
              <p className="text-sm text-slate-700 mb-3">Mutual TLS for service-to-service trust in zero-trust networks.</p>
              <div className="text-xs text-slate-600">Automate cert issuance/rotation; pin SANs and CAs.</div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionsReference.current[1] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <SectionHeader
            number="02"
            accent="indigo"
            label="NETWORK SECURITY"
            title="Segmentation, WAF, DDoS & IAM guardrails"
            description="Defense in depth to shrink blast radius and enforce least privilege." />

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <NetworkSegmentationDesigner />
            <IAMPolicyBuilder />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">WAF</h3>
              <p className="text-sm text-slate-700 mb-3">Filter SQLi/XSS, enforce rate limits, and virtual patch CVEs at the edge.</p>
              <div className="text-xs text-slate-600">Managed: CloudFront, Cloudflare, GCP Armor.</div>
            </div>
            <div className="bg-white border-2 border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">DDoS Protection</h3>
              <p className="text-sm text-slate-700 mb-3">Scrub volumetric attacks, enforce per-IP quotas, and absorb bursts.</p>
              <div className="text-xs text-slate-600">Use AWS Shield Advanced/Cloudflare for L3–L7.</div>
            </div>
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Least-Privilege IAM</h3>
              <p className="text-sm text-slate-700 mb-3">Roles over users, scoped policies, short-lived credentials.</p>
              <div className="text-xs text-slate-600">Continuously review and remove unused permissions.</div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionsReference.current[2] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <SectionHeader
            number="03"
            accent="amber"
            label="WEB SECURITY & APPSEC"
            title="OWASP API Top 10, Injection Defenses, CORS, CSP"
            description="Close common API and frontend attack vectors with practical mitigations." />

          <div className="grid xl:grid-cols-2 gap-8 mb-8">
            <OwaspApiTop10 />
            <SqlXssLab />
          </div>

          <div className="grid xl:grid-cols-2 gap-8">
            <CorsOverview />
            <CspGuide />
          </div>
        </section>

        <section
          ref={(el) => (sectionsReference.current[3] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <SectionHeader
            number="04"
            accent="emerald"
            label="CRYPTO, SECRETS & IDENTITY"
            title="Encryption, Key Management, SSO, and Secret Rotation"
            description="Protect data at rest/in transit, manage keys safely, and roll out enterprise SSO." />

          <div className="grid xl:grid-cols-2 gap-8 mb-8">
            <EncryptionKeyManagement />
            <SsoPlaybook />
          </div>

          <div className="grid xl:grid-cols-2 gap-8 mb-8">
            <SecretsRotationSimulator />
            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Audit Logging</h3>
                <ul className="text-sm text-slate-700 space-y-1 list-disc ml-4">
                  <li>Authentication attempts, authorization decisions, data access</li>
                  <li>Immutable storage (versioned object storage) with signatures</li>
                  <li>Retention 30–90 days; alerts on anomalies</li>
                </ul>
              </div>
              <div className=" from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Data Residency</h3>
                <ul className="text-sm text-slate-700 space-y-1 list-disc ml-4">
                  <li>Regional data stores; avoid cross-region replication by default</li>
                  <li>Encrypt at rest/in transit; classify data by jurisdiction</li>
                  <li>Implement residency early; retrofits are costly</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionsReference.current[4] = el)}
          className=" transition-all duration-700 mb-24"
        >
          <SectionHeader
            number="05"
            accent="teal"
            label="GOVERNANCE & VALIDATION"
            title="Access Models, PII Handling, and Pen Testing"
            description="Choose the right access model, meet compliance, and validate controls offensively." />

          <div className="grid xl:grid-cols-2 gap-8 mb-8">
            <AccessControlComparison />
            <PiiCompliance />
          </div>

          <div className="grid xl:grid-cols-2 gap-8">
            <PenTestingEssentials />
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Operational Checklist</h3>
              <ul className="text-sm text-slate-700 space-y-1 list-disc ml-4">
                <li>Threat model quarterly; update runbooks</li>
                <li>Continuous dependency scanning and SBOM tracking</li>
                <li>Security champions program per squad</li>
                <li>Tabletop exercises for incident response</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="flex justify-between items-center">
            <button onClick={() => nav("/topics")} className="btn-secondary">
              ← Back to Topics
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => nav("/reliability-resilience")} className="btn-secondary">
                ← Previous: Reliability
              </button>
              <button onClick={() => nav("/observability-operations")} className="btn-primary">
                Next: Observability →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

