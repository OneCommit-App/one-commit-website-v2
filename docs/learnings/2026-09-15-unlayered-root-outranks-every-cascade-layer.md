# Dark-scheme tokens wrapped in `@layer base` silently lose to the unlayered `:root` above them

## Problem
A complete dark palette was added to `app/globals.css` as `@layer base { @media (prefers-color-scheme: dark) { :root:not(.light) { --oc-bg: #06100c; ... } } }`. The build succeeded, the block was present in the compiled CSS, the media query matched in the browser — and every page still rendered light. `--oc-bg` resolved to `#f7f8f5`.

## Context that mattered
- The light palette lives in a bare `:root { }` at the top of `globals.css`. Bare means **unlayered**.
- CSS cascade layers rank BELOW unlayered styles. Every `@layer` — including Tailwind's own `theme`, `base`, `components`, `utilities` — loses to any unlayered declaration, regardless of source order or specificity.
- So `:root:not(.light)` inside `@layer base` lost to plain `:root`, even though it appeared later in the file AND had higher specificity. Both of those instincts are wrong here; layer rank is checked first.
- Tailwind 4 encourages `@layer base` for base styles, which is exactly what makes this trap easy to walk into.

## Approach
1. Confirm the rule reached the browser at all before suspecting the selector: `grep -o "prefers-color-scheme:dark[^}]*}[^}]*}" .next/static/css/*.css`. It was there — which rules out a build/purge problem and points at the cascade.
2. Confirm the media query itself matches: CDP `Emulation.setEmulatedMedia` + `matchMedia("(prefers-color-scheme: dark)").matches` → `true`. Query matched, value did not apply. Only the cascade is left.
3. Move both dark triggers (`@media` + `:root.dark`) out of `@layer base` so they are unlayered like the `:root` they override.

## Dead ends
- Raising specificity (`html:root:not(.light)`) — specificity is compared only *within* a layer, so it changes nothing across the layer boundary.
- Moving the block later in the file — source order is likewise only compared within a layer.
- Suspecting Tailwind had purged or rewritten the custom properties: it had not, the bytes were in the output.

## Reusable rule
Overrides must sit in the same layer as the declarations they override. If the base values are in a bare `:root`, the dark/theme overrides must be bare too — `grep -n "^:root\|@layer" app/globals.css` and check both blocks are on the same footing before debugging anything else.

## Verification
Unwrapped both blocks, rebuilt, CDP probe returned `{"mqDark":true,"bg":"#06100c"}` and the homepage captured dark at 1440. All ten release gates green at `0c1bbf8`. Related: [[2026-09-15-a-killed-pnpm-wrapper-leaves-the-real-server-listening]].
