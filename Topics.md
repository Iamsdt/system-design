# System Design & Cloud Engineering Essentials

Purpose: concise, grouped topics for system design and cloud fundamentals. Emphasis on picking the right data/compute patterns and comparing managed cloud options without over- or under-grouping.

## 1) Core Principles & Sizing

- Interview flow, use-case mapping, functional vs non-functional requirements

  - Why: A disciplined interview flow ensures you design solutions that match real user needs and constraints, not hypothetical ideal architectures.
  - How: Start with clarifying questions, map user journeys, define what 'done' means, and separate functional from non-functional requirements.
  - When: Always at the start of a design or when mapping legacy systems for migration.
  - Trade-offs: Time spent on elicitation reduces time for detailed design — set expectations with stakeholders.

- Performance vs scalability; latency vs throughput; CAP vs BASE trade-offs

  - Why: Conflating performance (single request speed) and scalability (growth handling) leads to poor architecture choices.
  - How: Measure p50/p95/p99 latencies, profile hotspots, and model increased load to derive req/sec and bandwidth needs.
  - When: During SLA/SLO planning, capacity planning, and selecting database/compute approaches.
  - Trade-offs: Caching reduces latency but increases complexity and operational burden; large VMs provide performance but limit horizontal scaling.

- Back-of-envelope estimates: traffic/QPS, storage/bandwidth, SLIs/SLOs/SLAs and availability math

  - Why: Quick numeric estimates help you choose realistic infrastructure, databases, and caches during interviews and early architecture design.
  - How: Use DAU × requests/user to get daily requests; divide by 86,400 for average QPS; multiply by request size to estimate bandwidth.
  - When: Use during design interviews, early architecture and cost planning; verify with load tests later.
  - Trade-offs: Estimates are approximate. Err on the side of multiplying by a safety factor (2–10x) to account for spikes, growth, and hot keys.

- Vertical vs horizontal scaling basics
  - Why: Picking the wrong scaling strategy can cause unnecessary cost and downtime during growth.
  - How: Start with vertical scaling for small monoliths and stateful systems; migrate to horizontal scaling (stateless services, sharding) as you grow.
  - When: Early-stage startups should conserve cost with vertical scaling; scale horizontally when traffic and availability requirements increase.
  - Trade-offs: Vertical is operationally simpler but limited in capacity; horizontal requires partitioning and coordination but offers fault tolerance.

### Visuals & Interactive Demos

- Image: simple CAP theorem Venn (public domain-like styled SVG) or example diagrams from Wikimedia Commons or Unsplash to illustrate trade-offs.
- Interactive: Capacity planner calculator (DAU → QPS → bandwidth) and availability calculator for downtime math (easily implemented as a small web demo for the lecture).

## 2) Networking & Edge Delivery

- IP/DNS basics, TTL, geo/latency-aware routing

  - Why: Every request starts with finding the server. Performance depends on routing users to the closest healthy node.
  - How: DNS records (A, CNAME, NS), Anycast IP for geo-routing, and TTL for caching.
  - When: Designing global systems or debugging connectivity/latency issues.
  - Trade-offs: Low TTL = fresher data but higher DNS load/latency; High TTL = better caching but risk of stale endpoints during failover.

- HTTP/2/3 and TCP vs UDP trade-offs; TLS termination and connection pooling

  - Why: Protocols dictate performance. TCP is reliable but slow; UDP is fast but unreliable. HTTP/2+3 fix head-of-line blocking.
  - How: Use HTTP/2 for multiplexing; HTTP/3 (QUIC) for lossy networks. Offload TLS at the load balancer to save app server CPU.
  - When: High-traffic web apps, streaming (UDP), or mobile apps (HTTP/3).
  - Trade-offs: UDP requires custom reliability logic (or QUIC); TLS termination simplifies app logic but requires a secure internal network.

- Reverse proxy vs load balancer (L4/L7 algorithms, health checks)

  - Why: Scale beyond one server and secure the internal network.
  - How: L4 LB (IP+Port) for raw speed; L7 LB (HTTP headers/path) for smart routing. Reverse proxy hides server identity.
  - When: Always, for production systems requiring availability and scale.
  - Trade-offs: L7 offers smarter routing (e.g., by user ID) but is more CPU-intensive than L4.

- CDN push vs pull, cache hierarchies, invalidation strategies

  - Why: Serve static content from the edge (close to user) to reduce latency and origin load.
  - How: Pull (fetch on miss) for automation; Push (upload) for control. Invalidate via TTL or explicit purge.
  - When: Serving images, CSS, JS, or video to a distributed audience.
  - Trade-offs: Pull is easier but has "cold start" latency; Push ensures availability but adds deployment complexity.

