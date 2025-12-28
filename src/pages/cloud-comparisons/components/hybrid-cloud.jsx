import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function HybridCloud() {
  const useCases = [
    {
      name: 'Data Residency',
      icon: '🌍',
      description: 'Keep sensitive data on-premises for compliance',
      example: 'Healthcare patient records in on-prem DB, analytics in cloud'
    },
    {
      name: 'Gradual Migration',
      icon: '🚚',
      description: 'Migrate workloads to cloud incrementally',
      example: 'Legacy ERP on-prem, new microservices in cloud'
    },
    {
      name: 'Burst Capacity',
      icon: '⚡',
      description: 'Use cloud for peak demand, on-prem for baseline',
      example: 'E-commerce: on-prem normally, cloud during Black Friday'
    },
    {
      name: 'Disaster Recovery',
      icon: '🛡️',
      description: 'Cloud as backup for on-premises systems',
      example: 'Primary in data center, failover to AWS'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-4">What is Hybrid Cloud?</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Hybrid cloud combines on-premises infrastructure with public cloud services, allowing data and applications to be shared between them. This provides greater flexibility, more deployment options, and helps optimize existing infrastructure.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <h4 className="font-semibold mb-2">On-Premises</h4>
              <ul className="space-y-1 text-xs">
                <li>• Sensitive data</li>
                <li>• Legacy applications</li>
                <li>• Predictable workloads</li>
                <li>• Compliance requirements</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
              <h4 className="font-semibold mb-2">Public Cloud</h4>
              <ul className="space-y-1 text-xs">
                <li>• New applications</li>
                <li>• Variable workloads</li>
                <li>• Development/testing</li>
                <li>• AI/ML workloads</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Common Use Cases</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {useCases.map((useCase, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{useCase.icon}</div>
                <h4 className="text-lg font-semibold">{useCase.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
              <div className="bg-muted p-3 rounded">
                <p className="text-xs font-semibold mb-1">Example</p>
                <p className="text-xs">{useCase.example}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Networking Challenges</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>Connectivity</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <Badge className="mb-1">Challenge</Badge>
                <p className="text-muted-foreground">Secure, high-bandwidth connection between on-prem and cloud</p>
              </div>
              <div>
                <Badge variant="outline" className="mb-1">Solutions</Badge>
                <ul className="space-y-1 text-xs">
                  <li>• AWS Direct Connect (1-100 Gbps)</li>
                  <li>• Azure ExpressRoute</li>
                  <li>• GCP Cloud Interconnect</li>
                  <li>• VPN as backup ($50-500/month)</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>Latency</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <Badge className="mb-1">Challenge</Badge>
                <p className="text-muted-foreground">Network latency between on-prem and cloud (10-100ms)</p>
              </div>
              <div>
                <Badge variant="outline" className="mb-1">Solutions</Badge>
                <ul className="space-y-1 text-xs">
                  <li>• Caching at both ends</li>
                  <li>• Async communication</li>
                  <li>• Data locality awareness</li>
                  <li>• Edge computing</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>Security</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <Badge className="mb-1">Challenge</Badge>
                <p className="text-muted-foreground">Consistent security policies across environments</p>
              </div>
              <div>
                <Badge variant="outline" className="mb-1">Solutions</Badge>
                <ul className="space-y-1 text-xs">
                  <li>• Unified IAM (Okta, Azure AD)</li>
                  <li>• Network segmentation</li>
                  <li>• End-to-end encryption</li>
                  <li>• SIEM for both environments</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>Management</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <Badge className="mb-1">Challenge</Badge>
                <p className="text-muted-foreground">Different tools and processes for on-prem vs cloud</p>
              </div>
              <div>
                <Badge variant="outline" className="mb-1">Solutions</Badge>
                <ul className="space-y-1 text-xs">
                  <li>• Unified management (Azure Arc, AWS Outposts)</li>
                  <li>• Kubernetes everywhere</li>
                  <li>• Infrastructure as Code</li>
                  <li>• Centralized monitoring</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Data Synchronization Strategies</h3>
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">1️⃣</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Database Replication</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Keep data in sync between on-prem and cloud databases
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-muted rounded">
                    <p className="font-semibold mb-1">Active-Passive</p>
                    <p>On-prem primary, cloud standby for DR</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="font-semibold mb-1">Active-Active</p>
                    <p>Both read/write, conflict resolution needed</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">2️⃣</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Event-Driven Sync</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Publish events from one environment, consume in the other
                </p>
                <div className="bg-muted p-3 rounded font-mono text-xs">
                  On-prem → Kafka → Cloud Consumer<br />
                  Cloud → EventBridge → On-prem Consumer
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">3️⃣</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Object Storage Sync</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Replicate files/objects between on-prem storage and cloud
                </p>
                <ul className="space-y-1 text-xs">
                  <li>• AWS DataSync: Automated transfer</li>
                  <li>• Azure File Sync: Windows file servers</li>
                  <li>• rsync/rclone: Open-source options</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Migration Strategies</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <Badge className="mb-3">Phase 1: Foundation</Badge>
            <ul className="space-y-2 text-sm">
              <li>• Set up connectivity (Direct Connect)</li>
              <li>• Configure IAM/SSO</li>
              <li>• Establish security policies</li>
              <li>• Test with non-critical workload</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">Duration: 1-2 months</p>
          </Card>

          <Card className="p-6">
            <Badge className="mb-3">Phase 2: Migration</Badge>
            <ul className="space-y-2 text-sm">
              <li>• Start with dev/test environments</li>
              <li>• Migrate stateless applications</li>
              <li>• Set up data replication</li>
              <li>• Gradually move production</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">Duration: 6-12 months</p>
          </Card>

          <Card className="p-6">
            <Badge className="mb-3">Phase 3: Optimization</Badge>
            <ul className="space-y-2 text-sm">
              <li>• Optimize cloud costs</li>
              <li>• Improve automation</li>
              <li>• Refactor for cloud-native</li>
              <li>• Continuous improvement</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">Duration: Ongoing</p>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Hybrid Cloud Platforms</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">AWS Outposts</h4>
            <p className="text-sm text-muted-foreground mb-3">
              AWS infrastructure and services in your data center
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ Same AWS APIs and tools</p>
              <p>✓ Low-latency access to on-prem data</p>
              <p>✗ Expensive ($20K-100K+)</p>
              <p>✗ AWS manages hardware</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Azure Stack / Arc</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Azure services on-premises with unified management
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ Hybrid Kubernetes management</p>
              <p>✓ Unified Azure portal</p>
              <p>✗ Complex setup</p>
              <p>✗ Arc is management layer only</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Google Anthos</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Kubernetes-based hybrid and multi-cloud platform
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ Runs on any infrastructure</p>
              <p>✓ Multi-cloud support</p>
              <p>✗ Kubernetes-centric</p>
              <p>✗ Steep learning curve</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">VMware Cloud</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Extend VMware environment to cloud
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ Familiar VMware tools</p>
              <p>✓ Lift-and-shift VMs</p>
              <p>✗ Not cloud-native</p>
              <p>✗ Expensive licensing</p>
            </div>
          </Card>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          <strong>🎯 Bottom Line:</strong> Hybrid cloud is ideal for gradual migration, compliance requirements, or leveraging existing on-prem investments. However, it's more complex than pure cloud. Consider if the benefits justify the additional operational overhead.
        </AlertDescription>
      </Alert>
    </div>
  );
}
