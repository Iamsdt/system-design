import { useState } from 'react';
import { Database, TrendingUp, Zap, Users, BarChart3, Server, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const OltpVsOlapExpanded = () => {
  const [selectedType, setSelectedType] = useState('oltp');
  const [selectedStorage, setSelectedStorage] = useState('row');
  const [selectedHybrid, setSelectedHybrid] = useState('htap');

  const workloadTypes = {
    oltp: {
      name: 'OLTP',
      fullName: 'Online Transaction Processing',
      icon: Zap,
      color: 'blue',
      tagline: 'Transactional workloads - Fast, frequent, simple operations',
      description: 'Handles day-to-day business transactions with high concurrency',
      characteristics: {
        users: 'Thousands to millions of concurrent users',
        queries: 'Short, simple queries (INSERT, UPDATE, DELETE, SELECT by ID)',
        data: 'Current operational data (last few months)',
        response: 'Sub-second response time required',
        operations: 'Read + Write (mixed workload)',
        volume: 'Many small transactions per second'
      },
      queryExamples: [
        'SELECT * FROM orders WHERE order_id = 12345',
        'UPDATE users SET email = "new@example.com" WHERE user_id = 789',
        'INSERT INTO transactions (user_id, amount) VALUES (123, 50.00)',
        'DELETE FROM cart WHERE user_id = 456 AND session_expired = true'
      ],
      useCases: [
        'E-commerce order processing',
        'Banking transactions (ATM, transfers)',
        'Airline reservation systems',
        'Hotel bookings',
        'Retail point-of-sale systems',
        'User authentication and sessions'
      ],
      databases: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server', 'CockroachDB', 'Amazon Aurora'],
      requirements: [
        'ACID compliance',
        'High availability',
        'Low latency',
        'Data integrity',
        'Concurrent access',
        'Row-level locking'
      ]
    },
    olap: {
      name: 'OLAP',
      fullName: 'Online Analytical Processing',
      icon: BarChart3,
      color: 'purple',
      tagline: 'Analytical workloads - Complex queries on large datasets',
      description: 'Supports business intelligence and data analysis',
      characteristics: {
        users: 'Few concurrent users (analysts, data scientists)',
        queries: 'Complex aggregations (SUM, AVG, GROUP BY, JOIN)',
        data: 'Historical data (years of records)',
        response: 'Seconds to minutes acceptable',
        operations: 'Read-heavy (mostly SELECT)',
        volume: 'Few queries scanning millions/billions of rows'
      },
      queryExamples: [
        'SELECT region, SUM(sales) FROM orders GROUP BY region',
        'SELECT DATE(created_at), COUNT(*) FROM users WHERE created_at > "2020-01-01" GROUP BY DATE(created_at)',
        'SELECT product_id, AVG(rating) FROM reviews JOIN products ON ... WHERE ... GROUP BY product_id HAVING AVG(rating) > 4.0',
        'WITH monthly_sales AS (...) SELECT * FROM monthly_sales WHERE ...'
      ],
      useCases: [
        'Business intelligence dashboards',
        'Sales reporting and forecasting',
        'Customer behavior analysis',
        'Financial reporting',
        'Data mining and ML training',
        'Executive decision making'
      ],
      databases: ['Snowflake', 'BigQuery', 'Redshift', 'ClickHouse', 'Apache Druid', 'Teradata'],
      requirements: [
        'Fast aggregations',
        'Columnar storage',
        'Query optimization',
        'Data compression',
        'Partitioning',
        'Parallel processing'
      ]
    }
  };

  const storageTypes = {
    row: {
      name: 'Row-Store (Row-Oriented)',
      icon: '📊',
      color: 'blue',
      description: 'Data stored row by row - each row contains all columns',
      structure: [
        'Row 1: [id=1, name="Alice", age=25, city="NYC"]',
        'Row 2: [id=2, name="Bob", age=30, city="LA"]',
        'Row 3: [id=3, name="Carol", age=28, city="SF"]'
      ],
      diskLayout: 'Contiguous blocks contain complete rows',
      bestFor: 'OLTP',
      advantages: [
        'Fast row lookups (SELECT * WHERE id = 1)',
        'Efficient inserts/updates (write entire row)',
        'Good for transactional workloads',
        'Simple to implement',
        'No assembly needed for full row'
      ],
      disadvantages: [
        'Slow for column scans (must read all columns)',
        'Poor compression (mixed data types)',
        'Cache inefficient for analytics',
        'Wasted I/O for column-specific queries'
      ],
      example: 'Reading user record: Fetch 1 block = get all user data ✓',
      databases: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server']
    },
    column: {
      name: 'Column-Store (Column-Oriented)',
      icon: '📈',
      color: 'purple',
      description: 'Data stored column by column - each column stored separately',
      structure: [
        'id column: [1, 2, 3]',
        'name column: ["Alice", "Bob", "Carol"]',
        'age column: [25, 30, 28]',
        'city column: ["NYC", "LA", "SF"]'
      ],
      diskLayout: 'Each column stored in separate blocks',
      bestFor: 'OLAP',
      advantages: [
        'Fast column scans (SELECT AVG(age))',
        'Excellent compression (same data type)',
        'Cache efficient for aggregations',
        'Read only needed columns',
        'Vectorized processing'
      ],
      disadvantages: [
        'Slow for full row reads (must join columns)',
        'Inefficient inserts/updates (modify multiple files)',
        'Complexity in implementation',
        'Poor for transactional workloads'
      ],
      example: 'Getting average age: Read only age column, skip rest ✓',
      databases: ['Snowflake', 'BigQuery', 'Redshift', 'ClickHouse', 'Vertica']
    }
  };

  const comparisonTable = [
    { aspect: 'Purpose', oltp: 'Run the business', olap: 'Analyze the business' },
    { aspect: 'Users', oltp: 'Many concurrent users', olap: 'Few analysts' },
    { aspect: 'Query Type', oltp: 'Simple, predefined', olap: 'Complex, ad-hoc' },
    { aspect: 'Response Time', oltp: 'Milliseconds', olap: 'Seconds to minutes' },
    { aspect: 'Data Volume', oltp: 'GB to TB', olap: 'TB to PB' },
    { aspect: 'Data Age', oltp: 'Current (days/months)', olap: 'Historical (years)' },
    { aspect: 'Updates', oltp: 'Frequent', olap: 'Rare (batch loads)' },
    { aspect: 'Normalization', oltp: 'Highly normalized (3NF)', olap: 'Denormalized (star/snowflake)' },
    { aspect: 'Storage', oltp: 'Row-based', olap: 'Column-based' },
    { aspect: 'Focus', oltp: 'Data integrity', olap: 'Query performance' }
  ];

  const hybridApproaches = {
    htap: {
      name: 'HTAP (Hybrid Transactional/Analytical Processing)',
      description: 'Single database handling both OLTP and OLAP workloads',
      icon: '🔄',
      color: 'teal',
      howItWorks: 'In-memory columnar store alongside row-store, real-time analytics without ETL',
      examples: ['SAP HANA', 'MemSQL', 'TiDB', 'Oracle Database In-Memory'],
      pros: [
        'Real-time analytics on fresh data',
        'No ETL delay',
        'Unified data model',
        'Reduced infrastructure'
      ],
      cons: [
        'Expensive licensing',
        'Resource contention',
        'Complex tuning',
        'Limited scale vs pure OLAP'
      ],
      useCase: 'Real-time fraud detection, dynamic pricing, operational analytics'
    },
    lambda: {
      name: 'Lambda Architecture',
      description: 'Separate batch and speed layers combined at serving layer',
      icon: '⚡',
      color: 'amber',
      howItWorks: 'Batch layer (OLAP) + Speed layer (OLTP) = Unified view',
      examples: ['Hadoop + Storm', 'Spark Batch + Spark Streaming'],
      pros: [
        'Handles both historical and real-time',
        'Fault-tolerant',
        'Scalable independently',
        'Accurate batch results'
      ],
      cons: [
        'Complex architecture',
        'Dual codebase maintenance',
        'Eventually consistent',
        'High operational overhead'
      ],
      useCase: 'IoT analytics, social media analytics, recommendation engines'
    },
    replication: {
      name: 'Read Replica for Analytics',
      description: 'Replicate OLTP database to separate OLAP instance',
      icon: '📋',
      color: 'blue',
      howItWorks: 'Master (OLTP) → Async replication → Replica (OLAP queries)',
      examples: ['PostgreSQL → BigQuery', 'MySQL → Redshift', 'Aurora → S3 → Athena'],
      pros: [
        'Simple architecture',
        'No impact on OLTP performance',
        'Use specialized OLAP database',
        'Cost-effective'
      ],
      cons: [
        'Data lag (minutes to hours)',
        'Duplication of storage',
        'Manual sync setup',
        'Schema transformation needed'
      ],
      useCase: 'Most common approach - daily/hourly reporting without impacting production'
    }
  };

  const selectedWorkload = workloadTypes[selectedType];
  const selectedStorageData = storageTypes[selectedStorage];
  const selectedHybridData = hybridApproaches[selectedHybrid];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">OLTP vs OLAP: Understanding Workload Types</h3>
        <p className="text-gray-600">
          Choose the right database architecture for transactional vs analytical workloads
        </p>
      </div>

      {/* Workload Type Selector */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(workloadTypes).map(([key, type]) => (
          <button
            key={key}
            onClick={() => setSelectedType(key)}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              selectedType === key
                ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <type.icon className={`w-8 h-8 ${selectedType === key ? `text-${type.color}-600` : 'text-gray-400'}`} />
              <div>
                <div className="font-bold text-xl">{type.name}</div>
                <div className="text-sm text-gray-600">{type.fullName}</div>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700">{type.tagline}</p>
          </button>
        ))}
      </div>

      {/* Workload Details */}
      <div className={`p-6 rounded-lg border-2 ${
        selectedType === 'oltp' ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'
      }`}>
        <div className="flex items-start gap-4 mb-4">
          <selectedWorkload.icon className={`w-12 h-12 ${selectedType === 'oltp' ? 'text-blue-600' : 'text-purple-600'}`} />
          <div>
            <h4 className="text-2xl font-bold">{selectedWorkload.fullName}</h4>
            <p className="text-gray-700">{selectedWorkload.description}</p>
          </div>
        </div>

        {/* Characteristics */}
        <div className="bg-white p-5 rounded-lg mb-4 border border-gray-200">
          <h5 className="font-bold text-lg mb-3">Workload Characteristics</h5>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(selectedWorkload.characteristics).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm text-gray-600 capitalize">{key}:</div>
                  <div className="text-sm text-gray-800">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Query Examples */}
        <div className="bg-white p-5 rounded-lg mb-4 border border-gray-200">
          <h5 className="font-bold text-lg mb-3">Typical Queries</h5>
          <div className="space-y-2">
            {selectedWorkload.queryExamples.map((query, index) => (
              <div key={index} className="bg-gray-900 p-3 rounded">
                <code className="text-green-400 text-xs">{query}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases & Databases */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Common Use Cases
            </h5>
            <ul className="space-y-2">
              {selectedWorkload.useCases.map((useCase, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-indigo-500">•</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h5 className="font-bold mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Recommended Databases
            </h5>
            <div className="flex flex-wrap gap-2">
              {selectedWorkload.databases.map((db, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedType === 'oltp'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {db}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h5 className="font-bold mb-3">Key Requirements</h5>
          <div className="flex flex-wrap gap-2">
            {selectedWorkload.requirements.map((req, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {req}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className=" from-slate-50 to-gray-50 p-6 rounded-lg border-2 border-gray-200">
        <h4 className="text-xl font-bold mb-4 text-center">Side-by-Side Comparison</h4>
        
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className=" from-blue-100 to-purple-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Aspect</th>
                <th className="px-4 py-3 text-center font-bold text-blue-700">OLTP</th>
                <th className="px-4 py-3 text-center font-bold text-purple-700">OLAP</th>
              </tr>
            </thead>
            <tbody>
              {comparisonTable.map((row, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-3 font-semibold text-sm bg-gray-50">{row.aspect}</td>
                  <td className="px-4 py-3 text-sm text-center">{row.oltp}</td>
                  <td className="px-4 py-3 text-sm text-center">{row.olap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage Types */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-xl font-bold mb-4 text-center">Row-Store vs Column-Store</h4>
        <p className="text-center text-gray-600 mb-6">
          Physical storage layout impacts query performance
        </p>

        <div className="flex gap-4 justify-center mb-6">
          {Object.entries(storageTypes).map(([key, storage]) => (
            <button
              key={key}
              onClick={() => setSelectedStorage(key)}
              className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all ${
                selectedStorage === key
                  ? `border-${storage.color}-500 bg-${storage.color}-50 shadow-lg`
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="text-3xl">{storage.icon}</span>
              <div className="text-left">
                <div className="font-bold">{storage.name}</div>
                <div className="text-xs text-gray-600">Best for {storage.bestFor}</div>
              </div>
            </button>
          ))}
        </div>

        <div className={`p-6 rounded-lg border-2 ${
          selectedStorage === 'row' ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedStorageData.icon}</span>
            <div>
              <h5 className="text-xl font-bold">{selectedStorageData.name}</h5>
              <p className="text-gray-700">{selectedStorageData.description}</p>
            </div>
          </div>

          {/* Data Structure */}
          <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
            <h6 className="font-bold mb-2">Data Structure:</h6>
            {selectedStorageData.structure.map((row, index) => (
              <div key={index} className="font-mono text-sm text-gray-700 mb-1">
                {row}
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2 italic">{selectedStorageData.diskLayout}</p>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h6 className="font-bold mb-2 text-green-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Advantages
              </h6>
              <ul className="space-y-1">
                {selectedStorageData.advantages.map((adv, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h6 className="font-bold mb-2 text-red-700 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Disadvantages
              </h6>
              <ul className="space-y-1">
                {selectedStorageData.disadvantages.map((dis, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Example & Databases */}
          <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
            <h6 className="font-bold mb-2">Example:</h6>
            <p className="text-sm text-gray-700">{selectedStorageData.example}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h6 className="font-bold mb-2">Databases Using This:</h6>
            <div className="flex flex-wrap gap-2">
              {selectedStorageData.databases.map((db, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {db}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hybrid Approaches */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-xl font-bold mb-4 text-center">Hybrid Approaches</h4>
        <p className="text-center text-gray-600 mb-6">
          Combining OLTP and OLAP in modern architectures
        </p>

        <div className="grid md:grid-cols-3 gap-3 mb-6">
          {Object.entries(hybridApproaches).map(([key, approach]) => (
            <button
              key={key}
              onClick={() => setSelectedHybrid(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedHybrid === key
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-3xl mb-2">{approach.icon}</div>
              <div className="font-bold text-sm">{approach.name}</div>
            </button>
          ))}
        </div>

        <div className=" from-indigo-50 to-blue-50 p-6 rounded-lg border-2 border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedHybridData.icon}</span>
            <div>
              <h5 className="text-xl font-bold">{selectedHybridData.name}</h5>
              <p className="text-gray-700">{selectedHybridData.description}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4">
            <h6 className="font-bold mb-2">How It Works:</h6>
            <p className="text-sm text-gray-700">{selectedHybridData.howItWorks}</p>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4">
            <h6 className="font-bold mb-2">Examples:</h6>
            <div className="flex flex-wrap gap-2">
              {selectedHybridData.examples.map((example, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {example}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg">
              <h6 className="font-bold mb-2 text-green-700">Pros:</h6>
              <ul className="space-y-1">
                {selectedHybridData.pros.map((pro, index) => (
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
                {selectedHybridData.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className=" from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h6 className="font-bold mb-2">Use Case:</h6>
            <p className="text-sm text-gray-700">{selectedHybridData.useCase}</p>
          </div>
        </div>
      </div>

      {/* Decision Guide */}
      <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200">
        <h4 className="text-xl font-bold mb-4">🎯 Decision Guide</h4>
        
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <h5 className="font-bold text-blue-700 mb-2">Choose OLTP when:</h5>
            <ul className="space-y-1 text-sm">
              <li>✓ Running business operations (orders, payments, bookings)</li>
              <li>✓ Need millisecond response times</li>
              <li>✓ Many concurrent users making small transactions</li>
              <li>✓ Data integrity is critical (ACID required)</li>
              <li>✓ Frequent inserts, updates, deletes</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h5 className="font-bold text-purple-700 mb-2">Choose OLAP when:</h5>
            <ul className="space-y-1 text-sm">
              <li>✓ Running reports and dashboards</li>
              <li>✓ Complex aggregations over large datasets</li>
              <li>✓ Historical analysis (trend analysis, forecasting)</li>
              <li>✓ Few concurrent users (analysts, executives)</li>
              <li>✓ Mostly read operations, rare writes</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h5 className="font-bold text-teal-700 mb-2">Use Hybrid (HTAP/Lambda/Replication) when:</h5>
            <ul className="space-y-1 text-sm">
              <li>✓ Need real-time analytics on operational data</li>
              <li>✓ Want to avoid ETL delays</li>
              <li>✓ Building dashboards on live data</li>
              <li>✓ Can afford higher complexity/cost</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <h4 className="text-xl font-bold mb-4">💡 Interview Tips</h4>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "Can I use the same database for OLTP and OLAP?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> Technically yes, but not recommended. OLAP queries (scanning millions of rows) 
              will slow down OLTP transactions. Common pattern: Use OLTP database for operations, replicate to OLAP database 
              (e.g., PostgreSQL → BigQuery) for analytics. This is called operational/analytical separation.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "Why is columnar storage better for analytics?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> Analytics queries typically aggregate specific columns (e.g., SUM(sales)). 
              Columnar storage reads only needed columns, skipping the rest. Also, columns compress better (same data type). 
              For "SELECT AVG(age) FROM users", columnar reads only the age column; row-store reads all columns.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-gray-800 mb-2">Q: "What's the difference between data warehouse and data lake?"</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">A:</span> Data Warehouse = Structured, schema-on-write, optimized for SQL queries (OLAP). 
              Data Lake = Raw unstructured data, schema-on-read, cheaper storage. Modern approach: Data Lakehouse combines both 
              (e.g., Databricks Delta Lake) - structured queries on data lake storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OltpVsOlapExpanded;
