import { useState } from "react"
import { GitBranch, Workflow, RotateCcw, CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react"

export default function SagaPattern() {
  const [selectedPattern, setSelectedPattern] = useState("choreography")
  const [simulationState, setSimulationState] = useState("initial")
  const [currentStep, setCurrentStep] = useState(0)

  const patterns = {
    choreography: {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Choreography-based Saga",
      description: "Each service listens to events and knows what to do next. Decentralized coordination.",
      architecture: `
┌──────────────────────────────────────────────────┐
│        Choreography: Event-Driven Saga          │
│                                                  │
│  Order Service                                   │
│      │                                           │
│      ├── publishes: OrderCreated                │
│      │                                           │
│      ▼                                           │
│  Payment Service (subscribes)                    │
│      │                                           │
│      ├── publishes: PaymentCompleted            │
│      │        OR PaymentFailed                   │
│      ▼                                           │
│  Inventory Service (subscribes)                  │
│      │                                           │
│      ├── publishes: InventoryReserved           │
│      │        OR InventoryFailed                 │
│      ▼                                           │
│  Shipping Service (subscribes)                   │
│      │                                           │
│      └── publishes: OrderShipped                │
│                                                  │
│  Each service reacts to events independently     │
└──────────────────────────────────────────────────┘`,
      code: `// Choreography: services react to events
publish('OrderCreated', { orderId })

on('OrderCreated', () => publish('PaymentCompleted', { orderId }))
on('PaymentCompleted', () => publish('InventoryReserved', { orderId }))

// No central coordinator; flow is implicit`,
      pros: [
        "No single point of failure",
        "Services loosely coupled",
        "Easy to add new services",
        "Naturally event-driven",
        "Scales horizontally"
      ],
      cons: [
        "Hard to understand overall flow",
        "Difficult to debug",
        "No central view of transaction",
        "Complex error handling",
        "Cyclic dependencies possible"
      ],
      useCases: [
        "Microservices with high autonomy",
        "Event-driven architectures",
        "Organizations with decentralized teams",
        "Systems with frequent service additions"
      ]
    },
    orchestration: {
      icon: <Workflow className="w-6 h-6" />,
      title: "Orchestration-based Saga",
      description: "Central coordinator tells each service what to do. Centralized control flow.",
      architecture: `
┌──────────────────────────────────────────────────┐
│        Orchestration: Coordinator-Driven         │
│                                                  │
│              Saga Orchestrator                   │
│                     │                            │
│         ┌───────────┼───────────┬────────┐       │
│         │           │           │        │       │
│         ▼           ▼           ▼        ▼       │
│    Order Svc   Payment Svc  Inventory  Shipping │
│         │           │           │        │       │
│         └───────────┴───────────┴────────┘       │
│                     │                            │
│             (reports back to)                    │
│                                                  │
│  Orchestrator maintains state machine:           │
│    1. CreateOrder                                │
│    2. ChargePayment                              │
│    3. ReserveInventory                           │
│    4. ArrangeShipping                            │
│                                                  │
│  If step fails → trigger compensations           │
└──────────────────────────────────────────────────┘`,
      code: `// Orchestrator drives steps + compensations
async function runSaga(order) {
  try {
    await orderSvc.create(order)
    await paySvc.charge(order.id)
    await invSvc.reserve(order.id)
    await shipSvc.schedule(order.id)
  } catch (e) {
    await shipSvc.cancel(order.id)
    await invSvc.release(order.id)
    await paySvc.refund(order.id)
    await orderSvc.cancel(order.id)
    throw e
  }
}`,
      pros: [
        "Easy to understand flow",
        "Central monitoring point",
        "Clear transaction state",
        "Easier to debug",
        "Can implement timeouts easily"
      ],
      cons: [
        "Single point of failure (orchestrator)",
        "Orchestrator can become complex",
        "Services coupled to orchestrator",
        "Orchestrator needs high availability",
        "More latency (extra hop)"
      ],
      useCases: [
        "Complex business processes",
        "When you need clear audit trail",
        "Regulated industries (finance, healthcare)",
        "Systems with strict ordering requirements"
      ]
    }
  }

  const simulationSteps = {
    choreography: [
      { step: 1, service: "Order", action: "Create Order", status: "success", event: "OrderCreated" },
      { step: 2, service: "Payment", action: "Charge Payment", status: "success", event: "PaymentCompleted" },
      { step: 3, service: "Inventory", action: "Reserve Inventory", status: "failure", event: "InventoryFailed" },
      { step: 4, service: "Payment", action: "Refund Payment (Compensation)", status: "success", event: "PaymentRefunded" },
      { step: 5, service: "Order", action: "Cancel Order (Compensation)", status: "success", event: "OrderCancelled" }
    ],
    orchestration: [
      { step: 1, service: "Orchestrator", action: "Start Saga", status: "running" },
      { step: 2, service: "Order", action: "Create Order", status: "success" },
      { step: 3, service: "Payment", action: "Charge Payment", status: "success" },
      { step: 4, service: "Inventory", action: "Reserve Inventory", status: "failure" },
      { step: 5, service: "Orchestrator", action: "Begin Compensation", status: "compensating" },
      { step: 6, service: "Payment", action: "Refund Payment", status: "success" },
      { step: 7, service: "Order", action: "Cancel Order", status: "success" },
      { step: 8, service: "Orchestrator", action: "Saga Failed", status: "failed" }
    ]
  }

  const handleStartSimulation = () => {
    setCurrentStep(0)
    setSimulationState("running")
    simulateSteps()
  }

  const simulateSteps = () => {
    const steps = simulationSteps[selectedPattern]
    let step = 0
    
    const interval = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(interval)
        setSimulationState("completed")
        return
      }
      
      setCurrentStep(step)
      step++
    }, 1500)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setSimulationState("initial")
  }

  const currentPattern = patterns[selectedPattern]
  const steps = simulationSteps[selectedPattern]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          Saga Pattern
        </h3>
        <p className="text-lg text-slate-600 mb-6">
          Managing distributed transactions across microservices. When ACID isn't possible, use sagas for eventual consistency.
        </p>
      </div>

      {/* Problem Statement */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-red-600 mt-1">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-900 mb-3">The Distributed Transaction Problem</h4>
            <p className="text-slate-700 mb-4">
              In microservices, you can't use database transactions across services. Consider an e-commerce order:
            </p>
            <div className="bg-white rounded-lg p-4 border border-red-200 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</div>
                  <div><span className="font-bold">Order Service:</span> Create order record</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</div>
                  <div><span className="font-bold">Payment Service:</span> Charge customer's card</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</div>
                  <div><span className="font-bold">Inventory Service:</span> Reserve items</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</div>
                  <div><span className="font-bold">Shipping Service:</span> Arrange delivery</div>
                </div>
              </div>
            </div>
            <p className="text-slate-700">
              <span className="font-bold text-red-700">What if step 3 fails?</span> You've already charged the customer! You need to <span className="font-bold">compensate</span> (refund payment, cancel order). This is where Sagas help.
            </p>
          </div>
        </div>
      </div>

      {/* Pattern Selector */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(patterns).map(([key, pattern]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedPattern(key)
              handleReset()
            }}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedPattern === key
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className={`mb-3 ${selectedPattern === key ? "text-blue-600" : "text-slate-600"}`}>
              {pattern.icon}
            </div>
            <div className="font-bold text-lg text-slate-900 mb-2">{pattern.title}</div>
            <div className="text-sm text-slate-600">{pattern.description}</div>
          </button>
        ))}
      </div>

      {/* Pattern Details */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-blue-600 mt-1">{currentPattern.icon}</div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-slate-900 mb-2">
              {currentPattern.title}
            </h4>
            <p className="text-slate-700">{currentPattern.description}</p>
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
          <div className="text-sm font-semibold text-blue-700 mb-2">Architecture</div>
          <pre className="text-xs text-slate-700 whitespace-pre overflow-x-auto">
            {currentPattern.architecture}
          </pre>
        </div>

        {/* Code Example */}
        <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
          <div className="text-sm font-semibold text-blue-700 mb-2">Implementation</div>
          <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
            <code>{currentPattern.code}</code>
          </pre>
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h5 className="font-bold text-slate-900">Pros</h5>
            </div>
            <ul className="space-y-2">
              {currentPattern.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-600 mt-1">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <h5 className="font-bold text-slate-900">Cons</h5>
            </div>
            <ul className="space-y-2">
              {currentPattern.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-red-600 mt-1">-</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-xl p-6 border border-blue-200 mt-6">
          <h5 className="font-bold text-slate-900 mb-3">Best Use Cases</h5>
          <div className="grid md:grid-cols-2 gap-3">
            {currentPattern.useCases.map((useCase, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Simulation */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-purple-600" />
          Failure Scenario Simulation: Inventory Out of Stock
        </h4>

        {/* Simulation Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleStartSimulation}
            disabled={simulationState === "running"}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              simulationState === "running"
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <Play className="w-4 h-4" />
            {simulationState === "running" ? 'Running...' : 'Start Simulation'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-lg font-semibold border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Steps Visualization */}
        <div className="bg-white rounded-xl p-6 border border-purple-200">
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isActive = idx === currentStep && simulationState === "running"
              const isComplete = idx < currentStep || simulationState === "completed"
              const isPending = idx > currentStep

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    isActive
                      ? 'bg-yellow-100 border-2 border-yellow-400 shadow-lg'
                      : isComplete
                      ? step.status === 'failure' || step.status === 'failed'
                        ? 'bg-red-50 border border-red-200'
                        : step.status === 'compensating'
                        ? 'bg-orange-50 border border-orange-200'
                        : 'bg-green-50 border border-green-200'
                      : 'bg-slate-50 border border-slate-200 opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isActive
                      ? 'bg-yellow-500 text-white'
                      : isComplete
                      ? step.status === 'failure' || step.status === 'failed'
                        ? 'bg-red-500 text-white'
                        : step.status === 'compensating'
                        ? 'bg-orange-500 text-white'
                        : 'bg-green-500 text-white'
                      : 'bg-slate-300 text-slate-500'
                  }`}>
                    {isComplete && (step.status === 'success' || step.status === 'running') && <CheckCircle className="w-5 h-5" />}
                    {isComplete && (step.status === 'failure' || step.status === 'failed') && <XCircle className="w-5 h-5" />}
                    {isComplete && step.status === 'compensating' && <RotateCcw className="w-5 h-5" />}
                    {!isComplete && step.step}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-sm">{step.service}</div>
                    <div className="text-xs text-slate-600">{step.action}</div>
                    {step.event && (
                      <div className="text-xs text-blue-600 mt-1">Event: {step.event}</div>
                    )}
                  </div>

                  {isActive && (
                    <div className="text-yellow-600 animate-pulse">
                      <Play className="w-5 h-5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {simulationState === "completed" && (
          <div className="mt-4 bg-red-100 border-2 border-red-300 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 font-bold">
              <XCircle className="w-5 h-5" />
              Transaction Failed - All steps compensated successfully
            </div>
            <div className="text-sm text-red-700 mt-2">
              The saga detected inventory failure and automatically triggered compensation steps to undo all previous operations. This ensures data consistency across services.
            </div>
          </div>
        )}
      </div>

      {/* Compensation Logic */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Compensation Logic Patterns</h4>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-bold text-slate-900 mb-2">Semantic Lock</h5>
            <p className="text-sm text-slate-600 mb-2">
              Mark resources as "pending" during saga, release or finalize on completion/compensation
            </p>
            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`// Reserve
item.status = 'RESERVED'
item.reservedFor = sagaId

// Compensate: release
item.status = 'AVAILABLE'`}
            </pre>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h5 className="font-bold text-slate-900 mb-2">Commutative Updates</h5>
            <p className="text-sm text-slate-600 mb-2">
              Use operations that can be applied in any order (add/subtract vs set)
            </p>
            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`// ✓ Good: Add/Subtract
balance += 100  // Reversible
balance -= 100  // Compensation

// ✗ Bad: Set value
balance = 1000  // Can't reverse`}
            </pre>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h5 className="font-bold text-slate-900 mb-2">Pivotal Transaction</h5>
            <p className="text-sm text-slate-600 mb-2">
              Identify the point of no return where compensation is no longer possible
            </p>
            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`// Reversible steps
reserveInventory()  
chargeCard()        

// PIVOT (point of no return)
sendEmail()  // Can't unsend!

// Must complete
createShipment()`}
            </pre>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          Interview Tips
        </h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "Choreography vs Orchestration—which is better?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Neither is universally better. Orchestration is easier to understand and debug, good for complex workflows with strict ordering (e.g., loan approval). Choreography scales better and gives services more autonomy, good for event-driven systems (e.g., social media notifications). I'd start with orchestration for simplicity, switch to choreography when services need independence. Netflix uses choreography, Uber uses orchestration."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "How do you ensure saga reliability?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Store saga state durably (database or event log). If orchestrator crashes, it can resume from checkpoint. Ensure compensation operations are idempotent—they might run multiple times. Use timeouts to detect stuck sagas (e.g., if payment takes &gt;30s, trigger compensation). Monitor saga completion rates and have alerts for long-running or failed sagas."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "What if compensation fails?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "This is the hardest case. Retry with exponential backoff. If it keeps failing, mark saga as 'needs manual intervention' and alert on-call. Some compensations might not be possible (e.g., email already sent)—in that case, send a correction (refund email, apology). Design compensations to be simple operations that rarely fail (e.g., database updates, not external API calls)."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
