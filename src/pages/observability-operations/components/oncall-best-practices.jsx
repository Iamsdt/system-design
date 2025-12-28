import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * OnCallBestPractices Component
 * PagerDuty/OpsGenie setup, escalation policies, and alert fatigue prevention
 */
export default function OnCallBestPractices() {
  const escalationPolicyExample = {
    name: "Production Escalation - API Service",
    description: "Multi-tier escalation for critical production alerts",
    tiers: [
      {
        tier: 1,
        name: "Primary On-Call",
        delay: "Immediate",
        who: "Current on-call engineer",
        notification: ["Push notification", "SMS", "Phone call (after 5 min)"],
        timeout: "15 minutes"
      },
      {
        tier: 2,
        name: "Secondary On-Call",
        delay: "15 minutes",
        who: "Backup on-call engineer",
        notification: ["Push notification", "SMS", "Phone call (after 5 min)"],
        timeout: "15 minutes"
      },
      {
        tier: 3,
        name: "Engineering Lead",
        delay: "30 minutes",
        who: "Team lead or manager",
        notification: ["Push notification", "Phone call"],
        timeout: "15 minutes"
      },
      {
        tier: 4,
        name: "Director/VP",
        delay: "45 minutes",
        who: "Engineering director",
        notification: ["Phone call", "SMS"],
        timeout: "Final escalation"
      }
    ],
    specialRules: [
      "SEV-1 incidents: Skip to Tier 2 immediately, notify Tier 3 async",
      "Weekend/Holiday: Longer timeouts (20 min per tier)",
      "Multiple alerts: Auto-group by service within 10 minutes",
      "Resolved alerts: Cancel escalation and notify all parties"
    ]
  }

  const onCallRotation = [
    {
      model: "Follow-the-Sun",
      description: "Hand off on-call to different timezones",
      schedule: "APAC (8am-4pm) → EMEA (4pm-12am) → Americas (12am-8am)",
      pros: ["No night calls", "24/7 coverage", "Better work-life balance"],
      cons: ["Requires global team", "Handoff complexity", "Cultural differences"],
      bestFor: "Large global teams"
    },
    {
      model: "Weekly Rotation",
      description: "1 week on-call, then rotate to next engineer",
      schedule: "Monday 9am - Monday 9am (next week)",
      pros: ["Simple to manage", "Predictable", "Easy to swap shifts"],
      cons: ["Can be exhausting", "Weekend coverage burden", "Varies by alert volume"],
      bestFor: "Medium-sized teams (5-10 people)"
    },
    {
      model: "24-Hour Shifts",
      description: "Daily rotation with 24-hour shifts",
      schedule: "9am-9am next day, then rotate",
      pros: ["Short duration", "Less disruption", "Fair distribution"],
      cons: ["Requires larger team", "More handoffs", "Coverage gaps risk"],
      bestFor: "Large teams (10+ people)"
    },
    {
      model: "Primary/Secondary",
      description: "Two people on-call: primary handles first, secondary is backup",
      schedule: "Both on-call simultaneously with escalation",
      pros: ["Backup always available", "Reduces pressure", "Better for learning"],
      cons: ["Double the cost", "Secondary often unneeded", "Complexity"],
      bestFor: "Critical systems, training periods"
    }
  ]

  const alertFatigue = [
    {
      symptom: "High Alert Volume",
      problem: "Engineers get 20+ pages per day",
      impact: "Important alerts missed, burnout, ignoring pages",
      solution: "Alert aggregation, better thresholds, reduce noise",
      implementation: "Group similar alerts, use anomaly detection, SLO-based alerting"
    },
    {
      symptom: "False Positives",
      problem: "60% of alerts are false alarms",
      impact: "Desensitization, delayed response to real issues",
      solution: "Improve alert accuracy, add context, tune thresholds",
      implementation: "Multi-signal alerts, longer evaluation periods, historical data"
    },
    {
      symptom: "Non-Actionable Alerts",
      problem: "Alerts with no clear action needed",
      impact: "Confusion, wasted time investigating",
      solution: "Every alert must be actionable",
      implementation: "Add runbook links, clear remediation steps, automated resolution"
    },
    {
      symptom: "Alert Storms",
      problem: "Single issue triggers 50+ alerts",
      impact: "Overwhelm, can't identify root cause",
      solution: "Alert suppression and correlation",
      implementation: "Dependency mapping, alert grouping, root cause correlation"
    }
  ]

  const runbookTemplate = `# Runbook: API Service High Error Rate

## Alert Details
- **Alert Name:** API Error Rate > 5%
- **Severity:** SEV-2
- **Auto-Resolve:** No
- **On-Call Team:** Backend Engineering

## Impact
- Users experiencing failed requests
- Potential revenue loss
- SLO breach risk

## Triage Steps (5 minutes)

### 1. Verify the Alert
- Check dashboard: https://dashboard.example.com/api-errors
- Confirm error rate is actually elevated (not false positive)
- Check time range: Is this a spike or sustained issue?

### 2. Assess Scope
- Which endpoints are affected? (Check service map)
- Which regions? (Multi-region dashboard)
- How many users impacted? (Check RUM)
- Error types: 5xx, 4xx, timeouts?

### 3. Check Recent Changes
- Any recent deployments? (Check CI/CD pipeline)
- Configuration changes? (Check config management)
- Infrastructure changes? (Check cloud console)
- Dependency changes? (Check service dependencies)

## Investigation (10-15 minutes)

### Common Causes
1. **Database Issues**
   - Check: Database CPU, connections, slow queries
   - Dashboard: https://dashboard.example.com/database
   
2. **Memory Leak**
   - Check: Memory usage trending up?
   - Look for: OOM errors in logs
   
3. **External Dependency**
   - Check: Third-party API status pages
   - Look for: Timeout errors
   
4. **Bad Deployment**
   - Check: Error rate started after deployment?
   - Look for: New error patterns in logs

### Useful Commands
\`\`\`bash
# Check recent logs
kubectl logs -n prod -l app=api --since=30m | grep ERROR

# Check pod status
kubectl get pods -n prod -l app=api

# Check resource usage
kubectl top pods -n prod -l app=api

# Check recent deployments
kubectl rollout history deployment/api -n prod
\`\`\`

## Mitigation Steps

### Option 1: Rollback (Fastest, if bad deployment)
\`\`\`bash
# Rollback to previous version
kubectl rollout undo deployment/api -n prod

# Monitor recovery
watch kubectl get pods -n prod -l app=api
\`\`\`
**Expected time:** 5-10 minutes

### Option 2: Scale Out (If resource exhaustion)
\`\`\`bash
# Scale up replicas
kubectl scale deployment/api -n prod --replicas=10

# Check if helps
# Monitor error rate dashboard
\`\`\`
**Expected time:** 3-5 minutes

### Option 3: Restart (If memory leak or stuck state)
\`\`\`bash
# Rolling restart
kubectl rollout restart deployment/api -n prod
\`\`\`
**Expected time:** 5-10 minutes

### Option 4: Failover (If regional issue)
\`\`\`bash
# Route traffic to healthy region
./scripts/failover-to-region.sh us-west-2
\`\`\`
**Expected time:** 2-3 minutes

## Communication

### Internal
- Post in #incidents Slack channel
- Update status: "Investigating API errors"
- Loop in team lead if not resolved in 30 min

### External
- If > 10% error rate for > 15 min, update status page
- Template: "We're investigating elevated error rates on our API. Updates every 15 min."

## Recovery Verification

1. ✅ Error rate back below 1%
2. ✅ Response time back to normal (< 200ms p95)
3. ✅ No new errors in logs
4. ✅ All pods healthy
5. ✅ Monitor for 30 minutes

## Post-Incident

1. Write postmortem (use template)
2. Create tickets for action items
3. Update this runbook if gaps found
4. Schedule postmortem review meeting

## Contacts
- **Team Lead:** @john-doe
- **Database DBA:** @jane-smith
- **Platform Team:** #platform-oncall

## Related Dashboards
- API Overview: https://dashboard.example.com/api
- Database Metrics: https://dashboard.example.com/db
- Infrastructure: https://dashboard.example.com/infra

---
**Last Updated:** 2024-01-15
**Owner:** Backend Team`

  const wellnessTips = [
    {
      category: "Before On-Call",
      tips: [
        "Review recent incidents and common issues",
        "Test your alerting devices (phone, laptop)",
        "Ensure VPN and access credentials work",
        "Know who to escalate to",
        "Get sufficient sleep before starting"
      ]
    },
    {
      category: "During On-Call",
      tips: [
        "Keep laptop and phone charged",
        "Stay within 15 minutes of computer access",
        "Don't drink excessively (alcohol)",
        "Acknowledge alerts promptly",
        "Ask for help if overwhelmed"
      ]
    },
    {
      category: "After Major Incident",
      tips: [
        "Take a break, get coffee/water",
        "Document what happened while fresh",
        "Communicate with team about status",
        "If late at night, consider taking next morning off",
        "Don't immediately jump back into feature work"
      ]
    },
    {
      category: "Team Support",
      tips: [
        "Compensate on-call time (time off or pay)",
        "Respect on-call availability windows",
        "Don't schedule meetings during on-call",
        "Provide training and shadowing",
        "Celebrate when on-call periods are quiet"
      ]
    }
  ]

  const toolComparison = [
    {
      tool: "PagerDuty",
      pricing: "$21-59/user/month",
      features: ["Advanced escalation", "Incident workflows", "Event intelligence (AI)", "Status pages", "Postmortem tools"],
      pros: ["Industry standard", "Best feature set", "Great integrations", "Excellent mobile app"],
      cons: ["Expensive at scale", "Complex for small teams"],
      bestFor: "Large enterprises, complex setups"
    },
    {
      tool: "Opsgenie",
      pricing: "$9-29/user/month",
      features: ["Flexible escalation", "On-call scheduling", "Alert grouping", "Heartbeat monitoring", "Integrations"],
      pros: ["More affordable", "Good feature set", "Atlassian integration", "Easy to use"],
      cons: ["Less mature than PagerDuty", "Fewer advanced features"],
      bestFor: "Mid-size companies, Atlassian users"
    },
    {
      tool: "VictorOps (Splunk On-Call)",
      pricing: "$15-49/user/month",
      features: ["Incident response", "Post-incident review", "Integrations", "Reporting", "Mobile app"],
      pros: ["Good Splunk integration", "User-friendly", "Incident timelines"],
      cons: ["Splunk acquisition concerns", "Smaller community"],
      bestFor: "Splunk users, DevOps teams"
    },
    {
      tool: "Grafana OnCall",
      pricing: "Free (OSS) / $15/user/month (Cloud)",
      features: ["Escalation chains", "Schedules", "Grafana integration", "Slack/Telegram", "Open source"],
      pros: ["Open source option", "Great Grafana integration", "Cost-effective"],
      cons: ["Newer/less mature", "Fewer integrations", "Limited features"],
      bestFor: "Budget-conscious, Grafana users"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">On-Call Best Practices</h3>
        <p className="text-lg text-slate-600">
          Effective on-call management, escalation policies, and preventing alert fatigue
        </p>
      </div>

      {/* On-Call Rotation Models */}
      <Card>
        <CardHeader>
          <CardTitle>On-Call Rotation Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {onCallRotation.map((model, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="text-lg font-bold text-slate-900">{model.model}</h5>
                    <p className="text-slate-600 mt-1">{model.description}</p>
                  </div>
                  <Badge>Model {idx + 1}</Badge>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="text-sm font-semibold text-blue-800 mb-1">Schedule</div>
                  <div className="text-sm text-blue-900">{model.schedule}</div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-green-700 mb-2">Pros</div>
                    <ul className="space-y-1">
                      {model.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-slate-700">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-red-700 mb-2">Cons</div>
                    <ul className="space-y-1">
                      {model.cons.map((con, i) => (
                        <li key={i} className="text-xs text-slate-700">• {con}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-700 mb-2">Best For</div>
                    <div className="text-xs text-slate-700">{model.bestFor}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Escalation Policy Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h5 className="font-semibold text-slate-900 mb-1">{escalationPolicyExample.name}</h5>
            <p className="text-sm text-slate-600">{escalationPolicyExample.description}</p>
          </div>

          <div className="space-y-3 mb-6">
            {escalationPolicyExample.tiers.map((tier, idx) => (
              <div key={idx} className="flex items-start gap-4 border-l-4 border-blue-600 pl-4 py-2">
                <div className="flex-shrink-0 w-16">
                  <Badge className="bg-blue-600">Tier {tier.tier}</Badge>
                </div>
                <div className="flex-1 grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{tier.name}</div>
                    <div className="text-xs text-slate-600">{tier.who}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Delay</div>
                    <div className="text-sm font-semibold">{tier.delay}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Notification</div>
                    <div className="text-xs text-slate-700">{tier.notification.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Timeout</div>
                    <div className="text-sm font-semibold">{tier.timeout}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h6 className="font-semibold text-yellow-900 mb-2">Special Rules</h6>
            <ul className="space-y-1">
              {escalationPolicyExample.specialRules.map((rule, idx) => (
                <li key={idx} className="text-sm text-yellow-900">• {rule}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Alert Fatigue Prevention */}
      <Card>
        <CardHeader>
          <CardTitle>Preventing Alert Fatigue</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription>
              <strong>⚠️ Warning:</strong> Alert fatigue is a serious problem. Engineers who get too many 
              false alerts become desensitized and may miss critical issues.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {alertFatigue.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <h5 className="text-lg font-bold text-slate-900 mb-3">{item.symptom}</h5>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-red-800 mb-1">Problem</div>
                    <div className="text-sm text-red-900">{item.problem}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-sm font-semibold text-orange-800 mb-1">Impact</div>
                    <div className="text-sm text-orange-900">{item.impact}</div>
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

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <h6 className="font-semibold text-green-900 mb-3">Alert Quality Metrics</h6>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-green-900">{"<"} 5</div>
                <div className="text-sm text-green-800">Pages per on-call shift</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">{">"} 90%</div>
                <div className="text-sm text-green-800">Actionable alerts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">{"<"} 10%</div>
                <div className="text-sm text-green-800">False positive rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Runbook Template */}
      <Card>
        <CardHeader>
          <CardTitle>Runbook Template</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            Every alert should have a runbook with clear investigation and mitigation steps.
          </p>
          
          <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm">
            <code>{runbookTemplate}</code>
          </pre>

          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <AlertDescription>
              <strong>💡 Best Practice:</strong> Link runbooks directly from alerts. Engineers should 
              never have to search for what to do when paged.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Tool Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>On-Call Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {toolComparison.map((tool, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-lg font-bold text-slate-900">{tool.tool}</h5>
                  <Badge variant="outline">{tool.pricing}</Badge>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 mb-2">Features</div>
                    <ul className="space-y-1">
                      {tool.features.map((feature, i) => (
                        <li key={i} className="text-xs text-slate-700">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-green-700 mb-2">Pros</div>
                    <ul className="space-y-1">
                      {tool.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-slate-700">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-red-700 mb-2">Cons</div>
                    <ul className="space-y-1">
                      {tool.cons.map((con, i) => (
                        <li key={i} className="text-xs text-slate-700">• {con}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-700 mb-2">Best For</div>
                    <div className="text-xs text-slate-700">{tool.bestFor}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wellness and Compensation */}
      <Card>
        <CardHeader>
          <CardTitle>On-Call Wellness & Compensation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wellnessTips.map((section, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <h5 className="text-lg font-bold text-slate-900 mb-3">{section.category}</h5>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h6 className="font-semibold text-purple-900 mb-3">Compensation Models</h6>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-purple-900 mb-1">On-Call Stipend</div>
                <div className="text-purple-800">$200-500/week flat rate for being available</div>
              </div>
              <div>
                <div className="font-semibold text-purple-900 mb-1">Incident Pay</div>
                <div className="text-purple-800">$50-150/incident for after-hours pages</div>
              </div>
              <div>
                <div className="font-semibold text-purple-900 mb-1">Time Off</div>
                <div className="text-purple-800">Comp time for major incidents (e.g., 3 hours work = 1 day off)</div>
              </div>
            </div>
          </div>

          <Alert className="mt-6 bg-yellow-50 border-yellow-200">
            <AlertDescription>
              <strong>⚠️ Important:</strong> On-call duty is stressful. Proper compensation and support 
              are essential for retention and mental health. Don't undervalue your on-call engineers!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
