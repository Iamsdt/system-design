import CorsSimulator from "@/components/security/cors-simulator"

const tips = [
  "Simple requests skip preflight (GET/POST with simple headers)",
  "Preflight uses OPTIONS to ask what is allowed",
  "Access-Control-Allow-Origin must echo origin or be * when no credentials",
  "With credentials=true you cannot use * for ACAO",
  "Keep allowed methods/headers tight; avoid broad wildcards",
]

export default function CorsOverview() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-slate-700 to-slate-900 flex items-center justify-center text-white text-2xl">
          🌐
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">CORS Explained + Simulator</h4>
          <div className="text-xs text-slate-500">Preflight, credentials, and policy outcomes</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="text-sm font-semibold text-slate-900">Key Rules</div>
          <ul className="text-xs text-slate-700 space-y-2 list-disc ml-4">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <div className="text-xs text-slate-600">
            Preflight fails? Check allowed origin, methods, headers, and credentials alignment.
          </div>
        </div>
        <div className="lg:col-span-2">
          <CorsSimulator />
        </div>
      </div>
    </div>
  )
}
