import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import AvailabilityCalculator from "@/components/availability-calculator"
import CapacityPlanner from "@/components/capacity-planner"
import InteractiveCAP from "@/components/interactive-cap"
import ScalingDiagram from "@/components/scaling-diagram"

/**
 *
 */
export default function Foundations() {
  const nav = useNavigate()

  // Component-driven interactive demos: we use dedicated components for calculators and diagrams

  const sectionsReference = useRef([])

  // Availability and other calculators are handled inside dedicated components like CapacityPlanner

  // Intersection Observer for fade-in animations
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Hero Section */}
      <section className="module-hero relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <span className="text-sm font-semibold text-white tracking-wide">
                MODULE 1: CORE PRINCIPLES & SIZING
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Foundations & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-pink-300">
                Back-of-Envelope
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white mb-20 mt-10">
              Master the essential principles of system design through deep-dive
              explanations, real-world examples, and hands-on interactive
              demonstrations. Build the foundation every system architect needs.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-5">
              <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3">
                <div className="text-3xl font-bold text-white">4</div>
                <div className="text-sm text-blue-100">Core Topics</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3">
                <div className="text-3xl font-bold text-white">8+</div>
                <div className="text-sm text-blue-100">Interactive Demos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* ============================================ */}
        {/* SECTION 0: What is System Design? */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[0] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">
                  00
                </span>
                START HERE
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              What is System Design?
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              If you're new to system design, start here. This section explains the fundamentals in simple terms—no prior experience needed.
            </p>
          </div>

          {/* The Big Picture */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🏗️</div>
              <div>
                <h3 className="text-3xl font-bold text-emerald-900 mb-4">
                  System Design in Simple Terms
                </h3>
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  Imagine you're building a house. You don't just start hammering nails randomly—you need a <strong>blueprint</strong>. 
                  System design is like creating that blueprint, but for software applications.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  It's the process of defining the <strong>architecture</strong>, <strong>components</strong>, <strong>modules</strong>, 
                  and <strong>data flow</strong> of a system to satisfy specific requirements. It answers questions like:
                </p>
                <ul className="space-y-2 ml-6">
                  {[
                    "How should we structure our application so it can handle millions of users?",
                    "Where should we store data, and how should we organize it?",
                    "How do different parts of the system communicate with each other?",
                    "What happens when something breaks? How do we keep things running?",
                    "How do we make sure the system is fast, secure, and reliable?"
                  ].map((q, index) => (
                    <li key={index} className="text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-1">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Real-World Analogy */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Think of a Restaurant
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                A restaurant is a <strong>system</strong>. It has:
              </p>
              <ul className="space-y-3">
                {[
                  { icon: "👥", label: "Customers", desc: "(like users of your app)" },
                  { icon: "📋", label: "Menu", desc: "(like your app's features/API)" },
                  { icon: "👨‍🍳", label: "Kitchen", desc: "(where the work happens—your servers)" },
                  { icon: "🗄️", label: "Storage/Fridge", desc: "(your database)" },
                  { icon: "🚚", label: "Suppliers", desc: "(external services/APIs)" },
                  { icon: "🔧", label: "Processes", desc: "(how orders flow, food is prepared)" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <span className="font-semibold text-slate-900">{item.label}</span>
                      <span className="text-slate-600 text-sm ml-2">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong>System design</strong> is deciding: How many chefs do we need? How do we organize the kitchen? 
                  What if 1000 customers show up at once? What if the fridge breaks?
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Real Software Example: Instagram
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                When you post a photo on Instagram, here's what happens behind the scenes:
              </p>
              <div className="space-y-4">
                {[
                  { 
                    step: "1", 
                    title: "Upload", 
                    desc: "Your photo is sent to Instagram's servers via the internet" 
                  },
                  { 
                    step: "2", 
                    title: "Processing", 
                    desc: "Servers compress & optimize the image, create multiple sizes (thumbnail, full-size)" 
                  },
                  { 
                    step: "3", 
                    title: "Storage", 
                    desc: "Images saved to cloud storage (e.g., AWS S3). Post metadata saved to database" 
                  },
                  { 
                    step: "4", 
                    title: "Distribution", 
                    desc: "Notification sent to your followers. Post added to their feeds" 
                  },
                  { 
                    step: "5", 
                    title: "Retrieval", 
                    desc: "When followers open the app, they fetch the post from nearby servers (CDN)" 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong>System design</strong> planned all of this: where to store images, how to handle millions 
                  of uploads per day, how to make loading fast worldwide, what to do if servers crash.
                </p>
              </div>
            </div>
          </div>

          {/* Why Learn System Design */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-4xl">🎯</span>
              Why Should You Learn System Design?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "💼",
                  title: "Career Growth",
                  desc: "System design interviews are required for senior engineer roles at top tech companies (Google, Amazon, Meta, Netflix, etc.)"
                },
                {
                  icon: "🧠",
                  title: "Better Decision Making",
                  desc: "You'll understand why your team makes certain architectural choices and contribute to technical discussions"
                },
                {
                  icon: "🔧",
                  title: "Build Scalable Apps",
                  desc: "Learn to create applications that don't crash when traffic increases—crucial for real-world projects"
                },
                {
                  icon: "🌐",
                  title: "Understand the Internet",
                  desc: "Finally understand how your favorite apps (YouTube, Twitter, WhatsApp) actually work under the hood"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="font-bold text-xl mb-2">{item.title}</div>
                  <p className="text-sm text-white/90 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Concepts - Glossary */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">📚</span>
                Essential System Design Glossary
              </h3>
              <p className="text-slate-300 mt-2">Key terms every beginner should know</p>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-6">
              {[
                {
                  term: "Server",
                  definition: "A powerful computer that stores your application and serves it to users. When you visit a website, you're connecting to a server.",
                  example: "Like a waiter in a restaurant who takes your order and brings your food"
                },
                {
                  term: "Database",
                  definition: "Where your application stores data permanently (user accounts, posts, messages, etc.). Think of it as a digital filing cabinet.",
                  example: "Instagram stores your photos and profile info in databases"
                },
                {
                  term: "Client",
                  definition: "The device/application a user uses to access your system (mobile app, web browser, desktop app).",
                  example: "Your phone's Instagram app is a client"
                },
                {
                  term: "API (Application Programming Interface)",
                  definition: "A set of rules that lets different software talk to each other. Like a menu in a restaurant—it shows what you can order.",
                  example: "When Twitter's app gets your tweets, it calls Twitter's API"
                },
                {
                  term: "Load Balancer",
                  definition: "Distributes incoming requests across multiple servers so no single server gets overwhelmed.",
                  example: "Like a host at a restaurant directing customers to available tables"
                },
                {
                  term: "Cache",
                  definition: "Temporary storage for frequently accessed data to make things faster. Stores copies of data closer to users.",
                  example: "Your browser caches images so pages load faster on repeat visits"
                },
                {
                  term: "Latency",
                  definition: "The delay/time it takes for data to travel from point A to point B. Lower is better.",
                  example: "Time between clicking a link and the page starting to load"
                },
                {
                  term: "Throughput",
                  definition: "How much data or how many requests a system can handle in a given time period.",
                  example: "A highway's throughput is how many cars pass through per hour"
                },
                {
                  term: "Scalability",
                  definition: "The ability of a system to handle growth (more users, more data) without breaking or slowing down.",
                  example: "Netflix scaled from thousands to millions of users"
                },
                {
                  term: "Availability",
                  definition: "The percentage of time a system is operational and accessible. Usually measured in 'nines' (99%, 99.9%, etc.).",
                  example: "99.9% availability = only 8.76 hours downtime per year"
                },
                {
                  term: "Redundancy",
                  definition: "Having backup copies of components so if one fails, another takes over. Critical for reliability.",
                  example: "Airlines have backup pilots; systems have backup servers"
                },
                {
                  term: "Microservices",
                  definition: "Breaking a large application into smaller, independent services that work together.",
                  example: "Netflix has separate services for search, recommendations, video streaming"
                },
                {
                  term: "Monolithic",
                  definition: "The opposite of microservices—the entire application is one big codebase. Simpler but harder to scale.",
                  example: "Like a Swiss Army knife vs. a toolbox of specialized tools"
                },
                {
                  term: "CDN (Content Delivery Network)",
                  definition: "A network of servers distributed globally that serve content from locations closest to users for faster load times.",
                  example: "Netflix uses CDN so viewers in Japan and USA both get fast video"
                },
                {
                  term: "Sharding",
                  definition: "Splitting a database into smaller pieces (shards) distributed across multiple servers to handle large datasets.",
                  example: "User data split by region: US users on one shard, EU users on another"
                },
                {
                  term: "Replication",
                  definition: "Creating copies of data across multiple servers for backup and faster access.",
                  example: "Your email exists on multiple servers so it's not lost if one fails"
                }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <div className="font-bold text-lg text-slate-900 mb-2">
                    {item.term}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    {item.definition}
                  </p>
                  <div className="bg-indigo-50 rounded-lg p-3 mt-2">
                    <div className="text-xs font-semibold text-indigo-900 mb-1">
                      💡 Example:
                    </div>
                    <div className="text-xs text-slate-700">{item.example}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Learning Path */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🗺️</span>
              Your Learning Journey
            </h3>
            <p className="text-slate-700 mb-6 leading-relaxed">
              System design can feel overwhelming at first, but break it down into steps:
            </p>
            <div className="space-y-4">
              {[
                {
                  phase: "Phase 1",
                  title: "Learn the Basics",
                  items: ["Understand key concepts (client, server, database, API)", "Learn about scalability, latency, throughput", "Study common patterns (caching, load balancing)"],
                  duration: "1-2 weeks"
                },
                {
                  phase: "Phase 2",
                  title: "Study Components",
                  items: ["Databases (SQL vs NoSQL)", "Caching strategies (Redis, Memcached)", "Message queues (RabbitMQ, Kafka)", "Storage (object storage, file systems)"],
                  duration: "2-3 weeks"
                },
                {
                  phase: "Phase 3",
                  title: "Practice Designs",
                  items: ["Design simple systems (URL shortener, pastebin)", "Progress to medium systems (Twitter, Instagram)", "Try complex systems (YouTube, Uber, Netflix)"],
                  duration: "4-8 weeks"
                },
                {
                  phase: "Phase 4",
                  title: "Real-World Application",
                  items: ["Build a project applying what you learned", "Read about real system architectures (engineering blogs)", "Practice mock interviews"],
                  duration: "Ongoing"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border-l-4 border-blue-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase">{item.phase}</span>
                      <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {item.duration}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {item.items.map((listItem, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">✓</span>
                        <span>{listItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 1: Interview Flow & Requirements Mapping */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[1] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  01
                </span>
                SYSTEM DESIGN FUNDAMENTALS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Interview Flow, Use-Case Mapping & Requirements
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              The systematic approach to tackling any system design problem.
              Learn how to structure interviews, gather requirements, and map
              use cases to technical solutions.
            </p>
          </div>

          {/* Why This Matters */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">
                  Why This Matters
                </h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Most system design failures happen not because of poor
                  technical choices, but because requirements weren't properly
                  understood. A structured approach to gathering requirements is
                  the difference between building the right system and building
                  the system right.
                </p>
              </div>
            </div>
          </div>

          {/* Interview Flow - Step by Step */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                The 5-Step System Design Interview Framework
              </h3>
            </div>

            <div className="p-8 space-y-6">
              {[
                {
                  step: "1",
                  title: "Clarify Requirements & Scope",
                  duration: "5-10 minutes",
                  description:
                    "Ask clarifying questions to understand what you're building. Never assume!",
                  questions: [
                    "Who are the users? (mobile, web, both?)",
                    "What are the core features? (read-heavy, write-heavy?)",
                    "What's the scale? (DAU, QPS, data size?)",
                    "Any specific constraints? (latency requirements, consistency needs?)",
                  ],
                  example:
                    "For a URL shortener: Are we tracking analytics? Do short URLs expire? Mobile or web?",
                },
                {
                  step: "2",
                  title: "Establish Functional vs Non-Functional Requirements",
                  duration: "5 minutes",
                  description:
                    "Separate what the system does from how well it does it.",
                  functional: [
                    "User can shorten URLs",
                    "User can access original URL via short link",
                    "URLs have custom aliases (optional)",
                    "URLs can expire after time period",
                  ],
                  nonFunctional: [
                    "99.9% availability (high availability)",
                    "Low latency: < 100ms redirect",
                    "100M URLs created per day",
                    "10B redirects per day",
                  ],
                },
                {
                  step: "3",
                  title: "Back-of-Envelope Estimation",
                  duration: "5-10 minutes",
                  description:
                    "Calculate traffic, storage, bandwidth needs. Show you can estimate scale.",
                  calculations: [
                    "QPS = 100M writes/day ÷ 86400 = ~1,160 writes/sec",
                    "Read QPS = 10B reads/day ÷ 86400 = ~115,740 reads/sec",
                    "Storage = 100M URLs × 0.5KB × 365 days × 5 years = 9TB",
                    "Bandwidth = 115K requests/sec × 0.5KB = 57.5 MB/sec",
                  ],
                },
                {
                  step: "4",
                  title: "High-Level Design",
                  duration: "10-15 minutes",
                  description:
                    "Draw boxes and arrows. Cover core components and data flow.",
                  components: [
                    "API Gateway / Load Balancer",
                    "Application Servers (stateless)",
                    "Database (SQL or NoSQL?)",
                    "Cache Layer (Redis, Memcached)",
                    "CDN (for static content)",
                  ],
                },
                {
                  step: "5",
                  title: "Deep Dive & Trade-offs",
                  duration: "15-20 minutes",
                  description:
                    "Pick 2-3 areas to discuss in detail. Show depth of knowledge.",
                  topics: [
                    "Database schema design & indexing",
                    "Caching strategy (cache-aside, write-through)",
                    "Scaling approach (vertical vs horizontal)",
                    "Handling hot keys / celebrity problem",
                    "Monitoring, alerting, and error handling",
                  ],
                },
              ].map((phase, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-600 pl-6 relative"
                >
                  <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {phase.step}
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <h4 className="text-xl font-bold text-slate-900">
                        {phase.title}
                      </h4>
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-slate-600 text-base leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  {phase.questions && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-3">
                      <div className="font-semibold text-blue-900 mb-2">
                        Key Questions to Ask:
                      </div>
                      <ul className="space-y-1">
                        {phase.questions.map((q, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-700 flex items-start gap-2"
                          >
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {phase.functional && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                          <span>✅</span> Functional Requirements
                        </div>
                        <ul className="space-y-1">
                          {phase.functional.map((item, index) => (
                            <li key={index} className="text-sm text-slate-700">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4">
                        <div className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                          <span>⚡</span> Non-Functional Requirements
                        </div>
                        <ul className="space-y-1">
                          {phase.nonFunctional.map((item, index) => (
                            <li key={index} className="text-sm text-slate-700">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {phase.calculations && (
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-green-400">
                      {phase.calculations.map((calc, index) => (
                        <div key={index} className="mb-1">
                          → {calc}
                        </div>
                      ))}
                    </div>
                  )}

                  {phase.components && (
                    <div className="flex flex-wrap gap-2">
                      {phase.components.map((comp, index) => (
                        <span
                          key={index}
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  )}

                  {phase.topics && (
                    <div className="grid md:grid-cols-2 gap-2">
                      {phase.topics.map((topic, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 border border-slate-200"
                        >
                          • {topic}
                        </div>
                      ))}
                    </div>
                  )}

                  {phase.example && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                      <div className="font-semibold text-amber-900 text-sm mb-1">
                        Example:
                      </div>
                      <div className="text-sm text-slate-700">
                        {phase.example}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Functional vs Non-Functional Deep Dive */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border-2 border-green-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl">
                  ✅
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Functional Requirements
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-green-900 mb-2">
                    What It Means:
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    What the system <strong>does</strong>. The features and
                    capabilities users interact with directly.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-green-900 mb-2">
                    How to Identify:
                  </div>
                  <ul className="space-y-2">
                    {[
                      "User stories: 'As a user, I want to...'",
                      "Actions: create, read, update, delete",
                      "Business logic and workflows",
                      "API endpoints and their inputs/outputs",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-slate-700"
                      >
                        <span className="text-green-600 mt-1">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <div className="font-semibold text-green-900 mb-2">
                    Examples:
                  </div>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>• Twitter: Post tweets, follow users, like posts</li>
                    <li>
                      • Netflix: Browse catalog, play videos, create profiles
                    </li>
                    <li>• Uber: Request ride, track driver, make payment</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Non-Functional Requirements
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-purple-900 mb-2">
                    What It Means:
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    How <strong>well</strong> the system does it. Quality
                    attributes and constraints.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-purple-900 mb-2">
                    Key Categories:
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Performance: latency, throughput, response time",
                      "Scalability: handle growth in users/data",
                      "Reliability: availability, fault tolerance",
                      "Security: authentication, authorization, encryption",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-slate-700"
                      >
                        <span className="text-purple-600 mt-1">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="font-semibold text-purple-900 mb-2">
                    Examples:
                  </div>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>• Twitter: Handle 500M DAU, 99.99% uptime</li>
                    <li>• Netflix: &lt;100ms video start, global CDN</li>
                    <li>• Uber: &lt;3s driver match, real-time GPS</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Trade-offs Framework */}
          <div className="from-slate-500 to-slate-900 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-4xl">⚖️</span>
              The Trade-offs Mindset
            </h3>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              There are no perfect solutions in system design—only trade-offs.
              Every decision has costs and benefits.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  trade: "Consistency vs Availability",
                  desc: "Strong consistency = wait for all nodes (slower). Eventual consistency = faster but stale reads.",
                  when: "Use strong for financial data, eventual for social feeds.",
                },
                {
                  trade: "Latency vs Throughput",
                  desc: "Optimize for fast individual requests OR high volume. Batching increases throughput but latency.",
                  when: "Real-time apps need low latency. Analytics can batch.",
                },
                {
                  trade: "Cost vs Performance",
                  desc: "More servers = better performance but higher cost. Caching reduces DB load but adds complexity.",
                  when: "Startups optimize for cost. Scale-ups optimize for growth.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5"
                >
                  <div className="font-bold text-yellow-500 text-lg mb-2">
                    {item.trade}
                  </div>
                  <p className="text-sm text-slate-300 mb-3 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="text-xs text-blue-300 italic">
                    {item.when}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 bg-white border border-slate-100 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Interview Flow — Why / How / When / Trade-offs
            </h3>
            <div className="text-sm text-slate-700 space-y-2">
              <p>
                <strong>Why:</strong> Demonstrates thoughtful, repeatable
                patterns for problem solving rather than jumping straight to
                code.
              </p>
              <p>
                <strong>How:</strong> Ask clarifying questions; scope the
                system; give quick back-of-envelope numbers; sketch a high-level
                design; deep-dive one area with trade-offs.
              </p>
              <p>
                <strong>When:</strong> Use this during system design interviews
                and design reviews; adjust time allocation as needed for the
                interview duration.
              </p>
              <p>
                <strong>Trade-offs:</strong> Spending too long on one part
                (e.g., database schema) may not leave time for discussing
                operations, so choose highest-risk components for deeper
                discussion.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 2: Performance vs Scalability | Latency vs Throughput */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[2] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                  02
                </span>
                CRITICAL DISTINCTIONS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Performance vs Scalability · Latency vs Throughput
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              These are the most commonly confused concepts in system design.
              Understanding the differences is fundamental to making the right
              architectural decisions.
            </p>
          </div>

          {/* Performance vs Scalability */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-4xl shadow-lg">
                  ⚡
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    Performance
                  </h3>
                  <p className="text-slate-600">Speed of execution</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">
                    What It Means:
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    How <strong>fast</strong> your system responds to a{" "}
                    <strong>single request</strong>. It's about minimizing
                    response time and maximizing efficiency for individual
                    operations.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-5">
                  <h4 className="font-bold text-blue-900 mb-3">Key Metrics:</h4>
                  <ul className="space-y-2">
                    {[
                      {
                        metric: "Response Time",
                        value: "Time to complete one request",
                        ex: "50ms API response",
                      },
                      {
                        metric: "Latency",
                        value: "Delay before operation starts",
                        ex: "10ms network latency",
                      },
                      {
                        metric: "Throughput",
                        value: "Operations per second",
                        ex: "1000 req/sec",
                      },
                    ].map((m, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-semibold text-slate-900">
                          {m.metric}:
                        </span>
                        <span className="text-slate-700"> {m.value}</span>
                        <div className="text-xs text-blue-600 ml-4">
                          → {m.ex}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">
                    How to Improve:
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Add caching (Redis, Memcached)",
                      "Optimize database queries and indexes",
                      "Use CDN for static content",
                      "Reduce network round trips",
                      "Optimize code (algorithms, data structures)",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-slate-700"
                      >
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-5 text-white">
                  <div className="font-bold mb-2">Real-World Example:</div>
                  <p className="text-sm leading-relaxed">
                    Google Search returns results in{" "}
                    <strong>0.5 seconds</strong>. This is excellent performance
                    for a single query, regardless of how many users are
                    searching simultaneously.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl shadow-lg">
                  📈
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    Scalability
                  </h3>
                  <p className="text-slate-600">Growth handling</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-purple-900 mb-3 text-lg">
                    What It Means:
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    How well your system <strong>maintains performance</strong>{" "}
                    as <strong>load increases</strong>. It's about handling more
                    users, more data, more requests without degradation.
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-5">
                  <h4 className="font-bold text-purple-900 mb-3">
                    Key Metrics:
                  </h4>
                  <ul className="space-y-2">
                    {[
                      {
                        metric: "User Growth",
                        value: "10K → 10M users",
                        ex: "Response time stays ~same",
                      },
                      {
                        metric: "Data Growth",
                        value: "1GB → 1TB storage",
                        ex: "Query speed maintained",
                      },
                      {
                        metric: "Traffic Growth",
                        value: "100 → 100K QPS",
                        ex: "System stays stable",
                      },
                    ].map((m, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-semibold text-slate-900">
                          {m.metric}:
                        </span>
                        <span className="text-slate-700"> {m.value}</span>
                        <div className="text-xs text-purple-600 ml-4">
                          → {m.ex}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-purple-900 mb-3 text-lg">
                    How to Achieve:
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Horizontal scaling (add more servers)",
                      "Load balancing across instances",
                      "Database sharding and partitioning",
                      "Microservices architecture",
                      "Asynchronous processing (queues)",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-slate-700"
                      >
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-5 text-white">
                  <div className="font-bold mb-2">Real-World Example:</div>
                  <p className="text-sm leading-relaxed">
                    Instagram grew from 1M to 1B users while maintaining{" "}
                    <strong>fast feed loading</strong>. This is excellent
                    scalability—performance didn't degrade despite 1000x growth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Critical Insight */}
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🎯</div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">
                  The Critical Insight
                </h3>
                <p className="text-lg text-slate-800 mb-4 leading-relaxed">
                  A system can be{" "}
                  <strong className="text-amber-900">
                    performant but not scalable
                  </strong>
                  , or{" "}
                  <strong className="text-amber-900">
                    scalable but not performant
                  </strong>
                  :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-5">
                    <div className="font-bold text-red-700 mb-2">
                      ❌ Performant, Not Scalable:
                    </div>
                    <p className="text-sm text-slate-700">
                      Single powerful server responds in 10ms to 100 users, but
                      crashes at 10,000 users.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-5">
                    <div className="font-bold text-red-700 mb-2">
                      ❌ Scalable, Not Performant:
                    </div>
                    <p className="text-sm text-slate-700">
                      System handles 1M users but every request takes 5 seconds
                      due to poor code.
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-green-700 text-white rounded-xl p-4">
                  <div className="font-bold mb-1">✅ The Goal: Both!</div>
                  <p className="text-sm">
                    Optimize for performance FIRST (fast for single user), then
                    scale horizontally to handle load.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Latency vs Throughput - Coming in next part... */}
        </section>

        {/* ============================================ */}
        {/* SECTION 3: Consistency & CAP Theorem */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[3] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-sm">
                  03
                </span>
                DATA CONSISTENCY & TRADE-OFFS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              CAP Theorem — Consistency vs Availability
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Selecting the right consistency model is fundamental when you're
              designing distributed data systems. The CAP lens helps you
              categorize choices and explain trade-offs to stakeholders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <InteractiveCAP />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900">
                Why / How / When
              </h3>
              <div className="mt-3 text-sm text-slate-700 space-y-2">
                <p>
                  <strong>Why:</strong> To match a database to the business
                  requirements for correctness and availability.
                </p>
                <p>
                  <strong>How:</strong> Identify tolerable staleness, eventual
                  consistency approaches, or strong consensus protocols like
                  Paxos/Raft for CP needs.
                </p>
                <p>
                  <strong>When:</strong> During DB selection, replication, and
                  failover strategy planning for global systems.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                  Tip: Use CP for finance and inventory; AP for social feeds and
                  analytics where eventual consistency is acceptable.
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-8 bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Performance vs Scalability — Why / How / When
          </h3>
          <div className="text-sm text-slate-700 space-y-2">
            <p>
              <strong>Why:</strong> Choosing the right focus affects cost,
              architecture and user experience—clear SLIs/SLOs guide
              architecture choices.
            </p>
            <p>
              <strong>How:</strong> Measure latency percentiles (p50/p95/p99),
              profile hotspots, and design caching/partitioning strategies
              before scaling out.
            </p>
            <p>
              <strong>When:</strong> Optimize for performance early on
              (low-latency operations) but ensure the design supports horizontal
              growth for later scale.
            </p>
            <p>
              <strong>Trade-offs:</strong> Caching improves latency but adds
              complexity (cache invalidation). Horizontal scaling increases ops
              surface but raises availability.
            </p>
          </div>
        </div>
        {/* ============================================ */}
        {/* SECTION 4: Vertical vs Horizontal Scaling */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[4] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                  04
                </span>
                SCALING MODELS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Vertical vs Horizontal Scaling Basics
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Understand the trade-offs and how to choose the right approach for
              your service's lifecycle and failure model.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ScalingDiagram />
            </div>
            <div>
              <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow">
                <h3 className="text-lg font-bold mb-2">Why / How / When</h3>
                <div className="text-sm text-slate-700 space-y-2">
                  <p>
                    <strong>Why:</strong> Scalability is essential to prepare
                    for growth and avoid performance cliffs.
                  </p>
                  <p>
                    <strong>How:</strong> Vertical: beef up single node;
                    Horizontal: add more nodes with stateless instances, a load
                    balancer and partitioning.
                  </p>
                  <p>
                    <strong>When:</strong> Start with a vertical approach for
                    prototypes if stateful; move to horizontal as load and
                    availability requirements increase.
                  </p>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    Trade-offs: Horizontal scaling introduces complexity
                    (coordination, partitioning) but offers higher availability
                    and capacity.
                  </div>
                </div>
                <div className="mt-4">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.0.3&s=0795b4f63545d1b77b07e4f8f96fbf89"
                    alt="cloud scaling"
                    className="rounded-md w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NINES AVAILABILITY REFERENCE */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Availability Nines Quick Reference
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-2">
                A quick lookup for what 9s (e.g. 9, 99, 999) map to for downtime
                across different time windows.
              </p>
            </div>

            {/* compute rows in-page for readability */}
            {(() => {
              const rows = [
                { notation: "9", label: "1 nine", percent: 90 },
                { notation: "99", label: "2 nines", percent: 99 },
                { notation: "999", label: "3 nines", percent: 99.9 },
                { notation: "9999", label: "4 nines", percent: 99.99 },
                { notation: "99999", label: "5 nines", percent: 99.999 },
                { notation: "999999", label: "6 nines", percent: 99.9999 },
                { notation: "9999999", label: "7 nines", percent: 99.99999 },
                { notation: "99999999", label: "8 nines", percent: 99.999999 },
                {
                  notation: "999999999",
                  label: "9 nines",
                  percent: 99.9999999,
                },
              ].map((r) => {
                const uptime = r.percent / 100
                const minsPerYear = (1 - uptime) * 365 * 24 * 60
                const minsPerMonth = minsPerYear / 12
                const minsPerDay = minsPerYear / 365
                const fmt = (mins) => {
                  if (mins >= 24 * 60) {
                    return `${(mins / (24 * 60)).toFixed(2)} days`
                  }
                  if (mins >= 60) return `${(mins / 60).toFixed(2)} hours`
                  return `${mins.toFixed(2)} minutes`
                }
                return {
                  ...r,
                  perYear: fmt(minsPerYear),
                  perMonth: fmt(minsPerMonth),
                  perDay: fmt(minsPerDay),
                }
              })

              return (
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-3">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr>
                        <th className="px-4 py-3">Nines</th>
                        <th className="px-4 py-3">Notation</th>
                        <th className="px-4 py-3">Availability</th>
                        <th className="px-4 py-3">Downtime per year</th>
                        <th className="px-4 py-3">Downtime per month</th>
                        <th className="px-4 py-3">Downtime per day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr
                          key={r.label}
                          className="even:bg-white odd:bg-slate-50"
                        >
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {r.label}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {r.notation}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {r.percent}%
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {r.perYear}/year
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {r.perMonth}/month
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {r.perDay}/day
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })()}
          </div>
        </section>

        {/* Interactive Demos Section - Moved here for better visibility */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Interactive Calculators & Demos
            </h2>
            <p className="text-lg text-slate-600 mx-auto">
              Hands-on tools to estimate system capacity, availability, and
              understand core trade-offs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <CapacityPlanner />
            </div>
            <div>
              <AvailabilityCalculator />
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-3xl">📊</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Why These Calculators Matter
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Even a 0.1% difference in availability (99.9% vs 99.99%)
                    maps to significant downtime. Quick estimates guide capacity
                    decisions and explain trade-offs under interview pressure.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="font-semibold text-blue-900 mb-1">
                    💡 SLO Example:
                  </p>
                  <p>
                    99.95% uptime ≈ ~4.38 hours downtime/year. Use redundancy to
                    improve it.
                  </p>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                  <p className="font-semibold text-blue-900 mb-1">
                    🎯 When to Use:
                  </p>
                  <p>
                    Design interviews, early architecture planning, or migration
                    preparation.
                  </p>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                  <p className="font-semibold text-blue-900 mb-1">
                    ⚠️ Trade-offs:
                  </p>
                  <p>
                    These are heuristics—production varies. Build margin and
                    validate with tests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Back to Home */}
        <section className="text-center py-12">
          <button
            onClick={() => nav("/")}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            ← Back to Home
          </button>
        </section>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
