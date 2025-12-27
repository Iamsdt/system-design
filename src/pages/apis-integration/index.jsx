import { useNavigate } from "react-router-dom"
import ApiGatewaySimulator from "@/components/api-gateway-simulator"
import ApiVersioningStrategies from "@/components/api-versioning-strategies"
import IdempotencyDeepDive from "@/components/idempotency-deep-dive"
import SagaPattern from "@/components/saga-pattern"
import HATEOAS from "@/components/hateoas"
import OpenAPISwagger from "@/components/openapi-swagger"
import EventSourcing from "@/components/event-sourcing"
import CQRSPattern from "@/components/cqrs-pattern"
import OutboxPattern from "@/components/outbox-pattern"

export default function ApisIntegration() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative gradient-overlay py-20 md:py-28 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 mb-6">
              <span className="text-sm font-medium text-teal-700">
                Module 5
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              APIs, Integration & <span className="text-gradient">Data Movement</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 mx-auto">
              A deep dive into how systems communicate. Master protocols, gateway patterns, asynchronous messaging, and real-time data streaming.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => nav("/")}
                className="btn-secondary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Section 1: API Protocols */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center text-sm">
                01
              </span>
              API PROTOCOLS
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              REST vs GraphQL vs gRPC
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mb-6">
              The protocol defines the contract, performance, and coupling between services. Choosing the wrong one can lead to chatty interfaces or rigid contracts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">REST</h3>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                Representational State Transfer. The standard for public web APIs.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Resource-based (Nouns)
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Stateless
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Cacheable (HTTP)
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Over/Under-fetching
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Multiple round-trips
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t pt-3">
                <strong>Best for:</strong> Public APIs, Simple CRUD, Browser clients
              </div>
            </div>

            <div className="bg-white border-2 border-pink-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">GraphQL</h3>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                Query language for APIs. Client specifies exactly what data it needs.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Single Endpoint
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Strongly Typed Schema
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ No Over-fetching
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Complexity (Resolvers)
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Caching is hard
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t pt-3">
                <strong>Best for:</strong> Complex data graphs, Mobile apps (bandwidth), Aggregation
              </div>
            </div>

            <div className="bg-white border-2 border-teal-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">gRPC</h3>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                High-performance RPC framework using Protocol Buffers.
              </p>
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Binary (ProtoBuf)
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ HTTP/2 Streaming
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Low Latency
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Browser support (requires proxy)
                </div>
                <div className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded">
                  ✗ Steep learning curve
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t pt-3">
                <strong>Best for:</strong> Internal Microservices, Polyglot systems, Low latency
              </div>
            </div>
          </div>

          {/* Deep Dive: REST API Design */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Deep Dive: REST API Design</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">Versioning Strategies</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex gap-2">
                      <span className="font-mono bg-white px-2 py-1 rounded text-xs">URI Path</span>
                      <span><code className="text-xs">/v1/users</code> - Most common, easy to cache/route.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-mono bg-white px-2 py-1 rounded text-xs">Query Param</span>
                      <span><code className="text-xs">/users?v=1</code> - Easy, but can be messy.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-mono bg-white px-2 py-1 rounded text-xs">Header</span>
                      <span><code className="text-xs">Accept: application/vnd.myapi.v1+json</code> - "Purest" REST, but harder to test in browser.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-blue-200 pt-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Pagination Patterns</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <span className="font-semibold block mb-1 text-sm">Offset-based</span>
                      <code className="text-xs text-slate-600">GET /users?offset=100&limit=20</code>
                      <p className="mt-2 text-xs text-slate-600">Simple (SQL LIMIT/OFFSET). Slow on large datasets (DB scans offset). Unstable if items added/deleted.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <span className="font-semibold block mb-1 text-sm">Cursor-based (Keyset)</span>
                      <code className="text-xs text-slate-600">GET /users?cursor=user_123&limit=20</code>
                      <p className="mt-2 text-xs text-slate-600">Performant (uses index). Stable results. Harder to implement "Jump to page 10".</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-blue-200 pt-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Idempotency</h4>
                  <p className="text-sm text-slate-700 mb-3">
                    Ensuring that making the same request multiple times produces the same result. Critical for payments and network retries.
                  </p>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs">
                    POST /payments<br/>
                    Idempotency-Key: "unique-uuid-from-client"<br/>
                    ...<br/>
                    // Server checks if key exists. If yes, return saved response.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-teal-900 mb-6">Deep Dive: gRPC & Protocol Buffers</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-teal-900 mb-3">Protocol Buffers (ProtoBuf)</h4>
                  <p className="text-sm text-slate-700 mb-3">
                    A language-neutral, platform-neutral extensible mechanism for serializing structured data. It compiles to a binary format that is significantly smaller and faster to parse than JSON.
                  </p>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <span className="text-purple-400">message</span> <span className="text-yellow-300">Person</span> {"{"}<br/>
                    &nbsp;&nbsp;<span className="text-purple-400">string</span> name = 1;<br/>
                    &nbsp;&nbsp;<span className="text-purple-400">int32</span> id = 2;<br/>
                    &nbsp;&nbsp;<span className="text-purple-400">string</span> email = 3;<br/>
                    {"}"}
                  </div>
                </div>

                <div className="border-t border-teal-200 pt-6">
                  <h4 className="font-semibold text-teal-900 mb-3">HTTP/2 Features</h4>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <div>
                        <span className="font-medium text-slate-900">Multiplexing:</span> Multiple requests/responses sent in parallel over a single TCP connection. No Head-of-Line blocking.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <div>
                        <span className="font-medium text-slate-900">Header Compression (HPACK):</span> Reduces overhead, especially for large headers (auth tokens).
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <div>
                        <span className="font-medium text-slate-900">Streaming:</span> Native support for Unary, Server Streaming, Client Streaming, and Bidirectional Streaming.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: API Gateway */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">
                02
              </span>
              API GATEWAY & AUTHENTICATION
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              The "Front Door" for Microservices
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mb-6">
              Decouples clients from internal service architecture. Handles cross-cutting concerns centrally.
            </p>
          </div>

          <div className="space-y-6 mb-12">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-purple-900 mb-6">API Gateway Pattern</h3>
              <p className="text-slate-700 mb-6">
                Instead of clients calling services directly (Mesh), they call a Gateway. The Gateway handles cross-cutting concerns, decoupling the client from the internal microservices architecture.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-purple-200">
                  <h4 className="font-semibold mb-3 text-sm text-purple-900">Core Responsibilities</h4>
                  <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                    <li>Request Routing (L7)</li>
                    <li>Authentication & Authorization</li>
                    <li>Rate Limiting & Throttling</li>
                    <li>SSL Termination</li>
                    <li>Request/Response Transformation</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-5 border border-purple-200">
                  <h4 className="font-semibold mb-3 text-sm text-purple-900">Backend for Frontend (BFF)</h4>
                  <p className="text-xs text-slate-600 mb-3">
                    A variation where you create separate gateways for different client types (Mobile vs Web vs Public API).
                  </p>
                  <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                    <li>Optimized payloads for mobile</li>
                    <li>Session auth for Web, JWT for Mobile</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-amber-900 mb-6">Rate Limiting Algorithms</h3>
              <p className="text-slate-700 mb-6 text-sm">
                Protecting your services from abuse and spikes
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-amber-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Token Bucket</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Tokens are added at a fixed rate. Requests consume tokens. Allows for <strong>bursts</strong> up to bucket size.
                  </p>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4"></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-amber-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Leaky Bucket</h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Requests enter a queue and are processed at a constant rate. Smooths out bursts completely.
                  </p>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-1/2"></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-amber-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Fixed Window</h4>
                  <p className="text-sm text-slate-600">
                    "100 reqs per minute". Simple, but suffers from "edge case" spikes (e.g., 100 reqs at 12:00:59 and 100 at 12:01:01).
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-amber-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Sliding Window</h4>
                  <p className="text-sm text-slate-600">
                    More accurate. Tracks timestamps or weighted counts to prevent window edge spikes. Higher memory cost.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Simulator */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">⚡</span> Interactive API Gateway Simulator
              </h3>
              <p className="text-slate-700 mb-6">
                Try to overwhelm the gateway or access protected routes without a key. Experiment with rate limiting and authentication.
              </p>
              <ApiGatewaySimulator />
            </div>
          </div>
        </section>

        {/* Section 3: Asynchronous Messaging */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center text-sm">
                03
              </span>
              ASYNCHRONOUS MESSAGING
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Event-Driven Architecture
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mb-6">
              Synchronous (HTTP) chains availability. Async decouples uptime and levels load.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white border-2 border-orange-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">📬</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Message Queues (Point-to-Point)</h3>
              <p className="text-slate-700 text-sm mb-4">
                A producer sends a message to a queue. <strong>One</strong> consumer processes it. Used for decoupling and load leveling.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Load Leveling: Workers process at their own pace
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Reliability: Messages persist if workers are down
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Ordering: FIFO queues guarantee order (with lower throughput)
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t pt-3 mt-4">
                <strong>Examples:</strong> SQS, RabbitMQ, ActiveMQ
              </div>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-2xl p-7 shadow-lg">
              <div className="text-3xl mb-3">📢</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pub/Sub (Fan-out)</h3>
              <p className="text-slate-700 text-sm mb-4">
                A publisher sends a message to a topic. <strong>All</strong> subscribers receive a copy. Used for event-driven architectures.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Decoupling: Publisher doesn't know subscribers
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Scalability: Add new features without changing producer
                </div>
                <div className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                  ✓ Streaming: Kafka allows replaying history
                </div>
              </div>
              <div className="text-xs text-slate-500 border-t pt-3 mt-4">
                <strong>Examples:</strong> SNS, Kafka, Google Pub/Sub
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-red-900 mb-6">Resilience Patterns</h3>
            <p className="text-slate-700 mb-6 text-sm">
              Handling failures in asynchronous systems
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 border border-red-200">
                <h4 className="font-bold text-slate-900 mb-2">Dead Letter Queues (DLQ)</h4>
                <p className="text-sm text-slate-600">
                  If a message fails processing multiple times, move it to a DLQ instead of blocking the queue forever. Allows for manual inspection and debugging of "poison pills".
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-red-200">
                <h4 className="font-bold text-slate-900 mb-2">Exponential Backoff & Jitter</h4>
                <p className="text-sm text-slate-600">
                  Don't retry immediately. Wait 1s, then 2s, then 4s. Add "Jitter" (randomness) to prevent "Thundering Herd" problem where all retries hit at once.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-red-200">
                <h4 className="font-bold text-slate-900 mb-2">Backpressure</h4>
                <p className="text-sm text-slate-600">
                  If consumers are overwhelmed, they must signal producers to slow down (or drop messages). Prevents system collapse under load.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Real-time Communication */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-sm">
                04
              </span>
              REAL-TIME COMMUNICATION
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Beyond Request/Response
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mb-6">
              Users expect instant updates without refreshing. When standard HTTP Request/Response isn't enough.
            </p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gradient-to-r from-cyan-50 to-blue-50 text-slate-900 font-semibold">
                  <tr>
                    <th className="p-4">Technology</th>
                    <th className="p-4">Direction</th>
                    <th className="p-4">Connection</th>
                    <th className="p-4">Best Use Case</th>
                    <th className="p-4">Challenges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-medium">WebSockets</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Bidirectional</span>
                    </td>
                    <td className="p-4">Persistent (TCP)</td>
                    <td className="p-4">Chat, Multiplayer Games, Collab Tools</td>
                    <td className="p-4">Stateful (Hard to scale LBs), Firewall issues</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-medium">Server-Sent Events (SSE)</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Server → Client</span>
                    </td>
                    <td className="p-4">Persistent (HTTP)</td>
                    <td className="p-4">News Feeds, Stock Tickers, Notifications</td>
                    <td className="p-4">Text only, Connection limit (browser)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-medium">Long Polling</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Client → Server</span>
                    </td>
                    <td className="p-4">Request (Held open)</td>
                    <td className="p-4">Legacy support, Low frequency updates</td>
                    <td className="p-4">High server overhead, Latency</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-medium">Webhooks</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">Server → Server</span>
                    </td>
                    <td className="p-4">Discrete HTTP POST</td>
                    <td className="p-4">Event notifications (Stripe, GitHub)</td>
                    <td className="p-4">Requires public endpoint, Security verification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Interactive Components Section */}
        <section className="mb-16">
          <div className="mb-10">
            <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">
                05
              </span>
              INTERACTIVE DEEP DIVES
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Hands-On Learning
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mb-6">
              Explore interactive visualizations and code examples for API design patterns and distributed system communication.
            </p>
          </div>

          <div className="space-y-12">
            {/* API Versioning Strategies */}
            <div className="border-t-4 border-blue-500 pt-8">
              <ApiVersioningStrategies />
            </div>

            {/* Idempotency Deep Dive */}
            <div className="border-t-4 border-green-500 pt-8">
              <IdempotencyDeepDive />
            </div>

            {/* HATEOAS */}
            <div className="border-t-4 border-amber-500 pt-8">
              <HATEOAS />
            </div>

            {/* OpenAPI/Swagger */}
            <div className="border-t-4 border-cyan-500 pt-8">
              <OpenAPISwagger />
            </div>

            {/* Saga Pattern */}
            <div className="border-t-4 border-red-500 pt-8">
              <SagaPattern />
            </div>

            {/* Event Sourcing */}
            <div className="border-t-4 border-indigo-500 pt-8">
              <EventSourcing />
            </div>

            {/* CQRS Pattern */}
            <div className="border-t-4 border-pink-500 pt-8">
              <CQRSPattern />
            </div>

            {/* Outbox Pattern */}
            <div className="border-t-4 border-teal-500 pt-8">
              <OutboxPattern />
            </div>

            {/* API Gateway Simulator */}
            <div className="border-t-4 border-orange-500 pt-8">
              <ApiGatewaySimulator />
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-6">
          <div className="flex justify-between items-center">
            <button onClick={() => nav("/compute-runtime")} className="btn-secondary">
              ← Previous: Compute Runtime
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => nav("/")}
                className="btn-tertiary"
              >
                Home
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
