# A before/after screenshot diff needs a same-build noise baseline, and an audit fix starts from the advisory's exact range

**Date:** 2026-10-21
**Lane:** website audit bump (next 15.5.25 -> 15.5.27, sharp 0.35.4 -> 0.35.5, source-map-js 1.2.1 -> 1.2.2)

## Problem
`pnpm audit --prod` on main failed with 2 moderate and 2 high advisories, so CI's audit step stopped every gate after it (the parent pay e2e included). The brief said main was on next 14.2.25 and asked for a 14.2.x patch, or a 15.x upgrade if none existed. Main was already on 15.5.25.

Then the first before/after screenshot diff said the homepage changed (0.22% of pixels at 1280, 0.91% at 390) in the CTA phone screenshot, which looked like an image-pipeline change from the sharp bump.

## Context that mattered
- `pnpm audit --prod --json` gives each advisory's `vulnerable_versions` and `patched_versions`: next `>=15.0.0 <15.5.27` (GHSA-4jqv-mc3x-m676, GHSA-mcj8-r9mp-w47p), sharp `<0.35.5` (GHSA-wq5f-xc86-pv6w, via next), source-map-js `>=1.0.0 <1.2.2` (GHSA-68fv-2mgg-jv7q, via autoprefixer > postcss).
- sharp and postcss are already exact pins in `pnpm-workspace.yaml` `overrides:` (see [[2026-09-13-pnpm-override-keeps-vulnerable-transitive]]), so the parent's range does not decide them.
- The homepage has scroll-linked and lazy-loaded media; the other four routes are static text.

## Approach
1. Read `package.json` before choosing a path: the fix was a patch release in the same minor (15.5.27), not a 14.x or a major.
2. Smallest change per advisory: `next` 15.5.25 -> 15.5.27 in `package.json`; override `sharp` 0.35.4 -> 0.35.5; add override `source-map-js: 1.2.2` (postcss's `^1.2.1` already allows it). `eslint-config-next` is dev-only and outside `--prod`, so it stayed.
3. Check the lockfile moved only those: next, @next/env, 8 @next/swc-*, sharp + @img/sharp-* (libvips 1.3.3 -> 1.3.4), source-map-js. @vercel/analytics and geist keys changed only because their peer `next` version is part of the key.
4. Screenshots of /, /parents, /support, /privacy, /terms at 390 and 1280 with the repo's CDP pattern, TWICE per build (before, before2, after, after2), and diff with PIL.

## Dead ends
- Reading before-vs-after alone: the CTA phone region differed, and two runs of the AFTER build differed in exactly the same region. before2 vs after2 was identical outside the hero's top band, which also differs between two runs of one build. The change was run-to-run timing, not the bump.
- Blaming sharp: resizing `public/app/welcome.png` to 384/640/750/828 px webp q75 with sharp 0.35.4 (vips 8.18.6) and 0.35.5 (vips 8.18.7), each in its own process, gave byte-identical output. (Loading both sharps in one process is not a fair test: one libvips wins.)

## Reusable rule
Before calling a pixel diff a regression, diff two captures of the SAME build. Only a region that is stable within each build and different across builds is a real change. For an audit failure, start from `pnpm audit --json` ranges and the versions actually in `package.json`, not from the version someone remembers.

## Verification
`pnpm audit --prod`: "No known vulnerabilities found" (was 4). Full gate list green: lint, typecheck, security-headers, b2b-claims, privacy-disclosures, build, canonical-host, public-shell, home-ssr, download-states, git diff --check. before2 vs after2: 8 of 10 captures identical; home differs in 167 px (1280) and 346 px (390), all inside bands that also differ between two runs of one build. Page heights, titles and text lengths identical on every route.
