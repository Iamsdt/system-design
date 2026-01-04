import { useNavigate } from "react-router-dom"
import { Database, Code, Terminal, Server } from "lucide-react"

/**
 * Cheat Sheets listing page
 */
export default function CheatSheets() {
  const nav = useNavigate()

  const cheatSheets = [
    {
      id: "postgresql",
      title: "PostgreSQL",
      description: "Complete reference for PostgreSQL commands, functions, and best practices",
      icon: Database,
      color: "green",
      category: "Database",
      tags: ["SQL", "Database", "PostgreSQL", "DDL", "DML"],
      href: "/cheat-sheets/postgresql",
    },
    // Add more cheat sheets here in the future
    // {
    //   id: "redis",
    //   title: "Redis",
    //   description: "Redis commands and data structures reference",
    //   icon: Server,
    //   color: "red",
    //   category: "Database",
    //   tags: ["Cache", "NoSQL", "Redis"],
    //   href: "/cheat-sheets/redis",
    // },
  ]

  const categories = ["All", "Database", "API", "DevOps", "Frontend"]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative gradient-overlay py-20 md:py-32 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <Code className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                Developer Resources
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Cheat Sheets & <span className="text-gradient">Quick References</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 mx-auto">
              Quick reference guides for common technologies, commands, and best practices.
              Perfect for developers who need fast access to syntax and examples.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => nav("/")}
                className="btn-secondary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-purple-300 transition-colors text-sm font-medium text-slate-700"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Cheat Sheets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cheatSheets.map((sheet) => {
            const IconComponent = sheet.icon
            const colorClasses = {
              green: "bg-green-100 text-green-700 border-green-200",
              blue: "bg-blue-100 text-blue-700 border-blue-200",
              red: "bg-red-100 text-red-700 border-red-200",
              purple: "bg-purple-100 text-purple-700 border-purple-200",
              orange: "bg-orange-100 text-orange-700 border-orange-200",
            }

            return (
              <div
                key={sheet.id}
                className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300 cursor-pointer"
                onClick={() => nav(sheet.href)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colorClasses[sheet.color]} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {sheet.title}
                    </h3>
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      {sheet.category}
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-4">
                  {sheet.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {sheet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nav(sheet.href)
                  }}
                  className="w-full btn-primary text-sm"
                >
                  View Cheat Sheet
                </button>
              </div>
            )
          })}
        </div>

        {/* Empty State for Future Cheat Sheets */}
        {cheatSheets.length === 0 && (
          <div className="text-center py-16">
            <Terminal className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No cheat sheets yet
            </h3>
            <p className="text-slate-600">
              Check back soon for more cheat sheets!
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16  from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Want to contribute?
          </h3>
          <p className="text-slate-600 mb-6">
            Have a cheat sheet idea? We're always looking to add more resources!
          </p>
          <a
            href="https://github.com/Iamsdt/system-design-code"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  )
}

