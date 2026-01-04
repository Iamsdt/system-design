import { useMemo, useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import AcidVsBase from "../../components/acid-vs-base"
import DatabaseIndexingDeepDive from "../../components/database-indexing-deep-dive"
import OltpVsOlapExpanded from "../../components/oltp-vs-olap-expanded"
import ReadReplicasReplication from "../../components/read-replicas-replication"

/**
 * Data Architecture & Storage Choices page component
 */
export default function DataArchitecture() {
  const nav = useNavigate()
  const [cachePattern, setCachePattern] = useState("cache-aside")
  const [shardCount, setShardCount] = useState(4)
  const sectionsReference = useRef([])

  // Storage/DB Chooser Demo State (new)
  const [chooserWorkload, setChooserWorkload] = useState("oltp")
  const [chooserScale, setChooserScale] = useState("single-region")
  const [chooserQuery, setChooserQuery] = useState("joins")

  // Sharding demo state
  const [shardKey, setShardKey] = useState("user_id")
  const [shardDataset, setShardDataset] = useState("uniform")
  const [sampleSeed, setSampleSeed] = useState(1)
  const [dataPoints, setDataPoints] = useState([])

  // CAP theorem demo state
  const [capPartition, setCapPartition] = useState(false)
  const [capPreference, setCapPreference] = useState("cp")

  const chooserRecommendation = useMemo(() => {
    /**
     * Returns: { kind: 'storage'|'database', category, why, watchOut, examples: { generic, gcp } }
     */
    const base = {
      kind: "database",
      category: "",
      why: "",
      watchOut: "",
      examples: {
        generic: [],
        gcp: [],
      },
    }

    // Storage first
    if (chooserWorkload === "files") {
      return {
        ...base,
        kind: "storage",
        category: "Object Storage (Blob)",
        why: "Best for large files (media, backups, data lake objects) with cheap durable storage and simple retrieval.",
        watchOut:
          "Not a database: querying is limited; plan metadata storage separately (often SQL/NoSQL).",
        examples: {
          generic: ["S3", "Object Storage"],
          gcp: ["Cloud Storage"],
        },
      }
    }

    // Workload-driven database choices
    switch (chooserWorkload) {
      case "cache":
        return {
          ...base,
          kind: "database",
          category: "Cache / In-Memory KV",
          why: "For sub-millisecond reads, sessions, rate limiting, and hot data. This is a performance layer, not the source of truth.",
          watchOut:
            "Evictions and TTLs mean data can disappear; write-through/write-behind adds complexity.",
          examples: { generic: ["Redis"], gcp: ["Memorystore (Redis)"] },
        }
      case "search":
        return {
          ...base,
          kind: "database",
          category: "Search Index",
          why: "For full-text search, fuzzy matching, and log/event search with inverted indexes.",
          watchOut:
            "Keep it in sync with your source-of-truth DB; indexing pipelines add operational overhead.",
          examples: {
            generic: ["Elasticsearch", "OpenSearch"],
            gcp: ["(managed options vary)"],
          },
        }
      case "olap":
        return {
          ...base,
          kind: "database",
          category: "Data Warehouse (OLAP)",
          why: "For large-scale analytics, scans, aggregations, and BI dashboards over lots of historical data.",
          watchOut:
            "Not ideal for per-request OLTP transactions; model data pipelines (ELT/ETL).",
          examples: {
            generic: ["BigQuery", "Snowflake", "Redshift"],
            gcp: ["BigQuery"],
          },
        }
      case "timeseries": {
        const preferSql = chooserQuery === "aggregations"
        return {
          ...base,
          kind: "database",
          category: preferSql
            ? "Time-Series Database"
            : "Wide-Column (Time-Series at scale)",
          why: preferSql
            ? "For time-window queries, rollups, and SQL-like analytics over metrics/events."
            : "For massive write throughput + predictable key/range access patterns (device_id + time).",
          watchOut:
            "Choose a good partition key (device/tenant) and retention policy; hot partitions are common.",
          examples: preferSql
            ? {
                generic: ["TimescaleDB", "InfluxDB"],
                gcp: ["(often self-managed / partner)"],
              }
            : { generic: ["Cassandra", "Bigtable"], gcp: ["Bigtable"] },
        }
      }
      case "widecolumn":
        return {
          ...base,
          kind: "database",
          category: "Wide-Column Store",
          why: "For huge write throughput and horizontally scaled key/range access (often time-series, IoT, event storage).",
          watchOut:
            "You design queries first; secondary indexes/joins are limited compared to SQL.",
          examples: { generic: ["Cassandra", "HBase"], gcp: ["Bigtable"] },
        }
      case "nosql":
        return {
          ...base,
          kind: "database",
          category: "NoSQL Document / KV",
          why:
            chooserScale === "global"
              ? "For globally distributed workloads needing horizontal scale and high availability."
              : "For flexible schemas and fast iteration with JSON-like documents.",
          watchOut:
            "Model around access patterns; cross-document joins are limited.",
          examples:
            chooserScale === "global"
              ? { generic: ["DynamoDB"], gcp: ["Firestore"] }
              : { generic: ["MongoDB"], gcp: ["Firestore"] },
        }
      case "graph":
        return {
          ...base,
          kind: "database",
          category: "Graph Database",
          why: "For relationship traversals (friends-of-friends, fraud rings, recommendations) where joins become expensive.",
          watchOut:
            "Operationally different than SQL/NoSQL; model carefully and benchmark traversals.",
          examples: {
            generic: ["Neo4j"],
            gcp: ["(often partner/self-managed)"],
          },
        }
      case "oltp":
      default: {
        const distributedSql = chooserScale === "global"
        return {
          ...base,
          kind: "database",
          category: distributedSql
            ? "Distributed SQL (OLTP at global scale)"
            : "Relational SQL (OLTP)",
          why: distributedSql
            ? "For strong consistency + multi-region writes/reads with SQL semantics."
            : "For transactions, constraints, and complex queries (joins) with strong correctness guarantees.",
          watchOut: distributedSql
            ? "More expensive/complex; validate latency and transactional contention."
            : "Scaling writes is harder than reads; plan replicas, caching, and careful indexing.",
          examples: distributedSql
            ? { generic: ["CockroachDB"], gcp: ["Spanner"] }
            : { generic: ["PostgreSQL", "MySQL"], gcp: ["Cloud SQL"] },
        }
      }
    }
  }, [chooserWorkload, chooserScale, chooserQuery])

  const capState = useMemo(() => {
    if (!capPartition) {
      return {
        consistency: true,
        availability: true,
        partitionTolerance: true,
        modeLabel: "No partition event",
      }
    }
    if (capPreference === "cp") {
      return {
        consistency: true,
        availability: false,
        partitionTolerance: true,
        modeLabel: "CP (favor consistency)",
      }
    }
    return {
      consistency: false,
      availability: true,
      partitionTolerance: true,
      modeLabel: "AP (favor availability)",
    }
  }, [capPartition, capPreference])

  // Generate meaningful (deterministic) sample data for sharding demo
  useEffect(() => {
    const makeRng = (seed) => {
      let s = seed
      return () => {
        s = (s * 1664525 + 1013904223) % 4294967296
        return s / 4294967296
      }
    }

    const rng = makeRng(sampleSeed)
    const regions = ["us-east", "us-west", "eu-west", "ap-south"]
    const now = Date.now()

    const makePoint = (id, userId, region, tsOffsetMs) => ({
      id,
      user_id: userId,
      region,
      timestamp: now - tsOffsetMs,
    })

    const size = 240
    const sampleData = Array.from({ length: size }, (_, index) => {
      if (shardDataset === "hot-keys") {
        // 20% of the keys receive ~80% of traffic (classic hotspot)
        const hot = rng() < 0.8
        const userId = hot
          ? Math.floor(rng() * 20)
          : 100 + Math.floor(rng() * 980)
        const region = regions[Math.floor(rng() * regions.length)]
        const tsOffset = Math.floor(rng() * 6 * 60 * 60 * 1000) // last 6 hours
        return makePoint(index, userId, region, tsOffset)
      }
      if (shardDataset === "regional-skew") {
        // Majority traffic from one region
        const region =
          rng() < 0.7 ? "us-east" : regions[Math.floor(rng() * regions.length)]
        const userId = Math.floor(rng() * 1000)
        const tsOffset = Math.floor(rng() * 24 * 60 * 60 * 1000)
        return makePoint(index, userId, region, tsOffset)
      }

      // uniform-ish
      const userId = (index * 37) % 1000
      const region = regions[index % regions.length]
      const tsOffset = (index % 3600) * 1000
      return makePoint(index, userId, region, tsOffset)
    })

    setDataPoints(sampleData)
  }, [sampleSeed, shardDataset])

  const shardDistribution = useMemo(() => {
    const distribution = Array(shardCount).fill(0)
    const regions = ["us-east", "us-west", "eu-west", "ap-south"]

    dataPoints.forEach((point) => {
      let shardIndex
      if (shardKey === "user_id") {
        shardIndex = point.user_id % shardCount
      } else if (shardKey === "region") {
        shardIndex = Math.max(0, regions.indexOf(point.region)) % shardCount
      } else {
        // timestamp
        shardIndex = Math.floor(point.timestamp / 1000) % shardCount
      }
      distribution[shardIndex]++
    })

    return distribution
  }, [dataPoints, shardCount, shardKey])

  const shardMax = useMemo(
    () => Math.max(1, ...shardDistribution),
    [shardDistribution]
  )
  const shardMin = useMemo(
    () => Math.min(...shardDistribution.map((v) => (v === 0 ? Infinity : v))),
    [shardDistribution]
  )
  const shardSkew = useMemo(() => {
    if (!isFinite(shardMin) || shardMin <= 0) return "High"
    const ratio = shardMax / shardMin
    if (ratio <= 1.25) return "Low"
    if (ratio <= 2) return "Medium"
    return "High"
  }, [shardMax, shardMin])

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-8")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    )

    sectionsReference.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const databaseTypes = [
    {
      name: "Relational (SQL)",
      icon: "🗄️",
      description: "ACID transactions, complex queries, strong consistency",
      examples: ["PostgreSQL", "MySQL", "SQL Server"],
      useCases: ["Financial systems", "E-commerce", "Business applications"],
      pros: ["ACID compliance", "Complex joins", "Mature ecosystem"],
      cons: ["Vertical scaling", "Schema rigidity", "Complex migrations"],
    },
    {
      name: "Document",
      icon: "📄",
      description: "Flexible schemas, nested data, horizontal scaling",
      examples: ["MongoDB", "DocumentDB", "CouchDB"],
      useCases: ["Content management", "User profiles", "Catalogs"],
      pros: ["Schema flexibility", "Horizontal scaling", "Rich queries"],
      cons: ["Eventual consistency", "Complex aggregations"],
    },
    {
      name: "Key-Value",
      icon: "🔑",
      description: "Simple lookups, high performance, distributed",
      examples: ["Redis", "DynamoDB", "Riak"],
      useCases: ["Caching", "Sessions", "Real-time analytics"],
      pros: ["Ultra-fast reads", "Simple operations", "Horizontal scaling"],
      cons: ["Limited querying", "No complex relationships"],
    },
    {
      name: "Wide-Column",
      icon: "📊",
      description: "High write throughput, flexible columns, distributed",
      examples: ["Cassandra", "Bigtable", "HBase"],
      useCases: ["Time-series data", "IoT", "Analytics"],
      pros: ["High write throughput", "Flexible schemas", "Fault tolerant"],
      cons: ["Complex queries", "Learning curve"],
    },
    {
      name: "Graph",
      icon: "🕸️",
      description: "Connected data, relationship queries, pattern matching",
      examples: ["Neo4j", "Neptune", "JanusGraph"],
      useCases: ["Social networks", "Fraud detection", "Recommendations"],
      pros: ["Relationship queries", "Pattern matching", "Flexible schemas"],
      cons: ["Complex setup", "Limited horizontal scaling"],
    },
  ]

  const cachingPatterns = [
    {
      name: "Cache-Aside",
      description: "Application checks cache first, loads from DB on miss",
      pros: ["Simple to implement", "Cache failures don't break app"],
      cons: ["Cache stampede possible", "Stale data risk"],
      useCase: "Read-heavy applications",
    },
    {
      name: "Write-Through",
      description: "Write to cache and DB simultaneously",
      pros: ["Strong consistency", "No stale data"],
      cons: ["Higher write latency", "Cache failures affect writes"],
      useCase: "Strong consistency requirements",
    },
    {
      name: "Write-Back",
      description: "Write to cache first, flush to DB asynchronously",
      pros: ["High write performance", "Better throughput"],
      cons: ["Data loss risk", "Complex error handling"],
      useCase: "Write-heavy workloads",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative gradient-overlay py-20 md:py-32 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <span className="text-sm font-medium text-purple-700">
                Module 3
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Data Architecture &{" "}
              <span className="text-gradient">Storage Choices</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 mx-auto">
              Master the art of choosing the right database and storage
              patterns. Learn when to use SQL vs NoSQL, caching strategies,
              sharding techniques, and compliance considerations for modern
              applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => nav("/")} className="btn-secondary">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* ============================================ */}
        {/* SECTION 1: Database Selection Guide */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[0] = element)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">
                  01
                </span>
                DATABASE SELECTION
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Choose Storage or Database (and which one)
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              The fastest way to get unstuck is to start with the workload
              (transactions vs analytics vs time-series vs cache vs files) and
              then refine based on scale and query patterns.
            </p>
          </div>

          {/* Interactive Storage/DB Chooser */}
          <div className=" from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">
              🧭 Storage / Database Chooser
            </h3>
            <p className="text-slate-700 mb-6">
              Pick the workload first, then refine scale and query needs. The
              goal is a good default choice you can justify, not a perfect
              answer.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Primary Workload
                </label>
                <select
                  value={chooserWorkload}
                  onChange={(e) => setChooserWorkload(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="oltp">
                    Transactions / OLTP (orders, users, payments)
                  </option>
                  <option value="nosql">
                    Flexible JSON / documents (profiles, catalogs)
                  </option>
                  <option value="cache">
                    Cache / sessions / rate limiting
                  </option>
                  <option value="timeseries">
                    Time-series (metrics, IoT, events over time)
                  </option>
                  <option value="widecolumn">
                    Wide-column at scale (Bigtable-like)
                  </option>
                  <option value="olap">
                    Analytics / Warehouse (BI, dashboards, scans)
                  </option>
                  <option value="search">
                    Search / logs (full-text, fuzzy)
                  </option>
                  <option value="files">Files / media / backups</option>
                  <option value="graph">Graph relationships</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Scale & Distribution
                </label>
                <select
                  value={chooserScale}
                  onChange={(e) => setChooserScale(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="single-region">
                    Single region / moderate scale
                  </option>
                  <option value="horizontal">
                    Horizontal scale in one region
                  </option>
                  <option value="global">
                    Multi-region / global distribution
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Query Pattern
                </label>
                <select
                  value={chooserQuery}
                  onChange={(e) => setChooserQuery(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="joins">
                    Joins + transactions + constraints
                  </option>
                  <option value="key">Simple key lookups (get by id)</option>
                  <option value="aggregations">
                    Aggregations / time-window queries
                  </option>
                </select>
              </div>
            </div>

            {/* Recommendation Result */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <h4 className="text-xl font-bold text-purple-900 mb-4">
                🎯 Recommended: {chooserRecommendation.category}
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">
                    Examples:
                  </h5>
                  <ul className="space-y-1">
                    {chooserRecommendation.examples.generic.map(
                      (example, index) => (
                        <li key={index} className="text-slate-700">
                          • {example}
                        </li>
                      )
                    )}
                  </ul>
                  <div className="mt-3 text-xs text-slate-500">
                    <span className="font-semibold">GCP equivalent:</span>{" "}
                    {chooserRecommendation.examples.gcp.length > 0
                      ? chooserRecommendation.examples.gcp.join(", ")
                      : "Varies / self-managed"}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">
                    What to watch out for:
                  </h5>
                  <p className="text-slate-700 text-sm">
                    {chooserRecommendation.watchOut}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  <strong>Why:</strong> {chooserRecommendation.why}
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Output type:{" "}
                  <span className="font-semibold">
                    {chooserRecommendation.kind}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Database Types Comparison */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {databaseTypes.map((database, index) => (
              <div
                key={index}
                className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300"
              >
                <div className="text-4xl mb-4">{database.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {database.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  {database.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Examples:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {database.examples.map((example, index_) => (
                      <span
                        key={index_}
                        className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Use Cases:
                  </h4>
                  <ul className="space-y-1">
                    {database.useCases.map((useCase, index_) => (
                      <li key={index_} className="text-slate-600 text-sm">
                        • {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <h5 className="font-semibold text-green-700 mb-1">Pros:</h5>
                    <ul>
                      {database.pros.map((pro, index_) => (
                        <li key={index_} className="text-slate-600">
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-700 mb-1">Cons:</h5>
                    <ul>
                      {database.cons.map((con, index_) => (
                        <li key={index_} className="text-slate-600">
                          • {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 2: Storage Models Deep Dive */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[1] = element)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  02
                </span>
                STORAGE MODELS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Storage Models & When to Pick Them
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Each storage model is optimized for specific data structures and
              access patterns. Choosing the right one reduces complexity and
              improves performance.
            </p>
          </div>

          {/* Storage Model Cards */}
          <div className="space-y-8">
            {/* Key-Value Stores */}
            <div className="border-2 border-green-200 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="text-5xl">🔑</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-green-900 mb-4">
                    Key-Value Stores
                  </h3>
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Simple, fast lookups with horizontal scaling. Perfect for
                    caching, sessions, and real-time analytics where you need
                    sub-millisecond reads.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">
                        When to Use:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Session management</li>
                        <li>• User preferences</li>
                        <li>• Real-time leaderboards</li>
                        <li>• Rate limiting counters</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">
                        Examples:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Redis (in-memory)</li>
                        <li>• DynamoDB (distributed)</li>
                        <li>• Riak KV</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">
                        Trade-offs:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Limited querying</li>
                        <li>• No complex relationships</li>
                        <li>• Memory/disk costs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Databases */}
            <div className="border-2 border-blue-200 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="text-5xl">📄</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-blue-900 mb-4">
                    Document Databases
                  </h3>
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Flexible schemas with nested data structures. Ideal for
                    content management, user profiles, and applications where
                    data structure evolves frequently.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">
                        When to Use:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Evolving schemas</li>
                        <li>• Nested/hierarchical data</li>
                        <li>• Content management</li>
                        <li>• Product catalogs</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Examples:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• MongoDB</li>
                        <li>• DocumentDB</li>
                        <li>• CouchDB</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Trade-offs:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Complex aggregations slower</li>
                        <li>• Eventual consistency</li>
                        <li>• Schema migration challenges</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wide-Column Stores */}
            <div className="border-2 border-purple-200 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="text-5xl">📊</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-purple-900 mb-4">
                    Wide-Column Stores
                  </h3>
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    High write throughput with flexible column structures.
                    Perfect for time-series data, IoT sensor readings, and
                    analytical workloads requiring massive scale.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">
                        When to Use:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Time-series data</li>
                        <li>• IoT sensor data</li>
                        <li>• Analytics workloads</li>
                        <li>• High write volumes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Examples:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Apache Cassandra</li>
                        <li>• Bigtable</li>
                        <li>• HBase</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Trade-offs:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Complex queries</li>
                        <li>• Learning curve</li>
                        <li>• Limited transactions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graph Databases */}
            <div className="border-2 border-orange-200 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="text-5xl">🕸️</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-orange-900 mb-4">
                    Graph Databases
                  </h3>
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Designed for highly connected data and complex
                    relationships. Excel at fraud detection, social networks,
                    and recommendation engines where relationships matter most.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">
                        When to Use:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Social networks</li>
                        <li>• Fraud detection</li>
                        <li>• Recommendation engines</li>
                        <li>• Knowledge graphs</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">
                        Examples:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Neo4j</li>
                        <li>• Neptune</li>
                        <li>• JanusGraph</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">
                        Trade-offs:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Complex setup</li>
                        <li>• Limited horizontal scaling</li>
                        <li>• Not for simple lookups</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Object Storage */}
            <div className="border-2 border-teal-200 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="text-5xl">📦</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-teal-900 mb-4">
                    Object Storage
                  </h3>
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Cheap, durable storage for large files and unstructured
                    data. Perfect for media assets, backups, and data lakes
                    where low cost and high durability matter more than speed.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-teal-800 mb-2">
                        When to Use:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Media files (images/videos)</li>
                        <li>• Backups and archives</li>
                        <li>• Data lakes</li>
                        <li>• Static website hosting</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-800 mb-2">
                        Examples:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• S3</li>
                        <li>• Cloud Storage</li>
                        <li>• Blob Storage</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-800 mb-2">
                        Trade-offs:
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Higher latency</li>
                        <li>• No complex queries</li>
                        <li>• Eventual consistency</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 3: Operational Patterns */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[2] = element)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center text-sm">
                  03
                </span>
                OPERATIONAL PATTERNS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Replication, Sharding & Scaling Patterns
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Single-server databases become bottlenecks. Learn how to scale
              beyond one machine while maintaining performance and reliability.
            </p>
          </div>

          {/* Replication Patterns */}
          <div className=" border-2 border-green-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-green-900 mb-6">
              🔄 Replication Strategies
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                <h4 className="text-xl font-bold text-green-800 mb-3">
                  Leader-Follower
                </h4>
                <p className="text-slate-700 mb-4">
                  One primary (leader) handles writes, multiple secondaries
                  (followers) handle reads. Simplest replication pattern for
                  read scaling.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Consistency:</span>
                    <span className="text-sm text-slate-600">Eventual</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Failover:</span>
                    <span className="text-sm text-slate-600">
                      Manual/Automated
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Use Case:</span>
                    <span className="text-sm text-slate-600">
                      Read-heavy apps
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                <h4 className="text-xl font-bold text-green-800 mb-3">
                  Multi-Leader
                </h4>
                <p className="text-slate-700 mb-4">
                  Multiple nodes accept writes. Requires conflict resolution for
                  concurrent updates. Complex but allows writes at multiple
                  locations.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Consistency:</span>
                    <span className="text-sm text-slate-600">
                      Eventual (with conflicts)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Failover:</span>
                    <span className="text-sm text-slate-600">Automatic</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Use Case:</span>
                    <span className="text-sm text-slate-600">
                      Multi-region apps
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                <h4 className="text-xl font-bold text-green-800 mb-3">
                  Leaderless/Quorum
                </h4>
                <p className="text-slate-700 mb-4">
                  All nodes are equal. Uses quorum (majority) for reads/writes.
                  Tunable consistency with R + W &gt; N formula.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Consistency:</span>
                    <span className="text-sm text-slate-600">Tunable</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Failover:</span>
                    <span className="text-sm text-slate-600">Automatic</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Use Case:</span>
                    <span className="text-sm text-slate-600">
                      High availability
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sharding Demo */}
          <div className=" border-2 border-blue-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">
              🧩 Sharding Calculator
            </h3>
            <p className="text-slate-700 mb-6">
              See how different shard keys affect data distribution. Poor shard
              key choices lead to hot shards!
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Shard Key
                  </label>
                  <select
                    value={shardKey}
                    onChange={(event) => setShardKey(event.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user_id">User ID (good distribution)</option>
                    <option value="region">Region (hot shard risk)</option>
                    <option value="timestamp">
                      Timestamp (sequential writes)
                    </option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Data Shape
                  </label>
                  <select
                    value={shardDataset}
                    onChange={(event) => setShardDataset(event.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="uniform">Uniform traffic</option>
                    <option value="hot-keys">Hot keys (80/20 hotspot)</option>
                    <option value="regional-skew">
                      Regional skew (one region dominates)
                    </option>
                  </select>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-600">
                      Skew estimate:{" "}
                      <span className="font-semibold">{shardSkew}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSampleSeed((s) => s + 1)}
                      className="text-xs font-semibold px-3 py-1 rounded-md border border-blue-200 bg-white hover:bg-blue-50"
                    >
                      Regenerate sample
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Shards: {shardCount}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={shardCount}
                    onChange={(event) =>
                      setShardCount(parseInt(event.target.value))
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Shard Distribution:
                  </h4>
                  <div className="space-y-2">
                    {shardDistribution.map((count, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-12">
                          Shard {index}:
                        </span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(count / shardMax) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 w-8">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                <h4 className="text-lg font-bold text-blue-900 mb-4">
                  {shardKey === "user_id"
                    ? "✅ Good Choice"
                    : "⚠️ Potential Issues"}
                </h4>
                <div className="space-y-3">
                  {shardKey === "user_id" && (
                    <>
                      <p className="text-slate-700">
                        <strong>User ID</strong> provides excellent distribution
                        because user IDs are typically random or sequential
                        across a large range.
                      </p>
                      <ul className="space-y-1 text-slate-600">
                        <li>• Even load distribution</li>
                        <li>• Scales well as users grow</li>
                        <li>• Easy to route queries</li>
                      </ul>
                    </>
                  )}
                  {shardKey === "region" && (
                    <>
                      <p className="text-slate-700">
                        <strong>Region</strong> can create hot shards if some
                        regions have much more data than others.
                      </p>
                      <ul className="space-y-1 text-slate-600">
                        <li>• Uneven load distribution</li>
                        <li>• Some shards overwhelmed</li>
                        <li>• Difficult rebalancing</li>
                      </ul>
                    </>
                  )}
                  {shardKey === "timestamp" && (
                    <>
                      <p className="text-slate-700">
                        <strong>Timestamp</strong> causes all recent writes to
                        go to the same shard (hot shard problem).
                      </p>
                      <ul className="space-y-1 text-slate-600">
                        <li>• Sequential writes to one shard</li>
                        <li>• Poor read distribution</li>
                        <li>• Requires frequent rebalancing</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 4: Caching Patterns */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[3] = element)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center text-sm">
                  04
                </span>
                CACHING PATTERNS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Caching Strategies & Patterns
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Database queries are expensive. Caching reduces latency from
              hundreds of milliseconds to microseconds and decreases database
              load.
            </p>
          </div>

          {/* Caching Pattern Comparison */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {cachingPatterns.map((pattern, index) => (
              <div
                key={index}
                className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                  cachePattern === pattern.name.toLowerCase().replace(" ", "-")
                    ? "border-orange-400 bg-orange-50"
                    : "border-slate-200 bg-white hover:border-orange-300"
                }`}
                onClick={() =>
                  setCachePattern(pattern.name.toLowerCase().replace(" ", "-"))
                }
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {pattern.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  {pattern.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-green-700 text-sm mb-1">
                      Pros:
                    </h4>
                    <ul className="space-y-1">
                      {pattern.pros.map((pro, index_) => (
                        <li key={index_} className="text-slate-600 text-xs">
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 text-sm mb-1">
                      Cons:
                    </h4>
                    <ul className="space-y-1">
                      {pattern.cons.map((con, index_) => (
                        <li key={index_} className="text-slate-600 text-xs">
                          • {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 text-sm mb-1">
                      Best For:
                    </h4>
                    <p className="text-slate-600 text-xs">{pattern.useCase}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cache Pattern Visualizer */}
          <div className=" border-2 border-orange-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-orange-900 mb-6">
              🔄 Cache Pattern Simulator
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    {cachePattern === "cache-aside" && "Cache-Aside Pattern"}
                    {cachePattern === "write-through" &&
                      "Write-Through Pattern"}
                    {cachePattern === "write-back" && "Write-Back Pattern"}
                  </h4>

                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          Client Request
                        </div>
                        <div className="text-xs text-slate-600">
                          Read user profile
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {cachePattern === "cache-aside" && (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center text-sm">
                              🔍
                            </div>
                            <span className="text-sm">Check cache first</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-sm">
                              ❌
                            </div>
                            <span className="text-sm">
                              Cache miss - query database
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-sm">
                              💾
                            </div>
                            <span className="text-sm">
                              Store result in cache
                            </span>
                          </div>
                        </>
                      )}

                      {cachePattern === "write-through" && (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm">
                              ✏️
                            </div>
                            <span className="text-sm">Write to cache</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm">
                              💾
                            </div>
                            <span className="text-sm">
                              Write to database simultaneously
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-sm">
                              ✅
                            </div>
                            <span className="text-sm">
                              Strong consistency guaranteed
                            </span>
                          </div>
                        </>
                      )}

                      {cachePattern === "write-back" && (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm">
                              ✏️
                            </div>
                            <span className="text-sm">
                              Write to cache immediately
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center text-sm">
                              ⏰
                            </div>
                            <span className="text-sm">
                              Async flush to database later
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center text-sm">
                              ⚡
                            </div>
                            <span className="text-sm">
                              High write performance
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
                <h4 className="text-lg font-bold text-orange-900 mb-4">
                  Performance Characteristics
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Read Latency</span>
                      <span className="text-sm text-slate-600">
                        {cachePattern === "cache-aside"
                          ? "~1ms (cache hit)"
                          : "~1ms"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Write Latency</span>
                      <span className="text-sm text-slate-600">
                        {cachePattern === "write-back" ? "~1ms" : "~10ms"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: cachePattern === "write-back" ? "10%" : "50%",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Consistency</span>
                      <span className="text-sm text-slate-600">
                        {cachePattern === "write-through"
                          ? "Strong"
                          : "Eventual"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width:
                            cachePattern === "write-through" ? "90%" : "60%",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Complexity</span>
                      <span className="text-sm text-slate-600">Low</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 5: CAP Theorem & Consistency */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[4] = element)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-sm">
                  05
                </span>
                CAP THEOREM
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              CAP Theorem & Consistency Trade-offs
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              In distributed systems, you can only guarantee two out of three:
              Consistency, Availability, and Partition Tolerance. Understanding
              this fundamental trade-off is crucial for choosing the right
              database.
            </p>
          </div>

          {/* CAP Theorem Interactive Demo */}
          <div className=" border-2 border-red-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-red-900 mb-6">
              ⚖️ CAP Theorem Visualizer
            </h3>
            <p className="text-slate-700 mb-6">
              Toggle network partitions and see how it affects consistency and
              availability. You can only have two of the three properties!
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border-2 border-red-200">
                  <h4 className="text-lg font-bold text-red-900 mb-4">
                    Network Conditions
                  </h4>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={capPartition}
                        onChange={(event) =>
                          setCapPartition(event.target.checked)
                        }
                        className="w-4 h-4 text-red-600 bg-slate-100 border-slate-300 rounded focus:ring-red-500"
                      />
                      <span className="text-slate-700">Network Partition</span>
                    </label>
                  </div>

                  {capPartition && (
                    <div className="mt-4">
                      <div className="text-sm font-semibold text-slate-900 mb-2">
                        When partition happens, choose:
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCapPreference("cp")}
                          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                            capPreference === "cp"
                              ? "bg-green-600 text-white border-green-600"
                              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          CP (Consistency)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCapPreference("ap")}
                          className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                            capPreference === "ap"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          AP (Availability)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-red-200">
                  <h4 className="text-lg font-bold text-red-900 mb-4">
                    CAP Properties
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">
                          Consistency
                        </div>
                        <div className="text-sm text-slate-600">
                          All nodes see same data
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full ${capState.consistency ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">
                          Availability
                        </div>
                        <div className="text-sm text-slate-600">
                          System responds to requests
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full ${capState.availability ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">
                          Partition Tolerance
                        </div>
                        <div className="text-sm text-slate-600">
                          Works despite network splits
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full ${capState.partitionTolerance ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-red-200">
                <h4 className="text-lg font-bold text-red-900 mb-4">
                  {capPartition
                    ? `Partition Present — ${capState.modeLabel}`
                    : "No Partition — CAP conflict not triggered"}
                </h4>

                {!capPartition ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-slate-700">
                      When there is no partition, you can run a system that is
                      both consistent and available. The trade-off becomes real
                      when partitions happen (and they will).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`p-4 border-2 rounded-lg ${
                        capPreference === "cp"
                          ? "border-green-300 bg-green-50"
                          : "border-green-200 bg-white"
                      }`}
                    >
                      <h5 className="font-semibold text-green-800 mb-2">
                        CP Systems (Consistency + Partition Tolerance)
                      </h5>
                      <p className="text-sm text-slate-700 mb-2">
                        Prioritize consistency over availability. When
                        partitions occur, some nodes become unavailable to
                        maintain consistency.
                      </p>
                      <div className="text-xs text-green-700 font-medium">
                        Examples: Spanner, HBase, ZooKeeper (CP-ish defaults)
                      </div>
                    </div>

                    <div
                      className={`p-4 border-2 rounded-lg ${
                        capPreference === "ap"
                          ? "border-blue-300 bg-blue-50"
                          : "border-blue-200 bg-white"
                      }`}
                    >
                      <h5 className="font-semibold text-blue-800 mb-2">
                        AP Systems (Availability + Partition Tolerance)
                      </h5>
                      <p className="text-sm text-slate-700 mb-2">
                        Prioritize availability over consistency. All nodes
                        remain responsive, but data may be temporarily
                        inconsistent.
                      </p>
                      <div className="text-xs text-blue-700 font-medium">
                        Examples: Cassandra, DynamoDB, CouchDB
                      </div>
                    </div>

                    <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                      <h5 className="font-semibold text-gray-800 mb-2">
                        CA Systems (Consistency + Availability)
                      </h5>
                      <p className="text-sm text-slate-700 mb-2">
                        Only possible without partitions. Single-node databases
                        or tightly coupled systems.
                      </p>
                      <div className="text-xs text-gray-700 font-medium">
                        Examples: Single MySQL instance
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACID vs BASE */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className=" border-2 border-blue-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                🔒 ACID (Atomicity, Consistency, Isolation, Durability)
              </h3>
              <p className="text-slate-700 mb-4">
                Traditional relational database guarantees. Strong consistency
                but harder to scale.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-bold text-blue-700">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Atomicity</div>
                    <div className="text-sm text-slate-600">
                      All operations succeed or all fail
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-bold text-blue-700">
                    C
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">
                      Consistency
                    </div>
                    <div className="text-sm text-slate-600">
                      Data remains valid after operations
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-bold text-blue-700">
                    I
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Isolation</div>
                    <div className="text-sm text-slate-600">
                      Concurrent operations don't interfere
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-bold text-blue-700">
                    D
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">
                      Durability
                    </div>
                    <div className="text-sm text-slate-600">
                      Committed data survives failures
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Best for: Financial systems, e-commerce, any system requiring
                  strong guarantees
                </p>
              </div>
            </div>

            <div className="border-2 border-green-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-900 mb-6">
                🌊 BASE (Basically Available, Soft State, Eventual Consistency)
              </h3>
              <p className="text-slate-700 mb-4">
                Modern distributed system approach. Sacrifices some consistency
                for availability and scale.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-sm font-bold text-green-700">
                    BA
                  </div>
                  <div>
                    <div className="font-semibold text-green-900">
                      Basically Available
                    </div>
                    <div className="text-sm text-slate-600">
                      System works even during failures
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-sm font-bold text-green-700">
                    SS
                  </div>
                  <div>
                    <div className="font-semibold text-green-900">
                      Soft State
                    </div>
                    <div className="text-sm text-slate-600">
                      State can change over time
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-sm font-bold text-green-700">
                    EC
                  </div>
                  <div>
                    <div className="font-semibold text-green-900">
                      Eventual Consistency
                    </div>
                    <div className="text-sm text-slate-600">
                      Data becomes consistent given time
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  Best for: Social media, content platforms, real-time analytics
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 6: Compliance & Security */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[5] = element)}
          className=" transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                  06
                </span>
                COMPLIANCE & SECURITY
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Data Lifecycle, Compliance & Encryption
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Regulatory requirements mandate specific data handling.
              Non-compliance results in fines and legal liability. Design data
              architecture with compliance from day one.
            </p>
          </div>

          {/* Compliance Requirements */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6">
              <div className="text-4xl mb-4">🇪🇺</div>
              <h3 className="text-xl font-bold text-indigo-900 mb-3">GDPR</h3>
              <p className="text-slate-700 text-sm mb-4">
                EU General Data Protection Regulation. Protects personal data of
                EU residents.
              </p>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>• Right to access personal data</li>
                <li>• Right to erasure ("right to be forgotten")</li>
                <li>• Data portability</li>
                <li>• Consent management</li>
              </ul>
            </div>

            <div className=" from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">HIPAA</h3>
              <p className="text-slate-700 text-sm mb-4">
                US Health Insurance Portability and Accountability Act. Protects
                health information.
              </p>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>• Protected Health Information (PHI)</li>
                <li>• Business Associate Agreements</li>
                <li>• Security Rule compliance</li>
                <li>• Breach notification</li>
              </ul>
            </div>

            <div className=" from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-green-900 mb-3">PCI DSS</h3>
              <p className="text-slate-700 text-sm mb-4">
                Payment Card Industry Data Security Standard. Protects
                cardholder data.
              </p>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>• Cardholder data encryption</li>
                <li>• Access control</li>
                <li>• Network security</li>
                <li>• Regular security testing</li>
              </ul>
            </div>
          </div>

          {/* Data Lifecycle Management */}
          <div className=" from-slate-50 to-gray-50 border-2 border-slate-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              🔄 Data Lifecycle Management
            </h3>

            <div className="grid md:grid-cols-5 gap-4 mb-6">
              {[
                {
                  stage: "Create",
                  desc: "Data generation/collection",
                  color: "bg-blue-500",
                },
                {
                  stage: "Store",
                  desc: "Initial storage and organization",
                  color: "bg-green-500",
                },
                {
                  stage: "Use",
                  desc: "Active processing and analysis",
                  color: "bg-purple-500",
                },
                {
                  stage: "Archive",
                  desc: "Long-term retention",
                  color: "bg-orange-500",
                },
                {
                  stage: "Destroy",
                  desc: "Secure deletion when no longer needed",
                  color: "bg-red-500",
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2`}
                  >
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {item.stage}
                  </h4>
                  <p className="text-xs text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
              <h4 className="text-lg font-bold text-slate-900 mb-4">
                Key Considerations:
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">
                    Technical Controls:
                  </h5>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Encryption at rest (AES-256)</li>
                    <li>• Encryption in transit (TLS 1.3)</li>
                    <li>• Access logging and monitoring</li>
                    <li>• Automated retention policies</li>
                    <li>• Secure deletion methods</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">
                    Operational Controls:
                  </h5>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Data classification frameworks</li>
                    <li>• Regular compliance audits</li>
                    <li>• Incident response procedures</li>
                    <li>• Employee training programs</li>
                    <li>• Third-party risk assessments</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Encryption Strategies */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className=" from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-cyan-900 mb-6">
                🔐 Encryption at Rest
              </h3>
              <p className="text-slate-700 mb-4">
                Protects data stored on disk or in backups. Should be
                transparent to applications.
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-cyan-900 mb-2">
                    Database-Level Encryption
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Transparent Data Encryption (TDE)</li>
                    <li>• Column-level encryption</li>
                    <li>• Key management integration</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-cyan-900 mb-2">
                    Infrastructure-Level
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• Disk encryption (LUKS, BitLocker)</li>
                    <li>• Cloud KMS integration</li>
                    <li>• Hardware Security Modules (HSM)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className=" from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-emerald-900 mb-6">
                🌐 Encryption in Transit
              </h3>
              <p className="text-slate-700 mb-4">
                Protects data moving between systems. TLS is the standard for
                web applications.
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-emerald-900 mb-2">
                    TLS/SSL Configuration
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• TLS 1.3 for best security</li>
                    <li>• Perfect Forward Secrecy (PFS)</li>
                    <li>• Certificate pinning</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-emerald-900 mb-2">
                    Database Connections
                  </h4>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    <li>• SSL/TLS for client connections</li>
                    <li>• Certificate-based authentication</li>
                    <li>• VPN for internal networks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: ACID vs BASE */}
        <section
          className="section-base-animation"
          ref={(element) => (sectionsReference.current[6] = element)}
        >
          <AcidVsBase />
        </section>

        {/* Section 7: Database Indexing Deep Dive */}
        <section
          className="section-base-animation"
          ref={(element) => (sectionsReference.current[7] = element)}
        >
          <DatabaseIndexingDeepDive />
        </section>

        {/* Section 8: OLTP vs OLAP Expanded */}
        <section
          className="section-base-animation"
          ref={(element) => (sectionsReference.current[8] = element)}
        >
          <OltpVsOlapExpanded />
        </section>

        {/* Section 9: Read Replicas & Replication */}
        <section
          className="section-base-animation"
          ref={(element) => (sectionsReference.current[9] = element)}
        >
          <ReadReplicasReplication />
        </section>

        {/* Navigation */}
        <section
          className="py-6"
          ref={(element) => (sectionsReference.current[10] = element)}
        >
          <div className="flex justify-between items-center">
            <button
              onClick={() => nav("/networking")}
              className="btn-secondary"
            >
              ← Previous: Networking
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => nav("/")} className="btn-tertiary">
                Home
              </button>
              <button
                onClick={() => nav("/compute-runtime")}
                className="btn-primary"
              >
                Next: Compute Runtime →
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
