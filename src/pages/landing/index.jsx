import { useNavigate } from "react-router-dom"
import { 
  BookOpen, 
  Calculator, 
  Briefcase, 
  FileText, 
  Github, 
  Linkedin, 
  Mail,
  Server, 
  TrendingUp, 
  Scale, 
  Layers, 
  Globe, 
  Zap, 
  Rocket, 
  Database, 
  HardDrive, 
  Copy, 
  ShieldCheck,
  ArrowRight,
  Monitor,
  CheckCircle,
  Code
} from "lucide-react"

/**
 * Landing page component for System Design learning platform
 * Created by Shudipto Trafder — VP of Engineering, 10xScale
 */
export default function Landing() {
  const nav = useNavigate()

  return (
    <div className="page-transition bg-white">
      {/* Hero Section - Modern & Professional */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8 transform hover:scale-105 transition-transform duration-300">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Interactive System Design Learning Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Master System Design &<br />
              <span className="text-transparent bg-clip-text  from-blue-600 to-indigo-600"> 
                Cloud Architecture
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-600 mb-10 mx-auto leading-relaxed">
              Learn through <span className="font-semibold text-slate-900">interactive tutorials</span> and <span className="font-semibold text-slate-900">real-world examples</span>. 
              Build production-ready distributed systems with confidence.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm font-medium">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-slate-900 font-bold">10+</span>
                <span className="text-slate-500">Interactive Topics</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <ActivityIcon className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 font-bold">Live</span>
                <span className="text-slate-500">Demos & Calculators</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span className="text-slate-900 font-bold">Real-World</span>
                <span className="text-slate-500">Case Studies</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => nav("/foundations")}
                className="group w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                Start Learning
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => nav("/cheat-sheets")} 
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 font-bold rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5 text-slate-500" />
                Quick References
              </button>
            </div>

            {/* Creator Attribution Card */}
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full  from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                ST
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">Shudipto Trafder</p>
                <p className="text-xs text-slate-500">VP of Engineering at 10xScale</p>
              </div>
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-100">
                <a href="https://github.com/Iamsdt" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/in/iamsdt" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://medium.com/@iamsdt" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className="relative py-16 bg-white border-y border-slate-100">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 mb-6 group-hover:bg-blue-100 transition-colors">
                  <Monitor className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Hands-On Learning</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Interactive calculators, live demos, and real-time visualizations for practical understanding
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50 mb-6 group-hover:bg-indigo-100 transition-colors">
                  <CheckCircle className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Production-Ready</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Learn patterns and practices used by top tech companies to build scalable systems
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-50 mb-6 group-hover:bg-purple-100 transition-colors">
                  <Layers className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Comprehensive Coverage</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  From fundamentals to advanced topics - networking, data architecture, and cloud patterns
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tutorials Section */}
      <section className="relative py-20 md:py-28 bg-white">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Interactive Learning Experience
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                Learn by <span className="text-transparent bg-clip-text  from-blue-600 to-indigo-600">Building</span>
              </h2>
              <p className="text-lg text-slate-500 mx-auto leading-relaxed">
                Master system design through hands-on tutorials with live demos, 
                interactive calculators, and real-time visualizations
              </p>
            </div>

            {/* Active Tutorials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Foundations Tutorial Card */}
              <div
                onClick={() => nav("/foundations")}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
              >
                <div className="relative z-10">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                      <Layers className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded uppercase tracking-wider flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div>
                      LIVE
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    Foundations & Back-of-Envelope
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    Capacity planning, scaling strategies, and core architectural patterns for building robust systems.
                  </p>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {[
                      { icon: <Server className="w-5 h-5 text-blue-500" />, label: "Client-Server" },
                      { icon: <Calculator className="w-5 h-5 text-indigo-500" />, label: "Calculator" },
                      { icon: <TrendingUp className="w-5 h-5 text-purple-500" />, label: "Scaling" },
                      { icon: <Scale className="w-5 h-5 text-pink-500" />, label: "Trade-offs" },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xl">{feature.icon}</span>
                        <span className="text-sm font-semibold text-slate-700">{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <ActivityIcon className="w-3.5 h-3.5" />
                        ~30 min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        10 Topics
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Networking Tutorial Card */}
              <div
                onClick={() => nav("/networking")}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-100 text-blue-700 rounded uppercase tracking-wider flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                      NEW
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                    Networking & Edge
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    OSI model, DNS resolution, TCP/UDP protocols, and Content Delivery Networks for global scale.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      { icon: <Layers className="w-5 h-5 text-blue-500" />, label: "OSI Model" },
                      { icon: <Globe className="w-5 h-5 text-indigo-500" />, label: "DNS Flow" },
                      { icon: <Zap className="w-5 h-5 text-purple-500" />, label: "Protocols" },
                      { icon: <Rocket className="w-5 h-5 text-pink-500" />, label: "CDN & Edge" },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xl">{feature.icon}</span>
                        <span className="text-sm font-semibold text-slate-700">{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <ActivityIcon className="w-3.5 h-3.5" />
                        ~45 min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        7 Topics
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Data Architecture Tutorial Card */}
              <div
                onClick={() => nav("/data-architecture")}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-purple-200 transition-all duration-300 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-100 group-hover:scale-110 transition-transform">
                      <Database className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-100 text-purple-700 rounded uppercase tracking-wider flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></div>
                      LIVE
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">
                    Data Architecture & Storage
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    Database selection, caching strategies, sharding techniques, and compliance considerations.
                  </p>

                  <div className="space-y-4 mb-8">
                    {[
                      { icon: <Database className="w-5 h-5 text-blue-500" />, label: "SQL vs NoSQL" },
                      { icon: <HardDrive className="w-5 h-5 text-indigo-500" />, label: "Storage Models" },
                      { icon: <Copy className="w-5 h-5 text-purple-500" />, label: "Replication" },
                      { icon: <ShieldCheck className="w-5 h-5 text-pink-500" />, label: "Compliance" },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xl">{feature.icon}</span>
                        <span className="text-sm font-semibold text-slate-700">{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <ActivityIcon className="w-3.5 h-3.5" />
                        ~60 min
                      </span>
                      <span className="flex items-center gap-1.5">
         
                        <BookOpen className="w-3.5 h-3.5" />
                        6 Topics
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cheat Sheets Card */}
              <div
                onClick={() => nav("/cheat-sheets")}
                className="group cursor-pointer relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center shadow-inner">
                    <FileText className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                      Cheat Sheets & References
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Quick reference guides for PostgreSQL, Redis, and more with syntax examples and best practices
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* View All Topics Card */}
              <div
                onClick={() => nav("/topics")}
                className="group cursor-pointer relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center shadow-inner">
                    <BookOpen className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      All Topics & Concepts
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Explore the complete catalog of system design topics with interactive demos and visualizations
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Creator Section */}
      <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Meet <span className="relative inline-block text-transparent bg-clip-text  from-blue-400 to-teal-400">
                  the Creator
                  <div className="absolute -bottom-2 left-0 w-full h-1  from-blue-400 to-teal-400"></div>
                </span>
              </h2>
            </div>

            {/* Creator Card */}
            <div className="bg-white/95 backdrop-blur rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10">
              <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-2xl  from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-blue-500/30 transform hover:rotate-3 transition-transform duration-300">
                    ST
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                    Shudipto Trafder
                  </h3>
                  <p className="text-blue-600 font-bold mb-6 text-lg flex items-center justify-center md:justify-start gap-2">
                    <Briefcase className="w-5 h-5" />
                    VP of Engineering at 10xScale
                  </p>
                  
                  <p className="text-slate-500 leading-relaxed mb-8 text-lg">
                    Leading engineering teams at 10xScale, I specialize in building reliable, scalable distributed systems 
                    and AI-driven tooling. My work includes multi-agent orchestration with AgentFlow, alongside creating 
                    open-source projects that help teams ship faster and operate with confidence.
                  </p>

                  {/* Projects */}
                  <div className="mb-10">
                    <h4 className="text-slate-900 font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
                      <Code className="w-5 h-5 text-blue-600" />
                      Featured Projects
                    </h4>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      {[
                        { name: "InjectQ", url: "https://github.com/10xHub/injectq" },
                        { name: "SnowflakeKit", url: "https://github.com/10xHub/snowflakekit" },
                        { name: "Style Guide", url: "https://github.com/10xHub/react-style-guide" },
                        { name: "AgentFlow", url: "https://github.com/10xHub/agentflow" },
                      ].map((project, index) => (
                        <a
                          key={index}
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-slate-50 text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-100"
                        >
                          {project.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-slate-900 font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Connect
                    </h4>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                      {[
                        { name: "GitHub", url: "https://github.com/Iamsdt", icon: <Github className="w-6 h-6" /> },
                        { name: "LinkedIn", url: "https://www.linkedin.com/in/iamsdt/", icon: <Linkedin className="w-6 h-6" /> },
                        { name: "Medium", url: "https://medium.com/@iamsdt", icon: <BookOpen className="w-6 h-6" /> },
                        { name: "Email", url: "mailto:shudiptotrafder@gmail.com", icon: <Mail className="w-6 h-6" /> },
                      ].map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all hover:-translate-y-0.5 font-medium text-sm"
                          aria-label={social.name}
                        >
                          {social.icon}
                          <span>{social.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
