import { rm } from 'node:fs/promises'
import path from 'node:path'

const profiles = ['mobile', 'desktop']

function selection(value, defaults, allowed, label) {
  const values = value === undefined ? defaults : value.split(',').map((item) => item.trim())
  if (!values.length || values.some((item) => !item)) throw new Error(`${label} selection contains an empty entry`)
  if (new Set(values).size !== values.length) throw new Error(`${label} selection contains duplicate entries`)
  for (const item of values) if (!allowed.has(item)) throw new Error(`Unknown ${label.toLowerCase()} ${item}`)
  return values
}

export function selectCoverage(availableRoutes, routeSelection, modeSelection) {
  const available = new Set(availableRoutes)
  if (!available.size) throw new Error('No routes available')
  const routes = selection(routeSelection, [...available].sort(), available, 'Route')
  const modes = selection(modeSelection, profiles, new Set(profiles), 'Profile')
  const selectedRoutes = new Set(routes)
  const selectedModes = new Set(modes)
  const full = selectedRoutes.size === available.size && [...available].every((route) => selectedRoutes.has(route))
    && selectedModes.size === profiles.length && profiles.every((mode) => selectedModes.has(mode))
  return { routes, modes, full }
}

// Invalidate only prior summary markers. Preserve per-audit HTML/JSON diagnostics,
// unrelated files, and directories; never recursively remove the report folder.
// Called by the CLI at the beginning of a NEW run, never when importing this file.
export async function clearStaleSummaries(output) {
  for (const name of ['summary.json', 'summary.md', 'partial.json']) {
    await rm(path.join(output, name), { force: true })
  }
}
