import React, { useState } from 'react';

const ServiceDiscovery = () => {
  const [selectedPattern, setSelectedPattern] = useState('overview');
  const [selectedTool, setSelectedTool] = useState('consul');

  const patterns = {
    overview: {
      name: 'Service Discovery Overview',
      icon: '🔍',
      description: 'How services find and communicate with each other in distributed systems',
      architecture: `
┌──────────────────────────────────────────┐
│       Service Discovery Flow             │
│                                          │
│  1. Service Registration                 │
│  ┌─────────┐                             │
│  │Service A│──register──►┌─────────────┐ │
│  └─────────┘             │   Service   │ │
│  ┌─────────┐             │  Registry   │ │
│  │Service B│──register──►│             │ │
│  └─────────┘             │ (Consul/    │ │
│  ┌─────────┐             │  etcd/DNS)  │ │
│  │Service C│──register──►│             │ │
│  └─────────┘             └─────────────┘ │
│                                  ▲       │
│  2. Service Discovery            │       │
│  ┌─────────┐                     │       │
│  │ Client  │──query services─────┘       │
│  └─────────┘                             │
│       │                                  │
│       └──call service──►┌─────────┐      │
│                         │Service A│      │
│                         └─────────┘      │
└──────────────────────────────────────────┘`,
      keyPoints: [
        'Services register on startup',
        'Central registry tracks all services',
        'Clients query registry to find services',
        'Health checks ensure availability',
        'Automatic deregistration on failure'
      ],
      benefits: [
        'Dynamic service locations',
        'Automatic failover',
        'Load balancing',
        'No hard-coded endpoints',
        'Scale services independently'
      ],
      challenges: [
        'Registry is single point of failure (need HA)',
        'Network latency for lookups',
        'Consistency vs availability trade-offs',
        'TTL and caching complexity'
      ]
    },
    clientSide: {
      name: 'Client-Side Discovery',
      icon: '👤',
      description: 'Client queries service registry directly and handles load balancing',
      architecture: `
┌────────────────────────────────────────┐
│   Client-Side Discovery Pattern        │
│                                        │
│  Step 1: Query Registry                │
│  ┌────────┐        ┌─────────────┐    │
│  │ Client │──1────►│   Service   │    │
│  │        │◄──2────│  Registry   │    │
│  └────┬───┘        └─────────────┘    │
│       │ (gets list: A1, A2, A3)       │
│       │                                │
│  Step 2: Client-Side Load Balancing    │
│       │                                │
│       ├──3a──►┌──────────┐             │
│       │       │Service A1│             │
│       ├──3b──►├──────────┤             │
│       │       │Service A2│             │
│       └──3c──►├──────────┤             │
│               │Service A3│             │
│               └──────────┘             │
│                                        │
│  Client decides which instance to call │
└────────────────────────────────────────┘`,
      keyPoints: [
        'Client queries registry directly',
        'Client maintains service instance list',
        'Client implements load balancing logic',
        'Direct connection to service instances',
        'Examples: Netflix Eureka + Ribbon'
      ],
      pros: [
        'Fewer network hops',
        'Client controls load balancing strategy',
        'No proxy/LB bottleneck',
        'Better performance'
      ],
      cons: [
        'Client must implement discovery logic',
        'Couples client to registry',
        'Different languages = duplicate logic',
        'Complex client code'
      ],
      useCases: [
        'Microservices within same platform',
        'Performance-critical applications',
        'Homogeneous tech stack',
        'Netflix-style architectures'
      ],
      example: `// Netflix Ribbon (Client-Side LB)
@LoadBalanced
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}

// Client code
String url = "http://user-service/api/users/123";
User user = restTemplate.getForObject(url, User.class);
// Ribbon resolves "user-service" and load balances`
    },
    serverSide: {
      name: 'Server-Side Discovery',
      icon: '🖥️',
      description: 'Load balancer/router queries registry and routes requests',
      architecture: `
┌────────────────────────────────────────┐
│   Server-Side Discovery Pattern        │
│                                        │
│  Step 1: Client calls LB               │
│  ┌────────┐                            │
│  │ Client │──1─────►┌───────────────┐  │
│  └────────┘         │ Load Balancer │  │
│                     │   /  Router   │  │
│  Step 2: LB queries │   (Nginx/     │  │
│         registry    │    Traefik)   │  │
│                     └───────┬───────┘  │
│                             │          │
│                         2   │          │
│                    ┌────────▼───────┐  │
│                    │    Service     │  │
│                    │   Registry     │  │
│                    └────────────────┘  │
│                             │          │
│  Step 3: LB routes      3a  │ 3b  │3c  │
│         to instances        │     │    │
│                     ┌───────▼─────┐    │
│                     │  Service A1 │    │
│                     ├─────────────┤    │
│                     │  Service A2 │    │
│                     ├─────────────┤    │
│                     │  Service A3 │    │
│                     └─────────────┘    │
│                                        │
│  Client only knows LB, not services    │
└────────────────────────────────────────┘`,
      keyPoints: [
        'Client calls load balancer/router',
        'LB queries registry for service instances',
        'LB handles routing and load balancing',
        'Client unaware of service instances',
        'Examples: Kubernetes Service, AWS ALB'
      ],
      pros: [
        'Simpler client code',
        'Centralized load balancing',
        'Language agnostic',
        'Easier to manage routing rules'
      ],
      cons: [
        'Extra network hop (LB)',
        'LB can be bottleneck',
        'LB is single point of failure',
        'Less control for client'
      ],
      useCases: [
        'Kubernetes deployments',
        'Polyglot environments',
        'Public-facing APIs',
        'Cloud-native applications'
      ],
      example: `# Kubernetes Service (Server-Side Discovery)
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer

# Client just calls: http://user-service/api/users
# Kubernetes DNS + Service handles discovery & LB`
    }
  };

  const tools = {
    consul: {
      name: 'HashiCorp Consul',
      icon: '🔷',
      description: 'Full-featured service mesh with service discovery, health checking, and KV store',
      features: [
        'Service registry with health checks',
        'Multi-datacenter support',
        'Service mesh capabilities (Connect)',
        'Key-value store',
        'DNS and HTTP interfaces'
      ],
      healthChecks: [
        'HTTP endpoint checks',
        'TCP connection checks',
        'Script execution',
        'TTL-based checks',
        'Docker health checks'
      ],
      pros: [
        'Rich feature set',
        'Multi-DC out of box',
        'Strong consistency (Raft)',
        'Service mesh included',
        'Great UI'
      ],
      cons: [
        'Complex to operate',
        'Resource intensive',
        'Steep learning curve',
        'Overkill for simple use cases'
      ],
      example: `# Register service with Consul
{
  "service": {
    "name": "user-service",
    "tags": ["v1", "production"],
    "address": "10.0.1.5",
    "port": 8080,
    "check": {
      "http": "http://10.0.1.5:8080/health",
      "interval": "10s",
      "timeout": "1s"
    }
  }
}

# Query service
curl http://localhost:8500/v1/catalog/service/user-service`,
      useCases: [
        'Multi-cloud deployments',
        'Complex microservices',
        'Service mesh needs',
        'Configuration management'
      ]
    },
    etcd: {
      name: 'CoreOS etcd',
      icon: '📦',
      description: 'Distributed key-value store for configuration and service discovery',
      features: [
        'Consistent key-value store',
        'Watch for changes',
        'TTL for keys',
        'Transactional operations',
        'Used by Kubernetes'
      ],
      healthChecks: [
        'Application-level heartbeats',
        'TTL-based expiration',
        'Watch for key changes',
        'Leader election for monitoring'
      ],
      pros: [
        'Simple and reliable',
        'Battle-tested (K8s uses it)',
        'Strong consistency',
        'Easy to understand',
        'Lightweight'
      ],
      cons: [
        'Limited to key-value',
        'No built-in health checks',
        'Requires custom logic',
        'No native service mesh'
      ],
      example: `# Register service in etcd
etcdctl put /services/user-service/instance1 '{"host":"10.0.1.5","port":8080}' --lease=123

# Watch for service changes
etcdctl watch --prefix /services/user-service

# Query all instances
etcdctl get --prefix /services/user-service`,
      useCases: [
        'Kubernetes clusters',
        'Simple service discovery',
        'Configuration storage',
        'Distributed coordination'
      ]
    },
    kubernetes: {
      name: 'Kubernetes DNS',
      icon: '☸️',
      description: 'Built-in service discovery via DNS and environment variables',
      features: [
        'Automatic DNS records',
        'Service-based discovery',
        'Namespace isolation',
        'Headless services',
        'No external dependencies'
      ],
      healthChecks: [
        'Liveness probes (restart)',
        'Readiness probes (traffic)',
        'Startup probes (slow apps)',
        'HTTP, TCP, exec probes'
      ],
      pros: [
        'Built into Kubernetes',
        'Zero configuration',
        'Native integration',
        'Free',
        'Simple to use'
      ],
      cons: [
        'Kubernetes-only',
        'Basic features',
        'No multi-cluster by default',
        'Limited observability'
      ],
      example: `# Service creates DNS record automatically
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: production
spec:
  selector:
    app: user-service
  ports:
  - port: 80

# Access via DNS:
# - user-service (same namespace)
# - user-service.production (cross-namespace)
# - user-service.production.svc.cluster.local (FQDN)`,
      useCases: [
        'Kubernetes-native apps',
        'Simple deployments',
        'Getting started',
        'No external dependencies'
      ]
    },
    eureka: {
      name: 'Netflix Eureka',
      icon: '🎬',
      description: 'REST-based service registry for resilient mid-tier load balancing',
      features: [
        'Client-side discovery',
        'Self-preservation mode',
        'Region/zone awareness',
        'Peer-to-peer replication',
        'Fast failover'
      ],
      healthChecks: [
        'Heartbeat mechanism',
        'Renewal lease',
        'Custom health indicators',
        'Spring Boot Actuator integration'
      ],
      pros: [
        'Battle-tested at Netflix',
        'AP over CP (availability)',
        'Works well with Ribbon',
        'Spring Cloud integration',
        'Resilient to network partitions'
      ],
      cons: [
        'Java-centric',
        'Eventually consistent',
        'Self-preservation can be confusing',
        'Netflix moving to other solutions'
      ],
      example: `# application.yml
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
  instance:
    leaseRenewalIntervalInSeconds: 10
    leaseExpirationDurationInSeconds: 30

# Register automatically with @EnableEurekaClient
@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication { }

# Query: GET http://eureka-server:8761/eureka/apps`,
      useCases: [
        'Spring Boot microservices',
        'Netflix OSS stack',
        'Client-side load balancing',
        'Java ecosystems'
      ]
    }
  };

  const healthCheckPatterns = [
    {
      type: 'Active Health Checks',
      description: 'Registry actively polls services',
      methods: ['HTTP GET /health', 'TCP connection test', 'Ping', 'gRPC health check'],
      pros: ['Catch failures quickly', 'Configurable intervals', 'Centralized monitoring'],
      cons: ['Additional network traffic', 'Can overwhelm services', 'False positives'],
      example: 'Consul checks every 10s: GET /health, expects 200 OK'
    },
    {
      type: 'Passive Health Checks',
      description: 'Detect failures through request failures',
      methods: ['Circuit breaker pattern', 'Error rate tracking', 'Response time monitoring'],
      pros: ['No extra requests', 'Real user experience', 'Production traffic'],
      cons: ['Slower detection', 'Requires client logic', 'Complex implementation'],
      example: 'After 5 consecutive failures, mark service unhealthy'
    },
    {
      type: 'Heartbeat Mechanism',
      description: 'Services send periodic signals',
      methods: ['TTL renewal', 'Lease extension', 'Keep-alive messages'],
      pros: ['Service controls timing', 'Low overhead', 'Simple protocol'],
      cons: ['Network delays', 'Missed heartbeats', 'Clock skew issues'],
      example: 'Service renews 30s TTL every 10s'
    }
  ];

  const comparisonMatrix = [
    { aspect: 'Consistency', consul: 'Strong (CP)', etcd: 'Strong (CP)', kubernetes: 'Strong (CP)', eureka: 'Eventual (AP)' },
    { aspect: 'Health Checks', consul: 'Built-in', etcd: 'Manual', kubernetes: 'Built-in', eureka: 'Heartbeat' },
    { aspect: 'Multi-DC', consul: 'Native', etcd: 'External', kubernetes: 'Federation', eureka: 'Region/Zone' },
    { aspect: 'Language', consul: 'Agnostic', etcd: 'Agnostic', kubernetes: 'Agnostic', eureka: 'Java-focused' },
    { aspect: 'Complexity', consul: 'High', etcd: 'Medium', kubernetes: 'Low (if K8s)', eureka: 'Medium' },
    { aspect: 'Service Mesh', consul: 'Yes', etcd: 'No', kubernetes: 'Via Istio', eureka: 'No' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Service Discovery</h3>
        <p className="text-muted-foreground">
          Learn how services find and communicate with each other in distributed systems
        </p>
      </div>

      {/* Pattern Selector */}
      <div>
        <h4 className="font-semibold mb-3">Discovery Patterns:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {Object.keys(patterns).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedPattern(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedPattern === key
                  ? 'border-green-500 bg-green-50 dark:bg-green-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
              }`}
            >
              <div className="text-2xl mb-2">{patterns[key].icon}</div>
              <div className="font-medium">{patterns[key].name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Details */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{patterns[selectedPattern].icon}</div>
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-2">{patterns[selectedPattern].name}</h4>
            <p className="text-muted-foreground">{patterns[selectedPattern].description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {patterns[selectedPattern].architecture && (
            <div>
              <h5 className="font-semibold mb-2">Architecture:</h5>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                {patterns[selectedPattern].architecture}
              </pre>
            </div>
          )}

          {patterns[selectedPattern].keyPoints && (
            <div>
              <h5 className="font-semibold mb-2">Key Points:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {patterns[selectedPattern].keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">→</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {patterns[selectedPattern].pros && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold mb-2 text-green-600 dark:text-green-400">✓ Pros:</h5>
                <ul className="space-y-1">
                  {patterns[selectedPattern].pros.map((pro, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-red-600 dark:text-red-400">✗ Cons:</h5>
                <ul className="space-y-1">
                  {patterns[selectedPattern].cons.map((con, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {patterns[selectedPattern].useCases && (
            <div>
              <h5 className="font-semibold mb-2">Use Cases:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {patterns[selectedPattern].useCases.map((useCase, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {useCase}
                  </div>
                ))}
              </div>
            </div>
          )}

          {patterns[selectedPattern].example && (
            <div>
              <h5 className="font-semibold mb-2">Code Example:</h5>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{patterns[selectedPattern].example}</code>
              </pre>
            </div>
          )}

          {patterns[selectedPattern].benefits && (
            <div>
              <h5 className="font-semibold mb-2 text-green-600 dark:text-green-400">Benefits:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {patterns[selectedPattern].benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {patterns[selectedPattern].challenges && (
            <div>
              <h5 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">Challenges:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {patterns[selectedPattern].challenges.map((challenge, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">⚠</span>
                    <span>{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tools Comparison */}
      <div>
        <h4 className="text-xl font-bold mb-4">Service Discovery Tools</h4>
        <p className="text-muted-foreground mb-4">
          Compare popular service discovery tools and choose the right one for your needs
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {Object.keys(tools).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedTool(key)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedTool === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="text-2xl mb-1">{tools[key].icon}</div>
              <div className="font-medium text-sm">{tools[key].name}</div>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">{tools[selectedTool].icon}</div>
            <div className="flex-1">
              <h5 className="text-lg font-bold mb-2">{tools[selectedTool].name}</h5>
              <p className="text-muted-foreground">{tools[selectedTool].description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h6 className="font-semibold mb-2">Features:</h6>
              <div className="grid md:grid-cols-2 gap-2">
                {tools[selectedTool].features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">→</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h6 className="font-semibold mb-2">Health Check Methods:</h6>
              <div className="grid md:grid-cols-2 gap-2">
                {tools[selectedTool].healthChecks.map((check, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {check}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h6 className="font-semibold mb-2 text-green-600 dark:text-green-400">✓ Pros:</h6>
                <ul className="space-y-1">
                  {tools[selectedTool].pros.map((pro, idx) => (
                    <li key={idx} className="text-sm">• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="font-semibold mb-2 text-red-600 dark:text-red-400">✗ Cons:</h6>
                <ul className="space-y-1">
                  {tools[selectedTool].cons.map((con, idx) => (
                    <li key={idx} className="text-sm">• {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h6 className="font-semibold mb-2">Example Usage:</h6>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{tools[selectedTool].example}</code>
              </pre>
            </div>

            <div>
              <h6 className="font-semibold mb-2">Best For:</h6>
              <div className="grid md:grid-cols-2 gap-2">
                {tools[selectedTool].useCases.map((useCase, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {useCase}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Matrix */}
        <div className="mt-6">
          <h5 className="font-semibold mb-3">Tool Comparison Matrix:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border p-3 text-left">Aspect</th>
                  <th className="border p-3 text-left">Consul</th>
                  <th className="border p-3 text-left">etcd</th>
                  <th className="border p-3 text-left">Kubernetes</th>
                  <th className="border p-3 text-left">Eureka</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border p-3 font-medium">{row.aspect}</td>
                    <td className="border p-3">{row.consul}</td>
                    <td className="border p-3">{row.etcd}</td>
                    <td className="border p-3">{row.kubernetes}</td>
                    <td className="border p-3">{row.eureka}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Health Check Patterns */}
      <div>
        <h4 className="text-xl font-bold mb-4">Health Check Patterns</h4>
        <p className="text-muted-foreground mb-4">
          Different approaches to monitoring service health and availability
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {healthCheckPatterns.map((pattern, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h5 className="font-bold mb-2">{pattern.type}</h5>
              <p className="text-sm text-muted-foreground mb-3">{pattern.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h6 className="font-semibold text-sm mb-1">Methods:</h6>
                  <ul className="space-y-1">
                    {pattern.methods.map((method, midx) => (
                      <li key={midx} className="text-xs">• {method}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h6 className="font-semibold text-sm mb-1 text-green-600 dark:text-green-400">Pros:</h6>
                  <ul className="space-y-1">
                    {pattern.pros.map((pro, pidx) => (
                      <li key={pidx} className="text-xs">+ {pro}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h6 className="font-semibold text-sm mb-1 text-red-600 dark:text-red-400">Cons:</h6>
                  <ul className="space-y-1">
                    {pattern.cons.map((con, cidx) => (
                      <li key={cidx} className="text-xs">- {con}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded">
                  <p className="text-xs font-mono">{pattern.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="text-lg font-bold mb-3">💡 Interview Tips</h4>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium">Q: "What's the difference between client-side and server-side service discovery?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Client-side discovery: Client queries registry directly and handles load balancing (e.g., Netflix Eureka + Ribbon). Fewer hops but complex client. Server-side: Load balancer queries registry and routes requests (e.g., Kubernetes Service). Simpler client but extra hop. Choose based on control vs simplicity trade-off.
            </p>
          </div>

          <div>
            <p className="font-medium">Q: "How do you handle service registry failures?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Use highly available registry (3-5 nodes with Raft consensus). Cache service list on clients for temporary outages. Implement fallback to last-known-good state. Monitor registry health. Consider eventual consistency (AP) vs strong consistency (CP) based on CAP theorem trade-offs.
            </p>
          </div>

          <div>
            <p className="font-medium">Q: "What's the purpose of health checks in service discovery?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Health checks ensure only healthy instances receive traffic. Active checks poll services (HTTP /health), passive checks detect failures via circuit breakers, heartbeats let services self-report. Critical for automatic failover. Balance check frequency (faster detection) with overhead (network traffic, load).
            </p>
          </div>

          <div>
            <p className="font-medium">Q: "How does Kubernetes service discovery work?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Kubernetes creates DNS records for every Service (servicename.namespace.svc.cluster.local). Pods can use DNS names to find services. kube-proxy watches API server for service/endpoint changes and updates iptables/IPVS rules for load balancing. Completely automatic—zero configuration needed. Server-side discovery pattern.
            </p>
          </div>
        </div>
      </div>

      {/* Decision Guide */}
      <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-lg font-bold mb-3">📋 Decision Guide: Choosing a Service Discovery Tool</h4>
        
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded border">
            <p className="font-medium text-green-600 dark:text-green-400">Choose Kubernetes DNS if:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• You're already using Kubernetes</li>
              <li>• Simple deployments within single cluster</li>
              <li>• Want zero configuration</li>
              <li>• Don't need multi-cluster/multi-cloud</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded border">
            <p className="font-medium text-blue-600 dark:text-blue-400">Choose Consul if:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Multi-datacenter deployments</li>
              <li>• Need service mesh capabilities</li>
              <li>• Polyglot environment</li>
              <li>• Want comprehensive feature set</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded border">
            <p className="font-medium text-purple-600 dark:text-purple-400">Choose etcd if:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Need reliable key-value store</li>
              <li>• Building custom discovery logic</li>
              <li>• Strong consistency required</li>
              <li>• Kubernetes-adjacent tooling</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded border">
            <p className="font-medium text-orange-600 dark:text-orange-400">Choose Eureka if:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Spring Boot microservices</li>
              <li>• Netflix OSS stack</li>
              <li>• Client-side load balancing (Ribbon)</li>
              <li>• Availability over consistency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDiscovery;
