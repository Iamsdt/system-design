import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * LogAggregation Component
 * Deep dive into log aggregation systems: ELK Stack, Loki, CloudWatch Logs
 */
export default function LogAggregation() {
  const [selectedStack, setSelectedStack] = useState("elk")
  const [queryExample, setQueryExample] = useState("elk")

  const logStacks = {
    elk: {
      name: "ELK Stack",
      fullName: "Elasticsearch, Logstash, Kibana",
      description: "Most popular open-source log aggregation stack with full-text search capabilities",
      components: [
        {
          name: "Elasticsearch",
          role: "Storage & Search Engine",
          features: ["Full-text search", "Distributed architecture", "Real-time indexing", "RESTful API"]
        },
        {
          name: "Logstash",
          role: "Data Processing Pipeline",
          features: ["Log parsing", "Data transformation", "Multiple input/output plugins", "Filtering and enrichment"]
        },
        {
          name: "Kibana",
          role: "Visualization & UI",
          features: ["Interactive dashboards", "Log exploration", "Alerting", "Machine learning features"]
        }
      ],
      pros: ["Powerful search capabilities", "Rich ecosystem", "Flexible querying", "Great for compliance"],
      cons: ["Resource intensive", "Complex setup", "Expensive at scale", "Steep learning curve"],
      bestFor: ["Large enterprises", "Compliance-heavy industries", "Complex log analysis", "Security monitoring"]
    },
    loki: {
      name: "Grafana Loki",
      fullName: "Prometheus-inspired log aggregation",
      description: "Cost-effective log aggregation designed for simplicity and efficiency",
      components: [
        {
          name: "Loki",
          role: "Log Storage",
          features: ["Label-based indexing", "S3/GCS compatible", "Multi-tenancy", "Low resource usage"]
        },
        {
          name: "Promtail",
          role: "Log Collector",
          features: ["Service discovery", "Label extraction", "Pipeline stages", "Kubernetes native"]
        },
        {
          name: "Grafana",
          role: "Visualization",
          features: ["Unified metrics & logs", "LogQL queries", "Alerting", "Dashboard sharing"]
        }
      ],
      pros: ["Cost-effective", "Simple architecture", "Excellent Kubernetes integration", "Scales horizontally"],
      cons: ["No full-text search", "Less mature than ELK", "Fewer advanced features", "Query limitations"],
      bestFor: ["Cloud-native apps", "Kubernetes environments", "Budget-conscious teams", "Metrics + Logs unified view"]
    },
    cloudwatch: {
      name: "CloudWatch Logs",
      fullName: "AWS CloudWatch Logs",
      description: "Fully managed AWS log aggregation service with deep AWS integration",
      components: [
        {
          name: "Log Groups",
          role: "Organization",
          features: ["Logical grouping", "Retention policies", "Access control", "Encryption"]
        },
        {
          name: "Log Streams",
          role: "Data Flow",
          features: ["Sequential logs", "Real-time ingestion", "Multiple sources", "Automatic timestamp"]
        },
        {
          name: "Insights",
          role: "Query Engine",
          features: ["SQL-like queries", "Automatic field discovery", "Visualization", "Saved queries"]
        }
      ],
      pros: ["Zero infrastructure", "Deep AWS integration", "Pay-per-use", "Automatic scaling"],
      cons: ["AWS lock-in", "Limited retention", "Query costs add up", "Not ideal for multi-cloud"],
      bestFor: ["AWS-heavy workloads", "Serverless applications", "Quick setup needs", "AWS Lambda monitoring"]
    }
  }

  const queryExamples = {
    elk: {
      language: "Elasticsearch Query DSL / Lucene",
      examples: [
        {
          title: "Find 500 errors in last hour",
          query: `status:500 AND timestamp:[now-1h TO now]`,
          description: "Uses Lucene query syntax for simple searches"
        },
        {
          title: "Aggregation query",
          query: `{
  "query": {
    "bool": {
      "filter": [
        {"range": {"@timestamp": {"gte": "now-1h"}}},
        {"term": {"status": 500}}
      ]
    }
  },
  "aggs": {
    "errors_by_service": {
      "terms": {"field": "service.keyword"}
    }
  }
}`,
          description: "JSON-based Query DSL for complex queries"
        }
      ]
    },
    loki: {
      language: "LogQL",
      examples: [
        {
          title: "Filter logs by label",
          query: `{app="api-service", env="production"} |= "error"`,
          description: "Label selectors followed by log pipeline"
        },
        {
          title: "Rate of errors per minute",
          query: `rate({app="api-service"} |= "error" [5m])`,
          description: "Metric query to calculate error rate"
        },
        {
          title: "Extract and count status codes",
          query: `sum by (status) (
  rate({app="api-service"} 
    | json 
    | status >= 500 [5m])
)`,
          description: "Parse JSON and aggregate by extracted field"
        }
      ]
    },
    cloudwatch: {
      language: "CloudWatch Logs Insights Query",
      examples: [
        {
          title: "Parse and filter JSON logs",
          query: `fields @timestamp, @message
| filter statusCode >= 500
| stats count() by statusCode`,
          description: "SQL-like syntax with automatic field extraction"
        },
        {
          title: "Find slow requests",
          query: `fields @timestamp, requestId, duration
| filter duration > 1000
| sort duration desc
| limit 20`,
          description: "Filter, sort and limit results"
        }
      ]
    }
  }

  const architecturePatterns = [
    {
      pattern: "Centralized Logging",
      description: "All logs flow to a single aggregation point",
      useCases: ["Small to medium deployments", "Single region", "Simplified management"],
      challenges: ["Single point of failure", "Network bottleneck", "Regional latency"]
    },
    {
      pattern: "Distributed Aggregation",
      description: "Regional aggregators with central search",
      useCases: ["Multi-region deployments", "High volume", "Low latency requirements"],
      challenges: ["Complex setup", "Data synchronization", "Cost overhead"]
    },
    {
      pattern: "Tiered Storage",
      description: "Hot (recent) and cold (archived) storage tiers",
      useCases: ["Cost optimization", "Compliance requirements", "Long retention needs"],
      challenges: ["Query complexity", "Restoration time", "Access patterns"]
    }
  ]

  const costOptimization = [
    {
      strategy: "Structured Logging",
      impact: "30-50% reduction",
      description: "Use JSON with consistent fields instead of free-text logs",
      implementation: "Define log schema, enforce through libraries"
    },
    {
      strategy: "Log Sampling",
      impact: "60-80% reduction",
      description: "Sample verbose logs, keep all errors and important events",
      implementation: "Client-side sampling, trace-based decisions"
    },
    {
      strategy: "Field Indexing",
      impact: "40-60% reduction",
      description: "Index only searchable fields, not entire log body",
      implementation: "Configure index patterns, use keyword fields"
    },
    {
      strategy: "Retention Policies",
      impact: "50-70% reduction",
      description: "Aggressive retention for debug logs, longer for audit logs",
      implementation: "Different retention per log level/source"
    },
    {
      strategy: "Compression",
      impact: "70-80% reduction",
      description: "Enable compression for storage and transport",
      implementation: "Use gzip, enable in log shippers"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">Log Aggregation Systems</h3>
        <p className="text-lg text-slate-600">
          Compare popular log aggregation stacks, learn query languages, and optimize costs
        </p>
      </div>

      {/* Stack Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Log Aggregation Stacks</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedStack} onValueChange={setSelectedStack}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="elk">ELK Stack</TabsTrigger>
              <TabsTrigger value="loki">Grafana Loki</TabsTrigger>
              <TabsTrigger value="cloudwatch">CloudWatch Logs</TabsTrigger>
            </TabsList>

            {Object.entries(logStacks).map(([key, stack]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold text-slate-900">{stack.name}</h4>
                    <Badge variant="secondary">{stack.fullName}</Badge>
                  </div>
                  <p className="text-slate-600">{stack.description}</p>
                </div>

                {/* Components */}
                <div>
                  <h5 className="text-lg font-semibold text-slate-900 mb-3">Components</h5>
                  <div className="grid gap-4 md:grid-cols-3">
                    {stack.components.map((component, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-4">
                        <div className="font-semibold text-slate-900 mb-1">{component.name}</div>
                        <div className="text-sm text-slate-600 mb-3">{component.role}</div>
                        <ul className="space-y-1">
                          {component.features.map((feature, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-green-700 mb-3">Advantages</h5>
                    <ul className="space-y-2">
                      {stack.pros.map((pro, idx) => (
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
                      {stack.cons.map((con, idx) => (
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
                    {stack.bestFor.map((use, idx) => (
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

      {/* Query Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Query Language Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={queryExample} onValueChange={setQueryExample}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="elk">Elasticsearch</TabsTrigger>
              <TabsTrigger value="loki">LogQL</TabsTrigger>
              <TabsTrigger value="cloudwatch">CloudWatch Insights</TabsTrigger>
            </TabsList>

            {Object.entries(queryExamples).map(([key, data]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>{data.language}</strong> - Query language for {logStacks[key].name}
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  {data.examples.map((example, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="font-semibold text-slate-900">{example.title}</h6>
                        <Badge variant="secondary">Example {idx + 1}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{example.description}</p>
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{example.query}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Architecture Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Architecture Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {architecturePatterns.map((pattern, idx) => (
              <div key={idx} className="border rounded-lg p-6">
                <h5 className="text-xl font-bold text-slate-900 mb-2">{pattern.pattern}</h5>
                <p className="text-slate-600 mb-4">{pattern.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-green-700 mb-2">Use Cases</h6>
                    <ul className="space-y-1">
                      {pattern.useCases.map((use, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-orange-700 mb-2">Challenges</h6>
                    <ul className="space-y-1">
                      {pattern.challenges.map((challenge, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Optimization */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Optimization Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costOptimization.map((strategy, idx) => (
              <div key={idx} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="text-xl font-bold text-slate-900">{strategy.strategy}</h5>
                    <p className="text-slate-600 mt-1">{strategy.description}</p>
                  </div>
                  <Badge className="bg-green-600 text-white shrink-0">
                    {strategy.impact}
                  </Badge>
                </div>
                <div className="bg-white rounded-md p-3 border border-slate-200">
                  <div className="text-sm font-semibold text-slate-700 mb-1">Implementation</div>
                  <div className="text-sm text-slate-600">{strategy.implementation}</div>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-6 bg-yellow-50 border-yellow-200">
            <AlertDescription>
              <strong>💡 Pro Tip:</strong> Combine multiple strategies for maximum cost savings. 
              A typical optimization can reduce log costs by 70-80% while maintaining observability.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Decision Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Decision Matrix: Which Stack to Choose?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border p-3 text-left font-semibold">Criteria</th>
                  <th className="border p-3 text-center font-semibold">ELK Stack</th>
                  <th className="border p-3 text-center font-semibold">Grafana Loki</th>
                  <th className="border p-3 text-center font-semibold">CloudWatch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">Setup Complexity</td>
                  <td className="border p-3 text-center">🔴 High</td>
                  <td className="border p-3 text-center">🟡 Medium</td>
                  <td className="border p-3 text-center">🟢 Low</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Search Capabilities</td>
                  <td className="border p-3 text-center">🟢 Excellent</td>
                  <td className="border p-3 text-center">🟡 Limited</td>
                  <td className="border p-3 text-center">🟡 Good</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Cost at Scale</td>
                  <td className="border p-3 text-center">🔴 Expensive</td>
                  <td className="border p-3 text-center">🟢 Low</td>
                  <td className="border p-3 text-center">🟡 Medium</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Kubernetes Integration</td>
                  <td className="border p-3 text-center">🟡 Good</td>
                  <td className="border p-3 text-center">🟢 Excellent</td>
                  <td className="border p-3 text-center">🟡 Fair</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Cloud Native</td>
                  <td className="border p-3 text-center">🟡 Hybrid</td>
                  <td className="border p-3 text-center">🟢 Yes</td>
                  <td className="border p-3 text-center">🟢 AWS Only</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Learning Curve</td>
                  <td className="border p-3 text-center">🔴 Steep</td>
                  <td className="border p-3 text-center">🟢 Easy</td>
                  <td className="border p-3 text-center">🟢 Easy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
