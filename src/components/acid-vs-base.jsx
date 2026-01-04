import { useState } from 'react';
import { Database, Zap, Shield, TrendingUp, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const AcidVsBase = () => {
  const [selectedModel, setSelectedModel] = useState('acid');
  const [selectedScenario, setSelectedScenario] = useState('banking');

  const models = {
    acid: {
      name: 'ACID',
      fullForm: 'Atomicity, Consistency, Isolation, Durability',
      icon: Shield,
      color: 'blue',
      description: 'Strong consistency model prioritizing data correctness',
      principles: [
        {
          letter: 'A',
          name: 'Atomicity',
          description: 'All or nothing - transactions either complete fully or not at all',
          example: 'Bank transfer: Both debit and credit must succeed, or both fail',
          implementation: 'Transaction logs, rollback mechanisms'
        },
        {
          letter: 'C',
          name: 'Consistency',
          description: 'Data remains valid according to all rules and constraints',
          example: 'Account balance never goes negative (if rule enforced)',
          implementation: 'Constraints, triggers, validation rules'
        },
        {
          letter: 'I',
          name: 'Isolation',
          description: 'Concurrent transactions don\'t interfere with each other',
          example: 'Two people buying last ticket see consistent state',
          implementation: 'Locking, MVCC, isolation levels'
        },
        {
          letter: 'D',
          name: 'Durability',
          description: 'Once committed, data survives crashes and failures',
          example: 'Order confirmed = guaranteed saved even if server crashes',
          implementation: 'Write-ahead logging, replication'
        }
      ],
      databases: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server', 'CockroachDB'],
      pros: [
        'Data integrity guaranteed',
        'Predictable behavior',
        'Easier to reason about',
        'No data loss risk',
        'Strong guarantees'
      ],
      cons: [
        'Lower throughput',
        'Higher latency',
        'Complex distributed coordination',
        'Scaling challenges',
        'Availability trade-offs'
      ]
    },
    base: {
      name: 'BASE',
      fullForm: 'Basically Available, Soft state, Eventually consistent',
      icon: Zap,
      color: 'purple',
      description: 'Flexible consistency model prioritizing availability and performance',
      principles: [
        {
          letter: 'BA',
          name: 'Basically Available',
          description: 'System remains operational even if some parts fail',
          example: 'Facebook News Feed: Shows cached data if real-time update fails',
          implementation: 'Replication, partitioning, graceful degradation'
        },
        {
          letter: 'S',
          name: 'Soft State',
          description: 'State may change over time without input (as data propagates)',
          example: 'View counts, like counts may be approximate and update async',
          implementation: 'Asynchronous replication, eventual propagation'
        },
        {
          letter: 'E',
          name: 'Eventually Consistent',
          description: 'Given enough time, all replicas will converge to same value',
          example: 'Twitter follower count updates within seconds, not instantly',
          implementation: 'Conflict resolution, vector clocks, CRDTs'
        }
      ],
      databases: ['Cassandra', 'DynamoDB', 'MongoDB', 'Riak', 'Couchbase'],
      pros: [
        'High availability',
        'Better performance',
        'Easier to scale',
        'Lower latency',
        'Partition tolerance'
      ],
      cons: [
        'Data may be stale',
        'Conflict resolution needed',
        'Harder to reason about',
        'Temporary inconsistency',
        'Application complexity'
      ]
    }
  };

  const scenarios = {
    banking: {
      name: 'Banking / Financial Services',
      recommended: 'acid',
      icon: '🏦',
      requirements: [
        'Money transfers must be exact',
        'Account balances must be accurate',
        'No duplicate transactions',
        'Regulatory compliance required'
      ],
      why: 'Financial accuracy is non-negotiable. A single penny lost or duplicate transaction can have legal consequences. ACID guarantees are essential.',
      databases: 'PostgreSQL, CockroachDB, Oracle',
      consequence: 'Using BASE here = Wrong account balances, regulatory violations, lost customer trust'
    },
    social: {
      name: 'Social Media Feed',
      recommended: 'base',
      icon: '📱',
      requirements: [
        'Handle millions of concurrent users',
        'Low latency is critical',
        'Slight staleness acceptable',
        'High availability needed'
      ],
      why: 'Users prefer fast, available service over perfect consistency. Seeing a like count of 99 instead of 100 for a few seconds is acceptable.',
      databases: 'Cassandra, DynamoDB, MongoDB',
      consequence: 'Using ACID here = Slow feeds, poor scaling, frequent downtime during peak hours'
    },
    ecommerce: {
      name: 'E-commerce Inventory',
      recommended: 'hybrid',
      icon: '🛒',
      requirements: [
        'Inventory count must be accurate',
        'But product catalog can be eventually consistent',
        'High traffic during sales',
        'Payment processing needs ACID'
      ],
      why: 'Hybrid approach: Use ACID for inventory/payments, BASE for product catalog/recommendations. Best of both worlds.',
      databases: 'PostgreSQL (payments) + Redis (catalog cache) + Elasticsearch (search)',
      consequence: 'Pure ACID = Can\'t scale during Black Friday. Pure BASE = Overselling products'
    },
    analytics: {
      name: 'Analytics Dashboard',
      recommended: 'base',
      icon: '📊',
      requirements: [
        'Handle massive data volume',
        'Approximate counts acceptable',
        'Query speed more important than accuracy',
        'Historical data, not real-time decisions'
      ],
      why: 'Analytics often deals with approximate data. Knowing you have "~10 million users" vs "exactly 10,234,567" rarely matters.',
      databases: 'ClickHouse, BigQuery, Redshift',
      consequence: 'Using ACID here = Expensive, slow queries, can\'t handle big data scale'
    },
    iot: {
      name: 'IoT Sensor Data',
      recommended: 'base',
      icon: '📡',
      requirements: [
        'Millions of writes per second',
        'Occasional data loss acceptable',
        'Real-time not critical',
        'Historical trends matter more'
      ],
      why: 'Losing a few temperature readings from millions is acceptable. Availability and write throughput are critical.',
      databases: 'InfluxDB, TimescaleDB, Cassandra',
      consequence: 'Using ACID here = Can\'t handle IoT write volume, expensive at scale'
    }
  };

  const selectedModelData = models[selectedModel];
  const selectedScenarioData = scenarios[selectedScenario];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">ACID vs BASE: The Fundamental Trade-off</h3>
        <p className="text-gray-600">
          Choose between strong consistency (ACID) or high availability (BASE)
        </p>
      </div>

      {/* Model Selector */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setSelectedModel('acid')}
          className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all ${
            selectedModel === 'acid'
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <Shield className={`w-6 h-6 ${selectedModel === 'acid' ? 'text-blue-600' : 'text-gray-400'}`} />
          <div className="text-left">
            <div className="font-bold text-lg">ACID</div>
            <div className="text-sm text-gray-600">Strong Consistency</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedModel('base')}
          className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all ${
            selectedModel === 'base'
              ? 'border-purple-500 bg-purple-50 shadow-lg'
              : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <Zap className={`w-6 h-6 ${selectedModel === 'base' ? 'text-purple-600' : 'text-gray-400'}`} />
          <div className="text-left">
            <div className="font-bold text-lg">BASE</div>
            <div className="text-sm text-gray-600">High Availability</div>
          </div>
        </button>
      </div>

      {/* Model Details */}
      <div className={`p-6 rounded-lg border-2 ${
        selectedModel === 'acid' ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'
      }`}>
        <div className="flex items-start gap-4 mb-4">
          {selectedModel === 'acid' ? (
            <Shield className="w-12 h-12 text-blue-600" />
          ) : (
            <Zap className="w-12 h-12 text-purple-600" />
          )}
          <div>
            <h4 className="text-xl font-bold">{selectedModelData.fullForm}</h4>
            <p className="text-gray-700">{selectedModelData.description}</p>
          </div>
        </div>

        {/* Principles */}
        <div className="space-y-4 mb-6">
          {selectedModelData.principles.map((principle, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  selectedModel === 'acid' ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  {principle.letter}
                </div>
                <h5 className="font-bold text-lg">{principle.name}</h5>
              </div>
              <p className="text-gray-700 mb-2">{principle.description}</p>
              <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                <div className="text-sm font-semibold text-gray-600 mb-1">Example:</div>
                <div className="text-sm text-gray-800">{principle.example}</div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-semibold">Implementation:</span> {principle.implementation}
              </div>
            </div>
          ))}
        </div>

        {/* Databases */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <h5 className="font-bold mb-2 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Common Databases
          </h5>
          <div className="flex flex-wrap gap-2">
            {selectedModelData.databases.map((db, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedModel === 'acid'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {db}
              </span>
            ))}
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3 flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Advantages
            </h5>
            <ul className="space-y-2">
              {selectedModelData.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3 flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              Disadvantages
            </h5>
            <ul className="space-y-2">
              {selectedModelData.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-xl font-bold mb-4 text-center">Real-World Decision Making</h4>
        <p className="text-center text-gray-600 mb-6">
          Choose a scenario to see which model fits best
        </p>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                selectedScenario === key
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-3xl mb-2">{scenario.icon}</div>
              <div className="text-sm font-semibold">{scenario.name}</div>
            </button>
          ))}
        </div>

        {/* Scenario Details */}
        <div className=" from-indigo-50 to-blue-50 p-6 rounded-lg border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold flex items-center gap-2">
              <span className="text-3xl">{selectedScenarioData.icon}</span>
              {selectedScenarioData.name}
            </h5>
            <div className={`px-4 py-2 rounded-full font-bold text-sm ${
              selectedScenarioData.recommended === 'acid'
                ? 'bg-blue-600 text-white'
                : selectedScenarioData.recommended === 'base'
                ? 'bg-purple-600 text-white'
                : ' from-blue-600 to-purple-600 text-white'
            }`}>
              {selectedScenarioData.recommended === 'acid' ? '→ Use ACID' :
               selectedScenarioData.recommended === 'base' ? '→ Use BASE' :
               '→ Use HYBRID'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4">
            <h6 className="font-bold mb-2 text-gray-700">Requirements:</h6>
            <ul className="space-y-1">
              {selectedScenarioData.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4">
            <h6 className="font-bold mb-2 flex items-center gap-2 text-gray-700">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Why This Choice?
            </h6>
            <p className="text-sm text-gray-700">{selectedScenarioData.why}</p>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4">
            <h6 className="font-bold mb-2 text-gray-700">Recommended Databases:</h6>
            <p className="text-sm text-gray-800 font-mono">{selectedScenarioData.databases}</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h6 className="font-bold mb-2 text-red-700 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Wrong Choice Consequence:
            </h6>
            <p className="text-sm text-red-800">{selectedScenarioData.consequence}</p>
          </div>
        </div>
      </div>

      {/* Decision Framework */}
      <div className=" from-slate-50 to-gray-50 p-6 rounded-lg border-2 border-gray-200">
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-gray-700" />
          Quick Decision Framework
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <h5 className="font-bold text-blue-900 mb-3">Choose ACID when:</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Data accuracy is critical (money, inventory, votes)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Regulatory compliance required</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Transactions span multiple tables/operations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Can tolerate some latency for correctness</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Moderate scale (millions, not billions of ops)</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <h5 className="font-bold text-purple-900 mb-3">Choose BASE when:</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>High availability is more important than perfect accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Need to scale to massive volumes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Low latency is critical</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Temporary inconsistency is acceptable</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Distributed across multiple regions/data centers</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4  from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-indigo-200">
          <h5 className="font-bold text-indigo-900 mb-2">💡 Pro Tip: Hybrid Approach</h5>
          <p className="text-sm text-gray-700">
            Many modern systems use BOTH! Use ACID for critical data (payments, inventory) and BASE for 
            non-critical data (likes, views, cache). This is called <span className="font-bold">Polyglot Persistence</span>.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Example: Uber uses PostgreSQL (ACID) for trip/payment data, Cassandra (BASE) for location tracking.
          </p>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200">
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          Interview Tips
        </h4>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "Why not just use ACID everywhere?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> ACID requires coordination between nodes, which limits 
              horizontal scalability. At massive scale (billions of operations), ACID becomes too slow and expensive. 
              Also, strict ACID violates the Availability promise of CAP theorem during network partitions.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "How does eventual consistency work in practice?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> Updates propagate asynchronously to replicas. During this 
              window (usually milliseconds to seconds), different nodes may return different values. The system uses 
              conflict resolution strategies (last-write-wins, vector clocks, CRDTs) to converge to a consistent state.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "Can you have strong consistency in a distributed system?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> Yes, but with trade-offs. Google Spanner uses atomic clocks 
              and TrueTime API for external consistency across regions. CockroachDB provides serializable isolation. 
              But both sacrifice some availability and add latency for coordination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcidVsBase;
