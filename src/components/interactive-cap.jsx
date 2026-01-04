import React, { useState } from "react"

export default function InteractiveCAP({ className }) {
  const [choice, setChoice] = useState("CP")

  const captions = {
    CA: {
      title: "Consistency + Availability (CA)",
      about:
        "CA means strong consistency across nodes and availability - but cannot tolerate partitions. Common in single-region SQL systems.",
    },
    CP: {
      title: "Consistency + Partition tolerance (CP)",
      about:
        "CP sacrifices availability under network partitions to ensure strong consistency. Use for systems needing strict correctness like banking.",
    },
    AP: {
      title: "Availability + Partition tolerance (AP)",
      about:
        "AP sacrifices strict consistency to remain available during partitions, useful for systems like social feeds that favor responsiveness.",
    },
  }

  return (
    <div
      className={`bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ${className || ""}`}
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-100">
        <div className="text-3xl">🎯</div>
        <div className="flex-1">
          <h4 className="text-2xl font-bold  from-purple-600 to-pink-600 bg-clip-text text-transparent">
            CAP Theorem — Interactive
          </h4>
          <div className="text-sm text-slate-600 mt-1">
            Select which two properties you prioritize and see consequences
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 justify-center">
          {["CA", "CP", "AP"].map((k) => (
            <button
              key={k}
              onClick={() => setChoice(k)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                choice === k
                  ? " from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-102"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <div className=" from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5 shadow-inner">
            <h5 className="font-bold text-lg text-purple-900 mb-2">
              {captions[choice].title}
            </h5>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              {captions[choice].about}
            </p>
            <div className="mt-4 pt-3 border-t border-purple-200">
              <div className="text-xs font-semibold text-purple-700 mb-2">
                ⚖️ Trade-offs:
              </div>
              {choice === "CA" && (
                <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
                  <li>Fast reads, strict data correctness.</li>
                  <li>System unavailable if partitioned.</li>
                </ul>
              )}
              {choice === "CP" && (
                <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
                  <li>Consistent data across nodes.</li>
                  <li>
                    May become unavailable during partitions or leader
                    elections.
                  </li>
                </ul>
              )}
              {choice === "AP" && (
                <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
                  <li>Highly available during network issues.</li>
                  <li>
                    Accepts eventual consistency or conflict resolution
                    mechanisms.
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-4">
          <svg
            width="160"
            height="140"
            viewBox="0 0 140 120"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="rgba(147, 51, 234, 0.15)"
              stroke="#9333ea"
              strokeWidth="2.5"
              opacity="0.95"
            />
            <circle
              cx="100"
              cy="40"
              r="36"
              fill="rgba(236, 72, 153, 0.15)"
              stroke="#ec4899"
              strokeWidth="2.5"
              opacity="0.95"
            />
            <circle
              cx="70"
              cy="86"
              r="36"
              fill="rgba(168, 85, 247, 0.15)"
              stroke="#a855f7"
              strokeWidth="2.5"
              opacity="0.95"
            />
            <text x="20" y="43" fontSize="10" fontWeight="700" fill="#9333ea">
              Consistency
            </text>
            <text x="103" y="43" fontSize="10" fontWeight="700" fill="#ec4899">
              Availability
            </text>
            <text x="54" y="94" fontSize="10" fontWeight="700" fill="#a855f7">
              Partition Tolerance
            </text>
            {choice === "CA" && (
              <circle cx="67" cy="44" r="16" fill="#9333ea" opacity="0.4" />
            )}
            {choice === "CP" && (
              <circle cx="60" cy="62" r="16" fill="#a855f7" opacity="0.4" />
            )}
            {choice === "AP" && (
              <circle cx="88" cy="52" r="16" fill="#ec4899" opacity="0.4" />
            )}
          </svg>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-purple-100  from-purple-50/50 to-pink-50/50 rounded-lg p-4 text-sm text-slate-700">
        <p className="mb-2">
          <span className="font-semibold text-purple-700">🤔 Why:</span>{" "}
          Understanding the CAP theorem helps you pick a database and
          replication strategy based on business constraints.
        </p>
        <p className="mb-2">
          <span className="font-semibold text-purple-700">💆‍♀️ How:</span> For
          strongly consistent systems (banking, inventory), pick CP. For
          globally distributed, high-availability apps (social feeds), pick AP
          with conflict handling.
        </p>
        <p>
          <span className="font-semibold text-purple-700">⏰ When:</span> Use
          this during DB selection and replication strategy planning.
        </p>
      </div>
    </div>
  )
}
