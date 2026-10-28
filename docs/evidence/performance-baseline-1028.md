# Local performance baseline

Source: df915cb41ad1484ff06c1405a4d4803cc3970b43; Node v24.19.0; Lighthouse 13.6.0; 2026-10-28T23:45:56.525Z.

Report-only. Default mobile/desktop Lighthouse simulated throttling; one cold navigation per route/profile. Local measurements on this machine are not production field data. External HTTPS requests blocked. Runtime/audit failures exit nonzero; budget misses do not.

Budgets: mobile LCP < 2500 ms; CLS < 0.1; transferred JS <= 250 KiB/navigation. JS ceiling is an initial engineering budget, not a web standard.

| Route | Profile | Score | LCP s | CLS | JS KiB | Budget misses |
|---|---|---:|---:|---:|---:|---|
| / | mobile | 89 | 3.60 | 0.0000 | 185.1 | LCP |
| / | desktop | 99 | 0.87 | 0.0000 | 185.1 | none |
| /about | mobile | 99 | 2.16 | 0.0000 | 188.8 | none |
| /about | desktop | 99 | 0.82 | 0.0000 | 198.6 | none |
| /athletic-programs | mobile | 100 | 1.23 | 0.0000 | 191.1 | none |
| /athletic-programs | desktop | 99 | 0.63 | 0.0000 | 194.9 | none |
| /coaches | mobile | 100 | 0.93 | 0.0000 | 191.1 | none |
| /coaches | desktop | 100 | 0.54 | 0.0000 | 194.9 | none |
| /download | mobile | 100 | 0.93 | 0.0000 | 188.8 | none |
| /download | desktop | 100 | 0.51 | 0.0000 | 198.6 | none |
| /parents | mobile | 98 | 2.31 | 0.0000 | 188.8 | none |
| /parents | desktop | 100 | 0.47 | 0.0000 | 194.9 | none |
| /privacy | mobile | 100 | 0.93 | 0.0000 | 185.1 | none |
| /privacy | desktop | 100 | 0.26 | 0.0000 | 194.9 | none |
| /schools | mobile | 100 | 0.94 | 0.0000 | 191.1 | none |
| /schools | desktop | 100 | 0.52 | 0.0000 | 194.9 | none |
| /support | mobile | 100 | 0.94 | 0.0000 | 188.4 | none |
| /support | desktop | 100 | 0.28 | 0.0000 | 198.2 | none |
| /terms | mobile | 100 | 0.91 | 0.0000 | 185.1 | none |
| /terms | desktop | 100 | 0.27 | 0.0000 | 194.9 | none |
| /waitlist | mobile | 100 | 1.12 | 0.0000 | 188.8 | none |
| /waitlist | desktop | 100 | 0.54 | 0.0000 | 198.6 | none |

## Heaviest on-disk assets

Ranked raw file sizes, not transfer weight; includes unused public archive files. Check request reports before prioritizing. Proposals only: no image/video replacement.

| File | KiB | Proposed work |
|---|---:|---|
| public/app/profile.png | 1125.6 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/app/home.png | 804.2 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/app/riley.png | 754.2 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/app/brief.png | 717.2 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/proof-email.png | 711.7 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/match.png | 682.6 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/_archive/app-explore.png | 577.1 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/_archive/app-smart-add.png | 575.0 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/_archive/app-track-replies.png | 570.7 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/app/explore.png | 568.9 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/proof-engagement.png | 559.4 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/proof-dashboard.png | 547.9 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/track.png | 547.9 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/app/home-hero.png | 474.7 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/app/pipeline.png | 435.0 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| public/app/welcome.png | 234.2 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| .next/static/chunks/framework-faf1e4d1fc68a61c.js | 185.3 | Inspect bundle attribution and unused imports; split below-fold interactive code where measured. |
| public/app/onescore-card.png | 175.0 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| .next/static/chunks/232-87d94ee6d10e2e02.js | 169.8 | Inspect bundle attribution and unused imports; split below-fold interactive code where measured. |
| .next/static/chunks/f74b8410-8e240c0b5e4ac837.js | 169.0 | Inspect bundle attribution and unused imports; split below-fold interactive code where measured. |
| .next/static/chunks/442-c7f49b9020e8e772.js | 151.0 | Inspect bundle attribution and unused imports; split below-fold interactive code where measured. |
| .next/static/chunks/main-7e17639b34719ae4.js | 125.5 | Inspect bundle attribution and unused imports; split below-fold interactive code where measured. |
| .next/static/css/9f2cdea718413ecf.css | 118.3 | Check use and caching; do not delete without ownership review. |
| public/app/brief-today.png | 117.4 | Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check. |
| .next/static/chunks/polyfills-42372ed130431b0a.js | 110.0 | Inspect bundle attribution and unused imports; split below-fold interactive code where measured. |

public/demo.mp4: absent on this main snapshot; no replacement performed.

## Warnings

- /athletic-programs desktop: The page loaded too slowly to finish within the time limit. Results may be incomplete.
- /waitlist mobile: Clearing the browser cache timed out. Try auditing this page again and file a bug if the issue persists.
- /waitlist mobile: The page may not be loading as expected because your test URL (http://127.0.0.1:63164/waitlist) was redirected to http://127.0.0.1:63164/download. Try testing the second URL directly.
- /waitlist desktop: Clearing the browser cache timed out. Try auditing this page again and file a bug if the issue persists.
- /waitlist desktop: The page may not be loading as expected because your test URL (http://127.0.0.1:63164/waitlist) was redirected to http://127.0.0.1:63164/download. Try testing the second URL directly.
