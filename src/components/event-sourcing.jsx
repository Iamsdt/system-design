import { useState } from "react"
import { Database, RotateCcw, FastForward, Camera, PlayCircle, AlertTriangle, CheckCircle } from "lucide-react"

export default function EventSourcing() {
  const [currentView, setCurrentView] = useState("traditional")
  const [selectedEvent, setSelectedEvent] = useState(0)
  const [replayState, setReplayState] = useState("initial")

  const events = [
    { id: 1, type: "AccountCreated", data: { accountId: "acc_123", owner: "Alice", balance: 0 }, timestamp: "2024-01-01T10:00:00Z" },
    { id: 2, type: "MoneyDeposited", data: { accountId: "acc_123", amount: 1000 }, timestamp: "2024-01-02T14:30:00Z" },
    { id: 3, type: "MoneyWithdrawn", data: { accountId: "acc_123", amount: 200 }, timestamp: "2024-01-03T09:15:00Z" },
    { id: 4, type: "MoneyDeposited", data: { accountId: "acc_123", amount: 500 }, timestamp: "2024-01-04T16:45:00Z" },
    { id: 5, type: "MoneyWithdrawn", data: { accountId: "acc_123", amount: 300 }, timestamp: "2024-01-05T11:20:00Z" }
  ]

  const computeState = (upToEvent) => {
    let balance = 0
    let transactions = []
    
    for (let i = 0; i <= upToEvent; i++) {
      const event = events[i]
      switch (event.type) {
        case "AccountCreated":
          balance = 0
          break
        case "MoneyDeposited":
          balance += event.data.amount
          transactions.push({ type: "deposit", amount: event.data.amount })
          break
        case "MoneyWithdrawn":
          balance -= event.data.amount
          transactions.push({ type: "withdrawal", amount: event.data.amount })
          break
      }
    }
    
    return { balance, transactions: transactions.length }
  }

  const currentState = computeState(selectedEvent)

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          Event Sourcing
        </h3>
        <p className="text-lg text-slate-600 mb-6">
          Store every state change as an immutable event. Rebuild current state by replaying events. Never lose history.
        </p>
      </div>

      {/* Traditional vs Event Sourcing */}
      <div className=" from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6">Traditional vs Event Sourcing</h4>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setCurrentView("traditional")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentView === "traditional"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
          >
            Traditional (State-Based)
          </button>
          <button
            onClick={() => setCurrentView("eventSourcing")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentView === "eventSourcing"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
          >
            Event Sourcing
          </button>
        </div>

        {currentView === "traditional" ? (
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <h5 className="font-bold text-slate-900 mb-4">Traditional Approach: Store Current State</h5>
            <div className="space-y-6">
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Database Table</div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-semibold">account_id</th>
                        <th className="text-left py-2 font-semibold">owner</th>
                        <th className="text-left py-2 font-semibold">balance</th>
                        <th className="text-left py-2 font-semibold">updated_at</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2">acc_123</td>
                        <td className="py-2">Alice</td>
                        <td className="py-2 font-bold text-green-600">$1000</td>
                        <td className="py-2 text-slate-500">2024-01-05 11:20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Update Operations</div>
                <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg">
{`// Update current state (history is overwritten)
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'acc_123';
UPDATE accounts SET balance = balance - 200 WHERE account_id = 'acc_123';

// Result: balance = $1000
// But you can't replay/audit past changes ❌`}
                </pre>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-900">
                    <span className="font-bold">Problem:</span> You only know the current balance. You don't know:
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• How did we get to $1000?</li>
                      <li>• What were the individual transactions?</li>
                      <li>• Who made changes and when?</li>
                      <li>• Can't audit or replay history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <h5 className="font-bold text-slate-900 mb-4">Event Sourcing: Store Every Change</h5>
            <div className="space-y-6">
              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Event Store (Append-Only Log)</div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-semibold">event_id</th>
                        <th className="text-left py-2 font-semibold">type</th>
                        <th className="text-left py-2 font-semibold">data</th>
                        <th className="text-left py-2 font-semibold">timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-b border-slate-100">
                        <td className="py-2">1</td>
                        <td className="py-2 font-semibold">AccountCreated</td>
                        <td className="py-2 font-mono">{'{ owner: "Alice", balance: 0 }'}</td>
                        <td className="py-2 text-slate-500">2024-01-01 10:00</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2">2</td>
                        <td className="py-2 font-semibold">MoneyDeposited</td>
                        <td className="py-2 font-mono">{'{ amount: 1000 }'}</td>
                        <td className="py-2 text-slate-500">2024-01-02 14:30</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2">3</td>
                        <td className="py-2 font-semibold">MoneyWithdrawn</td>
                        <td className="py-2 font-mono">{'{ amount: 200 }'}</td>
                        <td className="py-2 text-slate-500">2024-01-03 09:15</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2">4</td>
                        <td className="py-2 font-semibold">MoneyDeposited</td>
                        <td className="py-2 font-mono">{'{ amount: 500 }'}</td>
                        <td className="py-2 text-slate-500">2024-01-04 16:45</td>
                      </tr>
                      <tr>
                        <td className="py-2">5</td>
                        <td className="py-2 font-semibold">MoneyWithdrawn</td>
                        <td className="py-2 font-mono">{'{ amount: 300 }'}</td>
                        <td className="py-2 text-slate-500">2024-01-05 11:20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Rebuilding State by Replay</div>
                <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg">
{`// Replay events to rebuild state
let balance = 0
for (const e of events) {
  if (e.type === 'MoneyDeposited') balance += e.data.amount
  if (e.type === 'MoneyWithdrawn') balance -= e.data.amount
}

// Result: balance = $1000
// History stays preserved ✓`}
                </pre>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-900">
                    <span className="font-bold">Benefits:</span> Full audit trail preserved. You can:
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• Replay events to any point in time</li>
                      <li>• Debug issues by seeing exact sequence</li>
                      <li>• Build multiple projections from same events</li>
                      <li>• Never lose historical data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Event Replay */}
      <div className=" from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <PlayCircle className="w-6 h-6 text-purple-600" />
          Interactive: Time Travel with Event Replay
        </h4>
        <p className="text-slate-600 mb-6">
          Slide through events to see how state changes over time. This is the power of event sourcing!
        </p>

        {/* Event Slider */}
        <div className="bg-white rounded-xl p-6 border border-purple-200">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Event: {selectedEvent + 1} of {events.length}
            </label>
            <input
              type="range"
              min="0"
              max={events.length - 1}
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Start</span>
              <span>Now</span>
            </div>
          </div>

          {/* Current State Display */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className=" from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
              <div className="text-sm text-slate-600 mb-2">Current Balance</div>
              <div className="text-4xl font-bold text-green-700">${currentState.balance}</div>
              <div className="text-xs text-slate-500 mt-2">{currentState.transactions} transactions processed</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <div className="text-sm font-semibold text-slate-700 mb-3">Current Event</div>
              <div className="space-y-2">
                <div className="text-xs text-slate-500">Type</div>
                <div className="font-bold text-slate-900">{events[selectedEvent].type}</div>
                <div className="text-xs text-slate-500 mt-2">Data</div>
                <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded">
                  {JSON.stringify(events[selectedEvent].data, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Event Timeline */}
          <div className="space-y-2">
            {events.map((event, idx) => (
              <div
                key={event.id}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  idx === selectedEvent
                    ? 'bg-purple-100 border-2 border-purple-400 shadow-lg'
                    : idx < selectedEvent
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-slate-50 border border-slate-200 opacity-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === selectedEvent
                    ? 'bg-purple-500'
                    : idx < selectedEvent
                    ? 'bg-blue-500'
                    : 'bg-slate-300 text-slate-500'
                }`}>
                  {event.id}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-slate-900">{event.type}</div>
                  <div className="text-xs text-slate-600">
                    {event.type === 'MoneyDeposited' && `+$${event.data.amount}`}
                    {event.type === 'MoneyWithdrawn' && `-$${event.data.amount}`}
                    {event.type === 'AccountCreated' && `Owner: ${event.data.owner}`}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Concepts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h5 className="font-bold text-slate-900 text-lg">Append-Only Event Store</h5>
          </div>
          <p className="text-sm text-slate-700 mb-4">
            Events are never updated or deleted. Only append new events. This gives you an immutable audit log.
          </p>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg mb-4">
{`// Append-only write
eventStore.append({ aggregateId: 'acc_123', type: 'MoneyDeposited', data: { amount: 500 } })

// Never update/delete events:
// UPDATE events ...  ❌
// DELETE FROM events ... ❌`}
          </pre>
          <div className="text-xs text-slate-600">
            Common implementations: EventStoreDB, Kafka, PostgreSQL (with append-only constraints), AWS EventBridge
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="w-6 h-6 text-purple-600" />
            <h5 className="font-bold text-slate-900 text-lg">Event Replay</h5>
          </div>
          <p className="text-sm text-slate-700 mb-4">
            Rebuild state by replaying events from the beginning. Essential for debugging, testing, and building new projections.
          </p>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg mb-4">
{`// Time-travel query (conceptual)
const stateAt = (ts) => replay(eventStore.get('acc_123').filter(e => e.ts <= ts))

// What was balance on Jan 3?
const snapshot = stateAt('2024-01-03')`}
          </pre>
          <div className="text-xs text-slate-600">
            Use cases: Time travel debugging, regulatory compliance, analytics, testing
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <FastForward className="w-6 h-6 text-green-600" />
            <h5 className="font-bold text-slate-900 text-lg">Projections (Read Models)</h5>
          </div>
          <p className="text-sm text-slate-700 mb-4">
            Create optimized read views by processing events. Multiple projections from same events.
          </p>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg mb-4">
{`// Same events → multiple read models
on('MoneyDeposited', (e) => projection.balance += e.amount)
on('MoneyDeposited', (e) => projection.monthly[getMonth(e.ts)] += e.amount)
on('MoneyWithdrawn', (e) => projection.balance -= e.amount)`}
          </pre>
          <div className="text-xs text-slate-600">
            Projections can be rebuilt anytime by replaying events
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="w-6 h-6 text-orange-600" />
            <h5 className="font-bold text-slate-900 text-lg">Snapshots (Optimization)</h5>
          </div>
          <p className="text-sm text-slate-700 mb-4">
            Store periodic state snapshots to avoid replaying millions of events. Trade storage for speed.
          </p>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg mb-4">
{`// Snapshot optimization (conceptual)
if (version % 1000 === 0) snapshotStore.save({ aggregateId: 'acc_123', version, state })

// Restore: snapshot + tail events
const snap = snapshotStore.latest('acc_123')
const stateNow = replay(eventStore.getAfter('acc_123', snap.version), snap.state)`}
          </pre>
          <div className="text-xs text-slate-600">
            Example: Snapshot every 1000 events instead of replaying all 1M events
          </div>
        </div>
      </div>

      {/* Implementation Example */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Implementation Example</h4>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">Define Events</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg">
{`// Domain event (small example)
type AccountEvent =
  | { type: 'AccountCreated'; accountId: string }
  | { type: 'MoneyDeposited'; accountId: string; amount: number }
  | { type: 'MoneyWithdrawn'; accountId: string; amount: number }`}
            </pre>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">Aggregate (Write Model)</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg">
{`class BankAccount {
  balance = 0
  pending = []

  apply(e) {
    if (e.type === 'MoneyDeposited') this.balance += e.amount
    if (e.type === 'MoneyWithdrawn') this.balance -= e.amount
    this.pending.push(e)
  }

  deposit(amount) { this.apply({ type: 'MoneyDeposited', amount }) }
  withdraw(amount) { this.apply({ type: 'MoneyWithdrawn', amount }) }
}`}
            </pre>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">Event Store</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg">
{`class EventStore {
  append(aggregateId, events) { /* store (aggregateId, version, event) */ }
  getEvents(aggregateId) { /* return ordered events */ }

  load(aggregateId) {
    const account = new BankAccount()
    for (const e of this.getEvents(aggregateId)) account.apply(e)
    return account
  }
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Pros and Cons */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h5 className="font-bold text-slate-900 text-lg">Benefits</h5>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Complete Audit Trail:</span> Every change recorded, perfect for compliance
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Time Travel:</span> Replay to any point in history for debugging
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Event Replay:</span> Rebuild state, test new features, fix bugs retroactively
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Multiple Projections:</span> Same events, different read models
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Event-Driven Architecture:</span> Publish events for other services
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h5 className="font-bold text-slate-900 text-lg">Challenges</h5>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-red-600 mt-1">-</span>
              <div>
                <span className="font-semibold">Complexity:</span> Requires different thinking, steep learning curve
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-red-600 mt-1">-</span>
              <div>
                <span className="font-semibold">Eventual Consistency:</span> Projections lag behind events
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-red-600 mt-1">-</span>
              <div>
                <span className="font-semibold">Event Versioning:</span> Changing event schema is hard
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-red-600 mt-1">-</span>
              <div>
                <span className="font-semibold">Storage Growth:</span> Events accumulate, need archival strategy
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-red-600 mt-1">-</span>
              <div>
                <span className="font-semibold">Tooling:</span> Less mature than traditional databases
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* When to Use */}
      <div className=" from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">When to Use Event Sourcing</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-bold text-green-700 mb-3 text-sm">✓ Great Fit</h5>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Financial systems (banking, trading, accounting)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Audit-heavy domains (healthcare, legal, government)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Complex business logic with many state transitions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Event-driven architectures (microservices)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Need multiple read models from same data</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-red-700 mb-3 text-sm">✗ Overkill</h5>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 flex-shrink-0">✗</span>
                <span>Simple CRUD applications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 flex-shrink-0">✗</span>
                <span>Systems where history doesn't matter</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 flex-shrink-0">✗</span>
                <span>When strong consistency is required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 flex-shrink-0">✗</span>
                <span>Teams unfamiliar with event-driven patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 flex-shrink-0">✗</span>
                <span>Need simple SQL queries on current state</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Real-World Examples */}
      <div className=" from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Real-World Implementations</h4>
        
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2">Microsoft Azure</div>
            <div className="text-sm text-slate-700 mb-2">
              Uses event sourcing internally for Azure Active Directory and other services. Billion+ events/day.
            </div>
            <div className="text-xs text-blue-600">Technology: EventStoreDB, Kafka</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2">Uber</div>
            <div className="text-sm text-slate-700 mb-2">
              Trip history, rider/driver state changes stored as events. Enables complex analytics and dispute resolution.
            </div>
            <div className="text-xs text-blue-600">Technology: Apache Kafka as event store</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2">Goldman Sachs (Securities Database)</div>
            <div className="text-sm text-slate-700 mb-2">
              Built internal event-sourced database for financial transactions. Complete audit trail for regulatory compliance.
            </div>
            <div className="text-xs text-blue-600">Technology: Custom event store + CQRS</div>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className=" from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          Interview Tips
        </h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "What is event sourcing and when would you use it?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Instead of storing current state, you store every change as an immutable event. To get current state, you replay all events. Benefits: complete audit trail, time travel debugging, multiple projections. Use it for domains where history matters—banking, healthcare, legal. Don't use it for simple CRUD. At my last company, we used it for order processing to maintain full audit trail for disputes."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "How do you handle event schema changes?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Events are immutable, so you can't change old events. Options: (1) Upcasting—transform old events to new format during replay. (2) Versioning—support multiple event versions in code. (3) Weak schema—use flexible JSON, optional fields. (4) Tolerant readers—ignore unknown fields. Best practice: keep events backward compatible, add optional fields only."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "What if replaying events is too slow?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Use snapshots. Save aggregate state every N events (e.g., every 100). To load, get latest snapshot + events since snapshot. Example: Instead of replaying 10,000 events, load snapshot at event 9,900 and replay last 100. Trade storage for speed. Also use projections—materialized views updated as events arrive, so reads are fast."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
