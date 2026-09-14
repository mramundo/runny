/**
 * Rasterises the runner mark into every PNG the manifest and iOS ask for.
 * Run with `npm run icons` after touching public/favicon.svg.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = join(here, '..', 'public')

const VOLT = '#D8FF36'
const GROUND = '#0C0E11'
const EDGE = '#262D36'

/** Runner strokes on a 64-unit grid, shared by both icon variants.
 *  Same mark, same colours as the one in the app's own header. */
const runner = (scale, offset) => `
  <g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="${VOLT}"
     stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="4" opacity="0.45">
      <path d="M4 20h9"/><path d="M2 31h7"/><path d="M6 42h8"/>
    </g>
    <g stroke-width="6">
      <circle cx="44" cy="12.5" r="6.5" fill="${VOLT}" stroke="none"/>
      <path d="M40.5 22 30 33"/>
      <path d="M40 24.5 50 29.5 56.5 23"/>
      <path d="M35.5 27 26 23.5 20.5 29"/>
      <path d="M30 33 39.5 40 37.5 52.5"/>
      <path d="M30 33 20 43.5 11.5 41.5"/>
    </g>
  </g>`

const standard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect x="8" y="8" width="496" height="496" rx="112" fill="${GROUND}" stroke="${EDGE}" stroke-width="16"/>
  ${runner(5.625, 76)}
</svg>`

// Maskable icons get cropped to a circle by some launchers: everything that
// matters has to sit inside the middle 80%.
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${GROUND}"/>
  ${runner(4.1, 125)}
</svg>`

const targets = [
  { svg: standard, size: 192, file: 'pwa-192x192.png' },
  { svg: standard, size: 512, file: 'pwa-512x512.png' },
  { svg: standard, size: 180, file: 'apple-touch-icon.png' },
  { svg: maskable, size: 512, file: 'maskable-icon-512x512.png' },
]

for (const { svg, size, file } of targets) {
  const png = await sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer()
  await writeFile(join(publicDir, file), png)
  console.log(`wrote ${file} (${size}x${size}, ${(png.length / 1024).toFixed(1)} kB)`)
}

// Keep favicon.svg in step with the rasterised variant.
const current = await readFile(join(publicDir, 'favicon.svg'), 'utf8')
if (!current.includes('M30 33 39.5 40 37.5 52.5')) {
  console.warn('favicon.svg looks out of date with scripts/generate-icons.mjs')
}
