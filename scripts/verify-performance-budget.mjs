import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const repoRoot = path.resolve(import.meta.dirname, '..')
const distRoot = path.join(repoRoot, 'dist')
const assetsRoot = path.join(distRoot, 'assets')
const indexHtmlPath = path.join(distRoot, 'index.html')

const ENTRY_JS_RAW_BUDGET = 250_000
const ENTRY_JS_GZIP_BUDGET = 80_000
const ENTRY_CSS_RAW_BUDGET = 40_000
const ENTRY_CSS_GZIP_BUDGET = 8_000
const DEFERRED_3D_RAW_BUDGET = 1_000_000
const DEFERRED_3D_GZIP_BUDGET = 280_000

const DEFERRED_RUNTIME_PATTERNS = [
  /^HeroCanvas-.*\.js$/,
  /^CodeGraphBg-.*\.js$/,
  /^CartographicProductShowcase-.*\.js$/,
  /^react-three-fiber\.esm-.*\.js$/,
  /^three\.module-.*\.js$/,
]

if (!fs.existsSync(indexHtmlPath) || !fs.existsSync(assetsRoot)) {
  console.error('dist output is missing. Run `npm run build` before `npm run verify:performance`.')
  process.exit(1)
}

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8')
const entryJsMatch = indexHtml.match(/<script type="module" crossorigin src="\/assets\/([^"]+)"><\/script>/)
const entryCssMatch = indexHtml.match(/<link rel="stylesheet" crossorigin href="\/assets\/([^"]+)">/)

const failures = []

if (!entryJsMatch) failures.push('dist/index.html missing primary module script reference')
if (!entryCssMatch) failures.push('dist/index.html missing primary stylesheet reference')

const assetFiles = fs.readdirSync(assetsRoot)

const getAssetMetrics = (filename) => {
  const filePath = path.join(assetsRoot, filename)
  const rawBytes = fs.statSync(filePath).size
  const gzipBytes = zlib.gzipSync(fs.readFileSync(filePath)).length

  return { filename, rawBytes, gzipBytes }
}

const formatBytes = (value) => `${(value / 1024).toFixed(2)} kB`

if (entryJsMatch) {
  const metrics = getAssetMetrics(entryJsMatch[1])

  if (metrics.rawBytes > ENTRY_JS_RAW_BUDGET) {
    failures.push(`entry JS exceeds raw budget: ${formatBytes(metrics.rawBytes)} > ${formatBytes(ENTRY_JS_RAW_BUDGET)}`)
  }

  if (metrics.gzipBytes > ENTRY_JS_GZIP_BUDGET) {
    failures.push(`entry JS exceeds gzip budget: ${formatBytes(metrics.gzipBytes)} > ${formatBytes(ENTRY_JS_GZIP_BUDGET)}`)
  }
}

if (entryCssMatch) {
  const metrics = getAssetMetrics(entryCssMatch[1])

  if (metrics.rawBytes > ENTRY_CSS_RAW_BUDGET) {
    failures.push(`entry CSS exceeds raw budget: ${formatBytes(metrics.rawBytes)} > ${formatBytes(ENTRY_CSS_RAW_BUDGET)}`)
  }

  if (metrics.gzipBytes > ENTRY_CSS_GZIP_BUDGET) {
    failures.push(`entry CSS exceeds gzip budget: ${formatBytes(metrics.gzipBytes)} > ${formatBytes(ENTRY_CSS_GZIP_BUDGET)}`)
  }
}

const eager3dRefs = assetFiles.filter((filename) =>
  DEFERRED_RUNTIME_PATTERNS.some((pattern) => pattern.test(filename)) && indexHtml.includes(filename)
)

if (eager3dRefs.length > 0) {
  failures.push(`deferred 3D runtime is referenced from index.html: ${eager3dRefs.join(', ')}`)
}

const deferredRuntimeMetrics = assetFiles
  .filter((filename) => DEFERRED_RUNTIME_PATTERNS.some((pattern) => pattern.test(filename)))
  .map(getAssetMetrics)

if (deferredRuntimeMetrics.length !== DEFERRED_RUNTIME_PATTERNS.length) {
  failures.push('expected deferred 3D runtime chunks are missing from dist/assets')
}

const deferredRuntimeRawBytes = deferredRuntimeMetrics.reduce((total, asset) => total + asset.rawBytes, 0)
const deferredRuntimeGzipBytes = deferredRuntimeMetrics.reduce((total, asset) => total + asset.gzipBytes, 0)

if (deferredRuntimeRawBytes > DEFERRED_3D_RAW_BUDGET) {
  failures.push(
    `deferred 3D runtime exceeds raw budget: ${formatBytes(deferredRuntimeRawBytes)} > ${formatBytes(DEFERRED_3D_RAW_BUDGET)}`
  )
}

if (deferredRuntimeGzipBytes > DEFERRED_3D_GZIP_BUDGET) {
  failures.push(
    `deferred 3D runtime exceeds gzip budget: ${formatBytes(deferredRuntimeGzipBytes)} > ${formatBytes(DEFERRED_3D_GZIP_BUDGET)}`
  )
}

if (failures.length > 0) {
  console.error('Homepage performance budget verification failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Homepage performance budget verification passed.')
if (entryJsMatch) {
  const entryJsMetrics = getAssetMetrics(entryJsMatch[1])
  console.log(`- Entry JS: ${formatBytes(entryJsMetrics.rawBytes)} raw / ${formatBytes(entryJsMetrics.gzipBytes)} gzip`)
}
if (entryCssMatch) {
  const entryCssMetrics = getAssetMetrics(entryCssMatch[1])
  console.log(`- Entry CSS: ${formatBytes(entryCssMetrics.rawBytes)} raw / ${formatBytes(entryCssMetrics.gzipBytes)} gzip`)
}
console.log(`- Deferred 3D runtime: ${formatBytes(deferredRuntimeRawBytes)} raw / ${formatBytes(deferredRuntimeGzipBytes)} gzip`)
console.log('- Deferred 3D runtime is not eagerly referenced from dist/index.html.')
