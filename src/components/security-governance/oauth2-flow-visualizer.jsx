import { useMemo, useState } from "react"

const FLOW_LIBRARY = {
  "authorization-code": {
    label: "Authorization Code",
    description: "Trusted web apps with a backend that can keep a client secret.",
    steps: [
      { title: "User requests login", actor: "User", action: "→ Authorization Server" },
      { title: "Authenticate user", actor: "Authorization Server", action: "Validates credentials" },
      { title: "Return authorization code", actor: "Authorization Server", action: "→ Client" },
      { title: "Exchange code for tokens", actor: "Client", action: "→ Authorization Server" },
      { title: "Access API", actor: "Client", action: "→ Resource Server with access token" },
    ],
    highlights: ["Best for server-rendered apps", "Keep client secret server-side", "Use refresh tokens"],
  },
  pkce: {
    label: "PKCE (SPA / Mobile)",
    description: "Public clients without a client secret (mobile, SPA).", 
    steps: [
      { title: "Generate code verifier + challenge", actor: "Client", action: "Store verifier locally" },
      { title: "Redirect to authorize", actor: "Client", action: "→ Authorization Server with challenge" },
      { title: "User authenticates", actor: "Authorization Server", action: "Validates user" },
      { title: "Return authorization code", actor: "Authorization Server", action: "→ Client" },
      { title: "Swap code + verifier", actor: "Client", action: "→ Authorization Server" },
      { title: "Get tokens", actor: "Authorization Server", action: "→ Client" },
    ],
    highlights: ["No client secret in browser", "Mitigates code interception", "Recommended for mobile/SPA"],
  },
  "device-code": {
    label: "Device Code",
    description: "Input-constrained devices (TVs, consoles).", 
    steps: [
      { title: "Obtain device & user codes", actor: "Device", action: "→ User displays code" },
      { title: "User approves on browser", actor: "User", action: "→ Authorization Server" },
      { title: "Device polls token endpoint", actor: "Device", action: "→ Authorization Server" },
      { title: "Authorization granted", actor: "Authorization Server", action: "→ Device tokens" },
      { title: "Access API", actor: "Device", action: "→ Resource Server with access token" },
    ],
    highlights: ["Great for TVs/CLI", "Short polling interval", "Expire device codes quickly"],
  },
}

const RECOMMENDATIONS = [
  "Prefer PKCE for SPAs and mobile apps",
  "Use short-lived access tokens (15–60 min) and refresh tokens with rotation",
  "Validate scopes and audience on every API call",
  "Store tokens in httpOnly secure cookies when you control the backend",
]

export default function OAuth2FlowVisualizer() {
  const [flow, setFlow] = useState("authorization-code")
  const [activeStep, setActiveStep] = useState(0)

  const selected = useMemo(() => FLOW_LIBRARY[flow], [flow])

  return (
    <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl">
          🔐
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">OAuth2 Flow Visualizer</h4>
          <div className="text-xs text-slate-500">Authorization Code, PKCE, Device</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-slate-700 mb-2 block">Flow Type</label>
          <select
            value={flow}
            onChange={(event) => {
              setFlow(event.target.value)
              setActiveStep(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {Object.entries(FLOW_LIBRARY).map(([id, meta]) => (
              <option key={id} value={id}>
                {meta.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-600 mt-2">{selected.description}</p>
        </div>

        <div className="space-y-2">
          {selected.steps.map((item, index) => (
            <div
              key={item.title}
              onClick={() => setActiveStep(index)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                activeStep === index
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activeStep === index
                        ? "bg-green-600 text-white"
                        : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="font-semibold text-slate-900">{item.title}</div>
                </div>
              </div>
              <p className="text-sm text-slate-700 ml-8">{item.action}</p>
              <div className="mt-2 ml-8 text-xs text-slate-600">
                <span className="font-semibold">{item.actor}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 rounded-lg p-3 text-xs text-slate-700">
          <div className="font-semibold mb-1">Security Tips</div>
          <ul className="space-y-1 ml-4">
            {RECOMMENDATIONS.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
