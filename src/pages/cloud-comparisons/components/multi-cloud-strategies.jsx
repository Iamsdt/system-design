import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MultiCloudStrategies() {
  const [selectedStrategy, setSelectedStrategy] = useState('multi-cloud');

  const strategies = {
    'multi-cloud': {
      name: 'Multi-Cloud',
      description: 'Using multiple cloud providers simultaneously',
      pros: [
        'Avoid vendor lock-in',
        'Leverage best-of-breed services',
        'Geographic coverage',
        'Price negotiation leverage',
        'Regulatory compliance flexibility'
      ],
      cons: [
        'Increased complexity',
        'Higher operational overhead',
        'Skills gap across platforms',
        'Network latency between clouds',
        'Cost of data egress'
      ],
      useCase: 'Large enterprises with diverse requirements and resources to manage complexity'
    },
    'single-cloud': {
      name: 'Single Cloud',
      description: 'All workloads on one cloud provider',
      pros: [
        'Simplicity',
        'Deep integration',
        'Lower operational cost',
        'Easier to optimize',
        'Better volume discounts'
      ],
      cons: [
        'Vendor lock-in risk',
        'Single point of failure',
        'Limited negotiation power',
        'Dependent on provider roadmap',
        'Compliance limitations'
      ],
      useCase: 'Startups, SMBs, and companies with straightforward requirements'
    },
    'poly-cloud': {
      name: 'Poly-Cloud',
      description: 'Different clouds for different workloads (not duplicated)',
      pros: [
        'Best tool for each job',
        'Moderate complexity',
        'Flexibility without duplication',
        'Cost optimization',
        'Strategic positioning'
      ],
      cons: [
        'Some operational overhead',
        'Skills needed for multiple platforms',
        'Integration challenges',
        'Data transfer costs',
        'Governance complexity'
      ],
      useCase: 'Companies wanting cloud flexibility without full multi-cloud complexity'
    }
  };

  return (
    <div className="space-y-8">
      {/* Why Multi-Cloud */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Why Multi-Cloud?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🎯</div>
              <h4 className="text-lg font-semibold">Avoid Vendor Lock-In</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              No single vendor controls your entire infrastructure. Easier to migrate or switch providers if needed.
            </p>
            <div className="bg-muted p-3 rounded">
              <p className="text-xs font-mono">Example: Use AWS for compute, GCP for ML, Azure for Microsoft integration</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🏆</div>
              <h4 className="text-lg font-semibold">Best-of-Breed Services</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Choose the best service from each provider for your specific needs.
            </p>
            <div className="bg-muted p-3 rounded">
              <p className="text-xs font-mono">
                AWS: Lambda, S3, DynamoDB<br />
                GCP: BigQuery, Vertex AI<br />
                Azure: AD, Active Directory
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🌍</div>
              <h4 className="text-lg font-semibold">Geographic Coverage</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Leverage different providers' presence in different regions for optimal latency and compliance.
            </p>
            <div className="bg-muted p-3 rounded">
              <p className="text-xs font-mono">AWS in US, Alibaba Cloud in China, local providers in Europe</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">💰</div>
              <h4 className="text-lg font-semibold">Cost Optimization</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Arbitrage pricing differences and negotiate better deals with multiple vendors.
            </p>
            <div className="bg-muted p-3 rounded">
              <p className="text-xs font-mono">Use spot instances from cheapest provider, compare storage costs</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Strategy Comparison */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Cloud Strategy Comparison</h3>
        <Tabs value={selectedStrategy} onValueChange={setSelectedStrategy}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="multi-cloud">Multi-Cloud</TabsTrigger>
            <TabsTrigger value="poly-cloud">Poly-Cloud</TabsTrigger>
            <TabsTrigger value="single-cloud">Single Cloud</TabsTrigger>
          </TabsList>

          {Object.entries(strategies).map(([key, strategy]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <Card className="p-6">
                <div className="mb-4">
                  <h4 className="text-xl font-semibold mb-2">{strategy.name}</h4>
                  <p className="text-muted-foreground">{strategy.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3 text-green-600 dark:text-green-400">✅ Advantages</h5>
                    <ul className="space-y-2">
                      {strategy.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">+</span>
                          <span className="text-sm">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-3 text-red-600 dark:text-red-400">❌ Disadvantages</h5>
                    <ul className="space-y-2">
                      {strategy.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">-</span>
                          <span className="text-sm">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded">
                  <h5 className="font-semibold mb-2">Best For</h5>
                  <p className="text-sm">{strategy.useCase}</p>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Portability Concerns */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Portability Concerns & Solutions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>Compute Portability</span>
            </h4>
            <div className="space-y-3">
              <div>
                <Badge className="mb-2">Problem</Badge>
                <p className="text-sm text-muted-foreground">Different VM types, configurations, and APIs across providers</p>
              </div>
              <div>
                <Badge variant="outline" className="mb-2">Solution</Badge>
                <div className="space-y-1">
                  <p className="text-sm">• Use Kubernetes for workload portability</p>
                  <p className="text-sm">• Containerize everything (Docker)</p>
                  <p className="text-sm">• Infrastructure as Code (Terraform, Pulumi)</p>
                  <p className="text-sm">• Avoid provider-specific features in code</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>Storage Portability</span>
            </h4>
            <div className="space-y-3">
              <div>
                <Badge className="mb-2">Problem</Badge>
                <p className="text-sm text-muted-foreground">Different storage services: S3 vs Cloud Storage vs Blob Storage</p>
              </div>
              <div>
                <Badge variant="outline" className="mb-2">Solution</Badge>
                <div className="space-y-1">
                  <p className="text-sm">• Use S3-compatible interfaces</p>
                  <p className="text-sm">• Abstract storage layer (e.g., MinIO)</p>
                  <p className="text-sm">• Multi-cloud storage gateways</p>
                  <p className="text-sm">• Object storage standards (OpenStack Swift)</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>Database Portability</span>
            </h4>
            <div className="space-y-3">
              <div>
                <Badge className="mb-2">Problem</Badge>
                <p className="text-sm text-muted-foreground">Managed databases with proprietary features (DynamoDB, CosmosDB, Firestore)</p>
              </div>
              <div>
                <Badge variant="outline" className="mb-2">Solution</Badge>
                <div className="space-y-1">
                  <p className="text-sm">• Use portable databases (PostgreSQL, MySQL)</p>
                  <p className="text-sm">• Self-managed on Kubernetes</p>
                  <p className="text-sm">• Database abstraction layers (Prisma, TypeORM)</p>
                  <p className="text-sm">• Avoid cloud-specific features</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>Networking Portability</span>
            </h4>
            <div className="space-y-3">
              <div>
                <Badge className="mb-2">Problem</Badge>
                <p className="text-sm text-muted-foreground">VPC, security groups, routing - all provider-specific</p>
              </div>
              <div>
                <Badge variant="outline" className="mb-2">Solution</Badge>
                <div className="space-y-1">
                  <p className="text-sm">• Service mesh (Istio, Linkerd)</p>
                  <p className="text-sm">• Consistent network policies</p>
                  <p className="text-sm">• Cloud-agnostic VPN solutions</p>
                  <p className="text-sm">• Standard protocols (HTTP, gRPC)</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Vendor Lock-In Mitigation */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Vendor Lock-In Mitigation Strategies</h3>
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">1️⃣</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Use Open Standards & Protocols</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Avoid proprietary protocols. Stick to HTTP/REST, gRPC, OpenAPI, OAuth2, OIDC.
                </p>
                <div className="grid md:grid-cols-2 gap-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">✓ Good</p>
                    <p className="text-xs font-mono">PostgreSQL, Redis, Kafka, Kubernetes</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                    <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">✗ Avoid</p>
                    <p className="text-xs font-mono">DynamoDB, Lambda proprietary runtimes, Fargate-specific configs</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">2️⃣</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Abstract Cloud-Specific Services</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Create abstraction layers so your application code doesn't depend on cloud APIs directly.
                </p>
                <div className="bg-muted p-4 rounded">
                  <code className="text-xs block whitespace-pre font-mono">
{`// Bad: Direct AWS SDK usage
const s3 = new AWS.S3();
await s3.putObject({ Bucket: 'my-bucket', Key: 'file.txt', Body: data });

// Good: Abstraction layer
interface StorageService {
  upload(key: string, data: Buffer): Promise<void>;
}
class CloudStorage implements StorageService {
  // Can swap implementations for different clouds
  async upload(key: string, data: Buffer) { /* ... */ }
}`}
                  </code>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">3️⃣</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Use Infrastructure as Code (IaC)</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Define infrastructure declaratively so you can recreate it on any cloud.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge>Terraform</Badge>
                    <span className="text-sm">Multi-cloud support, largest ecosystem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Pulumi</Badge>
                    <span className="text-sm">Real programming languages (TypeScript, Python)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Crossplane</Badge>
                    <span className="text-sm">Kubernetes-native IaC</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">4️⃣</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Containerize Everything</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Containers provide portability. Kubernetes adds orchestration portability.
                </p>
                <div className="bg-muted p-3 rounded space-y-2">
                  <p className="text-sm"><strong>Docker:</strong> Package apps with dependencies</p>
                  <p className="text-sm"><strong>Kubernetes:</strong> Run anywhere (EKS, GKE, AKS, on-prem)</p>
                  <p className="text-sm"><strong>Helm:</strong> Package and deploy applications consistently</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">5️⃣</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Maintain Exit Strategy</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Regularly test your ability to migrate. Document the process.
                </p>
                <div className="space-y-1 text-sm">
                  <p>• Document all cloud dependencies</p>
                  <p>• Test backup and restore procedures</p>
                  <p>• Create disaster recovery plans</p>
                  <p>• Conduct migration drills annually</p>
                  <p>• Keep data in portable formats</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Cost Optimization */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Multi-Cloud Cost Optimization</h3>
        <Alert>
          <AlertDescription>
            <strong>💡 Key Insight:</strong> Multi-cloud can save money through arbitrage, but adds operational overhead. Calculate the total cost of ownership (TCO) including engineering time.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-3">Price Arbitrage</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Use the cheapest provider for each workload type
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-muted rounded">
                <span>Compute</span>
                <span className="font-mono">AWS spot: 70% cheaper</span>
              </div>
              <div className="flex justify-between p-2 bg-muted rounded">
                <span>Storage</span>
                <span className="font-mono">GCP: $0.020/GB</span>
              </div>
              <div className="flex justify-between p-2 bg-muted rounded">
                <span>Bandwidth</span>
                <span className="font-mono">Cloudflare: Free egress</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3">Committed Use</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Commit to each provider separately for discounts
            </p>
            <div className="space-y-2 text-xs">
              <p>• AWS Reserved: 30-70% off</p>
              <p>• GCP Committed: 25-57% off</p>
              <p>• Azure Reserved: 38-72% off</p>
              <p>• Split commitment strategically</p>
              <p>• Balance flexibility vs savings</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3">Avoid Hidden Costs</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Multi-cloud has unique costs to watch
            </p>
            <div className="space-y-2 text-xs">
              <p>❌ Data egress between clouds ($0.08-0.12/GB)</p>
              <p>❌ Duplicate monitoring tools</p>
              <p>❌ Multiple support contracts</p>
              <p>❌ Training for each platform</p>
              <p>❌ Integration and orchestration</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Complexity Trade-offs */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Complexity vs Flexibility Trade-offs</h3>
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Aspect</th>
                  <th className="text-left p-3">Single Cloud</th>
                  <th className="text-left p-3">Poly-Cloud</th>
                  <th className="text-left p-3">Multi-Cloud (Full)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Operational Complexity</td>
                  <td className="p-3">🟢 Low</td>
                  <td className="p-3">🟡 Medium</td>
                  <td className="p-3">🔴 High</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Vendor Lock-In Risk</td>
                  <td className="p-3">🔴 High</td>
                  <td className="p-3">🟡 Medium</td>
                  <td className="p-3">🟢 Low</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Cost Optimization Potential</td>
                  <td className="p-3">🟡 Medium</td>
                  <td className="p-3">🟢 High</td>
                  <td className="p-3">🟢 Very High</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Skills Required</td>
                  <td className="p-3">🟢 1 platform</td>
                  <td className="p-3">🟡 2-3 platforms</td>
                  <td className="p-3">🔴 3+ platforms</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Integration Effort</td>
                  <td className="p-3">🟢 Low</td>
                  <td className="p-3">🟡 Medium</td>
                  <td className="p-3">🔴 High</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Monitoring & Debugging</td>
                  <td className="p-3">🟢 Simple</td>
                  <td className="p-3">🟡 Moderate</td>
                  <td className="p-3">🔴 Complex</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Disaster Recovery</td>
                  <td className="p-3">🔴 Single point</td>
                  <td className="p-3">🟡 Partial redundancy</td>
                  <td className="p-3">🟢 Full redundancy</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Time to Production</td>
                  <td className="p-3">🟢 Fastest</td>
                  <td className="p-3">🟡 Moderate</td>
                  <td className="p-3">🔴 Slowest</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Decision Framework */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Decision Framework: Should You Go Multi-Cloud?</h3>
        <div className="space-y-4">
          <Card className="p-6 border-green-200 dark:border-green-800">
            <h4 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-400">✅ Go Multi-Cloud If:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>You have dedicated platform engineering teams ({">"} 5 engineers)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Compliance requires data residency in regions not covered by one provider</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>You need best-of-breed services from multiple providers (e.g., GCP ML + AWS compute)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>You have budget for increased operational overhead (15-30% more engineering time)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>You're a large enterprise with complex, diverse workloads</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>You have leverage to negotiate better pricing with multiple vendors</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 border-red-200 dark:border-red-800">
            <h4 className="text-lg font-semibold mb-3 text-red-700 dark:text-red-400">❌ Avoid Multi-Cloud If:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>You're a startup or SMB with limited engineering resources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Your team is not experienced with cloud infrastructure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>You need to move fast and iterate quickly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Your workload fits well within one cloud provider's ecosystem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>You can't justify the 15-30% operational overhead</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>You're doing it "just because" without clear business value</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 border-yellow-200 dark:border-yellow-800">
            <h4 className="text-lg font-semibold mb-3 text-yellow-700 dark:text-yellow-400">⚠️ Consider Poly-Cloud If:</h4>
            <p className="text-sm text-muted-foreground mb-3">
              You want flexibility without full multi-cloud complexity
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">→</span>
                <span>Different workloads on different clouds (not duplicated)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">→</span>
                <span>Example: Web app on AWS, data analytics on GCP, AD integration on Azure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">→</span>
                <span>Easier to manage than full multi-cloud but still provides flexibility</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Final Recommendation */}
      <Alert>
        <AlertDescription>
          <strong>🎯 Bottom Line:</strong> Most companies should start with a single cloud. Only go multi-cloud when you have clear business justification, resources, and expertise. Premature multi-cloud adoption is a common mistake that adds complexity without value.
        </AlertDescription>
      </Alert>
    </div>
  );
}
