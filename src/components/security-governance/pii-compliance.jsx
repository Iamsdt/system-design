const piiPractices = [
  "Minimize collection; default to opt-out of sensitive fields",
  "Tokenize or pseudonymize identifiers; store mapping separately",
  "Mask in logs/BI tools; redact before exporting",
  "Encrypt PII at rest and in transit; restrict access via ABAC",
  "Define retention + deletion SLAs; automate DSAR workflows",
]

const frameworks = [
  { name: "SOC 2", focus: "Trust services (security, availability, confidentiality)." },
  { name: "ISO 27001", focus: "ISMS governance, risk management, controls." },
  { name: "GDPR", focus: "Lawful basis, consent, data subject rights, residency." },
  { name: "HIPAA", focus: "PHI safeguards, BAAs, audit controls." },
  { name: "PCI-DSS", focus: "Cardholder data handling, network segmentation, SAQ." },
]

export default function PiiCompliance() {
  return (
    <div className="bg-white border-2 border-rose-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-2xl">
          🧾
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">PII Handling & Compliance</h4>
          <div className="text-xs text-slate-500">Privacy by design + frameworks</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-slate-900 mb-2">PII Handling Playbook</div>
          <ul className="text-xs text-slate-700 space-y-1 list-disc ml-4">
            {piiPractices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-slate-900 mb-2">Compliance Snapshots</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            {frameworks.map((fw) => (
              <div key={fw.name} className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                <div className="font-semibold text-slate-900">{fw.name}</div>
                <div className="text-slate-700">{fw.focus}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-600">
        Keep an inventory of data assets, processors, and data flows. Run DPIA/TRA for high-risk processing.
      </div>
    </div>
  )
}
