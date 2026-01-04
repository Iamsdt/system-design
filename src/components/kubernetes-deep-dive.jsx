import React, { useState } from "react"

const KubernetesDeepDive = () => {
  const [selectedConcept, setSelectedConcept] = useState("pods")
  const [selectedComparison, setSelectedComparison] = useState("statefulset")
  const [showDiagram, setShowDiagram] = useState(true)

  const concepts = {
    pods: {
      name: "Pods",
      icon: "🎯",
      description:
        "Smallest deployable unit in Kubernetes - one or more containers",
      keyPoints: [
        "Shared network namespace (same IP)",
        "Shared storage volumes",
        "Lifecycle managed together",
        "Ephemeral by design",
        "Co-located containers",
      ],
      yaml: `apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: nginx:1.21
    ports:
    - containerPort: 80
  - name: sidecar
    image: busybox
    command: ['sh', '-c', 'tail -f /var/log/app.log']`,
      useCases: [
        "Single container per pod (most common)",
        "Sidecar containers (logging, monitoring)",
        "Init containers (setup before main)",
        "Adapter/Ambassador patterns",
      ],
      antiPatterns: [
        "Don't run unrelated apps in same pod",
        "Don't use pods directly (use Deployments)",
        "Don't expect pod IP to persist",
        "Don't store state in pod filesystem",
      ],
    },
    services: {
      name: "Services",
      icon: "🔗",
      description: "Stable network endpoint for accessing pods",
      keyPoints: [
        "DNS name remains constant",
        "Load balances across pods",
        "Service discovery built-in",
        "Multiple service types",
        "Label selector based",
      ],
      yaml: `apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: LoadBalancer  # ClusterIP, NodePort, LoadBalancer
  selector:
    app: my-app       # Targets pods with this label
  ports:
  - protocol: TCP
    port: 80          # Service port
    targetPort: 8080  # Container port`,
      types: [
        {
          name: "ClusterIP",
          use: "Internal only (default)",
          example: "Database, internal API",
        },
        {
          name: "NodePort",
          use: "External access via node",
          example: "Dev/test environments",
        },
        {
          name: "LoadBalancer",
          use: "Cloud load balancer",
          example: "Production web apps",
        },
        {
          name: "ExternalName",
          use: "DNS alias",
          example: "External database",
        },
      ],
      useCases: [
        "Expose deployments to cluster",
        "Load balance across replicas",
        "Service discovery via DNS",
        "External traffic routing",
      ],
    },
    deployments: {
      name: "Deployments",
      icon: "🚀",
      description: "Declarative updates for Pods and ReplicaSets",
      keyPoints: [
        "Desired state management",
        "Rolling updates built-in",
        "Rollback capability",
        "Self-healing",
        "Scaling up/down",
      ],
      yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1       # Extra pods during update
      maxUnavailable: 0 # Zero-downtime
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:v2
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 200m
            memory: 256Mi`,
      strategies: [
        {
          name: "RollingUpdate",
          desc: "Gradual replacement (default)",
          downtime: "Zero",
          use: "Production",
        },
        {
          name: "Recreate",
          desc: "Delete all, then create",
          downtime: "Brief",
          use: "Dev/test",
        },
        {
          name: "Blue-Green",
          desc: "Two full environments",
          downtime: "Zero",
          use: "Critical apps",
        },
        {
          name: "Canary",
          desc: "Gradual traffic shift",
          downtime: "Zero",
          use: "Risk reduction",
        },
      ],
      useCases: [
        "Stateless applications",
        "Web servers, APIs",
        "Microservices",
        "Background workers",
      ],
    },
    configmaps: {
      name: "ConfigMaps",
      icon: "⚙️",
      description: "Store non-sensitive configuration data",
      keyPoints: [
        "Key-value pairs",
        "Environment variables",
        "Config files as volumes",
        "Hot-reload possible",
        "Separate config from code",
      ],
      yaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgres://db:5432/mydb"
  log_level: "info"
  feature_flags: |
    feature_a: true
    feature_b: false
---
# Using in Pod
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:latest
    envFrom:
    - configMapRef:
        name: app-config
    # OR mount as file
    volumeMounts:
    - name: config
      mountPath: /etc/config
  volumes:
  - name: config
    configMap:
      name: app-config`,
      useCases: [
        "Application configuration",
        "Feature flags",
        "Environment-specific settings",
        "Config file injection",
      ],
      bestPractices: [
        "Use descriptive names",
        "Version your configs",
        "Don't store secrets here",
        "Limit to 1MB per ConfigMap",
      ],
    },
    secrets: {
      name: "Secrets",
      icon: "🔐",
      description: "Store sensitive data (passwords, tokens, keys)",
      keyPoints: [
        "Base64 encoded (not encrypted by default)",
        "Access control via RBAC",
        "Can mount as files or env vars",
        "Encrypted at rest (optional)",
        "Rotatable without redeployment",
      ],
      yaml: `apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=          # base64 of "admin"
  password: cGFzc3dvcmQxMjM=  # base64 of "password123"
---
# Using in Pod
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:latest
    env:
    - name: DB_USERNAME
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: username
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password`,
      types: [
        { name: "Opaque", use: "Arbitrary data (default)" },
        { name: "kubernetes.io/tls", use: "TLS certificates" },
        { name: "kubernetes.io/dockerconfigjson", use: "Docker registry auth" },
        { name: "kubernetes.io/basic-auth", use: "Basic authentication" },
      ],
      securityTips: [
        "Enable encryption at rest",
        "Use external secret managers (Vault)",
        "Limit RBAC access",
        "Rotate secrets regularly",
        "Never commit secrets to git",
        "Use sealed secrets or SOPS",
      ],
    },
    ingress: {
      name: "Ingress",
      icon: "🌐",
      description: "HTTP/HTTPS routing to services",
      keyPoints: [
        "Single entry point",
        "Host-based routing",
        "Path-based routing",
        "TLS termination",
        "Load balancing",
      ],
      yaml: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    secretName: tls-secret
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80`,
      controllers: [
        {
          name: "NGINX Ingress",
          use: "Most popular",
          features: "Rate limiting, auth",
        },
        {
          name: "Traefik",
          use: "Cloud native",
          features: "Auto-discovery, middleware",
        },
        { name: "HAProxy", use: "High performance", features: "Advanced LB" },
        { name: "Contour", use: "Envoy-based", features: "Modern, extensible" },
      ],
      useCases: [
        "Single IP for multiple services",
        "SSL/TLS termination",
        "Name-based virtual hosting",
        "Load balancing",
      ],
    },
    servicemesh: {
      name: "Service Mesh",
      icon: "🕸️",
      description: "Infrastructure layer for service-to-service communication",
      keyPoints: [
        "Sidecar proxy pattern",
        "Traffic management",
        "Security (mTLS)",
        "Observability built-in",
        "Policy enforcement",
      ],
      architecture: `
┌─────────────────────────────────────┐
│         Service Mesh                │
│  ┌─────────┐        ┌─────────┐    │
│  │ Service │        │ Service │    │
│  │    A    │        │    B    │    │
│  └────┬────┘        └────┬────┘    │
│       │                  │          │
│  ┌────▼────┐        ┌────▼────┐    │
│  │  Envoy  │◄──────►│  Envoy  │    │
│  │  Proxy  │  mTLS  │  Proxy  │    │
│  └────┬────┘        └────┬────┘    │
│       │                  │          │
│       └──────────┬───────┘          │
│                  ▼                  │
│         ┌────────────────┐          │
│         │ Control Plane  │          │
│         │ (Istiod, etc.) │          │
│         └────────────────┘          │
└─────────────────────────────────────┘`,
      features: [
        {
          name: "Traffic Management",
          desc: "Canary, A/B testing, circuit breaking",
          example: "Route 10% to v2",
        },
        {
          name: "Security",
          desc: "mTLS, authentication, authorization",
          example: "Encrypt all traffic",
        },
        {
          name: "Observability",
          desc: "Metrics, logs, traces",
          example: "Distributed tracing",
        },
        {
          name: "Resilience",
          desc: "Retries, timeouts, rate limiting",
          example: "Auto-retry failed",
        },
      ],
      tools: [
        {
          name: "Istio",
          pros: "Feature-rich, mature",
          cons: "Complex, resource heavy",
          use: "Enterprise",
        },
        {
          name: "Linkerd",
          pros: "Lightweight, simple",
          cons: "Fewer features",
          use: "Getting started",
        },
        {
          name: "Consul",
          pros: "Multi-cloud, multi-runtime",
          cons: "Steeper learning",
          use: "Hybrid cloud",
        },
      ],
      whenToUse: [
        "Microservices with many services (>10)",
        "Need for mTLS everywhere",
        "Complex traffic patterns",
        "Observability requirements",
        "Policy enforcement needed",
      ],
      whenNotToUse: [
        "Small number of services (<5)",
        "Monolithic applications",
        "Simple architectures",
        "Limited resources",
        "Learning Kubernetes basics",
      ],
    },
  }

  const comparisons = {
    statefulset: {
      name: "StatefulSet",
      description: "For stateful applications requiring stable identity",
      characteristics: [
        "Stable network identity",
        "Stable persistent storage",
        "Ordered deployment/scaling",
        "Ordered rolling updates",
        "Pod name includes ordinal (pod-0, pod-1)",
      ],
      useCases: [
        "Databases (MySQL, PostgreSQL, MongoDB)",
        "Message queues (Kafka, RabbitMQ)",
        "Distributed systems (Zookeeper, etcd)",
        "Stateful caches (Redis with persistence)",
      ],
      yaml: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi`,
      example:
        "MySQL replica set: mysql-0 (master), mysql-1, mysql-2 (replicas)",
    },
    deployment: {
      name: "Deployment",
      description: "For stateless applications",
      characteristics: [
        "No stable identity",
        "Random pod names",
        "Can scale up/down freely",
        "Rolling updates easy",
        "Pods are interchangeable",
      ],
      useCases: [
        "Web servers (Nginx, Apache)",
        "Stateless APIs",
        "Background workers",
        "Microservices",
      ],
      yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  replicas: 5
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: nginx:latest
        ports:
        - containerPort: 80`,
      example: "Web app: webapp-abc123, webapp-def456 (random suffixes)",
    },
  }

  const comparisonTable = [
    {
      aspect: "Identity",
      statefulset: "Stable (pod-0, pod-1)",
      deployment: "Random (pod-abc123)",
    },
    {
      aspect: "Storage",
      statefulset: "Persistent per pod",
      deployment: "Shared or ephemeral",
    },
    {
      aspect: "Scaling",
      statefulset: "Ordered (0→1→2)",
      deployment: "Parallel",
    },
    {
      aspect: "Updates",
      statefulset: "Ordered (2→1→0)",
      deployment: "Rolling parallel",
    },
    {
      aspect: "DNS",
      statefulset: "pod-0.service",
      deployment: "service (any pod)",
    },
    {
      aspect: "Use Case",
      statefulset: "Databases, queues",
      deployment: "Web apps, APIs",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Kubernetes Deep Dive</h3>
        <p className="text-muted-foreground">
          Master Kubernetes core concepts: Pods, Services, Deployments,
          ConfigMaps, Secrets, Ingress, and Service Mesh
        </p>
      </div>

      {/* Concept Selector */}
      <div>
        <h4 className="font-semibold mb-3">Select Concept to Explore:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.keys(concepts).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedConcept(key)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedConcept === key
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
            >
              <div className="text-2xl mb-1">{concepts[key].icon}</div>
              <div className="font-medium text-sm">{concepts[key].name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Concept Details */}
      <div className="p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{concepts[selectedConcept].icon}</div>
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-2">
              {concepts[selectedConcept].name}
            </h4>
            <p className="text-muted-foreground">
              {concepts[selectedConcept].description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="font-semibold mb-2">Key Points:</h5>
            <div className="grid md:grid-cols-2 gap-2">
              {concepts[selectedConcept].keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {concepts[selectedConcept].yaml && (
            <div>
              <h5 className="font-semibold mb-2">YAML Example:</h5>
              <pre className="bg-gray-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{concepts[selectedConcept].yaml}</code>
              </pre>
            </div>
          )}

          {concepts[selectedConcept].types && (
            <div>
              <h5 className="font-semibold mb-2">Types:</h5>
              <div className="space-y-2">
                {concepts[selectedConcept].types.map((type, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-3 rounded border"
                  >
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {type.name}
                    </span>
                    {" - "}
                    <span>{type.use}</span>
                    {type.example && (
                      <span className="text-sm text-muted-foreground">
                        {" "}
                        (e.g., {type.example})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {concepts[selectedConcept].strategies && (
            <div>
              <h5 className="font-semibold mb-2">Deployment Strategies:</h5>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border p-2 text-left">Strategy</th>
                      <th className="border p-2 text-left">Description</th>
                      <th className="border p-2 text-left">Downtime</th>
                      <th className="border p-2 text-left">Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    {concepts[selectedConcept].strategies.map(
                      (strategy, index) => (
                        <tr key={index}>
                          <td className="border p-2 font-medium">
                            {strategy.name}
                          </td>
                          <td className="border p-2">{strategy.desc}</td>
                          <td className="border p-2">{strategy.downtime}</td>
                          <td className="border p-2">{strategy.use}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {concepts[selectedConcept].controllers && (
            <div>
              <h5 className="font-semibold mb-2">
                Popular Ingress Controllers:
              </h5>
              <div className="space-y-2">
                {concepts[selectedConcept].controllers.map(
                  (controller, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-3 rounded border"
                    >
                      <div className="font-medium text-blue-600 dark:text-blue-400">
                        {controller.name}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Use: </span>
                        {controller.use}
                        {" | "}
                        <span className="text-muted-foreground">
                          Features:{" "}
                        </span>
                        {controller.features}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {concepts[selectedConcept].architecture && (
            <div>
              <h5 className="font-semibold mb-2">Architecture:</h5>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                {concepts[selectedConcept].architecture}
              </pre>
            </div>
          )}

          {concepts[selectedConcept].features && (
            <div>
              <h5 className="font-semibold mb-2">Key Features:</h5>
              <div className="space-y-2">
                {concepts[selectedConcept].features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-3 rounded border"
                  >
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {feature.desc}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Example: {feature.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {concepts[selectedConcept].tools && (
            <div>
              <h5 className="font-semibold mb-2">Popular Tools:</h5>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border p-2 text-left">Tool</th>
                      <th className="border p-2 text-left">Pros</th>
                      <th className="border p-2 text-left">Cons</th>
                      <th className="border p-2 text-left">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {concepts[selectedConcept].tools.map((tool, index) => (
                      <tr key={index}>
                        <td className="border p-2 font-medium">{tool.name}</td>
                        <td className="border p-2">{tool.pros}</td>
                        <td className="border p-2">{tool.cons}</td>
                        <td className="border p-2">{tool.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {concepts[selectedConcept].whenToUse && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                  ✓ When to Use:
                </h5>
                <ul className="space-y-1">
                  {concepts[selectedConcept].whenToUse.map((item, index) => (
                    <li key={index} className="text-sm">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                  ✗ When NOT to Use:
                </h5>
                <ul className="space-y-1">
                  {concepts[selectedConcept].whenNotToUse.map((item, index) => (
                    <li key={index} className="text-sm">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {concepts[selectedConcept].useCases && (
            <div>
              <h5 className="font-semibold mb-2">Common Use Cases:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {concepts[selectedConcept].useCases.map((useCase, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">→</span>
                    <span>{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {concepts[selectedConcept].antiPatterns && (
            <div>
              <h5 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                Anti-Patterns:
              </h5>
              <div className="grid md:grid-cols-2 gap-2">
                {concepts[selectedConcept].antiPatterns.map(
                  (pattern, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-400">✗</span>
                      <span>{pattern}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {concepts[selectedConcept].bestPractices && (
            <div>
              <h5 className="font-semibold mb-2">Best Practices:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {concepts[selectedConcept].bestPractices.map(
                  (practice, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400">
                        ✓
                      </span>
                      <span>{practice}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {concepts[selectedConcept].securityTips && (
            <div>
              <h5 className="font-semibold mb-2">Security Best Practices:</h5>
              <div className="grid md:grid-cols-2 gap-2">
                {concepts[selectedConcept].securityTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">
                      🔒
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* StatefulSet vs Deployment Comparison */}
      <div>
        <h4 className="text-xl font-bold mb-4">
          StatefulSet vs Deployment Comparison
        </h4>
        <p className="text-muted-foreground mb-4">
          Understanding when to use StatefulSets vs Deployments is crucial for
          architecting Kubernetes applications
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedComparison("statefulset")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedComparison === "statefulset"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            StatefulSet
          </button>
          <button
            onClick={() => setSelectedComparison("deployment")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedComparison === "deployment"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Deployment
          </button>
        </div>

        <div className=" from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-6 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
          <h5 className="text-lg font-bold mb-2">
            {comparisons[selectedComparison].name}
          </h5>
          <p className="text-muted-foreground mb-4">
            {comparisons[selectedComparison].description}
          </p>

          <div className="space-y-4">
            <div>
              <h6 className="font-semibold mb-2">Characteristics:</h6>
              <div className="grid gap-2">
                {comparisons[selectedComparison].characteristics.map(
                  (char, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400">
                        ✓
                      </span>
                      <span>{char}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h6 className="font-semibold mb-2">Use Cases:</h6>
              <div className="grid md:grid-cols-2 gap-2">
                {comparisons[selectedComparison].useCases.map(
                  (useCase, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-2 rounded border"
                    >
                      {useCase}
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h6 className="font-semibold mb-2">Example:</h6>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <code className="text-sm">
                  {comparisons[selectedComparison].example}
                </code>
              </div>
            </div>

            <div>
              <h6 className="font-semibold mb-2">YAML Configuration:</h6>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{comparisons[selectedComparison].yaml}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div>
          <h5 className="font-semibold mb-3">Side-by-Side Comparison:</h5>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border p-3 text-left">Aspect</th>
                  <th className="border p-3 text-left">StatefulSet</th>
                  <th className="border p-3 text-left">Deployment</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr key={index}>
                    <td className="border p-3 font-medium">{row.aspect}</td>
                    <td className="border p-3">{row.statefulset}</td>
                    <td className="border p-3">{row.deployment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="text-lg font-bold mb-3">💡 Interview Tips</h4>

        <div className="space-y-3">
          <div>
            <p className="font-medium">
              Q: "What's the difference between a Pod and a Container?"
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> A Pod is a Kubernetes abstraction that can
              contain one or more containers. Containers in the same Pod share
              network namespace (same IP) and can share volumes. Most Pods run a
              single container, but sidecar patterns use multiple containers
              (e.g., app + logging agent).
            </p>
          </div>

          <div>
            <p className="font-medium">
              Q: "When would you use StatefulSets instead of Deployments?"
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Use StatefulSets when you need stable pod
              identity and persistent storage per pod. Classic examples:
              databases (MySQL, PostgreSQL), distributed systems (Kafka,
              Zookeeper), caches with persistence (Redis). Use Deployments for
              stateless apps where pods are interchangeable.
            </p>
          </div>

          <div>
            <p className="font-medium">
              Q: "How does Service Discovery work in Kubernetes?"
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Kubernetes has built-in DNS service discovery.
              Each Service gets a DNS name
              (service-name.namespace.svc.cluster.local). Pods can use this name
              to connect. Kubernetes also supports environment variables, but
              DNS is preferred. For external services, you can use ExternalName
              Service type.
            </p>
          </div>

          <div>
            <p className="font-medium">
              Q: "What's the purpose of a Service Mesh?"
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>A:</strong> Service Mesh adds sidecar proxies (like Envoy)
              to every pod to handle service-to-service communication. It
              provides mTLS encryption, traffic management (canary, circuit
              breaking), observability (traces, metrics), and policy
              enforcement—all without changing application code. Trade-off: Adds
              complexity and resource overhead.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KubernetesDeepDive
