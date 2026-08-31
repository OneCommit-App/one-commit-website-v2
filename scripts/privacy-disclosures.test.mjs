import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const source = async (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("privacy policy discloses Riley voice interactions", async () => {
  const page = await source("app/privacy/page.tsx")

  for (const fragment of [
    "Voice Interactions: If you choose voice onboarding with Riley (our AI assistant) and grant microphone permission, your audio is processed by our voice-AI provider to hold the conversation and generate a transcript.",
    "The transcript and captured profile details are stored on your device.",
    "When you confirm your profile, OneCommit also stores the transcript and confirmed profile details with your account to complete onboarding and support Riley features.",
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
    // The audio claims above were the original list. These are the ones this
    // change is actually about: the policy used to imply the transcript
    // stopped at the device, and it does not -- POST /v1/onboarding/
    // voice-profile writes it to user_preferences_raw under questionKey
    // 'voice_transcript' (api main src/controllers/v1/onboarding.js), and
    // preferences.js reads those rows back unfiltered. Without these, the
    // positive fragments above still pass with a flat contradiction sitting
    // beside them -- verified: injecting "The transcript never leaves your
    // device." into the privacy section left this suite 3/3 green.
    // "stored on your device" is deliberately NOT banned; the policy says it
    // truthfully. Only claims of exclusivity are.
    "transcript never leaves your device",
    "never leaves your device",
    "transcript stays on your device",
    "only stored on your device",
    "stored only on your device",
    "transcript is never stored",
    "transcript is not stored",
    "we do not store the transcript",
    "transcript is deleted",
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
