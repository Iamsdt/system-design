const steps = [
  "Pick protocol: OIDC for web/mobile, SAML for enterprise suites",
  "Register app with IdP (redirect URIs, scopes/claims, certs)",
  "Implement auth code + PKCE for SPAs/mobile; validate id_token (iss, aud, exp, nonce)",
  "Map IdP attributes to roles/groups; keep just-in-time provisioning",
  "Harden sessions: httpOnly+Secure cookies, SameSite=Lax/Strict, short access tokens",
]

const comparison = [
  { label: "OIDC", fit: "Modern web/mobile", notes: "JSON tokens, discovery endpoints, supports PKCE" },
  { label: "SAML", fit: "Enterprise SaaS", notes: "XML assertions, widely supported by IdPs" },
  { label: "OAuth2", fit: "Authorization", notes: "Use for API access delegation; pair with OIDC for identity" },
]

export default function SsoPlaybook() {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl">
          🪪
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">SSO Implementation Guide</h4>
          <div className="text-xs text-slate-500">OIDC vs SAML, rollout checklist</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        {comparison.map((item) => (
          <div key={item.label} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-slate-800">
            <div className="font-semibold text-blue-900">{item.label}</div>
            <div className="text-slate-700">Fit: {item.fit}</div>
            <div className="text-slate-600">{item.notes}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-slate-900 mb-2">Rollout Checklist</div>
        <ul className="text-xs text-slate-700 space-y-1 list-disc ml-4">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <div className="text-xs text-slate-600 mt-2">
          Add session revocation via logout endpoints, idle-timeout, and device binding where supported.
        </div>
      </div>
    </div>
  )
}
