import { useMemo, useState } from "react"

export default function IAMPolicyBuilder() {
  const [resource, setResource] = useState("s3://my-bucket/*")
  const [actions, setActions] = useState(["s3:GetObject", "s3:PutObject"])
  const [principals, setPrincipals] = useState([
    "arn:aws:iam::123456789012:user/john",
  ])

  const policy = useMemo(() => {
    return {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: principals.length > 0 ? { AWS: principals } : "*",
          Action: actions,
          Resource: resource,
        },
      ],
    }
  }, [resource, actions, principals])

  const recommendations = useMemo(() => {
    const recs = []
    if (actions.includes("*")) {
      recs.push("Avoid wildcard actions - specify exact permissions needed")
    }
    if (resource.includes("*") && !resource.endsWith("/*")) {
      recs.push("Wildcard resources should end with /* for safety")
    }
    if (principals.length === 0 || principals.includes("*")) {
      recs.push("Specify exact principals - avoid wildcards")
    }
    if (actions.length > 10) {
      recs.push("Consider grouping actions into separate statements")
    }
    return recs
  }, [resource, actions, principals])

  return (
    <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl">
          🛡️
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">IAM Policy Builder</h4>
          <div className="text-xs text-slate-500">Create least-privilege policies</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Resource</label>
          <input
            type="text"
            value={resource}
            onChange={(event) => setResource(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="s3://my-bucket/*"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Actions (comma-separated)</label>
          <input
            type="text"
            value={actions.join(", ")}
            onChange={(event) => setActions(event.target.value.split(",").map((item) => item.trim()))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="s3:GetObject, s3:PutObject"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Principals (ARNs, comma-separated)</label>
          <input
            type="text"
            value={principals.join(", ")}
            onChange={(event) => setPrincipals(event.target.value.split(",").map((item) => item.trim()))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="arn:aws:iam::123456789012:user/john"
          />
        </div>

        {recommendations.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
            <div className="text-xs font-semibold text-yellow-900 mb-1">Least-Privilege Recommendations:</div>
            <ul className="text-xs text-yellow-800 space-y-1">
              {recommendations.map((rec) => (
                <li key={rec}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-slate-900 rounded-lg p-4">
          <div className="text-sm font-semibold text-white mb-2">Generated Policy</div>
          <pre className="text-xs text-green-400 overflow-x-auto">{JSON.stringify(policy, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
