import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Capacity Planning Component
 * Covers trend analysis, forecasting models, resource utilization, and scaling triggers
 */
export default function CapacityPlanning() {
  const [forecastPeriod, setForecastPeriod] = useState("3-months")
  const [growthRate, setGrowthRate] = useState(20)

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="inline-block">
          <div className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">
              📈
            </span>
            CAPACITY PLANNING
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          Trend Analysis & Resource Forecasting
        </h2>
        <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
          Proactively plan infrastructure capacity to avoid both over-provisioning waste and under-provisioning failures.
        </p>
      </div>

      {/* Forecasting Models */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl">Forecasting Models</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="linear">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="linear">Linear</TabsTrigger>
              <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
              <TabsTrigger value="ml">ML-Based</TabsTrigger>
              <TabsTrigger value="quantile">Quantile</TabsTrigger>
            </TabsList>

            <TabsContent value="linear" className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Badge variant="outline">Simple</Badge>
                  Linear Regression
                </h3>
                <p className="text-sm text-slate-700 mb-4">
                  Best for steady growth patterns. Fits a straight line through historical data points.
                </p>
                <div className="bg-white p-4 rounded-lg font-mono text-sm">
                  <div className="text-slate-600">// Python with scikit-learn</div>
                  <div>from sklearn.linear_model import LinearRegression</div>
                  <div className="mt-2">model = LinearRegression()</div>
                  <div>model.fit(X_train, y_train)</div>
                  <div>future_capacity = model.predict(future_dates)</div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <strong>✅ Use when:</strong> Consistent growth rate (e.g., 20% quarterly)
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seasonal" className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Badge variant="outline">Intermediate</Badge>
                  ARIMA / Seasonal Decomposition
                </h3>
                <p className="text-sm text-slate-700 mb-4">
                  Accounts for seasonal patterns (e.g., Black Friday traffic spikes, end-of-quarter batch jobs).
                </p>
                <div className="bg-white p-4 rounded-lg font-mono text-sm">
                  <div className="text-slate-600">// Python with statsmodels</div>
                  <div>from statsmodels.tsa.seasonal import seasonal_decompose</div>
                  <div className="mt-2">result = seasonal_decompose(timeseries, model='additive')</div>
                  <div>trend = result.trend</div>
                  <div>seasonal = result.seasonal</div>
                  <div>forecast = trend + seasonal</div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <strong>✅ Use when:</strong> Recurring patterns (daily, weekly, monthly cycles)
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ml" className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Badge variant="outline">Advanced</Badge>
                  ML-Based Forecasting (Prophet, LSTM)
                </h3>
                <p className="text-sm text-slate-700 mb-4">
                  Captures complex patterns, handles missing data, and incorporates external events.
                </p>
                <div className="bg-white p-4 rounded-lg font-mono text-sm">
                  <div className="text-slate-600">// Facebook Prophet</div>
                  <div>from fbprophet import Prophet</div>
                  <div className="mt-2">model = Prophet(yearly_seasonality=True)</div>
                  <div>model.fit(df)</div>
                  <div>future = model.make_future_dataframe(periods=90)</div>
                  <div>forecast = model.predict(future)</div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <strong>✅ Use when:</strong> Complex patterns, multiple seasonalities, holiday effects
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quantile" className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Badge variant="outline">Probabilistic</Badge>
                  Quantile Regression
                </h3>
                <p className="text-sm text-slate-700 mb-4">
                  Provides confidence intervals (P50, P90, P99) instead of a single prediction.
                </p>
                <div className="bg-white p-4 rounded-lg font-mono text-sm">
                  <div className="text-slate-600">// Plan for P90 capacity needs</div>
                  <div>p50_forecast = quantile_regression(0.5)</div>
                  <div>p90_forecast = quantile_regression(0.9)</div>
                  <div>p99_forecast = quantile_regression(0.99)</div>
                  <div className="mt-2 text-slate-600">// Provision for P90 to balance cost vs risk</div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <strong>✅ Use when:</strong> Need risk assessment (e.g., "90% confident we won't exceed")
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resource Utilization Metrics */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl">Key Utilization Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">💻</span> CPU & Memory
                </h4>
                <ul className="text-sm space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Target:</strong> 60-80% average utilization
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Alert:</strong> {">"} 85% for 15+ minutes
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Metrics:</strong> system.cpu.utilization, system.memory.usage
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">💾</span> Storage
                </h4>
                <ul className="text-sm space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Target:</strong> {"<"} 75% disk usage
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Alert:</strong> {">"} 80% (6 months lead time to provision)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Metrics:</strong> system.filesystem.utilization, database.size
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🌐</span> Network
                </h4>
                <ul className="text-sm space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Target:</strong> {"<"} 60% bandwidth utilization
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Alert:</strong> Packet loss {">"} 0.1%, latency spikes
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Metrics:</strong> system.network.io, connections.active
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🗄️</span> Database
                </h4>
                <ul className="text-sm space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Target:</strong> Connection pool {"<"} 70% used
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Alert:</strong> Query latency P95 increasing trend
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <strong>Metrics:</strong> db.connections, db.query.duration
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scaling Triggers */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl">Scaling Triggers & Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert className="border-purple-200 bg-purple-50">
              <AlertDescription>
                <strong>Rule of Thumb:</strong> Scale out (add instances) before you scale up (bigger instances). 
                Horizontal scaling provides better availability and cost efficiency.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-bold mb-2 text-green-900">Metric-Based</h4>
                <p className="text-sm text-slate-700 mb-3">
                  Scale when CPU {">"} 70% for 5 minutes
                </p>
                <div className="text-xs font-mono bg-white p-2 rounded border">
                  if avg(cpu_usage) {">"} 70:<br />
                  &nbsp;&nbsp;scale_out(+2 instances)
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="text-2xl mb-2">📅</div>
                <h4 className="font-bold mb-2 text-blue-900">Schedule-Based</h4>
                <p className="text-sm text-slate-700 mb-3">
                  Pre-scale for known events (Black Friday, batch jobs)
                </p>
                <div className="text-xs font-mono bg-white p-2 rounded border">
                  # Cron: Scale up at 8 AM<br />
                  0 8 * * * scale_to(20)
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <div className="text-2xl mb-2">🤖</div>
                <h4 className="font-bold mb-2 text-orange-900">Predictive</h4>
                <p className="text-sm text-slate-700 mb-3">
                  ML model predicts load 30 min ahead
                </p>
                <div className="text-xs font-mono bg-white p-2 rounded border">
                  predicted_load = model()<br />
                  if predicted {">"} threshold:<br />
                  &nbsp;&nbsp;scale_proactively()
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-xl">
              <h4 className="font-bold mb-4 text-lg">AWS Auto Scaling Example</h4>
              <pre className="text-xs overflow-x-auto bg-slate-800 p-4 rounded">
{`# CloudFormation / Terraform
AutoScalingPolicy:
  Type: AWS::AutoScaling::ScalingPolicy
  Properties:
    TargetTrackingConfiguration:
      PredefinedMetricType: ASGAverageCPUUtilization
      TargetValue: 70.0
    ScaleInCooldown: 300  # Wait 5 min before scaling in
    ScaleOutCooldown: 60  # Scale out quickly (1 min)`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Time Calculator */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl">Capacity Planning Lead Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left p-3 font-bold">Resource Type</th>
                    <th className="text-left p-3 font-bold">Provisioning Time</th>
                    <th className="text-left p-3 font-bold">Planning Horizon</th>
                    <th className="text-left p-3 font-bold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3">Cloud VM (Auto-scaled)</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-green-50">2-5 minutes</Badge>
                    </td>
                    <td className="p-3">Same day</td>
                    <td className="p-3 text-xs text-slate-600">Near-instant capacity</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3">Reserved Instances</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-yellow-50">1-2 weeks</Badge>
                    </td>
                    <td className="p-3">3-6 months</td>
                    <td className="p-3 text-xs text-slate-600">For cost savings (up to 70%)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3">Database (RDS, managed)</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-yellow-50">10-30 minutes</Badge>
                    </td>
                    <td className="p-3">1-2 months</td>
                    <td className="p-3 text-xs text-slate-600">Vertical scaling requires downtime</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3">Bare Metal Servers</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-red-50">4-8 weeks</Badge>
                    </td>
                    <td className="p-3">6-12 months</td>
                    <td className="p-3 text-xs text-slate-600">Procurement, delivery, setup</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3">Data Center Rack Space</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-red-50">3-6 months</Badge>
                    </td>
                    <td className="p-3">12-24 months</td>
                    <td className="p-3 text-xs text-slate-600">Contract negotiation, wiring, cooling</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Alert className="border-orange-200 bg-orange-50">
              <AlertDescription>
                <strong>⚠️ Plan Ahead:</strong> The longer the provisioning time, the further ahead you must forecast. 
                For bare metal, you need 12-18 month capacity forecasts.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl">Capacity Planning Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold mb-1">Review Quarterly</h4>
                  <p className="text-sm text-slate-600">
                    Update forecasts every 3 months with actual growth data
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold mb-1">Buffer for Spikes</h4>
                  <p className="text-sm text-slate-600">
                    Always provision 20-30% above P95 demand
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold mb-1">Monitor Trend Divergence</h4>
                  <p className="text-sm text-slate-600">
                    Alert when actual usage deviates {">"}15% from forecast
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold mb-1">Document Assumptions</h4>
                  <p className="text-sm text-slate-600">
                    Record growth rate, seasonal factors, upcoming launches
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                  ✗
                </div>
                <div>
                  <h4 className="font-bold mb-1">Don't Rely on Single Model</h4>
                  <p className="text-sm text-slate-600">
                    Use ensemble methods: linear + seasonal + ML
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                  ✗
                </div>
                <div>
                  <h4 className="font-bold mb-1">Ignore Business Events</h4>
                  <p className="text-sm text-slate-600">
                    Coordinate with product/marketing on launches
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                  ✗
                </div>
                <div>
                  <h4 className="font-bold mb-1">Over-provision "To Be Safe"</h4>
                  <p className="text-sm text-slate-600">
                    Wastes money. Use data-driven P90/P95 targets
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                  ✗
                </div>
                <div>
                  <h4 className="font-bold mb-1">Forget About Lead Times</h4>
                  <p className="text-sm text-slate-600">
                    DB scaling takes weeks, not minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <Card className="bg-gradient-to-br from-purple-900 to-blue-900 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Capacity Planning Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
              <h4 className="font-bold mb-2">📊 Grafana + Prometheus</h4>
              <p className="text-sm text-slate-200 mb-2">
                Time-series visualization with prediction plugins
              </p>
              <div className="text-xs text-slate-300">
                Plugin: grafana-ml-forecasting
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
              <h4 className="font-bold mb-2">☁️ AWS Compute Optimizer</h4>
              <p className="text-sm text-slate-200 mb-2">
                ML-powered rightsizing recommendations
              </p>
              <div className="text-xs text-slate-300">
                Free with AWS account
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
              <h4 className="font-bold mb-2">🐍 Python Ecosystem</h4>
              <p className="text-sm text-slate-200 mb-2">
                Prophet, ARIMA, pandas for custom models
              </p>
              <div className="text-xs text-slate-300">
                fbprophet, statsmodels, scikit-learn
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
