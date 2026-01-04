import React, { useState } from 'react';

const AmbassadorPattern = () => {
  const [selectedPattern, setSelectedPattern] = useState('ambassador');
  const [selectedUseCase, setSelectedUseCase] = useState('rateLimiting');

  const patterns = {
    ambassador: {
      name: 'Ambassador Pattern',
      icon: '🏛️',
      description: 'Sidecar proxy that handles outbound network connections',
      diagram: `
┌────────────────────────────────────────┐
│              Pod                       │
│                                        │
│  ┌──────────────┐  ┌────────────────┐ │
│  │ Application  │  │   Ambassador   │ │
│  │  Container   │─►│     Proxy      │─┼──► External
│  │              │  │   (Outbound)   │ │    Services
│  │ Makes calls  │  │                │ │
│  │ to localhost │  │ • Rate limit   │ │
│  │              │  │ • Retry logic  │ │
│  │              │  │ • Auth tokens  │ │
│  └──────────────┘  │ • Load balance │ │
│                    └────────────────┘ │
└────────────────────────────────────────┘

Key Concept: App thinks it's calling localhost,
Ambassador routes to actual external services`,
      keyPoints: [
        'Handles OUTBOUND connections only',
        'App calls localhost, proxy forwards',
        'Abstracts external service locations',
        'Adds reliability patterns (retry, circuit break)',
        'Injects credentials automatically'
      ],
      benefits: [
        'Simplify application code',
        'Centralize connection logic',
        'Add reliability without code changes',
        'Easy to test (mock ambassador)',
        'Upgrade connection logic independently'
      ],
      useCases: [
        'Calling external APIs with auth',
        'Rate limiting outbound requests',
        'Service versioning (v1 vs v2)',
        'Multi-region routing',
        'Legacy app integration'
      ],
      example: `# Docker Compose with Ambassador
version: '3'
services:
  app:
    image: my-app:latest
    environment:
      - EXTERNAL_API_URL=http://localhost:8080
    depends_on:
      - ambassador
  
  ambassador:
    image: nginx:latest
    ports:
      - "8080:8080"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    # Routes localhost:8080 to actual external API

---
# nginx.conf for Ambassador
upstream external_api {
    server api.external.com:443;
}

server {
    listen 8080;
    
    location / {
        proxy_pass https://external_api;
        
        # Add authentication
        proxy_set_header Authorization "Bearer $TOKEN";
        
        # Retry logic
        proxy_next_upstream error timeout;
        proxy_connect_timeout 2s;
        proxy_read_timeout 10s;
        
        # Rate limiting
        limit_req zone=api_limit burst=10;
    }
}`
    },
    serviceMesh: {
      name: 'Service Mesh',
      icon: '🕸️',
      description: 'Full mesh of sidecars handling all service-to-service traffic',
      diagram: `
┌──────────────────────────────────────────┐
│         Service Mesh                     │
│                                          │
│  ┌─────────┐        ┌─────────┐         │
│  │Service A│        │Service B│         │
│  └────┬────┘        └────┬────┘         │
│       │                  │              │
│  ┌────▼────┐        ┌────▼────┐         │
│  │ Envoy   │◄──────►│ Envoy   │         │
│  │ Sidecar │  mTLS  │ Sidecar │         │
│  └────┬────┘        └────┬────┘         │
│       │                  │              │
│       └────────┬──────────┘              │
│                ▼                         │
│         ┌─────────────┐                  │
│         │Control Plane│                  │
│         │  (Istiod)   │                  │
│         └─────────────┘                  │
│                                          │
│  Handles: Ingress + Egress + East-West  │
└──────────────────────────────────────────┘`,
      keyPoints: [
        'Handles ALL traffic (in + out + between)',
        'Full observability across entire mesh',
        'mTLS encryption everywhere',
        'Comprehensive traffic management',
        'Requires control plane'
      ],
      benefits: [
        'Complete traffic visibility',
        'Zero-trust security',
        'Advanced routing (canary, A/B)',
        'Distributed tracing',
        'Policy enforcement'
      ],
      useCases: [
        'Microservices with 10+ services',
        'Need mTLS between all services',
        'Complex traffic patterns',
        'Compliance requirements',
        'Comprehensive observability'
      ],
      example: `# Istio Service Mesh
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: my-app
  annotations:
    sidecar.istio.io/inject: "true"
spec:
  containers:
  - name: app
    image: my-app:latest

# Istio automatically:
# - Injects Envoy sidecar
# - Sets up mTLS
# - Configures routing
# - Enables tracing`
    },
    apiGateway: {
      name: 'API Gateway',
      icon: '🚪',
      description: 'Centralized entry point for all external traffic',
      diagram: `
┌────────────────────────────────────┐
│        API Gateway                 │
│     (Single Entry Point)           │
│                                    │
│  ┌─────────────────────────────┐  │
│  │      API Gateway            │  │
│  │  (Kong, AWS API Gateway)    │  │
│  │                             │  │
│  │ • Authentication            │  │
│  │ • Rate limiting             │  │
│  │ • Request transformation    │  │
│  │ • Response caching          │  │
│  └──────────┬──────────────────┘  │
│             │                     │
└─────────────┼─────────────────────┘
              │
      ┌───────┼───────┬───────┐
      ▼       ▼       ▼       ▼
   Service Service Service Service
      A       B       C       D

All external traffic → API Gateway → Services`,
      keyPoints: [
        'Single entry point for external clients',
        'Not a sidecar (separate service)',
        'Handles north-south traffic only',
        'Cross-cutting concerns for APIs',
        'Can be multiple gateways (region, env)'
      ],
      benefits: [
        'Centralized security',
        'Unified API experience',
        'Request/response transformation',
        'Analytics and monitoring',
        'Rate limiting per client'
      ],
      useCases: [
        'Public-facing APIs',
        'Mobile/web app backends',
        'Partner API integrations',
        'Multi-tenant SaaS',
        'API monetization'
      ],
      example: `# Kong API Gateway
apiVersion: v1
kind: Service
metadata:
  name: kong-proxy
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8000
  selector:
    app: kong

---
# Route configuration
apiVersion: configuration.konghq.com/v1
kind: KongIngress
metadata:
  name: api-routes
route:
  methods:
  - GET
  - POST
  paths:
  - /api/users
  strip_path: false
plugins:
- name: rate-limiting
  config:
    minute: 100
- name: key-auth`
    }
  };

  const useCases = {
    rateLimiting: {
      name: 'Rate Limiting',
      description: 'Control rate of outbound API calls',
      problem: 'External API has rate limit (100 req/min). App makes 500 req/min → gets blocked.',
      solution: 'Ambassador proxy enforces rate limit locally, queues excess requests, prevents API blocks.',
      benefits: [
        'Respect external API limits',
        'Prevent service degradation',
        'No app code changes',
        'Centralized quota management'
      ],
      implementation: `# Ambassador with Rate Limiting
apiVersion: v1
kind: Pod
metadata:
  name: app-with-ambassador
spec:
  containers:
  - name: app
    image: my-app:latest
    env:
    - name: API_URL
      value: "http://localhost:8080"
  
  - name: ambassador
    image: envoyproxy/envoy:v1.24
    volumeMounts:
    - name: config
      mountPath: /etc/envoy
  
  volumes:
  - name: config
    configMap:
      name: envoy-rate-limit-config

---
# Envoy config snippet
rate_limits:
- actions:
  - request_headers:
      header_name: ":path"
      descriptor_key: path
  limit:
    requests_per_unit: 100
    unit: MINUTE`,
      diagram: `
App: Makes 500 req/min
  │
  ▼
Ambassador: Rate limits to 100 req/min
  │   • Queues excess requests
  │   • Returns 429 if queue full
  ▼
External API: Receives 100 req/min (happy!)`
    },
    authentication: {
      name: 'Authentication Token Injection',
      description: 'Automatically add auth tokens to outbound requests',
      problem: 'App needs to call multiple APIs, each requiring OAuth token. Token rotation is complex.',
      solution: 'Ambassador fetches and injects tokens automatically, handles rotation.',
      benefits: [
        'App doesn\'t manage tokens',
        'Automatic token refresh',
        'Consistent auth across services',
        'Easier credential rotation'
      ],
      implementation: `# Ambassador for Auth
apiVersion: v1
kind: Pod
metadata:
  name: app-with-auth-ambassador
spec:
  containers:
  - name: app
    image: my-app:latest
    env:
    - name: API_URL
      value: "http://localhost:8080"
  
  - name: oauth-ambassador
    image: oauth2-proxy:latest
    env:
    - name: OAUTH2_PROXY_CLIENT_ID
      valueFrom:
        secretKeyRef:
          name: oauth-secret
          key: client-id
    - name: OAUTH2_PROXY_CLIENT_SECRET
      valueFrom:
        secretKeyRef:
          name: oauth-secret
          key: client-secret
    ports:
    - containerPort: 8080`,
      diagram: `
App: Makes request without auth
  │
  ▼
Ambassador:
  1. Fetches OAuth token (if expired)
  2. Adds Authorization header
  3. Forwards request
  │
  ▼
External API: Receives authenticated request`
    },
    retryLogic: {
      name: 'Retry & Circuit Breaking',
      description: 'Add resilience patterns without changing app code',
      problem: 'External API occasionally fails (network issues, timeouts). App has no retry logic.',
      solution: 'Ambassador implements exponential backoff retry and circuit breaker.',
      benefits: [
        'Improve reliability',
        'Prevent cascading failures',
        'No app code changes',
        'Configurable retry policies'
      ],
      implementation: `# Envoy Ambassador with Retry
static_resources:
  clusters:
  - name: external_api
    connect_timeout: 0.25s
    type: LOGICAL_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: external_api
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              socket_address:
                address: api.external.com
                port_value: 443
    
    # Retry policy
    retry_policy:
      retry_on: "5xx,refused-stream,reset"
      num_retries: 3
      per_try_timeout: 1s
      retry_host_predicate:
      - name: envoy.retry_host_predicates.previous_hosts
    
    # Circuit breaker
    circuit_breakers:
      thresholds:
      - priority: DEFAULT
        max_connections: 100
        max_pending_requests: 100
        max_requests: 100
        max_retries: 3`,
      diagram: `
App: Makes request
  │
  ▼
Ambassador:
  │ Try 1: Timeout → Retry (wait 1s)
  │ Try 2: 503 Error → Retry (wait 2s)
  │ Try 3: 200 Success! → Return to app
  │
  │ If all retries fail → Circuit opens
  │ Future requests → Fast fail (no retry)
  ▼
External API`
    },
    serviceVersioning: {
      name: 'Service Versioning',
      description: 'Route to different API versions based on rules',
      problem: 'Migrating from API v1 to v2. Need gradual rollout without changing app.',
      solution: 'Ambassador routes requests based on headers, gradually shift traffic.',
      benefits: [
        'Canary releases',
        'A/B testing',
        'Blue-green deployments',
        'Easy rollback'
      ],
      implementation: `# Ambassador for Versioning
apiVersion: v1
kind: ConfigMap
metadata:
  name: version-router
data:
  nginx.conf: |
    upstream api_v1 {
        server api-v1.internal:8080;
    }
    upstream api_v2 {
        server api-v2.internal:8080;
    }
    
    server {
        listen 8080;
        
        # Route based on header
        location / {
            set $backend api_v1;
            
            # If beta header, use v2
            if ($http_x_api_version = "v2") {
                set $backend api_v2;
            }
            
            # Canary: 10% to v2
            if ($request_id ~* "^[0-9]$") {
                set $backend api_v2;
            }
            
            proxy_pass http://$backend;
        }
    }`,
      diagram: `
App: Makes request
  │
  ▼
Ambassador: Decides version
  │
  ├─► 90% → API v1 (stable)
  │
  └─► 10% → API v2 (canary)

Gradually increase v2 traffic: 10% → 50% → 100%`
    }
  };

  const comparisonTable = [
    {
      aspect: 'Scope',
      ambassador: 'Outbound only (egress)',
      serviceMesh: 'All traffic (ingress + egress + east-west)',
      apiGateway: 'Inbound only (north-south)'
    },
    {
      aspect: 'Deployment',
      ambassador: 'Sidecar per pod',
      serviceMesh: 'Sidecar + control plane',
      apiGateway: 'Separate service'
    },
    {
      aspect: 'Complexity',
      ambassador: 'Low',
      serviceMesh: 'High',
      apiGateway: 'Medium'
    },
    {
      aspect: 'Use Case',
      ambassador: 'External API calls',
      serviceMesh: 'Service-to-service',
      apiGateway: 'Public-facing APIs'
    },
    {
      aspect: 'mTLS',
      ambassador: 'No (outbound only)',
      serviceMesh: 'Yes (everywhere)',
      apiGateway: 'Yes (ingress)'
    },
    {
      aspect: 'Observability',
      ambassador: 'Outbound requests',
      serviceMesh: 'Full mesh visibility',
      apiGateway: 'API metrics'
    },
    {
      aspect: 'Cost',
      ambassador: 'Low (simple proxy)',
      serviceMesh: 'High (resource intensive)',
      apiGateway: 'Medium (managed service)'
    }
  ];

  const decisionTree = [
    {
      question: 'What traffic do you need to manage?',
      options: [
        { answer: 'External client → My services', recommendation: 'API Gateway', reason: 'Centralized entry point for external traffic' },
        { answer: 'My service → External APIs', recommendation: 'Ambassador', reason: 'Outbound connection management' },
        { answer: 'Service A ↔ Service B (internal)', recommendation: 'Service Mesh', reason: 'Service-to-service communication' }
      ]
    },
    {
      question: 'How many microservices?',
      options: [
        { answer: '1-5 services', recommendation: 'Ambassador or API Gateway', reason: 'Keep it simple' },
        { answer: '5-20 services', recommendation: 'Consider Service Mesh', reason: 'Complexity increasing' },
        { answer: '20+ services', recommendation: 'Service Mesh', reason: 'Need comprehensive solution' }
      ]
    },
    {
      question: 'What\'s your primary goal?',
      options: [
        { answer: 'Simplify external API calls', recommendation: 'Ambassador', reason: 'Handles outbound complexity' },
        { answer: 'Secure service-to-service', recommendation: 'Service Mesh', reason: 'mTLS everywhere' },
        { answer: 'Expose APIs to clients', recommendation: 'API Gateway', reason: 'Public API management' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Ambassador Pattern</h3>
        <p className="text-muted-foreground">
          Learn how ambassador pattern simplifies external service communication
        </p>
      </div>

      {/* Pattern Selector */}
      <div>
        <h4 className="font-semibold mb-3">Compare Patterns:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {Object.keys(patterns).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedPattern(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedPattern === key
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
              }`}
            >
              <div className="text-2xl mb-2">{patterns[key].icon}</div>
              <div className="font-medium">{patterns[key].name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Details */}
      <div className=" from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{patterns[selectedPattern].icon}</div>
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-2">{patterns[selectedPattern].name}</h4>
            <p className="text-muted-foreground">{patterns[selectedPattern].description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {patterns[selectedPattern].diagram && (
            <div>
              <h5 className="font-semibold mb-2">Architecture:</h5>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                {patterns[selectedPattern].diagram}
              </pre>
            </div>
          )}

          {patterns[selectedPattern].keyPoints && (
            <div>
              <h5 className="font-semibold mb-2">Key Points:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {patterns[selectedPattern].keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">→</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
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
              <h5 className="font-semibold mb-2">Implementation Example:</h5>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{patterns[selectedPattern].example}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <h4 className="text-xl font-bold mb-4">Ambassador Use Cases</h4>
        <p className="text-muted-foreground mb-4">
          See how ambassador pattern solves real problems in production
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {Object.keys(useCases).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedUseCase(key)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedUseCase === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="font-medium text-sm">{useCases[key].name}</div>
            </button>
          ))}
        </div>

        <div className=" from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="text-lg font-bold mb-2">{useCases[selectedUseCase].name}</h5>
          <p className="text-muted-foreground mb-4">{useCases[selectedUseCase].description}</p>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <h6 className="font-semibold mb-2 text-red-600 dark:text-red-400">Problem:</h6>
              <p>{useCases[selectedUseCase].problem}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <h6 className="font-semibold mb-2 text-green-600 dark:text-green-400">Solution:</h6>
              <p>{useCases[selectedUseCase].solution}</p>
            </div>

            <div>
              <h6 className="font-semibold mb-2">Benefits:</h6>
              <div className="grid md:grid-cols-2 gap-2">
                {useCases[selectedUseCase].benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {useCases[selectedUseCase].diagram && (
              <div>
                <h6 className="font-semibold mb-2">Flow:</h6>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                  {useCases[selectedUseCase].diagram}
                </pre>
              </div>
            )}

            <div>
              <h6 className="font-semibold mb-2">Implementation:</h6>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{useCases[selectedUseCase].implementation}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div>
        <h4 className="text-xl font-bold mb-4">Ambassador vs Service Mesh vs API Gateway</h4>
        <p className="text-muted-foreground mb-4">
          Understand the differences and choose the right pattern for your needs
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border p-3 text-left">Aspect</th>
                <th className="border p-3 text-left">Ambassador</th>
                <th className="border p-3 text-left">Service Mesh</th>
                <th className="border p-3 text-left">API Gateway</th>
              </tr>
            </thead>
            <tbody>
              {comparisonTable.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-3 font-medium">{row.aspect}</td>
                  <td className="border p-3">{row.ambassador}</td>
                  <td className="border p-3">{row.serviceMesh}</td>
                  <td className="border p-3">{row.apiGateway}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Tree */}
      <div>
        <h4 className="text-xl font-bold mb-4">Decision Guide</h4>
        <p className="text-muted-foreground mb-4">
          Answer these questions to choose the right pattern
        </p>

        <div className="space-y-4">
          {decisionTree.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h5 className="font-bold mb-3 text-blue-600 dark:text-blue-400">{item.question}</h5>
              <div className="space-y-2">
                {item.options.map((option, oidx) => (
                  <div key={oidx} className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-medium">{option.answer}</p>
                        <p className="text-sm text-muted-foreground mt-1">{option.reason}</p>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded text-sm font-medium text-green-800 dark:text-green-200">
                        → {option.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Can You Use Multiple? */}
      <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="text-lg font-bold mb-3">🤔 Can You Use Multiple Patterns Together?</h4>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium text-green-600 dark:text-green-400">✓ Yes! They solve different problems:</p>
            <div className="mt-2 space-y-2 text-sm">
              <div className="bg-white dark:bg-gray-800 p-3 rounded">
                <span className="font-medium">API Gateway</span> for external clients → your services
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded">
                <span className="font-medium">Service Mesh</span> for your services talking to each other
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded">
                <span className="font-medium">Ambassador</span> for your services → external APIs
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded">
            <p className="font-medium mb-2">Example Architecture:</p>
            <pre className="text-xs">
{`External Clients
      ↓
  API Gateway (Kong) ← Handle auth, rate limit
      ↓
  Your Services
    ↔ Service Mesh (Istio) ← mTLS between services
      ↓
  Ambassador Proxy ← Rate limit outbound
      ↓
  External APIs`}
            </pre>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="text-lg font-bold mb-3">💡 Interview Tips</h4>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium">Q: "What is the ambassador pattern?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Ambassador is a sidecar proxy that handles OUTBOUND connections. App calls localhost, ambassador routes to external services. Use it for rate limiting, authentication, retries, service versioning. Unlike service mesh (handles all traffic), ambassador only handles egress. Simpler than service mesh for external API calls.
            </p>
          </div>

          <div>
            <p className="font-medium">Q: "Ambassador vs API Gateway—what's the difference?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Ambassador handles OUTBOUND (your service → external). API Gateway handles INBOUND (external client → your service). Ambassador is a sidecar per pod. API Gateway is a separate service. They solve opposite problems and can be used together.
            </p>
          </div>

          <div>
            <p className="font-medium">Q: "When would you use ambassador instead of service mesh?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Use ambassador when you only need outbound connection management (external APIs). Service mesh is overkill if you don't need service-to-service communication features. Ambassador is simpler, lighter, and faster to implement. Example: App calls Stripe API with rate limiting—ambassador is perfect, service mesh is too much.
            </p>
          </div>

          <div>
            <p className="font-medium">Q: "Give an example of ambassador pattern in production"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> E-commerce app calls payment provider (Stripe) API. Stripe has rate limit 100 req/s. Deploy ambassador sidecar with rate limiting and retry logic. App makes unlimited requests to localhost, ambassador queues and rate limits to 100 req/s, retries on failures. Zero app code changes, respects Stripe limits, improved reliability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorPattern;
