import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'

const declarationPattern = /\b(from\s+|import\s*\()(['"])(\.{1,2}\/[^'"]+)\2/g

function createVariant(source, moduleExtension) {
  return source
    .replace(
      declarationPattern,
      (match, prefix, quote, specifier) =>
        `${prefix}${quote}${specifier}${moduleExtension}${quote}`
    )
    .replace(/\n?\/\/# sourceMappingURL=.*$/m, '')
}

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      visit(path)
      continue
    }
    if (extname(entry.name) !== '.ts' || !entry.name.endsWith('.d.ts')) continue

    const source = readFileSync(path, 'utf8')
    const base = path.slice(0, -'.d.ts'.length)
    writeFileSync(`${base}.d.mts`, createVariant(source, '.mjs'))
    writeFileSync(`${base}.d.cts`, createVariant(source, '.cjs'))
  }
}

visit('dist')
