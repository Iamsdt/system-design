const models = [
  {
    title: "RBAC",
    summary: "Roles grant permissions; simple to reason about.",
    pros: ["Easy audits", "Great for small/medium teams", "Role explosion if too granular"],
  },
  {
    title: "ABAC",
    summary: "Decisions based on attributes (user, resource, context).",
    pros: ["Fine-grained + context aware", "Great for multi-tenant SaaS", "Needs strong policy engine + observability"],
  },
  {
    title: "Hybrid",
    summary: "RBAC for core duties, ABAC for context (tenant, region, risk).",
    pros: ["Balance simplicity and flexibility", "Use policies for high-risk actions", "Centralize in PDP (OPA, Cedar)"] ,
  },
]

export default function AccessControlComparison() {
  return (
    <div className="bg-white border-2 border-teal-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl">
          🧭
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">RBAC vs ABAC</h4>
          <div className="text-xs text-slate-500">Choose the right access model</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-700">
        {models.map((model) => (
          <div key={model.title} className="bg-teal-50 border border-teal-200 rounded-lg p-3 space-y-2">
            <div className="text-sm font-semibold text-slate-900">{model.title}</div>
            <div className="text-slate-700">{model.summary}</div>
            <ul className="list-disc ml-4 space-y-1">
              {model.pros.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
