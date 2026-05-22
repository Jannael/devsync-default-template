import { readdir, copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const distDir = './dist'
const publicDir = './public'

const pdfFiles = []

try {
  const files = await readdir(publicDir)
  for (const file of files) {
    if (file.match(/^CV-\w+\.pdf$/)) {
      pdfFiles.push({
        src: join(publicDir, file),
        dest: join(distDir, file),
      })
    }
  }
} catch {
  // public directory doesn't exist
}

for (const { src, dest } of pdfFiles) {
  await mkdir(distDir, { recursive: true })
  await copyFile(src, dest)
  console.log(`Copied: ${src} -> ${dest}`)
}

if (pdfFiles.length === 0) {
  console.log('No CV PDF files found to move')
}
