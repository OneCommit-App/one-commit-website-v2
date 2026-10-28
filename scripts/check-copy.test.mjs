import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import test from "node:test"
import { matchCopy, scanCopy } from "./check-copy.mjs"

const script = fileURLToPath(new URL("./check-copy.mjs", import.meta.url))
function fixture(files, run) {
  const root = mkdtempSync(path.join(os.tmpdir(), "check-copy-"))
  try {
    writeFileSync(path.join(root, "tsconfig.json"), JSON.stringify({ compilerOptions: { jsx: "preserve", baseUrl: ".", paths: { "@/*": ["./*"] } } }))
    for (const [file, text] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
      writeFileSync(path.join(root, file), text)
    }
    return run(root)
  } finally { rmSync(root, { recursive: true, force: true }) }
}

for (const [rule, input, matches] of [
  ["free", "Free FREE royalty-free error-free", 4],
  ["provider", "TFRRS MileSplit Athletic.net athletic.NET", 4],
  ["guarantee", "guarantee guaranteed NOT GUARANTEED", 3],
  ["odds", "odds ODDS", 2],
  ["percent-chance", "25% chance and 5%\nchance", 2],
  ["chance-of", "chance of a reply; CHANCE\nOF admission", 2],
  ["dollar-amount", "$0 $7.99 $1,000 $ 19 $.99", 5],
]) test(`lexical ${rule} pattern`, () => {
  assert.equal(matchCopy(input).filter((hit) => hit.rule === rule).length, matches)
})

test("word boundaries avoid unrelated words without semantic exclusions", () => {
  assert.deepEqual(matchCopy("freedom freeware oddsMaker guarantees unguaranteed TFRRSx athleticXnet chance offer $USD"), [])
  assert.equal(matchCopy("We cannot guarantee results; not free.").length, 2)
})

test("extracts JSX text, entities, literals, templates, inline splits and both conditional branches", () => {
  fixture({ "app/page.tsx": `
    const amount = 19;
    export default function Page() { return <main>
      <p>fr<strong>ee</strong></p>
      <p>chance <em>of</em> admission</p>
      <p>10%{' '}<span>chance</span></p>
      <p>&#70;ree &#36;7.99</p>
      <p>{'TFRRS' + ' and MileSplit'}</p>
      <p>{\`Pay $\${amount}\`}</p>
      <p>{flag ? 'guaranteed' : 'odds'}</p>
      <img alt="Athletic.net" title={'Free'} />
    </main> }
  ` }, (root) => {
    const findings = scanCopy(root).findings
    for (const rule of ["free", "chance-of", "percent-chance", "dollar-amount", "provider", "guarantee", "odds"]) assert.ok(findings.some((hit) => hit.rule === rule), rule)
    assert.ok(findings.some((hit) => hit.match === "$19"))
    assert.ok(findings.some((hit) => hit.match === "$7.99"))
    assert.ok(findings.some((hit) => hit.match === "free" && hit.line === 4))
  })
})

test("does not lint comments, identifiers, imports, unused data, comparisons or implementation attributes", () => {
  fixture({ "app/page.tsx": `
    import free from 'free';
    // Free TFRRS guaranteed odds 50% chance chance of $19
    const debug = 'Free guaranteed $19';
    export const metadata = { title: 'Welcome', openGraph: { url: 'https://free.test/odds' } };
    const plan = { internal: 'free', label: 'Welcome' };
    export default function Page() { return <div className="free" id="odds" data-kind="guaranteed" style={{ fontFamily: 'TFRRS' }}>
      {/* Athletic.net $99 */}<a href="/free">Welcome</a>
      <p>{plan.internal === 'free' ? 'Hello' : 'Welcome'}</p>
      <Card item={{title: "Welcome", href: "/free", src: "/odds"}} /><p>{plan.label}</p><img src="/MileSplit.png" alt="Example" />
    </div> }
  ` }, (root) => assert.deepEqual(scanCopy(root).findings, []))
})

test("follows local/imported objects and mapped arrays with source provenance", () => {
  fixture({
    "components/data.ts": `export const rows: {title: string, body: string}[] = [{ title: 'Hello', body: 'Welcome' }, { title: 'Free', body: 'not guaranteed' }];`,
    "app/page.tsx": `import { rows } from '@/components/data';
      const names = ['TFRRS', 'MileSplit'];
      export default function Page() { return <div>{rows.map(({title, body}) => <p>{title}: {body}</p>)}{names.map(name => <p>{name}</p>)}</div> }`,
  }, (root) => {
    const report = scanCopy(root)
    assert.equal(report.findings.length, 4)
    assert.equal(report.findings.filter((hit) => hit.file === "components/data.ts").length, 2)
  })
})

test("scans supplied component copy, metadata and JSON-LD but not technical props", () => {
  fixture({ "app/page.tsx": `
    export const metadata = { title: 'Free', description: 'chance of admission' };
    const schema = { description: 'not guaranteed' };
    export default function Page() { return <>
      <LegalArticle sections={[{ title: 'Odds', content: 'Athletic.net' }]} className="free" analyticsSource="free" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </> }
  ` }, (root) => assert.equal(scanCopy(root).findings.length, 5))
})

test("only dollar amounts sourced entirely from exact lib/pricing.ts are exempt", () => {
  fixture({
    "lib/pricing.ts": `export const price = '$19'; export const label = 'Free';`,
    "lib/other.ts": `export const price = '$49';`,
    "app/pricing.ts": `export const price = '$99';`,
    "app/page.tsx": `import {price, label} from '@/lib/pricing'; import {price as other} from '@/lib/other'; import {price as local} from './pricing';
      export default function Page() { return <div><p>{price}</p><p>{label}</p><p>{other}</p><p>{local}</p><p>$19</p></div> }`,
  }, (root) => {
    const hits = scanCopy(root).findings
    assert.deepEqual(hits.filter((hit) => hit.rule === "dollar-amount").map((hit) => hit.match).sort(), ["$19", "$49", "$99"])
    assert.ok(hits.some((hit) => hit.file === "lib/pricing.ts" && hit.rule === "free"))
  })
})

test("does not invent words across block boundaries or dynamic values", () => {
  fixture({ "app/page.jsx": `export default () => <><p>fr</p><p>ee</p><p>fr{unknown}ee</p><p>chance</p><p>of</p></>` }, (root) => assert.deepEqual(scanCopy(root).findings, []))
})

test("CLI report/strict/clean/error statuses and actionable output", () => {
  fixture({ "app/page.tsx": `export default () => <p>Free</p>` }, (root) => {
    const run = (args = []) => spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: "utf8" })
    assert.equal(run().status, 0)
    assert.equal(run(["--strict"]).status, 1)
    assert.equal(run(["--", "--strict"]).status, 1)
    assert.match(run().stdout, /app\/page\.tsx:1:\d+ \[free\]/)
    assert.equal(run(["--strcit"]).status, 2)
    assert.equal(run(["--help"]).status, 0)
    writeFileSync(path.join(root, "app/page.tsx"), "export default () => <p>Hello</p>")
    assert.equal(run(["--strict"]).status, 0)
    writeFileSync(path.join(root, "app/page.tsx"), "export default () => <p>")
    assert.equal(run().status, 2)
    rmSync(path.join(root, "app"), { recursive: true })
    assert.equal(run().status, 2)
  })
})
