export const budgets = Object.freeze({ mobileLcpMs: 2500, cls: 0.1, scriptTransferBytes: 250 * 1024 })

export function summarize(lhr, route, mode) {
  if (lhr.runtimeError) throw new Error(`${route} ${mode}: ${lhr.runtimeError.message}`)
  const score = lhr.categories?.performance?.score
  if (!Number.isFinite(score) || score < 0 || score > 1) throw new Error(`${route} ${mode}: invalid performance score`)
  for (const [id, audit] of Object.entries(lhr.audits ?? {})) {
    if (audit?.scoreDisplayMode === 'error' || audit?.errorMessage) {
      throw new Error(`${route} ${mode}: audit ${id} failed${audit.errorMessage ? `: ${audit.errorMessage}` : ''}`)
    }
  }
  const metric = (id) => {
    const value = lhr.audits[id]?.numericValue
    if (!Number.isFinite(value)) throw new Error(`${route} ${mode}: missing ${id}`)
    return value
  }
  const resources = lhr.audits['resource-summary']?.details?.items
  const script = resources?.find((item) => item.resourceType === 'script')
  if (!script || !Number.isFinite(script.transferSize)) throw new Error(`${route} ${mode}: missing script transfer weight`)
  const lcpMs = metric('largest-contentful-paint')
  const cls = metric('cumulative-layout-shift')
  const jsBytes = script.transferSize
  const failures = []
  if (mode === 'mobile' && lcpMs >= budgets.mobileLcpMs) failures.push('LCP')
  if (cls >= budgets.cls) failures.push('CLS')
  if (jsBytes > budgets.scriptTransferBytes) failures.push('JS')
  return { route, mode, score: Math.round(score * 100), lcpMs, cls, jsBytes, failures, warnings: lhr.runWarnings || [], finalUrl: lhr.finalDisplayedUrl }
}
