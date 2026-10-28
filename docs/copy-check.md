# Copy truth check

Run `pnpm check:copy` to review possible copy-truth issues. It reports findings
without failing the command. Run `pnpm check:copy --strict` to fail with exit 1
when findings or extraction-limit warnings exist. Invalid arguments, unreadable
source, parse errors, and an empty scan fail with exit 2 in either mode.
`pnpm test:copy` runs the Node test runner; no new dependency is required.

## Rules

Matching is case-insensitive and deliberately context-free:

- The word `free`, including `royalty-free` and `error-free`.
- `TFRRS`, `MileSplit`, and `Athletic.net`.
- `guarantee` and `guaranteed`, including negated statements.
- `odds`, `% chance`, and `chance of`.
- Dollar amounts, including `$0`, `$7.99`, `$1,000`, and `$.99`.

Only dollar amounts whose complete matched text originates in the exact file
`lib/pricing.ts` are exempt. That exception does not apply to other rules in that
file, similarly named files, or a `$` literal assembled elsewhere. This tool does
not create that file or make pricing decisions. No individual copy suppressions
or semantic exceptions are supported.

## What is extracted

The checker walks `.js`, `.jsx`, `.ts`, `.tsx`, and their `.mjs`/`.cjs`/`.mts`/`.cts`
variants under `app/` and `components/`. It uses the existing TypeScript parser,
project path aliases, and JSX compiler to read:

- JSX text, expression strings, numeric literals, concatenation, template strings,
  inline nested elements, both conditional branches, and logical fallback branches.
- Static variables, imported literal data, object properties, array elements,
  mapped array rows (including typed arrays and destructured rows), and defaults.
- Text-bearing HTML attributes such as `alt`, `title`, and `aria-label`.
- Values supplied to custom component props, excluding known implementation props
  such as classes, styles, URLs, IDs, events, and analytics identifiers.
- Next `metadata` initializers and literal JSON-LD passed through `JSON.stringify`.

Comments, import paths, string comparisons, unused data, class names, URLs,
identifiers, and executable source code are not searched as raw text. Static
imports can lead to findings in other project files, with that original file
reported. The checker never executes application code, starts the site, submits
forms, or contacts external services.

Each finding includes the originating source literal's line/column, rule, matched
text, and a short excerpt. Repeated rendering of the same source literal is
reported once per rule and matched token. Locations point to the start of the
source literal, not necessarily the exact character within a multiline string.

## Static limits

This is a source-copy review aid, not a browser crawl or proof that every runtime
string is covered. All JSX in the scan roots is considered, including components
that may not currently be routed, hidden states, and both conditional branches.

The checker cannot generally resolve API/CMS content, runtime props, state updates,
arbitrary function calls, dynamic object keys, computed property names, render
prop behavior, generated HTML, string manipulation methods, or imported package
content. Passing objects to a custom component conservatively scans their literal
values; a component may use only some of those values. Unknown dynamic values and
block elements create boundaries so unrelated text is not joined into a claim.
Custom component children are treated as adjacent text, even when their runtime
implementation changes that structure. Mapped items are separated; deliberately
assembling a single word across separate mapped items is not modeled.

Static alternatives can combine conservatively within an inline text run; they
are not a simulation of correlated conditions or row values. To bound work, an
inline run with more than 128 combinations is scanned in separate pieces and
emits an explicit warning; phrases spanning those pieces may be missed. Strict
mode fails on that warning. JSX entity and whitespace handling follows the
installed TypeScript JSX compiler. Human copy review and browser verification
remain necessary for dynamic content and newly introduced rendering patterns.

## Baseline and validation

See `docs/copy-check-baseline-1028.txt` for the report on origin/main `df915cb`
with the S1 tooling added and all application/copy files unchanged. The current
findings are review items for the copy owner; this engineering change does not
resolve or suppress them.

Checked on 2026-10-28 with Node 24.19.0 / pnpm 10.18.3:

- Baseline: **21 findings** across **100** source files, no extraction warnings:
  14 `free`, 6 `guarantee`, and 1 provider mention (`MileSplit`). No current odds,
  chance-phrase, or dollar-amount findings. These are lexical flags, not a claim
  that each statement is factually wrong.
- `pnpm test:copy`: **15/15 pass**, including every rule, JSX/JS literals, inline
  split text, entities, templates, typed/destructured mapped data, imported values,
  source-only exclusions, exact pricing-source exemption, and CLI exit statuses.
- `pnpm check:copy`: exit **0**; `pnpm check:copy --strict`: expected exit **1**.
- `pnpm typecheck`: exit **0**.
- `pnpm build`: exit **0**, compiled successfully and generated **16/16** static
  pages; the normal edge-runtime notice for the OG route remains.
- `git diff --check`: exit **0**. No application, component, pricing, legal-copy,
  or lockfile changes; no production actions or real form submissions.
