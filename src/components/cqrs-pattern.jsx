import { useState } from "react"
import { GitBranch, Database, Zap, RefreshCw, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"

export default function CQRSPattern() {
  const [architecture, setArchitecture] = useState("traditional")
  const [selectedExample, setSelectedExample] = useState("simple")

  const examples = {
    simple: {
      name: "Simple CQRS (Same Database)",
      description: "Separate models for writes and reads, same database. Good starting point.",
      diagram: `
┌──────────────────────────────────────────────────┐
│            Simple CQRS Pattern                   │
│                                                  │
│  Commands          Single Database     Queries   │
│  (Writes)                              (Reads)   │
│     │                                      ▲     │
│     ▼                                      │     │
│  ┌──────┐                            ┌─────────┐│
│  │Write │──────────────┐            │  Read   ││
│  │Model │              │            │  Model  ││
│  └──────┘              ▼            └─────────┘│
│                   ┌─────────┐                   │
│                   │ Database│                   │
│                   │  Tables │                   │
│                   └─────────┘                   │
│                                                  │
│  Write Model: Validates business rules          │
│  Read Model: Optimized for queries              │
└──────────────────────────────────────────────────┘`,
      pros: [
        "Easy to implement",
        "No eventual consistency issues",
        "Can start with existing database",
        "Simpler operations"
      ],
      cons: [
        "Still shares same database",
        "Read/write contention possible",
        "Can't scale independently"
      ]
    },
    separate: {
      name: "Separate Databases",
      description: "Different databases for writes and reads. Eventual consistency via events.",
      diagram: `
┌──────────────────────────────────────────────────┐
│          CQRS with Separate Databases            │
│                                                  │
│  Commands                              Queries   │
│  (Writes)                              (Reads)   │
│     │                                      ▲     │
│     ▼                                      │     │
│  ┌──────┐         Events            ┌─────────┐│
│  │Write │──────────┬────────────────▶│  Read   ││
│  │Model │          │                 │  Model  ││
│  └──────┘          │                 └─────────┘│
│     │              ▼                      ▲      │
│     ▼         Event Bus                   │      │
│  ┌─────────┐      │                  ┌────────┐ │
│  │ Write   │      └──────────────────▶│  Read  │ │
│  │Database │                          │Database│ │
│  │(Postgres)                          │(Redis) │ │
│  └─────────┘                          └────────┘ │
│                                                  │
│  Write: Normalized, ACID                        │
│  Read: Denormalized, fast queries               │
└──────────────────────────────────────────────────┘`,
      pros: [
        "Independent scaling",
        "Optimized storage per use case",
        "Read/write isolation",
        "Can use different technologies"
      ],
      cons: [
        "Eventual consistency",
        "More complex operations",
        "Event synchronization needed",
        "Higher operational cost"
      ]
    },
    eventSourcing: {
      name: "CQRS + Event Sourcing",
      description: "Event store as source of truth. Multiple read models built from events.",
      diagram: `
┌──────────────────────────────────────────────────┐
│        CQRS + Event Sourcing                     │
│                                                  │
│  Commands                              Queries   │
│     │                                      ▲     │
│     ▼                                      │     │
│  ┌──────┐                           ┌─────────┐ │
│  │Write │                           │Read     │ │
│  │Model │                           │Model 1  │ │
│  └──────┘                           └─────────┘ │
│     │              Events                ▲      │
│     ▼                │                   │      │
│  ┌─────────────┐    │              ┌─────────┐ │
│  │ Event Store │────┼──────────────▶│Read     │ │
│  │ (Append-Only)    │              │Model 2  │ │
│  └─────────────┘    │              └─────────┘ │
│                     │                   ▲      │
│                     │              ┌─────────┐ │
│                     └──────────────▶│Read     │ │
│                                    │Model 3  │ │
│                                    └─────────┘ │
│                                                 │
│  Single source: Event log                      │
│  Multiple projections for different queries    │
└──────────────────────────────────────────────────┘`,
      pros: [
        "Complete audit trail",
        "Time travel debugging",
        "Unlimited read models",
        "Event-driven by design"
      ],
      cons: [
        "Highest complexity",
        "Event versioning challenges",
        "Eventually consistent",
        "Steep learning curve"
      ]
    }
  }

  const codeExamples = {
    traditional: {
      title: "Traditional Approach",
      code: `// Single model for both reads and writes
class UserService {
  async createUser(data) {
    // Write operation
    const user = await db.users.create({
      name: data.name,
      email: data.email,
      address: data.address
    })
    return user
  }
  
  async getUserProfile(userId) {
    // Read operation - same model
    const user = await db.users.findOne({
      where: { id: userId },
      include: ['orders', 'addresses', 'preferences']
    })
    // Complex JOIN, slow for reads
    return user
  }
}

// ❌ Problems:
// - Same model optimized for neither reads nor writes
// - Complex queries slow down writes
// - Denormalization for reads affects write logic`
    },
    cqrs: {
      title: "CQRS Approach",
      code: `// WRITE SIDE: Command Model
class UserCommandService {
  async createUser(command: CreateUserCommand) {
    // Validate business rules
    this.validateEmail(command.email)
    
    // Write to normalized database
    const user = await writeDb.users.create({
      name: command.name,
      email: command.email
    })
    
    // Publish event
    await eventBus.publish('UserCreated', {
      userId: user.id,
      name: user.name,
      email: user.email
    })
    
    return user.id
  }
}

// READ SIDE: Query Model
class UserQueryService {
  async getUserProfile(userId: string) {
    // Read from denormalized cache
    const profile = await readDb.get(\`user:\${userId}\`)
    
    if (!profile) {
      // Rebuild from events if missing
      return this.rebuildProfile(userId)
    }
    
    return profile
  }
}

// Event Handler: Updates read model
eventBus.on('UserCreated', async (event) => {
  await readDb.set(\`user:\${event.userId}\`, {
    id: event.userId,
    name: event.name,
    email: event.email,
    orderCount: 0,
    lastActive: new Date()
  })
})

// ✓ Benefits:
// - Write model: normalized, validates rules
// - Read model: denormalized, optimized for queries
// - Independent scaling
// - Clear separation of concerns`
    }
  }

  const currentExample = examples[selectedExample]
  const currentCodeExample = codeExamples[architecture]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          CQRS (Command Query Responsibility Segregation)
        </h3>
        <p className="text-lg text-slate-600 mb-6">
          Separate models for reading and writing data. Optimize each side independently.
        </p>
      </div>

      {/* The Core Principle */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="flex items-start gap-4 mb-6">
          <GitBranch className="w-8 h-8 text-blue-600 mt-1" />
          <div>
            <h4 className="text-2xl font-bold text-slate-900 mb-3">The Core Idea</h4>
            <p className="text-slate-700 mb-4">
              Instead of using the same model for reads and writes, <span className="font-bold">split them into separate models</span>. Commands change state, queries read state—each optimized for its purpose.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <h5 className="font-bold text-slate-900 text-sm">Command Side (Writes)</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Validates business rules</li>
                  <li>• Changes system state</li>
                  <li>• Returns simple acknowledgment</li>
                  <li>• Normalized data structure</li>
                  <li>• Focus: consistency, validation</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-5 h-5 text-green-600" />
                  <h5 className="font-bold text-slate-900 text-sm">Query Side (Reads)</h5>
                </div>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• No business logic</li>
                  <li>• Never modifies state</li>
                  <li>• Returns rich DTOs</li>
                  <li>• Denormalized for fast reads</li>
                  <li>• Focus: performance, simplicity</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-4">
              <div className="text-sm text-blue-900">
                <span className="font-bold">Key Insight:</span> Reads and writes have different requirements. Writes need ACID guarantees and validation. Reads need speed and denormalized data. Why force them to share the same model?
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Comparison */}
      <div>
        <h4 className="text-2xl font-bold text-slate-900 mb-6">Code Comparison</h4>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setArchitecture("traditional")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              architecture === "traditional"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
          >
            Traditional
          </button>
          <button
            onClick={() => setArchitecture("cqrs")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              architecture === "cqrs"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
          >
            CQRS
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h5 className="text-xl font-bold text-slate-900 mb-4">{currentCodeExample.title}</h5>
          <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
            <code>{currentCodeExample.code}</code>
          </pre>
        </div>
      </div>

      {/* CQRS Variations */}
      <div>
        <h4 className="text-2xl font-bold text-slate-900 mb-6">CQRS Variations</h4>

        {/* Architecture Selector */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {Object.entries(examples).map(([key, example]) => (
            <button
              key={key}
              onClick={() => setSelectedExample(key)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedExample === key
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="font-bold text-lg text-slate-900 mb-2">{example.name}</div>
              <div className="text-sm text-slate-600">{example.description}</div>
            </button>
          ))}
        </div>

        {/* Architecture Details */}
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
          <h5 className="text-xl font-bold text-slate-900 mb-6">{currentExample.name}</h5>

          {/* Diagram */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
            <div className="text-sm font-semibold text-slate-700 mb-2">Architecture</div>
            <pre className="text-xs text-slate-700 whitespace-pre overflow-x-auto">
              {currentExample.diagram}
            </pre>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h6 className="font-bold text-slate-900">Pros</h6>
              </div>
              <ul className="space-y-2">
                {currentExample.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-600 mt-0.5">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h6 className="font-bold text-slate-900">Cons</h6>
              </div>
              <ul className="space-y-2">
                {currentExample.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-red-600 mt-0.5">-</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Patterns */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6">Implementation Patterns</h4>

        <div className="space-y-6">
          {/* Commands */}
          <div className="bg-white rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h5 className="font-bold text-slate-900">Commands (Write Operations)</h5>
            </div>
            <p className="text-sm text-slate-700 mb-4">
              Commands express intent to change state. They can fail due to business rule violations.
            </p>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg">
{`// Command: Intent to do something
interface CreateOrderCommand {
  userId: string
  items: Array<{ productId: string; quantity: number }>
  shippingAddress: Address
}

// Command Handler
class CreateOrderHandler {
  async handle(command: CreateOrderCommand) {
    // 1. Validate business rules
    const user = await this.userRepo.findById(command.userId)
    if (!user.isVerified) {
      throw new Error('User not verified')
    }
    
    // 2. Check inventory
    await this.inventoryService.reserve(command.items)
    
    // 3. Create order
    const order = new Order({
      userId: command.userId,
      items: command.items,
      status: 'pending'
    })
    
    await this.orderRepo.save(order)
    
    // 4. Publish event
    await this.eventBus.publish('OrderCreated', {
      orderId: order.id,
      userId: command.userId,
      total: order.total
    })
    
    // Return simple result
    return { orderId: order.id }
  }
}

// Usage
await commandBus.send(new CreateOrderCommand({
  userId: 'user_123',
  items: [{ productId: 'prod_456', quantity: 2 }],
  shippingAddress: { ... }
}))`}
            </pre>
          </div>

          {/* Queries */}
          <div className="bg-white rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-green-600" />
              <h5 className="font-bold text-slate-900">Queries (Read Operations)</h5>
            </div>
            <p className="text-sm text-slate-700 mb-4">
              Queries retrieve data without side effects. Never modify state.
            </p>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg">
{`// Query: Request for data
interface GetUserOrdersQuery {
  userId: string
  status?: string
  page: number
  limit: number
}

// Query Handler
class GetUserOrdersHandler {
  async handle(query: GetUserOrdersQuery) {
    // Read from optimized read model (denormalized)
    const orders = await this.readDb.query(\`
      SELECT 
        o.id,
        o.status,
        o.total,
        o.created_at,
        COUNT(i.id) as item_count
      FROM orders_view o
      LEFT JOIN order_items i ON i.order_id = o.id
      WHERE o.user_id = $1
        AND ($2 IS NULL OR o.status = $2)
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $3 OFFSET $4
    \`, [query.userId, query.status, query.limit, query.page * query.limit])
    
    // Return rich DTO
    return {
      orders: orders.map(o => ({
        id: o.id,
        status: o.status,
        total: o.total,
        itemCount: o.item_count,
        createdAt: o.created_at
      })),
      page: query.page,
      hasMore: orders.length === query.limit
    }
  }
}

// Usage
const result = await queryBus.send(new GetUserOrdersQuery({
  userId: 'user_123',
  status: 'shipped',
  page: 0,
  limit: 20
}))`}
            </pre>
          </div>

          {/* Event Handlers */}
          <div className="bg-white rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <h5 className="font-bold text-slate-900">Event Handlers (Sync Read Models)</h5>
            </div>
            <p className="text-sm text-slate-700 mb-4">
              Update read models when commands emit events. Ensures eventual consistency.
            </p>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg">
{`// Event Handler: Updates read model
class OrderCreatedHandler {
  @Subscribe('OrderCreated')
  async handle(event: OrderCreated) {
    // Update denormalized read model
    await this.readDb.exec(\`
      INSERT INTO orders_view (
        id, user_id, status, total, item_count, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
    \`, [
      event.orderId,
      event.userId,
      'pending',
      event.total,
      event.items.length,
      event.timestamp
    ])
    
    // Update user statistics
    await this.redis.incr(\`user:\${event.userId}:order_count\`)
    
    // Update search index
    await this.elasticsearch.index({
      index: 'orders',
      id: event.orderId,
      body: {
        userId: event.userId,
        status: 'pending',
        total: event.total,
        createdAt: event.timestamp
      }
    })
  }
}

// Multiple read models from same event!`}
            </pre>
          </div>
        </div>
      </div>

      {/* Benefits and Challenges */}
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
                <span className="font-semibold">Optimized Models:</span> Write model normalized, read model denormalized for queries
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Independent Scaling:</span> Scale reads separately from writes (most apps read-heavy)
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Technology Choice:</span> PostgreSQL for writes, Redis/Elasticsearch for reads
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Clear Separation:</span> Writes validate business logic, reads just return data
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
                <span className="font-semibold">Eventual Consistency:</span> Read model may lag behind writes
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-red-600 mt-1">-</span>
              <div>
                <span className="font-semibold">Complexity:</span> More moving parts, harder to understand
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-red-600 mt-1">-</span>
              <div>
                <span className="font-semibold">Code Duplication:</span> Separate models mean more code
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-red-600 mt-1">-</span>
              <div>
                <span className="font-semibold">Synchronization:</span> Need to keep read model in sync via events
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* When to Use */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">When to Use CQRS</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-bold text-green-700 mb-3 text-sm">✓ Good Fit</h5>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Read-heavy applications (10:1 or higher read/write ratio)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Complex domain with heavy business logic</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Need different query views (reports, search, dashboards)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Collaborative domains (multiple users editing)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Event-driven architecture already in place</span>
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
                <span>Similar read/write patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 flex-shrink-0">✗</span>
                <span>Small scale applications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 flex-shrink-0">✗</span>
                <span>Team unfamiliar with pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 flex-shrink-0">✗</span>
                <span>Strong immediate consistency required</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Real-World Examples */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Real-World Examples</h4>
        
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2">Stack Overflow</div>
            <div className="text-sm text-slate-700 mb-2">
              Writes to SQL Server (questions, answers). Reads from Elasticsearch (search) and Redis (hot data). Separate read models for search and real-time views.
            </div>
            <div className="text-xs text-blue-600">Pattern: Separate databases + denormalized reads</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2">Amazon</div>
            <div className="text-sm text-slate-700 mb-2">
              Order writes go to transactional DB. Multiple read models: order history (DynamoDB), search (Elasticsearch), recommendations (graph DB), analytics (data warehouse).
            </div>
            <div className="text-xs text-blue-600">Pattern: CQRS + Event Sourcing for some domains</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="font-bold text-slate-900 mb-2">Uber</div>
            <div className="text-sm text-slate-700 mb-2">
              Trip commands (start trip, end trip) write events. Multiple projections: driver app (current trip), rider app (trip history), analytics (heatmaps), billing (invoices).
            </div>
            <div className="text-xs text-blue-600">Pattern: CQRS + Event Sourcing + Kafka</div>
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
              Q: "What is CQRS and when would you use it?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "CQRS separates read and write models. Commands change state and validate business rules. Queries just return data, no side effects. Use it when reads and writes have very different requirements—like e-commerce where you write orders rarely but read product catalogs constantly. Benefit: optimize each side independently. Drawback: eventual consistency—read model may lag behind writes. I'd start simple (same DB) and only go to separate databases if scaling demands it."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "How is CQRS different from Event Sourcing?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "CQRS is about separation—different models for reads and writes. Event Sourcing is about storage—storing events instead of current state. They're independent patterns. You can do CQRS without Event Sourcing (same database, separate models). You can do Event Sourcing without CQRS (single model replaying events). They work great together—Event Store as write side, projections as read side—but you don't need both."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "How do you handle eventual consistency in CQRS?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Several strategies: (1) Show 'processing' state in UI after writes. (2) Optimistic updates—assume success, update UI immediately. (3) Version numbers—client checks if read model caught up. (4) Push notifications—server notifies when projection ready. (5) For critical cases, read from write model temporarily. Most users don't notice lag under 100ms. Also make sure event processing is fast and monitored."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
