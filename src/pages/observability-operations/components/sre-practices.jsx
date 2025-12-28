import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * SREPractices Component
 * Toil reduction, error budgets, postmortem culture, and SRE principles
 */
export default function SREPractices() {
  const srePrinciples = [
    {
      principle: "Embrace Risk",
      description: "100% uptime is impossible and unnecessary. Define acceptable risk levels.",
      implementation: "Set SLOs (e.g., 99.9% availability = 43min downtime/month allowed)",
      benefit: "Faster feature velocity, realistic expectations"
    },
    {
      principle: "Service Level Objectives (SLOs)",
      description: "Precise numerical targets for service reliability",
      implementation: "API latency p99 < 200ms, Error rate < 0.1%",
      benefit: "Clear targets, measurable reliability"
    },
    {
      principle: "Error Budgets",
      description: "Amount of unreliability allowed before feature freezes",
      implementation: "SLO: 99.9% → Error budget: 0.1% (43min/month)",
      benefit: "Balance innovation vs stability"
    },
    {
      principle: "Toil Reduction",
      description: "Eliminate repetitive manual operational work",
      implementation: "Automate deployments, runbooks, incident response",
      benefit: "Engineers focus on high-value work"
    },
    {
      principle: "Monitoring & Alerting",
      description: "Proactive detection of SLO violations",
      implementation: "SLO-based alerts, not threshold-based",
      benefit: "Meaningful alerts, reduced noise"
    },
    {
      principle: "Blameless Postmortems",
      description: "Learn from failures without blaming individuals",
      implementation: "Focus on systems and processes, not people",
      benefit: "Psychological safety, continuous improvement"
    }
  ]

  const errorBudgetExample = {
    slo: "99.9% availability",
    calculation: `Total minutes per month: 43,800
SLO: 99.9% uptime
Allowed downtime: 43,800 × 0.1% = 43.8 minutes per month

Week 1: 10 min outage (23% budget consumed)
Week 2: 15 min outage (34% budget consumed) 
Week 3: 20 min outage (46% budget consumed)
Week 4: 5 min outage (11% budget consumed)

Total: 50 minutes downtime
Budget status: 114% consumed (6.2 min over budget)
Action: Feature freeze until reliability improved`,
    policiesByBudget: [
      {
        budgetLeft: "> 50%",
        velocity: "🟢 Full speed",
        actions: ["Ship new features rapidly", "Take calculated risks", "Experiment freely"]
      },
      {
        budgetLeft: "25-50%",
        velocity: "🟡 Cautious",
        actions: ["Increase testing rigor", "Prioritize reliability work", "Review change velocity"]
      },
      {
        budgetLeft: "10-25%",
        velocity: "🟠 Conservative",
        actions: ["Only critical changes", "Enhanced monitoring", "Focus on stability"]
      },
      {
        budgetLeft: "< 10% or Exhausted",
        velocity: "🔴 Feature freeze",
        actions: ["Stop feature development", "Fix reliability issues", "Improve monitoring"]
      }
    ]
  }

  const toilExamples = [
    {
      category: "Manual Toil",
      examples: [
        "Manually deploying releases",
        "Restarting servers when they crash",
        "Rotating credentials manually",
        "Provisioning new users/resources",
        "Creating reports by hand"
      ],
      automation: [
        "CI/CD pipeline",
        "Auto-healing with health checks",
        "Automated secret rotation",
        "Self-service portals",
        "Scheduled automated reports"
      ],
      timeSaved: "70-90%"
    },
    {
      category: "Reactive Toil",
      examples: [
        "Responding to same alerts repeatedly",
        "Debugging same issues over and over",
        "Manual log searching for errors",
        "Scaling infrastructure reactively",
        "Firefighting production issues"
      ],
      automation: [
        "Auto-remediation scripts",
        "Improved monitoring/alerting",
        "Centralized logging with alerts",
        "Auto-scaling rules",
        "Runbooks and playbooks"
      ],
      timeSaved: "50-70%"
    },
    {
      category: "Preventable Toil",
      examples: [
        "Dealing with poor code quality",
        "Working around flaky tests",
        "Managing tech debt",
        "Handling configuration drift",
        "Supporting legacy systems"
      ],
      automation: [
        "Code review standards",
        "Test infrastructure investment",
        "Scheduled tech debt sprints",
        "Infrastructure as Code",
        "Deprecation roadmaps"
      ],
      timeSaved: "40-60%"
    }
  ]

  const postmortemTemplate = `# Incident Postmortem: [Title]

**Date:** 2024-01-15
**Duration:** 2 hours 35 minutes (14:25 - 17:00 UTC)
**Severity:** SEV-2 (Major service degradation)
**Impact:** 45% of API requests returning 5xx errors

## Summary
Brief description of what happened and the customer impact.

## Timeline (UTC)
- **14:25** - Monitoring alerts: elevated 5xx error rate (15%)
- **14:30** - On-call engineer investigates
- **14:45** - Identified: database connection pool exhausted
- **15:00** - Attempted fix: increased pool size (unsuccessful)
- **15:30** - Root cause identified: memory leak in new code
- **16:00** - Hotfix deployed to rollback problematic code
- **16:30** - Service recovering, error rate at 5%
- **17:00** - Full recovery confirmed

## Root Cause
A memory leak in the new caching layer (v2.5.0 deployed at 14:00) 
caused gradual memory exhaustion, leading to connection pool depletion.

## Impact
- **Users Affected:** ~100,000 users (45% of traffic)
- **Failed Requests:** 2.3M API calls
- **Revenue Impact:** ~$15,000 in lost transactions
- **SLO Impact:** Consumed 38% of monthly error budget

## What Went Well
- Automated alerting detected issue within 5 minutes
- Clear escalation path followed
- Rollback process was smooth
- Communication to stakeholders was timely

## What Went Wrong
- Memory leak not caught in testing
- Load testing didn't simulate production traffic patterns
- Rollback took too long (90 minutes to decision)
- Insufficient monitoring of connection pool metrics

## Action Items
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| Add memory leak detection to CI pipeline | @dev-team | 2024-01-20 | P0 |
| Improve load testing to match production | @qa-team | 2024-01-25 | P0 |
| Add connection pool monitoring | @sre-team | 2024-01-18 | P0 |
| Document faster rollback procedures | @sre-team | 2024-01-22 | P1 |
| Automated canary deployment for caching layer | @platform | 2024-02-01 | P1 |

## Lessons Learned
- Production traffic patterns differ significantly from test environments
- Need better observability into resource utilization
- Rollback decision-making process needs improvement

---
*This postmortem is blameless. The goal is to learn and improve our systems.*`

  const sreMetrics = [
    {
      metric: "Toil Percentage",
      target: "< 50% of SRE time",
      measurement: "Time spent on manual ops work vs engineering",
      action: "If > 50%, prioritize automation projects"
    },
    {
      metric: "Time to Detect (TTD)",
      target: "< 5 minutes",
      measurement: "Time from issue start to alert",
      action: "Improve monitoring and alerting coverage"
    },
    {
      metric: "Time to Resolve (TTR)",
      target: "< SLO breach threshold",
      measurement: "Time from alert to full resolution",
      action: "Improve runbooks, automation, and training"
    },
    {
      metric: "Change Failure Rate",
      target: "< 15%",
      measurement: "% of deployments causing incidents",
      action: "Improve testing, canary deployments, rollback procedures"
    },
    {
      metric: "MTBF (Mean Time Between Failures)",
      target: "Increasing over time",
      measurement: "Average time between incidents",
      action: "Focus on reliability improvements and preventive work"
    },
    {
      metric: "On-Call Load",
      target: "< 2 pages per on-call shift",
      measurement: "Number of pages per engineer per shift",
      action: "Reduce alert noise, improve auto-remediation"
    }
  ]

  const sreVsDevOps = [
    {
      aspect: "Focus",
      sre: "Reliability as primary goal",
      devops: "Faster delivery as primary goal"
    },
    {
      aspect: "Approach",
      sre: "Engineering approach to operations",
      devops: "Cultural and organizational movement"
    },
    {
      aspect: "Error Budgets",
      sre: "Core concept, quantified",
      devops: "Not typically used"
    },
    {
      aspect: "Toil Reduction",
      sre: "Explicit goal (< 50% toil)",
      devops: "Automation encouraged but not quantified"
    },
    {
      aspect: "SLOs/SLIs",
      sre: "Fundamental practice",
      devops: "May or may not use"
    },
    {
      aspect: "On-Call",
      sre: "SRE team handles production",
      devops: "You build it, you run it"
    },
    {
      aspect: "Team Structure",
      sre: "Dedicated SRE team",
      devops: "DevOps engineers embedded in product teams"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">SRE Practices</h3>
        <p className="text-lg text-slate-600">
          Site Reliability Engineering principles, toil reduction, and error budgets
        </p>
      </div>

      {/* What is SRE */}
      <Card>
        <CardHeader>
          <CardTitle>What is Site Reliability Engineering (SRE)?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 mb-4">
            SRE is Google's approach to running production systems. It applies software engineering 
            principles to operations, treating reliability as a feature rather than an afterthought.
          </p>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <strong>Core Philosophy:</strong> "Hope is not a strategy. Reliability is a feature, 
              not an afterthought. Automate everything you can."
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* SRE Principles */}
      <Card>
        <CardHeader>
          <CardTitle>Core SRE Principles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {srePrinciples.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="text-lg font-bold text-slate-900">{item.principle}</h5>
                  <Badge>{idx + 1}</Badge>
                </div>
                
                <p className="text-slate-600 mb-4">{item.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-blue-800 mb-1">Implementation</div>
                    <div className="text-sm text-blue-900">{item.implementation}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-green-800 mb-1">Benefit</div>
                    <div className="text-sm text-green-900">{item.benefit}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Budgets */}
      <Card>
        <CardHeader>
          <CardTitle>Error Budgets in Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h5 className="font-semibold text-slate-900 mb-3">Example Calculation</h5>
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                {errorBudgetExample.calculation}
              </pre>
            </div>

            <div>
              <h5 className="font-semibold text-slate-900 mb-3">Error Budget Policies</h5>
              <div className="space-y-3">
                {errorBudgetExample.policiesByBudget.map((policy, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-slate-900">Error Budget Remaining: {policy.budgetLeft}</div>
                        <div className="text-sm text-slate-600">Development Velocity: {policy.velocity}</div>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {policy.actions.map((action, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-blue-600">→</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toil Reduction */}
      <Card>
        <CardHeader>
          <CardTitle>Toil Reduction</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertDescription>
              <strong>Definition:</strong> Toil is manual, repetitive, automatable work that doesn't 
              provide lasting value. SRE teams should spend {"<"} 50% of their time on toil.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {toilExamples.map((category, idx) => (
              <div key={idx} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xl font-bold text-slate-900">{category.category}</h5>
                  <Badge className="bg-green-600 text-white">Save {category.timeSaved}</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="font-semibold text-red-700 mb-2">❌ Toil Examples</h6>
                    <ul className="space-y-1">
                      {category.examples.map((example, i) => (
                        <li key={i} className="text-sm text-slate-700">• {example}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold text-green-700 mb-2">✅ Automation Solutions</h6>
                    <ul className="space-y-1">
                      {category.automation.map((solution, i) => (
                        <li key={i} className="text-sm text-slate-700">• {solution}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Postmortem Template */}
      <Card>
        <CardHeader>
          <CardTitle>Blameless Postmortem Template</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm">
            <code>{postmortemTemplate}</code>
          </pre>

          <Alert className="mt-6 bg-purple-50 border-purple-200">
            <AlertDescription>
              <strong>💜 Blameless Culture:</strong> Postmortems focus on learning and improving systems, 
              not punishing individuals. This creates psychological safety and encourages honest reporting.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* SRE Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key SRE Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sreMetrics.map((metric, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-slate-600">Metric</div>
                    <div className="font-semibold text-slate-900">{metric.metric}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Target</div>
                    <div className="font-semibold text-green-700">{metric.target}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Measurement</div>
                    <div className="text-sm text-slate-700">{metric.measurement}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Action if Off-Target</div>
                    <div className="text-sm text-slate-700">{metric.action}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SRE vs DevOps */}
      <Card>
        <CardHeader>
          <CardTitle>SRE vs DevOps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border p-3 text-left font-semibold">Aspect</th>
                  <th className="border p-3 text-left font-semibold">SRE</th>
                  <th className="border p-3 text-left font-semibold">DevOps</th>
                </tr>
              </thead>
              <tbody>
                {sreVsDevOps.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border p-3 font-semibold">{row.aspect}</td>
                    <td className="border p-3">{row.sre}</td>
                    <td className="border p-3">{row.devops}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <AlertDescription>
              <strong>💡 Bottom Line:</strong> SRE is a specific implementation of DevOps principles 
              with emphasis on reliability, quantification, and engineering solutions to operations problems.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with SRE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
              <h5 className="font-semibold text-blue-900 mb-2">Phase 1: Foundation (Month 1-3)</h5>
              <ul className="space-y-1 text-sm text-blue-900">
                <li>• Define SLOs for critical services</li>
                <li>• Implement basic monitoring and alerting</li>
                <li>• Start tracking toil percentage</li>
                <li>• Write first postmortem template</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-4">
              <h5 className="font-semibold text-green-900 mb-2">Phase 2: Implementation (Month 4-6)</h5>
              <ul className="space-y-1 text-sm text-green-900">
                <li>• Calculate and track error budgets</li>
                <li>• Automate top toil items</li>
                <li>• Establish on-call rotation</li>
                <li>• Conduct blameless postmortems</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
              <h5 className="font-semibold text-purple-900 mb-2">Phase 3: Maturity (Month 7+)</h5>
              <ul className="space-y-1 text-sm text-purple-900">
                <li>• Enforce error budget policies</li>
                <li>• Achieve {"<"} 50% toil</li>
                <li>• Regular reliability reviews</li>
                <li>• Continuous improvement culture</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
