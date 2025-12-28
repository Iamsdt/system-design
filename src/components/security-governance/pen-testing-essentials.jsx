const phases = [
  "Scoping: define assets, out-of-scope, test windows, and disclosure channel",
  "Reconnaissance: enumerate DNS, APIs, cloud assets, open ports",
  "Exploitation: attempt auth bypass, injection, SSRF, IDOR, privilege escalation",
  "Post-exploitation: verify impact, avoid destructive actions",
  "Reporting & remediation: prioritized findings, retest after fixes",
]

const tooling = [
  "DAST: OWASP ZAP, Burp Suite",
  "SAST/SCA: CodeQL, Semgrep, Dependabot",
  "Cloud posture: ScoutSuite, Prowler, tfsec",
  "API testing: Postman security tests, schemathesis",
]

export default function PenTestingEssentials() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white text-2xl">
          🛠️
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Penetration Testing Essentials</h4>
          <div className="text-xs text-slate-500">Types, tooling, and cadence</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-slate-900 mb-2">Lifecycle</div>
          <ul className="text-xs text-slate-700 space-y-1 list-disc ml-4">
            {phases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-slate-900 mb-2">Tooling</div>
          <ul className="text-xs text-slate-700 space-y-1 list-disc ml-4">
            {tooling.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-xs text-slate-600">
        Run offensive testing at least annually or after major releases. Pair with bug bounty and continuous scanning.
      </div>
    </div>
  )
}
