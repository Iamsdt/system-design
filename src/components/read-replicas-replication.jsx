import { useState } from 'react';
import { Database, Server, GitBranch, AlertTriangle, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

const ReadReplicasReplication = () => {
  const [selectedPattern, setSelectedPattern] = useState('master-slave');
  const [lagDemo, setLagDemo] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState('lww');

  const replicationPatterns = {
    'master-slave': {
      name: 'Master-Slave (Primary-Replica)',
      icon: '👑',
      color: 'blue',
      description: 'Single master for writes, multiple replicas for reads',
      architecture: 'Master (Read + Write) → Async Replication → Slaves (Read Only)',
      diagram: [
        'Master DB ⚡',
        '    ↓ (replicate)',
        'Slave 1 📖  Slave 2 📖  Slave 3 📖'
      ],
      characteristics: [
        'Single source of truth',
        'All writes go to master',
        'Reads distributed to replicas',
        'Asynchronous replication',
        'Eventual consistency'
      ],
      useCases: [
        'Read-heavy workloads (90% reads, 10% writes)',
        'Geographical distribution (replicas in different regions)',
        'Load balancing read traffic',
        'Backup and disaster recovery',
        'Reporting without impacting production'
      ],
      advantages: [
        'Simple to understand and implement',
        'Read scalability (add more replicas)',
        'Master never blocked by replica lag',
        'Works well for read-heavy apps',
        'Clear consistency model'
      ],
      disadvantages: [
        'Single point of failure (master)',
        'Write bottleneck (can\'t scale writes)',
        'Replication lag (stale reads)',
        'Failover requires promotion',
        'No write distribution'
      ],
      examples: ['MySQL Replication', 'PostgreSQL Streaming Replication', 'MongoDB Replica Set', 'Redis Replication']
    },
    'multi-master': {
      name: 'Multi-Master (Active-Active)',
      icon: '👑👑',
      color: 'purple',
      description: 'Multiple masters accepting writes simultaneously',
      architecture: 'Master 1 ⟷ Master 2 ⟷ Master 3 (Bidirectional Replication)',
      diagram: [
        'Master 1 ⚡  ⟷  Master 2 ⚡  ⟷  Master 3 ⚡',
        '   ↓              ↓              ↓',
        'Replicas      Replicas      Replicas'
      ],
      characteristics: [
        'Multiple write sources',
        'Bidirectional replication',
        'Conflict resolution needed',
        'Higher availability',
        'Complex coordination'
      ],
      useCases: [
        'Global applications (write locally)',
        'High availability requirements',
        'Write-heavy workloads',
        'Zero-downtime deployments',
        'Collaborative editing'
      ],
      advantages: [
        'Write scalability',
        'No single point of failure',
        'Lower write latency (write locally)',
        'Better availability',
        'Regional autonomy'
      ],
      disadvantages: [
        'Conflict resolution complexity',
        'Data consistency challenges',
        'Network partition issues',
        'Higher operational complexity',
        'Potential data loss in conflicts'
      ],
      examples: ['MySQL Group Replication', 'PostgreSQL BDR', 'Cassandra', 'CockroachDB', 'Galera Cluster']
    },
    'read-replica': {
      name: 'Read Replica Strategy',
      icon: '📚',
      color: 'green',
      description: 'Dedicated replicas optimized for specific read workloads',
      architecture: 'Master → [ Analytics Replica | Cache Replica | Geo Replica ]',
      diagram: [
        'Master DB ⚡ (Production)',
        '    ↓',
        '    ├─→ Analytics Replica (Heavy queries)',
        '    ├─→ Cache Replica (Frequently accessed)',
        '    └─→ Geo Replica (Low latency reads)'
      ],
      characteristics: [
        'Purpose-built replicas',
        'Workload segregation',
        'Different configurations',
        'Lag acceptable',
        'Optimized indexes'
      ],
      useCases: [
        'Analytics on production data without impact',
        'Search indexing (Elasticsearch sync)',
        'Cache warming',
        'Geographic distribution',
        'A/B testing environments'
      ],
      advantages: [
        'Zero impact on production',
        'Specialized optimizations',
        'Different resource allocation',
        'Can have different schemas/indexes',
        'Easy to add/remove'
      ],
      disadvantages: [
        'Data staleness',
        'Storage duplication',
        'Sync overhead',
        'Management complexity',
        'Potential inconsistency'
      ],
      examples: ['Aurora Read Replicas', 'RDS Read Replicas', 'Cloud SQL Replicas', 'Atlas Read Preference']
    }
  };

  const lagScenarios = [
    {
      scenario: 'User updates profile',
      timeline: [
        { time: 'T+0ms', event: 'User clicks Save', location: 'Client' },
        { time: 'T+10ms', event: 'Write to Master', location: 'Master DB', status: 'success' },
        { time: 'T+11ms', event: 'Response sent to client', location: 'Client' },
        { time: 'T+15ms', event: 'User refreshes page', location: 'Client' },
        { time: 'T+20ms', event: 'Read from Replica (OLD DATA)', location: 'Replica DB', status: 'stale' },
        { time: 'T+150ms', event: 'Replication completes', location: 'Replica DB', status: 'synced' }
      ],
      problem: 'User sees old profile data after update (Read-your-writes violation)',
      solutions: [
        'Read from Master after write (session stickiness)',
        'Use version numbers/timestamps',
        'Wait for replication (slower UX)',
        'Optimistic UI updates'
      ]
    }
  ];

  const conflictResolutionStrategies = {
    lww: {
      name: 'Last Write Wins (LWW)',
      description: 'Most recent timestamp wins',
      icon: '⏰',
      example: 'User A updates name to "Alice" at 10:00, User B updates to "Bob" at 10:01 → Bob wins',
      pros: ['Simple to implement', 'No user intervention', 'Fast resolution'],
      cons: ['Data loss (first write discarded)', 'Clock sync issues', 'Not suitable for important data'],
      usedBy: ['Cassandra', 'DynamoDB', 'Riak']
    },
    versioning: {
      name: 'Version Vectors / Vector Clocks',
      description: 'Track causality to detect conflicts',
      icon: '🔢',
      example: 'Server1: [1,0,0], Server2: [0,1,0] → Concurrent edits detected → Merge or prompt user',
      pros: ['Detects true conflicts', 'Preserves causality', 'No data loss'],
      cons: ['Complex implementation', 'Storage overhead', 'Manual conflict resolution'],
      usedBy: ['Riak', 'Dynamo', 'Voldemort']
    },
    crdt: {
      name: 'CRDTs (Conflict-free Replicated Data Types)',
      description: 'Data structures that merge automatically',
      icon: '🔄',
      example: 'Counter: increment operations commute (A+1+1 = 1+A+1 = 2). Set: union of adds, remove tombstones',
      pros: ['Automatic merge', 'No conflicts', 'Mathematically proven'],
      cons: ['Limited data types', 'Eventual consistency', 'Storage overhead (tombstones)'],
      usedBy: ['Redis', 'Automerge', 'Yjs', 'Figma']
    },
    app: {
      name: 'Application-Level Resolution',
      description: 'App decides how to merge conflicts',
      icon: '⚙️',
      example: 'Google Docs: Operational Transformation. Git: Three-way merge with conflict markers',
      pros: ['Full control', 'Business logic aware', 'Context-specific'],
      cons: ['Application complexity', 'Must handle all cases', 'Development overhead'],
      usedBy: ['Google Docs', 'Figma', 'Git', 'Custom apps']
    }
  };

  const consistencyLevels = [
    {
      level: 'Strong Consistency',
      description: 'All nodes always see same data',
      guarantee: 'Read-your-writes, monotonic reads',
      latency: 'Higher (sync replication)',
      availability: 'Lower (CAP: CP)',
      example: 'Financial transactions, inventory'
    },
    {
      level: 'Eventual Consistency',
      description: 'Nodes converge over time',
      guarantee: 'Eventually all nodes will agree',
      latency: 'Lower (async replication)',
      availability: 'Higher (CAP: AP)',
      example: 'Social media likes, view counts'
    },
    {
      level: 'Session Consistency',
      description: 'User sees their own writes',
      guarantee: 'Read-your-writes for same session',
      latency: 'Medium (sticky sessions)',
      availability: 'Medium',
      example: 'User profile updates'
    },
    {
      level: 'Causal Consistency',
      description: 'Respects cause-effect relationships',
      guarantee: 'If A causes B, all see A before B',
      latency: 'Medium (version tracking)',
      availability: 'Medium',
      example: 'Comment threads, message ordering'
    }
  ];

  const failoverScenarios = {
    automatic: {
      name: 'Automatic Failover',
      description: 'System automatically promotes replica to master',
      steps: [
        'Master fails → Health check timeout (5-30 seconds)',
        'Consensus protocol elects new master (Raft/Paxos)',
        'Replica promoted to master',
        'DNS/Load balancer updated',
        'Other replicas sync from new master'
      ],
      downtime: '10-60 seconds',
      pros: ['No manual intervention', 'Faster recovery', 'Works 24/7'],
      cons: ['Risk of split-brain', 'Potential data loss', 'False positives'],
      examples: ['MongoDB Replica Set', 'PostgreSQL Patroni', 'MySQL MHA']
    },
    manual: {
      name: 'Manual Failover',
      description: 'Human operator promotes replica',
      steps: [
        'Alert triggers (master down)',
        'On-call engineer investigates',
        'Verify master is truly down',
        'Choose replica to promote',
        'Execute promotion commands',
        'Update app configuration'
      ],
      downtime: '5-30 minutes',
      pros: ['No false positives', 'Controlled process', 'Can verify data'],
      cons: ['Slow recovery', 'Requires on-call', 'Human error risk'],
      examples: ['Traditional MySQL', 'PostgreSQL without HA', 'Redis Sentinel (semi-auto)']
    }
  };

  const selectedPatternData = replicationPatterns[selectedPattern];
  const selectedConflictData = conflictResolutionStrategies[selectedConflict];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Database Replication Patterns</h3>
        <p className="text-gray-600">
          Master-Slave, Multi-Master, Read Replicas, Conflict Resolution & Consistency
        </p>
      </div>

      {/* Pattern Selector */}
      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(replicationPatterns).map(([key, pattern]) => (
          <button
            key={key}
            onClick={() => setSelectedPattern(key)}
            className={`p-5 rounded-lg border-2 transition-all ${
              selectedPattern === key
                ? `border-${pattern.color}-500 bg-${pattern.color}-50 shadow-lg`
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="text-4xl mb-2">{pattern.icon}</div>
            <div className="font-bold text-lg">{pattern.name}</div>
            <div className="text-xs text-gray-600 mt-1">{pattern.description}</div>
          </button>
        ))}
      </div>

      {/* Pattern Details */}
      <div className={`p-6 rounded-lg border-2 ${
        selectedPattern === 'master-slave' ? 'border-blue-200 bg-blue-50' :
        selectedPattern === 'multi-master' ? 'border-purple-200 bg-purple-50' :
        'border-green-200 bg-green-50'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">{selectedPatternData.icon}</span>
          <div>
            <h4 className="text-2xl font-bold">{selectedPatternData.name}</h4>
            <p className="text-gray-700">{selectedPatternData.description}</p>
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-white p-5 rounded-lg mb-4 border border-gray-200">
          <h5 className="font-bold mb-3 flex items-center gap-2">
            <Server className="w-5 h-5" />
            Architecture
          </h5>
          <p className="text-sm font-mono text-gray-800 mb-3">{selectedPatternData.architecture}</p>
          <div className="bg-gray-900 p-4 rounded">
            {selectedPatternData.diagram.map((line, index) => (
              <div key={index} className="font-mono text-green-400 text-sm">
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Characteristics & Use Cases */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3">Characteristics</h5>
            <ul className="space-y-2">
              {selectedPatternData.characteristics.map((char, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-indigo-500">•</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3">Use Cases</h5>
            <ul className="space-y-2">
              {selectedPatternData.useCases.map((useCase, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Advantages & Disadvantages */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3 text-green-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Advantages
            </h5>
            <ul className="space-y-2">
              {selectedPatternData.advantages.map((adv, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3 text-red-700 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Disadvantages
            </h5>
            <ul className="space-y-2">
              {selectedPatternData.disadvantages.map((dis, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h5 className="font-bold mb-3 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Real-World Examples
          </h5>
          <div className="flex flex-wrap gap-2">
            {selectedPatternData.examples.map((example, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {example}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Replication Lag */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-600" />
            Replication Lag & Consistency Issues
          </h4>
          <button
            onClick={() => setLagDemo(!lagDemo)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              lagDemo
                ? 'bg-amber-500 text-white'
                : 'bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50'
            }`}
          >
            {lagDemo ? 'Hide Example' : 'Show Example'}
          </button>
        </div>

        {lagDemo && lagScenarios.map((scenario, idx) => (
          <div key={idx} className="bg-white p-5 rounded-lg mb-4 border border-gray-200">
            <h5 className="font-bold mb-3">{scenario.scenario}</h5>
            
            <div className="space-y-2 mb-4">
              {scenario.timeline.map((event, index) => (
                <div key={index} className={`flex items-center gap-3 p-2 rounded ${
                  event.status === 'success' ? 'bg-green-50' :
                  event.status === 'stale' ? 'bg-red-50' :
                  event.status === 'synced' ? 'bg-blue-50' :
                  'bg-gray-50'
                }`}>
                  <span className="font-mono text-xs font-semibold w-20">{event.time}</span>
                  <span className="text-sm flex-1">{event.event}</span>
                  <span className="text-xs text-gray-500">{event.location}</span>
                </div>
              ))}
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400 mb-3">
              <h6 className="font-bold text-red-700 mb-2">Problem:</h6>
              <p className="text-sm text-red-800">{scenario.problem}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h6 className="font-bold text-green-700 mb-2">Solutions:</h6>
              <ul className="space-y-1">
                {scenario.solutions.map((solution, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Conflict Resolution */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-xl font-bold mb-4 text-center">Conflict Resolution Strategies</h4>
        <p className="text-center text-gray-600 mb-6">
          How to handle concurrent writes in multi-master replication
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Object.entries(conflictResolutionStrategies).map(([key, strategy]) => (
            <button
              key={key}
              onClick={() => setSelectedConflict(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedConflict === key
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-3xl mb-2">{strategy.icon}</div>
              <div className="font-bold text-sm">{strategy.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border-2 border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedConflictData.icon}</span>
            <div>
              <h5 className="text-xl font-bold">{selectedConflictData.name}</h5>
              <p className="text-gray-700">{selectedConflictData.description}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4">
            <h6 className="font-bold mb-2">Example:</h6>
            <p className="text-sm text-gray-700">{selectedConflictData.example}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg">
              <h6 className="font-bold mb-2 text-green-700">Pros:</h6>
              <ul className="space-y-1">
                {selectedConflictData.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h6 className="font-bold mb-2 text-red-700">Cons:</h6>
              <ul className="space-y-1">
                {selectedConflictData.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h6 className="font-bold mb-2">Used By:</h6>
            <div className="flex flex-wrap gap-2">
              {selectedConflictData.usedBy.map((db, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {db}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consistency Levels */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-lg border-2 border-gray-200">
        <h4 className="text-xl font-bold mb-4 text-center">Consistency Levels</h4>
        
        <div className="space-y-3">
          {consistencyLevels.map((level, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-lg">{level.level}</h5>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  level.availability === 'Higher' ? 'bg-green-100 text-green-700' :
                  level.availability === 'Lower' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {level.availability} Availability
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{level.description}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="font-semibold text-gray-600">Guarantee:</span>
                  <div className="text-gray-800">{level.guarantee}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Latency:</span>
                  <div className="text-gray-800">{level.latency}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">CAP:</span>
                  <div className="text-gray-800">{level.availability}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Example:</span>
                  <div className="text-gray-800">{level.example}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Failover */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-xl font-bold mb-4 text-center">Failover Strategies</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(failoverScenarios).map(([key, scenario]) => (
            <div key={key} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border-2 border-blue-200">
              <h5 className="text-xl font-bold mb-2">{scenario.name}</h5>
              <p className="text-sm text-gray-700 mb-4">{scenario.description}</p>

              <div className="bg-white p-4 rounded-lg mb-4">
                <h6 className="font-bold mb-2 text-sm">Steps:</h6>
                <ol className="space-y-1">
                  {scenario.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs">
                      <span className="font-bold text-indigo-600">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg mb-4 border-l-4 border-amber-400">
                <span className="font-semibold text-sm">Typical Downtime:</span>
                <span className="ml-2 text-sm font-bold text-amber-800">{scenario.downtime}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-3 rounded-lg">
                  <h6 className="font-bold text-xs text-green-700 mb-1">Pros:</h6>
                  <ul className="space-y-1">
                    {scenario.pros.map((pro, index) => (
                      <li key={index} className="text-xs flex items-start gap-1">
                        <span className="text-green-500">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-lg">
                  <h6 className="font-bold text-xs text-red-700 mb-1">Cons:</h6>
                  <ul className="space-y-1">
                    {scenario.cons.map((con, index) => (
                      <li key={index} className="text-xs flex items-start gap-1">
                        <span className="text-red-500">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg">
                <h6 className="font-bold text-xs mb-1">Examples:</h6>
                <div className="flex flex-wrap gap-1">
                  {scenario.examples.map((example, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <h4 className="text-xl font-bold mb-4">💡 Interview Tips</h4>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "What's the difference between synchronous and asynchronous replication?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> Synchronous waits for replica acknowledgment before returning success 
              (stronger consistency, higher latency, lower availability). Asynchronous returns immediately (lower latency, 
              higher availability, but risk of data loss if master fails before replication). Trade-off between consistency and performance.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "How do you handle split-brain in multi-master replication?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> Split-brain occurs when network partition causes multiple masters. 
              Solutions: 1) Quorum-based consensus (need majority), 2) Fencing (disable minority partition), 3) Witness node 
              (tie-breaker), 4) Application-level conflict resolution. Key: Ensure odd number of nodes for majority.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "When would you choose multi-master over master-slave?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> Multi-master when: 1) Write-heavy workload, 2) Global app needing 
              low-latency writes in multiple regions, 3) High availability is critical, 4) Can handle eventual consistency. 
              Avoid for: Financial transactions, inventory management, or when conflicts are complex to resolve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadReplicasReplication;
