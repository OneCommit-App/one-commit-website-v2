# S6 structured data — October 28, 2026

Base main: `df915cb41ad1484ff06c1405a4d4803cc3970b43`. This is a source/schema change only; no public page copy, pricing section, homepage, privacy, terms, deployment or download configuration was changed.

## Implementation

- `lib/structured-data.ts` owns Organization, MobileApplication and FAQPage objects and script-safe serialization (`<` is escaped before embedding).
- The existing homepage `components/json-ld.tsx` now uses the shared MobileApplication and FAQ objects. It does not create a second app/FAQ set, and FAQ answers come directly from the existing visible `faqData`.
- `components/organization-json-ld.tsx` emits the site organization. `app/layout.tsx` gains one import and **one include line**; this is the only layout integration change.
- `lib/pricing.ts` owns the existing schema offer: price `0`, USD, and the unchanged capacity-limited beta description. This mirrors current public main; it does not choose a future price or reconcile with mobile-app billing. Claude's visual/pricing source remains untouched and needs coordinated maintenance if the offer changes.
- No invented rating, review, download URL, address, company registration, or social account is added. Organization facts are the site's existing name, canonical domain, logo and support email.

Organization appears on all routes. App + FAQ appear only on the homepage, where the matching content is visible. The app uses the organization `@id` for its publisher.

## Google Code test: pass with one non-critical warning

The exact exported graph in [structured-data-1028.json](evidence/structured-data-1028.json) was pasted as a JSON-LD script into **Google Rich Results Test → Code**, then submitted. This tests prepared local code without publishing a preview or asking Google to fetch a production URL.

Observed result: **2 valid items detected** — Organization: 1 valid; Software Apps: 1 valid. The app's only issue is **Missing field “aggregateRating” (optional)**, shown as non-critical. [Google result](https://search.google.com/test/rich-results/result?id=S-DQKJzPkhE2D0u5KSIZrQ), [Software Apps detail](https://search.google.com/test/rich-results/result/r%2Fsoftware-apps?id=S-DQKJzPkhE2D0u5KSIZrQ), [saved screenshot](evidence/google-rich-results-1028.png).

The submitted in-browser graph was compared with the exported file: exact object equality. A local production response check also compared the actual emitted graphs against that file, not just TypeScript objects: homepage has exactly one Organization, MobileApplication and FAQPage; privacy/download have Organization only. [Rendered evidence](evidence/structured-data-render-1028.json).

There is a source conflict to preserve: Google's [software-app documentation](https://developers.google.com/search/docs/appearance/structured-data/software-app), read October 28, still lists a rating or review as required, while the actual Code tool labels this missing field optional and returns valid. This PR reports the observed tool pass without promising eligibility, indexing or search appearance. A genuine visible rating/review remains absent; it must not be fabricated to satisfy a tool.

FAQPage is valid schema vocabulary, but Google's [May 2026 deprecation and subsequent documentation removal](https://developers.google.com/search/updates) say FAQ rich results no longer appear in Search. The test did not list a FAQ rich result. Organization/app test success is not a claim that Google will display FAQ snippets.

## Local checks

Node 24.19.0 / pnpm 10.18.3:

- `pnpm test:structured-data`: 3/3 pass (linked entities/offer provenance, exact FAQ equality, script-breakout regression).
- `pnpm typecheck`: pass.
- `pnpm build`: pass, 16/16 static pages and complete route table.
- Actual local `next start` HTML: three routes checked, no duplicate JSON-LD; graph exactly matches exported/tested values.
- Independent agent source/integration review: clear; independently repeated 3 tests and parsed the built HTML.
- `git diff --check`: pass. No `pnpm lint`, real waitlist entry, production write, merge or deployment.

To regenerate pasteable code: `pnpm exec node scripts/structured-data.test.mjs --export`. Wrap the resulting JSON in `<script type="application/ld+json">…</script>` for Google's Code input. Local contract tests are not a substitute for the hosted Google test.
