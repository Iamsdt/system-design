import { useState } from "react"
import { Link2, ArrowRight, CheckCircle, XCircle, ExternalLink, Star } from "lucide-react"

export default function HATEOAS() {
  const [selectedLevel, setSelectedLevel] = useState("level3")
  const [currentResource, setCurrentResource] = useState("order")

  const maturityLevels = {
    level0: {
      level: "Level 0",
      name: "The Swamp of POX",
      description: "HTTP as transport only. Single URI, usually POST for everything.",
      example: `POST /api
Content-Type: application/xml

<request>
  <method>getUser</method>
  <params>
    <userId>123</userId>
  </params>
</request>`,
      response: `<response>
  <user>
    <id>123</id>
    <name>John Doe</name>
  </user>
</response>`,
      characteristics: [
        "Single endpoint for all operations",
        "HTTP used only for transport",
        "No HTTP methods semantics",
        "No HTTP status codes",
        "RPC-style (SOAP, XML-RPC)"
      ],
      verdict: "Not RESTful"
    },
    level1: {
      level: "Level 1",
      name: "Resources",
      description: "Multiple URIs but single HTTP method. Individual resources have unique endpoints.",
      example: `POST /api/users/123
POST /api/orders/456
POST /api/products/789

{
  "method": "get",
  "userId": "123"
}`,
      response: `{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com"
}`,
      characteristics: [
        "Multiple resource endpoints",
        "Still single verb (usually POST)",
        "Resources identified by URI",
        "Some structure to API",
        "Better than Level 0"
      ],
      verdict: "Barely RESTful"
    },
    level2: {
      level: "Level 2",
      name: "HTTP Verbs",
      description: "Proper use of HTTP methods (GET, POST, PUT, DELETE) and status codes.",
      example: `GET /api/users/123
DELETE /api/users/123
PUT /api/users/123
POST /api/users

// Request
PUT /api/users/123
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}`,
      response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "123",
  "name": "John Smith",
  "email": "john.smith@example.com"
}`,
      characteristics: [
        "GET for retrieval (idempotent, safe)",
        "POST for creation",
        "PUT for updates (idempotent)",
        "DELETE for removal (idempotent)",
        "Proper HTTP status codes (200, 201, 404, 500)",
        "Content negotiation headers"
      ],
      verdict: "Most REST APIs"
    },
    level3: {
      level: "Level 3",
      name: "Hypermedia Controls (HATEOAS)",
      description: "API responses include links to related resources. Client discovers actions dynamically.",
      example: `GET /api/orders/789
Accept: application/json`,
      response: `{
  "id": "789",
  "status": "pending",
  "total": 99.99,
  "items": [
    { "productId": "123", "quantity": 2, "price": 49.99 }
  ],
  "_links": {
    "self": { "href": "/api/orders/789" },
    "cancel": {
      "href": "/api/orders/789/cancel",
      "method": "POST",
      "title": "Cancel this order"
    },
    "payment": {
      "href": "/api/orders/789/payment",
      "method": "POST",
      "title": "Submit payment"
    },
    "customer": { "href": "/api/customers/456" },
    "items": { "href": "/api/orders/789/items" }
  }
}`,
      characteristics: [
        "Responses include hyperlinks",
        "Clients discover actions from links",
        "API self-documenting",
        "Server controls available actions",
        "Loose coupling between client/server",
        "State-driven workflows"
      ],
      verdict: "True REST"
    }
  }

  const resourceExamples = {
    order: {
      name: "Order Resource",
      status: "pending",
      data: {
        id: "789",
        status: "pending",
        total: 99.99,
        createdAt: "2024-01-15T10:30:00Z",
        customer: {
          id: "456",
          name: "John Doe"
        }
      },
      links: {
        self: { href: "/api/orders/789", method: "GET", description: "This order" },
        cancel: { href: "/api/orders/789/cancel", method: "POST", description: "Cancel order", available: true },
        payment: { href: "/api/orders/789/payment", method: "POST", description: "Submit payment", available: true },
        customer: { href: "/api/customers/456", method: "GET", description: "View customer" },
        items: { href: "/api/orders/789/items", method: "GET", description: "Order items" }
      }
    },
    orderPaid: {
      name: "Order Resource (After Payment)",
      status: "paid",
      data: {
        id: "789",
        status: "paid",
        total: 99.99,
        paidAt: "2024-01-15T10:35:00Z",
        customer: {
          id: "456",
          name: "John Doe"
        }
      },
      links: {
        self: { href: "/api/orders/789", method: "GET", description: "This order" },
        cancel: { href: "/api/orders/789/cancel", method: "POST", description: "Cancel order", available: false, reason: "Cannot cancel paid order" },
        refund: { href: "/api/orders/789/refund", method: "POST", description: "Request refund", available: true },
        shipment: { href: "/api/orders/789/shipment", method: "POST", description: "Create shipment", available: true },
        invoice: { href: "/api/orders/789/invoice", method: "GET", description: "Download invoice" },
        customer: { href: "/api/customers/456", method: "GET", description: "View customer" }
      }
    },
    orderShipped: {
      name: "Order Resource (Shipped)",
      status: "shipped",
      data: {
        id: "789",
        status: "shipped",
        total: 99.99,
        shippedAt: "2024-01-16T14:00:00Z",
        trackingNumber: "1Z999AA10123456784"
      },
      links: {
        self: { href: "/api/orders/789", method: "GET", description: "This order" },
        tracking: { href: "/api/shipments/track/1Z999AA10123456784", method: "GET", description: "Track shipment" },
        return: { href: "/api/orders/789/return", method: "POST", description: "Initiate return", available: true },
        invoice: { href: "/api/orders/789/invoice", method: "GET", description: "Download invoice" }
      }
    }
  }

  const handleResourceTransition = (newState) => {
    setCurrentResource(newState)
  }

  const currentExample = maturityLevels[selectedLevel]
  const currentResourceData = resourceExamples[currentResource]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          HATEOAS & Richardson Maturity Model
        </h3>
        <p className="text-lg text-slate-600 mb-6">
          Hypermedia As The Engine Of Application State. How your API guides clients through available actions using links.
        </p>
      </div>

      {/* What is HATEOAS? */}
      <div className=" from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="flex items-start gap-4 mb-6">
          <Link2 className="w-8 h-8 text-blue-600 mt-1" />
          <div>
            <h4 className="text-2xl font-bold text-slate-900 mb-3">The Core Idea</h4>
            <p className="text-slate-700 mb-4">
              Instead of hardcoding endpoints in your client, the <span className="font-bold">server tells you what actions are possible</span> through hypermedia links in API responses.
            </p>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-red-700 mb-2 text-sm">❌ Without HATEOAS</h5>
                  <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`// Client must know all URLs
const order = await fetch('/api/orders/789')

// Hardcoded logic
if (order.status === 'pending') {
  // Can cancel
  await fetch('/api/orders/789/cancel', {
    method: 'POST'
  })
}

// Client breaks when API changes`}
                  </pre>
                </div>
                <div>
                  <h5 className="font-bold text-green-700 mb-2 text-sm">✓ With HATEOAS</h5>
                  <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`// Server tells client what's possible
const order = await fetch('/api/orders/789')

// Dynamic actions from server
if (order._links.cancel) {
  await fetch(order._links.cancel.href, {
    method: order._links.cancel.method
  })
}

// Client adapts to server changes`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Richardson Maturity Model */}
      <div>
        <h4 className="text-2xl font-bold text-slate-900 mb-6">Richardson Maturity Model</h4>
        <p className="text-slate-600 mb-6">
          A model to measure how RESTful your API is. Developed by Leonard Richardson.
        </p>

        {/* Level Selector */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {Object.entries(maturityLevels).map(([key, level]) => (
            <button
              key={key}
              onClick={() => setSelectedLevel(key)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedLevel === key
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className={`text-xs font-bold mb-2 ${selectedLevel === key ? "text-blue-600" : "text-slate-500"}`}>
                {level.level}
              </div>
              <div className="font-bold text-lg text-slate-900 mb-2">{level.name}</div>
              <div className="text-sm text-slate-600 mb-3">{level.description}</div>
              <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                key === 'level3'
                  ? 'bg-green-100 text-green-700'
                  : key === 'level2'
                  ? 'bg-blue-100 text-blue-700'
                  : key === 'level1'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {level.verdict}
              </div>
            </button>
          ))}
        </div>

        {/* Level Details */}
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
          <h5 className="text-xl font-bold text-slate-900 mb-4">
            {currentExample.level}: {currentExample.name}
          </h5>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Request */}
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Request Example</div>
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{currentExample.example}</code>
              </pre>
            </div>

            {/* Response */}
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Response Example</div>
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{currentExample.response}</code>
              </pre>
            </div>
          </div>

          {/* Characteristics */}
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-3">Characteristics</div>
            <div className="grid md:grid-cols-2 gap-3">
              {currentExample.characteristics.map((char, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{char}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive State Machine */}
      <div className=" from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6">
          Interactive Example: Order State Machine
        </h4>
        <p className="text-slate-600 mb-6">
          Watch how available actions change based on order state. The <code className="bg-purple-100 px-2 py-1 rounded text-xs">_links</code> object guides the client.
        </p>

        {/* State Selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleResourceTransition('order')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentResource === 'order'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
            }`}
          >
            Pending Order
          </button>
          <button
            onClick={() => handleResourceTransition('orderPaid')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentResource === 'orderPaid'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
            }`}
          >
            Paid Order
          </button>
          <button
            onClick={() => handleResourceTransition('orderShipped')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentResource === 'orderShipped'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
            }`}
          >
            Shipped Order
          </button>
        </div>

        {/* Resource Visualization */}
        <div className="bg-white rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-xl font-bold text-slate-900">{currentResourceData.name}</h5>
              <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mt-2 ${
                currentResourceData.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : currentResourceData.status === 'paid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                Status: {currentResourceData.status}
              </div>
            </div>
          </div>

          {/* Resource Data */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="text-sm font-semibold text-slate-700 mb-2">Resource Data</div>
            <pre className="text-xs text-slate-700">
              <code>{JSON.stringify(currentResourceData.data, null, 2)}</code>
            </pre>
          </div>

          {/* Available Links */}
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-3">Available Actions (_links)</div>
            <div className="space-y-3">
              {Object.entries(currentResourceData.links).map(([rel, link]) => (
                <div
                  key={rel}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    link.available === false
                      ? 'bg-slate-50 border-slate-200 opacity-50'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {link.available === false ? (
                      <XCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-sm">{rel}</div>
                      <div className="text-xs text-slate-600">{link.description}</div>
                      {link.reason && (
                        <div className="text-xs text-red-600 mt-1 italic">{link.reason}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-500 mb-1">{link.method}</div>
                    <div className="text-xs font-mono text-blue-600">{link.href}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-purple-100 rounded-lg p-4 mt-4">
          <div className="text-sm text-purple-900">
            <span className="font-bold">Key Insight:</span> The client doesn't need to know business rules!
            The server controls which actions are available by including or excluding links based on current state.
            When an order is paid, the "cancel" link disappears but "refund" appears.
          </div>
        </div>
      </div>

      {/* Link Relation Types */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Standard Link Relation Types</h4>
        <p className="text-sm text-slate-600 mb-6">
          IANA maintains a registry of standard link relations. Using these makes your API more discoverable.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="font-bold text-slate-900 mb-2 text-sm">self</div>
            <div className="text-xs text-slate-600 mb-2">Link to the current resource</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded">
              <code>{`"self": { "href": "/api/orders/789" }`}</code>
            </pre>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="font-bold text-slate-900 mb-2 text-sm">next / prev</div>
            <div className="text-xs text-slate-600 mb-2">Pagination links</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded">
              <code>{`"next": { "href": "/api/orders?page=2" }`}</code>
            </pre>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="font-bold text-slate-900 mb-2 text-sm">related</div>
            <div className="text-xs text-slate-600 mb-2">Related resource</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded">
              <code>{`"customer": { "href": "/api/customers/456" }`}</code>
            </pre>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="font-bold text-slate-900 mb-2 text-sm">edit</div>
            <div className="text-xs text-slate-600 mb-2">Edit this resource</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded">
              <code>{`"edit": { "href": "/api/orders/789", "method": "PUT" }`}</code>
            </pre>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="font-bold text-slate-900 mb-2 text-sm">collection</div>
            <div className="text-xs text-slate-600 mb-2">Link to parent collection</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded">
              <code>{`"collection": { "href": "/api/orders" }`}</code>
            </pre>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="font-bold text-slate-900 mb-2 text-sm">describedby</div>
            <div className="text-xs text-slate-600 mb-2">Link to schema/documentation</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded">
              <code>{`"describedby": { "href": "/api/schema/order" }`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Pros and Cons */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h5 className="font-bold text-slate-900 text-lg">Benefits of HATEOAS</h5>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Star className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Loose Coupling:</span> Client doesn't hardcode URLs. Server can change endpoints without breaking clients.
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Star className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Discoverability:</span> API is self-documenting. Client can explore available actions.
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Star className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">State Management:</span> Server controls workflow. Business rules enforced by presence/absence of links.
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Star className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Versioning Friendly:</span> Add new links without breaking old clients.
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
            <h5 className="font-bold text-slate-900 text-lg">Challenges</h5>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Complexity:</span> More complex to implement than simple REST.
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Payload Size:</span> Responses larger due to embedded links.
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Client Complexity:</span> Clients must be smart enough to follow links dynamically.
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Tooling:</span> Less tooling support compared to OpenAPI/Swagger.
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold">Rare in Practice:</span> Most APIs stop at Level 2 (HTTP verbs).
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Real-World Examples */}
      <div className=" from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Real-World Examples</h4>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <h5 className="font-bold text-slate-900">GitHub API</h5>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Level 3 API with comprehensive hypermedia links
            </p>
            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
{`GET https://api.github.com/repos/facebook/react

{
  "name": "react",
  "full_name": "facebook/react",
  "url": "https://api.github.com/repos/facebook/react",
  "forks_url": "https://api.github.com/repos/facebook/react/forks",
  "keys_url": "https://api.github.com/repos/facebook/react/keys{/key_id}",
  "issues_url": "https://api.github.com/repos/facebook/react/issues{/number}",
  "pulls_url": "https://api.github.com/repos/facebook/react/pulls{/number}"
}`}
            </pre>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <h5 className="font-bold text-slate-900">PayPal API</h5>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Uses HAL (Hypertext Application Language) format
            </p>
            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
{`{
  "id": "PAY-123",
  "state": "created",
  "links": [
    {
      "href": "https://api.paypal.com/v1/payments/payment/PAY-123",
      "rel": "self",
      "method": "GET"
    },
    {
      "href": "https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-123",
      "rel": "approval_url",
      "method": "REDIRECT"
    },
    {
      "href": "https://api.paypal.com/v1/payments/payment/PAY-123/execute",
      "rel": "execute",
      "method": "POST"
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div className=" from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">When to Use HATEOAS</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-bold text-green-700 mb-3 text-sm">✓ Good Fit</h5>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Complex workflows with state transitions (order processing, approval flows)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Public APIs where clients are unknown/untrusted</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Long-lived APIs that need to evolve without breaking clients</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>When business logic changes frequently</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-red-700 mb-3 text-sm">✗ Overkill</h5>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Simple CRUD APIs (just GET/POST/PUT/DELETE)</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Internal microservices (you control both client and server)</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>Mobile/SPA apps needing optimal payload sizes</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>When GraphQL/gRPC is better fit</span>
              </li>
            </ul>
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
              Q: "What is HATEOAS and why would you use it?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "HATEOAS means the server includes links in responses showing what actions are available. Like a website where you click links instead of typing URLs. Benefits: clients don't hardcode URLs, server controls workflow, API self-documenting. Downsides: complexity, larger payloads, rare in practice. Most APIs stop at Richardson Level 2 (HTTP verbs + status codes). I'd use HATEOAS for complex workflows like payment processing where available actions depend on state, but not for simple CRUD APIs."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "What's the Richardson Maturity Model?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "A model measuring how RESTful an API is. Level 0 (POX): single endpoint, like SOAP. Level 1 (Resources): multiple URIs. Level 2 (HTTP Verbs): proper GET/POST/PUT/DELETE + status codes—this is where most REST APIs are. Level 3 (HATEOAS): responses include hypermedia links. True REST requires Level 3, but Level 2 is the practical sweet spot for most APIs."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "How would you design an order API with HATEOAS?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Start with resource data, then add _links object. For a pending order, include links: cancel (POST), pay (POST), customer (GET), items (GET). After payment, remove cancel link, add refund and shipment links. After shipping, remove refund, add tracking and return links. The client checks link presence to enable UI buttons. Server enforces business rules by including/excluding links based on state. If order can't be cancelled, don't include the cancel link."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