### Visuals & Interactive Demos

- Interactive: DNS resolution flow visualizer (Client -> Root -> TLD -> NS).
- Interactive: CDN cache hit/miss simulator with latency comparison.
- Diagram: OSI 7-layer model highlighting L4 vs L7 load balancing.

## 3) Data Architecture & Storage Choices

- How to choose a database: SQL vs NoSQL, ACID vs BASE, schema needs, access patterns, consistency and latency budgets
- Operational patterns: replication (leader/follower, quorum), partitioning/sharding keys, federation, indexing and query tuning
- Caching patterns: cache-aside, write-through/back, refresh-ahead; consistent hashing to avoid hot shards
- Storage models and when to pick them: key-value, document, wide-column, graph; blob/object storage for media/large files
- Compliance hooks: data lifecycle, GDPR/PII handling, encryption at rest/in transit

## 4) Compute & Runtime Models

- Monolith vs microservices vs modular monolith; service discovery and API composition
- Containers and orchestration: Docker hygiene, Kubernetes primitives (deployments, services, ingress), autoscaling (HPA/VPA), disruption budgets
- Serverless and managed runtimes: Cloud Run/Functions vs container/GKE; when to pick which
- Deployment strategies: rolling, blue/green, canary, feature flags; supply-chain security and SBOMs

## 5) APIs, Integration & Data Movement

- REST vs gRPC vs GraphQL: when to choose, versioning, idempotency, pagination
- API gateway patterns: routing, auth, rate limiting, payload transforms
- Sync vs async: queues and pub/sub (ordering, DLQs, at-least/exactly-once), backpressure, retries with jitter
- Real-time paths: WebSockets/SSE/long-polling, webhooks for server-to-server notifications

## 6) Reliability & Resilience

- SLO-driven design, error budgets, chaos/load testing
- Graceful degradation, brownouts, hedged requests, tail-latency mitigation
- Rate limiting and throttling (token/sliding window); circuit breaking and bulkheads
- DR/backup/restore, RTO/RPO planning; active-active vs active-passive

## 7) Security, Governance & Compliance

- AuthN/AuthZ (OAuth2/OIDC, JWT), mTLS, key management and rotation
- Network posture: VPC segmentation, WAF/DDoS protection, least-privilege IAM
- Secrets management, audit logging/tamper evidence, data residency controls

## 8) Observability & Operations

- Metrics/logs/traces with sampling; OpenTelemetry and structured logging
- Dashboards and alert design (multi-window burn rates), SLI/SLO tracking
- Incident response playbooks, on-call hygiene, runbooks, game days

## 9) Cloud Service Comparisons (managed-first bias)

- Data: Cloud SQL vs RDS vs Azure SQL; Spanner vs DynamoDB/Cosmos DB; Bigtable vs Cassandra; BigQuery vs Redshift/Synapse
- Messaging/streaming: Pub/Sub vs SNS/SQS/EventBridge vs Event Hub/Service Bus; Dataflow/Beam vs Kinesis vs Data Factory/Synapse pipelines
- Compute: Cloud Run vs App Runner vs Azure Container Apps; GKE vs EKS vs AKS; Functions vs Lambda vs Azure Functions
- Storage and cache: Cloud Storage vs S3 vs Blob; Memorystore (Redis) vs ElastiCache vs Azure Cache for Redis
- Networking: Cloud Load Balancing vs ALB/NLB vs Azure Front Door/App Gateway; Cloud CDN vs CloudFront vs Azure CDN

## 10) Practice & Labs

- Back-of-envelope drills per topic (traffic, storage, availability math)
- Hands-on labs: Terraform + CI/CD + Cloud Run/GKE + Pub/Sub + cache/DB choice
- Classic designs: URL shortener, rate limiter, news feed, chat/notifications, file storage, media streaming

## Suggested Interactive Elements

- Capacity/QPS planner and availability calculator (Topic 1)
- Load balancer and CDN path visualizer (Topic 2)
- Database and cache selector with workload inputs (Topic 3)
- Deployment strategy simulator (rolling/blue-green/canary) (Topic 4)
- API gateway/rate-limit sandbox (Topic 5)
- Chaos and retry/jitter simulator (Topic 6)
- IAM policy builder and network segmentation sandbox (Topic 7)
- SLO dashboard with alert tuning (Topic 8)

## Keep It Current

- Revisit cloud release notes quarterly (GCP/AWS/Azure) for managed service limits and pricing changes.
- Map each topic to at least one managed service to reinforce managed-first design.

## Assessment

- Short scenario prompts per topic with expected trade-offs
- Capstone: multi-tier service with SLOs, dashboards, CI/CD, and rollout strategy
