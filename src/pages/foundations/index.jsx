import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  CheckCircle, 
  ClipboardList, 
  Clock, 
  Code, 
  Cpu, 
  Database, 
  Globe, 
  HardDrive, 
  Home, 
  Layers, 
  Layout, 
  Map, 
  Monitor, 
  Scale, 
  Server, 
  Shield, 
  Smartphone, 
  Target, 
  TrendingUp, 
  Truck, 
  Users, 
  Zap, 
  Activity, 
  BarChart, 
  Box, 
  Construction, 
  Copy, 
  Grid, 
  Maximize, 
  Share2, 
  Store, 
  Wrench,
  Brain,
  ChefHat,
  Archive
} from "lucide-react"

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
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative bg-white py-20 md:py-32 overflow-hidden border-b border-slate-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6 shadow-sm">
              <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">
                Module 1
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
              Foundations & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Back-of-Envelope</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-10 mx-auto max-w-2xl leading-relaxed">
              Master the essential principles of system design through deep-dive
              explanations, real-world examples, and hands-on interactive
              demonstrations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => nav("/")}
                className="group px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
              >
                <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </button>
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
          <div className="mb-12 text-center md:text-left">
            <div className="inline-block">
              <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <span className="font-bold">01</span>
                </div>
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
          <div className="bg-white border text-left border-slate-200 rounded-3xl p-8 md:p-12 mb-12 shadow-xl shadow-slate-200/50">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Construction className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  System Design in Simple Terms
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Imagine you're building a house. You don't just start hammering nails randomly—you need a <strong>blueprint</strong>. 
                  System design is like creating that blueprint, but for software applications.
                </p>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-lg text-slate-700 leading-relaxed mb-4 font-medium">
                    It answers questions like:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "How should we structure our application so it can handle millions of users?",
                      "Where should we store data, and how should we organize it?",
                      "How do different parts of the system communicate with each other?",
                      "What happens when something breaks? How do we keep things running?",
                      "How do we make sure the system is fast, secure, and reliable?"
                    ].map((q, index) => (
                      <li key={index} className="text-slate-600 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Analogy */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-blue-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Think of a Restaurant
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                A restaurant is a <strong>system</strong>. It has:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: <Users className="w-5 h-5 text-blue-500" />, label: "Customers", desc: "(like users of your app)" },
                  { icon: <ClipboardList className="w-5 h-5 text-indigo-500" />, label: "Menu", desc: "(like your app's features/API)" },
                  { icon: <ChefHat className="w-5 h-5 text-orange-500" />, label: "Kitchen", desc: "(Server handling requests)" },
                  { icon: <Archive className="w-5 h-5 text-amber-500" />, label: "Storage/Fridge", desc: "(your database)" },
                  { icon: <Truck className="w-5 h-5 text-green-500" />, label: "Suppliers", desc: "(external services/APIs)" },
                  { icon: <Wrench className="w-5 h-5 text-slate-500" />, label: "Processes", desc: "(workflows)" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">{item.label}</span>
                      <span className="text-slate-500 text-sm ml-2">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 leading-relaxed font-medium">
                  <strong>System design</strong> is deciding: How many chefs do we need? How do we organize the kitchen? 
                  What if 1000 customers show up at once? What if the fridge breaks?
                </p>
              </div>
            </div>

            <div className="bg-white border border-purple-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Real Software Example: Instagram
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                When you post a photo on Instagram, here's what happens behind the scenes:
              </p>
              <div className="space-y-6 relative mb-8">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100"></div>
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
                  <div key={index} className="relative flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white z-10 flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                      <div className="text-sm text-slate-500 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-sm text-purple-800 leading-relaxed font-medium">
                  <strong>System design</strong> planned all of this: where to store images, how to handle millions 
                  of uploads per day, how to make loading fast worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Why Learn System Design */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white mb-12 shadow-2xl">
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-400" />
              Why Should You Learn System Design?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Briefcase className="w-6 h-6 text-blue-400" />,
                  title: "Career Growth",
                  desc: "System design interviews are required for senior engineer roles at top tech companies (Google, Amazon, Meta, Netflix, etc.)"
                },
                {
                  icon: <Brain className="w-6 h-6 text-purple-400" />,
                  title: "Better Decision Making",
                  desc: "You'll understand why your team makes certain architectural choices and contribute to technical discussions"
                },
                {
                  icon: <Construction className="w-6 h-6 text-green-400" />,
                  title: "Build Scalable Apps",
                  desc: "Learn to create applications that don't crash when traffic increases—crucial for real-world projects"
                },
                {
                  icon: <Globe className="w-6 h-6 text-pink-400" />,
                  title: "Understand the Internet",
                  desc: "Finally understand how your favorite apps (YouTube, Twitter, WhatsApp) actually work under the hood"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <div className="mb-4 p-3 bg-white/10 rounded-xl w-fit">{item.icon}</div>
                  <div className="font-bold text-xl mb-2 text-white">{item.title}</div>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Concepts - Glossary */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden mb-12">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-blue-600" />
                Essential System Design Glossary
              </h3>
              <p className="text-slate-500 mt-2 ml-10">Key terms every beginner should know</p>
            </div>

            <div className="p-8 pb-12 grid md:grid-cols-2 gap-x-12 gap-y-10">
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
                  term: "API (Interface)",
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
                  term: "CDN",
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
                <div key={index} className="relative pl-6 border-l-2 border-blue-200 hover:border-blue-500 transition-colors">
                   <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                  <div className="font-bold text-xl text-slate-800 mb-2">
                    {item.term}
                  </div>
                  <p className="text-slate-600 mb-3 leading-relaxed">
                    {item.definition}
                  </p>
                  <div className="bg-blue-50/50 rounded-lg p-3 text-sm text-blue-800">
                    <span className="font-bold mr-1">💡 Example:</span> {item.example}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Learning Path */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Map className="w-7 h-7 text-indigo-600" />
              Your Learning Journey
            </h3>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-3xl">
              System design can feel overwhelming at first, but break it down into steps:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
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
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{item.phase}</span>
                      <h4 className="text-lg font-bold text-slate-900 mt-1">{item.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                      {item.duration}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {item.items.map((listItem, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
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
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <span className="font-bold">02</span>
                </div>
                SYSTEM DESIGN FUNDAMENTALS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Interview Flow & Requirements
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              The systematic approach to tackling any system design problem.
              Learn how to structure interviews, gather requirements, and map
              use cases to technical solutions.
            </p>
          </div>

          {/* Why This Matters */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="bg-amber-100 p-3 rounded-xl">
                 <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">
                  Why This Matters
                </h3>
                <p className="text-lg text-amber-900/80 leading-relaxed">
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
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden mb-12">
            <div className="bg-slate-900 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Target className="w-7 h-7 text-green-400" />
                The 5-Step System Design Interview Framework
              </h3>
            </div>

            <div className="p-8 md:p-12 space-y-12">
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
                  title: "Functional vs Non-Functional",
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
                  className="relative pl-12 md:pl-16 border-l-2 border-slate-200"
                >
                  <div className="absolute -left-[17px] top-0 w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-white">
                    {phase.step}
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
                      <h4 className="text-2xl font-bold text-slate-900">
                        {phase.title}
                      </h4>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {phase.questions && (
                      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <div className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                          <Brain className="w-5 h-5" /> Key Questions to Ask:
                        </div>
                        <ul className="space-y-2">
                          {phase.questions.map((q, index) => (
                            <li
                              key={index}
                              className="text-blue-900/80 flex items-start gap-2"
                            >
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {phase.functional && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                          <div className="font-bold text-green-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Functional
                          </div>
                          <ul className="space-y-2">
                            {phase.functional.map((item, index) => (
                              <li key={index} className="text-green-900/80 text-sm">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                          <div className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5" /> Non-Functional
                          </div>
                          <ul className="space-y-2">
                            {phase.nonFunctional.map((item, index) => (
                              <li key={index} className="text-purple-900/80 text-sm">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {phase.calculations && (
                      <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm text-green-400 border border-slate-800 shadow-inner">
                        {phase.calculations.map((calc, index) => (
                          <div key={index} className="mb-2 flex gap-2">
                            <span className="opacity-50">➜</span> {calc}
                          </div>
                        ))}
                      </div>
                    )}

                    {phase.components && (
                      <div className="flex flex-wrap gap-2">
                        {phase.components.map((comp, index) => (
                          <span
                            key={index}
                            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}

                    {phase.topics && (
                      <div className="grid md:grid-cols-2 gap-3">
                        {phase.topics.map((topic, index) => (
                          <div
                            key={index}
                            className="bg-slate-50 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors"
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    )}

                    {phase.example && (
                      <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl flex gap-3">
                        <div className="font-bold text-amber-700 text-sm whitespace-nowrap">
                          Example:
                        </div>
                        <div className="text-sm text-amber-900/80">
                          {phase.example}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Functional vs Non-Functional Deep Dive */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-green-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Functional
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="font-bold text-slate-900 mb-2">
                    What It Means:
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    What the system <strong>does</strong>. The features and
                    capabilities users interact with directly.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="font-bold text-slate-900 mb-3">
                    Examples:
                  </div>
                  <ul className="space-y-3">
                    {[
                      "User stories: 'As a user, I want to...'",
                      "Actions: create, read, update, delete",
                      "Business logic and workflows",
                      "API endpoints and their inputs/outputs",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-slate-600 text-sm"
                      >
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-purple-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Non-Functional
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="font-bold text-slate-900 mb-2">
                    What It Means:
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    How <strong>well</strong> the system does it. Quality
                    attributes and constraints.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="font-bold text-slate-900 mb-3">
                    Key Categories:
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Performance: latency, throughput, response time",
                      "Scalability: handle growth in users/data",
                      "Reliability: availability, fault tolerance",
                      "Security: authentication, authorization, encryption",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-slate-600 text-sm"
                      >
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Trade-offs Framework */}
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Scale className="w-8 h-8 text-yellow-400" />
              The Trade-offs Mindset
            </h3>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-3xl">
              There are no perfect solutions in system design—only trade-offs.
              Every decision has costs and benefits.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
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
                  className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors"
                >
                  <div className="font-bold text-yellow-400 text-lg mb-3">
                    {item.trade}
                  </div>
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="text-xs text-blue-300 border-t border-white/10 pt-3">
                    <span className="uppercase font-bold opacity-70">When to choose:</span> <br/>{item.when}
                  </div>
                </div>
              ))}
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
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <span className="font-bold">03</span>
                </div>
                CRITICAL DISTINCTIONS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Performance vs Scalability
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              These are the most commonly confused concepts in system design.
              Understanding the differences is fundamental to making the right
              architectural decisions.
            </p>
          </div>

          {/* Performance vs Scalability */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-blue-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    Performance
                  </h3>
                  <p className="text-slate-500 font-medium">Speed of execution</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-slate-600 leading-relaxed">
                    How <strong>fast</strong> your system responds to a{" "}
                    <strong>single request</strong>. It's about minimizing
                    response time and maximizing efficiency.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Key Metrics</h4>
                  <ul className="space-y-3">
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
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-slate-700">{m.metric}</span>
                          <span className="text-slate-500">{m.value}</span>
                        </div>
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                          {m.ex}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                   <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Optimization Techniques</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Caching",
                      "DB Indexing",
                      "CDN",
                      "Code Optimization",
                    ].map((item, index) => (
                      <span
                        key={index}
                        className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-purple-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    Scalability
                  </h3>
                  <p className="text-slate-500 font-medium">Growth handling</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                   <p className="text-slate-600 leading-relaxed">
                    How well your system <strong>maintains performance</strong>{" "}
                    as <strong>load increases</strong>. It's about handling more
                    users and data without degradation.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Key Metrics</h4>
                  <ul className="space-y-3">
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
                         <div className="flex justify-between mb-1">
                          <span className="font-bold text-slate-700">{m.metric}</span>
                          <span className="text-slate-500">{m.value}</span>
                        </div>
                        <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded w-fit">
                          {m.ex}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                   <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Scaling Techniques</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Horizontal Scaling",
                      "Load Balancing",
                      "Sharding",
                      "Microservices",
                    ].map((item, index) => (
                      <span
                        key={index}
                        className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Critical Insight */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="bg-amber-100 p-3 rounded-xl">
                 <Target className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">
                  The Critical Insight
                </h3>
                <p className="text-lg text-amber-900/80 mb-6 leading-relaxed">
                  A system can be <strong className="text-amber-950">performant but not scalable</strong>, or <strong className="text-amber-950">scalable but not performant</strong>:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm">
                    <div className="font-bold text-red-600 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Performant, Not Scalable
                    </div>
                    <p className="text-sm text-slate-600">
                      Single powerful server responds in 10ms to 100 users, but
                      smashes into a wall and crashes at 10,000 users.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm">
                    <div className="font-bold text-red-600 mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Scalable, Not Performant
                    </div>
                    <p className="text-sm text-slate-600">
                      System handles 1M users easily but every request takes 5 seconds due to poor code or too many network hops.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <span className="font-bold">04</span>
                </div>
                DATA CONSISTENCY
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              CAP Theorem
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Selecting the right consistency model is fundamental. The CAP lens helps you categorize choices and explain trade-offs to stakeholders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
              <InteractiveCAP />
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Strategic Application
              </h3>
              <div className="space-y-6">
                <div>
                   <h4 className="font-bold text-slate-700 mb-2">Why it matters</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                     To match a database to the business requirements. Do you need absolute truth (Consistency) or 'always on' (Availability)?
                    </p>
                </div>
                
                 <div>
                   <h4 className="font-bold text-slate-700 mb-2">Real-world examples</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-600">CP (Consistency):</span> Banking, Inventory. You can't sell what you don't have.
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-green-600">AP (Availability):</span> Social feeds, Likes. It's okay if a like shows up 2 seconds later.
                      </li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* ============================================ */}
        {/* SECTION 4: Scaling Models */}
        {/* ============================================ */}
        <section
          ref={(element) => (sectionsReference.current[4] = element)}
          className="opacity-0 translate-y-8 transition-all duration-700 mb-24"
        >
          <div className="mb-12">
            <div className="inline-block">
              <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <span className="font-bold">05</span>
                </div>
                SCALING MODELS
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Vertical vs Horizontal Scaling
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
              Understand the trade-offs and how to choose the right approach for your service's lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-2">
              <ScalingDiagram />
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-white p-8 border border-slate-200 rounded-3xl shadow-sm h-full">
                <h3 className="text-2xl font-bold mb-6 text-slate-900">Decision Framework</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Maximize className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Vertical (Scale Up)</h4>
                      <p className="text-sm text-slate-600 mt-1">Easiest to start. Use for prototypes, internal tools, or DBs that are hard to shard.</p>
                    </div>
                  </div>

                   <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <Copy className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Horizontal (Scale Out)</h4>
                      <p className="text-sm text-slate-600 mt-1">Required for massive scale. Use for stateless app servers and distributed DBs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NINES AVAILABILITY REFERENCE */}
        <section className="py-16 bg-white rounded-3xl border border-slate-200 shadow-sm mb-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-slate-900">
                Availability "Nines" Reference
              </h3>
              <p className="text-slate-500 mt-2">
                Quick lookup for downtime allowances
              </p>
            </div>

            {/* compute rows in-page for readability */}
            {(() => {
              const rows = [
                { notation: "99%", label: "2 nines", percent: 99 },
                { notation: "99.9%", label: "3 nines", percent: 99.9 },
                { notation: "99.99%", label: "4 nines", percent: 99.99 },
                { notation: "99.999%", label: "5 nines", percent: 99.999 },
              ].map((r) => {
                const uptime = r.percent / 100
                const minsPerYear = (1 - uptime) * 365 * 24 * 60
                const minsPerMonth = minsPerYear / 12
                const fmt = (mins) => {
                  if (mins >= 24 * 60) return `${(mins / (24 * 60)).toFixed(2)} days`
                  if (mins >= 60) return `${(mins / 60).toFixed(2)} hours`
                  return `${mins.toFixed(2)} min`
                }
                return {
                  ...r,
                  perYear: fmt(minsPerYear),
                  perMonth: fmt(minsPerMonth),
                }
              })

              return (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Availability</th>
                        <th className="px-6 py-4">Jargon</th>
                        <th className="px-6 py-4">Downtime / Year</th>
                        <th className="px-6 py-4">Downtime / Month</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map((r, i) => (
                        <tr key={r.label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                          <td className="px-6 py-4 font-bold text-blue-600">{r.notation}</td>
                          <td className="px-6 py-4 text-slate-600">{r.label}</td>
                          <td className="px-6 py-4 text-slate-600 font-mono text-xs">{r.perYear}</td>
                          <td className="px-6 py-4 text-slate-600 font-mono text-xs">{r.perMonth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })()}
          </div>
        </section>

        {/* Interactive Demos Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Try It Yourself
            </h2>
            <p className="text-lg text-slate-600">
              Interactive tools to estimate system capacity and availability
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-1">
              <CapacityPlanner />
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-1">
              <AvailabilityCalculator />
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button onClick={() => nav("/")} className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Previous: Home
            </button>
            <button onClick={() => nav("/networking")} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center gap-2">
              Next: Networking <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
