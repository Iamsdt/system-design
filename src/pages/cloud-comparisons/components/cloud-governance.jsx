import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CloudGovernance() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-4">What is Cloud Governance?</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Cloud governance is the set of policies, procedures, and controls to ensure secure, compliant, and cost-effective use of cloud resources at scale.
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold mb-1">Security</h4>
              <p className="text-xs">Access control, encryption, audit logs</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded text-center">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-semibold mb-1">Compliance</h4>
              <p className="text-xs">GDPR, HIPAA, SOC 2, PCI-DSS</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-semibold mb-1">Cost Control</h4>
              <p className="text-xs">Budgets, quotas, approval workflows</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded text-center">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold mb-1">Visibility</h4>
              <p className="text-xs">Asset inventory, usage tracking</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Landing Zones</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            A landing zone is a pre-configured, secure cloud environment that enforces organizational policies. Think of it as a "factory" for creating new cloud accounts/projects.
          </p>
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>AWS</Badge>
                <span>Control Tower</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Automates setup of multi-account AWS environment with best practices.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold mb-1">Includes:</p>
                  <p>• Organizational Units (OUs)</p>
                  <p>• Service Control Policies (SCPs)</p>
                  <p>• Guardrails (preventive + detective)</p>
                  <p>• Centralized logging (CloudTrail, Config)</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Use Cases:</p>
                  <p>• Multi-account strategy</p>
                  <p>• Automated account provisioning</p>
                  <p>• Compliance enforcement</p>
                  <p>• 10+ AWS accounts</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>Azure</Badge>
                <span>Landing Zones</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Blueprint for deploying and operating Azure with governance at scale.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold mb-1">Includes:</p>
                  <p>• Management Groups</p>
                  <p>• Azure Policy</p>
                  <p>• RBAC (Role-Based Access Control)</p>
                  <p>• Centralized logging (Log Analytics)</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Architectures:</p>
                  <p>• Enterprise-scale (large orgs)</p>
                  <p>• SMB (small-medium business)</p>
                  <p>• Foundation (simple start)</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Badge>GCP</Badge>
                <span>Cloud Foundation Toolkit</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Terraform templates for setting up GCP with security and compliance.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold mb-1">Includes:</p>
                  <p>• Organization hierarchy</p>
                  <p>• Folder structure</p>
                  <p>• Organization Policy</p>
                  <p>• VPC Service Controls</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Components:</p>
                  <p>• Shared VPC</p>
                  <p>• Centralized logging</p>
                  <p>• Network security</p>
                  <p>• IAM best practices</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Organization Structure</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Multi-account/project strategy isolates workloads, limits blast radius, and simplifies billing.
          </p>
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-3">Typical Hierarchy (AWS Organizations)</h4>
              <div className="font-mono text-xs bg-muted p-4 rounded">
                Root<br />
                ├── Security OU<br />
                │&nbsp;&nbsp;&nbsp;├── Log Archive Account<br />
                │&nbsp;&nbsp;&nbsp;└── Security Tooling Account<br />
                ├── Infrastructure OU<br />
                │&nbsp;&nbsp;&nbsp;├── Network Account (Transit Gateway, VPN)<br />
                │&nbsp;&nbsp;&nbsp;└── Shared Services Account (CI/CD, Artifact Registry)<br />
                ├── Workloads OU<br />
                │&nbsp;&nbsp;&nbsp;├── Prod Account<br />
                │&nbsp;&nbsp;&nbsp;├── Staging Account<br />
                │&nbsp;&nbsp;&nbsp;└── Dev Account<br />
                └── Sandbox OU<br />
                &nbsp;&nbsp;&nbsp;&nbsp;└── Individual dev accounts (auto-expire after 90 days)
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-semibold mb-2">✅ Benefits</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Isolation:</strong> Blast radius limited to one account</li>
                  <li>• <strong>Security:</strong> Separate IAM boundaries</li>
                  <li>• <strong>Billing:</strong> Clear cost attribution</li>
                  <li>• <strong>Compliance:</strong> Easier audits (e.g., prod only)</li>
                </ul>
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-semibold mb-2">⚠️ Challenges</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Complexity:</strong> More accounts to manage</li>
                  <li>• <strong>Cross-account:</strong> Needs IAM roles, resource sharing</li>
                  <li>• <strong>Learning curve:</strong> Team needs training</li>
                  <li>• <strong>Overhead:</strong> Not worth it for {"<"}5 accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Policy Enforcement</h3>
        <div className="space-y-4">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>🚫</span>
              <span>Preventive Controls</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Block actions before they happen. Enforced via Service Control Policies (AWS), Azure Policy (Deny), Organization Policy (GCP).
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                <p className="font-semibold mb-1">Example: Deny Public S3 Buckets</p>
                <pre className="text-xs font-mono mt-2 overflow-x-auto">
{`{
  "Effect": "Deny",
  "Action": "s3:PutBucketPublicAccessBlock",
  "Resource": "*",
  "Condition": {
    "Bool": {"s3:BlockPublicAcls": "false"}
  }
}`}
                </pre>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Common Policies</p>
                  <p>• Deny region usage (only us-east-1, eu-west-1)</p>
                  <p>• Require encryption</p>
                  <p>• Block root account usage</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Pros</p>
                  <p>• Strong enforcement</p>
                  <p>• Cannot be bypassed</p>
                  <p>• Immediate effect</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Cons</p>
                  <p>• Can block legitimate work</p>
                  <p>• Needs escape hatch</p>
                  <p>• Frustrates developers</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>🔍</span>
              <span>Detective Controls</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Detect violations after they happen. Alert but don't block. Enforced via AWS Config Rules, Azure Policy (Audit), GCP Asset Inventory.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                <p className="font-semibold mb-1">Example: Alert on Unencrypted RDS</p>
                <p className="text-xs">AWS Config Rule: <code className="bg-muted px-1">rds-storage-encrypted</code></p>
                <p className="text-xs mt-2">→ Detects unencrypted RDS instances → Sends SNS notification → Team remediates</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Common Rules</p>
                  <p>• Untagged resources</p>
                  <p>• Public snapshots</p>
                  <p>• Unused security groups</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Pros</p>
                  <p>• Doesn't block work</p>
                  <p>• Visibility into compliance</p>
                  <p>• Less frustration</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Cons</p>
                  <p>• Reactive (after the fact)</p>
                  <p>• Needs follow-up</p>
                  <p>• Alert fatigue risk</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Compliance Automation</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Automate compliance checks and reporting to reduce manual audits.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-3">AWS Security Hub</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Aggregates security findings from multiple services
              </p>
              <div className="space-y-2 text-xs">
                <p><strong>Includes:</strong></p>
                <p>• CIS AWS Foundations Benchmark</p>
                <p>• PCI-DSS checks</p>
                <p>• AWS Foundational Security Best Practices</p>
                <p>• GuardDuty, Inspector, Macie findings</p>
              </div>
              <p className="text-xs mt-3"><strong>Cost:</strong> $0.0010 per check (first 10K free)</p>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-3">Azure Defender / Microsoft Defender for Cloud</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Unified security management and threat protection
              </p>
              <div className="space-y-2 text-xs">
                <p><strong>Includes:</strong></p>
                <p>• Azure Security Benchmark</p>
                <p>• Regulatory compliance dashboard</p>
                <p>• Secure score</p>
                <p>• Recommendations</p>
              </div>
              <p className="text-xs mt-3"><strong>Cost:</strong> Free (basic), $15/server/month (advanced)</p>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-3">GCP Security Command Center</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Centralized visibility and control for GCP resources
              </p>
              <div className="space-y-2 text-xs">
                <p><strong>Includes:</strong></p>
                <p>• Asset inventory</p>
                <p>• Vulnerability scanning</p>
                <p>• Compliance monitoring</p>
                <p>• Threat detection</p>
              </div>
              <p className="text-xs mt-3"><strong>Cost:</strong> Free (standard), $35/project/month (premium)</p>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-3">Third-Party Tools</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Multi-cloud compliance and security posture management
              </p>
              <div className="space-y-2 text-xs">
                <p><strong>Options:</strong></p>
                <p>• Wiz, Orca Security, Lacework (CSPM)</p>
                <p>• CloudHealth, CloudCheckr (Governance + FinOps)</p>
                <p>• Prisma Cloud, Dome9 (Security)</p>
              </div>
              <p className="text-xs mt-3"><strong>Cost:</strong> Varies, typically $5-20K/month</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Guardrails vs Best Practices</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 border-2 border-red-500">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>🚧</span>
              <span>Guardrails (Hard Rules)</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Mandatory policies that cannot be violated. Enforced via preventive controls.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Examples:</p>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• ❌ No public S3 buckets</li>
                <li>• ❌ No root account usage</li>
                <li>• ❌ Must use approved regions only</li>
                <li>• ❌ All data must be encrypted at rest</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                <strong>When to use:</strong> Security-critical, compliance-required, high-risk areas
              </p>
            </div>
          </Card>

          <Card className="p-6 border-2 border-green-500">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>💡</span>
              <span>Best Practices (Soft Rules)</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Recommended policies that teams should follow. Detected but not blocked.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Examples:</p>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• ⚠️ Should have 3+ availability zones</li>
                <li>• ⚠️ Should enable CloudTrail logging</li>
                <li>• ⚠️ Should tag all resources</li>
                <li>• ⚠️ Should use IMDSv2 for EC2</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                <strong>When to use:</strong> Operational efficiency, cost optimization, non-critical security
              </p>
            </div>
          </Card>
        </div>

        <Alert className="mt-4">
          <AlertDescription>
            <strong>⚖️ Balance:</strong> Too many guardrails slow down teams. Too few risk security incidents. Start with 5-10 critical guardrails, make everything else a best practice. Promote best practices to guardrails only after repeated violations.
          </AlertDescription>
        </Alert>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Self-Service with Governance</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Enable teams to provision resources quickly while maintaining governance. Use Service Catalogs and IaC templates.
          </p>
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">AWS Service Catalog</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Pre-approved CloudFormation templates that teams can launch
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Admin provides:</p>
                  <p>• "3-tier web app" template</p>
                  <p>• "ML training environment" template</p>
                  <p>• Pre-configured with security, tags, networking</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <p className="font-semibold mb-1">Developers get:</p>
                  <p>• One-click deployment</p>
                  <p>• Compliant by default</p>
                  <p>• No need to know all AWS services</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">Azure Blueprints</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Package ARM templates, policies, and RBAC into reusable definitions
              </p>
              <p className="text-xs">Similar concept to AWS Service Catalog but includes governance (policies, RBAC) not just templates.</p>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">Internal Developer Platforms (IDP)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Build custom portal for self-service (Backstage, Port, etc.)
              </p>
              <div className="space-y-2 text-xs">
                <p><strong>Example flow:</strong></p>
                <p>1. Developer fills form: App name, environment, resources needed</p>
                <p>2. IDP runs Terraform with approved modules</p>
                <p>3. Resources created with tags, security, monitoring pre-configured</p>
                <p>4. Developer gets endpoints, credentials</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Alert>
        <AlertDescription>
          <strong>🎯 Governance Maturity Path:</strong> (1) Start simple: 5 critical guardrails + basic tagging. (2) Add detective controls and compliance dashboards. (3) Build self-service catalog. (4) Automate remediation. Takes 12-24 months to reach maturity.
        </AlertDescription>
      </Alert>
    </div>
  );
}
