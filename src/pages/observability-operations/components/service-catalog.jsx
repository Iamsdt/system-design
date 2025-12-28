import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Service Catalog Component
 * Covers Backstage.io, internal developer platforms, API documentation, and service registry
 */
export default function ServiceCatalog() {
  const [selectedPlatform, setSelectedPlatform] = useState("backstage")

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="inline-block">
          <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
              📚
            </span>
            SERVICE CATALOG
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          Internal Developer Platforms & Service Registry
        </h2>
        <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
          A service catalog acts as a central hub for discovering, understanding, and managing all services in your organization.
        </p>
      </div>

      {/* Why Service Catalog? */}
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-2xl">Why You Need a Service Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🔍</span> Discoverability
                </h4>
                <p className="text-sm text-slate-700">
                  "Who owns the payment service? What's its SLA? How do I call it?"
                  Without a catalog, developers waste hours searching Slack and wikis.
                </p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🔗</span> Dependency Mapping
                </h4>
                <p className="text-sm text-slate-700">
                  Visualize service dependencies to understand blast radius of incidents 
                  and plan migrations safely.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">⚙️</span> Self-Service
                </h4>
                <p className="text-sm text-slate-700">
                  Developers create new services, databases, and CI/CD pipelines 
                  using templates—no waiting for ops tickets.
                </p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Compliance & Governance
                </h4>
                <p className="text-sm text-slate-700">
                  Track which services lack security reviews, TLS certs, or proper monitoring. 
                  Automated scorecards ensure standards.
                </p>
              </div>
            </div>
          </div>

          <Alert className="mt-6 border-indigo-200 bg-indigo-50">
            <AlertDescription>
              <strong>💡 Key Insight:</strong> In organizations with 50+ microservices, 
              engineers spend 2-5 hours per week just finding the right service and its owner. 
              A service catalog pays for itself in saved developer time.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Platform Comparison */}
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-2xl">Internal Developer Platform Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="backstage" onValueChange={setSelectedPlatform}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="backstage">Backstage</TabsTrigger>
              <TabsTrigger value="cortex">Cortex</TabsTrigger>
              <TabsTrigger value="port">Port</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="backstage" className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-2xl">Backstage.io</h3>
                  <Badge className="bg-green-600">Open Source</Badge>
                  <Badge variant="outline">Spotify</Badge>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  The most popular open-source developer portal. Created by Spotify, adopted by Netflix, 
                  American Airlines, and hundreds of others.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-bold mb-2 text-green-700">✅ Pros</h4>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• Free and open source</li>
                      <li>• 100+ plugins (GitHub, Kubernetes, PagerDuty)</li>
                      <li>• Software Templates (create service in 1 click)</li>
                      <li>• TechDocs (docs-as-code with MkDocs)</li>
                      <li>• Strong community and ecosystem</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-bold mb-2 text-red-700">❌ Cons</h4>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• Requires hosting and maintenance</li>
                      <li>• Initial setup is complex (2-4 weeks)</li>
                      <li>• Need to write custom plugins for proprietary tools</li>
                      <li>• No built-in hosting (use AWS, GCP, or K8s)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-xs">
                  <div className="text-slate-400 mb-2"># Quick Start (Docker)</div>
                  <div>npx @backstage/create-app@latest</div>
                  <div>cd my-backstage-app</div>
                  <div>yarn dev</div>
                  <div className="mt-2 text-slate-400"># Access at http://localhost:3000</div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <strong>💰 Cost:</strong> Free (OSS), but budget $50-200/month for hosting + 1-2 engineers for maintenance
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cortex" className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-2xl">Cortex</h3>
                  <Badge className="bg-blue-600">SaaS</Badge>
                  <Badge variant="outline">Enterprise</Badge>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  Cloud-native service catalog with built-in scorecards, on-call management, and integrations.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-bold mb-2 text-green-700">✅ Pros</h4>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• Fully managed SaaS (no hosting)</li>
                      <li>• Built-in Scorecards for service quality</li>
                      <li>• Advanced RBAC and audit logs</li>
                      <li>• Integrations with 100+ tools</li>
                      <li>• AI-powered service discovery</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-bold mb-2 text-red-700">❌ Cons</h4>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• Expensive ($10k-50k/year)</li>
                      <li>• Closed source (vendor lock-in)</li>
                      <li>• Limited customization vs Backstage</li>
                      <li>• Overkill for small teams</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-bold mb-2">Key Features</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-slate-50 rounded">📊 Service Scorecards</div>
                    <div className="p-2 bg-slate-50 rounded">🔔 Incident Response</div>
                    <div className="p-2 bg-slate-50 rounded">🗂️ API Catalog</div>
                    <div className="p-2 bg-slate-50 rounded">📈 Analytics Dashboard</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <strong>💰 Cost:</strong> $10k-$50k/year (pricing based on # of services and users)
                </div>
              </div>
            </TabsContent>

            <TabsContent value="port" className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-2xl">Port</h3>
                  <Badge className="bg-blue-600">SaaS</Badge>
                  <Badge variant="outline">DevEx Platform</Badge>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  Developer Experience platform with service catalog, self-service actions, and automation.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-bold mb-2 text-green-700">✅ Pros</h4>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• No-code entity modeling</li>
                      <li>• Self-service actions (deploy, scale, rollback)</li>
                      <li>• Free tier for small teams</li>
                      <li>• Modern UI/UX</li>
                      <li>• Webhooks and automation</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-bold mb-2 text-red-700">❌ Cons</h4>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• Newer product (less mature)</li>
                      <li>• Smaller community vs Backstage</li>
                      <li>• Limited plugin ecosystem</li>
                      <li>• SaaS-only (no self-hosted option)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-bold mb-2">Unique Features</h4>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <div>
                        <strong>Blueprint Designer:</strong> Define service schema with drag-and-drop
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <div>
                        <strong>Self-Service Actions:</strong> One-click deploys, rollbacks, DB provisions
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <div>
                        <strong>Automation:</strong> Trigger GitHub Actions, ArgoCD, Terraform from UI
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <strong>💰 Cost:</strong> Free for {"<"}5 users, then $15/user/month
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-2xl">Custom Solution</h3>
                  <Badge className="bg-purple-600">DIY</Badge>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  Build your own using a combination of tools. Common for early-stage startups.
                </p>

                <div className="bg-white p-4 rounded-lg border mb-4">
                  <h4 className="font-bold mb-3">Minimal Service Catalog Stack</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded border-l-4 border-indigo-400">
                      <div className="font-bold mb-1">📋 Service Registry</div>
                      <div className="text-sm text-slate-600">
                        services.yaml in Git repo (YAML file listing all services)
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border-l-4 border-indigo-400">
                      <div className="font-bold mb-1">📚 API Documentation</div>
                      <div className="text-sm text-slate-600">
                        OpenAPI (Swagger) specs + Redoc/Swagger UI
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border-l-4 border-indigo-400">
                      <div className="font-bold mb-1">📞 On-call & Ownership</div>
                      <div className="text-sm text-slate-600">
                        PagerDuty or OpsGenie for on-call rotations
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border-l-4 border-indigo-400">
                      <div className="font-bold mb-1">🔗 Dependency Graph</div>
                      <div className="text-sm text-slate-600">
                        Service mesh (Istio, Linkerd) visualizations
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-xs mb-4">
                  <div className="text-slate-400 mb-2"># services.yaml (in Git)</div>
                  <pre>{`services:
  - name: payment-service
    owner: payments-team@example.com
    repo: github.com/myorg/payment-service
    on_call: pagerduty/payments
    sla: 99.9%
    dependencies:
      - user-service
      - billing-db
    endpoints:
      - POST /api/v1/payments
      - GET /api/v1/payments/:id`}</pre>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-bold mb-2 text-green-700">✅ Pros</h4>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• Zero cost</li>
                      <li>• Full control and customization</li>
                      <li>• No vendor lock-in</li>
                      <li>• Good for {"<"}20 services</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-bold mb-2 text-red-700">❌ Cons</h4>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• Manual maintenance overhead</li>
                      <li>• No search or UI</li>
                      <li>• Doesn't scale beyond 50 services</li>
                      <li>• No automated discovery</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Service Metadata Schema */}
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-2xl">Service Metadata Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            Regardless of the platform, your catalog should track these essential fields:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border">
              <h4 className="font-bold mb-3">🔑 Core Metadata</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">Required</Badge>
                  <div>
                    <strong>Name:</strong> service-name
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">Required</Badge>
                  <div>
                    <strong>Owner:</strong> team-name or email
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">Required</Badge>
                  <div>
                    <strong>Type:</strong> api, database, job, frontend
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">Required</Badge>
                  <div>
                    <strong>Lifecycle:</strong> production, staging, deprecated
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border">
              <h4 className="font-bold mb-3">🔗 Integration Links</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs bg-blue-50">Repo</Badge>
                  <div>GitHub/GitLab URL</div>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs bg-green-50">Docs</Badge>
                  <div>README, Wiki, or Confluence</div>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs bg-orange-50">Alerts</Badge>
                  <div>PagerDuty, OpsGenie</div>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs bg-purple-50">Metrics</Badge>
                  <div>Grafana dashboard URL</div>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border">
              <h4 className="font-bold mb-3">🛡️ Compliance & Quality</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <div>
                    <strong>SLA:</strong> 99.9%, 99.95%, 99.99%
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <div>
                    <strong>Security Review:</strong> Date + status
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <div>
                    <strong>Data Classification:</strong> Public, Internal, Confidential
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <div>
                    <strong>Test Coverage:</strong> {">"} 80% required
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border">
              <h4 className="font-bold mb-3">🔄 Dependencies</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <div>
                    <strong>Depends On:</strong> [user-service, auth-db]
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <div>
                    <strong>Consumed By:</strong> [frontend, mobile-app]
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <div>
                    <strong>APIs:</strong> OpenAPI spec URL
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <div>
                    <strong>Infra:</strong> AWS, GCP, on-prem
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Roadmap */}
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-2xl">Implementation Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold mb-1">Start Simple (Week 1-2)</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Create a services.yaml file in Git. List all services with owners and repos.
                </p>
                <Badge variant="outline">Deliverable: Service inventory</Badge>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold mb-1">Add API Documentation (Week 3-4)</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Generate OpenAPI specs for all REST APIs. Host with Swagger UI or Redoc.
                </p>
                <Badge variant="outline">Deliverable: Centralized API docs</Badge>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold mb-1">Deploy Backstage or SaaS (Month 2-3)</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Choose between self-hosted Backstage or SaaS (Cortex, Port). Migrate services.yaml data.
                </p>
                <Badge variant="outline">Deliverable: Developer portal with search</Badge>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-bold mb-1">Add Scorecards & Automation (Month 4+)</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Define quality standards (SLA, test coverage, security). Add software templates for self-service.
                </p>
                <Badge variant="outline">Deliverable: Automated compliance tracking</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Service Catalog Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-400 text-green-900 flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold mb-1">Enforce at CI/CD</h4>
                  <p className="text-sm text-slate-200">
                    Block deployments if service isn't registered in catalog
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-400 text-green-900 flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold mb-1">Single Source of Truth</h4>
                  <p className="text-sm text-slate-200">
                    Catalog should auto-sync from Git, not manually updated
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-400 text-green-900 flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold mb-1">Gamify Quality</h4>
                  <p className="text-sm text-slate-200">
                    Show scorecard leaderboards to motivate teams
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-400 text-red-900 flex items-center justify-center font-bold flex-shrink-0">
                  ✗
                </div>
                <div>
                  <h4 className="font-bold mb-1">Don't Make It Optional</h4>
                  <p className="text-sm text-slate-200">
                    If catalog is optional, it'll become stale within weeks
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-400 text-red-900 flex items-center justify-center font-bold flex-shrink-0">
                  ✗
                </div>
                <div>
                  <h4 className="font-bold mb-1">Avoid Manual Updates</h4>
                  <p className="text-sm text-slate-200">
                    Auto-discover services from repos, service mesh, APM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-400 text-red-900 flex items-center justify-center font-bold flex-shrink-0">
                  ✗
                </div>
                <div>
                  <h4 className="font-bold mb-1">Don't Boil the Ocean</h4>
                  <p className="text-sm text-slate-200">
                    Start with core metadata, add fields incrementally
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
