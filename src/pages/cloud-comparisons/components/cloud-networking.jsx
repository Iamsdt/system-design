import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CloudNetworking() {
  const [selectedPattern, setSelectedPattern] = useState('peering');

  const patterns = {
    peering: {
      name: 'VPC Peering',
      description: 'Direct connection between two VPCs',
      pros: ['Low latency', 'No single point of failure', 'Simple setup', 'Free data transfer (same region)'],
      cons: ['Non-transitive (no daisy-chain)', 'Hard to scale (full mesh needed)', 'Cross-region costs $0.01-0.02/GB'],
      useCases: ['Connect 2-3 VPCs', 'Same region connectivity', 'Low-scale deployments']
    },
    transit: {
      name: 'Transit Gateway / Cloud Router',
      description: 'Hub-and-spoke network topology',
      pros: ['Transitive routing (hub-and-spoke)', 'Scales to 100s of VPCs', 'Centralized management', 'Cross-region support'],
      cons: ['$0.05/hour per attachment', 'Data transfer $0.02/GB', 'Adds latency (extra hop)', 'More complex'],
      useCases: ['10+ VPCs', 'Complex network topologies', 'Hybrid cloud', 'Multi-account organizations']
    },
    privatelink: {
      name: 'Private Link / Service Endpoints',
      description: 'Access services privately without public IPs',
      pros: ['No internet exposure', 'Simple DNS-based access', 'Works across accounts/VPCs', 'No VPC peering needed'],
      cons: ['$0.01/hour per endpoint', 'Data transfer $0.01/GB', 'Service-specific (not all services)', 'One-way connection'],
      useCases: ['SaaS connectivity', 'Shared services', 'Cross-account access', 'Security-sensitive apps']
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-4">Cloud Networking Patterns</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Cloud networking connects VPCs, on-prem data centers, and cloud services. Different patterns offer trade-offs between simplicity, scalability, cost, and security.
          </p>
          <div className="flex gap-2 mb-4">
            {Object.entries(patterns).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => setSelectedPattern(key)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedPattern === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {pattern.name}
              </button>
            ))}
          </div>
          <div className="p-6 border rounded-lg">
            <h4 className="text-lg font-semibold mb-2">{patterns[selectedPattern].name}</h4>
            <p className="text-sm text-muted-foreground mb-4">{patterns[selectedPattern].description}</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Badge className="mb-2">Pros</Badge>
                <ul className="space-y-1 text-sm">
                  {patterns[selectedPattern].pros.map((pro, idx) => (
                    <li key={idx}>✓ {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Badge variant="destructive" className="mb-2">Cons</Badge>
                <ul className="space-y-1 text-sm">
                  {patterns[selectedPattern].cons.map((con, idx) => (
                    <li key={idx}>✗ {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <Badge variant="outline" className="mb-2">Use Cases</Badge>
              <ul className="space-y-1 text-sm">
                {patterns[selectedPattern].useCases.map((useCase, idx) => (
                  <li key={idx}>• {useCase}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">AWS Networking Options</h3>
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔗</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">VPC Peering</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  One-to-one connection between VPCs. Non-transitive.
                </p>
                <div className="bg-muted p-3 rounded font-mono text-xs mb-3">
                  VPC-A {"<-->"} VPC-B (can communicate)<br />
                  VPC-B {"<-->"} VPC-C (can communicate)<br />
                  VPC-A {"<--X-->"} VPC-C (CANNOT communicate)
                </div>
                <p className="text-xs"><strong>Cost:</strong> Free (same region), $0.01/GB (cross-region)</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⭐</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Transit Gateway</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Hub-and-spoke: all VPCs connect to central Transit Gateway. Transitive routing enabled.
                </p>
                <div className="bg-muted p-3 rounded font-mono text-xs mb-3">
                  VPC-A --{">"} TGW {"<"}-- VPC-B<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VPC-C (all can communicate)
                </div>
                <p className="text-xs"><strong>Cost:</strong> $0.05/hour/attachment + $0.02/GB</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔒</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">PrivateLink</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Access services via private IPs without peering. Uses VPC endpoints.
                </p>
                <div className="bg-muted p-3 rounded font-mono text-xs mb-3">
                  Consumer VPC → VPC Endpoint → Provider Service<br />
                  (Private IPs, no internet)
                </div>
                <p className="text-xs"><strong>Cost:</strong> $0.01/hour/endpoint + $0.01/GB</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🚀</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Direct Connect</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Dedicated network connection from on-prem to AWS
                </p>
                <div className="grid md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-muted rounded">
                    <p className="font-semibold mb-1">1 Gbps</p>
                    <p>$0.30/hour ($216/month)</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="font-semibold mb-1">10 Gbps</p>
                    <p>$2.25/hour ($1,620/month)</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <p className="font-semibold mb-1">100 Gbps</p>
                    <p>Custom pricing</p>
                  </div>
                </div>
                <p className="text-xs mt-3"><strong>Latency:</strong> 1-10ms (vs 20-100ms for VPN)</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Azure Networking Options</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">VNet Peering</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Similar to AWS VPC Peering. Non-transitive.
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ Low latency, high bandwidth</p>
              <p>✗ Non-transitive routing</p>
              <p><strong>Cost:</strong> $0.01/GB (same region), $0.035/GB (cross-region)</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Virtual WAN</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Hub-and-spoke for large-scale networks. Azure's Transit Gateway.
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ Transitive routing</p>
              <p>✓ Integrated VPN/ExpressRoute</p>
              <p><strong>Cost:</strong> $0.25/hour/hub + $0.02/GB</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Private Endpoint</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Access Azure services privately. Similar to AWS PrivateLink.
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ No public IP needed</p>
              <p>✗ Service-specific</p>
              <p><strong>Cost:</strong> $0.01/hour + data transfer</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">ExpressRoute</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Dedicated connection to Azure. Similar to AWS Direct Connect.
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ 50 Mbps to 100 Gbps</p>
              <p>✓ 99.95% SLA</p>
              <p><strong>Cost:</strong> $55-$51,300/month (varies by speed)</p>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">GCP Networking Options</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">VPC Peering</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Connect VPCs privately. Works across projects and organizations.
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ No egress charges (same region)</p>
              <p>✗ Non-transitive</p>
              <p><strong>Cost:</strong> Free (same region), $0.01/GB (cross-region)</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Cloud Router</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Dynamic routing for Cloud VPN and Interconnect. Not a full Transit Gateway equivalent.
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ BGP routing</p>
              <p>✗ No hub-and-spoke for VPCs</p>
              <p><strong>Cost:</strong> Free (router itself)</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Private Service Connect</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Access Google services or 3rd party services privately.
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ No public IPs</p>
              <p>✓ Works across organizations</p>
              <p><strong>Cost:</strong> $0.01/hour + data transfer</p>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-3">Cloud Interconnect</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Dedicated connection to GCP. Available in 10 Gbps or 100 Gbps.
            </p>
            <div className="space-y-2 text-xs">
              <p>✓ Low latency (1-10ms)</p>
              <p>✓ 99.9% SLA</p>
              <p><strong>Cost:</strong> $1,750-$11,000/month (10-100 Gbps)</p>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Cross-Cloud Connectivity</h3>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Connecting workloads across different cloud providers (e.g., AWS to GCP).
          </p>
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">1. VPN Tunnel</h4>
              <p className="text-sm text-muted-foreground mb-2">
                IPsec tunnel over internet between cloud VPNs
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <Badge className="mb-1">Pros</Badge>
                  <p>✓ Cheap ($50-100/month)</p>
                  <p>✓ Easy setup (1-2 hours)</p>
                </div>
                <div>
                  <Badge variant="destructive" className="mb-1">Cons</Badge>
                  <p>✗ Lower bandwidth ({"<"}1 Gbps)</p>
                  <p>✗ Higher latency (20-100ms)</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">2. Dedicated Interconnect via Co-location</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Physical cross-connect at co-location facility (e.g., Equinix)
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <Badge className="mb-1">Pros</Badge>
                  <p>✓ Low latency (1-10ms)</p>
                  <p>✓ High bandwidth (10-100 Gbps)</p>
                </div>
                <div>
                  <Badge variant="destructive" className="mb-1">Cons</Badge>
                  <p>✗ Expensive ($3K-20K/month)</p>
                  <p>✗ Complex setup (weeks)</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">3. Third-Party SD-WAN</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Use Megaport, PacketFabric, or Aviatrix for multi-cloud networking
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <Badge className="mb-1">Pros</Badge>
                  <p>✓ Unified management</p>
                  <p>✓ Optimized routing</p>
                </div>
                <div>
                  <Badge variant="destructive" className="mb-1">Cons</Badge>
                  <p>✗ Additional vendor</p>
                  <p>✗ Extra cost ($500-5K/month)</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Cost Comparison</h3>
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Pattern</th>
                  <th className="text-left p-2">Setup Cost</th>
                  <th className="text-left p-2">Monthly Fee</th>
                  <th className="text-left p-2">Data Transfer</th>
                  <th className="text-left p-2">Best For</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b">
                  <td className="p-2 font-medium">VPC Peering</td>
                  <td className="p-2">$0</td>
                  <td className="p-2">$0</td>
                  <td className="p-2">$0-0.01/GB</td>
                  <td className="p-2">Small scale (2-5 VPCs)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Transit Gateway</td>
                  <td className="p-2">$0</td>
                  <td className="p-2">$36/VPC</td>
                  <td className="p-2">$0.02/GB</td>
                  <td className="p-2">Large scale (10+ VPCs)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">PrivateLink</td>
                  <td className="p-2">$0</td>
                  <td className="p-2">$7.30/endpoint</td>
                  <td className="p-2">$0.01/GB</td>
                  <td className="p-2">Service access</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">VPN</td>
                  <td className="p-2">$0</td>
                  <td className="p-2">$50-100</td>
                  <td className="p-2">$0.09/GB</td>
                  <td className="p-2">Low-bandwidth hybrid</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Direct Connect</td>
                  <td className="p-2">$1K-5K</td>
                  <td className="p-2">$200-1,600</td>
                  <td className="p-2">$0.02/GB</td>
                  <td className="p-2">High-bandwidth hybrid</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Alert className="mt-4">
            <AlertDescription>
              <strong>💡 Cost Tip:</strong> For 10+ VPCs, Transit Gateway is cheaper than full mesh peering. But for 2-3 VPCs, peering is $0/month vs $72-108/month for TGW.
            </AlertDescription>
          </Alert>
        </Card>
      </div>

      <Alert>
        <AlertDescription>
          <strong>🎯 Decision Guide:</strong> Start with VPC Peering for simplicity. Scale to Transit Gateway at 10+ VPCs. Use PrivateLink for service access. Choose Direct Connect/ExpressRoute only if you transfer {">"} 10 TB/month to justify the cost.
        </AlertDescription>
      </Alert>
    </div>
  );
}
