import { useState } from "react"
import { Shield, RefreshCw, Database, Key, CheckCircle, AlertTriangle, Code } from "lucide-react"

export default function IdempotencyDeepDive() {
  const [simulationStep, setSimulationStep] = useState(0)
  const [requestCount, setRequestCount] = useState(0)

  const simulationSteps = [
    {
      title: "Initial Request",
      description: "Client sends payment request with unique idempotency key",
      state: { status: "pending", dbState: "empty", response: null }
    },
    {
      title: "Processing",
      description: "Server stores idempotency key in database and processes payment",
      state: { status: "processing", dbState: "key_stored", response: null }
    },
    {
      title: "Success Response",
      description: "Payment completes successfully, response cached with key",
      state: { status: "completed", dbState: "key_with_result", response: "success" }
    },
    {
      title: "Duplicate Request",
      description: "Network timeout causes client to retry with same key",
      state: { status: "duplicate_detected", dbState: "key_with_result", response: "cached" }
    },
    {
      title: "Cached Response",
      description: "Server returns cached result immediately, no duplicate processing",
      state: { status: "completed", dbState: "key_with_result", response: "success" }
    }
  ]

  const handleNextStep = () => {
    if (simulationStep < simulationSteps.length - 1) {
      setSimulationStep(simulationStep + 1)
      if (simulationStep === 3) {
        setRequestCount(requestCount + 1)
      }
    }
  }

  const handleReset = () => {
    setSimulationStep(0)
    setRequestCount(0)
  }

  const currentStep = simulationSteps[simulationStep]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          Idempotency Deep Dive
        </h3>
        <p className="text-lg text-slate-600 mb-6">
          Making operations safe to retry. Essential for distributed systems where network failures and retries are common.
        </p>
      </div>

      {/* What is Idempotency */}
      <div className=" from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-purple-600 mt-1">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-900 mb-3">What is Idempotency?</h4>
            <p className="text-slate-700 mb-4">
              An operation is <span className="font-bold text-purple-700">idempotent</span> if performing it multiple times has the same effect as performing it once.
            </p>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="font-bold text-slate-900">Naturally Idempotent</div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="bg-green-50 p-2 rounded">GET /users/123 (read)</div>
                    <div className="bg-green-50 p-2 rounded">PUT /users/123 (full update)</div>
                    <div className="bg-green-50 p-2 rounded">DELETE /users/123 (delete)</div>
                    <div className="text-xs text-slate-500 mt-2">Same result no matter how many times called</div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div className="font-bold text-slate-900">NOT Idempotent</div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="bg-red-50 p-2 rounded">POST /payments (create)</div>
                    <div className="bg-red-50 p-2 rounded">POST /orders (create)</div>
                    <div className="bg-red-50 p-2 rounded">PATCH /balance (increment)</div>
                    <div className="text-xs text-slate-500 mt-2">Multiple calls create duplicate effects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation */}
      <div className=" from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-blue-600" />
          Interactive Simulation: Payment Processing
        </h4>

        {/* Visualization */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-blue-200">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Client */}
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
              <div className="font-bold text-slate-900 mb-3 text-center">Client</div>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-3 rounded border border-blue-200">
                  <div className="font-semibold text-blue-700 mb-1">Idempotency Key</div>
                  <div className="text-xs font-mono text-slate-600">abc-123-xyz</div>
                </div>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <div className="font-semibold text-blue-700 mb-1">Amount</div>
                  <div className="text-xs text-slate-600">$100.00</div>
                </div>
                {simulationStep >= 3 && (
                  <div className="bg-amber-100 p-2 rounded text-xs text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Timeout! Retrying...
                  </div>
                )}
              </div>
            </div>

            {/* Server */}
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
              <div className="font-bold text-slate-900 mb-3 text-center">Server</div>
              <div className="space-y-2 text-sm">
                <div className={`p-3 rounded border ${
                  currentStep.state.status === 'pending' 
                    ? 'bg-slate-100 border-slate-300' 
                    : currentStep.state.status === 'processing'
                    ? 'bg-yellow-100 border-yellow-300'
                    : currentStep.state.status === 'duplicate_detected'
                    ? 'bg-purple-100 border-purple-300'
                    : 'bg-green-100 border-green-300'
                }`}>
                  <div className="font-semibold mb-1">Status</div>
                  <div className="text-xs capitalize">{currentStep.state.status.replace('_', ' ')}</div>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <div className="font-semibold text-green-700 mb-1">Requests Processed</div>
                  <div className="text-xs">
                    {simulationStep < 3 ? 1 : requestCount + 1} 
                    {simulationStep >= 4 && ' (1 actual, rest cached)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Database */}
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
              <div className="font-bold text-slate-900 mb-3 text-center">Database</div>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-3 rounded border border-purple-200">
                  <div className="font-semibold text-purple-700 mb-2">Idempotency Store</div>
                  {currentStep.state.dbState === 'empty' ? (
                    <div className="text-xs text-slate-400 italic">No keys stored</div>
                  ) : currentStep.state.dbState === 'key_stored' ? (
                    <div className="text-xs">
                      <div className="font-mono text-purple-700">abc-123-xyz</div>
                      <div className="text-slate-500 mt-1">Status: Processing</div>
                    </div>
                  ) : (
                    <div className="text-xs">
                      <div className="font-mono text-purple-700">abc-123-xyz</div>
                      <div className="text-slate-500 mt-1">Status: Completed</div>
                      <div className="text-slate-500">Result: Cached</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step Description */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-slate-900">
                Step {simulationStep + 1}: {currentStep.title}
              </div>
              <div className="text-xs text-slate-500">
                {simulationStep + 1} / {simulationSteps.length}
              </div>
            </div>
            <p className="text-sm text-slate-700">{currentStep.description}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleNextStep}
              disabled={simulationStep >= simulationSteps.length - 1}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                simulationStep >= simulationSteps.length - 1
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {simulationStep >= simulationSteps.length - 1 ? 'Complete' : 'Next Step'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Implementation Patterns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Database Technique */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-indigo-600" />
            <h4 className="text-xl font-bold text-slate-900">Database Technique</h4>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Store idempotency keys in database with unique constraint
          </p>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Schema</div>
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
{`CREATE TABLE idempotency_keys (
  key TEXT PRIMARY KEY,
  status TEXT,
  response JSONB,
  created_at TIMESTAMP
);

-- Optional: multi-tenant scope
-- UNIQUE (user_id, key)`}
              </pre>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Implementation</div>
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
{`async function processPayment(key, amount) {
  // 1) Claim the key (unique insert)
  if (!tryInsertKey(key)) return getCachedResponse(key)

  // 2) Do the work once
  const result = await chargeCard(amount)

  // 3) Store response and return
  storeResponse(key, result)
  return result
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Idempotency Keys */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-amber-600" />
            <h4 className="text-xl font-bold text-slate-900">Idempotency Keys</h4>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Client-generated unique identifiers for requests
          </p>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Key Generation</div>
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
{`// Recommended: random UUID
const key = crypto.randomUUID()

// Optional: prefix style
const key2 = 'req_' + randomAlphanumeric(12)`}
              </pre>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Client Usage</div>
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
{`// Generate key once, reuse on retries
const idempotencyKey = generateKey()

await fetch('/api/payment', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ amount: 100 })
})`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Examples */}
      <div className=" from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6">Real-World Examples</h4>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Stripe */}
          <div className="bg-white rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-emerald-600" />
              <h5 className="font-bold text-slate-900">Stripe API</h5>
            </div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-3">
{`curl https://api.stripe.com/v1/charges \\
  -H "Idempotency-Key: abc123xyz" \\
  -d amount=2000 -d currency=usd

# Retry with same key → same response`}
            </pre>
            <p className="text-xs text-slate-600">
              Stripe stores keys for 24 hours. Duplicate requests return same response and don't charge card again.
            </p>
          </div>

          {/* AWS */}
          <div className="bg-white rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-orange-600" />
              <h5 className="font-bold text-slate-900">AWS DynamoDB</h5>
            </div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-3">
{`// Conditional write (idempotent)
await putItem({
  Item: { orderId: 'abc123' },
  ConditionExpression: 'attribute_not_exists(orderId)'
})`}
            </pre>
            <p className="text-xs text-slate-600">
              Conditional expressions provide built-in idempotency without separate key table.
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Best Practices</h4>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900 text-sm">Expire Old Keys</div>
                <div className="text-xs text-slate-600">Clean up keys after 24-48 hours to avoid storage bloat</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900 text-sm">Scope Keys Properly</div>
                <div className="text-xs text-slate-600">Use composite keys (user_id + request_key) for multi-tenant</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900 text-sm">Store Full Request</div>
                <div className="text-xs text-slate-600">Cache request body to detect conflicts (same key, different data)</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900 text-sm">Handle Concurrent Requests</div>
                <div className="text-xs text-slate-600">Use database locks or distributed locks (Redis) for in-flight keys</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900 text-sm">Return Cached Response</div>
                <div className="text-xs text-slate-600">Send same HTTP status code (200/201) for cached responses</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900 text-sm">Monitor Key Usage</div>
                <div className="text-xs text-slate-600">Track duplicate key rates to identify retry storms</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className=" from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          Interview Tips
        </h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "How do you make a payment API idempotent?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Require clients to send an Idempotency-Key header (UUID). On the server, use a database table with unique constraint on this key. Before processing, insert the key—if it already exists (duplicate request), return the cached response. After processing, update the row with the result. This ensures the payment is only charged once even if the client retries due to network timeout. Keys should expire after 24 hours to prevent storage bloat."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "What if two requests with the same key arrive simultaneously?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Use SELECT FOR UPDATE or distributed locks (Redis SETNX). When the first request inserts the key, acquire a lock. The second request will either fail the unique constraint check (return cached) or wait for the lock. This prevents race conditions where both requests could start processing. The lock should have a timeout to prevent deadlocks if the first request crashes."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "Should you validate that duplicate requests have the same body?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Yes! Store a hash of the request body with the key. If a client retries with the same key but different data (e.g., different amount), return 422 Unprocessable Entity. This prevents accidental misuse where clients reuse keys incorrectly. Stripe does this—if you retry with the same key but different amount, it errors."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
