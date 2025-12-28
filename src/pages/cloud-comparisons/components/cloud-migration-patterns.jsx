import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CloudMigrationPatterns() {
  const [selectedStrategy, setSelectedStrategy] = useState('lift-shift');

  const strategies = {
    'lift-shift': {
      name: 'Lift-and-Shift (Rehost)',
      icon: '🚚',
      description: 'Move applications to cloud with minimal changes',
      effort: 'Low',
      speed: 'Fast (weeks)',
      cost: 'Medium',
      benefits: ['Quick migration', 'Low risk', 'No code changes', 'Immediate cloud benefits (scalability, DR)'],
      drawbacks: ['Not cloud-optimized', 'Higher long-term costs', 'Limited scalability', 'Technical debt remains'],
      bestFor: ['Legacy apps with tight deadlines', 'Apps you plan to retire soon', 'Datacenter exit scenarios'],
      example: 'Migrate a Java monolith on VMs to EC2 instances as-is'
    },
    'replatform': {
      name: 'Re-platform (Lift-Tinker-Shift)',
      icon: '🔧',
      description: 'Make targeted optimizations without changing core architecture',
      effort: 'Medium',
      speed: 'Medium (months)',
      cost: 'Medium',
      benefits: ['Some cloud optimization', 'Manageable risk', 'Better cost efficiency', 'Improved performance'],
      drawbacks: ['More time than lift-shift', 'Some code changes', 'Testing required', 'Partial optimization'],
      bestFor: ['Apps worth optimizing', 'Databases to managed services', 'Containerization without refactoring'],
      example: 'Migrate Java app to EC2 but switch from self-managed MySQL to RDS'
    },
    'refactor': {
      name: 'Re-architect (Refactor)',
      icon: '🏗️',
      description: 'Redesign application to be cloud-native',
      effort: 'High',
      speed: 'Slow (6-18 months)',
      cost: 'High upfront, low long-term',
      benefits: ['Full cloud optimization', 'Maximum scalability', 'Lowest operational cost', 'Modern architecture'],
      drawbacks: ['Expensive upfront', 'High risk', 'Long timeline', 'Requires skilled engineers'],
      bestFor: ['Core business applications', 'High-scale needs', 'Strategic modernization', 'Competitive advantage'],
      example: 'Break monolith into microservices on Lambda/ECS with DynamoDB'
    },
    'repurchase': {
      name: 'Repurchase (Replace)',
      icon: '🛒',
      description: 'Replace with SaaS or cloud-native alternative',
      effort: 'Low-Medium',
      speed: 'Fast-Medium',
      cost: 'Variable',
      benefits: ['No infrastructure management', 'Modern features', 'Vendor support', 'Quick to deploy'],
      drawbacks: ['Data migration needed', 'Learning curve', 'Vendor lock-in', 'Limited customization'],
      bestFor: ['Email (→ Google Workspace)', 'CRM (→ Salesforce)', 'HR (→ Workday)', 'Standard business apps'],
      example: 'Replace self-hosted email server with Google Workspace'
    },
    'retire': {
      name: 'Retire',
      icon: '🗑️',
      description: 'Decommission applications no longer needed',
      effort: 'Low',
      speed: 'Fast',
      cost: 'Savings',
      benefits: ['Immediate cost savings', 'Reduced complexity', 'Less to maintain', 'Focus on valuable apps'],
      drawbacks: ['Requires stakeholder buy-in', 'Data archival needed', 'Potential dependencies'],
      bestFor: ['Redundant applications', 'Low-usage systems', 'Shadow IT', 'EOL software'],
      example: 'Retire 3 overlapping monitoring tools, standardize on one'
    },
    'retain': {
      name: 'Retain (Revisit)',
      icon: '⏸️',
      description: 'Keep on-premises for now, revisit later',
      effort: 'None',
      speed: 'N/A',
      cost: 'No change',
      benefits: ['No migration risk', 'More time to plan', 'Focus on high-value migrations'],
      drawbacks: ['Ongoing on-prem costs', 'Technical debt grows', 'Hybrid complexity'],
      bestFor: ['Apps with compliance issues', 'Recently upgraded systems', 'Low-priority workloads'],
      example: 'Keep mainframe system on-prem while migrating everything else'
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-4">The 6 R's of Cloud Migration</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            AWS's framework for categorizing migration strategies. Choose based on app value, technical debt, and business goals.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
            {Object.entries(strategies).map(([key, strategy]) => (
              <button
                key={key}
                onClick={() => setSelectedStrategy(key)}
                className={`p-3 rounded text-center transition-colors ${
                  selectedStrategy === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <div className="text-2xl mb-1">{strategy.icon}</div>
                <div className="text-xs font-medium">{strategy.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">{strategies[selectedStrategy].icon}</div>
              <div>
                <h4 className="text-xl font-semibold">{strategies[selectedStrategy].name}</h4>
                <p className="text-sm text-muted-foreground">{strategies[selectedStrategy].description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold mb-1">Effort</p>
                <p>{strategies[selectedStrategy].effort}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold mb-1">Timeline</p>
                <p>{strategies[selectedStrategy].speed}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold mb-1">Cost</p>
                <p>{strategies[selectedStrategy].cost}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Badge className="mb-2">Benefits</Badge>
                <ul className="space-y-1 text-sm">
                  {strategies[selectedStrategy].benefits.map((benefit, idx) => (
                    <li key={idx}>✓ {benefit}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Badge variant="destructive" className="mb-2">Drawbacks</Badge>
                <ul className="space-y-1 text-sm">
                  {strategies[selectedStrategy].drawbacks.map((drawback, idx) => (
                    <li key={idx}>✗ {drawback}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-4">
              <Badge variant="outline" className="mb-2">Best For</Badge>
              <ul className="space-y-1 text-sm">
                {strategies[selectedStrategy].bestFor.map((use, idx) => (
                  <li key={idx}>• {use}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="text-xs font-semibold mb-1">Example</p>
              <p className="text-sm">{strategies[selectedStrategy].example}</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Migration Decision Matrix</h3>
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Factor</th>
                  <th className="text-left p-2">Lift-Shift</th>
                  <th className="text-left p-2">Re-platform</th>
                  <th className="text-left p-2">Refactor</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b">
                  <td className="p-2 font-medium">Business Value</td>
                  <td className="p-2">Low-Medium</td>
                  <td className="p-2">Medium-High</td>
                  <td className="p-2">High (core apps)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Technical Debt</td>
                  <td className="p-2">Acceptable</td>
                  <td className="p-2">Some cleanup</td>
                  <td className="p-2">Full modernization</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Timeline Pressure</td>
                  <td className="p-2">🟢 Urgent</td>
                  <td className="p-2">🟡 Moderate</td>
                  <td className="p-2">🔴 Flexible</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Budget</td>
                  <td className="p-2">🟢 Limited</td>
                  <td className="p-2">🟡 Moderate</td>
                  <td className="p-2">🔴 Substantial</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Team Skills</td>
                  <td className="p-2">Basic cloud</td>
                  <td className="p-2">Intermediate</td>
                  <td className="p-2">Advanced/architects</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Scalability Needs</td>
                  <td className="p-2">Current level OK</td>
                  <td className="p-2">Moderate growth</td>
                  <td className="p-2">10x+ growth</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Cost (Long-term)</td>
                  <td className="p-2">🔴 Higher</td>
                  <td className="p-2">🟡 Medium</td>
                  <td className="p-2">🟢 Lower</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Typical Duration</td>
                  <td className="p-2">2-8 weeks</td>
                  <td className="p-2">2-6 months</td>
                  <td className="p-2">6-18 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Migration Phases</h3>
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Badge className="text-lg">1</Badge>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Assessment & Discovery</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Understand your current environment and plan the migration
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Tasks:</p>
                    <p>• Inventory all applications and dependencies</p>
                    <p>• Map data flows and integrations</p>
                    <p>• Assess cloud readiness</p>
                    <p>• Estimate costs (TCO analysis)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Tools:</p>
                    <p>• AWS Application Discovery Service</p>
                    <p>• Azure Migrate</p>
                    <p>• CloudPhysics</p>
                    <p>• Manual spreadsheets</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3"><strong>Duration:</strong> 2-8 weeks</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Badge className="text-lg">2</Badge>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Portfolio Analysis & Planning</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Categorize apps and create migration wave plan
                </p>
                <div className="grid md:grid-cols-3 gap-3 text-xs mb-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="font-semibold mb-1">Wave 1: Quick Wins</p>
                    <p>Simple apps, low risk, build confidence</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="font-semibold mb-1">Wave 2: Core Apps</p>
                    <p>Business-critical, needs planning</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <p className="font-semibold mb-1">Wave 3: Complex</p>
                    <p>Legacy, dependencies, high-touch</p>
                  </div>
                </div>
                <p className="text-xs"><strong>Output:</strong> Migration roadmap with waves, timelines, resources</p>
                <p className="text-xs text-muted-foreground mt-3"><strong>Duration:</strong> 2-4 weeks</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Badge className="text-lg">3</Badge>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Pilot Migration</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Migrate 1-3 low-risk applications to validate approach
                </p>
                <div className="space-y-2 text-xs">
                  <p>• Test migration process and tools</p>
                  <p>• Identify gaps in skills, procedures, security</p>
                  <p>• Refine cost estimates with real data</p>
                  <p>• Build runbooks and templates</p>
                  <p>• Train team on cloud operations</p>
                </div>
                <p className="text-xs text-muted-foreground mt-3"><strong>Duration:</strong> 1-3 months</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Badge className="text-lg">4</Badge>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Bulk Migration</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Execute migration waves at scale
                </p>
                <div className="space-y-2 text-xs">
                  <p>• Migrate in planned waves (every 2-4 weeks)</p>
                  <p>• Run apps in parallel (on-prem + cloud) initially</p>
                  <p>• Cutover during maintenance windows</p>
                  <p>• Monitor closely for 1-2 weeks post-migration</p>
                  <p>• Decommission on-prem resources after validation</p>
                </div>
                <p className="text-xs text-muted-foreground mt-3"><strong>Duration:</strong> 6-24 months</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Badge className="text-lg">5</Badge>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Optimization</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Right-size, optimize costs, improve architecture
                </p>
                <div className="space-y-2 text-xs">
                  <p>• Right-size instances (most run at 30-40% utilization)</p>
                  <p>• Purchase Reserved Instances / Savings Plans</p>
                  <p>• Enable auto-scaling</p>
                  <p>• Refactor high-value apps to cloud-native</p>
                  <p>• Continuous improvement (FinOps culture)</p>
                </div>
                <p className="text-xs text-muted-foreground mt-3"><strong>Duration:</strong> Ongoing</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Risk Mitigation Strategies</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>🛡️</span>
              <span>Technical Risks</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <Badge className="mb-1">Data Loss</Badge>
                <p className="text-xs">• Backup before migration<br />• Test restore procedures<br />• Keep on-prem backup for 30-90 days</p>
              </div>
              <div>
                <Badge className="mb-1">Downtime</Badge>
                <p className="text-xs">• Migrate during low-traffic windows<br />• Use blue-green deployment<br />• Have rollback plan ready</p>
              </div>
              <div>
                <Badge className="mb-1">Performance Issues</Badge>
                <p className="text-xs">• Load test before cutover<br />• Over-provision initially<br />• Monitor closely for 1-2 weeks</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>💼</span>
              <span>Business Risks</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <Badge className="mb-1">Cost Overruns</Badge>
                <p className="text-xs">• Set budget alerts (CloudWatch, Cost Management)<br />• Start small, scale gradually<br />• Review costs weekly</p>
              </div>
              <div>
                <Badge className="mb-1">Stakeholder Resistance</Badge>
                <p className="text-xs">• Communicate early and often<br />• Show quick wins<br />• Involve teams in planning</p>
              </div>
              <div>
                <Badge className="mb-1">Skills Gap</Badge>
                <p className="text-xs">• Train team in advance<br />• Hire cloud experts<br />• Partner with MSP for initial migrations</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Real-World Migration Examples</h3>
        <div className="space-y-4">
          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20">
            <h4 className="text-lg font-semibold mb-2">🏦 Capital One</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Challenge</p>
                <p className="text-xs">Exit 8 data centers, migrate 100+ apps to AWS</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Strategy</p>
                <p className="text-xs">Mix of lift-shift (60%), re-platform (30%), refactor (10%)</p>
              </div>
            </div>
            <p className="text-xs mt-3"><strong>Outcome:</strong> Closed all data centers by 2020, saved $100M/year in infrastructure costs</p>
          </Card>

          <Card className="p-6 bg-green-50 dark:bg-green-900/20">
            <h4 className="text-lg font-semibold mb-2">📺 Netflix</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Challenge</p>
                <p className="text-xs">Database corruption in 2008, decided to go cloud-only</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Strategy</p>
                <p className="text-xs">7-year gradual migration, full refactor to microservices</p>
              </div>
            </div>
            <p className="text-xs mt-3"><strong>Outcome:</strong> Completed 2015, can now scale to 200M+ subscribers globally</p>
          </Card>

          <Card className="p-6 bg-purple-50 dark:bg-purple-900/20">
            <h4 className="text-lg font-semibold mb-2">✈️ Expedia</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Challenge</p>
                <p className="text-xs">Migrate 80% of mission-critical apps to AWS</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Strategy</p>
                <p className="text-xs">Mostly re-platform, containerize with Kubernetes</p>
              </div>
            </div>
            <p className="text-xs mt-3"><strong>Outcome:</strong> Reduced data center footprint by 80%, improved deployment speed by 3x</p>
          </Card>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          <strong>🎯 Best Practice:</strong> Start with 1-2 pilot migrations (Wave 1) to validate your approach. Most organizations underestimate migration complexity by 2-3x. Plan for 18-24 months for full data center exit.
        </AlertDescription>
      </Alert>
    </div>
  );
}
