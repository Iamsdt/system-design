const directives = [
  {
    name: "default-src",
    detail: "Fallback for all resource types; set to 'self' or https:",
  },
  {
    name: "script-src",
    detail: "Use nonces/hashes, avoid unsafe-inline/unsafe-eval",
  },
  {
    name: "frame-ancestors",
    detail: "Control who can iframe you; set to 'none' to stop clickjacking",
  },
  {
    name: "upgrade-insecure-requests",
    detail: "Auto-upgrade http assets to https",
  },
  {
    name: "report-to / report-uri",
    detail: "Send violation reports to an endpoint to tune policies",
  },
]

const SAMPLE_POLICY =
  "Content-Security-Policy: default-src 'self'; script-src 'nonce-{RANDOM}' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; report-to csp-endpoint; upgrade-insecure-requests"

export default function CspGuide() {
  return (
    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-indigo-500 to-blue-600 flex items-center justify-center text-white text-2xl">
          🧱
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Content Security Policy (CSP)</h4>
          <div className="text-xs text-slate-500">Defense-in-depth against XSS & clickjacking</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2">
          <div className="text-sm font-semibold text-slate-900">Strict CSP Template</div>
          <pre className="text-xs bg-white border border-indigo-200 rounded p-3 overflow-x-auto">
            {SAMPLE_POLICY}
          </pre>
          <div className="text-xs text-slate-700">
            Use nonces or hashes per response. Avoid unsafe-inline/unsafe-eval. Test with report-only first.
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="text-sm font-semibold text-slate-900">Core Directives</div>
          <ul className="text-xs text-slate-700 space-y-2 list-disc ml-4">
            {directives.map((item) => (
              <li key={item.name}>
                <span className="font-semibold">{item.name}:</span> {item.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-700">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="font-semibold text-green-900 mb-1">Nonce-based</div>
          <p>Generate a fresh nonce per response and attach it to allowed &lt;script&gt;/&lt;style&gt; tags.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="font-semibold text-amber-900 mb-1">Hash-based</div>
          <p>Hash inline scripts/styles (sha256/384/512). Great for static sites; rehash on changes.</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="font-semibold text-red-900 mb-1">Reporting</div>
          <p>Send violations via report-to/report-uri. Start in report-only to tune before enforcing.</p>
        </div>
      </div>
    </div>
  )
}
