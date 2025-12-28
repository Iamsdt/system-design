import { useMemo, useState } from "react"

const decodeSegment = (segment) => {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  return JSON.parse(atob(padded))
}

export default function JWTTokenDecoder() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  )

  const decoded = useMemo(() => {
    try {
      const parts = token.split(".")
      if (parts.length !== 3) return null

      const header = decodeSegment(parts[0])
      const payload = decodeSegment(parts[1])
      const signature = parts[2]

      const now = Math.floor(Date.now() / 1000)
      const isExpired = payload.exp && payload.exp < now
      const weakAlg = header.alg === "none"

      return { header, payload, signature, isExpired, weakAlg }
    } catch (error) {
      return null
    }
  }, [token])

  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-2xl">
          🎫
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">JWT Token Decoder</h4>
          <div className="text-xs text-slate-500">Decode, inspect claims, spot risks</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">JWT Token</label>
          <textarea
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
            rows={3}
            placeholder="Paste JWT token here..."
          />
        </div>

        {decoded ? (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-semibold text-blue-900 mb-2">Header</div>
              <pre className="text-xs bg-white p-3 rounded border border-blue-200 overflow-x-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
              {decoded.weakAlg && (
                <div className="text-xs text-red-700 mt-2">⚠️ Reject tokens using alg "none".</div>
              )}
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-green-900">Payload (Claims)</div>
                {decoded.isExpired && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">EXPIRED</span>
                )}
              </div>
              <pre className="text-xs bg-white p-3 rounded border border-green-200 overflow-x-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm font-semibold text-slate-900 mb-2">Common Claims</div>
              <div className="space-y-1 text-xs text-slate-700">
                {decoded.payload.sub && (
                  <div>
                    <span className="font-semibold">sub:</span> {decoded.payload.sub} (Subject/User ID)
                  </div>
                )}
                {decoded.payload.exp && (
                  <div>
                    <span className="font-semibold">exp:</span> {new Date(decoded.payload.exp * 1000).toLocaleString()} (Expiration)
                  </div>
                )}
                {decoded.payload.iat && (
                  <div>
                    <span className="font-semibold">iat:</span> {new Date(decoded.payload.iat * 1000).toLocaleString()} (Issued At)
                  </div>
                )}
                {decoded.payload.role && (
                  <div>
                    <span className="font-semibold">role:</span> {decoded.payload.role} (Role)
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-xs text-yellow-800">
                <div className="font-semibold mb-1">Best Practices</div>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Validate issuer (iss), audience (aud), expiration (exp)</li>
                  <li>Use RS256/ES256 with key rotation and kid headers</li>
                  <li>Keep access tokens short-lived; use refresh token rotation</li>
                  <li>Store tokens in httpOnly, secure cookies when possible</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
                <div className="font-semibold mb-1">Common Pitfalls</div>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Accepting tokens without verifying signatures</li>
                  <li>Using symmetric keys in public clients</li>
                  <li>Over-trusting claims without checking scope/audience</li>
                  <li>Long-lived tokens without revocation strategy</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">Invalid JWT token format</div>
        )}
      </div>
    </div>
  )
}
