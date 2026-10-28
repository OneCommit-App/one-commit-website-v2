import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import ts from "typescript"

// These are deliberately lexical rules: even "not guaranteed" and
// "royalty-free" are findings. Context belongs in human review, not exclusions.
export const rules = [
  { id: "free", pattern: /\bfree\b/gi },
  { id: "provider", pattern: /\b(?:TFRRS|MileSplit|Athletic\.net)\b/gi },
  { id: "guarantee", pattern: /\bguarantee(?:d)?\b/gi },
  { id: "odds", pattern: /\bodds\b/gi },
  { id: "percent-chance", pattern: /%\s+chance\b/gi },
  { id: "chance-of", pattern: /\bchance\s+of\b/gi },
  { id: "dollar-amount", pattern: /\$\s*(?:\d[\d,]*(?:\.\d+)?|\.\d+)/g },
]

export function matchCopy(text) {
  return rules.flatMap(({ id, pattern }) =>
    [...text.matchAll(new RegExp(pattern))].map((match) => ({ rule: id, text: match[0], index: match.index })),
  ).sort((a, b) => a.index - b.index || a.rule.localeCompare(b.rule))
}

const boundary = [{ text: "\0", node: null }]
const blockTags = new Set(["address", "article", "aside", "blockquote", "br", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "nav", "ol", "p", "pre", "section", "table", "td", "th", "tr", "ul"])
const textAttributes = new Set(["alt", "title", "placeholder", "aria-label", "aria-description", "aria-valuetext", "label", "description", "content", "text", "children", "value", "defaultValue"])
const implementationAttribute = /^(?:className|class|style|id|key|ref|href|src|srcSet|sizes|role|type|name|htmlFor|as|variant|size|color|on[A-Z].*|data-.*|aria-(?!label$|description$|valuetext$).*|analytics.*)$/
const decoded = new Map()

// Let the project's JSX compiler decode entities and apply JSX whitespace
// rules, instead of trying to parse source text or maintain an HTML regex.
function jsxLiteral(node) {
  const attribute = ts.isStringLiteral(node)
  const raw = attribute ? node.getText() : node.text
  const key = `${attribute}:${raw}`
  if (decoded.has(key)) return decoded.get(key)
  const input = attribute ? `const x = <x title=${raw} />` : `const x = <x>${raw}</x>`
  const output = ts.transpileModule(input, { compilerOptions: { jsx: ts.JsxEmit.React } }).outputText
  const parsed = ts.createSourceFile("literal.js", output, ts.ScriptTarget.Latest, true)
  const strings = []
  function walk(n) {
    if (ts.isStringLiteral(n)) strings.push(n.text)
    ts.forEachChild(n, walk)
  }
  walk(parsed)
  const value = strings.slice(1).join("") // First string is the synthetic tag "x".
  decoded.set(key, value)
  return value
}

function sourceFiles(root) {
  const files = []
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (/\.[cm]?[jt]sx?$/.test(entry.name) && !/\.d\.[cm]?ts$/.test(entry.name)) files.push(file)
    }
  }
  for (const dir of ["app", "components"]) {
    const target = path.join(root, dir)
    if (fs.existsSync(target)) walk(target)
  }
  return files
}

