import { useState } from "react"
import { Globe, RefreshCw, Zap, Server, Shield, Cloud, CheckCircle, XCircle, ArrowRight, AlertTriangle } from "lucide-react"

export default function CdnAdvancedStrategies() {
  const [selectedStrategy, setSelectedStrategy] = useState("invalidation")
  const [cdnModel, setCdnModel] = useState("pull")
  const [multiCdnApproach, setMultiCdnApproach] = useState("failover")

  const strategies = {
    invalidation: {
      title: "CDN Cache Invalidation",
      icon: RefreshCw,
      color: "blue",
      problem: "How to update cached content when origin changes?",
      approaches: [
        {
          name: "Time-based (TTL)",
          desc: "Set Cache-Control max-age header, content expires automatically",
          pros: ["Simple to implement", "No manual intervention", "Predictable behavior"],
          cons: ["Users may see stale content", "Can't force immediate updates", "Wasted cache space"],
          when: "Static assets that rarely change, or tolerance for slight staleness",
          example: "Cache-Control: max-age=86400  // 24 hours",
        },
        {
          name: "Purge/Invalidate API",
          desc: "Manually tell CDN to remove specific URLs or patterns",
          pros: ["Immediate updates", "Precise control", "Clear cached content instantly"],
          cons: ["Requires API integration", "Can be expensive", "May cause origin surge"],
          when: "Critical updates that must propagate immediately",
          example: "curl -X PURGE https://cdn.example.com/app.js",
        },
        {
          name: "Cache Busting (Versioning)",
          desc: "Change filename/URL when content changes",
          pros: ["No purge needed", "Instant updates", "Old versions still cached", "Free"],
          cons: ["Requires build process", "URL changes in HTML", "More storage used"],
          when: "Best practice for static assets in production",
          example: "app.v2.js, app.js?v=abc123, app-abc123.js",
        },
        {
          name: "Stale-While-Revalidate",
          desc: "Serve stale content while fetching fresh copy in background",
          pros: ["Always fast response", "Automatic updates", "No downtime"],
          cons: ["Users may see old content briefly", "More complex caching logic"],
          when: "Good balance between freshness and performance",
          example: "Cache-Control: max-age=60, stale-while-revalidate=86400",
        },
      ],
    },
    pullVsPush: {
      title: "Pull vs Push CDN Models",
      icon: Globe,
      color: "purple",
      problem: "How does content get to CDN edge locations?",
      approaches: [
        {
          name: "Pull CDN (Origin Pull)",
          desc: "CDN fetches content from origin when first requested",
          pros: [
            "Easy setup - just point to origin",
            "Automatic caching",
            "Only popular content cached",
            "No pre-upload needed",
          ],
          cons: ["First request is slow (cache miss)", "Origin must handle edge requests", "Unpredictable origin load"],
          when: "Dynamic content, user-generated content, websites",
          example: "Netflix, YouTube videos - content pulled on first view",
        },
        {
          name: "Push CDN",
          desc: "You manually upload content to CDN edge locations",
          pros: [
            "No origin requests after upload",
            "Predictable performance (no cold starts)",
            "Full control over what's cached",
          ],
          cons: ["Manual upload process", "Storage costs", "Must push updates", "Harder to manage"],
          when: "Large files, software downloads, known popular content",
          example: "OS updates, game patches - pushed to CDN in advance",
        },
      ],
    },
    multiCdn: {
      title: "Multi-CDN Strategy",
      icon: Cloud,
      color: "emerald",
      problem: "Why use multiple CDN providers?",
      approaches: [
        {
          name: "Failover (Backup)",
          desc: "Use secondary CDN if primary fails",
          pros: ["High availability", "Redundancy", "Automatic failover"],
          cons: ["Secondary CDN mostly idle", "DNS switching delay", "Extra cost"],
          when: "Mission-critical applications requiring 99.99%+ uptime",
          example: "If Cloudflare down, switch to Fastly via DNS",
        },
        {
          name: "Geographic Split",
          desc: "Different CDNs for different regions",
          pros: [
            "Best regional performance",
            "Optimize cost per region",
            "Regulatory compliance (data residency)",
          ],
          cons: ["Complex DNS setup", "Harder to monitor", "Multiple bills"],
          when: "Global applications with regional requirements",
          example: "Cloudflare for US/EU, Alibaba Cloud CDN for China",
        },
        {
          name: "Load Balancing (Active-Active)",
          desc: "Distribute traffic across multiple CDNs simultaneously",
          pros: ["Maximum performance", "No single point of failure", "Cost optimization through competition"],
          cons: ["Most complex", "Cache duplication", "Highest cost"],
          when: "Ultra-high traffic sites (100M+ requests/day)",
          example: "50% traffic to Cloudflare, 50% to Fastly",
        },
        {
          name: "Content-Type Split",
          desc: "Different CDNs for different content types",
          pros: ["Optimize per content type", "Specialized features", "Cost control"],
          cons: ["More DNS records", "Harder to debug", "Cookie issues"],
          when: "Distinct content types with different needs",
          example: "Cloudflare for HTML/API, Cloudinary for images/video",
        },
      ],
    },
    edgeComputing: {
      title: "Edge Computing & Functions",
      icon: Zap,
      color: "orange",
      problem: "Running code at CDN edge, not just caching static files",
      approaches: [
        {
          name: "Edge Functions/Workers",
          desc: "Run JavaScript/WASM at edge locations",
          pros: ["Ultra-low latency", "No origin needed", "Global scale", "Dynamic logic at edge"],
          cons: ["Limited runtime", "Cold start delays", "Debugging harder", "Cost can add up"],
          when: "A/B testing, auth, redirects, simple API endpoints",
          example: "Cloudflare Workers, Vercel Edge Functions, Fastly Compute@Edge",
        },
        {
          name: "Edge Side Includes (ESI)",
          desc: "Compose pages from multiple cached fragments",
          pros: ["Cache parts of page separately", "Personalization", "Reduce origin load"],
          cons: ["Complex to debug", "Not all CDNs support", "Harder to reason about"],
          when: "Pages with mix of static/dynamic content",
          example: "Cache navbar for 1 day, user widget for 1 minute",
        },
        {
          name: "Edge Key-Value Storage",
          desc: "Store data at edge (like Redis, but distributed globally)",
          pros: ["Global low-latency reads", "No origin database needed", "Fast writes propagate"],
          cons: ["Eventually consistent", "Limited storage", "Cost per request"],
          when: "Feature flags, A/B test configs, user preferences",
          example: "Cloudflare KV, Fastly Edge Dictionaries",
        },
        {
          name: "Image Optimization at Edge",
          desc: "Resize, compress, convert images on-the-fly",
          pros: ["Single source image", "Format negotiation (WebP, AVIF)", "Responsive images easy"],
          cons: ["Processing cost", "Cache fragmentation", "Quality trade-offs"],
          when: "User-generated images, responsive design",
          example: "Cloudflare Images, Cloudinary, imgix",
        },
      ],
    },
  }

  const pullVsPushComparison = [
    {
      aspect: "Setup Complexity",
      pull: "Very Easy - just DNS change",
      push: "Complex - upload pipeline needed",
      winner: "pull",
    },
    {
      aspect: "First Request Speed",
      pull: "Slow (cache miss)",
      push: "Fast (pre-warmed)",
      winner: "push",
    },
    {
      aspect: "Origin Load",
      pull: "Higher (cache misses)",
      push: "Lower (no origin requests)",
      winner: "push",
    },
    {
      aspect: "Storage Cost",
      pull: "Lower (cache popular only)",
      push: "Higher (store everything)",
      winner: "pull",
    },
    {
      aspect: "Content Updates",
      pull: "Automatic (TTL expires)",
      push: "Manual (re-upload)",
      winner: "pull",
    },
    {
      aspect: "Best For",
      pull: "Websites, APIs, UGC",
      push: "Downloads, Packages",
      winner: "depends",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Strategy Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Advanced CDN Strategies</h3>
        <p className="text-slate-600 mb-6">Beyond basic caching - production-grade CDN patterns</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(strategies).map(([key, strategy]) => {
            const Icon = strategy.icon
            return (
              <button
                key={key}
                onClick={() => setSelectedStrategy(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedStrategy === key
                    ? `border-${strategy.color}-500 bg-${strategy.color}-50 shadow-lg`
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <Icon
                  className={`w-6 h-6 mx-auto mb-2 ${
                    selectedStrategy === key ? `text-${strategy.color}-600` : "text-slate-400"
                  }`}
                />
                <p className="text-sm font-semibold text-slate-900 text-center">{strategy.title.split(" ")[0]}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Strategy Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-3 mb-4">
          {(() => {
            const Icon = strategies[selectedStrategy].icon
            return <Icon className={`w-8 h-8 text-${strategies[selectedStrategy].color}-600`} />
          })()}
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{strategies[selectedStrategy].title}</h3>
            <p className="text-slate-600 mt-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              {strategies[selectedStrategy].problem}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {strategies[selectedStrategy].approaches.map((approach, index) => (
            <div
              key={index}
              className={`bg-${strategies[selectedStrategy].color}-50 border border-${strategies[selectedStrategy].color}-200 rounded-lg p-5`}
            >
              <h4 className="font-bold text-slate-900 mb-2">{approach.name}</h4>
              <p className="text-sm text-slate-700 mb-4">{approach.desc}</p>

              {approach.pros && approach.cons && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Pros:
                    </p>
                    <ul className="space-y-1">
                      {approach.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Cons:
                    </p>
                    <ul className="space-y-1">
                      {approach.cons.map((con, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg p-3 mb-2 border border-slate-200">
                <p className="text-xs font-medium text-slate-700 mb-1">When to use:</p>
                <p className="text-sm text-slate-900">{approach.when}</p>
              </div>

              {approach.example && (
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Example:</p>
                  <pre className="text-sm text-green-400 font-mono overflow-x-auto">{approach.example}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pull vs Push Comparison */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Globe className="w-6 h-6 text-purple-600" />
          Pull CDN vs Push CDN - Side by Side
        </h3>
        <p className="text-slate-600 mb-6">Understand the fundamental difference in how content gets cached</p>

        {/* Model Selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setCdnModel("pull")}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              cdnModel === "pull"
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="text-center">
              <ArrowRight className={`w-6 h-6 mx-auto mb-2 ${cdnModel === "pull" ? "text-blue-600" : "text-slate-400"}`} />
              <p className="font-bold text-slate-900">Pull CDN</p>
              <p className="text-xs text-slate-600 mt-1">Origin Pull (Lazy Loading)</p>
            </div>
          </button>
          <button
            onClick={() => setCdnModel("push")}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              cdnModel === "push"
                ? "border-purple-500 bg-purple-50 shadow-lg"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="text-center">
              <ArrowRight className={`w-6 h-6 mx-auto mb-2 rotate-180 ${cdnModel === "push" ? "text-purple-600" : "text-slate-400"}`} />
              <p className="font-bold text-slate-900">Push CDN</p>
              <p className="text-xs text-slate-600 mt-1">Pre-upload (Eager Loading)</p>
            </div>
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Aspect</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-700">Pull CDN</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Push CDN</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-900">Winner</th>
              </tr>
            </thead>
            <tbody>
              {pullVsPushComparison.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{item.aspect}</td>
                  <td className={`py-3 px-4 text-sm ${item.winner === "pull" ? "font-semibold text-blue-700" : "text-slate-600"}`}>
                    {item.pull}
                  </td>
                  <td className={`py-3 px-4 text-sm ${item.winner === "push" ? "font-semibold text-purple-700" : "text-slate-600"}`}>
                    {item.push}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.winner === "pull" && <span className="text-blue-600 font-bold">Pull</span>}
                    {item.winner === "push" && <span className="text-purple-600 font-bold">Push</span>}
                    {item.winner === "depends" && <span className="text-slate-400 text-xs">Context-dependent</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-CDN Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Cloud className="w-6 h-6 text-emerald-600" />
          Multi-CDN Architecture
        </h3>
        <p className="text-slate-600 mb-6">Using multiple CDN providers for reliability and performance</p>

        {/* Approach Selector */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          {strategies.multiCdn.approaches.map((approach, index) => (
            <button
              key={index}
              onClick={() => setMultiCdnApproach(approach.name.toLowerCase().split(" ")[0])}
              className={`p-3 rounded-lg border-2 transition-all ${
                multiCdnApproach === approach.name.toLowerCase().split(" ")[0]
                  ? "border-emerald-500 bg-emerald-50 shadow-lg"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900 text-center">{approach.name.split(" ")[0]}</p>
            </button>
          ))}
        </div>

        {/* Visual Diagram */}
        <div className=" from-emerald-50 to-blue-50 rounded-lg p-6 border border-emerald-200 mb-6">
          {multiCdnApproach === "failover" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                    <Server className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Primary CDN</p>
                  <p className="text-xs text-emerald-600">Active ✓</p>
                </div>
                <ArrowRight className="w-8 h-8 text-slate-400" />
                <div className="text-center opacity-50">
                  <div className="w-24 h-24 bg-slate-400 rounded-lg flex items-center justify-center mb-2">
                    <Server className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Secondary CDN</p>
                  <p className="text-xs text-slate-500">Standby</p>
                </div>
              </div>
              <p className="text-sm text-center text-slate-700">
                All traffic → Primary. If primary fails, DNS switches to Secondary.
              </p>
            </div>
          )}

          {multiCdnApproach === "geographic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">CDN A</p>
                  <p className="text-xs text-slate-600">US & Europe</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">CDN B</p>
                  <p className="text-xs text-slate-600">Asia Pacific</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">CDN C</p>
                  <p className="text-xs text-slate-600">China</p>
                </div>
              </div>
              <p className="text-sm text-center text-slate-700">
                GeoDNS routes users to best CDN for their region
              </p>
            </div>
          )}

          {multiCdnApproach === "load" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                    <Server className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">CDN A</p>
                  <p className="text-xs text-emerald-600">50% traffic</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                    <Server className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">CDN B</p>
                  <p className="text-xs text-emerald-600">50% traffic</p>
                </div>
              </div>
              <p className="text-sm text-center text-slate-700">
                Traffic split evenly across both CDNs - maximum redundancy
              </p>
            </div>
          )}

          {multiCdnApproach === "content-type" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Server className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">CDN A</p>
                  <p className="text-xs text-slate-600">HTML, CSS, JS</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">CDN B</p>
                  <p className="text-xs text-slate-600">Images & Video</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">CDN C</p>
                  <p className="text-xs text-slate-600">API Responses</p>
                </div>
              </div>
              <p className="text-sm text-center text-slate-700">
                Different CDNs optimized for different content types
              </p>
            </div>
          )}
        </div>

        {/* Selected Approach Details */}
        {strategies.multiCdn.approaches
          .filter((a) => a.name.toLowerCase().startsWith(multiCdnApproach))
          .map((approach, index) => (
            <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <h4 className="font-bold text-emerald-900 mb-3">{approach.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Advantages:
                  </p>
                  <ul className="space-y-1">
                    {approach.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Challenges:
                  </p>
                  <ul className="space-y-1">
                    {approach.cons.map((con, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-medium text-slate-700 mb-1">Example:</p>
                <p className="text-sm text-slate-900">{approach.example}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Interview Tips */}
      <div className=" from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Interview Tips: Advanced CDN Strategies
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <p className="text-sm font-semibold text-orange-900 mb-2">
              Q: How would you handle a major content update that needs to go live immediately?
            </p>
            <p className="text-sm text-slate-700">
              <strong>A:</strong> Use cache busting (versioned URLs) for instant updates without purge costs. Change
              app.js to app.v2.js in HTML. Old version stays cached, new version loads immediately. No purge API needed,
              no race conditions, no cache propagation delays.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <p className="text-sm font-semibold text-orange-900 mb-2">Q: When would you choose Push CDN over Pull CDN?</p>
            <p className="text-sm text-slate-700">
              <strong>A:</strong> Push CDN for known, popular, large files - OS updates, game patches, software
              downloads. Content is uploaded once, served millions of times with zero origin load. Pull CDN for dynamic
              websites where you can't predict what will be popular.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <p className="text-sm font-semibold text-orange-900 mb-2">
              Q: Why would a company use multiple CDN providers?
            </p>
            <p className="text-sm text-slate-700">
              <strong>A:</strong> 1) Redundancy/failover for 99.99%+ uptime 2) Geographic optimization (Alibaba for
              China, Cloudflare for US) 3) Cost optimization via competition 4) Avoid vendor lock-in. Trade-off is
              complexity and higher costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
