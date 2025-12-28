import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * StructuredLogging Component
 * Best practices for structured logging, correlation IDs, and trace context propagation
 */
export default function StructuredLogging() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [logLevel, setLogLevel] = useState("info")

  const logLevels = [
    {
      level: "DEBUG",
      color: "bg-gray-100 text-gray-800",
      usage: "Detailed diagnostic information for development",
      when: "Development and troubleshooting",
      retention: "1-7 days",
      volume: "Very High"
    },
    {
      level: "INFO",
      color: "bg-blue-100 text-blue-800",
      usage: "General informational messages about application flow",
      when: "Business events, milestones, state changes",
      retention: "30-90 days",
      volume: "High"
    },
    {
      level: "WARN",
      color: "bg-yellow-100 text-yellow-800",
      usage: "Potentially harmful situations that aren't errors",
      when: "Degraded performance, deprecated usage, retries",
      retention: "90-180 days",
      volume: "Medium"
    },
    {
      level: "ERROR",
      color: "bg-red-100 text-red-800",
      usage: "Error events that don't stop application",
      when: "Handled exceptions, failed operations",
      retention: "180-365 days",
      volume: "Low"
    },
    {
      level: "FATAL",
      color: "bg-red-600 text-white",
      usage: "Critical errors that cause application shutdown",
      when: "Unrecoverable errors, data corruption",
      retention: "1+ year",
      volume: "Very Low"
    }
  ]

  const structuredExamples = {
    javascript: {
      language: "JavaScript / Node.js",
      library: "winston / pino",
      badExample: {
        title: "❌ Unstructured (Bad)",
        code: `console.log('User login failed for user@example.com');
console.log('API call took 2500ms');
console.log('Payment processed: $99.99 for order 12345');`
      },
      goodExample: {
        title: "✅ Structured (Good)",
        code: `logger.info('user_login_failed', {
  email: 'user@example.com',
  reason: 'invalid_password',
  attempt: 3,
  ip: '192.168.1.1',
  correlationId: 'req-abc-123',
  traceId: 'trace-xyz-789'
});

logger.warn('slow_api_call', {
  endpoint: '/api/v1/users',
  duration_ms: 2500,
  threshold_ms: 1000,
  correlationId: 'req-abc-123',
  traceId: 'trace-xyz-789'
});

logger.info('payment_processed', {
  orderId: '12345',
  amount: 99.99,
  currency: 'USD',
  paymentMethod: 'credit_card',
  customerId: 'cust-456',
  correlationId: 'req-abc-123',
  traceId: 'trace-xyz-789'
});`
      }
    },
    python: {
      language: "Python",
      library: "structlog / python-json-logger",
      badExample: {
        title: "❌ Unstructured (Bad)",
        code: `print(f"User {user_id} performed action at {timestamp}")
print(f"Database query slow: {query_time}ms")
print(f"Cache miss for key: {cache_key}")`
      },
      goodExample: {
        title: "✅ Structured (Good)",
        code: `logger.info("user_action", 
  user_id=user_id,
  action="purchase",
  timestamp=datetime.utcnow().isoformat(),
  correlation_id=request.correlation_id,
  trace_id=request.trace_id
)

logger.warning("slow_query",
  query_time_ms=query_time,
  query_type="SELECT",
  table="users",
  threshold_ms=100,
  correlation_id=request.correlation_id
)

logger.info("cache_miss",
  key=cache_key,
  cache_type="redis",
  fallback="database",
  correlation_id=request.correlation_id
)`
      }
    },
    java: {
      language: "Java",
      library: "Logback / Log4j2 with JSON encoder",
      badExample: {
        title: "❌ Unstructured (Bad)",
        code: `log.info("Processing order " + orderId);
log.error("Failed to connect to database: " + e.getMessage());
log.debug("Cache stats: hits=" + hits + " misses=" + misses);`
      },
      goodExample: {
        title: "✅ Structured (Good)",
        code: `StructuredArguments sa = StructuredArguments.kv;

log.info("order_processing",
  sa("orderId", orderId),
  sa("userId", userId),
  sa("totalAmount", totalAmount),
  sa("correlationId", correlationId),
  sa("traceId", traceId)
);

log.error("database_connection_failed",
  sa("error", e.getMessage()),
  sa("host", dbHost),
  sa("retryCount", retryCount),
  sa("correlationId", correlationId),
  e
);

log.debug("cache_statistics",
  sa("hits", hits),
  sa("misses", misses),
  sa("hitRate", hitRate),
  sa("correlationId", correlationId)
);`
      }
    }
  }

  const commonFields = [
    {
      category: "Required (Always Include)",
      fields: [
        { name: "timestamp", type: "ISO8601", example: "2024-01-15T10:30:45.123Z", purpose: "When the event occurred" },
        { name: "level", type: "string", example: "INFO", purpose: "Log severity" },
        { name: "message", type: "string", example: "user_login_success", purpose: "Event type (machine readable)" },
        { name: "service", type: "string", example: "api-gateway", purpose: "Which service generated the log" }
      ]
    },
    {
      category: "Tracing (Highly Recommended)",
      fields: [
        { name: "correlationId", type: "string", example: "req-abc-123", purpose: "Track single request across services" },
        { name: "traceId", type: "string", example: "trace-xyz-789", purpose: "Distributed trace ID (OpenTelemetry)" },
        { name: "spanId", type: "string", example: "span-456", purpose: "Span within a trace" },
        { name: "parentSpanId", type: "string", example: "span-123", purpose: "Parent span for hierarchy" }
      ]
    },
    {
      category: "Context (Include When Relevant)",
      fields: [
        { name: "userId", type: "string", example: "user-123", purpose: "User performing action" },
        { name: "sessionId", type: "string", example: "sess-xyz", purpose: "User session identifier" },
        { name: "requestId", type: "string", example: "req-456", purpose: "Unique request identifier" },
        { name: "environment", type: "string", example: "production", purpose: "Deployment environment" },
        { name: "version", type: "string", example: "v1.2.3", purpose: "Application version" }
      ]
    },
    {
      category: "Technical Details",
      fields: [
        { name: "duration", type: "number", example: "145", purpose: "Operation duration in ms" },
        { name: "statusCode", type: "number", example: "200", purpose: "HTTP/gRPC status code" },
        { name: "error", type: "object", example: "{ type, message, stack }", purpose: "Error details" },
        { name: "metadata", type: "object", example: "{...}", purpose: "Additional context" }
      ]
    }
  ]

  const correlationPatterns = [
    {
      pattern: "API Gateway Injection",
      description: "Generate correlation ID at the edge and propagate through headers",
      implementation: `// API Gateway (Entry Point)
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] 
    || \`req-\${Date.now()}-\${Math.random().toString(36)}\`;
  
  res.setHeader('x-correlation-id', req.correlationId);
  
  // Attach to all logs in this request context
  req.log = logger.child({ correlationId: req.correlationId });
  next();
});`,
      benefits: ["Single entry point", "Consistent ID format", "Easy to implement"]
    },
    {
      pattern: "Async Context Propagation",
      description: "Use async local storage to propagate context without manual passing",
      implementation: `// Node.js AsyncLocalStorage
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

app.use((req, res, next) => {
  const context = {
    correlationId: generateId(),
    traceId: req.headers['x-b3-traceid'],
    userId: req.user?.id
  };
  
  asyncLocalStorage.run(context, () => {
    next();
  });
});

// Access anywhere in the call stack
function logWithContext(message, data) {
  const context = asyncLocalStorage.getStore();
  logger.info(message, { ...context, ...data });
}`,
      benefits: ["No manual propagation", "Works with async code", "Clean API"]
    },
    {
      pattern: "Service Mesh Propagation",
      description: "Let service mesh (Istio, Linkerd) handle trace context automatically",
      implementation: `# Istio automatically injects trace headers:
# - x-request-id
# - x-b3-traceid
# - x-b3-spanid
# - x-b3-parentspanid

# Your service just needs to extract and log them
const traceHeaders = [
  'x-request-id',
  'x-b3-traceid',
  'x-b3-spanid',
  'x-b3-parentspanid'
];

app.use((req, res, next) => {
  const traceContext = {};
  traceHeaders.forEach(header => {
    if (req.headers[header]) {
      traceContext[header] = req.headers[header];
    }
  });
  
  req.log = logger.child(traceContext);
  next();
});`,
      benefits: ["Zero code changes for propagation", "Standardized headers", "Works across languages"]
    }
  ]

  const bestPractices = [
    {
      practice: "Use Semantic Event Names",
      do: "user_login_success, payment_processed, order_created",
      dont: "Success, Done, OK, Step 1 complete",
      reason: "Enables easy filtering and aggregation"
    },
    {
      practice: "Consistent Field Names",
      do: "userId (camelCase) everywhere",
      dont: "user_id, UserID, userid mixed across services",
      reason: "Simplifies cross-service queries"
    },
    {
      practice: "Log at Boundaries",
      do: "Request start/end, service calls, external API calls",
      dont: "Every variable assignment, loop iteration",
      reason: "Balance observability with performance"
    },
    {
      practice: "Include Units in Field Names",
      do: "duration_ms, size_bytes, timeout_seconds",
      dont: "duration, size, timeout",
      reason: "Eliminates ambiguity in dashboards"
    },
    {
      practice: "PII Handling",
      do: "Hash or mask: email: 'u***@example.com'",
      dont: "Log full emails, passwords, credit cards",
      reason: "Compliance (GDPR, CCPA, PCI-DSS)"
    },
    {
      practice: "Use Sampling for High-Volume",
      do: "Log 1% of successful requests, 100% of errors",
      dont: "Log every single request at high QPS",
      reason: "Cost reduction without losing visibility"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">Structured Logging Best Practices</h3>
        <p className="text-lg text-slate-600">
          Learn how to implement structured logging with correlation IDs and trace context propagation
        </p>
      </div>

      {/* Log Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Log Levels Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logLevels.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={item.color}>{item.level}</Badge>
                  <div className="text-sm text-slate-600">Volume: {item.volume}</div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">Usage</div>
                    <div className="text-sm text-slate-600">{item.usage}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-700">When to Use</div>
                    <div className="text-sm text-slate-600">{item.when}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-700">Retention</div>
                    <div className="text-sm text-slate-600">{item.retention}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <AlertDescription>
              <strong>💡 Tip:</strong> Use different retention policies per log level to optimize costs. 
              DEBUG logs can be 1-7 days, while ERROR logs should be kept 6-12 months for analysis.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Structured vs Unstructured Logging</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="java">Java</TabsTrigger>
            </TabsList>

            {Object.entries(structuredExamples).map(([key, data]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <Alert>
                  <AlertDescription>
                    <strong>{data.language}</strong> using {data.library}
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-red-700 mb-3">{data.badExample.title}</h5>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{data.badExample.code}</code>
                    </pre>
                    <div className="mt-3 text-sm text-slate-600">
                      Problems: Hard to parse, inconsistent format, no correlation
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-green-700 mb-3">{data.goodExample.title}</h5>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{data.goodExample.code}</code>
                    </pre>
                    <div className="mt-3 text-sm text-slate-600">
                      Benefits: Machine parseable, consistent fields, traceable
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Common Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Log Fields Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {commonFields.map((category, idx) => (
              <div key={idx}>
                <h5 className="text-lg font-bold text-slate-900 mb-3">{category.category}</h5>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border p-2 text-left text-sm">Field</th>
                        <th className="border p-2 text-left text-sm">Type</th>
                        <th className="border p-2 text-left text-sm">Example</th>
                        <th className="border p-2 text-left text-sm">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.fields.map((field, i) => (
                        <tr key={i}>
                          <td className="border p-2 text-sm font-mono font-semibold">{field.name}</td>
                          <td className="border p-2 text-sm">
                            <Badge variant="outline">{field.type}</Badge>
                          </td>
                          <td className="border p-2 text-sm font-mono text-slate-600">{field.example}</td>
                          <td className="border p-2 text-sm text-slate-600">{field.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Correlation Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Correlation ID Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {correlationPatterns.map((pattern, idx) => (
              <div key={idx} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="text-xl font-bold text-slate-900">{pattern.pattern}</h5>
                    <p className="text-slate-600 mt-1">{pattern.description}</p>
                  </div>
                  <Badge>Pattern {idx + 1}</Badge>
                </div>

                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm mb-4">
                  <code>{pattern.implementation}</code>
                </pre>

                <div>
                  <h6 className="font-semibold text-green-700 mb-2">Benefits</h6>
                  <div className="flex flex-wrap gap-2">
                    {pattern.benefits.map((benefit, i) => (
                      <Badge key={i} variant="outline" className="bg-green-50">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bestPractices.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <h5 className="text-lg font-bold text-slate-900 mb-3">{item.practice}</h5>
                
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-green-800 mb-2">✓ Do</div>
                    <code className="text-sm text-green-900 break-all">{item.do}</code>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-red-800 mb-2">✗ Don't</div>
                    <code className="text-sm text-red-900 break-all">{item.dont}</code>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm font-semibold text-blue-800 mb-1">Why?</div>
                  <div className="text-sm text-blue-900">{item.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Example */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Example: User Login Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm">
            <code>{`// 1. API Gateway - Request received
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "message": "request_received",
  "service": "api-gateway",
  "correlationId": "req-abc-123",
  "traceId": "trace-xyz-789",
  "spanId": "span-001",
  "method": "POST",
  "path": "/api/v1/auth/login",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}

// 2. Auth Service - Validating credentials
{
  "timestamp": "2024-01-15T10:30:45.234Z",
  "level": "INFO",
  "message": "validating_credentials",
  "service": "auth-service",
  "correlationId": "req-abc-123",
  "traceId": "trace-xyz-789",
  "spanId": "span-002",
  "parentSpanId": "span-001",
  "email": "u***@example.com",
  "method": "password"
}

// 3. Database - Query executed
{
  "timestamp": "2024-01-15T10:30:45.345Z",
  "level": "INFO",
  "message": "database_query",
  "service": "auth-service",
  "correlationId": "req-abc-123",
  "traceId": "trace-xyz-789",
  "spanId": "span-003",
  "parentSpanId": "span-002",
  "query_type": "SELECT",
  "table": "users",
  "duration_ms": 45
}

// 4. Auth Service - Success
{
  "timestamp": "2024-01-15T10:30:45.456Z",
  "level": "INFO",
  "message": "user_login_success",
  "service": "auth-service",
  "correlationId": "req-abc-123",
  "traceId": "trace-xyz-789",
  "spanId": "span-002",
  "userId": "user-123",
  "sessionId": "sess-456",
  "duration_ms": 222
}

// 5. API Gateway - Response sent
{
  "timestamp": "2024-01-15T10:30:45.567Z",
  "level": "INFO",
  "message": "request_completed",
  "service": "api-gateway",
  "correlationId": "req-abc-123",
  "traceId": "trace-xyz-789",
  "spanId": "span-001",
  "statusCode": 200,
  "duration_ms": 444
}`}</code>
          </pre>

          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <AlertDescription>
              <strong>🔍 Notice:</strong> All logs share the same correlationId and traceId, 
              making it easy to trace the entire request flow across multiple services.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
