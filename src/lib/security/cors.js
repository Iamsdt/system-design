const normalizeHeaderList = (value) => {
    if (!value) return []
    return value
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean)
        .map((h) => h.toLowerCase())
}

const splitAllowOrigins = (value) => {
    if (!value) return []
    return value
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean)
}

const isSimpleHeaderName = (name) => {
    const n = name.toLowerCase()
    return (
        n === "accept" ||
        n === "accept-language" ||
        n === "content-language" ||
        n === "content-type"
    )
}

const isSimpleContentType = (value) => {
    const v = String(value || "")
        .toLowerCase()
        .trim()
    return (
        v === "application/x-www-form-urlencoded" ||
        v === "multipart/form-data" ||
        v === "text/plain" ||
        v === "" // if omitted
    )
}

const isOriginAllowed = ({ origin, allowOrigins }) =>
    Boolean(origin) && (allowOrigins.includes("*") || allowOrigins.includes(origin))

const computeNeedsPreflight = ({ method, requestHeaders, contentType }) => {
    const requestMethod = String(method || "GET").toUpperCase()
    const methodIsSimple = ["GET", "HEAD", "POST"].includes(requestMethod)

    const headersAreSimple = requestHeaders.every(isSimpleHeaderName)
    const contentTypeIsSimple = isSimpleContentType(contentType)

    if (!methodIsSimple) return true
    if (!headersAreSimple) return true
    if (requestMethod === "POST" && !contentTypeIsSimple) return true

    return false
}

const computePreflightAllowed = ({
    needsPreflight,
    originAllowed,
    method,
    requestHeaders,
    allowMethods,
    allowHeaders,
}) => {
    if (!needsPreflight) return true
    if (!originAllowed) return false

    const requestMethod = String(method || "GET").toUpperCase().toLowerCase()
    if (!allowMethods.includes(requestMethod)) return false

    const allRequestHeadersAllowed = requestHeaders.every(
        (header) => allowHeaders.includes(header) || isSimpleHeaderName(header)
    )
    return allRequestHeadersAllowed
}

const computeResponseHeaders = ({
    origin,
    allowOrigins,
    allowMethodsCsv,
    allowHeadersCsv,
    allowCredentials,
    withCredentials,
}) => {
    const allowOrigin =
        allowOrigins.includes("*") && !withCredentials ? "*" : origin || ""

    return {
        "access-control-allow-origin": allowOrigin,
        "access-control-allow-credentials": allowCredentials ? "true" : "false",
        "access-control-allow-methods": allowMethodsCsv || "",
        "access-control-allow-headers": allowHeadersCsv || "",
        vary: "Origin",
    }
}

const computeReasons = ({
    origin,
    originAllowed,
    needsPreflight,
    preflightAllowed,
    withCredentials,
    allowCredentials,
    wildcardWithCredsInvalid,
}) => {
    const reasons = []
    if (!origin) reasons.push("No Origin header (not a CORS request)")
    if (origin && !originAllowed) reasons.push("Origin not allowed")
    if (needsPreflight && !preflightAllowed) reasons.push("Preflight would fail")
    if (withCredentials && !allowCredentials) reasons.push("Credentials not allowed")
    if (wildcardWithCredsInvalid) {
        reasons.push("Invalid: allow-origin '*' cannot be used with credentials")
    }

    return reasons
}

export const computeCorsOutcome = ({
    request: { origin, method, withCredentials, requestHeadersCsv, contentType },
    server: {
        allowOriginsCsv,
        allowMethodsCsv,
        allowHeadersCsv,
        allowCredentials,
    },
}) => {
    const allowOrigins = splitAllowOrigins(allowOriginsCsv)
    const allowMethods = normalizeHeaderList(allowMethodsCsv)
    const allowHeaders = normalizeHeaderList(allowHeadersCsv)

    const requestHeaders = normalizeHeaderList(requestHeadersCsv)

    const originAllowed = isOriginAllowed({ origin, allowOrigins })
    const needsPreflight = computeNeedsPreflight({
        method,
        requestHeaders,
        contentType,
    })

    const preflightAllowed = computePreflightAllowed({
        needsPreflight,
        originAllowed,
        method,
        requestHeaders,
        allowMethods,
        allowHeaders,
    })

    const wildcardWithCredsInvalid =
        withCredentials && allowOrigins.includes("*") && allowCredentials

    const actualAllowed =
        originAllowed &&
        preflightAllowed &&
        (!withCredentials || allowCredentials) &&
        !wildcardWithCredsInvalid

    const responseHeaders = computeResponseHeaders({
        origin,
        allowOrigins,
        allowMethodsCsv,
        allowHeadersCsv,
        allowCredentials,
        withCredentials,
    })

    const reasons = computeReasons({
        origin,
        originAllowed,
        needsPreflight,
        preflightAllowed,
        withCredentials,
        allowCredentials,
        wildcardWithCredsInvalid,
    })

    return {
        needsPreflight,
        preflight: { needed: needsPreflight, allowed: preflightAllowed },
        actual: { allowed: actualAllowed },
        isOriginAllowed: originAllowed,
        responseHeaders,
        reasons,
    }
}
