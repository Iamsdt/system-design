import { useNavigate } from "react-router-dom"

/**
 * Landing page component for System Design learning platform
 * Created by Shudipto Trafder
 */
export default function Landing() {
  const nav = useNavigate()

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="gradient-overlay py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <span className="text-sm font-medium text-blue-700">
                Interactive System Design Learning
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Master System Design &
              <span className="text-gradient"> Cloud Architecture</span>
            </h1>

            <div className="mb-6">
              <p className="text-lg text-slate-700 font-medium mb-2">
                Created by Shudipto Trafder
              </p>
              <p className="text-sm text-slate-500">
                Software Engineer | Open Source Contributor | Cloud Enthusiast
              </p>
            </div>

            <p className="text-lg md:text-xl text-slate-600 mb-8">
              Learn system design through interactive tutorials and real-world examples. 
              Built with modern React patterns and focused on practical, hands-on learning 
              for distributed systems, scalability, and cloud architecture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={() => nav("/foundations")}
                className="btn-primary inline-flex items-center gap-2"
              >
                <span>Start Learning</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>

              <button onClick={() => nav("/networking")} className="btn-secondary">
                Explore Tutorials
              </button>
            </div>

            {/* Creator Info Links */}
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
              <a
                href="https://github.com/Iamsdt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/iamsdt/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://medium.com/@iamsdt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
                <span>Medium</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tutorials Section - NEW */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 border border-indigo-200 mb-4">
                <svg
                  className="w-4 h-4 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <span className="text-sm font-medium text-indigo-700">
                  New: Interactive Learning
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Interactive Tutorials
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Dive deep into system design concepts with our interactive
                tutorials featuring live demos, calculators, and visualizations
              </p>
            </div>

            {/* Active Tutorials Grid */}
            <div className="max-w-7xl mx-auto mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Foundations Tutorial Card */}
                <div
                  onClick={() => nav("/foundations")}
                  className="group cursor-pointer bg-white border-2 border-blue-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 flex flex-col"
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          Foundations & Back-of-Envelope
                        </h3>
                        <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                          Live
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Capacity planning, scaling strategies, and core
                        architectural patterns.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
                    {[
                      { icon: "💻", label: "Client-Server" },
                      { icon: "🧮", label: "Calculator" },
                      { icon: "⬆️", label: "Scaling" },
                      { icon: "📊", label: "Trade-offs" },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <span className="text-xl">{feature.icon}</span>
                        <span className="font-medium">{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                      ~30 min • 10 Topics
                    </span>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
                      <span>Start Learning</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Networking Tutorial Card (NEW) */}
                <div
                  onClick={() => nav("/networking")}
                  className="group cursor-pointer bg-white border-2 border-indigo-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-400 flex flex-col"
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-3xl">🌐</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Networking & Edge
                        </h3>
                        <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                          New
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        OSI model, DNS resolution, TCP/UDP, and Content Delivery
                        Networks.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
                    {[
                      { icon: "📡", label: "OSI Model" },
                      { icon: "🌍", label: "DNS Flow" },
                      { icon: "⚡", label: "Protocols" },
                      { icon: "🚀", label: "CDN & Edge" },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <span className="text-xl">{feature.icon}</span>
                        <span className="font-medium">{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                      ~45 min • 7 Topics
                    </span>
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-4 transition-all">
                      <span>Start Learning</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Cards */}
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Data Management",
                    icon: "💾",
                    status: "Coming Soon",
                  },
                  {
                    title: "Distributed Systems",
                    icon: "🔗",
                    status: "Coming Soon",
                  },
                ].map((tutorial, index) => (
                  <div
                    key={index}
                    className="bg-white/60 border border-slate-200 rounded-xl p-6 opacity-75"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{tutorial.icon}</span>
                      <h4 className="font-semibold text-slate-700">
                        {tutorial.title}
                      </h4>
                    </div>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                      {tutorial.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Creator Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                About the Creator
              </h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    ST
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Shudipto Trafder
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    Software Engineer | Open Source Developer
                  </p>
                  
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Passionate about building scalable systems and creating educational content. 
                    Currently focusing on modern development tools and cloud architecture. 
                    Active contributor to open-source projects including dependency injection frameworks, 
                    distributed ID generators, and React development guides.
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      🐍 Python
                    </span>
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      ⚛️ React
                    </span>
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      ☁️ Cloud Architecture
                    </span>
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      🏗️ System Design
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">136+</div>
                    <div className="text-sm text-slate-600">GitHub Repositories</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">63+</div>
                    <div className="text-sm text-slate-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                    <div className="text-sm text-slate-600">Open Source Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why This Platform?
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Learn system design with practical, hands-on approach
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Interactive Learning
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Hands-on demos, calculators, and visualizations that bring 
                  complex system design concepts to life
                </p>
              </div>

              <div className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Modern Tech Stack
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Built with React 19, Tailwind CSS, and modern development 
                  practices for optimal learning experience
                </p>
              </div>

              <div className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Practical Examples
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Real-world scenarios and architectural patterns used in 
                  production systems at scale
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