export function scanCopy(root = process.cwd()) {
  root = path.resolve(root)
  const files = sourceFiles(root)
  if (!files.length) throw new Error("No JavaScript/TypeScript source files found in app/ or components/.")
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json")
  const config = configPath ? ts.readConfigFile(configPath, ts.sys.readFile) : { config: {} }
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"))
  const options = ts.parseJsonConfigFileContent(config.config, ts.sys, root).options
  // Only local value declarations matter; package types and standard libraries
  // cannot supply copy and make repeated fixture scans unnecessarily expensive.
  const compilerOptions = { ...options, allowJs: true, noEmit: true, noLib: true, types: [] }
  const host = ts.createCompilerHost(compilerOptions)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (file, ...args) => {
    const relative = path.relative(root, file)
    if (relative.startsWith("..") || relative.split(path.sep).includes("node_modules")) return undefined
    return getSourceFile(file, ...args)
  }
  const program = ts.createProgram(files, compilerOptions, host)
  const checker = program.getTypeChecker()
  const findings = new Map()
  const warnings = new Set()
  const literal = (text, node) => [[{ text, node }]]
  const separate = (groups) => [[...boundary, ...groups.flatMap((group) => group.flatMap((run) => [...run, ...boundary]))]]
  const join = (left, right) => {
    if (left.length * right.length > 128) {
      warnings.add("More than 128 static text combinations; overflow branches are scanned separately (cross-branch phrases may be missed).")
      return separate([left, right])
    }
    return left.flatMap((a) => right.map((b) => [...a, ...b]))
  }
  const inProject = (node) => {
    const relative = path.relative(root, node.getSourceFile().fileName)
    return !relative.startsWith("..") && !relative.split(path.sep).includes("node_modules")
  }

  // Resolve value origins, rather than trusting the inferred property symbol:
  // TypeScript commonly attaches an array's inferred property to its first row.
  function resolve(node, seen = new Set()) {
    if (!node || seen.has(node) || !inProject(node)) return []
    seen = new Set(seen).add(node)
    const res = (n) => resolve(n, seen)
    const field = (values, key) => values.flatMap((value) => {
      if (ts.isObjectLiteralExpression(value)) return value.properties.flatMap((property) => {
        if (ts.isSpreadAssignment(property)) return field(res(property.expression), key)
        const name = property.name && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) || ts.isNumericLiteral(property.name)) ? property.name.text : null
        if (name !== key) return []
        return ts.isPropertyAssignment(property) ? res(property.initializer) : ts.isShorthandPropertyAssignment(property) ? res(property.name) : []
      })
      if (ts.isArrayLiteralExpression(value) && /^\d+$/.test(key)) return res(value.elements[Number(key)])
      return []
    })
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isTypeAssertionExpression(node) || ts.isNonNullExpression(node) || ts.isSatisfiesExpression(node)) return res(node.expression)
    if (ts.isConditionalExpression(node)) return [...res(node.whenTrue), ...res(node.whenFalse)]
    if (ts.isParameter(node)) {
      if (node.initializer) return res(node.initializer)
      const call = node.parent.parent
      if (ts.isCallExpression(call) && ts.isPropertyAccessExpression(call.expression) && call.expression.name.text === "map" && node.parent.parameters[0] === node) {
        return res(call.expression.expression).flatMap((value) => ts.isArrayLiteralExpression(value) ? value.elements.flatMap(res) : [])
      }
      return []
    }
    if (ts.isBindingElement(node)) {
      if (node.initializer) return res(node.initializer)
      const owner = node.parent.parent
      const values = ts.isParameter(owner) ? res(owner) : res(owner.initializer)
      const key = node.propertyName?.text ?? node.name.getText()
      return field(values, key)
    }
    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
      const key = ts.isPropertyAccessExpression(node) ? node.name.text : node.argumentExpression && (ts.isStringLiteral(node.argumentExpression) || ts.isNumericLiteral(node.argumentExpression)) ? node.argumentExpression.text : null
      return key === null ? [] : field(res(node.expression), key)
    }
    if (ts.isIdentifier(node)) {
      let symbol = checker.getSymbolAtLocation(node)
      if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol)
      return (symbol?.declarations ?? []).flatMap((declaration) => {
        if (!inProject(declaration)) return []
        if (ts.isParameter(declaration) || ts.isBindingElement(declaration)) return res(declaration)
        return declaration.initializer ? res(declaration.initializer) : []
      })
    }
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "filter") return res(node.expression.expression)
    return [node]
  }

  function evaluate(node, seen = new Set()) {
    if (!node || seen.has(node) || !inProject(node)) return [boundary]
    seen = new Set(seen).add(node)
    const ev = (n) => evaluate(n, seen)
    if (ts.isJsxText(node)) return literal(jsxLiteral(node), node)
    if (ts.isStringLiteral(node)) return literal(ts.isJsxAttribute(node.parent) ? jsxLiteral(node) : node.text, node)
    if (ts.isNoSubstitutionTemplateLiteral(node) || ts.isNumericLiteral(node)) return literal(node.text, node)
    if (ts.isJsxExpression(node)) return node.expression ? ev(node.expression) : [[]]
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isTypeAssertionExpression(node) || ts.isNonNullExpression(node) || ts.isSatisfiesExpression(node)) return ev(node.expression)
    if (ts.isTemplateExpression(node)) {
      return node.templateSpans.reduce((runs, span) => join(join(runs, ev(span.expression)), literal(span.literal.text, span.literal)), literal(node.head.text, node.head))
    }
    if (ts.isConditionalExpression(node)) return [...ev(node.whenTrue), ...ev(node.whenFalse)]
    if (ts.isBinaryExpression(node)) {
      if (node.operatorToken.kind === ts.SyntaxKind.PlusToken) return join(ev(node.left), ev(node.right))
      if (node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) return ev(node.right)
      if ([ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(node.operatorToken.kind)) return [...ev(node.left), ...ev(node.right)]
      return [boundary]
    }
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const runs = node.children.reduce((result, child) => join(result, ev(child)), [[]])
      const block = ts.isJsxElement(node) && blockTags.has(node.openingElement.tagName.getText())
      return block ? separate([runs]) : runs
    }
    if (ts.isJsxSelfClosingElement(node)) return [blockTags.has(node.tagName.getText()) ? boundary : []]
    if (ts.isArrayLiteralExpression(node)) return separate(node.elements.map(ev))
    if (ts.isObjectLiteralExpression(node)) return separate(node.properties.map((property) => {
      const name = property.name && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) ? property.name.text : ""
      if (/^(?:className|class|style|id|key|ref|href|src|srcSet|url|urlTemplate|metadataBase|eventName|analytics.*|@.*)$/.test(name)) return [[]]
      if (ts.isPropertyAssignment(property)) return ev(property.initializer)
      if (ts.isShorthandPropertyAssignment(property)) return ev(property.name)
      if (ts.isSpreadAssignment(property)) return ev(property.expression)
      return [[]]
    }))
    if (ts.isSpreadElement(node)) return ev(node.expression)
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
      if (!ts.isBlock(node.body)) return ev(node.body)
      const returns = []
      function walk(n) {
        if (ts.isReturnStatement(n)) returns.push(ev(n.expression))
        else if (n === node.body || !ts.isFunctionLike(n)) ts.forEachChild(n, walk)
      }
      walk(node.body)
      return separate(returns)
    }
    if (ts.isCallExpression(node)) {
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "map") return separate([ev(node.arguments[0])])
      if (node.expression.getText() === "JSON.stringify") return ev(node.arguments[0])
      // Arbitrary calls are not executed or interpreted.
      return [boundary]
    }
    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node) || ts.isIdentifier(node)) {
      const values = resolve(node)
      return values.length ? values.flatMap(ev) : [boundary]
    }
    return [[]]
  }

  function record(runs) {
    for (const segments of runs) {
      const text = segments.map((part) => part.text).join("")
      for (const match of matchCopy(text)) {
        let offset = 0
        const origins = segments.filter((part) => {
          const start = offset
          offset += part.text.length
          return part.node && start < match.index + match.text.length && offset > match.index
        })
        if (!origins.length) continue
        const pricingOnly = origins.every(({ node }) => path.relative(root, node.getSourceFile().fileName).split(path.sep).join("/") === "lib/pricing.ts")
        if (match.rule === "dollar-amount" && pricingOnly) continue
        const node = origins[0].node
        const source = node.getSourceFile()
        const file = path.relative(root, source.fileName).split(path.sep).join("/")
        const { line, character } = source.getLineAndCharacterOfPosition(node.getStart())
        const key = `${file}:${node.pos}:${match.rule}:${match.text.toLowerCase()}`
        const start = Math.max(text.lastIndexOf("\0", match.index) + 1, match.index - 65)
        const nextBoundary = text.indexOf("\0", match.index)
        const end = Math.min(nextBoundary < 0 ? text.length : nextBoundary, match.index + match.text.length + 95)
        findings.set(key, { file, line: line + 1, column: character + 1, rule: match.rule, match: match.text, excerpt: text.slice(start, end).replace(/\s+/g, " ").trim() })
      }
    }
  }

  for (const file of files) {
    const source = program.getSourceFile(file)
    if (source.parseDiagnostics.length) throw new Error(`${path.relative(root, file)}: ${ts.flattenDiagnosticMessageText(source.parseDiagnostics[0].messageText, "\n")}`)
    function walk(node) {
      if (ts.isJsxElement(node) || ts.isJsxFragment(node)) record(evaluate(node))
      if (ts.isJsxAttribute(node) && node.initializer) {
        const name = node.name.getText()
        const tag = node.parent.parent.tagName?.getText() ?? ""
        const customComponent = /^[A-Z]/.test(tag) || tag.includes(".")
        if (textAttributes.has(name) || name === "dangerouslySetInnerHTML" || (customComponent && !implementationAttribute.test(name))) record(evaluate(node.initializer))
      }
      // Next metadata is public copy even though it lives outside JSX.
      if (ts.isVariableDeclaration(node) && node.name.getText() === "metadata") record(evaluate(node.initializer))
      ts.forEachChild(node, walk)
    }
    walk(source)
  }
  return { files: files.length, findings: [...findings.values()].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column || a.rule.localeCompare(b.rule)), warnings: [...warnings] }
}

export function main(args = process.argv.slice(2)) {
  const unknown = args.filter((arg) => !["--strict", "--", "--help"].includes(arg))
  if (unknown.length) { console.error(`Unknown argument: ${unknown.join(" ")}`); return 2 }
  if (args.includes("--help")) {
    console.log("Usage: pnpm check:copy [--strict]\nScans static rendered copy in app/ and components/. Report-only by default; --strict fails on findings. See docs/copy-check.md for extraction limits.")
    return 0
  }
  try {
    const report = scanCopy()
    for (const item of report.findings) console.log(`${item.file}:${item.line}:${item.column} [${item.rule}] ${JSON.stringify(item.match)} — ${item.excerpt}`)
    for (const warning of report.warnings) console.warn(`WARNING: ${warning}`)
    console.log(`Copy check: ${report.findings.length} findings across ${report.files} source files (${args.includes("--strict") ? "strict" : "report-only"}).`)
    return args.includes("--strict") && (report.findings.length || report.warnings.length) ? 1 : 0
  } catch (error) {
    console.error(`Copy check failed: ${error.message}`)
    return 2
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main()
