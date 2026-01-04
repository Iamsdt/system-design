import { useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Database, ArrowLeft } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import pgsqlRaw from "../../../pgsql.md?raw"

/**
 * PostgreSQL Cheat Sheet page
 */
export default function PostgreSQLCheatSheet() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen  from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative gradient-overlay py-20 md:py-32 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-6">
              <Database className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Database Cheat Sheet
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              PostgreSQL <span className="text-gradient">Cheat Sheet</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 mx-auto">
              Complete reference for PostgreSQL commands, functions, and best practices.
              From basic queries to advanced features like window functions and partitioning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => nav("/cheat-sheets")}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cheat Sheets
              </button>
              <button
                onClick={() => nav("/")}
                className="btn-tertiary"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg">
          <div className="prose prose-slate max-w-none 
            prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mb-4 prose-headings:mt-8
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:border-b prose-h1:border-slate-200 prose-h1:pb-4
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-slate-800
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-slate-800
            prose-p:text-slate-700 prose-p:mb-4 prose-p:leading-relaxed
            prose-strong:text-slate-900 prose-strong:font-semibold
            prose-code:text-sm prose-code:bg-slate-100 prose-code:text-blue-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
            prose-pre:bg-slate-50 prose-pre:p-0 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-slate-200
            prose-pre code:bg-transparent prose-pre code:p-0
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:text-slate-700
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:text-slate-700
            prose-li:mb-2 prose-li:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline prose-a:font-medium hover:prose-a:text-blue-700 hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
            prose-table:w-full prose-table:border-collapse prose-table:mb-6 prose-table:shadow-sm
            prose-th:bg-slate-100 prose-th:border prose-th:border-slate-300 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-slate-900
            prose-td:border prose-td:border-slate-300 prose-td:px-4 prose-td:py-3 prose-td:text-slate-700
            prose-tr:hover:bg-slate-50
          ">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full border-collapse border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className=" from-slate-100 to-slate-50">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-slate-200">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-slate-50 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b border-slate-300 bg-slate-100">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-sm text-slate-700 border-b border-slate-200 align-top">
                    {children}
                  </td>
                ),
                code: ({ inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '')
                  
                  // If it's a code block (not inline), use syntax highlighter
                  if (!inline) {
                    const language = match ? match[1] : 'sql'
                    return (
                      <div className="my-4 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <SyntaxHighlighter
                          language={language}
                          style={oneLight}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                            background: '#f8fafc',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    )
                  }
                  
                  // Inline code
                  return (
                    <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                },
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-slate-900 mb-6 mt-8 pb-4 border-b border-slate-200">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">
                    {children}
                  </h3>
                ),
              }}
            >
              {pgsqlRaw}
            </ReactMarkdown>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={() => nav("/cheat-sheets")}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cheat Sheets
          </button>
          <button
            onClick={() => nav("/data-architecture")}
            className="btn-primary"
          >
            Learn Data Architecture →
          </button>
        </div>
      </div>
    </div>
  )
}

