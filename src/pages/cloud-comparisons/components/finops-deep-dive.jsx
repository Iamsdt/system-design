import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FinOpsDeepDive() {
  const [selectedCommitment, setSelectedCommitment] = useState('ri');

  const commitmentTypes = {
    ri: {
      name: 'Reserved Instances (AWS/Azure)',
      description: 'Commit to specific instance type for 1-3 years',
      discount: '30-70%',
      flexibility: 'Low (specific instance type)',
      provider: 'AWS, Azure',
      bestFor: 'Stable, predictable workloads'
    },
    sp: {
      name: 'Savings Plans (AWS)',
      description: 'Commit to $ amount of compute spend for 1-3 years',
      discount: '20-66%',
      flexibility: 'High (any instance type, region)',
      provider: 'AWS',
      bestFor: 'Variable workloads, flexibility needed'
    },
    cud: {
      name: 'Committed Use Discounts (GCP)',
      description: 'Commit to resource usage for 1-3 years',
      discount: '25-55%',
      flexibility: 'Medium (within resource family)',
      provider: 'GCP',
      bestFor: 'Predictable resource needs'
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-4">What is FinOps?</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            FinOps (Financial Operations) is the practice of bringing financial accountability to cloud spending. It combines systems, best practices, and culture to help organizations maximize cloud business value.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <h4 className="font-semibold mb-2">👥 People</h4>
              <p className="text-xs">Cross-functional teams: Engineering, Finance, Leadership working together on cloud costs</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
              <h4 className="font-semibold mb-2">📊 Process</h4>
              <p className="text-xs">Continuous cycle: Monitor → Analyze → Optimize → Repeat</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
              <h4 className="font-semibold mb-2">🛠️ Tools</h4>
              <p className="text-xs">Cost dashboards, budgets, alerts, tagging, right-sizing recommendations</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Commitment Options</h3>
        <Card className="p-6">
          <div className="flex gap-2 mb-4">
            {Object.entries(commitmentTypes).map(([key, type]) => (
              <button
                key={key}
                onClick={() => setSelectedCommitment(key)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedCommitment === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="p-6 border rounded-lg">
            <h4 className="text-lg font-semibold mb-2">{commitmentTypes[selectedCommitment].name}</h4>
            <p className="text-sm text-muted-foreground mb-4">{commitmentTypes[selectedCommitment].description}</p>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold mb-1">Discount</p>
                <p className="text-2xl font-bold text-green-600">{commitmentTypes[selectedCommitment].discount}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold mb-1">Flexibility</p>
                <p>{commitmentTypes[selectedCommitment].flexibility}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold mb-1">Provider</p>
                <p>{commitmentTypes[selectedCommitment].provider}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="font-semibold mb-1">Best For</p>
                <p>{commitmentTypes[selectedCommitment].bestFor}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Reserved Instances (AWS/Azure) Deep Dive</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Standard Reserved Instances</h4>
            <Badge className="mb-3">Up to 72% discount</Badge>
            <div className="space-y-2 text-sm">
              <p><strong>1-Year:</strong> ~40% discount</p>
              <p><strong>3-Year:</strong> ~60-72% discount</p>
              <p><strong>Payment:</strong></p>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• All Upfront: Highest discount</li>
                <li>• Partial Upfront: Balanced</li>
                <li>• No Upfront: Lowest discount, no cash outlay</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                ✗ Cannot change instance type, region, or OS<br />
                ✓ Best for stable, long-running workloads
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Convertible Reserved Instances</h4>
            <Badge className="mb-3">Up to 54% discount</Badge>
            <div className="space-y-2 text-sm">
              <p><strong>1-Year:</strong> ~30% discount</p>
              <p><strong>3-Year:</strong> ~45-54% discount</p>
              <p><strong>Flexibility:</strong></p>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• Can change instance family</li>
                <li>• Can change OS</li>
                <li>• Can change tenancy</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                ✓ More flexibility than Standard<br />
                ✗ Lower discount than Standard
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Savings Plans (AWS)</h3>
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💰</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Compute Savings Plans</h4>
                <Badge className="mb-3">Up to 66% discount</Badge>
                <p className="text-sm text-muted-foreground mb-3">
                  Most flexible. Commit to $ amount of compute usage (EC2, Lambda, Fargate).
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-semibold mb-1">Flexibility</p>
                    <p>• Any instance family (m5, c5, r5, etc.)</p>
                    <p>• Any region</p>
                    <p>• Any OS</p>
                    <p>• EC2, Lambda, Fargate</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Example</p>
                    <p>Commit to $100/hour of compute.</p>
                    <p>Automatically applies to all eligible usage up to $100/hour.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🖥️</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">EC2 Instance Savings Plans</h4>
                <Badge className="mb-3">Up to 72% discount</Badge>
                <p className="text-sm text-muted-foreground mb-3">
                  Less flexible but higher discount. Commit to specific instance family in a region.
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-semibold mb-1">Flexibility</p>
                    <p>• Specific instance family (e.g., m5)</p>
                    <p>• Specific region (e.g., us-east-1)</p>
                    <p>• Any size (large, xlarge, 2xlarge, etc.)</p>
                    <p>• Any OS, tenancy</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Example</p>
                    <p>Commit to m5 instances in us-east-1.</p>
                    <p>Can use m5.large, m5.xlarge, etc.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Spot / Preemptible Instances</h3>
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>☁️</span>
                <span>AWS Spot Instances</span>
              </h4>
              <Badge className="mb-3 bg-green-600">Up to 90% discount</Badge>
              <div className="space-y-2 text-sm">
                <p><strong>How it works:</strong></p>
                <p className="text-xs">Bid on unused EC2 capacity. AWS can reclaim with 2-minute warning.</p>
                <p className="mt-3"><strong>Best for:</strong></p>
                <ul className="ml-4 space-y-1 text-xs">
                  <li>• Batch processing</li>
                  <li>• Big data analysis</li>
                  <li>• CI/CD workloads</li>
                  <li>• Stateless web servers (behind LB)</li>
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  ⚠️ Not for databases or stateful apps
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>🔵</span>
                <span>GCP Preemptible VMs</span>
              </h4>
              <Badge className="mb-3 bg-green-600">Up to 80% discount</Badge>
              <div className="space-y-2 text-sm">
                <p><strong>How it works:</strong></p>
                <p className="text-xs">Short-lived instances (max 24 hours). 30-second shutdown notice.</p>
                <p className="mt-3"><strong>Differences from Spot:</strong></p>
                <ul className="ml-4 space-y-1 text-xs">
                  <li>• Fixed pricing (not bid-based)</li>
                  <li>• Guaranteed max 24hr lifespan</li>
                  <li>• More predictable</li>
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  💡 Good for fault-tolerant batch jobs
                </p>
              </div>
            </div>
          </div>

          <Alert className="mt-4">
            <AlertDescription>
              <strong>Pro Tip:</strong> Combine Spot with On-Demand in an Auto Scaling Group. Use Spot for 70-80% of capacity, On-Demand for baseline. Savings of 50-60% with high availability.
            </AlertDescription>
          </Alert>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Right-Sizing Strategies</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>📉</span>
              <span>Downsize Over-Provisioned</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Most instances run at 30-40% CPU utilization. Downsize to save 40-60%.
            </p>
            <div className="space-y-2 text-xs">
              <p><strong>Example:</strong></p>
              <p>m5.2xlarge (8 vCPU, $0.384/hr) at 20% CPU</p>
              <p>→ Downsize to m5.xlarge (4 vCPU, $0.192/hr)</p>
              <p className="font-bold text-green-600">Savings: $140/month (50%)</p>
            </div>
            <div className="mt-4 p-3 bg-muted rounded text-xs">
              <p className="font-semibold mb-1">Tools:</p>
              <p>• AWS Compute Optimizer</p>
              <p>• Azure Advisor</p>
              <p>• GCP Active Assist</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>⚙️</span>
              <span>Graviton / ARM Instances</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              ARM-based instances offer 20-40% better price-performance than x86.
            </p>
            <div className="space-y-2 text-xs">
              <p><strong>Example:</strong></p>
              <p>m5.xlarge (x86): $0.192/hr</p>
              <p>m6g.xlarge (Graviton): $0.154/hr</p>
              <p className="font-bold text-green-600">Savings: $27/month (20%)</p>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
              <p className="font-semibold mb-1">⚠️ Considerations:</p>
              <p>• Need to recompile for ARM</p>
              <p>• Not all software supported</p>
              <p>• Worth it for high-scale workloads</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>💾</span>
              <span>Storage Optimization</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Use appropriate storage tiers and delete unused resources.
            </p>
            <div className="space-y-2 text-xs">
              <p><strong>Quick wins:</strong></p>
              <p>• Delete old EBS snapshots ($0.05/GB/month)</p>
              <p>• S3 Intelligent-Tiering (auto-move to cheaper tiers)</p>
              <p>• gp3 volumes instead of gp2 (20% cheaper, better performance)</p>
              <p>• Delete unattached volumes</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>⏰</span>
              <span>Scheduling</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Stop non-prod resources outside business hours. Save 65-75%.
            </p>
            <div className="space-y-2 text-xs">
              <p><strong>Example:</strong></p>
              <p>Dev environment: On weekdays 8am-6pm only</p>
              <p>10 hours/day × 5 days = 50 hours/week</p>
              <p>vs 168 hours/week = 70% savings</p>
            </div>
            <div className="mt-4 p-3 bg-muted rounded text-xs">
              <p className="font-semibold mb-1">Tools:</p>
              <p>• AWS Instance Scheduler</p>
              <p>• Azure Automation</p>
              <p>• GCP Cloud Scheduler</p>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Cost Allocation & Tagging</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Tags enable cost tracking by team, project, environment, or cost center. Critical for showback/chargeback.
          </p>
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">Essential Tags</h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Environment</p>
                  <p className="text-xs font-mono">dev, staging, prod</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Team/Owner</p>
                  <p className="text-xs font-mono">team-payments, team-search</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Project</p>
                  <p className="text-xs font-mono">project-alpha, project-beta</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Cost Center</p>
                  <p className="text-xs font-mono">cc-engineering, cc-sales</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">Tagging Strategy</h4>
              <ul className="space-y-1 text-sm">
                <li>✓ Enforce via policy (AWS Service Control Policies, Azure Policy)</li>
                <li>✓ Apply tags in IaC (Terraform, CloudFormation)</li>
                <li>✓ Set up tag governance (monitor untagged resources)</li>
                <li>✗ Don't have too many tags (keep it simple: 4-6 core tags)</li>
                <li>✗ Don't use PII in tags (visible in billing)</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="text-sm font-semibold mb-2">💡 Pro Tip: Split Accounts</p>
              <p className="text-xs">
                Use separate AWS accounts for dev/staging/prod. Costs are automatically separated. Easier than relying solely on tags.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">FinOps Maturity Model</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <Badge className="mb-3">Level 1: Crawl</Badge>
            <h4 className="text-lg font-semibold mb-3">Reactive</h4>
            <ul className="space-y-2 text-sm">
              <li>• Bills come as surprise</li>
              <li>• No cost visibility</li>
              <li>• Manual processes</li>
              <li>• Finance owns cost</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">Most companies start here</p>
          </Card>

          <Card className="p-6 border-2 border-primary">
            <Badge className="mb-3">Level 2: Walk</Badge>
            <h4 className="text-lg font-semibold mb-3">Proactive</h4>
            <ul className="space-y-2 text-sm">
              <li>• Cost dashboards set up</li>
              <li>• Budget alerts enabled</li>
              <li>• Basic tagging in place</li>
              <li>• RI/SP purchases started</li>
              <li>• Engineering aware of costs</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">Target for most companies</p>
          </Card>

          <Card className="p-6">
            <Badge className="mb-3">Level 3: Run</Badge>
            <h4 className="text-lg font-semibold mb-3">Optimized</h4>
            <ul className="space-y-2 text-sm">
              <li>• Automated optimization</li>
              <li>• Cost in CI/CD pipeline</li>
              <li>• Showback/chargeback</li>
              <li>• FinOps culture embedded</li>
              <li>• Continuous improvement</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">Advanced organizations</p>
          </Card>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          <strong>🎯 Quick Wins for 30% Savings:</strong> (1) Delete unused resources (10%), (2) Right-size instances (10%), (3) Purchase Savings Plans for baseline (10%). These are low-risk changes that can be done in 1-2 weeks.
        </AlertDescription>
      </Alert>
    </div>
  );
}
