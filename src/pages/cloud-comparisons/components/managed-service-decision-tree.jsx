import PropTypes from "prop-types"
import React, { useState } from "react"

/**
 * Decision Step component
 */
const DecisionStep = ({ current, onOption }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h5 className="text-xl font-bold text-slate-800 text-center">
      {current.question}
    </h5>
    <div className="grid gap-3">
      {current.options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onOption(opt)}
          className="w-full p-4 text-left rounded-xl border-2 border-slate-100 hover:border-purple-400 hover:bg-purple-50 transition-all group"
        >
          <div className="font-bold text-slate-700 group-hover:text-purple-700">
            {opt.label}
          </div>
        </button>
      ))}
    </div>
  </div>
)

DecisionStep.propTypes = {
  current: PropTypes.shape({
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        next: PropTypes.string,
        result: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  onOption: PropTypes.func.isRequired,
}

/**
 * Result Step component
 */
const ResultStep = ({ result, onReset }) => (
  <div className="text-center space-y-6 animate-in zoom-in duration-500">
    <div className="inline-block p-4 bg-green-50 rounded-full text-green-600 text-4xl mb-2">
      🎯
    </div>
    <div>
      <div className="text-sm font-bold text-slate-400 uppercase mb-1">
        Recommended Service
      </div>
      <div className="text-2xl font-black text-slate-900">{result}</div>
    </div>
    <button
      onClick={onReset}
      className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all"
    >
      Start Over
    </button>
  </div>
)

ResultStep.propTypes = {
  result: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
}

/**
 * Managed Service Decision Tree component
 * Helps choose the right managed service based on requirements
 */
const ManagedServiceDecisionTree = () => {
  const [step, setStep] = useState("start")
  const [history, setHistory] = useState([])

  const DECISIONS = {
    start: {
      question: "What is your primary workload type?",
      options: [
        { label: "Compute / App Logic", next: "compute" },
        { label: "Data Storage", next: "data" },
        { label: "Messaging / Integration", next: "messaging" },
      ],
    },
    compute: {
      question: "How much control do you need over the OS/Runtime?",
      options: [
        {
          label: "Full Control (VMs)",
          result: "Compute Engine / EC2 / Azure VM",
        },
        { label: "Orchestration (K8s)", result: "GKE / EKS / AKS" },
        { label: "Minimal (Serverless)", next: "serverless_compute" },
      ],
    },
    serverless_compute: {
      question: "Is it a long-running process or event-driven?",
      options: [
        {
          label: "Web App / API",
          result: "Cloud Run / App Runner / Container Apps",
        },
        {
          label: "Small Event Handler",
          result: "Cloud Functions / Lambda / Azure Functions",
        },
      ],
    },
    data: {
      question: "What is the data structure?",
      options: [
        { label: "Relational (SQL)", result: "Cloud SQL / RDS / Azure SQL" },
        {
          label: "Key-Value / Document",
          result: "Firestore / DynamoDB / Cosmos DB",
        },
        {
          label: "Analytical / Big Data",
          result: "BigQuery / Redshift / Synapse",
        },
      ],
    },
    messaging: {
      question: "What is the delivery pattern?",
      options: [
        {
          label: "One-to-Many (Pub/Sub)",
          result: "Pub/Sub / SNS / Event Grid",
        },
        {
          label: "Point-to-Point (Queue)",
          result: "Pub/Sub / SQS / Service Bus",
        },
        {
          label: "High-Volume Streaming",
          result: "Dataflow / Kinesis / Event Hubs",
        },
      ],
    },
  }

  const handleOption = (opt) => {
    if (opt.result) {
      setStep({ result: opt.result })
    } else {
      setHistory([...history, step])
      setStep(opt.next)
    }
  }

  const handleReset = () => {
    setStep("start")
    setHistory([])
  }

  const handleBack = () => {
    const previous = history[history.length - 1]
    setStep(previous)
    setHistory(history.slice(0, -1))
  }

  const current = DECISIONS[step]

  return (
    <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-xl min-h-[400px] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl">
          🌳
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">
            Service Decision Tree
          </h4>
          <div className="text-xs text-slate-500">
            Find the right managed service
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {current ? (
          <DecisionStep current={current} onOption={handleOption} />
        ) : (
          <ResultStep result={step.result} onReset={handleReset} />
        )}
      </div>

      {history.length > 0 && current && (
        <button
          onClick={handleBack}
          className="mt-6 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
        >
          ← Back
        </button>
      )}
    </div>
  )
}

export default ManagedServiceDecisionTree
