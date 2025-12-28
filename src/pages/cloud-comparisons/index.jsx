import {
  Cloud,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  Layers,
  Cpu,
  Info,
} from "lucide-react"
import React, { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

import CloudCostEstimator from "./components/cloud-cost-estimator"
import ManagedServiceDecisionTree from "./components/managed-service-decision-tree"
import ServiceComparisonMatrix from "./components/service-comparison-matrix"
import { MultiCloudStrategies } from "./components/multi-cloud-strategies"
import { CloudNativeVsAgnostic } from "./components/cloud-native-vs-agnostic"
import { HybridCloud } from "./components/hybrid-cloud"
import { CloudNetworking } from "./components/cloud-networking"
import { CloudMigrationPatterns } from "./components/cloud-migration-patterns"
import { FinOpsDeepDive } from "./components/finops-deep-dive"
import { CloudGovernance } from "./components/cloud-governance"

/**
 * Hero Section component
 */
const HeroSection = () => (
  <div className="relative bg-slate-900 py-24 overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
    </div>

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="flex items-center gap-3 mb-6 reveal opacity-0 translate-y-10 transition-all duration-700">
        <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm">
          <Cloud className="w-6 h-6 text-blue-400" />
        </div>
        <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">
          Module 09
        </span>
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight reveal opacity-0 translate-y-10 transition-all duration-700 delay-100">
        Cloud Service <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Comparisons
        </span>
      </h1>

      <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed reveal opacity-0 translate-y-10 transition-all duration-700 delay-200">
        A deep dive into GCP, AWS, and Azure with a &quot;managed-first&quot;
        bias. Learn how to choose the right services to minimize operational
        overhead.
      </p>

      <div className="flex flex-wrap gap-4 reveal opacity-0 translate-y-10 transition-all duration-700 delay-300">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-slate-300 text-sm">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          Managed-First Bias
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-slate-300 text-sm">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          Cross-Cloud Mapping
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-slate-300 text-sm">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          Cost Optimization
        </div>
      </div>
    </div>
  </div>
)

/**
 * Philosophy Card component
 */
const PhilosophyCard = ({ item, index }) => (
  <div
    key={item.title}
    className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 reveal opacity-0 translate-y-10 transition-all duration-700"
    style={{ transitionDelay: `${index * 100}ms` }}
  >
    <div
      className={`w-12 h-12 rounded-xl bg-${item.color}-50 flex items-center justify-center mb-6`}
    >
      {item.icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
  </div>
)

/**
 * Deep Dive Section component
 */
const DeepDiveSection = () => (
  <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white mb-24 reveal opacity-0 translate-y-10 transition-all duration-700">
    <div className="max-w-3xl">
      <h2 className="text-3xl font-black mb-6">
        The &quot;Managed-First&quot; Philosophy
      </h2>
      <div className="space-y-6 text-slate-400 leading-relaxed">
        <p>
          In modern system design, the goal is to maximize the time spent on
          business logic and minimize time spent on infrastructure maintenance.
          This is why we advocate for a{" "}
          <span className="text-blue-400 font-bold">Managed-First</span>{" "}
          approach.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <h4 className="text-white font-bold flex items-center gap-2">
              <CheckCircle2 className="text-green-400 w-5 h-5" />
              Why Managed?
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• Automated patching &amp; security updates</li>
              <li>• Built-in high availability &amp; backups</li>
              <li>• Pay-as-you-go pricing models</li>
              <li>• Faster time-to-market</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold flex items-center gap-2">
              <Info className="text-blue-400 w-5 h-5" />
              When to go IaaS?
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• Legacy software with OS dependencies</li>
              <li>• Highly specific hardware requirements</li>
              <li>• Extreme cost optimization at massive scale</li>
              <li>• Regulatory air-gapping needs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
)

/**
 * Cloud Service Comparisons Page
 * Module 9: Cloud Service Comparisons (managed-first bias)
 */
const CloudComparisonsPage = () => {
  const observerReference = useRef(null)

  useEffect(() => {
    observerReference.current = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-10")
          }
        })
      },
      { threshold: 0.1 }
    )

    window.document
      .querySelectorAll(".reveal")
      .forEach((element) => observerReference.current.observe(element))

    return () => observerReference.current?.disconnect()
  }, [])

  const philosophyItems = [
    {
      title: "Managed-First",
      desc: "Prioritize PaaS/SaaS over IaaS to reduce 'undifferentiated heavy lifting'.",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      color: "amber",
    },
    {
      title: "Cloud Native",
      desc: "Leverage provider-specific features for better performance and integration.",
      icon: <Layers className="w-6 h-6 text-blue-500" />,
      color: "blue",
    },
    {
      title: "Cost Aware",
      desc: "Understand pricing models to avoid 'cloud bill shock' early in design.",
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      color: "green",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {philosophyItems.map((item, index) => (
            <PhilosophyCard key={item.title} item={item} index={index} />
          ))}
        </div>

        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal opacity-0 translate-y-10 transition-all duration-700">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                <Layers className="text-blue-600" />
                Service Comparison Matrix
              </h2>
              <p className="text-slate-600">
                Mapping core services across the &quot;Big Three&quot; cloud
                providers. Focusing on managed alternatives to traditional
                infrastructure.
              </p>
            </div>
          </div>

          <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
            <ServiceComparisonMatrix />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                <BarChart3 className="text-purple-600" />
                Cloud Cost Estimator
              </h2>
              <p className="text-slate-600">
                Compare estimated monthly costs for a standard application stack
                across providers.
              </p>
            </div>
            <CloudCostEstimator />
          </div>

          <div className="reveal opacity-0 translate-y-10 transition-all duration-700 delay-200">
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                <Cpu className="text-pink-600" />
                Service Decision Tree
              </h2>
              <p className="text-slate-600">
                Not sure which service to use? Follow the logic to find the best
                managed fit.
              </p>
            </div>
            <ManagedServiceDecisionTree />
          </div>
        </div>

        <DeepDiveSection />

        <div className="space-y-24 mb-24">
          <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
              <Cloud className="text-blue-600" />
              Multi-Cloud Strategies
            </h2>
            <p className="text-slate-600 mb-8">
              Understand when to use multiple cloud providers and how to mitigate vendor lock-in.
            </p>
            <MultiCloudStrategies />
          </div>

          <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
              <Layers className="text-green-600" />
              Cloud-Native vs Cloud-Agnostic
            </h2>
            <p className="text-slate-600 mb-8">
              Deep dive into the trade-offs between cloud-native and cloud-agnostic approaches.
            </p>
            <CloudNativeVsAgnostic />
          </div>

          <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
              <Cpu className="text-purple-600" />
              Hybrid Cloud
            </h2>
            <p className="text-slate-600 mb-8">
              Learn how to integrate on-premises infrastructure with public cloud services.
            </p>
            <HybridCloud />
          </div>

          <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
              <Zap className="text-orange-600" />
              Cloud Networking
            </h2>
            <p className="text-slate-600 mb-8">
              Understand VPC peering, transit gateways, private links, and cross-cloud connectivity.
            </p>
            <CloudNetworking />
          </div>

          <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
              <ArrowRight className="text-indigo-600" />
              Cloud Migration Patterns
            </h2>
            <p className="text-slate-600 mb-8">
              The 6 R's of cloud migration: rehost, replatform, refactor, repurchase, retire, and retain.
            </p>
            <CloudMigrationPatterns />
          </div>

          <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
              <BarChart3 className="text-emerald-600" />
              FinOps Deep Dive
            </h2>
            <p className="text-slate-600 mb-8">
              Master cloud cost optimization with Reserved Instances, Savings Plans, and right-sizing strategies.
            </p>
            <FinOpsDeepDive />
          </div>

          <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
              <CheckCircle2 className="text-red-600" />
              Cloud Governance
            </h2>
            <p className="text-slate-600 mb-8">
              Implement landing zones, policy enforcement, and compliance automation at scale.
            </p>
            <CloudGovernance />
          </div>
        </div>

        <div className="flex flex-col items-center text-center reveal opacity-0 translate-y-10 transition-all duration-700">
          <div className="w-px h-24 bg-gradient-to-b from-transparent to-slate-300 mb-8" />
          <h2 className="text-3xl font-black mb-6">Ready to build?</h2>
          <p className="text-slate-600 max-w-xl mb-10">
            Now that you understand the cloud landscape, you can start designing
            your architecture using these managed building blocks.
          </p>
          <div className="flex gap-4">
            <Link
              to="/case-studies"
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 group"
            >
              Next: Case Studies
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CloudComparisonsPage
