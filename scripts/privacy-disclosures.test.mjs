import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const source = async (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("privacy policy discloses Riley voice interactions", async () => {
  const page = await source("app/privacy/page.tsx")

  for (const fragment of [
    "Voice Interactions: If you choose voice onboarding with Riley (our AI assistant) and grant microphone permission, your audio is processed by our voice-AI provider to hold the conversation and generate a transcript.",
    "The transcript and captured profile details are stored on your device, and profile details you confirm are saved to your account.",
    "A typed onboarding option is available if you prefer not to use voice.",
    "a voice-AI provider that processes audio to power Riley voice conversations",
    "Last updated August 31, 2026",
  ]) {
    assert.ok(page.includes(fragment), `privacy page missing voice disclosure: ${fragment}`)
  }
})

test("voice disclosure makes no unsupported promises", async () => {
  const page = (await source("app/privacy/page.tsx")).toLowerCase()

  for (const fragment of [
    "audio is never stored",
    "audio is deleted",
    "we do not record",
    "voice data is never shared",
    "audio is not retained",
  ]) {
    assert.ok(!page.includes(fragment), `privacy page contains unsupported voice promise: ${fragment}`)
  }
})

test("release workflow runs the privacy disclosure gate", async () => {
  const workflow = await source(".github/workflows/website-release.yml")
  assert.ok(
    workflow.includes("node --test scripts/privacy-disclosures.test.mjs"),
    "website-release.yml must run the privacy disclosure test",
  )
})
