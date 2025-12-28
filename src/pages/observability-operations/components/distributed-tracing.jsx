import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * DistributedTracing Component
 * Deep dive into Jaeger, Zipkin, AWS X-Ray, sampling strategies, and performance impact
 */
export default function DistributedTracing() {
  const [selectedTool, setSelectedTool] = useState("jaeger")
  const [samplingStrategy, setSamplingStrategy] = useState("probabilistic")

  const tracingTools = {
    jaeger: {
      name: "Jaeger",
      organization: "CNCF (Cloud Native Computing Foundation)",
      description: "Open-source distributed tracing platform for monitoring microservices",
      architecture: {
        components: [
          { name: "Jaeger Client", role: "Instrumentation libraries", tech: "Go, Java, Node.js, Python, C++, C#" },
          { name: "Jaeger Agent", role: "Network daemon that listens for spans", tech: "Runs on each host" },
          { name: "Jaeger Collector", role: "Receives traces and writes to storage", tech: "Scalable, stateless" },
          { name: "Storage Backend", role: "Stores trace data", tech: "Cassandra, Elasticsearch, Kafka" },
          { name: "Jaeger Query", role: "API and UI for retrieving traces", tech: "gRPC, HTTP" },
          { name: "Jaeger UI", role: "Web interface for viewing traces", tech: "React" }
        ]
      },
      features: [
        "OpenTelemetry native support",
        "Adaptive sampling",
        "Service dependency analysis",
        "Root cause analysis",
        "Performance/latency optimization",
        "Distributed context propagation"
      ],
      pros: ["CNCF graduated project", "Cloud-native friendly", "Kubernetes operator", "Excellent documentation"],
      cons: ["Requires storage setup", "Can be resource intensive", "Learning curve"],
      bestFor: ["Kubernetes environments", "Cloud-native apps", "OpenTelemetry users", "Large-scale systems"]
    },
    zipkin: {
      name: "Zipkin",
      organization: "OpenZipkin",
      description: "Distributed tracing system for gathering timing data needed to troubleshoot latency problems",
      architecture: {
        components: [
          { name: "Instrumented Libraries", role: "Collect trace data", tech: "Multiple language libraries" },
          { name: "Transport", role: "Send spans to Zipkin", tech: "HTTP, Kafka, RabbitMQ" },
          { name: "Collector", role: "Validates and stores spans", tech: "Optional: Kafka, RabbitMQ" },
          { name: "Storage", role: "Stores trace data", tech: "In-memory, MySQL, Cassandra, Elasticsearch" },
          { name: "API", role: "Query interface", tech: "RESTful JSON API" },
          { name: "UI", role: "Web interface", tech: "React-based" }
        ]
      },
      features: [
        "Simple deployment model",
        "Low overhead instrumentation",
        "Service dependency diagrams",
        "Trace search and visualization",
        "Configurable storage backends",
        "Docker support"
      ],
      pros: ["Mature and stable", "Simple to set up", "Low resource requirements", "Good community"],
      cons: ["Less feature-rich than Jaeger", "Limited sampling options", "Basic UI"],
      bestFor: ["Small to medium deployments", "Simple tracing needs", "Quick setup", "Resource-constrained environments"]
    },
    xray: {
      name: "AWS X-Ray",
      organization: "Amazon Web Services",
      description: "Fully managed distributed tracing service for AWS applications",
      architecture: {
        components: [
          { name: "X-Ray SDK", role: "Instrument applications", tech: "Java, Node.js, Python, Go, .NET, Ruby" },
          { name: "X-Ray Daemon", role: "Collect and forward traces", tech: "Runs on EC2/ECS/Lambda" },
          { name: "X-Ray Service", role: "Store and process traces", tech: "Fully managed" },
          { name: "Service Map", role: "Visualize dependencies", tech: "Automatic generation" },
          { name: "Analytics", role: "Query and analyze traces", tech: "Console and API" },
          { name: "Insights", role: "Detect anomalies", tech: "ML-powered" }
        ]
      },
      features: [
        "Deep AWS service integration",
        "Automatic service map generation",
        "Anomaly detection with ML",
        "Group traces by annotations",
        "Integration with CloudWatch",
        "Managed infrastructure"
      ],
      pros: ["Zero infrastructure management", "Native AWS integration", "Pay-per-use", "Automatic instrumentation for some services"],
      cons: ["AWS lock-in", "Cost at scale", "Limited customization", "Vendor-specific format"],
      bestFor: ["AWS-heavy workloads", "Serverless applications", "Quick AWS setup", "CloudWatch users"]
    }
  }

  const samplingStrategies = {
    probabilistic: {
      name: "Probabilistic Sampling",
      description: "Sample a fixed percentage of all traces",
      example: "Sample 10% of all requests",
      implementation: `// OpenTelemetry SDK
const { ParentBasedSampler, TraceIdRatioBasedSampler } = require('@opentelemetry/sdk-trace-base');

const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBasedSampler(0.1), // 10% sampling
});`,
      pros: ["Simple to implement", "Predictable cost", "Statistically representative"],
      cons: ["May miss rare errors", "Fixed overhead", "Not adaptive"],
      useCases: ["High-volume production", "Cost-sensitive environments", "Uniform traffic patterns"]
    },
    rateLimit: {
      name: "Rate Limiting Sampling",
      description: "Sample up to N traces per second per service",
      example: "Maximum 10 traces/second per service",
      implementation: `// Jaeger configuration
{
  "service_strategies": {
    "api-service": {
      "type": "rateLimiting",
      "param": 10  // 10 traces per second max
    }
  }
}`,
      pros: ["Predictable trace volume", "Cost control", "Per-service limits"],
      cons: ["May miss spikes", "Complex configuration", "Not traffic-aware"],
      useCases: ["Cost optimization", "Storage constraints", "Multiple services with different volumes"]
    },
    adaptive: {
      name: "Adaptive Sampling",
      description: "Dynamically adjust sampling based on traffic patterns and anomalies",
      example: "100% during errors, 1% during normal operation",
      implementation: `// Custom adaptive sampler
class AdaptiveSampler {
  constructor() {
    this.errorRate = 1.0;    // Always sample errors
    this.normalRate = 0.01;  // 1% for normal requests
    this.slowRate = 0.5;     // 50% for slow requests (>1s)
  }
  
  shouldSample(span) {
    if (span.statusCode >= 500) return true;
    if (span.duration > 1000) return Math.random() < this.slowRate;
    return Math.random() < this.normalRate;
  }
}`,
      pros: ["Intelligent sampling", "Captures important traces", "Adapts to conditions"],
      cons: ["Complex to implement", "Requires tuning", "Less predictable"],
      useCases: ["Production systems", "Error detection priority", "Variable traffic patterns"]
    },
    tailBased: {
      name: "Tail-Based Sampling",
      description: "Make sampling decision after trace completes, based on final attributes",
      example: "Keep all traces with errors or >5s latency",
      implementation: `// OpenTelemetry Collector tail sampling processor
processors:
  tail_sampling:
    decision_wait: 10s
    policies:
      - name: errors
        type: status_code
        status_code: {status_codes: [ERROR]}
      - name: slow
        type: latency
        latency: {threshold_ms: 5000}
      - name: sample-normal
        type: probabilistic
        probabilistic: {sampling_percentage: 1}`,
      pros: ["Keeps all important traces", "Makes informed decisions", "Optimal signal-to-noise"],
      cons: ["Requires buffering", "Adds latency", "Complex infrastructure"],
      useCases: ["Quality over quantity", "Error investigation", "SLA monitoring"]
    }
  }

  const performanceImpact = [
    {
      aspect: "CPU Overhead",
      unoptimized: "5-15%",
      optimized: "1-3%",
      tips: [
        "Use sampling (don't trace everything)",
        "Async span export",
        "Batch span sending",
        "Use agent-based collection"
      ]
    },
    {
      aspect: "Memory Usage",
      unoptimized: "50-200 MB per service",
      optimized: "10-30 MB per service",
      tips: [
        "Limit span attributes",
        "Set max span queue size",
        "Regular garbage collection",
        "Use memory-efficient serialization"
      ]
    },
    {
      aspect: "Network Bandwidth",
      unoptimized: "1-5 MB/s per service",
      optimized: "100-500 KB/s per service",
      tips: [
        "Compress spans (gzip)",
        "Batch spans before sending",
        "Use binary formats (protobuf)",
        "Local agent aggregation"
      ]
    },
    {
      aspect: "Latency Addition",
      unoptimized: "50-200 ms per request",
      optimized: "< 1 ms per request",
      tips: [
        "Async instrumentation",
        "Non-blocking span creation",
        "Background export",
        "Remove synchronous calls"
      ]
    }
  ]

  const implementationGuide = {
    phase1: {
      title: "Phase 1: Start Simple (Week 1-2)",
      steps: [
        "Choose a tracing backend (Jaeger recommended)",
        "Deploy tracing infrastructure (Docker/Kubernetes)",
        "Instrument one service with auto-instrumentation",
        "Verify traces appear in UI",
        "Start with 1% sampling"
      ],
      code: `// Node.js with OpenTelemetry auto-instrumentation
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
  }),
  serviceName: 'my-service',
});

sdk.start();`
    },
    phase2: {
      title: "Phase 2: Add Custom Spans (Week 3-4)",
      steps: [
        "Add custom spans for business operations",
        "Add meaningful attributes to spans",
        "Instrument database calls",
        "Instrument HTTP clients",
        "Add span events for important milestones"
      ],
      code: `const { trace } = require('@opentelemetry/api');

async function processOrder(orderId) {
  const tracer = trace.getTracer('order-service');
  
  return tracer.startActiveSpan('process-order', async (span) => {
    span.setAttribute('order.id', orderId);
    span.setAttribute('order.type', 'premium');
    
    try {
      const order = await fetchOrder(orderId);
      span.addEvent('order-fetched');
      
      const result = await chargePayment(order);
      span.addEvent('payment-charged', { amount: result.amount });
      
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}`
    },
    phase3: {
      title: "Phase 3: Optimize & Scale (Month 2+)",
      steps: [
        "Implement adaptive sampling",
        "Set up tail-based sampling",
        "Configure storage retention",
        "Create service dependency dashboards",
        "Integrate with alerting"
      ],
      code: `// Advanced sampling configuration
{
  "default_strategy": {
    "type": "probabilistic",
    "param": 0.01
  },
  "per_operation_strategies": {
    "GET /health": {
      "type": "probabilistic",
      "param": 0.0  // Don't trace health checks
    },
    "POST /api/payment": {
      "type": "probabilistic",
      "param": 1.0  // Always trace payments
    }
  }
}`
    }
  }

  const commonPitfalls = [
    {
      pitfall: "Over-instrumentation",
      problem: "Adding too many custom spans causes performance issues",
      solution: "Focus on service boundaries and business-critical operations only",
      example: "✗ Span per loop iteration → ✓ Span per database query"
    },
    {
      pitfall: "High-Cardinality Attributes",
      problem: "Using user IDs, request IDs as span attributes explodes storage",
      solution: "Use low-cardinality attributes for filtering, store high-cardinality in events",
      example: "✗ span.setAttribute('user.id', userId) → ✓ span.setAttribute('user.tier', 'premium')"
    },
    {
      pitfall: "Synchronous Span Export",
      problem: "Blocking request thread to send spans to collector",
      solution: "Always use async/background export with batching",
      example: "Use BatchSpanProcessor, not SimpleSpanProcessor in production"
    },
    {
      pitfall: "Missing Context Propagation",
      problem: "Traces break when crossing service boundaries",
      solution: "Ensure trace context headers are propagated in all HTTP/gRPC calls",
      example: "Use propagation.inject() before making requests"
    },
    {
      pitfall: "No Sampling Strategy",
      problem: "Tracing 100% in production causes cost explosion",
      solution: "Start with 1-10% sampling, use tail-based for important traces",
      example: "Probabilistic sampling + always sample errors"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">Distributed Tracing Deep Dive</h3>
        <p className="text-lg text-slate-600">
          Compare tracing tools, learn sampling strategies, and understand performance impact
        </p>
      </div>

      {/* What is Distributed Tracing */}
      <Card>
        <CardHeader>
          <CardTitle>What is Distributed Tracing?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-slate-700">
              Distributed tracing tracks requests as they flow through multiple services, creating a timeline 
              of operations (spans) that show latency, errors, and dependencies.
            </p>

            <div className="bg-slate-50 border rounded-lg p-6">
              <h5 className="font-semibold text-slate-900 mb-3">Key Concepts</h5>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-blue-700">Trace</div>
                  <div className="text-sm text-slate-600">Complete journey of a request through all services</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-700">Span</div>
                  <div className="text-sm text-slate-600">Single operation within a trace (e.g., database query)</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-700">Trace ID</div>
                  <div className="text-sm text-slate-600">Unique identifier shared across all spans in a trace</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-700">Span ID</div>
                  <div className="text-sm text-slate-600">Unique identifier for each span</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-700">Parent Span ID</div>
                  <div className="text-sm text-slate-600">Creates parent-child relationship between spans</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-700">Attributes</div>
                  <div className="text-sm text-slate-600">Key-value metadata attached to spans</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Distributed Tracing Tools Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTool} onValueChange={setSelectedTool}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="jaeger">Jaeger</TabsTrigger>
              <TabsTrigger value="zipkin">Zipkin</TabsTrigger>
              <TabsTrigger value="xray">AWS X-Ray</TabsTrigger>
            </TabsList>

            {Object.entries(tracingTools).map(([key, tool]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold text-slate-900">{tool.name}</h4>
                    <Badge variant="secondary">{tool.organization}</Badge>
                  </div>
                  <p className="text-slate-600">{tool.description}</p>
                </div>

                {/* Architecture */}
                <div>
                  <h5 className="text-lg font-semibold text-slate-900 mb-3">Architecture Components</h5>
                  <div className="space-y-2">
                    {tool.architecture.components.map((component, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{component.name}</div>
                          <div className="text-sm text-slate-600">{component.role}</div>
                          <div className="text-xs text-slate-500 mt-1">{component.tech}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h5 className="text-lg font-semibold text-slate-900 mb-3">Key Features</h5>
                  <div className="grid md:grid-cols-2 gap-2">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-green-700 mb-3">Advantages</h5>
                    <ul className="space-y-2">
                      {tool.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">+</span>
                          <span className="text-slate-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-red-700 mb-3">Disadvantages</h5>
                    <ul className="space-y-2">
                      {tool.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">-</span>
                          <span className="text-slate-700">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Best For */}
                <div>
                  <h5 className="text-lg font-semibold text-slate-900 mb-3">Best For</h5>
                  <div className="flex flex-wrap gap-2">
                    {tool.bestFor.map((use, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Sampling Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Sampling Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={samplingStrategy} onValueChange={setSamplingStrategy}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="probabilistic">Probabilistic</TabsTrigger>
              <TabsTrigger value="rateLimit">Rate Limiting</TabsTrigger>
              <TabsTrigger value="adaptive">Adaptive</TabsTrigger>
              <TabsTrigger value="tailBased">Tail-Based</TabsTrigger>
            </TabsList>

            {Object.entries(samplingStrategies).map(([key, strategy]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div>
                  <h5 className="text-xl font-bold text-slate-900 mb-2">{strategy.name}</h5>
                  <p className="text-slate-600 mb-2">{strategy.description}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-blue-800">Example</div>
                    <div className="text-sm text-blue-900">{strategy.example}</div>
                  </div>
                </div>

                <div>
                  <h6 className="font-semibold text-slate-900 mb-2">Implementation</h6>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{strategy.implementation}</code>
                  </pre>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h6 className="font-semibold text-green-700 mb-2">Pros</h6>
                    <ul className="space-y-1">
                      {strategy.pros.map((pro, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-green-600">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-red-700 mb-2">Cons</h6>
                    <ul className="space-y-1">
                      {strategy.cons.map((con, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-red-600">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-blue-700 mb-2">Use Cases</h6>
                    <ul className="space-y-1">
                      {strategy.useCases.map((useCase, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Performance Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Impact & Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceImpact.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-6">
                <h5 className="text-xl font-bold text-slate-900 mb-4">{item.aspect}</h5>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-red-800 mb-1">Unoptimized</div>
                    <div className="text-2xl font-bold text-red-900">{item.unoptimized}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-green-800 mb-1">Optimized</div>
                    <div className="text-2xl font-bold text-green-900">{item.optimized}</div>
                  </div>
                </div>

                <div>
                  <h6 className="font-semibold text-slate-900 mb-2">Optimization Tips</h6>
                  <ul className="space-y-1">
                    {item.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-blue-600">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.values(implementationGuide).map((phase, idx) => (
              <div key={idx} className="border-l-4 border-blue-600 pl-6">
                <h5 className="text-xl font-bold text-slate-900 mb-3">{phase.title}</h5>
                
                <div className="mb-4">
                  <h6 className="font-semibold text-slate-900 mb-2">Steps</h6>
                  <ol className="space-y-2">
                    {phase.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                          {i + 1}
                        </span>
                        <span className="text-slate-700 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h6 className="font-semibold text-slate-900 mb-2">Code Example</h6>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{phase.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Pitfalls */}
      <Card>
        <CardHeader>
          <CardTitle>Common Pitfalls & Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commonPitfalls.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-lg font-bold shrink-0">
                    !
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-slate-900">{item.pitfall}</h5>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 ml-11">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-red-800 mb-1">❌ Problem</div>
                    <div className="text-sm text-red-900">{item.problem}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-green-800 mb-1">✅ Solution</div>
                    <div className="text-sm text-green-900">{item.solution}</div>
                  </div>
                </div>

                <div className="ml-11 mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm font-semibold text-blue-800 mb-1">Example</div>
                  <code className="text-sm text-blue-900">{item.example}</code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
