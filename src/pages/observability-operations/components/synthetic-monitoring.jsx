import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * SyntheticMonitoring Component  
 * Uptime checks, transaction monitoring, and API testing
 */
export default function SyntheticMonitoring() {
  const [activeTest, setActiveTest] = useState(null)

  const monitoringTypes = [
    {
      type: "Uptime / Ping Monitoring",
      icon: "🏓",
      description: "Simple HTTP/HTTPS checks to verify service availability",
      frequency: "Every 1-5 minutes",
      useCases: ["Website availability", "API endpoint health", "DNS resolution", "SSL certificate monitoring"],
      tools: ["Pingdom", "UptimeRobot", "StatusCake", "Datadog Synthetics"],
      example: `// Simple uptime check configuration
{
  "name": "API Health Check",
  "url": "https://api.example.com/health",
  "method": "GET",
  "frequency": "1m",
  "locations": ["us-east", "eu-west", "ap-south"],
  "assertions": {
    "statusCode": 200,
    "responseTime": "<500ms"
  },
  "alerts": {
    "downtime": "3 consecutive failures",
    "degraded": "response time > 1s"
  }
}`
    },
    {
      type: "Transaction / Browser Monitoring",
      icon: "🌐",
      description: "Simulate multi-step user journeys through your application",
      frequency: "Every 5-15 minutes",
      useCases: ["Login flows", "Checkout process", "Form submissions", "Multi-page workflows"],
      tools: ["Selenium", "Playwright", "Datadog Browser Tests", "New Relic Synthetics"],
      example: `// Browser test example (Playwright)
async function checkoutFlow(page) {
  // Step 1: Navigate to homepage
  await page.goto('https://example.com');
  await page.waitForLoadState('networkidle');
  
  // Step 2: Search for product
  await page.fill('[data-test="search"]', 'laptop');
  await page.click('[data-test="search-btn"]');
  await page.waitForSelector('[data-test="product"]');
  
  // Step 3: Add to cart
  await page.click('[data-test="add-to-cart"]');
  await page.waitForSelector('[data-test="cart-count"]');
  
  // Step 4: Checkout
  await page.click('[data-test="checkout"]');
  await page.fill('[data-test="email"]', 'test@example.com');
  
  // Assertions
  const total = await page.textContent('[data-test="total"]');
  expect(total).toMatch(/\\$\\d+\\.\\d{2}/);
}`
    },
    {
      type: "API Monitoring",
      icon: "🔌",
      description: "Test API endpoints with various HTTP methods and payloads",
      frequency: "Every 1-10 minutes",
      useCases: ["REST API health", "GraphQL queries", "Authentication flows", "Rate limit testing"],
      tools: ["Postman Monitors", "Runscope", "Assertible", "Checkly"],
      example: `// API test chain
{
  "tests": [
    {
      "name": "Get auth token",
      "request": {
        "method": "POST",
        "url": "https://api.example.com/auth/login",
        "body": {"username": "test", "password": "test123"},
        "headers": {"Content-Type": "application/json"}
      },
      "assertions": [
        {"statusCode": 200},
        {"body.token": "exists"}
      ],
      "extract": {
        "token": "body.token"
      }
    },
    {
      "name": "Get user profile",
      "request": {
        "method": "GET",
        "url": "https://api.example.com/users/me",
        "headers": {
          "Authorization": "Bearer {{token}}"
        }
      },
      "assertions": [
        {"statusCode": 200},
        {"body.email": "equals 'test@example.com'"},
        {"responseTime": "<500ms"}
      ]
    }
  ]
}`
    },
    {
      type: "Multi-Location Monitoring",
      icon: "🌍",
      description: "Run tests from multiple geographic locations simultaneously",
      frequency: "Continuous",
      useCases: ["Global CDN performance", "Regional failover testing", "Geo-blocking verification", "Latency measurement"],
      tools: ["Catchpoint", "ThousandEyes", "Datadog Synthetics", "GTmetrix"],
      example: `// Multi-location test configuration
{
  "name": "Global API Performance",
  "locations": [
    {"region": "us-east-1", "weight": 40},
    {"region": "eu-west-1", "weight": 30},
    {"region": "ap-southeast-1", "weight": 20},
    {"region": "sa-east-1", "weight": 10}
  ],
  "test": {
    "url": "https://api.example.com/products",
    "method": "GET"
  },
  "slo": {
    "availability": "99.9%",
    "p95_latency": "500ms",
    "p99_latency": "1000ms"
  },
  "alerts": {
    "location_down": "Any location fails 3 consecutive times",
    "high_latency": "p95 > 1000ms for 5 minutes"
  }
}`
    }
  ]

  const bestPractices = [
    {
      practice: "Test from User Perspective",
      description: "Run tests from actual user locations and networks",
      implementation: "Use distributed test locations matching your user base geography",
      impact: "Detects regional issues before users complain"
    },
    {
      practice: "Test Real User Flows",
      description: "Monitor critical business transactions, not just endpoints",
      implementation: "Create synthetic tests for signup, purchase, checkout flows",
      impact: "Ensures revenue-generating features are always working"
    },
    {
      practice: "Set Appropriate Intervals",
      description: "Balance detection speed with cost and noise",
      implementation: "Critical endpoints: 1-5min, Less critical: 15-60min",
      impact: "Early detection without alert fatigue"
    },
    {
      practice: "Use Realistic Test Data",
      description: "Test with production-like data and scenarios",
      implementation: "Maintain test accounts, sample products, realistic payloads",
      impact: "Catch data-specific bugs and edge cases"
    },
    {
      practice: "Chain Tests Logically",
      description: "Create dependencies between tests (login → action → logout)",
      implementation: "Extract tokens/session data from one test to use in next",
      impact: "Test complete workflows, not isolated actions"
    },
    {
      practice: "Monitor Third-Party Dependencies",
      description: "Test external APIs and services you depend on",
      implementation: "Add synthetic checks for payment gateways, auth providers, etc.",
      impact: "Proactive notification of third-party outages"
    }
  ]

  const comparisonTable = [
    {
      tool: "Pingdom",
      type: "Uptime",
      locations: "70+",
      browserTests: "Yes",
      apiTests: "Limited",
      pricing: "$10-300/month",
      bestFor: "Simple uptime monitoring"
    },
    {
      tool: "UptimeRobot",
      type: "Uptime",
      locations: "15+",
      browserTests: "No",
      apiTests: "Yes",
      pricing: "Free-$58/month",
      bestFor: "Budget-friendly uptime"
    },
    {
      tool: "Datadog Synthetics",
      type: "Full Suite",
      locations: "30+",
      browserTests: "Yes",
      apiTests: "Yes",
      pricing: "$5/10k API tests",
      bestFor: "Integrated with APM"
    },
    {
      tool: "New Relic Synthetics",
      type: "Full Suite",
      locations: "20+",
      browserTests: "Yes",
      apiTests: "Yes",
      pricing: "$0.50/check",
      bestFor: "New Relic users"
    },
    {
      tool: "Checkly",
      type: "Full Suite",
      locations: "20+",
      browserTests: "Yes (Playwright)",
      apiTests: "Yes",
      pricing: "$7-299/month",
      bestFor: "Developer-first, code-based"
    },
    {
      tool: "Postman Monitors",
      type: "API Only",
      locations: "10+",
      browserTests: "No",
      apiTests: "Yes",
      pricing: "Free-$49/month",
      bestFor: "Existing Postman users"
    }
  ]

  const alertStrategies = [
    {
      strategy: "Failure Threshold",
      description: "Alert only after N consecutive failures",
      config: "failures_before_alert: 3",
      rationale: "Prevents false alerts from transient network issues",
      example: "Alert if 3 consecutive checks fail (not just 1)"
    },
    {
      strategy: "Multi-Location Consensus",
      description: "Alert only if multiple locations fail simultaneously",
      config: "min_failed_locations: 2",
      rationale: "Distinguishes between regional and global outages",
      example: "Alert if 2+ out of 5 locations fail"
    },
    {
      strategy: "Degradation Detection",
      description: "Alert on performance degradation before complete failure",
      config: "warning_threshold: 500ms, critical_threshold: 1000ms",
      rationale: "Proactive alerting before user impact",
      example: "Warn at 500ms, critical at 1000ms response time"
    },
    {
      strategy: "Time-Based Suppression",
      description: "Suppress alerts during maintenance windows",
      config: "maintenance_window: '02:00-04:00 UTC'",
      rationale: "Prevents noise during planned maintenance",
      example: "No alerts during nightly deployments"
    }
  ]

  const integrationWorkflow = `// Example: Integrate synthetic monitoring with incident management
  
1. Synthetic Test Fails
   ↓
2. Check Failure Count & Locations
   ↓
3. If threshold exceeded:
   - Create PagerDuty/OpsGenie incident
   - Post to Slack #incidents channel
   - Update status page (StatusPage.io)
   ↓
4. Correlate with other signals:
   - Check APM for errors
   - Check logs for exceptions
   - Check infrastructure metrics
   ↓
5. Intelligent Routing:
   - API failures → Backend team
   - Browser test failures → Frontend team
   - Database errors → DBA team
   ↓
6. Auto-Remediation (if configured):
   - Restart service
   - Scale out instances
   - Switch to backup region`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">Synthetic Monitoring</h3>
        <p className="text-lg text-slate-600">
          Proactively monitor availability and performance by simulating user interactions
        </p>
      </div>

      {/* What is Synthetic Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>What is Synthetic Monitoring?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 mb-4">
            Synthetic monitoring simulates user behavior by running automated tests against your application 
            from various locations worldwide. Unlike RUM (Real User Monitoring), which relies on actual users, 
            synthetic monitoring proactively detects issues 24/7.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">✓ Advantages</h5>
              <ul className="space-y-1 text-sm text-green-900">
                <li>• Detects issues before users are affected</li>
                <li>• Tests from multiple geographic locations</li>
                <li>• 24/7 monitoring, even with no traffic</li>
                <li>• Baseline for performance benchmarking</li>
                <li>• Verifies SLAs and availability targets</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h5 className="font-semibold text-red-800 mb-2">✗ Limitations</h5>
              <ul className="space-y-1 text-sm text-red-900">
                <li>• Doesn't capture real user experience</li>
                <li>• Can be expensive at scale</li>
                <li>• May not test all edge cases</li>
                <li>• Requires maintenance of test scripts</li>
                <li>• Synthetic traffic affects analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Types */}
      <div className="space-y-6">
        <h4 className="text-2xl font-bold text-slate-900">Types of Synthetic Monitoring</h4>
        
        {monitoringTypes.map((type, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{type.icon}</span>
                <CardTitle>{type.type}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">{type.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-slate-900 mb-2">Typical Frequency</div>
                  <Badge variant="outline">{type.frequency}</Badge>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 mb-2">Popular Tools</div>
                  <div className="flex flex-wrap gap-2">
                    {type.tools.map((tool, i) => (
                      <Badge key={i} variant="secondary">{tool}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-900 mb-2">Common Use Cases</div>
                <div className="flex flex-wrap gap-2">
                  {type.useCases.map((useCase, i) => (
                    <Badge key={i} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {useCase}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-900 mb-2">Configuration Example</div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{type.example}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tool Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Tool Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border p-3 text-left font-semibold">Tool</th>
                  <th className="border p-3 text-left font-semibold">Type</th>
                  <th className="border p-3 text-center font-semibold">Locations</th>
                  <th className="border p-3 text-center font-semibold">Browser Tests</th>
                  <th className="border p-3 text-center font-semibold">API Tests</th>
                  <th className="border p-3 text-left font-semibold">Pricing</th>
                  <th className="border p-3 text-left font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((tool, idx) => (
                  <tr key={idx}>
                    <td className="border p-3 font-semibold">{tool.tool}</td>
                    <td className="border p-3">{tool.type}</td>
                    <td className="border p-3 text-center">{tool.locations}</td>
                    <td className="border p-3 text-center">{tool.browserTests}</td>
                    <td className="border p-3 text-center">{tool.apiTests}</td>
                    <td className="border p-3">{tool.pricing}</td>
                    <td className="border p-3">{tool.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <h5 className="text-lg font-bold text-slate-900 mb-2">{item.practice}</h5>
                <p className="text-slate-600 mb-3">{item.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-blue-800 mb-1">Implementation</div>
                    <div className="text-sm text-blue-900">{item.implementation}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-green-800 mb-1">Impact</div>
                    <div className="text-sm text-green-900">{item.impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Alerting Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertStrategies.map((strategy, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="text-lg font-bold text-slate-900">{strategy.strategy}</h5>
                  <Badge>Strategy {idx + 1}</Badge>
                </div>
                
                <p className="text-slate-600 mb-3">{strategy.description}</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-1">Configuration</div>
                    <code className="text-xs bg-white p-2 rounded block">{strategy.config}</code>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-1">Rationale</div>
                    <div className="text-sm text-slate-600">{strategy.rationale}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-1">Example</div>
                    <div className="text-sm text-slate-600">{strategy.example}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Integration with Incident Management</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm">
            <code>{integrationWorkflow}</code>
          </pre>

          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <AlertDescription>
              <strong>💡 Pro Tip:</strong> Integrate synthetic monitoring with your entire observability stack. 
              Correlate synthetic test failures with APM traces, logs, and infrastructure metrics for faster root cause analysis.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* ROI Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>ROI: Why Synthetic Monitoring Pays for Itself</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h5 className="font-semibold text-red-800 mb-3">Cost of Downtime (Example)</h5>
              <ul className="space-y-2 text-sm text-red-900">
                <li>• 1 hour outage: <strong>$10,000-100,000</strong></li>
                <li>• Lost revenue</li>
                <li>• Customer churn</li>
                <li>• Brand reputation damage</li>
                <li>• SLA penalty payments</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h5 className="font-semibold text-green-800 mb-3">Synthetic Monitoring Cost</h5>
              <ul className="space-y-2 text-sm text-green-900">
                <li>• Monthly cost: <strong>$100-1,000</strong></li>
                <li>• Early detection (5-30 min faster)</li>
                <li>• Prevents 2-3 incidents/year</li>
                <li>• ROI: <strong>20x-100x</strong></li>
                <li>• Peace of mind: Priceless</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="font-semibold text-yellow-900 mb-2">Typical Detection Time Improvement</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-yellow-800">Without Synthetic Monitoring:</div>
                <div className="text-2xl font-bold text-yellow-900">15-60 minutes</div>
                <div className="text-yellow-700">(User reports issue)</div>
              </div>
              <div>
                <div className="text-yellow-800">With Synthetic Monitoring:</div>
                <div className="text-2xl font-bold text-yellow-900">1-5 minutes</div>
                <div className="text-yellow-700">(Automated detection)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
