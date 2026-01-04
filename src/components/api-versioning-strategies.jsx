import { useState } from "react"
import { Code2, GitBranch, Settings, CheckCircle, XCircle, ArrowRight } from "lucide-react"

export default function ApiVersioningStrategies() {
  const [selectedStrategy, setSelectedStrategy] = useState("uri")

  const strategies = {
    uri: {
      icon: <GitBranch className="w-6 h-6" />,
      title: "URI Versioning",
      description: "Version embedded in the URL path",
      examples: [
        {
          label: "REST API",
          code: `GET /api/v1/users/123
GET /api/v2/users/123

# Version in subdomain
GET https://v1.api.example.com/users/123
GET https://v2.api.example.com/users/123`
        },
        {
          label: "Router Configuration",
          code: `// Express.js example
const v1Router = express.Router()
const v2Router = express.Router()

v1Router.get('/users/:id', getUserV1)
v2Router.get('/users/:id', getUserV2)

app.use('/api/v1', v1Router)
app.use('/api/v2', v2Router)`
        }
      ],
      pros: [
        "Very clear and visible",
        "Easy to route to different implementations",
        "Simple for clients to specify version",
        "Good for public APIs",
        "Browser-friendly (can bookmark specific versions)"
      ],
      cons: [
        "Changes the resource URI (breaks REST principles)",
        "Client must update URLs when migrating",
        "Can lead to URL sprawl",
        "Harder to deprecate old versions",
        "Cache invalidation challenges"
      ],
      useCases: [
        "Public REST APIs (Twitter, GitHub, Stripe)",
        "When breaking changes are frequent",
        "Multi-tenant SaaS platforms",
        "APIs consumed by diverse clients"
      ],
      migration: {
        title: "Migration Strategy",
        steps: [
          "Deploy v2 alongside v1 (same codebase)",
          "Announce deprecation timeline (6-12 months)",
          "Provide migration guide with examples",
          "Monitor v1 usage metrics",
          "Send notifications to heavy users",
          "Sunset v1 after grace period"
        ],
        code: `// Shared logic pattern
class UserService {
  getUser(id, version) {
    const user = this.fetchUser(id)
    
    if (version === 'v1') {
      return this.transformV1(user)
    }
    return this.transformV2(user)
  }
}`
      }
    },
    header: {
      icon: <Settings className="w-6 h-6" />,
      title: "Header Versioning",
      description: "Version specified in HTTP headers",
      examples: [
        {
          label: "Custom Header",
          code: `GET /api/users/123 HTTP/1.1
Host: api.example.com
API-Version: 2

# Or using Accept header
GET /api/users/123 HTTP/1.1
Accept: application/vnd.example.v2+json`
        },
        {
          label: "Middleware Implementation",
          code: `// Express middleware
app.use((req, res, next) => {
  const version = req.headers['api-version'] || '1'
  req.apiVersion = version
  next()
})

app.get('/api/users/:id', (req, res) => {
  if (req.apiVersion === '2') {
    return handleV2(req, res)
  }
  return handleV1(req, res)
})`
        }
      ],
      pros: [
        "URI remains clean and RESTful",
        "Easy to add new versions without changing URLs",
        "Version not visible in browser address bar (security)",
        "Follows HTTP standards (content negotiation)",
        "Can version APIs independently"
      ],
      cons: [
        "Less discoverable (not visible in URL)",
        "Harder to test in browser",
        "Requires header inspection tools",
        "Client must remember to set headers",
        "Documentation overhead"
      ],
      useCases: [
        "Internal microservices",
        "APIs with frequent non-breaking changes",
        "When URI stability is critical",
        "RESTful purists"
      ],
      migration: {
        title: "Migration Strategy",
        steps: [
          "Add header parsing middleware",
          "Default to latest version if header missing",
          "Log version usage for analytics",
          "Gradually increase default version",
          "Require explicit version header",
          "Remove old version handlers"
        ],
        code: `// Version negotiation
function getApiVersion(req) {
  const header = req.headers['api-version']
  const accept = req.headers['accept']
  
  // Parse from Accept header
  const match = accept?.match(/v(\\d+)/)
  const version = header || match?.[1] || 'latest'
  
  return validateVersion(version)
}`
      }
    },
    query: {
      icon: <Code2 className="w-6 h-6" />,
      title: "Query Parameter",
      description: "Version passed as URL parameter",
      examples: [
        {
          label: "Query String",
          code: `GET /api/users/123?version=2
GET /api/users/123?api-version=2
GET /api/users/123?v=2

# Optional parameter (defaults to latest)
GET /api/users/123  # Uses latest version`
        },
        {
          label: "Controller Logic",
          code: `// Spring Boot example
@GetMapping("/users/{id}")
public User getUser(
  @PathVariable Long id,
  @RequestParam(defaultValue = "1") int version
) {
  if (version == 2) {
    return userServiceV2.getUser(id)
  }
  return userServiceV1.getUser(id)
}`
        }
      ],
      pros: [
        "Keeps URI clean (main path unchanged)",
        "Easy to make version optional",
        "Simple for clients to change versions",
        "Good for gradual migrations",
        "Easy to test in browser"
      ],
      cons: [
        "Can be ignored by clients (if optional)",
        "Query params often not cached properly",
        "Feels like a workaround",
        "May conflict with other parameters",
        "Not suitable for POST/PUT bodies"
      ],
      useCases: [
        "Temporary versioning during migration",
        "Feature flags disguised as versions",
        "A/B testing different API behaviors",
        "Backward compatibility shims"
      ],
      migration: {
        title: "Migration Strategy",
        steps: [
          "Make version parameter optional (default to v1)",
          "Introduce v2 as opt-in via ?version=2",
          "Track adoption metrics",
          "Change default to v2",
          "Make version parameter required",
          "Remove v1 code paths"
        ],
        code: `// Graceful defaults
function getRequestedVersion(req) {
  const v = req.query.version || req.query.v
  
  if (!v) {
    // Log for analytics
    analytics.track('api_default_version')
    return 'latest'
  }
  
  return v
}`
      }
    },
    contentNegotiation: {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Content Negotiation",
      description: "Version via Accept/Content-Type headers",
      examples: [
        {
          label: "Media Type Versioning",
          code: `GET /api/users/123 HTTP/1.1
Accept: application/vnd.company.user-v2+json

# Response
HTTP/1.1 200 OK
Content-Type: application/vnd.company.user-v2+json

{
  "id": 123,
  "name": "Alice",
  "email": "alice@example.com"
}`
        },
        {
          label: "Server Implementation",
          code: `// ASP.NET Core example
[ApiController]
[Route("api/users")]
public class UsersController {
  
  [HttpGet("{id}")]
  [Produces("application/vnd.company.user-v1+json")]
  public UserV1 GetUserV1(int id) {
    return userService.GetUserV1(id);
  }
  
  [HttpGet("{id}")]
  [Produces("application/vnd.company.user-v2+json")]
  public UserV2 GetUserV2(int id) {
    return userService.GetUserV2(id);
  }
}`
        }
      ],
      pros: [
        "True REST implementation (HATEOAS)",
        "Follows HTTP specification exactly",
        "Supports multiple formats (JSON, XML, Protobuf)",
        "Resource URI never changes",
        "Enables sophisticated content negotiation"
      ],
      cons: [
        "Complex to implement",
        "Difficult for clients to use",
        "Poor developer experience",
        "Not well understood by many developers",
        "Overkill for most APIs"
      ],
      useCases: [
        "Hypermedia-driven APIs",
        "APIs serving multiple formats",
        "Academic/research projects",
        "When absolute REST purity matters"
      ],
      migration: {
        title: "Migration Strategy",
        steps: [
          "Define custom media types for each version",
          "Implement content negotiation middleware",
          "Default to latest media type",
          "Document media types in API docs",
          "Support legacy media types indefinitely",
          "Version media types, not resources"
        ],
        code: `// Content negotiation
app.use((req, res, next) => {
  const accept = req.headers.accept
  
  if (accept.includes('v2+json')) {
    req.apiVersion = 2
  } else if (accept.includes('v1+json')) {
    req.apiVersion = 1
  } else {
    req.apiVersion = 'latest'
  }
  next()
})`
      }
    }
  }

  const currentStrategy = strategies[selectedStrategy]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          API Versioning Strategies
        </h3>
        <p className="text-lg text-slate-600 mb-6">
          How to evolve your API without breaking existing clients. Choose the right strategy based on your use case.
        </p>
      </div>

      {/* Strategy Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(strategies).map(([key, strategy]) => (
          <button
            key={key}
            onClick={() => setSelectedStrategy(key)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedStrategy === key
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className={`mb-2 ${selectedStrategy === key ? "text-blue-600" : "text-slate-600"}`}>
              {strategy.icon}
            </div>
            <div className="font-bold text-sm text-slate-900">{strategy.title}</div>
          </button>
        ))}
      </div>

      {/* Strategy Details */}
      <div className=" from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-blue-600 mt-1">{currentStrategy.icon}</div>
          <div>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">
              {currentStrategy.title}
            </h4>
            <p className="text-slate-700">{currentStrategy.description}</p>
          </div>
        </div>

        {/* Code Examples */}
        <div className="space-y-4 mb-6">
          {currentStrategy.examples.map((example, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-sm font-semibold text-blue-700 mb-2">{example.label}</div>
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{example.code}</code>
              </pre>
            </div>
          ))}
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h5 className="font-bold text-slate-900">Pros</h5>
            </div>
            <ul className="space-y-2">
              {currentStrategy.pros.map((pro, idx) => (
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
              {currentStrategy.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-red-600 mt-1">-</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-xl p-6 border border-blue-200 mb-6">
          <h5 className="font-bold text-slate-900 mb-3">Best Use Cases</h5>
          <div className="grid md:grid-cols-2 gap-3">
            {currentStrategy.useCases.map((useCase, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>{useCase}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Migration Strategy */}
        <div className=" from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h5 className="font-bold text-slate-900 mb-4">{currentStrategy.migration.title}</h5>
          
          <div className="space-y-3 mb-4">
            {currentStrategy.migration.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="text-sm text-slate-700 pt-0.5">{step}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-sm font-semibold text-purple-700 mb-2">Implementation Example</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
              <code>{currentStrategy.migration.code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Comparison Summary */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Quick Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-bold text-slate-700">Aspect</th>
                <th className="text-left py-3 px-4 font-bold text-slate-700">URI</th>
                <th className="text-left py-3 px-4 font-bold text-slate-700">Header</th>
                <th className="text-left py-3 px-4 font-bold text-slate-700">Query</th>
                <th className="text-left py-3 px-4 font-bold text-slate-700">Content Neg.</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-semibold">Visibility</td>
                <td className="py-3 px-4">🟢 High</td>
                <td className="py-3 px-4">🔴 Low</td>
                <td className="py-3 px-4">🟡 Medium</td>
                <td className="py-3 px-4">🔴 Low</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-semibold">Simplicity</td>
                <td className="py-3 px-4">🟢 Easy</td>
                <td className="py-3 px-4">🟡 Medium</td>
                <td className="py-3 px-4">🟢 Easy</td>
                <td className="py-3 px-4">🔴 Hard</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-semibold">REST Purity</td>
                <td className="py-3 px-4">🔴 Breaks URI</td>
                <td className="py-3 px-4">🟢 Clean</td>
                <td className="py-3 px-4">🟡 OK</td>
                <td className="py-3 px-4">🟢 Perfect</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-semibold">Caching</td>
                <td className="py-3 px-4">🟢 Good</td>
                <td className="py-3 px-4">🟢 Good</td>
                <td className="py-3 px-4">🔴 Poor</td>
                <td className="py-3 px-4">🟡 OK</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 font-semibold">Browser Test</td>
                <td className="py-3 px-4">🟢 Easy</td>
                <td className="py-3 px-4">🔴 Need tools</td>
                <td className="py-3 px-4">🟢 Easy</td>
                <td className="py-3 px-4">🔴 Need tools</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Popularity</td>
                <td className="py-3 px-4">🟢 Very Common</td>
                <td className="py-3 px-4">🟡 Growing</td>
                <td className="py-3 px-4">🔴 Rare</td>
                <td className="py-3 px-4">🔴 Rare</td>
              </tr>
            </tbody>
          </table>
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
              Q: "How would you version an API?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "I'd use URI versioning (/v1, /v2) for public APIs because it's the most visible and explicit. For internal microservices, I'd consider header versioning to keep URIs clean. The key is to have a clear deprecation policy—typically 6-12 months notice before removing old versions. I'd also implement version analytics to understand usage before deprecation."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "When should you introduce a new API version?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Only for breaking changes—removing fields, changing data types, changing business logic. Additive changes (new optional fields, new endpoints) don't require version bumps. Follow semantic versioning principles: v1.0 → v1.1 (additions) → v2.0 (breaking changes)."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "How do you handle clients still using old versions?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Set a deprecation timeline, monitor usage metrics, send proactive notifications to API consumers, provide clear migration guides, and consider a grace period where both versions run. For critical clients, offer dedicated support for migration. Eventually, old versions must sunset to avoid maintenance burden."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
