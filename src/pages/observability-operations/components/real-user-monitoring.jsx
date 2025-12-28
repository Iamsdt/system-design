import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * RealUserMonitoring Component
 * Frontend performance, Core Web Vitals, session replay, and error tracking
 */
export default function RealUserMonitoring() {
  const coreWebVitals = [
    {
      metric: "LCP (Largest Contentful Paint)",
      description: "Measures loading performance - when the largest content element becomes visible",
      good: "< 2.5s",
      needsImprovement: "2.5s - 4s",
      poor: "> 4s",
      howToImprove: [
        "Optimize images (WebP, lazy loading)",
        "Use CDN for static assets",
        "Minimize render-blocking resources",
        "Improve server response time (TTFB)"
      ]
    },
    {
      metric: "FID (First Input Delay)",
      description: "Measures interactivity - time from user's first interaction to browser response",
      good: "< 100ms",
      needsImprovement: "100ms - 300ms",
      poor: "> 300ms",
      howToImprove: [
        "Reduce JavaScript execution time",
        "Split code and defer non-critical JS",
        "Use web workers for heavy computation",
        "Minimize main thread work"
      ]
    },
    {
      metric: "CLS (Cumulative Layout Shift)",
      description: "Measures visual stability - sum of all unexpected layout shifts",
      good: "< 0.1",
      needsImprovement: "0.1 - 0.25",
      poor: "> 0.25",
      howToImprove: [
        "Set explicit dimensions for images/videos",
        "Avoid inserting content above existing content",
        "Use transform animations instead of layout properties",
        "Preload fonts to prevent FOUT/FOIT"
      ]
    },
    {
      metric: "INP (Interaction to Next Paint)",
      description: "Measures responsiveness - latency of all user interactions (replacing FID)",
      good: "< 200ms",
      needsImprovement: "200ms - 500ms",
      poor: "> 500ms",
      howToImprove: [
        "Break up long tasks",
        "Optimize event handlers",
        "Use requestIdleCallback for non-urgent work",
        "Debounce expensive operations"
      ]
    }
  ]

  const rumTools = [
    {
      tool: "Google Analytics 4",
      type: "Free",
      strengths: ["Free", "Web Vitals built-in", "Large market share", "Easy integration"],
      limitations: ["Limited technical depth", "Privacy concerns", "Generic insights"],
      bestFor: "Basic analytics and Web Vitals tracking"
    },
    {
      tool: "Datadog RUM",
      type: "Commercial",
      strengths: ["Deep technical insights", "Session replay", "Integration with APM", "Error tracking"],
      limitations: ["Expensive", "Complex setup", "Vendor lock-in"],
      bestFor: "Enterprises needing full observability stack"
    },
    {
      tool: "Sentry",
      type: "Commercial/OSS",
      strengths: ["Excellent error tracking", "Source map support", "Release tracking", "Affordable"],
      limitations: ["Limited performance monitoring", "No session replay in OSS", "Basic RUM"],
      bestFor: "Error monitoring with some performance insights"
    },
    {
      tool: "LogRocket",
      type: "Commercial",
      strengths: ["Amazing session replay", "Console logs capture", "Network inspection", "Redux integration"],
      limitations: ["Expensive", "Performance impact", "Privacy concerns"],
      bestFor: "Debugging complex frontend issues"
    },
    {
      tool: "New Relic Browser",
      type: "Commercial",
      strengths: ["Full-stack visibility", "AJAX tracking", "SPA support", "Flexible pricing"],
      limitations: ["Can be costly at scale", "Requires New Relic ecosystem"],
      bestFor: "New Relic users wanting frontend monitoring"
    },
    {
      tool: "Grafana Faro",
      type: "Open Source",
      strengths: ["Open source", "Integrates with Grafana", "Privacy-friendly", "Self-hosted"],
      limitations: ["Newer/less mature", "Limited features", "Requires Grafana setup"],
      bestFor: "Teams already using Grafana stack"
    }
  ]

  const implementationSteps = `// Step 1: Install RUM SDK
npm install @datadog/browser-rum

// Step 2: Initialize RUM
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: 'your-app-id',
  clientToken: 'your-client-token',
  site: 'datadoghq.com',
  service: 'my-web-app',
  env: 'production',
  version: '1.0.0',
  
  // Session Sampling
  sessionSampleRate: 100, // 100% of sessions
  sessionReplaySampleRate: 20, // 20% get session replay
  
  // Track user interactions
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  
  // Default privacy settings
  defaultPrivacyLevel: 'mask-user-input',
  
  // Performance tracking
  trackViewsManually: false,
  trackFrustrations: true
});

// Step 3: Track custom events
datadogRum.addAction('purchase', {
  amount: 99.99,
  currency: 'USD',
  productId: '12345'
});

// Step 4: Add user context
datadogRum.setUser({
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  plan: 'premium'
});

// Step 5: Track errors
try {
  // risky operation
} catch (error) {
  datadogRum.addError(error, {
    source: 'payment-processing',
    tags: { critical: true }
  });
}`

  const privacyBestPractices = [
    {
      concern: "PII in Session Replays",
      risk: "Recording sensitive user data (passwords, credit cards, SSN)",
      solution: "Use data masking and configure privacy levels",
      implementation: "defaultPrivacyLevel: 'mask-user-input' or add data-dd-privacy=\"mask\" attributes"
    },
    {
      concern: "GDPR Compliance",
      risk: "Tracking users without consent",
      solution: "Implement consent management, allow opt-out",
      implementation: "Initialize RUM only after user consent, provide opt-out mechanism"
    },
    {
      concern: "Console Logs Exposure",
      risk: "Sensitive data in console.log() captured by RUM",
      solution: "Sanitize logs, avoid logging sensitive data",
      implementation: "Filter console logs before sending, use separate logging for debug data"
    },
    {
      concern: "Network Request Details",
      risk: "API keys, tokens in request URLs or headers",
      solution: "Configure request filtering and header redaction",
      implementation: "beforeSend: (event) => { /* sanitize event */ return event; }"
    }
  ]

  const performanceOptimization = [
    {
      technique: "Lazy Load RUM SDK",
      description: "Load RUM SDK asynchronously after page becomes interactive",
      impact: "Reduces initial bundle size by 20-50KB",
      code: `// Load RUM after page interactive
if (document.readyState === 'complete') {
  loadRUM();
} else {
  window.addEventListener('load', loadRUM);
}`
    },
    {
      technique: "Sampling Strategy",
      description: "Don't track 100% of users - use sampling",
      impact: "Reduces cost by 50-90% with minimal data loss",
      code: `sessionSampleRate: 10, // Track 10% of sessions
sessionReplaySampleRate: 5, // Record 5% of sessions
errorSampleRate: 100 // Always track errors`
    },
    {
      technique: "Conditional Loading",
      description: "Load RUM only in production, not in development",
      impact: "Faster dev experience, no pollution of prod data",
      code: `if (process.env.NODE_ENV === 'production') {
  // Initialize RUM
}`
    },
    {
      technique: "Batch Events",
      description: "Buffer and batch events before sending",
      impact: "Reduces network requests by 80%",
      code: `batchEventsInterval: 5000, // Send every 5 seconds
maxBatchSize: 50 // Or when 50 events accumulated`
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">Real User Monitoring (RUM)</h3>
        <p className="text-lg text-slate-600">
          Monitor actual user experiences, Core Web Vitals, and frontend performance
        </p>
      </div>

      {/* RUM vs Synthetic */}
      <Card>
        <CardHeader>
          <CardTitle>RUM vs Synthetic Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
              <h5 className="text-xl font-bold text-green-900 mb-4">Real User Monitoring (RUM)</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Measures actual user experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Captures real device/network conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Identifies regional performance issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Provides business metrics (conversion, engagement)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Requires actual traffic to detect issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Privacy concerns with user data</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
              <h5 className="text-xl font-bold text-blue-900 mb-4">Synthetic Monitoring</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Proactive 24/7 monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Consistent baseline for comparison</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Works with low/no traffic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>No privacy concerns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Doesn't reflect real user experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">✗</span>
                  <span>Limited coverage of all scenarios</span>
                </li>
              </ul>
            </div>
          </div>

          <Alert className="mt-6 bg-purple-50 border-purple-200">
            <AlertDescription>
              <strong>💡 Best Practice:</strong> Use both! Synthetic monitoring for proactive detection, 
              RUM for understanding real user impact and experience.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-6">
            Google's Core Web Vitals are key metrics for user experience and SEO ranking.
          </p>

          <div className="space-y-6">
            {coreWebVitals.map((vital, idx) => (
              <div key={idx} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="text-xl font-bold text-slate-900">{vital.metric}</h5>
                    <p className="text-slate-600 mt-1">{vital.description}</p>
                  </div>
                  <Badge>Vital {idx + 1}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-sm text-green-800 font-semibold">Good</div>
                    <div className="text-lg font-bold text-green-900">{vital.good}</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <div className="text-sm text-yellow-800 font-semibold">Needs Improvement</div>
                    <div className="text-lg font-bold text-yellow-900">{vital.needsImprovement}</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div className="text-sm text-red-800 font-semibold">Poor</div>
                    <div className="text-lg font-bold text-red-900">{vital.poor}</div>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-900 mb-2">How to Improve</div>
                  <ul className="space-y-1">
                    {vital.howToImprove.map((tip, i) => (
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

      {/* RUM Tools Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>RUM Tools Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rumTools.map((tool, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-lg font-bold text-slate-900">{tool.tool}</h5>
                  <Badge variant={tool.type === "Free" ? "default" : tool.type === "Open Source" ? "secondary" : "outline"}>
                    {tool.type}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-green-700 mb-2">Strengths</div>
                    <ul className="space-y-1 text-sm">
                      {tool.strengths.map((strength, i) => (
                        <li key={i} className="text-slate-700">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-red-700 mb-2">Limitations</div>
                    <ul className="space-y-1 text-sm">
                      {tool.limitations.map((limitation, i) => (
                        <li key={i} className="text-slate-700">• {limitation}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-700 mb-2">Best For</div>
                    <div className="text-sm text-slate-700">{tool.bestFor}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm">
            <code>{implementationSteps}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Privacy Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertDescription>
              <strong>⚠️ Important:</strong> RUM tools can capture sensitive user data. 
              Implement proper data masking and obtain user consent where required.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {privacyBestPractices.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <h5 className="text-lg font-bold text-slate-900 mb-3">{item.concern}</h5>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-red-800 mb-1">Risk</div>
                    <div className="text-sm text-red-900">{item.risk}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-green-800 mb-1">Solution</div>
                    <div className="text-sm text-green-900">{item.solution}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-blue-800 mb-1">Implementation</div>
                    <div className="text-sm text-blue-900">{item.implementation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Optimization */}
      <Card>
        <CardHeader>
          <CardTitle>Optimizing RUM Performance Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-6">
            RUM SDKs add overhead. Here's how to minimize the impact on user experience:
          </p>

          <div className="space-y-4">
            {performanceOptimization.map((opt, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="text-lg font-bold text-slate-900">{opt.technique}</h5>
                    <p className="text-slate-600 mt-1">{opt.description}</p>
                  </div>
                  <Badge className="bg-green-600 text-white shrink-0">{opt.impact}</Badge>
                </div>

                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{opt.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics to Track */}
      <Card>
        <CardHeader>
          <CardTitle>Key RUM Metrics to Track</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h5 className="font-semibold text-slate-900 mb-3">Performance Metrics</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Page load time (PLT)</li>
                <li>• Time to first byte (TTFB)</li>
                <li>• First contentful paint (FCP)</li>
                <li>• Time to interactive (TTI)</li>
                <li>• Total blocking time (TBT)</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h5 className="font-semibold text-slate-900 mb-3">User Experience Metrics</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Error rate by page</li>
                <li>• User frustration signals (rage clicks)</li>
                <li>• Session duration</li>
                <li>• Bounce rate by page speed</li>
                <li>• Conversion funnel drop-offs</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h5 className="font-semibold text-slate-900 mb-3">Resource Metrics</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• API response times</li>
                <li>• Third-party script impact</li>
                <li>• Image load times</li>
                <li>• Font loading performance</li>
                <li>• JavaScript bundle size impact</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h5 className="font-semibold text-slate-900 mb-3">Business Metrics</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Conversion rate by performance</li>
                <li>• Revenue impact of slow pages</li>
                <li>• User retention vs page speed</li>
                <li>• Feature adoption rates</li>
                <li>• A/B test performance correlation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
