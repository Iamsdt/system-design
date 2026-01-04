const ENCRYPTION = [
  {
    title: "Encryption In Transit",
    points: [
      "TLS 1.2+ with modern ciphers; enable HSTS",
      "Mutual TLS for service-to-service in zero-trust",
      "Pin audience + hostname; prefer HTTP/3 where available",
    ],
  },
  {
    title: "Encryption At Rest",
    points: [
      "AES-256-GCM for data at rest (managed KMS preferred)",
      "Encrypt backups, logs, and object storage by default",
      "Isolate keys from data plane; separate duties",
    ],
  },
]

const KEY_STEPS = [
  "Use managed KMS or HSM; avoid app-level key storage",
  "Envelope encryption: data key encrypted by KMS master key",
  "Rotate keys (90d high-risk, 180–365d low-risk) with versioning",
  "Tag keys with owners + expiration; alert before expiry",
  "Audit key usage and deny unused principals",
]

export default function EncryptionKeyManagement() {
  return (
    <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl">
          🔒
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Encryption & Key Management</h4>
          <div className="text-xs text-slate-500">At rest vs in transit, envelope patterns</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {ENCRYPTION.map((item) => (
          <div key={item.title} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
            <div className="text-sm font-semibold text-slate-900">{item.title}</div>
            <ul className="text-xs text-slate-700 space-y-1 list-disc ml-4">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
        <div className="text-sm font-semibold text-slate-900">Key Management Playbook</div>
        <ul className="text-xs text-slate-700 space-y-1 list-disc ml-4">
          {KEY_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <div className="text-xs text-slate-600 mt-2">
          Prefer short-lived data keys, rotate CMKs, and monitor usage anomalies. Never log secrets or keys.
        </div>
      </div>
    </div>
  )
}
