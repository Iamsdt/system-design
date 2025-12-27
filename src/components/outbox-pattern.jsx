import { useState } from "react"
import { Database, Send, AlertTriangle, CheckCircle, XCircle, RefreshCw, Zap } from "lucide-react"

export default function OutboxPattern() {
  const [approach, setApproach] = useState("dualWrite")
  const [simulationStep, setSimulationStep] = useState(0)

  const approaches = {
    dualWrite: {
      name: "Dual Write (❌ Problematic)",
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      description: "Write to database and publish event separately. Can fail inconsistently.",
      diagram: `
┌──────────────────────────────────────────────────┐
│           Dual Write Problem                     │
│                                                  │
│  1. Write to DB      2. Publish Event            │
│     │                    │                       │
│     ▼                    ▼                       │
│  ┌──────────┐      ┌──────────┐                 │
│  │ Database │      │  Message │                 │
│  │          │      │   Queue  │                 │
│  └──────────┘      └──────────┘                 │
│                                                  │
│  ❌ Problem: What if DB succeeds but event fails?│
│  ❌ Or event succeeds but DB fails?              │
│  ❌ Inconsistent state!                          │
└──────────────────────────────────────────────────┘`,
      code: `// ❌ Dual Write - DON'T DO THIS
async function createOrder(orderData) {
  // Write 1: Database
  const order = await db.orders.create(orderData)
  
  // Write 2: Message queue
  await messageQueue.publish('OrderCreated', {
    orderId: order.id,
    ...orderData
  })
  
  return order
}

// FAILURE SCENARIOS:

// Scenario 1: DB succeeds, event fails
// - Order saved ✓
// - Event not published ✗
// - Other services don't know about order!

// Scenario 2: Event succeeds, DB fails  
// - Order not saved ✗
// - Event published ✓
// - Other services process non-existent order!

// Scenario 3: Event sent twice (retry)
// - DB transaction rolled back
// - But event already sent once
// - Duplicate event!`,
      problem: "No atomicity between database write and event publish. Can't guarantee both succeed or both fail.",
      severity: "critical"
    },
    outbox: {
      name: "Transactional Outbox (✓ Reliable)",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      description: "Write event to outbox table in same transaction. Publish later.",
      diagram: `
┌──────────────────────────────────────────────────┐
│        Transactional Outbox Pattern              │
│                                                  │
│  1. Single Transaction                           │
│     │                                            │
│     ├──▶ Write to orders table                  │
│     │                                            │
│     └──▶ Write to outbox table                  │
│          (both succeed or both fail)             │
│                                                  │
│  2. Separate Process                             │
│     │                                            │
│     └──▶ Poll outbox table                      │
│          Publish to message queue               │
│          Mark as sent                            │
│                                                  │
│  ✓ Atomic write (single transaction)            │
│  ✓ At-least-once delivery                       │
│  ✓ No inconsistent state                        │
└──────────────────────────────────────────────────┘`,
      code: `// ✓ Transactional Outbox - DO THIS
async function createOrder(orderData) {
  // Start database transaction
  await db.transaction(async (trx) => {
    
    // Write 1: Business data
    const order = await trx.orders.create(orderData)
    
    // Write 2: Outbox entry (same transaction!)
    await trx.outbox.create({
      aggregateId: order.id,
      aggregateType: 'Order',
      eventType: 'OrderCreated',
      payload: JSON.stringify({
        orderId: order.id,
        userId: orderData.userId,
        total: orderData.total
      }),
      createdAt: new Date()
    })
    
    // BOTH writes succeed or BOTH fail
  })
}

// Separate background job (runs every 100ms)
setInterval(async () => {
  // 1. Fetch unpublished events
  const events = await db.outbox.find({
    published: false
  }).limit(100)
  
  for (const event of events) {
    // 2. Publish to message queue
    await messageQueue.publish(
      event.eventType,
      JSON.parse(event.payload)
    )
    
    // 3. Mark as published
    await db.outbox.update(event.id, {
      published: true,
      publishedAt: new Date()
    })
  }
}, 100)`,
      problem: null,
      severity: "solution"
    },
    cdc: {
      name: "Change Data Capture (Advanced)",
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      description: "Database streams changes automatically. No polling needed.",
      diagram: `
┌──────────────────────────────────────────────────┐
│         Change Data Capture (CDC)                │
│                                                  │
│  1. Write to DB                                  │
│     │                                            │
│     ▼                                            │
│  ┌──────────┐                                    │
│  │ Database │                                    │
│  │ (Postgres)                                    │
│  └──────────┘                                    │
│       │                                          │
│       │ Transaction Log                          │
│       │ (WAL - Write-Ahead Log)                  │
│       │                                          │
│       ▼                                          │
│  ┌──────────┐                                    │
│  │   CDC    │ (Debezium, Kafka Connect)         │
│  │  Tool    │                                    │
│  └──────────┘                                    │
│       │                                          │
│       ▼                                          │
│  ┌──────────┐                                    │
│  │  Kafka   │                                    │
│  │  Events  │                                    │
│  └──────────┘                                    │
│                                                  │
│  ✓ Zero-code event publishing                   │
│  ✓ Guaranteed delivery                          │
│  ✓ Exactly-once semantics possible              │
└──────────────────────────────────────────────────┘`,
      code: `// Setup Debezium connector (JSON config)
{
  "name": "orders-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "app",
    "database.password": "secret",
    "database.dbname": "orders_db",
    "database.server.name": "orders",
    "table.include.list": "public.orders,public.outbox",
    "transforms": "outbox",
    "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
    "transforms.outbox.table.expand.json.payload": "true"
  }
}

// Application code - just write to DB!
async function createOrder(orderData) {
  await db.transaction(async (trx) => {
    const order = await trx.orders.create(orderData)
    
    // Write to outbox (CDC will detect this)
    await trx.outbox.create({
      aggregateId: order.id,
      aggregateType: 'Order',
      eventType: 'OrderCreated',
      payload: { orderId: order.id, ...orderData }
    })
  })
  
  // That's it! No manual polling needed.
  // Debezium reads transaction log and publishes to Kafka
}

// Events appear in Kafka automatically:
// Topic: orders.Order.OrderCreated
// Payload: { orderId: "123", userId: "456", total: 99.99 }`,
      problem: null,
      severity: "advanced"
    }
  }

  const simulationScenarios = [
    {
      step: 0,
      description: "Initial State",
      dbState: "Empty",
      outboxState: "Empty",
      eventState: "None",
      status: "idle"
    },
    {
      step: 1,
      description: "Start Transaction: Write Order + Outbox",
      dbState: "Order #123 (uncommitted)",
      outboxState: "Event for Order #123 (uncommitted)",
      eventState: "None",
      status: "in-transaction"
    },
    {
      step: 2,
      description: "Commit Transaction ✓",
      dbState: "Order #123 (committed)",
      outboxState: "Event for Order #123 (unpublished)",
      eventState: "None",
      status: "committed"
    },
    {
      step: 3,
      description: "Background Job: Fetch Unpublished Events",
      dbState: "Order #123",
      outboxState: "Event for Order #123 (processing)",
      eventState: "None",
      status: "processing"
    },
    {
      step: 4,
      description: "Publish to Message Queue ✓",
      dbState: "Order #123",
      outboxState: "Event for Order #123 (published)",
      eventState: "OrderCreated published",
      status: "published"
    }
  ]

  const currentApproach = approaches[approach]
  const currentScenario = simulationScenarios[simulationStep]

  const handleNextStep = () => {
    if (simulationStep < simulationScenarios.length - 1) {
      setSimulationStep(simulationStep + 1)
    }
  }

  const handleReset = () => {
    setSimulationStep(0)
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          Transactional Outbox Pattern
        </h3>
        <p className="text-lg text-slate-600 mb-6">
          Reliably publish events when saving data. Solve the dual-write problem with guaranteed delivery.
        </p>
      </div>

      {/* The Problem */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200">
        <div className="flex items-start gap-4 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 mt-1" />
          <div>
            <h4 className="text-2xl font-bold text-slate-900 mb-3">The Dual-Write Problem</h4>
            <p className="text-slate-700 mb-4">
              You want to save data to a database <span className="font-bold">and</span> publish an event to a message queue. But these are two separate systems—how do you ensure both succeed or both fail?
            </p>
            <div className="bg-white rounded-lg p-4 border border-red-200 mb-4">
              <h5 className="font-bold text-slate-900 mb-3 text-sm">Failure Scenarios:</h5>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                  <div className="text-sm text-slate-700">
                    <span className="font-bold">Database succeeds, event fails:</span> Data saved but other services don't know. Lost event, missing notifications.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                  <div className="text-sm text-slate-700">
                    <span className="font-bold">Event succeeds, database fails:</span> Event published but data not saved. Other services process non-existent data.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                  <div className="text-sm text-slate-700">
                    <span className="font-bold">Event sent twice on retry:</span> Transaction rolled back but event already published. Duplicate processing.
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-700">
              <span className="font-bold text-red-700">Root cause:</span> No distributed transaction between database and message queue. Can't guarantee atomicity across two systems.
            </div>
          </div>
        </div>
      </div>

      {/* Approach Selector */}
      <div>
        <h4 className="text-2xl font-bold text-slate-900 mb-6">Solutions Comparison</h4>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {Object.entries(approaches).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setApproach(key)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                approach === key
                  ? item.severity === "critical"
                    ? "border-red-500 bg-red-50 shadow-lg"
                    : item.severity === "solution"
                    ? "border-green-500 bg-green-50 shadow-lg"
                    : "border-purple-500 bg-purple-50 shadow-lg"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className={`mb-3 ${approach === key ? "" : "opacity-50"}`}>
                {item.icon}
              </div>
              <div className="font-bold text-lg text-slate-900 mb-2">{item.name}</div>
              <div className="text-sm text-slate-600">{item.description}</div>
            </button>
          ))}
        </div>

        {/* Approach Details */}
        <div className={`rounded-2xl p-8 border-2 ${
          currentApproach.severity === "critical"
            ? "bg-red-50 border-red-200"
            : currentApproach.severity === "solution"
            ? "bg-green-50 border-green-200"
            : "bg-purple-50 border-purple-200"
        }`}>
          <div className="flex items-start gap-4 mb-6">
            {currentApproach.icon}
            <div className="flex-1">
              <h5 className="text-2xl font-bold text-slate-900 mb-2">
                {currentApproach.name}
              </h5>
              <p className="text-slate-700">{currentApproach.description}</p>
            </div>
          </div>

          {/* Diagram */}
          <div className="bg-white rounded-lg p-4 border-2 border-slate-200 mb-6">
            <div className="text-sm font-semibold text-slate-700 mb-2">Architecture</div>
            <pre className="text-xs text-slate-700 whitespace-pre overflow-x-auto">
              {currentApproach.diagram}
            </pre>
          </div>

          {/* Code */}
          <div className="bg-white rounded-lg p-4 border-2 border-slate-200 mb-6">
            <div className="text-sm font-semibold text-slate-700 mb-2">Implementation</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
              <code>{currentApproach.code}</code>
            </pre>
          </div>

          {/* Problem or Solution Note */}
          {currentApproach.problem && (
            <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-900">
                  <span className="font-bold">Why This Fails:</span> {currentApproach.problem}
                </div>
              </div>
            </div>
          )}

          {currentApproach.severity === "solution" && (
            <div className="bg-green-100 rounded-lg p-4 border-2 border-green-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-900">
                  <span className="font-bold">Why This Works:</span> Both writes (business data + event) happen in a single database transaction. Either both succeed or both fail. Events published separately by polling the outbox table.
                </div>
              </div>
            </div>
          )}

          {currentApproach.severity === "advanced" && (
            <div className="bg-purple-100 rounded-lg p-4 border-2 border-purple-300">
              <div className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-purple-900">
                  <span className="font-bold">Advanced Approach:</span> Database streams its own transaction log. No application code needed for event publishing. Tools like Debezium monitor database changes and publish to Kafka automatically.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Simulation */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-blue-600" />
          Interactive: Outbox Pattern Flow
        </h4>
        <p className="text-slate-600 mb-6">
          Step through the transactional outbox pattern to see how it guarantees reliable event delivery.
        </p>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleNextStep}
            disabled={simulationStep === simulationScenarios.length - 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              simulationStep === simulationScenarios.length - 1
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next Step →
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Reset
          </button>
          <div className="flex-1 flex items-center justify-end text-sm text-slate-600">
            Step {simulationStep + 1} of {simulationScenarios.length}
          </div>
        </div>

        {/* Current State */}
        <div className="bg-white rounded-xl p-6 border border-blue-200 mb-6">
          <div className="text-xl font-bold text-slate-900 mb-4">
            {currentScenario.description}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className={`rounded-lg p-4 border-2 ${
              currentScenario.status === 'in-transaction' || currentScenario.status === 'committed'
                ? 'bg-green-50 border-green-200'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-slate-600" />
                <div className="font-bold text-sm text-slate-900">Database</div>
              </div>
              <div className="text-sm text-slate-700">{currentScenario.dbState}</div>
            </div>

            <div className={`rounded-lg p-4 border-2 ${
              currentScenario.status === 'processing' || currentScenario.status === 'published'
                ? 'bg-blue-50 border-blue-200'
                : currentScenario.status === 'committed'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-slate-600" />
                <div className="font-bold text-sm text-slate-900">Outbox Table</div>
              </div>
              <div className="text-sm text-slate-700">{currentScenario.outboxState}</div>
            </div>

            <div className={`rounded-lg p-4 border-2 ${
              currentScenario.status === 'published'
                ? 'bg-purple-50 border-purple-200'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-5 h-5 text-slate-600" />
                <div className="font-bold text-sm text-slate-900">Event Queue</div>
              </div>
              <div className="text-sm text-slate-700">{currentScenario.eventState}</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {simulationScenarios.map((scenario, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                idx === simulationStep
                  ? 'bg-blue-100 border-2 border-blue-400 shadow-lg'
                  : idx < simulationStep
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-slate-50 border border-slate-200 opacity-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                idx === simulationStep
                  ? 'bg-blue-500 text-white'
                  : idx < simulationStep
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-300 text-slate-500'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1 text-sm text-slate-900 font-semibold">
                {scenario.description}
              </div>
              {idx < simulationStep && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Approaches */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            <h5 className="font-bold text-slate-900 text-lg">Polling Outbox</h5>
          </div>
          <p className="text-sm text-slate-700 mb-4">
            Background job periodically checks outbox table for unpublished events.
          </p>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg mb-4">
{`// Background worker (every 100ms)
setInterval(async () => {
  const events = await db.outbox
    .where('published', false)
    .orderBy('created_at')
    .limit(100)
  
  for (const event of events) {
    try {
      await messageQueue.publish(
        event.eventType,
        JSON.parse(event.payload)
      )
      
      await db.outbox.update(event.id, {
        published: true,
        publishedAt: new Date()
      })
    } catch (error) {
      // Retry on next poll
      console.error(error)
    }
  }
}, 100)`}
          </pre>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Simple to implement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Works with any database</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-600">⚠</span>
              <span>Polling delay (100ms+)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-600">⚠</span>
              <span>Database load from polling</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
            <h5 className="font-bold text-slate-900 text-lg">Change Data Capture (CDC)</h5>
          </div>
          <p className="text-sm text-slate-700 mb-4">
            Database streams changes from transaction log automatically.
          </p>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg mb-4">
{`// Debezium monitors transaction log
// No application code needed!

// Just write to outbox:
await db.outbox.create({
  aggregateType: 'Order',
  eventType: 'OrderCreated',
  payload: { orderId: '123' }
})

// Debezium automatically:
// 1. Detects insert in transaction log
// 2. Publishes to Kafka topic:
//    orders.outbox.OrderCreated
// 3. Transforms event to final format

// Consumers receive event from Kafka`}
          </pre>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Near real-time (milliseconds)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>No polling overhead</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span>Exactly-once possible</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-600">⚠</span>
              <span>Complex setup (Kafka, Debezium)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Outbox Table Schema */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Outbox Table Schema</h4>
        
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4">
          <pre className="text-xs text-slate-700">
{`CREATE TABLE outbox (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_id      VARCHAR(255) NOT NULL,
  aggregate_type    VARCHAR(255) NOT NULL,
  event_type        VARCHAR(255) NOT NULL,
  payload           JSONB NOT NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
  published         BOOLEAN NOT NULL DEFAULT FALSE,
  published_at      TIMESTAMP,
  
  INDEX idx_outbox_published (published, created_at)
);

-- Example row:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "aggregate_id": "order_123",
  "aggregate_type": "Order",
  "event_type": "OrderCreated",
  "payload": {
    "orderId": "order_123",
    "userId": "user_456",
    "total": 99.99,
    "items": [...]
  },
  "created_at": "2024-01-15T10:30:00Z",
  "published": false,
  "published_at": null
}`}
          </pre>
        </div>

        <div className="text-sm text-slate-700">
          <span className="font-bold">Key points:</span>
          <ul className="mt-2 space-y-1 ml-4">
            <li>• <code className="bg-slate-200 px-1 rounded">payload</code> stores full event data (JSONB for Postgres)</li>
            <li>• Index on <code className="bg-slate-200 px-1 rounded">(published, created_at)</code> for fast polling</li>
            <li>• <code className="bg-slate-200 px-1 rounded">aggregate_id</code> links event to business entity</li>
            <li>• Optional: add <code className="bg-slate-200 px-1 rounded">version</code> for event ordering</li>
          </ul>
        </div>
      </div>

      {/* Real-World Examples */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Real-World Implementations</h4>
        
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2">LinkedIn</div>
            <div className="text-sm text-slate-700 mb-2">
              Uses Change Data Capture (Databus) to stream database changes to Kafka. Powers news feed, search indexing, and analytics.
            </div>
            <div className="text-xs text-blue-600">Technology: Custom CDC (Databus) + Kafka</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2">Uber</div>
            <div className="text-sm text-slate-700 mb-2">
              Transactional outbox pattern for trip events. Polling-based relay publishes to Kafka for downstream services (billing, analytics, driver app).
            </div>
            <div className="text-xs text-blue-600">Technology: Polling + Kafka</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2">Shopify</div>
            <div className="text-sm text-slate-700 mb-2">
              Uses outbox pattern with Debezium CDC for order processing. Guarantees event delivery even during database failures or rollbacks.
            </div>
            <div className="text-xs text-blue-600">Technology: Debezium + Kafka Connect</div>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          Interview Tips
        </h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "What is the transactional outbox pattern?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "It solves the dual-write problem—reliably publishing events when saving data. Instead of writing to DB and publishing to queue separately (which can fail inconsistently), you write the event to an outbox table in the same transaction as your business data. A separate process polls the outbox and publishes events. This guarantees both succeed or both fail—atomic write to database, at-least-once delivery to message queue."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "Polling vs Change Data Capture—which should you use?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Polling is simpler—just a background job checking the outbox table every 100ms. Works with any database, easy to implement. Downside: polling delay and database load. CDC (like Debezium) streams transaction log automatically, near real-time with no polling overhead. But requires more infrastructure (Kafka, Debezium). I'd start with polling for MVP, switch to CDC if you need millisecond latency or have high event volume."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "How do you handle duplicate events?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Outbox guarantees at-least-once delivery, so duplicates are possible (e.g., publisher crashes after publishing but before marking as sent). Consumers must be idempotent. Use event ID for deduplication—store processed event IDs and ignore duplicates. Or make operations naturally idempotent (PUT vs POST). Also add idempotency keys if supported by your message queue (SQS message deduplication, Kafka with exactly-once semantics)."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
