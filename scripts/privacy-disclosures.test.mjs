import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const source = async (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("privacy policy discloses Riley voice interactions", async () => {
  const page = await source("app/privacy/page.tsx")

  for (const fragment of [
    "Voice Interactions: If you choose voice onboarding with Riley (our AI assistant) and grant microphone permission, your audio is processed by ElevenLabs to hold the conversation and generate a transcript.",
    "The transcript and captured profile details are stored on your device.",
    "When you confirm your profile, OneCommit also stores the transcript and confirmed profile details with your account to complete onboarding and support Riley features.",
    "A typed onboarding option is available if you prefer not to use voice.",
    "ElevenLabs, which processes audio to power Riley voice conversations",
    "Last updated October 27, 2026",
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

test("sitemap reports privacy and terms revisions independently", async () => {
  const sitemap = await source("app/sitemap.ts")

  for (const fragment of [
    'const privacyModified = new Date("2026-10-27")',
    'url: "https://www.onecommit.us/privacy",\n      lastModified: privacyModified,',
    'const termsModified = new Date("2026-10-27")',
    'url: "https://www.onecommit.us/terms",\n      lastModified: termsModified,',
  ]) {
    assert.ok(sitemap.includes(fragment), `sitemap missing independent policy timestamp: ${fragment}`)
  }
})

test("privacy and terms follow proven api practice", async () => {
  const privacy = await source("app/privacy/page.tsx")
  const terms = await source("app/terms/page.tsx")
  const privacyLower = privacy.toLowerCase()
  const termsLower = terms.toLowerCase()

  for (const fragment of [
    "OpenAI for AI assistant requests",
    "OpenAI calls are sent with storage turned off.",
    "If you connect Outlook/Microsoft 365",
    "Gmail is not currently available.",
    "After you answer No, we do not use AI for you.",
    "Reported AI replies -- kept for up to 365 days, and deleted when the account is deleted.",
    "A de-identified purchase record for a paid pass may be kept, including an Apple or Stripe transaction id.",
    "If a date of birth shows you are under 13, we do not save that date of birth and we delete the account.",
    "AI features require a stored date of birth showing you are at least 13.",
  ]) {
    assert.ok(privacy.includes(fragment), `privacy page missing proven practice: ${fragment}`)
  }

  for (const fragment of [
    "OpenAI, and ElevenLabs",
    "When you connect Outlook/Microsoft 365",
    "Gmail is not currently available.",
    "After you answer No, we do not use AI for you.",
    "If you are under 13, we delete the account and we do not save that date of birth.",
    "the de-identified purchase record we may keep",
    "Outlook/Microsoft 365 is currently the only inbox option offered in the beta app, and Gmail is not currently available",
  ]) {
    assert.ok(terms.includes(fragment), `terms page missing proven practice: ${fragment}`)
  }

  for (const fragment of [
    "no personal data stored by ai vendors beyond processing",
    "gmail or outlook",
    "gmail/outlook",
    "only after consent",
    "only after you consent",
    "only after ai consent",
    "without parental consent",
  ]) {
    assert.ok(!privacyLower.includes(fragment), `privacy page still has an unproven claim: ${fragment}`)
    assert.ok(!termsLower.includes(fragment), `terms page still has an unproven claim: ${fragment}`)
  }
})

test("release workflow runs the privacy disclosure gate", async () => {
  const workflow = await source(".github/workflows/website-release.yml")
  assert.ok(
    workflow.includes("node --test scripts/privacy-disclosures.test.mjs"),
    "website-release.yml must run the privacy disclosure test",
  )
})
