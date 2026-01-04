import { useState } from "react"
import { HelpCircle, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function CAPDecisionTree() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)

  const questions = [
    {
      id: 0,
      question: "Does your system need to handle network partitions?",
      info: "Network partitions are splits in the network where nodes cannot communicate. In distributed systems across datacenters, partitions WILL happen.",
      options: [
        { 
          text: "Yes - Multi-region or multi-datacenter", 
          next: 1,
          reasoning: "Distributed systems across networks must handle partitions"
        },
        { 
          text: "No - Single datacenter, reliable network", 
          next: "CA",
          reasoning: "Traditional RDBMS in a single datacenter can assume no partitions"
        }
      ]
    },
    {
      id: 1,
      question: "During a network partition, which is more important?",
      info: "You can't have both consistency and availability during a partition. Choose your priority.",
      options: [
        { 
          text: "Consistency - Data must always be correct", 
          next: "CP",
          reasoning: "Banking, inventory systems need correctness over availability"
        },
        { 
          text: "Availability - System must always respond", 
          next: "AP",
          reasoning: "Social media, caching systems prioritize responsiveness"
        }
      ]
    }
  ]

  const recommendations = {
    CA: {
      choice: "CA - Consistency + Availability",
      description: "Suitable for single-datacenter systems with reliable networks",
      color: "blue",
      databases: [
        { name: "PostgreSQL", type: "(Single instance or same-DC replicas)" },
        { name: "MySQL", type: "(Single instance or same-DC replicas)" },
        { name: "Oracle", type: "(Single instance)" },
        { name: "SQL Server", type: "(Single instance)" }
      ],
      useCases: [
        "Internal enterprise applications",
        "Single-region services",
        "Systems where network reliability is guaranteed",
        "Traditional OLTP workloads"
      ],
      tradeoffs: [
        { icon: "✓", text: "Strong consistency - data always correct", type: "pro" },
        { icon: "✓", text: "Simple architecture - no complex conflict resolution", type: "pro" },
        { icon: "✗", text: "Not resilient to network partitions", type: "con" },
        { icon: "✗", text: "Cannot span multiple datacenters reliably", type: "con" }
      ],
      warning: "In practice, CA systems don't exist in distributed environments because network partitions are inevitable. Most 'CA' systems are actually single-node or same-datacenter deployments."
    },
    CP: {
      choice: "CP - Consistency + Partition Tolerance",
      description: "Ensures data consistency even during network failures",
      color: "purple",
      databases: [
        { name: "MongoDB", type: "(with majority write concern)" },
        { name: "HBase", type: "(strongly consistent)" },
        { name: "Redis", type: "(with Redis Cluster)" },
        { name: "Zookeeper", type: "(consensus-based)" },
        { name: "etcd", type: "(Raft-based)" }
      ],
      useCases: [
        "Banking and financial transactions",
        "Inventory management systems",
        "Booking systems (hotel, flight)",
        "Configuration management",
        "Leader election services"
      ],
      tradeoffs: [
        { icon: "✓", text: "Strong consistency - no stale reads", type: "pro" },
        { icon: "✓", text: "Partition tolerant - handles network splits", type: "pro" },
        { icon: "✗", text: "May become unavailable during partitions", type: "con" },
        { icon: "✗", text: "Higher latency for cross-region operations", type: "con" }
      ],
      warning: "CP systems may reject writes or reads during network partitions to maintain consistency. Users might see 'Service Unavailable' errors."
    },
    AP: {
      choice: "AP - Availability + Partition Tolerance",
      description: "Prioritizes system availability over immediate consistency",
      color: "green",
      databases: [
        { name: "Cassandra", type: "(with eventual consistency)" },
        { name: "DynamoDB", type: "(with eventual consistency)" },
        { name: "Riak", type: "(with eventual consistency)" },
        { name: "CouchDB", type: "(with eventual consistency)" },
        { name: "Cosmos DB", type: "(with eventual consistency mode)" }
      ],
      useCases: [
        "Social media feeds and timelines",
        "Product catalogs and recommendations",
        "User analytics and metrics",
        "Content delivery and caching",
        "Collaborative applications (Google Docs style)"
      ],
      tradeoffs: [
        { icon: "✓", text: "Always available - responds even during partitions", type: "pro" },
        { icon: "✓", text: "Low latency - can read from nearest replica", type: "pro" },
        { icon: "✗", text: "Eventual consistency - temporary stale data", type: "con" },
        { icon: "✗", text: "Need conflict resolution mechanisms", type: "con" }
      ],
      warning: "AP systems accept that users might see stale data temporarily. You need strategies to handle conflicts when the same data is updated in different locations."
    }
  }

  const handleAnswer = (option) => {
    const newAnswers = [...answers, { question: currentQuestion, answer: option.text, reasoning: option.reasoning }]
    setAnswers(newAnswers)

    if (typeof option.next === "string") {
      // We have a result
      setResult(option.next)
    } else {
      // Go to next question
      setCurrentQuestion(option.next)
    }
  }

  const reset = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setResult(null)
  }

  const currentQ = questions.find(q => q.id === currentQuestion)
  const recommendation = result ? recommendations[result] : null

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className=" px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              CAP Theorem Decision Tree
            </h3>
            <p className="text-sm mt-1">
              Answer questions to find the right database consistency model
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Progress Bar */}
        {!result && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-slate-500">
                {answers.length} answered
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full  from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question or Result */}
        {!result ? (
          <div>
            {/* Current Question */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {currentQuestion + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 mb-3">
                    {currentQ.question}
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      {currentQ.info}
                    </p>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center font-bold text-slate-700 group-hover:text-purple-700 transition-colors">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 mb-1">
                          {option.text}
                        </div>
                        <div className="text-sm text-slate-600">
                          {option.reasoning}
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-slate-300 group-hover:text-purple-500 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Previous Answers */}
            {answers.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-4">Your Answers:</h5>
                <div className="space-y-3">
                  {answers.map((answer, index) => {
                    const q = questions.find(qu => qu.id === answer.question)
                    return (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-900">{q.question}</span>
                          <span className="text-slate-600 ml-2">→ {answer.answer}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Result */}
            <div className={`bg-${recommendation.color}-50 border-2 border-${recommendation.color}-200 rounded-2xl p-8 mb-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${recommendation.color}-500 text-white flex items-center justify-center`}>
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`text-2xl font-bold text-${recommendation.color}-900`}>
                    {recommendation.choice}
                  </h4>
                  <p className={`text-${recommendation.color}-700 mt-1`}>
                    {recommendation.description}
                  </p>
                </div>
              </div>

              {/* Warning */}
              {recommendation.warning && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900">
                    <strong>Important:</strong> {recommendation.warning}
                  </p>
                </div>
              )}

              {/* Tradeoffs */}
              <div className="mb-6">
                <h5 className="font-bold text-slate-900 mb-3">Trade-offs:</h5>
                <div className="grid md:grid-cols-2 gap-3">
                  {recommendation.tradeoffs.map((tradeoff, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        tradeoff.type === "pro" 
                          ? "bg-green-50 border border-green-200" 
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <span className={`text-lg ${
                        tradeoff.type === "pro" ? "text-green-600" : "text-red-600"
                      }`}>
                        {tradeoff.icon}
                      </span>
                      <span className={`text-sm ${
                        tradeoff.type === "pro" ? "text-green-800" : "text-red-800"
                      }`}>
                        {tradeoff.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Databases */}
              <div className="mb-6">
                <h5 className="font-bold text-slate-900 mb-3">Recommended Databases:</h5>
                <div className="grid md:grid-cols-2 gap-3">
                  {recommendation.databases.map((db, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="font-semibold text-slate-900">{db.name}</div>
                      <div className="text-sm text-slate-600">{db.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h5 className="font-bold text-slate-900 mb-3">Common Use Cases:</h5>
                <div className="grid md:grid-cols-2 gap-2">
                  {recommendation.useCases.map((useCase, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${recommendation.color}-500`} />
                      <span>{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Your Journey */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6">
              <h5 className="font-bold text-slate-900 mb-4">How we got here:</h5>
              <div className="space-y-3">
                {answers.map((answer, index) => {
                  const q = questions.find(qu => qu.id === answer.question)
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm mb-1">{q.question}</div>
                        <div className="text-sm text-slate-600">✓ {answer.answer}</div>
                        <div className="text-xs text-slate-500 mt-1 italic">{answer.reasoning}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={reset}
              className="w-full py-3 rounded-xl  from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
