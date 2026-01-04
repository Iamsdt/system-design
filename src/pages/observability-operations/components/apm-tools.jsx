import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * APMTools Component
 * Comprehensive comparison of Application Performance Monitoring tools
 */
export default function APMTools() {
  const [selectedTool, setSelectedTool] = useState("datadog")

  const apmTools = {
    datadog: {
      name: "Datadog",
      type: "Commercial SaaS",
      tagline: "Unified observability platform for cloud-scale applications",
      pricing: {
        start: "$15/host/month",
        apm: "$31/host/month",
        logs: "$0.10/GB ingested",
        note: "Volume discounts available"
      },
      features: {
        core: [
          "APM with distributed tracing",
          "Infrastructure monitoring",
          "Log management",
          "Real-time metrics",
          "Custom dashboards",
          "AI-powered anomaly detection"
        ],
        advanced: [
          "Profiling (CPU, memory, I/O)",
          "Database monitoring",
          "Network performance monitoring",
          "Security monitoring (CSM)",
          "Synthetic monitoring",
          "RUM (Real User Monitoring)"
        ],
        integrations: "600+ integrations"
      },
      strengths: [
        "All-in-one platform (metrics, logs, traces, RUM)",
        "Excellent visualization and dashboards",
        "Strong AWS/Azure/GCP integration",
        "Powerful query language (DQL)",
        "Great for cloud-native applications",
        "Extensive marketplace integrations"
      ],
      weaknesses: [
        "Expensive at scale",
        "Can be overwhelming for beginners",
        "Vendor lock-in concerns",
        "Complex pricing model"
      ],
      bestFor: ["Cloud-native applications", "Multi-cloud environments", "Teams wanting unified observability", "Companies with big budgets"],
      deployment: "SaaS only"
    },
    newRelic: {
      name: "New Relic",
      type: "Commercial SaaS",
      tagline: "All-in-one observability platform with simple pricing",
      pricing: {
        start: "$0 (100GB/month free)",
        standard: "$0.30/GB ingested",
        pro: "$0.50/GB ingested",
        note: "Consumption-based pricing"
      },
      features: {
        core: [
          "APM with distributed tracing",
          "Infrastructure monitoring",
          "Log management",
          "Custom queries (NRQL)",
          "Alerts and notifications",
          "Service maps"
        ],
        advanced: [
          "Browser monitoring (RUM)",
          "Mobile app monitoring",
          "Synthetic monitoring",
          "Applied Intelligence (AI/ML)",
          "Vulnerability management",
          "CodeStream (IDE integration)"
        ],
        integrations: "550+ integrations"
      },
      strengths: [
        "Simple consumption-based pricing",
        "Generous free tier (100GB/month)",
        "Strong APM capabilities",
        "NRQL is powerful and flexible",
        "Good mobile app monitoring",
        "Applied Intelligence for anomaly detection"
      ],
      weaknesses: [
        "UI can feel dated",
        "Data ingestion can get expensive",
        "Less extensive integrations than Datadog",
        "Learning curve for NRQL"
      ],
      bestFor: ["Cost-conscious teams", "Full-stack visibility needs", "Teams already using consumption-based pricing", "Mobile app developers"],
      deployment: "SaaS only"
    },
    dynatrace: {
      name: "Dynatrace",
      type: "Commercial SaaS/On-Prem",
      tagline: "AI-powered full-stack monitoring with automatic root cause analysis",
      pricing: {
        start: "$69/host/month (8GB)",
        fullStack: "Custom enterprise pricing",
        logs: "$0.20/GB ingested",
        note: "Host-based + consumption"
      },
      features: {
        core: [
          "Automatic discovery and instrumentation",
          "Full-stack monitoring",
          "Distributed tracing",
          "Log management",
          "Infrastructure monitoring",
          "Davis AI engine"
        ],
        advanced: [
          "Automatic root cause analysis",
          "Business analytics",
          "Application security",
          "Session replay",
          "Synthetic monitoring",
          "Cloud automation"
        ],
        integrations: "500+ integrations"
      },
      strengths: [
        "Best-in-class automatic instrumentation",
        "Davis AI provides intelligent insights",
        "Excellent root cause analysis",
        "Strong for enterprise environments",
        "Can be deployed on-premises",
        "Great for complex microservices"
      ],
      weaknesses: [
        "Most expensive option",
        "Overkill for small teams",
        "Complex setup for on-prem",
        "Steep learning curve"
      ],
      bestFor: ["Large enterprises", "Complex microservices architectures", "Teams needing AI-driven insights", "Regulated industries requiring on-prem"],
      deployment: "SaaS or On-Premises"
    },
    elasticAPM: {
      name: "Elastic APM",
      type: "Open Source / Commercial",
      tagline: "Part of the Elastic Stack, deep integration with logs and metrics",
      pricing: {
        start: "Free (open source)",
        cloud: "$95/month (starts)",
        note: "Self-hosted free, Elastic Cloud paid"
      },
      features: {
        core: [
          "Distributed tracing",
          "Error tracking",
          "Metrics collection",
          "Service maps",
          "Transaction sampling",
          "Deep Elasticsearch integration"
        ],
        advanced: [
          "Real User Monitoring (RUM)",
          "Log correlation",
          "Machine learning anomaly detection",
          "Alerting",
          "Custom dashboards in Kibana",
          "Infrastructure monitoring"
        ],
        integrations: "Elasticsearch ecosystem"
      },
      strengths: [
        "Free and open source",
        "Deep integration with ELK Stack",
        "Great if already using Elasticsearch",
        "Flexible and customizable",
        "Self-hosted option available",
        "Good for cost optimization"
      ],
      weaknesses: [
        "Requires ELK Stack knowledge",
        "Manual setup and maintenance",
        "Fewer integrations than competitors",
        "Less polished UI"
      ],
      bestFor: ["Teams already using ELK", "Budget-conscious organizations", "On-premises requirements", "Customization needs"],
      deployment: "Self-hosted or Elastic Cloud"
    },
    appDynamics: {
      name: "AppDynamics (Cisco)",
      type: "Commercial SaaS/On-Prem",
      tagline: "Business transaction monitoring with deep code-level insights",
      pricing: {
        start: "Custom pricing",
        infrastructure: "$6/CPU core/month",
        apm: "$33/CPU core/month",
        note: "Enterprise pricing"
      },
      features: {
        core: [
          "Business transaction monitoring",
          "Code-level diagnostics",
          "Application mapping",
          "Infrastructure monitoring",
          "End-user monitoring",
          "Business iQ"
        ],
        advanced: [
          "Database visibility",
          "Server visibility",
          "Network visibility",
          "Business iQ dashboards",
          "Cognitive Engine (AI)",
          "Cloud migration support"
        ],
        integrations: "Cisco ecosystem + third-party"
      },
      strengths: [
        "Excellent business-focused monitoring",
        "Deep code-level visibility",
        "Strong for Java applications",
        "Good for large enterprises",
        "Integration with Cisco networking",
        "Business transaction correlation"
      ],
      weaknesses: [
        "Expensive",
        "Complex licensing",
        "Heavy agent footprint",
        "Better for monoliths than microservices",
        "UI feels enterprise/legacy"
      ],
      bestFor: ["Large enterprises", "Java-heavy environments", "Business-critical applications", "Organizations using Cisco infrastructure"],
      deployment: "SaaS or On-Premises"
    },
    grafana: {
      name: "Grafana Cloud",
      type: "Open Source / Commercial",
      tagline: "Open-source observability with metrics, logs, and traces",
      pricing: {
        start: "Free (14-day retention)",
        pro: "$8/month (50GB metrics, 50GB logs)",
        advanced: "Custom pricing",
        note: "Self-hosted free"
      },
      features: {
        core: [
          "Prometheus metrics",
          "Loki logs",
          "Tempo traces",
          "Unified dashboards",
          "Alerting",
          "Multiple data sources"
        ],
        advanced: [
          "Synthetic monitoring",
          "Incident management (OnCall)",
          "Application observability",
          "Frontend observability",
          "Machine learning",
          "SLO tracking"
        ],
        integrations: "100+ data sources"
      },
      strengths: [
        "Open source core",
        "Best visualization capabilities",
        "Flexible data source support",
        "Cost-effective",
        "Strong Kubernetes integration",
        "Active community"
      ],
      weaknesses: [
        "Requires multiple tools (Prometheus, Loki, Tempo)",
        "More setup complexity",
        "Less integrated than commercial solutions",
        "Self-hosted requires expertise"
      ],
      bestFor: ["Cloud-native applications", "Kubernetes environments", "Teams wanting open source", "Budget-conscious organizations"],
      deployment: "Self-hosted or Grafana Cloud"
    }
  }

  const comparisonMatrix = [
    {
      criteria: "Ease of Setup",
      datadog: "🟢 Easy",
      newRelic: "🟢 Easy",
      dynatrace: "🟡 Medium",
      elasticAPM: "🔴 Complex",
      appDynamics: "🔴 Complex",
      grafana: "🟡 Medium"
    },
    {
      criteria: "Auto-instrumentation",
      datadog: "🟢 Excellent",
      newRelic: "🟢 Excellent",
      dynatrace: "🟢 Best-in-class",
      elasticAPM: "🟡 Good",
      appDynamics: "🟢 Excellent",
      grafana: "🟡 Limited"
    },
    {
      criteria: "Cost (Small Team)",
      datadog: "🔴 High",
      newRelic: "🟢 Free tier",
      dynatrace: "🔴 Highest",
      elasticAPM: "🟢 Free (OSS)",
      appDynamics: "🔴 High",
      grafana: "🟢 Free tier"
    },
    {
      criteria: "Cost (Enterprise)",
      datadog: "🔴 Very High",
      newRelic: "🟡 Medium",
      dynatrace: "🔴 Highest",
      elasticAPM: "🟢 Low",
      appDynamics: "🔴 Very High",
      grafana: "🟢 Low"
    },
    {
      criteria: "Cloud Native",
      datadog: "🟢 Excellent",
      newRelic: "🟢 Excellent",
      dynatrace: "🟢 Excellent",
      elasticAPM: "🟡 Good",
      appDynamics: "🟡 Fair",
      grafana: "🟢 Excellent"
    },
    {
      criteria: "Kubernetes Support",
      datadog: "🟢 Excellent",
      newRelic: "🟢 Excellent",
      dynatrace: "🟢 Excellent",
      elasticAPM: "🟡 Good",
      appDynamics: "🟡 Good",
      grafana: "🟢 Best"
    },
    {
      criteria: "Learning Curve",
      datadog: "🟡 Medium",
      newRelic: "🟡 Medium",
      dynatrace: "🔴 Steep",
      elasticAPM: "🔴 Steep",
      appDynamics: "🔴 Steep",
      grafana: "🟡 Medium"
    },
    {
      criteria: "Customization",
      datadog: "🟡 Limited",
      newRelic: "🟡 Limited",
      dynatrace: "🟡 Medium",
      elasticAPM: "🟢 High",
      appDynamics: "🟡 Medium",
      grafana: "🟢 Highest"
    },
    {
      criteria: "On-Premises Option",
      datadog: "❌ No",
      newRelic: "❌ No",
      dynatrace: "✅ Yes",
      elasticAPM: "✅ Yes",
      appDynamics: "✅ Yes",
      grafana: "✅ Yes"
    }
  ]

  const decisionTree = [
    {
      scenario: "Startup / Small Team (< 10 people)",
      recommendation: "New Relic or Grafana Cloud",
      reasoning: "Free tiers, easy setup, room to grow",
      alternatives: "Elastic APM if already using ELK"
    },
    {
      scenario: "Mid-size Company (10-100 people)",
      recommendation: "Datadog or New Relic",
      reasoning: "Good balance of features, support, and cost",
      alternatives: "Grafana Cloud for cost optimization"
    },
    {
      scenario: "Large Enterprise (100+ people)",
      recommendation: "Dynatrace or Datadog",
      reasoning: "Enterprise features, scale, dedicated support",
      alternatives: "AppDynamics if using Cisco infrastructure"
    },
    {
      scenario: "Kubernetes-Native",
      recommendation: "Grafana Stack or Datadog",
      reasoning: "Best Kubernetes integration and cloud-native features",
      alternatives: "New Relic for simpler setup"
    },
    {
      scenario: "Budget Constrained",
      recommendation: "Grafana Cloud or Elastic APM",
      reasoning: "Open source core, free self-hosting option",
      alternatives: "New Relic free tier"
    },
    {
      scenario: "On-Premises Requirement",
      recommendation: "Dynatrace or Elastic APM",
      reasoning: "Proven on-prem deployment, full feature parity",
      alternatives: "Grafana self-hosted or AppDynamics"
    },
    {
      scenario: "Already Using AWS",
      recommendation: "Datadog or Grafana",
      reasoning: "Strong AWS integration, X-Ray alternative",
      alternatives: "New Relic for simplicity"
    },
    {
      scenario: "Legacy Java Applications",
      recommendation: "AppDynamics or Dynatrace",
      reasoning: "Best Java support, code-level visibility",
      alternatives: "New Relic for modern cloud migration"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">APM Tools Comparison</h3>
        <p className="text-lg text-slate-600">
          Compare leading Application Performance Monitoring tools to find the best fit for your needs
        </p>
      </div>

      {/* What is APM */}
      <Card>
        <CardHeader>
          <CardTitle>What is Application Performance Monitoring (APM)?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 mb-4">
            APM tools monitor application performance, track transactions end-to-end, identify bottlenecks, 
            and provide insights into application health and user experience.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-slate-900 mb-1">Performance Metrics</div>
              <div className="text-sm text-slate-600">Response time, throughput, error rates, resource usage</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-semibold text-slate-900 mb-1">Transaction Tracing</div>
              <div className="text-sm text-slate-600">Follow requests across services, databases, and external APIs</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🚨</div>
              <div className="font-semibold text-slate-900 mb-1">Proactive Alerts</div>
              <div className="text-sm text-slate-600">Detect anomalies and issues before users are impacted</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tool Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Tool Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTool} onValueChange={setSelectedTool}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="datadog">Datadog</TabsTrigger>
              <TabsTrigger value="newRelic">New Relic</TabsTrigger>
              <TabsTrigger value="dynatrace">Dynatrace</TabsTrigger>
              <TabsTrigger value="elasticAPM">Elastic APM</TabsTrigger>
              <TabsTrigger value="appDynamics">AppDynamics</TabsTrigger>
              <TabsTrigger value="grafana">Grafana</TabsTrigger>
            </TabsList>

            {Object.entries(apmTools).map(([key, tool]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold text-slate-900">{tool.name}</h4>
                    <Badge variant="secondary">{tool.type}</Badge>
                  </div>
                  <p className="text-slate-600 italic">{tool.tagline}</p>
                </div>

                {/* Pricing */}
                <div className=" from-blue-50 to-purple-50 rounded-lg p-6">
                  <h5 className="text-lg font-semibold text-slate-900 mb-3">Pricing</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-600">Starting Price</div>
                      <div className="text-xl font-bold text-slate-900">{tool.pricing.start}</div>
                    </div>
                    {tool.pricing.apm && (
                      <div>
                        <div className="text-sm text-slate-600">APM Pricing</div>
                        <div className="text-xl font-bold text-slate-900">{tool.pricing.apm}</div>
                      </div>
                    )}
                    {tool.pricing.logs && (
                      <div>
                        <div className="text-sm text-slate-600">Log Pricing</div>
                        <div className="text-xl font-bold text-slate-900">{tool.pricing.logs}</div>
                      </div>
                    )}
                    {tool.pricing.fullStack && (
                      <div>
                        <div className="text-sm text-slate-600">Full Stack</div>
                        <div className="text-xl font-bold text-slate-900">{tool.pricing.fullStack}</div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 mt-3">{tool.pricing.note}</div>
                </div>

                {/* Features */}
                <div>
                  <h5 className="text-lg font-semibold text-slate-900 mb-3">Features</h5>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="font-semibold text-blue-700 mb-2">Core Features</div>
                      <ul className="space-y-1">
                        {tool.features.core.map((feature, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-purple-700 mb-2">Advanced Features</div>
                      <ul className="space-y-1">
                        {tool.features.advanced.map((feature, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="text-purple-600 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-slate-50 rounded-lg p-3">
                    <span className="font-semibold text-slate-900">Integrations:</span>{" "}
                    <span className="text-slate-700">{tool.features.integrations}</span>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-green-700 mb-3">Strengths</h5>
                    <ul className="space-y-2">
                      {tool.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">+</span>
                          <span className="text-slate-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-red-700 mb-3">Weaknesses</h5>
                    <ul className="space-y-2">
                      {tool.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">-</span>
                          <span className="text-slate-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Best For & Deployment */}
                <div className="grid md:grid-cols-2 gap-6">
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
                  <div>
                    <h5 className="text-lg font-semibold text-slate-900 mb-3">Deployment Options</h5>
                    <Badge className="bg-slate-600">{tool.deployment}</Badge>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Comparison Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Comparison Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border p-2 text-left font-semibold">Criteria</th>
                  <th className="border p-2 text-center font-semibold">Datadog</th>
                  <th className="border p-2 text-center font-semibold">New Relic</th>
                  <th className="border p-2 text-center font-semibold">Dynatrace</th>
                  <th className="border p-2 text-center font-semibold">Elastic APM</th>
                  <th className="border p-2 text-center font-semibold">AppDynamics</th>
                  <th className="border p-2 text-center font-semibold">Grafana</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border p-2 font-medium">{row.criteria}</td>
                    <td className="border p-2 text-center">{row.datadog}</td>
                    <td className="border p-2 text-center">{row.newRelic}</td>
                    <td className="border p-2 text-center">{row.dynatrace}</td>
                    <td className="border p-2 text-center">{row.elasticAPM}</td>
                    <td className="border p-2 text-center">{row.appDynamics}</td>
                    <td className="border p-2 text-center">{row.grafana}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span>🟢</span>
              <span className="text-slate-700">Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🟡</span>
              <span className="text-slate-700">Good/Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔴</span>
              <span className="text-slate-700">Limited/Expensive</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅/❌</span>
              <span className="text-slate-700">Available/Not Available</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decision Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Decision Guide: Which Tool Should You Choose?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {decisionTree.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-slate-900 mb-1">{item.scenario}</h5>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 ml-11">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-green-800 mb-1">✓ Recommendation</div>
                    <div className="font-bold text-green-900">{item.recommendation}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-blue-800 mb-1">Why?</div>
                    <div className="text-sm text-blue-900">{item.reasoning}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-slate-800 mb-1">Alternatives</div>
                    <div className="text-sm text-slate-700">{item.alternatives}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Considerations */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Considerations</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-yellow-50 border-yellow-200 mb-6">
            <AlertDescription>
              <strong>💰 Important:</strong> APM costs can scale unexpectedly. Always test pricing calculators and monitor usage closely.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="border rounded-lg p-5">
              <h5 className="font-bold text-slate-900 mb-2">Small Startup (5 engineers, 10 hosts)</h5>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Datadog:</span>
                  <span className="font-semibold">$310-500/month</span>
                </li>
                <li className="flex justify-between">
                  <span>New Relic:</span>
                  <span className="font-semibold">$0-100/month (free tier)</span>
                </li>
                <li className="flex justify-between">
                  <span>Dynatrace:</span>
                  <span className="font-semibold">$690+/month</span>
                </li>
                <li className="flex justify-between">
                  <span>Elastic APM:</span>
                  <span className="font-semibold">$95-200/month</span>
                </li>
                <li className="flex justify-between">
                  <span>Grafana Cloud:</span>
                  <span className="font-semibold">$0-50/month (free tier)</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-5">
              <h5 className="font-bold text-slate-900 mb-2">Medium Company (50 engineers, 100 hosts)</h5>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Datadog:</span>
                  <span className="font-semibold">$3,000-6,000/month</span>
                </li>
                <li className="flex justify-between">
                  <span>New Relic:</span>
                  <span className="font-semibold">$1,500-3,000/month</span>
                </li>
                <li className="flex justify-between">
                  <span>Dynatrace:</span>
                  <span className="font-semibold">$6,900+/month</span>
                </li>
                <li className="flex justify-between">
                  <span>Elastic APM:</span>
                  <span className="font-semibold">$500-1,500/month (self-hosted cheaper)</span>
                </li>
                <li className="flex justify-between">
                  <span>Grafana Cloud:</span>
                  <span className="font-semibold">$500-1,000/month</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
