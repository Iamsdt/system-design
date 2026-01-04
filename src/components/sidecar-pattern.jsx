import React, { useState } from 'react';

const SidecarPattern = () => {
  const [selectedType, setSelectedType] = useState('logging');
  const [selectedScenario, setSelectedScenario] = useState('multiLanguage');

  const sidecarTypes = {
    logging: {
      name: 'Logging Sidecar',
      icon: '📝',
      description: 'Separate logging concerns from application code',
      diagram: `
┌───────────────────────────────────┐
│           Pod                     │
│                                   │
│  ┌─────────────┐  ┌────────────┐ │
│  │ Application │  │  Logging   │ │
│  │ Container   │  │  Sidecar   │ │
│  │             │  │            │ │
│  │ writes logs │  │ Fluentd/   │ │
│  │ to stdout/  │  │ Filebeat   │ │
│  │ shared vol  ├─►│            │ │
│  │             │  │ forwards   │ │
│  └─────────────┘  │ to ELK/    │ │
│                   │ CloudWatch │ │
│                   └──────┬─────┘ │
│                          │       │
└──────────────────────────┼───────┘
                           ▼
                   ┌──────────────┐
                   │ Log Storage  │
                   │ (ELK, etc.)  │
                   └──────────────┘`,
      tools: [
        { name: 'Fluentd', desc: 'Unified logging layer', features: 'Plugins, buffers, filters' },
        { name: 'Filebeat', desc: 'Lightweight log shipper', features: 'Low resource, reliable' },
        { name: 'Logstash', desc: 'Data processing pipeline', features: 'Transform, enrich' },
        { name: 'Vector', desc: 'Modern observability', features: 'Fast, lightweight' }
      ],
      keyFeatures: [
        'Log aggregation from multiple sources',
        'Format transformation (JSON, syslog)',
        'Buffering for resilience',
        'Multi-destination forwarding',
        'Filtering and routing'
      ],
      benefits: [
        'Application doesn\'t handle log shipping',
        'Language-agnostic solution',
        'Centralized log configuration',
        'Easy to update logging logic',
        'Reduce application complexity'
      ],
      example: `# Docker Compose with Logging Sidecar
version: '3'
services:
  app:
    image: my-app:latest
    volumes:
      - logs:/var/log/app
  
  fluentd:
    image: fluent/fluentd:latest
    volumes:
      - logs:/var/log/app:ro
      - ./fluent.conf:/fluentd/etc/fluent.conf
    environment:
      - ELASTICSEARCH_HOST=elasticsearch
      - ELASTICSEARCH_PORT=9200

volumes:
  logs:

# Kubernetes Pod with Logging Sidecar
apiVersion: v1
kind: Pod
metadata:
  name: app-with-logging
spec:
  containers:
  - name: app
    image: my-app:latest
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  
  - name: fluentd
    image: fluent/fluentd:latest
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
      readOnly: true
    env:
    - name: FLUENT_ELASTICSEARCH_HOST
      value: "elasticsearch.logging"
  
  volumes:
  - name: logs
    emptyDir: {}`,
      useCases: [
        'Microservices with diverse tech stacks',
        'Legacy apps without log shipping',
        'Centralized log management',
        'Compliance and audit requirements'
      ]
    },
    monitoring: {
      name: 'Monitoring Sidecar',
      icon: '📊',
      description: 'Collect and export metrics without instrumenting application',
      diagram: `
┌───────────────────────────────────┐
│           Pod                     │
│                                   │
│  ┌─────────────┐  ┌────────────┐ │
│  │ Application │  │ Monitoring │ │
│  │ Container   │  │  Sidecar   │ │
│  │             │  │            │ │
│  │ exposes     │  │ Prometheus │ │
│  │ metrics on  │  │ Exporter / │ │
│  │ :8080/      ├─►│ StatsD     │ │
│  │  metrics    │  │            │ │
│  └─────────────┘  │ scrapes &  │ │
│                   │ exports    │ │
│                   └──────┬─────┘ │
│                          │       │
└──────────────────────────┼───────┘
                           ▼
                   ┌──────────────┐
                   │  Monitoring  │
                   │ (Prometheus) │
                   └──────────────┘`,
      tools: [
        { name: 'Prometheus Exporters', desc: 'Expose metrics for scraping', features: 'JMX, Node, Custom' },
        { name: 'StatsD', desc: 'Metrics aggregation', features: 'UDP, low overhead' },
        { name: 'Telegraf', desc: 'Plugin-driven agent', features: '200+ plugins' },
        { name: 'OpenTelemetry Collector', desc: 'Vendor-agnostic', features: 'Traces, metrics, logs' }
      ],
      keyFeatures: [
        'Metric collection and aggregation',
        'Protocol translation (StatsD → Prometheus)',
        'Metric enrichment (labels, tags)',
        'Local caching and batching',
        'Health check endpoints'
      ],
      benefits: [
        'No code changes to application',
        'Consistent monitoring across services',
        'Easy to swap monitoring backends',
        'Resource usage isolation',
        'Upgrade monitoring without app redeployment'
      ],
      example: `# Kubernetes Pod with Monitoring Sidecar
apiVersion: v1
kind: Pod
metadata:
  name: app-with-monitoring
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "9090"
spec:
  containers:
  - name: app
    image: my-app:latest
    ports:
    - containerPort: 8080
  
  - name: prometheus-exporter
    image: prom/jmx-exporter:latest
    ports:
    - containerPort: 9090
      name: metrics
    volumeMounts:
    - name: config
      mountPath: /etc/jmx-exporter
  
  volumes:
  - name: config
    configMap:
      name: jmx-exporter-config

---
# Telegraf Sidecar with StatsD
apiVersion: v1
kind: Pod
metadata:
  name: app-with-telegraf
spec:
  containers:
  - name: app
    image: my-app:latest
    env:
    - name: STATSD_HOST
      value: "localhost"
    - name: STATSD_PORT
      value: "8125"
  
  - name: telegraf
    image: telegraf:latest
    ports:
    - containerPort: 8125
      protocol: UDP
    volumeMounts:
    - name: telegraf-config
      mountPath: /etc/telegraf
  
  volumes:
  - name: telegraf-config
    configMap:
      name: telegraf-config`,
      useCases: [
        'Legacy apps without built-in metrics',
        'Standardize monitoring across polyglot stack',
        'JVM applications (JMX exporter)',
        'Protocol translation needs'
      ]
    },
    proxy: {
      name: 'Proxy Sidecar (Envoy)',
      icon: '🔀',
      description: 'Handle network communication, retries, circuit breaking',
      diagram: `
┌────────────────────────────────────┐
│           Pod A                    │
│                                    │
│  ┌──────────┐    ┌──────────────┐ │
│  │   App    │◄──►│ Envoy Proxy  │ │
│  │Container │    │   Sidecar    │─┼─┐
│  └──────────┘    └──────────────┘ │ │
│                                    │ │
└────────────────────────────────────┘ │
                                       │
┌──────────────────────────────────────┘
│ mTLS, retries, circuit breaking,
│ observability, traffic management
▼
┌────────────────────────────────────┐
│           Pod B                    │
│                                    │
│  ┌──────────────┐  ┌──────────┐   │
│  │ Envoy Proxy  │◄─┤   App    │   │
│  │   Sidecar    │  │Container │   │
│  └──────────────┘  └──────────┘   │
│                                    │
└────────────────────────────────────┘`,
      tools: [
        { name: 'Envoy', desc: 'Cloud-native proxy', features: 'Advanced LB, observability' },
        { name: 'Linkerd Proxy', desc: 'Lightweight Rust proxy', features: 'Fast, simple' },
        { name: 'NGINX', desc: 'Traditional proxy', features: 'Battle-tested' },
        { name: 'Traefik', desc: 'Modern HTTP proxy', features: 'Auto-discovery' }
      ],
      keyFeatures: [
        'Service-to-service communication',
        'Load balancing (round-robin, least-conn)',
        'Circuit breaking and retries',
        'mTLS encryption automatic',
        'Traffic shaping (rate limiting, timeouts)',
        'Observability (metrics, traces, logs)'
      ],
      benefits: [
        'Zero code changes for mTLS',
        'Consistent retry/timeout policies',
        'Traffic visibility without instrumentation',
        'Canary deployments easy',
        'Circuit breaking prevents cascading failures'
      ],
      example: `# Istio Sidecar Injection (automatic)
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
# Istio automatically injects Envoy sidecar

---
# Manual Envoy Sidecar
apiVersion: v1
kind: Pod
metadata:
  name: app-with-envoy
spec:
  containers:
  - name: app
    image: my-app:latest
    ports:
    - containerPort: 8080
  
  - name: envoy
    image: envoyproxy/envoy:v1.24
    ports:
    - containerPort: 15001  # Envoy admin
    - containerPort: 15000  # Egress
    volumeMounts:
    - name: envoy-config
      mountPath: /etc/envoy
    command:
    - /usr/local/bin/envoy
    - -c
    - /etc/envoy/envoy.yaml
  
  volumes:
  - name: envoy-config
    configMap:
      name: envoy-config`,
      useCases: [
        'Service mesh implementations (Istio, Linkerd)',
        'mTLS between services',
        'Advanced traffic management',
        'Distributed tracing',
        'Zero-trust security'
      ],
      serviceMeshIntegration: [
        'Istio uses Envoy as data plane',
        'Linkerd uses custom Rust proxy',
        'Consul Connect uses built-in proxy',
        'All provide control plane for config'
      ]
    },
    adapter: {
      name: 'Adapter Sidecar',
      icon: '🔌',
      description: 'Adapt interface or protocol for external communication',
      diagram: `
┌────────────────────────────────────┐
│           Pod                      │
│                                    │
│  ┌──────────┐    ┌──────────────┐ │
│  │   App    │    │   Adapter    │ │
│  │(gRPC API)│◄──►│   Sidecar    │─┼──► REST API
│  │          │    │ (gRPC→REST)  │ │
│  └──────────┘    └──────────────┘ │
│                                    │
└────────────────────────────────────┘

Use Cases:
• Protocol translation (gRPC ↔ REST)
• API versioning (v1 → v2 adapter)
• Legacy system integration
• Format conversion (XML ↔ JSON)`,
      keyFeatures: [
        'Protocol translation',
        'API versioning and compatibility',
        'Message format transformation',
        'Authentication/authorization injection',
        'Rate limiting and throttling'
      ],
      benefits: [
        'Keep application simple',
        'Support multiple protocols',
        'Backwards compatibility',
        'Easy to update adapters',
        'Reusable across services'
      ],
      example: `# gRPC to REST Adapter Sidecar
apiVersion: v1
kind: Pod
metadata:
  name: app-with-adapter
spec:
  containers:
  - name: app
    image: my-grpc-app:latest
    ports:
    - containerPort: 50051
      name: grpc
  
  - name: grpc-rest-adapter
    image: grpc-gateway:latest
    ports:
    - containerPort: 8080
      name: http
    env:
    - name: GRPC_BACKEND
      value: "localhost:50051"
    - name: HTTP_PORT
      value: "8080"`,
      useCases: [
        'Expose gRPC service as REST API',
        'Legacy protocol support',
        'API versioning',
        'Third-party integration'
      ]
    }
  };

  const scenarios = {
    multiLanguage: {
      name: 'Multi-Language Teams',
      description: 'Different teams use different languages/frameworks',
      problem: 'How to provide consistent logging/monitoring across Java, Python, Go, Node.js services?',
      solution: 'Use logging and monitoring sidecars. Each app logs to stdout, sidecar handles shipping.',
      benefits: [
        'No need for language-specific logging libraries',
        'Consistent log format across all services',
        'Central configuration management',
        'Easy to onboard new languages'
      ],
      architecture: `
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│  Java Service      │  │  Python Service    │  │   Go Service       │
│  + Fluentd Sidecar │  │  + Fluentd Sidecar │  │  + Fluentd Sidecar │
└─────────┬──────────┘  └─────────┬──────────┘  └─────────┬──────────┘
          │                       │                        │
          └───────────────────────┴────────────────────────┘
                                  │
                          ┌───────▼────────┐
                          │  Elasticsearch  │
                          │   (Centralized) │
                          └────────────────┘`
    },
    legacy: {
      name: 'Legacy Application Modernization',
      description: 'Adding cloud-native features to legacy apps without changing code',
      problem: 'Legacy Java app has no metrics, no distributed tracing, no mTLS',
      solution: 'Add sidecars: JMX exporter for metrics, Envoy for mTLS and tracing',
      benefits: [
        'No legacy code changes required',
        'Get modern observability',
        'Secure communication (mTLS)',
        'Gradual migration path'
      ],
      architecture: `
┌─────────────────────────────────────┐
│  Legacy Java App Pod                │
│                                     │
│  ┌────────────────┐                 │
│  │  Legacy App    │ (unchanged)     │
│  │  (2010 code)   │                 │
│  └────────┬───────┘                 │
│           │                         │
│  ┌────────▼───────┐  ┌───────────┐ │
│  │  JMX Exporter  │  │   Envoy   │ │
│  │   (metrics)    │  │  (mTLS +  │ │
│  └────────────────┘  │  tracing) │ │
│                      └───────────┘ │
└─────────────────────────────────────┘`
    },
    compliance: {
      name: 'Compliance & Security',
      description: 'Enforce security policies without modifying applications',
      problem: 'Need mTLS, audit logs, and encryption for all services. 50+ microservices.',
      solution: 'Service mesh with Envoy sidecars automatically handles mTLS and audit logging',
      benefits: [
        'Zero code changes across 50+ services',
        'Automatic mTLS certificate rotation',
        'Centralized policy enforcement',
        'Complete audit trail'
      ],
      architecture: `
All services get Envoy sidecar via service mesh:

┌────────────┐     mTLS      ┌────────────┐
│ Service A  │◄──────────────►│ Service B  │
│ + Envoy    │   encrypted    │ + Envoy    │
└──────┬─────┘                └──────┬─────┘
       │                             │
       │ Audit Logs                  │
       └──────────┬──────────────────┘
                  ▼
          ┌──────────────┐
          │ Control Plane│
          │ (Istio/etc.) │
          └──────────────┘`
    },
    development: {
      name: 'Development vs Production',
      description: 'Different sidecar configurations for different environments',
      problem: 'Need verbose logging in dev, but minimal in production',
      solution: 'Configure sidecar via ConfigMap/environment, change per environment',
      benefits: [
        'Same application image everywhere',
        'Environment-specific sidecar configs',
        'Easy A/B testing of sidecar versions',
        'Simplified deployment pipeline'
      ],
      architecture: `
Development:
┌────────────────────────────────┐
│ App + Verbose Fluentd Sidecar  │
│ (debug level, all logs)        │
└────────────────────────────────┘

Production:
┌────────────────────────────────┐
│ App + Optimized Fluentd        │
│ (error level only, buffered)   │
└────────────────────────────────┘

Same app image, different sidecar config!`
    }
  };

  const prosConsList = [
    {
      category: 'When to Use',
      items: [
        'Cross-cutting concerns (logging, monitoring, security)',
        'Language-agnostic capabilities needed',
        'Legacy apps without modern features',
        'Consistent policies across services',
        'Service mesh requirements',
        'Polyglot microservices architecture'
      ]
    },
    {
      category: 'Pros',
      items: [
        'Separation of concerns',
        'Language-agnostic',
        'Reusable across services',
        'Independent deployment/upgrade',
        'No application code changes',
        'Easier testing (mock sidecar)'
      ]
    },
    {
      category: 'Cons',
      items: [
        'Resource overhead (extra container)',
        'Increased complexity',
        'Container orchestration required',
        'Network latency (localhost usually negligible)',
        'Debugging can be harder',
        'Version compatibility management'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Sidecar Pattern</h3>
        <p className="text-muted-foreground">
          Learn how sidecar containers extend application capabilities without modifying code
        </p>
      </div>

      {/* Type Selector */}
      <div>
        <h4 className="font-semibold mb-3">Sidecar Types:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.keys(sidecarTypes).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedType === key
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
            >
              <div className="text-2xl mb-2">{sidecarTypes[key].icon}</div>
              <div className="font-medium text-sm">{sidecarTypes[key].name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sidecar Type Details */}
      <div className="from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{sidecarTypes[selectedType].icon}</div>
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-2">{sidecarTypes[selectedType].name}</h4>
            <p className="text-muted-foreground">{sidecarTypes[selectedType].description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {sidecarTypes[selectedType].diagram && (
            <div>
              <h5 className="font-semibold mb-2">Architecture:</h5>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                {sidecarTypes[selectedType].diagram}
              </pre>
            </div>
          )}

          {sidecarTypes[selectedType].tools && (
            <div>
              <h5 className="font-semibold mb-2">Popular Tools:</h5>
              <div className="grid md:grid-cols-2 gap-3">
                {sidecarTypes[selectedType].tools.map((tool, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded border">
                    <div className="font-medium text-purple-600 dark:text-purple-400">{tool.name}</div>
                    <div className="text-sm text-muted-foreground">{tool.desc}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{tool.features}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sidecarTypes[selectedType].keyFeatures && (
            <div>
              <h5 className="font-semibold mb-2">Key Features:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {sidecarTypes[selectedType].keyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400">→</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sidecarTypes[selectedType].benefits && (
            <div>
              <h5 className="font-semibold mb-2 text-green-600 dark:text-green-400">Benefits:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {sidecarTypes[selectedType].benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sidecarTypes[selectedType].example && (
            <div>
              <h5 className="font-semibold mb-2">Implementation Example:</h5>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{sidecarTypes[selectedType].example}</code>
              </pre>
            </div>
          )}

          {sidecarTypes[selectedType].serviceMeshIntegration && (
            <div>
              <h5 className="font-semibold mb-2">Service Mesh Integration:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {sidecarTypes[selectedType].serviceMeshIntegration.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sidecarTypes[selectedType].useCases && (
            <div>
              <h5 className="font-semibold mb-2">Use Cases:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {sidecarTypes[selectedType].useCases.map((useCase, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-2 rounded border">
                    {useCase}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-World Scenarios */}
      <div>
        <h4 className="text-xl font-bold mb-4">Real-World Scenarios</h4>
        <p className="text-muted-foreground mb-4">
          See how sidecar pattern solves practical problems in production environments
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {Object.keys(scenarios).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedScenario === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="font-medium text-sm">{scenarios[key].name}</div>
            </button>
          ))}
        </div>

        <div className=" from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="text-lg font-bold mb-2">{scenarios[selectedScenario].name}</h5>
          <p className="text-muted-foreground mb-4">{scenarios[selectedScenario].description}</p>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <h6 className="font-semibold mb-2 text-red-600 dark:text-red-400">Problem:</h6>
              <p>{scenarios[selectedScenario].problem}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <h6 className="font-semibold mb-2 text-green-600 dark:text-green-400">Solution:</h6>
              <p>{scenarios[selectedScenario].solution}</p>
            </div>

            <div>
              <h6 className="font-semibold mb-2">Benefits:</h6>
              <div className="grid md:grid-cols-2 gap-2">
                {scenarios[selectedScenario].benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h6 className="font-semibold mb-2">Architecture:</h6>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                {scenarios[selectedScenario].architecture}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Pros, Cons, When to Use */}
      <div>
        <h4 className="text-xl font-bold mb-4">Decision Framework</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {prosConsList.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h5 className={`font-bold mb-3 ${
                section.category === 'Pros' ? 'text-green-600 dark:text-green-400' :
                section.category === 'Cons' ? 'text-red-600 dark:text-red-400' :
                'text-blue-600 dark:text-blue-400'
              }`}>
                {section.category === 'Pros' && '✓ '}
                {section.category === 'Cons' && '✗ '}
                {section.category === 'When to Use' && '🎯 '}
                {section.category}
              </h5>
              <ul className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm">
                    {section.category === 'Pros' && <span className="text-green-600 dark:text-green-400">+ </span>}
                    {section.category === 'Cons' && <span className="text-red-600 dark:text-red-400">- </span>}
                    {section.category === 'When to Use' && <span className="text-blue-600 dark:text-blue-400">• </span>}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Considerations */}
      <div className="bg-orange-50 dark:bg-orange-950 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
        <h4 className="text-lg font-bold mb-3">⚠️ Resource Considerations</h4>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium">Memory Overhead:</p>
            <p className="text-sm text-muted-foreground">
              Each sidecar adds 50-200MB RAM. With 100 pods × 2 sidecars = 10-40GB cluster overhead. 
              Use lightweight sidecars (Linkerd proxy ~10MB vs Envoy ~50MB).
            </p>
          </div>

          <div>
            <p className="font-medium">CPU Usage:</p>
            <p className="text-sm text-muted-foreground">
              Proxies use 0.1-0.5 CPU per pod. Logging sidecars minimal unless high throughput. 
              Set resource limits to prevent sidecar from starving main container.
            </p>
          </div>

          <div>
            <p className="font-medium">Network Latency:</p>
            <p className="text-sm text-muted-foreground">
              Localhost communication is fast (~0.1ms), but proxy adds 1-3ms. Usually negligible, 
              but consider for latency-sensitive apps (high-frequency trading, gaming).
            </p>
          </div>

          <div>
            <p className="font-medium">Deployment Complexity:</p>
            <p className="text-sm text-muted-foreground">
              Requires container orchestration (Kubernetes). More moving parts = more things to monitor. 
              Use service mesh for automatic sidecar injection (Istio, Linkerd).
            </p>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="text-lg font-bold mb-3">💡 Interview Tips</h4>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium">Q: "What is the sidecar pattern and why use it?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Sidecar pattern deploys additional containers alongside main application container in same pod. Use it for cross-cutting concerns (logging, monitoring, security) without modifying app code. Benefits: separation of concerns, language-agnostic, reusable. Trade-off: resource overhead and complexity.
            </p>
          </div>

          <div>
            <p className="font-medium">Q: "Explain a real-world use case for sidecars"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Legacy Java app from 2010 has no metrics or distributed tracing. Instead of rewriting code, add JMX exporter sidecar for metrics and Envoy sidecar for mTLS and tracing. Zero code changes, get modern observability and security. Perfect for gradual modernization.
            </p>
          </div>

          <div>
            <p className="font-medium">Q: "What's the difference between sidecar and service mesh?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Service mesh uses sidecar pattern—it deploys proxy sidecars (Envoy) to every pod. Sidecar is the pattern, service mesh is the implementation at scale with central control plane (Istio, Linkerd). You can use sidecars without full service mesh for simpler use cases.
            </p>
          </div>

          <div>
            <p className="font-medium">Q: "How do you handle resource overhead from sidecars?"</p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Set resource requests/limits on sidecars. Use lightweight options (Linkerd proxy vs Envoy). Share sidecars where possible (one Fluentd per node via DaemonSet). Monitor resource usage. Consider sidecarless alternatives for simple cases (agent on host, no per-pod sidecar).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidecarPattern;
