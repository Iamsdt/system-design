import PropTypes from "prop-types"
import { useMemo, useState } from "react"

import {
  applyJitter,
  computeExponentialBackoffDelays,
} from "@/lib/retry/backoff"

const formatMs = (ms) => `${Math.round(ms)}ms`

/**
 * Small bar-list visualization for retry delay series.
 */
const Bars = ({ items, maxValue, colorClassName }) => (
  <div className="space-y-2">
    {items.map((item) => {
      const pct = maxValue > 0 ? Math.max(2, (item.value / maxValue) * 100) : 0

      return (
        <div key={item.id} className="flex items-center gap-3">
          <div className="w-16 text-xs text-slate-600">#{item.attempt}</div>
          <div className="flex-1">
            <div className="h-2 rounded bg-slate-100 overflow-hidden">
              <div
                className={`h-2 rounded ${colorClassName}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="w-20 text-right text-xs font-semibold text-slate-800">
            {formatMs(item.value)}
          </div>
        </div>
      )
    })}
  </div>
)

Bars.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attempt: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  maxValue: PropTypes.number.isRequired,
  colorClassName: PropTypes.string.isRequired,
}

/**
 * Simple range input with associated label.
 */
const RangeField = ({
  id,
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange: handleChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="text-sm font-semibold text-slate-700 mb-2 block"
    >
      {label}: {valueLabel}
    </label>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      className="w-full accent-emerald-600"
    />
  </div>
)

RangeField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  valueLabel: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

const JitterStrategyPicker = ({ strategy, onStrategyChange }) => (
  <div>
    <div className="text-sm font-semibold text-slate-700 mb-2">
      Jitter strategy
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        { id: "none", label: "None" },
        { id: "full", label: "Full" },
        { id: "equal", label: "Equal" },
        { id: "decorrelated", label: "Decorrelated" },
      ].map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onStrategyChange(option.id)}
          className={`text-xs font-semibold rounded-lg px-3 py-2 border transition-colors ${
            strategy === option.id
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
)

JitterStrategyPicker.propTypes = {
  strategy: PropTypes.string.isRequired,
  onStrategyChange: PropTypes.func.isRequired,
}

const RuleOfThumb = () => (
  <div className="bg-emerald-50 rounded-xl p-4 text-sm text-slate-700">
    <div className="font-semibold text-slate-900 mb-1">Rule of thumb</div>
    <div>
      Add jitter so many clients don’t retry at the same time after an outage.
    </div>
  </div>
)

/**
 * Form controls for tuning retry backoff + jitter.
 */
const RetryJitterControls = ({
  attempts,
  baseDelayMs,
  maxDelayMs,
  multiplier,
  strategy,
  onAttemptsChange,
  onBaseDelayChange,
  onMaxDelayChange,
  onMultiplierChange,
  onStrategyChange,
  onReroll: handleReroll,
}) => {
  const attemptId = "retry-attempts"
  const baseId = "retry-base"
  const maxId = "retry-max"
  const multId = "retry-mult"

  const handleAttemptsSliderChange = (event) =>
    onAttemptsChange(Number(event.target.value))

  const handleBaseSliderChange = (event) =>
    onBaseDelayChange(Number(event.target.value))

  const handleMaxSliderChange = (event) =>
    onMaxDelayChange(Number(event.target.value))

  const handleMultiplierSliderChange = (event) =>
    onMultiplierChange(Number(event.target.value))

  const handleStrategyPick = (value) => onStrategyChange(value)

  return (
    <div className="space-y-4">
      <RangeField
        id={attemptId}
        label="Attempts"
        valueLabel={`${attempts}`}
        min={1}
        max={10}
        step={1}
        value={attempts}
        onChange={handleAttemptsSliderChange}
      />

      <RangeField
        id={baseId}
        label="Base delay"
        valueLabel={formatMs(baseDelayMs)}
        min={25}
        max={1000}
        step={25}
        value={baseDelayMs}
        onChange={handleBaseSliderChange}
      />

      <RangeField
        id={maxId}
        label="Max delay"
        valueLabel={formatMs(maxDelayMs)}
        min={500}
        max={15000}
        step={250}
        value={maxDelayMs}
        onChange={handleMaxSliderChange}
      />

      <RangeField
        id={multId}
        label="Multiplier"
        valueLabel={`${multiplier}x`}
        min={1}
        max={3}
        step={0.25}
        value={multiplier}
        onChange={handleMultiplierSliderChange}
      />

      <JitterStrategyPicker
        strategy={strategy}
        onStrategyChange={handleStrategyPick}
      />

      <button
        type="button"
        onClick={handleReroll}
        className="w-full bg-emerald-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-emerald-700 transition-colors"
      >
        Reroll jitter sample
      </button>

      <RuleOfThumb />
    </div>
  )
}

RetryJitterControls.propTypes = {
  attempts: PropTypes.number.isRequired,
  baseDelayMs: PropTypes.number.isRequired,
  maxDelayMs: PropTypes.number.isRequired,
  multiplier: PropTypes.number.isRequired,
  strategy: PropTypes.string.isRequired,
  onAttemptsChange: PropTypes.func.isRequired,
  onBaseDelayChange: PropTypes.func.isRequired,
  onMaxDelayChange: PropTypes.func.isRequired,
  onMultiplierChange: PropTypes.func.isRequired,
  onStrategyChange: PropTypes.func.isRequired,
  onReroll: PropTypes.func.isRequired,
}

const buildItems = (values) =>
  values.map((value, index) => ({
    id: `attempt-${index + 1}`,
    attempt: index + 1,
    value,
  }))

const useRetryJitterSeries = ({
  attempts,
  baseDelayMs,
  maxDelayMs,
  multiplier,
  strategy,
  seed,
}) => {
  const baseSeries = useMemo(() => {
    return computeExponentialBackoffDelays({
      attempts,
      baseDelayMs,
      maxDelayMs,
      multiplier,
    })
  }, [attempts, baseDelayMs, maxDelayMs, multiplier])

  const jitteredSeries = useMemo(() => {
    void seed
    return baseSeries.map((d) => applyJitter({ delayMs: d, strategy }))
  }, [baseSeries, strategy, seed])

  const maxValue = useMemo(
    () => Math.max(...baseSeries, ...jitteredSeries, 1),
    [baseSeries, jitteredSeries]
  )

  const baseItems = useMemo(() => buildItems(baseSeries), [baseSeries])
  const jitterItems = useMemo(
    () => buildItems(jitteredSeries),
    [jitteredSeries]
  )

  return { baseSeries, jitteredSeries, maxValue, baseItems, jitterItems }
}

/**
 * Interactive demo for exponential backoff + jitter.
 */
const RetryJitterDemo = () => {
  const [attempts, setAttempts] = useState(6)
  const [baseDelayMs, setBaseDelayMs] = useState(150)
  const [maxDelayMs, setMaxDelayMs] = useState(5_000)
  const [multiplier, setMultiplier] = useState(2)
  const [strategy, setStrategy] = useState("full")
  const [seed, setSeed] = useState(0)

  const { baseSeries, jitteredSeries, maxValue, baseItems, jitterItems } =
    useRetryJitterSeries({
      attempts,
      baseDelayMs,
      maxDelayMs,
      multiplier,
      strategy,
      seed,
    })

  const handleAttemptsChange = (value) => setAttempts(value)
  const handleBaseDelayChange = (value) => setBaseDelayMs(value)
  const handleMaxDelayChange = (value) => setMaxDelayMs(value)
  const handleMultiplierChange = (value) => setMultiplier(value)
  const handleStrategyChange = (value) => setStrategy(value)
  const handleReroll = () => setSeed((value) => value + 1)

  return (
    <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl  from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl">
          🔁
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">
            Retry + Jitter Demo
          </h4>
          <div className="text-xs text-slate-500">
            See why jitter prevents thundering herds
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RetryJitterControls
          attempts={attempts}
          baseDelayMs={baseDelayMs}
          maxDelayMs={maxDelayMs}
          multiplier={multiplier}
          strategy={strategy}
          onAttemptsChange={handleAttemptsChange}
          onBaseDelayChange={handleBaseDelayChange}
          onMaxDelayChange={handleMaxDelayChange}
          onMultiplierChange={handleMultiplierChange}
          onStrategyChange={handleStrategyChange}
          onReroll={handleReroll}
        />

        <div className="space-y-5">
          <div>
            <div className="text-sm font-bold text-slate-900 mb-2">
              Base backoff
            </div>
            <Bars
              items={baseItems}
              maxValue={maxValue}
              colorClassName="bg-emerald-600"
            />
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900 mb-2">
              With jitter
            </div>
            <Bars
              items={jitterItems}
              maxValue={maxValue}
              colorClassName="bg-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500">Total (base)</div>
              <div className="text-sm font-bold text-slate-900">
                {formatMs(baseSeries.reduce((a, b) => a + b, 0))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500">Total (jittered)</div>
              <div className="text-sm font-bold text-slate-900">
                {formatMs(jitteredSeries.reduce((a, b) => a + b, 0))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RetryJitterDemo
