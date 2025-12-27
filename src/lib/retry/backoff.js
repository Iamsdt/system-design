const clampNumber = (value, min, max) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return min
    return Math.min(max, Math.max(min, numeric))
}

export const computeExponentialBackoffDelays = ({
    attempts,
    baseDelayMs,
    maxDelayMs,
    multiplier,
}) => {
    const safeAttempts = Math.max(1, Math.floor(attempts))
    const safeBase = clampNumber(baseDelayMs, 1, 60_000)
    const safeMax = clampNumber(maxDelayMs, safeBase, 120_000)
    const safeMultiplier = clampNumber(multiplier, 1.0, 10.0)

    return Array.from({ length: safeAttempts }, (_, index) => {
        const exp = safeBase * Math.pow(safeMultiplier, index)
        return Math.min(safeMax, Math.round(exp))
    })
}

export const applyJitter = ({ delayMs, strategy }) => {
    const base = Math.max(0, Math.round(delayMs))

    switch (strategy) {
        case "none":
            return base

        // Full jitter (AWS): sleep = rand(0, base)
        case "full":
            return Math.floor(Math.random() * (base + 1))

        // Equal jitter: sleep = base/2 + rand(0, base/2)
        case "equal": {
            const half = Math.floor(base / 2)
            return half + Math.floor(Math.random() * (half + 1))
        }

        // Decorrelated jitter (simple): sleep = min(max, rand(base, base*3))
        // Here we approximate: rand(base, base*3)
        case "decorrelated": {
            const min = base
            const max = base * 3
            return min + Math.floor(Math.random() * (max - min + 1))
        }

        default:
            return base
    }
}
