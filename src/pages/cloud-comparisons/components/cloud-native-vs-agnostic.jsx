import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CloudNativeVsAgnostic() {
  const [selectedApproach, setSelectedApproach] = useState('cloud-native');

  const approaches = {
    'cloud-native': {
      services: [
        { name: 'AWS Lambda', description: 'Serverless compute', alternative: 'Kubernetes + KNative' },
        { name: 'DynamoDB', description: 'NoSQL database', alternative: 'Cassandra / MongoDB' },
        { name: 'S3', description: 'Object storage', alternative: 'MinIO / Ceph' },
        { name: 'RDS', description: 'Managed database', alternative: 'Self-hosted PostgreSQL' },
        { name: 'CloudWatch', description: 'Monitoring', alternative: 'Prometheus + Grafana' },
        { name: 'SNS/SQS', description: 'Messaging', alternative: 'RabbitMQ / Kafka' }
      ]
    },
    'cloud-agnostic': {
      services: [
        { name: 'Kubernetes', description: 'Container orchestration', clouds: 'EKS, GKE, AKS, Self-hosted' },
        { name: 'PostgreSQL', description: 'Relational database', clouds: 'RDS, Cloud SQL, Azure Database' },
        { name: 'Redis', description: 'In-memory cache', clouds: 'ElastiCache, Memorystore, Azure Cache' },
        { name: 'Kafka', description: 'Event streaming', clouds: 'MSK, Confluent Cloud, Event Hubs' },
        { name: 'Prometheus', description: 'Monitoring', clouds: 'AMP, GMP, Azure Monitor' },
        { name: 'Terraform', description: 'Infrastructure as Code', clouds: 'All clouds supported' }
      ]
    }
  };

  return (
    <div className="space-y-8">
      {/* Definitions */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">What's the Difference?</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">☁️</div>
              <div>
                <h4 className="text-xl font-semibold">Cloud-Native</h4>
                <Badge>Optimized for One Cloud</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Applications built using cloud provider-specific services (managed databases, serverless, proprietary APIs). Optimized for performance, scalability, and cost on that specific cloud.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
              <p className="text-xs font-semibold mb-2">Example Architecture</p>
              <p className="text-xs font-mono">
                API Gateway → Lambda → DynamoDB<br />
                + S3 + CloudWatch + SNS/SQS<br />
                + Cognito for auth
              </p>
            </div>
          </Card>

          <Card className="p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🌐</div>
              <div>
                <h4 className="text-xl font-semibold">Cloud-Agnostic</h4>
                <Badge variant="outline">Portable Across Clouds</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Applications built using open-source or standard technologies that can run on any cloud (or on-premises). Prioritizes portability and vendor independence over cloud-specific optimizations.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
              <p className="text-xs font-semibold mb-2">Example Architecture</p>
              <p className="text-xs font-mono">
                Kubernetes + Ingress → Node.js pods<br />
                + PostgreSQL + Redis<br />
                + Prometheus + OAuth2
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Trade-offs Analysis */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Detailed Trade-offs Analysis</h3>
        <div className="overflow-x-auto">
          <Card className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Criteria</th>
                  <th className="text-left p-3 font-semibold">Cloud-Native</th>
                  <th className="text-left p-3 font-semibold">Cloud-Agnostic</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Development Speed</td>
                  <td className="p-3">🟢 <strong>Faster</strong><br /><span className="text-xs text-muted-foreground">Managed services, less ops work</span></td>
                  <td className="p-3">🟡 <strong>Slower</strong><br /><span className="text-xs text-muted-foreground">More infrastructure setup required</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Operational Overhead</td>
                  <td className="p-3">🟢 <strong>Low</strong><br /><span className="text-xs text-muted-foreground">Provider manages infrastructure</span></td>
                  <td className="p-3">🔴 <strong>High</strong><br /><span className="text-xs text-muted-foreground">You manage everything</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Vendor Lock-In</td>
                  <td className="p-3">🔴 <strong>High</strong><br /><span className="text-xs text-muted-foreground">Hard to migrate away</span></td>
                  <td className="p-3">🟢 <strong>Low</strong><br /><span className="text-xs text-muted-foreground">Easy to switch providers</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Cost (Small Scale)</td>
                  <td className="p-3">🟢 <strong>Lower</strong><br /><span className="text-xs text-muted-foreground">Pay only for usage, no ops team</span></td>
                  <td className="p-3">🔴 <strong>Higher</strong><br /><span className="text-xs text-muted-foreground">Minimum instance costs + ops team</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Cost (Large Scale)</td>
                  <td className="p-3">🟡 <strong>Variable</strong><br /><span className="text-xs text-muted-foreground">Can get expensive, but optimized</span></td>
                  <td className="p-3">🟢 <strong>Lower</strong><br /><span className="text-xs text-muted-foreground">More control over costs</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Performance</td>
                  <td className="p-3">🟢 <strong>Optimized</strong><br /><span className="text-xs text-muted-foreground">Native integrations, low latency</span></td>
                  <td className="p-3">🟡 <strong>Good</strong><br /><span className="text-xs text-muted-foreground">Depends on your optimization</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Scalability</td>
                  <td className="p-3">🟢 <strong>Excellent</strong><br /><span className="text-xs text-muted-foreground">Auto-scaling built-in</span></td>
                  <td className="p-3">🟡 <strong>Good</strong><br /><span className="text-xs text-muted-foreground">Need to configure HPA/VPA</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Disaster Recovery</td>
                  <td className="p-3">🟡 <strong>Provider-dependent</strong><br /><span className="text-xs text-muted-foreground">If provider fails, you fail</span></td>
                  <td className="p-3">🟢 <strong>Flexible</strong><br /><span className="text-xs text-muted-foreground">Can fail over to different cloud</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Skills Required</td>
                  <td className="p-3">🟡 <strong>Cloud-specific</strong><br /><span className="text-xs text-muted-foreground">AWS/GCP/Azure expertise</span></td>
                  <td className="p-3">🟢 <strong>Transferable</strong><br /><span className="text-xs text-muted-foreground">Kubernetes, Linux, open-source</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Testing Locally</td>
                  <td className="p-3">🔴 <strong>Difficult</strong><br /><span className="text-xs text-muted-foreground">Need emulators (LocalStack)</span></td>
                  <td className="p-3">🟢 <strong>Easy</strong><br /><span className="text-xs text-muted-foreground">Run same stack locally</span></td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Compliance Control</td>
                  <td className="p-3">🟡 <strong>Limited</strong><br /><span className="text-xs text-muted-foreground">Provider's compliance</span></td>
                  <td className="p-3">🟢 <strong>Full Control</strong><br /><span className="text-xs text-muted-foreground">You control everything</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Innovation Speed</td>
                  <td className="p-3">🟢 <strong>Fast</strong><br /><span className="text-xs text-muted-foreground">New features from provider</span></td>
                  <td className="p-3">🟡 <strong>Slower</strong><br /><span className="text-xs text-muted-foreground">Wait for open-source adoption</span></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* When to Use Each */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">When to Use Each Approach</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-blue-200 dark:border-blue-800">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>☁️</span>
              <span>Choose Cloud-Native When</span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 font-bold">1.</span>
                <div>
                  <strong>You're a startup or small team</strong>
                  <p className="text-xs text-muted-foreground mt-1">Need to move fast, limited engineering resources. Managed services let you focus on product.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 font-bold">2.</span>
                <div>
                  <strong>Time-to-market is critical</strong>
                  <p className="text-xs text-muted-foreground mt-1">Competitive market, need to launch quickly. Cloud-native is 2-3x faster to production.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 font-bold">3.</span>
                <div>
                  <strong>You want to minimize operations</strong>
                  <p className="text-xs text-muted-foreground mt-1">Don't want to hire DevOps team. Let cloud provider handle infrastructure.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 font-bold">4.</span>
                <div>
                  <strong>Unpredictable workload patterns</strong>
                  <p className="text-xs text-muted-foreground mt-1">Serverless and auto-scaling handle spikes automatically without capacity planning.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 font-bold">5.</span>
                <div>
                  <strong>You're confident in your cloud choice</strong>
                  <p className="text-xs text-muted-foreground mt-1">Happy with AWS/GCP/Azure and don't see switching soon. Lock-in acceptable trade-off.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 font-bold">6.</span>
                <div>
                  <strong>Cost at small scale matters</strong>
                  <p className="text-xs text-muted-foreground mt-1">Pay-per-use is cheaper than minimum instance costs when traffic is low.</p>
                </div>
              </li>
            </ul>
          </Card>

          <Card className="p-6 border-green-200 dark:border-green-800">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🌐</span>
              <span>Choose Cloud-Agnostic When</span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 font-bold">1.</span>
                <div>
                  <strong>You have strong DevOps capabilities</strong>
                  <p className="text-xs text-muted-foreground mt-1">Platform engineering team in place. Can manage Kubernetes, databases, monitoring.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 font-bold">2.</span>
                <div>
                  <strong>Vendor lock-in is a real concern</strong>
                  <p className="text-xs text-muted-foreground mt-1">Need flexibility to switch providers. Regulatory or strategic requirements.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 font-bold">3.</span>
                <div>
                  <strong>Multi-cloud or hybrid cloud required</strong>
                  <p className="text-xs text-muted-foreground mt-1">Need to run in multiple clouds or on-premises. Same stack everywhere.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 font-bold">4.</span>
                <div>
                  <strong>At scale where costs matter</strong>
                  <p className="text-xs text-muted-foreground mt-1">High traffic where managed service costs are significant. Can optimize better yourself.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 font-bold">5.</span>
                <div>
                  <strong>Need fine-grained control</strong>
                  <p className="text-xs text-muted-foreground mt-1">Specific performance, security, or compliance requirements. Managed services too limiting.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 font-bold">6.</span>
                <div>
                  <strong>Have existing on-prem infrastructure</strong>
                  <p className="text-xs text-muted-foreground mt-1">Migrating from data center. Want consistent experience across environments.</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Abstraction Layers */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Abstraction Layers for Portability</h3>
        <Alert className="mb-4">
          <AlertDescription>
            <strong>💡 Key Insight:</strong> You can achieve cloud-agnostic benefits while using managed services through abstraction layers. This is a middle-ground approach.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">⚙️</div>
              <div>
                <h4 className="text-lg font-semibold">Kubernetes</h4>
                <Badge>Container Orchestration</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Run containerized applications on any cloud (or on-premises)
            </p>
            <div className="space-y-2 text-xs">
              <p><strong>AWS:</strong> EKS (Elastic Kubernetes Service)</p>
              <p><strong>GCP:</strong> GKE (Google Kubernetes Engine)</p>
              <p><strong>Azure:</strong> AKS (Azure Kubernetes Service)</p>
              <p><strong>On-prem:</strong> Self-hosted, Rancher, OpenShift</p>
            </div>
            <div className="mt-3 p-3 bg-muted rounded">
              <p className="text-xs"><strong>Trade-off:</strong> More complex than serverless, but portable</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🏗️</div>
              <div>
                <h4 className="text-lg font-semibold">Terraform / Pulumi</h4>
                <Badge>Infrastructure as Code</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Define infrastructure declaratively, works with all clouds
            </p>
            <div className="space-y-2 text-xs">
              <p><strong>Terraform:</strong> HCL language, huge ecosystem</p>
              <p><strong>Pulumi:</strong> TypeScript, Python, Go, C#</p>
              <p><strong>Crossplane:</strong> Kubernetes-native IaC</p>
              <p><strong>CDK for Terraform:</strong> Type-safe TypeScript</p>
            </div>
            <div className="mt-3 p-3 bg-muted rounded">
              <p className="text-xs"><strong>Trade-off:</strong> Still need provider-specific modules, but easier to switch</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">📊</div>
              <div>
                <h4 className="text-lg font-semibold">Open-Source Data Stores</h4>
                <Badge>Databases & Caches</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Use portable databases available as managed services everywhere
            </p>
            <div className="space-y-2 text-xs">
              <p><strong>PostgreSQL:</strong> RDS, Cloud SQL, Azure Database</p>
              <p><strong>MySQL:</strong> All clouds support it</p>
              <p><strong>Redis:</strong> ElastiCache, Memorystore, Azure Cache</p>
              <p><strong>MongoDB:</strong> Atlas (cloud-agnostic), DocumentDB</p>
            </div>
            <div className="mt-3 p-3 bg-muted rounded">
              <p className="text-xs"><strong>Trade-off:</strong> Can switch clouds, but miss cloud-specific optimizations</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🔌</div>
              <div>
                <h4 className="text-lg font-semibold">Service Meshes</h4>
                <Badge>Networking Abstraction</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Abstract networking, security, and observability from infrastructure
            </p>
            <div className="space-y-2 text-xs">
              <p><strong>Istio:</strong> Most feature-rich, complex</p>
              <p><strong>Linkerd:</strong> Lightweight, easier to use</p>
              <p><strong>Consul:</strong> Multi-cloud friendly</p>
              <p><strong>AWS App Mesh:</strong> AWS-specific but portable code</p>
            </div>
            <div className="mt-3 p-3 bg-muted rounded">
              <p className="text-xs"><strong>Trade-off:</strong> Adds complexity, but provides consistent networking</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Real-World Examples */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Real-World Examples</h3>
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📱</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold">Instagram (Facebook/Meta)</h4>
                  <Badge>Cloud-Native</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Initially built on AWS with heavy use of managed services. Later migrated to custom infrastructure as they scaled.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded space-y-2 text-xs">
                  <p><strong>Early Days (Cloud-Native):</strong> EC2, RDS, S3, CloudFront, ElastiCache</p>
                  <p><strong>Why it worked:</strong> Fast to market, minimal ops overhead, focus on product</p>
                  <p><strong>Evolution:</strong> As they scaled to billions of users, moved to custom infrastructure for cost and control</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎵</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold">Spotify</h4>
                  <Badge variant="outline">Cloud-Agnostic</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Built on-premises initially, then migrated to GCP using Kubernetes for portability.
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded space-y-2 text-xs">
                  <p><strong>Architecture:</strong> Kubernetes (GKE), Cassandra, Kafka, PostgreSQL, Redis</p>
                  <p><strong>Why it worked:</strong> Already had DevOps expertise, wanted control and portability</p>
                  <p><strong>Benefit:</strong> Can move workloads between clouds if needed, created Backstage.io for developer portal</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📺</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold">Netflix</h4>
                  <Badge>Cloud-Native</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  All-in on AWS with extensive use of managed services and custom tooling on top.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded space-y-2 text-xs">
                  <p><strong>Architecture:</strong> EC2, S3, CloudFront, DynamoDB, Kinesis, plus custom tools (Spinnaker, Eureka, Hystrix)</p>
                  <p><strong>Why it worked:</strong> AWS partnership, deeply integrated, optimized for their specific needs</p>
                  <p><strong>Trade-off:</strong> Heavily locked into AWS, but scale and reliability justify it</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏪</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold">Shopify</h4>
                  <Badge variant="outline">Hybrid Approach</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Uses both GCP managed services and open-source tools for flexibility.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded space-y-2 text-xs">
                  <p><strong>Architecture:</strong> Kubernetes (GKE), PostgreSQL, Redis, Kafka, custom Ruby on Rails</p>
                  <p><strong>Strategy:</strong> Use managed Kubernetes, but open-source everything else</p>
                  <p><strong>Benefit:</strong> Get cloud benefits (managed k8s) without full lock-in</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Decision Matrix */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Decision Matrix</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">If you answer YES to 3+ of these, go Cloud-Native:</h4>
              <ul className="space-y-1 text-sm">
                <li>□ You have fewer than 10 engineers</li>
                <li>□ You need to launch in {"<"} 6 months</li>
                <li>□ Your team lacks DevOps expertise</li>
                <li>□ You're comfortable with one cloud provider</li>
                <li>□ Development speed {">"} cost optimization</li>
                <li>□ You want to minimize operational overhead</li>
              </ul>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">If you answer YES to 3+ of these, go Cloud-Agnostic:</h4>
              <ul className="space-y-1 text-sm">
                <li>□ You have a dedicated platform engineering team</li>
                <li>□ Vendor lock-in is a major concern</li>
                <li>□ You need to run on multiple clouds</li>
                <li>□ You have existing on-premises infrastructure</li>
                <li>□ Cost optimization {">"} development speed</li>
                <li>□ Your team has strong Kubernetes/DevOps skills</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Line */}
      <Alert>
        <AlertDescription>
          <strong>🎯 Bottom Line:</strong> Most startups should start cloud-native for speed, then evaluate cloud-agnostic as they scale. Large enterprises with existing infrastructure should consider cloud-agnostic from the start. The middle ground is using Kubernetes with managed databases and storage.
        </AlertDescription>
      </Alert>
    </div>
  );
}
