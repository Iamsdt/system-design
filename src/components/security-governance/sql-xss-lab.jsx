import { useState } from "react"

const CASES = {
  sql: {
    title: "SQL Injection",
    vulnerable: "SELECT * FROM users WHERE email = '<user_input>' AND password = '<pass>';",
    fixed: "SELECT * FROM users WHERE email = ? AND password_hash = crypt(?, salt);",
    guidance: [
      "Use prepared statements and parameter binding",
      "Never concatenate user input into queries",
      "Apply least privilege DB roles and limit network access",
      "Centralize query helpers to avoid unsafe ad-hoc SQL",
    ],
  },
  xss: {
    title: "Cross-Site Scripting",
    vulnerable: "<div>Welcome <script>{user_input}</script></div>",
    fixed: "<div>Welcome {{ user.name | escape }}</div>",
    guidance: [
      "Encode output by context (HTML, URL, JS)",
      "Use CSP with nonces/hashes to block inline scripts",
      "Sanitize rich text input server-side",
      "Prefer libraries that auto-escape (React, templating engines)",
    ],
  },
}

export default function SqlXssLab() {
  const [variant, setVariant] = useState("sql")
  const current = CASES[variant]

  return (
    <div className="bg-white border-2 border-red-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-red-500 to-rose-600 flex items-center justify-center text-white text-2xl">
          🧪
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">SQLi & XSS Prevention Lab</h4>
          <div className="text-xs text-slate-500">See vulnerable vs fixed patterns</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {Object.keys(CASES).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setVariant(key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              variant === key
                ? "bg-red-50 border-red-300 text-red-800"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            {CASES[key].title}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-xs font-bold text-red-800 mb-1">Vulnerable</div>
          <pre className="text-xs bg-white border border-red-200 rounded p-3 overflow-x-auto">{current.vulnerable}</pre>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs font-bold text-green-800 mb-1">Fixed</div>
          <pre className="text-xs bg-white border border-green-200 rounded p-3 overflow-x-auto">{current.fixed}</pre>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 mt-4">
        <div className="text-xs font-bold text-slate-900 mb-2">Defensive Playbook</div>
        <ul className="text-xs text-slate-700 space-y-1 list-disc ml-4">
          {current.guidance.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
