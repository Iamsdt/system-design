import PropTypes from "prop-types"
import { useMemo, useState } from "react"

import { computeCorsOutcome } from "@/lib/security/cors"

const Field = ({ id, label, children }) => (
  <div>
    <label
      htmlFor={id}
      className="text-sm font-semibold text-slate-700 mb-2 block"
    >
      {label}
    </label>
    {children}
  </div>
)

Field.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const formatHeaderBlock = (headers) => {
  return Object.entries(headers)
    .filter(([, v]) => String(v).length > 0)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")
}

const TOGGLE_ON_CLASS = "bg-slate-900 text-white border-slate-900"
const TOGGLE_OFF_CLASS = "bg-white text-slate-700 border-slate-300"

const Panel = ({ title, children }) => (
  <div className="bg-slate-50 rounded-xl p-4">
    <div className="text-sm font-bold text-slate-900 mb-3">{title}</div>
    {children}
  </div>
)

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const ToggleRow = ({ title, description, isOn, onToggle, onLabel, offLabel }) => {
  const handleToggle = () => onToggle(!isOn)

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
      <button
        type="button"
        onClick={handleToggle}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold border ${
          isOn ? TOGGLE_ON_CLASS : TOGGLE_OFF_CLASS
        }`}
      >
        {isOn ? onLabel : offLabel}
      </button>
    </div>
  )
}

ToggleRow.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isOn: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onLabel: PropTypes.string.isRequired,
  offLabel: PropTypes.string.isRequired,
}

const useCorsOutcome = ({ request, server }) => {
  return useMemo(() => computeCorsOutcome({ request, server }), [request, server])
}

const VerdictCard = ({ outcome }) => {
  const verdict = outcome.actual.allowed ? "ALLOWED" : "BLOCKED"
  const verdictClass = outcome.actual.allowed ? "bg-green-600" : "bg-red-600"

  return (
    <div className={`${verdictClass} text-white rounded-xl p-4 text-center`}>
      <div className="text-xs font-semibold mb-1">Browser verdict</div>
      <div className="text-2xl font-extrabold tracking-wide">{verdict}</div>
      <div className="text-xs mt-2 opacity-90">
        {outcome.needsPreflight
          ? "Preflight required before actual request"
          : "No preflight (simple CORS request)"}
      </div>
    </div>
  )
}

VerdictCard.propTypes = {
  outcome: PropTypes.shape({
    actual: PropTypes.shape({ allowed: PropTypes.bool.isRequired }).isRequired,
    needsPreflight: PropTypes.bool.isRequired,
  }).isRequired,
}

const PreflightCard = ({ outcome }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4">
    <div className="text-sm font-bold text-slate-900 mb-2">Preflight</div>
    <div className="text-sm text-slate-700">
      Needed{" "}
      <span className="font-semibold">{outcome.preflight.needed ? "Yes" : "No"}</span>
    </div>
    <div className="text-sm text-slate-700">
      Would pass{" "}
      <span className="font-semibold">{outcome.preflight.allowed ? "Yes" : "No"}</span>
    </div>
  </div>
)

PreflightCard.propTypes = {
  outcome: PropTypes.shape({
    preflight: PropTypes.shape({
      needed: PropTypes.bool.isRequired,
      allowed: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
}

const ResponseHeadersCard = ({ headers }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4">
    <div className="text-sm font-bold text-slate-900 mb-2">Response headers</div>
    <pre className="text-xs bg-slate-50 p-3 rounded border border-slate-200 overflow-x-auto">
      {formatHeaderBlock(headers)}
    </pre>
  </div>
)

ResponseHeadersCard.propTypes = {
  headers: PropTypes.object.isRequired,
}

const BlockReasonsCard = ({ reasons }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
    <div className="text-sm font-bold text-red-900 mb-2">Why blocked</div>
    <ul className="text-sm text-red-800 space-y-1">
      {reasons.map((reason) => (
        <li key={reason}>• {reason}</li>
      ))}
    </ul>
  </div>
)

BlockReasonsCard.propTypes = {
  reasons: PropTypes.arrayOf(PropTypes.string).isRequired,
}

const TipCard = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
    Tip: set allow-origin to{" "}
    <span className="font-semibold">*</span> and turn credentials ON to see the
    common misconfiguration.
  </div>
)

const CorsSimulator = () => {
  const [origin, setOrigin] = useState("https://app.example.com")
  const [method, setMethod] = useState("GET")
  const [withCredentials, setWithCredentials] = useState(false)
  const [requestHeadersCsv, setRequestHeadersCsv] = useState("Authorization")
  const [contentType, setContentType] = useState("application/json")

  const [allowOriginsCsv, setAllowOriginsCsv] = useState(
    "https://app.example.com, https://admin.example.com"
  )
  const [allowMethodsCsv, setAllowMethodsCsv] = useState("GET, POST")
  const [allowHeadersCsv, setAllowHeadersCsv] = useState(
    "Authorization, Content-Type"
  )
  const [allowCredentials, setAllowCredentials] = useState(false)

  const request = useMemo(
    () => ({ origin, method, withCredentials, requestHeadersCsv, contentType }),
    [origin, method, withCredentials, requestHeadersCsv, contentType]
  )

  const server = useMemo(
    () => ({ allowOriginsCsv, allowMethodsCsv, allowHeadersCsv, allowCredentials }),
    [allowOriginsCsv, allowMethodsCsv, allowHeadersCsv, allowCredentials]
  )

  const outcome = useCorsOutcome({ request, server })

  const originId = "cors-origin"
  const methodId = "cors-method"
  const headersId = "cors-headers"
  const ctypeId = "cors-ctype"
  const allowOriginsId = "cors-allow-origins"
  const allowMethodsId = "cors-allow-methods"
  const allowHeadersId = "cors-allow-headers"

  const handleOriginChange = (event) => setOrigin(event.target.value)
  const handleMethodChange = (event) => setMethod(event.target.value)
  const handleHeadersChange = (event) => setRequestHeadersCsv(event.target.value)
  const handleContentTypeChange = (event) => setContentType(event.target.value)

  const handleAllowOriginsChange = (event) =>
    setAllowOriginsCsv(event.target.value)
  const handleAllowMethodsChange = (event) =>
    setAllowMethodsCsv(event.target.value)
  const handleAllowHeadersChange = (event) =>
    setAllowHeadersCsv(event.target.value)

  const handleCredentialsToggle = (value) => setWithCredentials(value)
  const handleAllowCredentialsToggle = (value) => setAllowCredentials(value)

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-slate-700 to-slate-900 flex items-center justify-center text-white text-2xl">
          🌐
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">CORS Simulator</h4>
          <div className="text-xs text-slate-500">
            Predict preflight + browser allow/block
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Panel title="Request">
            <div className="space-y-3">
              <Field id={originId} label="Origin">
                <input
                  id={originId}
                  value={origin}
                  onChange={handleOriginChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </Field>

              <Field id={methodId} label="Method">
                <select
                  id={methodId}
                  value={method}
                  onChange={handleMethodChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id={headersId} label="Request headers (CSV)">
                <input
                  id={headersId}
                  value={requestHeadersCsv}
                  onChange={handleHeadersChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Authorization, X-Trace-Id"
                />
              </Field>

              <Field id={ctypeId} label="Content-Type">
                <input
                  id={ctypeId}
                  value={contentType}
                  onChange={handleContentTypeChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="application/json"
                />
              </Field>

              <ToggleRow
                title="Credentials"
                description="Cookies / Authorization in fetch"
                isOn={withCredentials}
                onToggle={handleCredentialsToggle}
                onLabel="ON"
                offLabel="OFF"
              />
            </div>
          </Panel>

          <Panel title="Server policy">
            <div className="space-y-3">
              <Field
                id={allowOriginsId}
                label="Access-Control-Allow-Origin (CSV)"
              >
                <input
                  id={allowOriginsId}
                  value={allowOriginsCsv}
                  onChange={handleAllowOriginsChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="*, https://app.example.com"
                />
              </Field>

              <Field
                id={allowMethodsId}
                label="Access-Control-Allow-Methods (CSV)"
              >
                <input
                  id={allowMethodsId}
                  value={allowMethodsCsv}
                  onChange={handleAllowMethodsChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="GET, POST"
                />
              </Field>

              <Field
                id={allowHeadersId}
                label="Access-Control-Allow-Headers (CSV)"
              >
                <input
                  id={allowHeadersId}
                  value={allowHeadersCsv}
                  onChange={handleAllowHeadersChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Authorization, Content-Type"
                />
              </Field>

              <ToggleRow
                title="Access-Control-Allow-Credentials"
                description="true/false"
                isOn={allowCredentials}
                onToggle={handleAllowCredentialsToggle}
                onLabel="TRUE"
                offLabel="FALSE"
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <VerdictCard outcome={outcome} />
          <PreflightCard outcome={outcome} />
          <ResponseHeadersCard headers={outcome.responseHeaders} />
          {!outcome.actual.allowed && outcome.reasons.length > 0 && (
            <BlockReasonsCard reasons={outcome.reasons} />
          )}
          <TipCard />
        </div>
      </div>
    </div>
  )
}

export default CorsSimulator
