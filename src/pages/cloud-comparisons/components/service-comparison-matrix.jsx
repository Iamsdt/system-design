import PropTypes from "prop-types"
import React, { useState } from "react"

const VIRTUAL_MACHINES = "Virtual Machines"

const COMPARISONS = {
  compute: [
    {
      feature: "Serverless Containers",
      gcp: "Cloud Run",
      aws: "App Runner / Fargate",
      azure: "Container Apps",
    },
    {
      feature: "Managed Kubernetes",
      gcp: "GKE",
      aws: "EKS",
      azure: "AKS",
    },
    {
      feature: "Functions (FaaS)",
      gcp: "Cloud Functions",
      aws: "Lambda",
      azure: "Azure Functions",
    },
    {
      feature: VIRTUAL_MACHINES,
      gcp: "Compute Engine",
      aws: "EC2",
      azure: VIRTUAL_MACHINES,
    },
  ],
  database: [
    {
      feature: "Relational (SQL)",
      gcp: "Cloud SQL",
      aws: "RDS",
      azure: "Azure SQL / DB for MySQL",
    },
    {
      feature: "Globally Distributed",
      gcp: "Spanner",
      aws: "DynamoDB (Global Tables)",
      azure: "Cosmos DB",
    },
    {
      feature: "NoSQL (Document)",
      gcp: "Firestore",
      aws: "DocumentDB",
      azure: "Cosmos DB (Mongo API)",
    },
    {
      feature: "Data Warehouse",
      gcp: "BigQuery",
      aws: "Redshift",
      azure: "Synapse Analytics",
    },
  ],
  messaging: [
    {
      feature: "Pub/Sub",
      gcp: "Pub/Sub",
      aws: "SNS / SQS",
      azure: "Service Bus / Event Grid",
    },
    {
      feature: "Streaming",
      gcp: "Dataflow / Pub/Sub",
      aws: "Kinesis",
      azure: "Event Hubs",
    },
    {
      feature: "Event Bus",
      gcp: "Eventarc",
      aws: "EventBridge",
      azure: "Event Grid",
    },
  ],
  storage: [
    {
      feature: "Object Storage",
      gcp: "Cloud Storage",
      aws: "S3",
      azure: "Blob Storage",
    },
    {
      feature: "File Storage",
      gcp: "Filestore",
      aws: "EFS",
      azure: "Azure Files",
    },
    {
      feature: "Managed Redis",
      gcp: "Memorystore",
      aws: "ElastiCache",
      azure: "Cache for Redis",
    },
  ],
}

/**
 * Comparison Table component
 */
const ComparisonTable = ({ category }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b-2 border-slate-100">
          <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase">
            Feature
          </th>
          <th className="py-3 px-2 text-xs font-bold text-blue-600 uppercase">
            GCP
          </th>
          <th className="py-3 px-2 text-xs font-bold text-orange-500 uppercase">
            AWS
          </th>
          <th className="py-3 px-2 text-xs font-bold text-blue-400 uppercase">
            Azure
          </th>
        </tr>
      </thead>
      <tbody>
        {COMPARISONS[category].map((row) => (
          <tr
            key={row.feature}
            className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
          >
            <td className="py-3 px-2 text-sm font-semibold text-slate-700">
              {row.feature}
            </td>
            <td className="py-3 px-2 text-sm text-slate-600">{row.gcp}</td>
            <td className="py-3 px-2 text-sm text-slate-600">{row.aws}</td>
            <td className="py-3 px-2 text-sm text-slate-600">{row.azure}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

ComparisonTable.propTypes = {
  category: PropTypes.string.isRequired,
}

/**
 * Service Comparison Matrix component
 * Module 9: Cloud Service Comparisons
 */
const ServiceComparisonMatrix = () => {
  const [category, setCategory] = useState("compute")

  return (
    <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl">
          📊
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">
            Service Comparison Matrix
          </h4>
          <div className="text-xs text-slate-500">
            Cross-cloud service mapping
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {Object.keys(COMPARISONS).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              category === cat
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <ComparisonTable category={category} />

      <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
        <div className="text-xs font-bold text-orange-800 uppercase mb-1">
          Managed-First Bias
        </div>
        <p className="text-xs text-orange-700 leading-relaxed">
          Always prefer managed services (Cloud Run, RDS, Pub/Sub) over
          self-hosting on VMs. It reduces operational toil and allows you to
          focus on business logic.
        </p>
      </div>
    </div>
  )
}

export default ServiceComparisonMatrix
