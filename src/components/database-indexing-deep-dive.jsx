import { useState } from 'react';
import { Database, Search, Zap, TrendingDown, TrendingUp, AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';

const DatabaseIndexingDeepDive = () => {
  const [selectedIndexType, setSelectedIndexType] = useState('btree');
  const [selectedScenario, setSelectedScenario] = useState('oltp');
  const [performanceDemo, setPerformanceDemo] = useState(false);

  const indexTypes = {
    btree: {
      name: 'B-Tree Index',
      icon: '🌳',
      color: 'blue',
      description: 'Balanced tree structure with sorted keys',
      structure: 'Multi-level tree where each node contains multiple keys and pointers',
      timeComplexity: {
        search: 'O(log n)',
        insert: 'O(log n)',
        delete: 'O(log n)',
        rangeScan: 'O(log n + k)'
      },
      characteristics: [
        'Keeps data sorted',
        'Efficient for range queries',
        'Good for equality searches',
        'Self-balancing',
        'Cache-friendly'
      ],
      bestFor: [
        'Primary keys and unique constraints',
        'Range queries (BETWEEN, <, >, etc.)',
        'ORDER BY operations',
        'Prefix searches (LIKE "abc%")',
        'Foreign key lookups'
      ],
      notGoodFor: [
        'High write volume (requires rebalancing)',
        'Full-text search',
        'Suffix searches (LIKE "%abc")',
        'Very large keys'
      ],
      databases: ['PostgreSQL (default)', 'MySQL/InnoDB (default)', 'Oracle', 'SQL Server'],
      example: `CREATE INDEX idx_user_email ON users(email);
-- B-Tree automatically created
-- Good for: WHERE email = 'user@example.com'
-- Good for: WHERE email LIKE 'user%'
-- Good for: ORDER BY email`
    },
    lsm: {
      name: 'LSM Tree (Log-Structured Merge)',
      icon: '📚',
      color: 'green',
      description: 'Write-optimized structure with multiple sorted levels',
      structure: 'Writes go to memory (MemTable), then flush to disk SSTables, periodic compaction',
      timeComplexity: {
        search: 'O(log n) but slower',
        insert: 'O(1) amortized',
        delete: 'O(1) amortized',
        rangeScan: 'O(log n + k)'
      },
      characteristics: [
        'Optimized for writes',
        'Append-only writes',
        'Background compaction',
        'Higher read amplification',
        'Better write throughput'
      ],
      bestFor: [
        'Write-heavy workloads',
        'Time-series data',
        'Log aggregation',
        'IoT sensor data',
        'High ingestion rate'
      ],
      notGoodFor: [
        'Read-heavy workloads',
        'Point queries (slower than B-Tree)',
        'Low latency reads',
        'Frequent updates to same key'
      ],
      databases: ['Cassandra', 'RocksDB', 'LevelDB', 'ScyllaDB', 'HBase'],
      example: `-- Cassandra Example
CREATE TABLE sensor_data (
  sensor_id uuid,
  timestamp timestamp,
  value double,
  PRIMARY KEY (sensor_id, timestamp)
) WITH COMPACTION = {'class': 'TimeWindowCompactionStrategy'};
-- LSM tree handles millions of writes/sec`
    },
    hash: {
      name: 'Hash Index',
      icon: '🔑',
      color: 'purple',
      description: 'Hash function maps keys to bucket locations',
      structure: 'Key → Hash Function → Bucket → Value pointer',
      timeComplexity: {
        search: 'O(1) average',
        insert: 'O(1) average',
        delete: 'O(1) average',
        rangeScan: 'Not supported'
      },
      characteristics: [
        'Fastest for exact matches',
        'Constant time lookups',
        'No ordering preserved',
        'Cannot do range scans',
        'Memory efficient'
      ],
      bestFor: [
        'Exact equality lookups',
        'Cache key lookups',
        'Session ID lookups',
        'Hash partitioning',
        'In-memory indexes'
      ],
      notGoodFor: [
        'Range queries (completely unusable)',
        'ORDER BY operations',
        'Prefix searches',
        'MIN/MAX operations',
        'Inequality comparisons'
      ],
      databases: ['PostgreSQL (HASH)', 'MySQL Memory Engine', 'Redis', 'Memcached'],
      example: `CREATE INDEX idx_user_id_hash ON users USING HASH (user_id);
-- Perfect for: WHERE user_id = 123
-- Cannot do: WHERE user_id > 100
-- Cannot do: ORDER BY user_id`
    }
  };

  const scenarios = {
    oltp: {
      name: 'OLTP Workload',
      icon: '⚡',
      description: 'Online Transaction Processing - frequent small transactions',
      characteristics: [
        'Many concurrent users',
        'Short, simple queries',
        'Mix of reads and writes',
        'Low latency required',
        'Point lookups and range scans'
      ],
      recommended: 'btree',
      why: 'B-Tree provides balanced read/write performance and supports all query types needed',
      example: 'E-commerce order processing, banking transactions, user authentication'
    },
    analytics: {
      name: 'Analytics Workload',
      icon: '📊',
      description: 'Complex queries scanning large amounts of data',
      characteristics: [
        'Few concurrent queries',
        'Complex aggregations',
        'Read-heavy',
        'Can tolerate higher latency',
        'Full table scans common'
      ],
      recommended: 'btree',
      why: 'B-Tree helps with sorting and range scans. Consider columnar storage instead of row-based.',
      example: 'Business intelligence dashboards, data warehousing, reporting'
    },
    timeseries: {
      name: 'Time-Series Data',
      icon: '📈',
      description: 'High volume of timestamped data points',
      characteristics: [
        'Extremely write-heavy',
        'Time-ordered data',
        'Batch inserts',
        'Range queries by time',
        'Old data rarely updated'
      ],
      recommended: 'lsm',
      why: 'LSM Tree handles massive write throughput better. Time-based compaction is efficient.',
      example: 'IoT sensors, application logs, metrics monitoring, stock prices'
    },
    cache: {
      name: 'Cache Lookups',
      icon: '🚀',
      description: 'Fast exact-match key-value lookups',
      characteristics: [
        'Extremely read-heavy',
        'Simple key lookups',
        'No range queries',
        'Sub-millisecond latency',
        'In-memory data'
      ],
      recommended: 'hash',
      why: 'Hash index provides O(1) lookups, perfect for cache. No need for ordering.',
      example: 'Session storage, API rate limiting, user preferences, CDN cache'
    }
  };

  const indexCategories = [
    {
      name: 'Primary Index',
      description: 'Built on the primary key, determines physical row order',
      icon: '🔑',
      color: 'blue',
      example: 'CREATE TABLE users (id INT PRIMARY KEY, ...)',
      characteristics: [
        'Automatically created',
        'Unique by definition',
        'Usually a clustered index',
        'One per table',
        'Fast for ID lookups'
      ]
    },
    {
      name: 'Secondary Index',
      description: 'Additional indexes on non-primary columns',
      icon: '🔖',
      color: 'green',
      example: 'CREATE INDEX idx_email ON users(email)',
      characteristics: [
        'Multiple allowed per table',
        'Points to primary key',
        'Adds write overhead',
        'Speeds up queries',
        'Requires maintenance'
      ]
    },
    {
      name: 'Composite Index',
      description: 'Index on multiple columns together',
      icon: '🔗',
      color: 'purple',
      example: 'CREATE INDEX idx_name_age ON users(last_name, first_name, age)',
      characteristics: [
        'Left-to-right matching',
        'Column order matters',
        'Can serve multiple queries',
        'Larger storage cost',
        'Prefix optimization'
      ]
    },
    {
      name: 'Unique Index',
      description: 'Enforces uniqueness constraint',
      icon: '✨',
      color: 'amber',
      example: 'CREATE UNIQUE INDEX idx_username ON users(username)',
      characteristics: [
        'Prevents duplicates',
        'Slightly slower inserts',
        'Same as regular index',
        'Enforced at write time',
        'Good for constraints'
      ]
    },
    {
      name: 'Covering Index',
      description: 'Contains all columns needed by a query',
      icon: '📦',
      color: 'teal',
      example: 'CREATE INDEX idx_user_info ON users(email, name, status)',
      characteristics: [
        'No table lookup needed',
        'Fastest query performance',
        'Higher storage cost',
        'Index-only scan',
        'Reduces I/O'
      ]
    },
    {
      name: 'Partial Index',
      description: 'Index only a subset of rows',
      icon: '🎯',
      color: 'red',
      example: 'CREATE INDEX idx_active ON users(email) WHERE status = "active"',
      characteristics: [
        'Smaller index size',
        'Faster for subset',
        'Conditional indexing',
        'Less maintenance',
        'Query must match condition'
      ]
    }
  ];

  const performanceComparison = [
    {
      operation: 'Point Query (WHERE id = 123)',
      btree: { time: '0.1ms', rating: 'excellent' },
      lsm: { time: '0.3ms', rating: 'good' },
      hash: { time: '0.05ms', rating: 'excellent' }
    },
    {
      operation: 'Range Query (WHERE age BETWEEN 25 AND 35)',
      btree: { time: '2ms', rating: 'excellent' },
      lsm: { time: '5ms', rating: 'good' },
      hash: { time: 'N/A', rating: 'bad' }
    },
    {
      operation: 'ORDER BY (ORDER BY created_at DESC)',
      btree: { time: '1ms', rating: 'excellent' },
      lsm: { time: '3ms', rating: 'good' },
      hash: { time: 'N/A', rating: 'bad' }
    },
    {
      operation: 'Bulk Insert (1000 rows)',
      btree: { time: '50ms', rating: 'good' },
      lsm: { time: '10ms', rating: 'excellent' },
      hash: { time: '15ms', rating: 'excellent' }
    },
    {
      operation: 'Update Random Row',
      btree: { time: '0.5ms', rating: 'good' },
      lsm: { time: '0.2ms', rating: 'excellent' },
      hash: { time: '0.3ms', rating: 'excellent' }
    },
    {
      operation: 'Prefix Search (LIKE "abc%")',
      btree: { time: '3ms', rating: 'good' },
      lsm: { time: '8ms', rating: 'fair' },
      hash: { time: 'N/A', rating: 'bad' }
    }
  ];

  const selectedType = indexTypes[selectedIndexType];
  const selectedScenarioData = scenarios[selectedScenario];

  const getRatingColor = (rating) => {
    switch(rating) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-amber-600 bg-amber-50';
      case 'bad': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Database Indexing Deep Dive</h3>
        <p className="text-gray-600">
          Understanding B-Tree, LSM Tree, and Hash indexes for optimal performance
        </p>
      </div>

      {/* Index Type Selector */}
      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(indexTypes).map(([key, type]) => (
          <button
            key={key}
            onClick={() => setSelectedIndexType(key)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedIndexType === key
                ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="text-4xl mb-2">{type.icon}</div>
            <div className="font-bold text-lg">{type.name}</div>
            <div className="text-sm text-gray-600 mt-1">{type.description}</div>
          </button>
        ))}
      </div>

      {/* Selected Index Type Details */}
      <div className={`p-6 rounded-lg border-2 ${
        selectedIndexType === 'btree' ? 'border-blue-200 bg-blue-50' :
        selectedIndexType === 'lsm' ? 'border-green-200 bg-green-50' :
        'border-purple-200 bg-purple-50'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">{selectedType.icon}</span>
          <div>
            <h4 className="text-2xl font-bold">{selectedType.name}</h4>
            <p className="text-gray-700">{selectedType.description}</p>
          </div>
        </div>

        {/* Structure */}
        <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
          <h5 className="font-bold mb-2 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Internal Structure
          </h5>
          <p className="text-sm text-gray-700">{selectedType.structure}</p>
        </div>

        {/* Time Complexity */}
        <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
          <h5 className="font-bold mb-3">Time Complexity</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(selectedType.timeComplexity).map(([op, complexity]) => (
              <div key={op} className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-600 mb-1">{op}</div>
                <div className="font-mono font-bold text-sm">{complexity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Characteristics */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3 flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Best For
            </h5>
            <ul className="space-y-2">
              {selectedType.bestFor.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3 flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              Not Good For
            </h5>
            <ul className="space-y-2">
              {selectedType.notGoodFor.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Databases */}
        <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
          <h5 className="font-bold mb-2">Used By</h5>
          <div className="flex flex-wrap gap-2">
            {selectedType.databases.map((db, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {db}
              </span>
            ))}
          </div>
        </div>

        {/* SQL Example */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h5 className="font-bold mb-2 text-white">Example Usage</h5>
          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
            {selectedType.example}
          </pre>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className=" from-slate-50 to-gray-50 p-6 rounded-lg border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            Performance Comparison
          </h4>
          <button
            onClick={() => setPerformanceDemo(!performanceDemo)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              performanceDemo
                ? 'bg-amber-500 text-white'
                : 'bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50'
            }`}
          >
            {performanceDemo ? 'Hide Demo' : 'Show Demo'}
          </button>
        </div>

        {performanceDemo && (
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Operation</th>
                  <th className="px-4 py-3 text-center font-bold">B-Tree</th>
                  <th className="px-4 py-3 text-center font-bold">LSM Tree</th>
                  <th className="px-4 py-3 text-center font-bold">Hash</th>
                </tr>
              </thead>
              <tbody>
                {performanceComparison.map((row, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-3 font-medium text-sm">{row.operation}</td>
                    <td className="px-4 py-3 text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(row.btree.rating)}`}>
                        {row.btree.time}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(row.lsm.rating)}`}>
                        {row.lsm.time}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(row.hash.rating)}`}>
                        {row.hash.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Index Categories */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-xl font-bold mb-6 text-center">Index Types & Categories</h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indexCategories.map((category, index) => (
            <div key={index} className="bg-white p-5 rounded-lg border-2 border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{category.icon}</span>
                <h5 className="font-bold text-lg">{category.name}</h5>
              </div>
              <p className="text-sm text-gray-700 mb-3">{category.description}</p>
              
              <div className="bg-gray-900 p-3 rounded mb-3">
                <code className="text-green-400 text-xs">{category.example}</code>
              </div>

              <ul className="space-y-1">
                {category.characteristics.map((char, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-xl font-bold mb-4 text-center">Choose the Right Index for Your Workload</h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedScenario === key
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-3xl mb-2">{scenario.icon}</div>
              <div className="font-bold text-sm">{scenario.name}</div>
            </button>
          ))}
        </div>

        <div className=" from-indigo-50 to-blue-50 p-6 rounded-lg border-2 border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedScenarioData.icon}</span>
            <div>
              <h5 className="text-xl font-bold">{selectedScenarioData.name}</h5>
              <p className="text-gray-700">{selectedScenarioData.description}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4">
            <h6 className="font-bold mb-2">Workload Characteristics:</h6>
            <ul className="space-y-1">
              {selectedScenarioData.characteristics.map((char, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className=" from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200 mb-4">
            <h6 className="font-bold mb-2 text-green-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Recommended: {indexTypes[selectedScenarioData.recommended].name}
            </h6>
            <p className="text-sm text-gray-700 mb-2">{selectedScenarioData.why}</p>
            <p className="text-xs text-gray-600 italic">Example: {selectedScenarioData.example}</p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200">
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-amber-600" />
          Indexing Best Practices
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg space-y-3">
            <h5 className="font-bold text-green-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              DO
            </h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Index columns used in WHERE, JOIN, ORDER BY clauses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Use composite indexes for multi-column queries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Index foreign keys to speed up joins</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Use covering indexes for frequently run queries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Monitor query execution plans regularly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Use partial indexes for subset queries</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg space-y-3">
            <h5 className="font-bold text-red-700 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              DON'T
            </h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>Over-index (every index slows writes)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>Index low-cardinality columns (gender, boolean)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>Use functions in WHERE clause (breaks index usage)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>Ignore composite index column order</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>Forget to maintain indexes (ANALYZE, VACUUM)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>Create duplicate or redundant indexes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <h4 className="text-xl font-bold mb-4">💡 Interview Tips</h4>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "Why does LIKE '%abc' not use index but LIKE 'abc%' does?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> B-Tree stores keys in sorted order. For 'abc%', the database 
              knows to look only at entries starting with 'abc'. For '%abc', it must scan all entries since the prefix 
              is unknown. This is why full-text search indexes exist for suffix/substring searches.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "What's the difference between clustered and non-clustered index?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> Clustered index determines the physical order of data on disk 
              (like a phone book sorted by name). Non-clustered index is a separate structure pointing to the actual data 
              (like an index at the back of a book). A table can have only ONE clustered index but multiple non-clustered indexes.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "When would you NOT want to add an index?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> On write-heavy tables with few reads, small tables (full scan 
              is faster), low-cardinality columns (few unique values), or when the query already uses another suitable 
              index. Every index has a maintenance cost during INSERT/UPDATE/DELETE operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseIndexingDeepDive;
