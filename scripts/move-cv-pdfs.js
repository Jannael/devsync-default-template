import { readdir, cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const distDir = './dist'

// Copy preview-DEVSYNC.json to DEVSYNC.json
try {
  const previewContent = await readFile('./preview-DEVSYNC.json', 'utf-8')
  await writeFile('./DEVSYNC.json', previewContent, 'utf-8')
  console.log('Copied preview-DEVSYNC.json to DEVSYNC.json')
} catch (error) {
  console.error('Error copying preview-DEVSYNC.json:', error.message)
}

// Find all CV-[lang].pdf files in dist/[lang]/cv/ directories
const pdfFiles = []
const langDirs = await readdir(distDir, { withFileTypes: true })
for (const dir of langDirs) {
  if (dir.isDirectory()) {
    const cvDir = join(distDir, dir.name, 'cv')
    try {
      const files = await readdir(cvDir)
      for (const file of files) {
        if (file.match(/^CV-.*\.pdf$/)) {
          pdfFiles.push({
            src: join(cvDir, file),
            dest: join(distDir, file),
          })
        }
      }
    } catch {
      // cv directory doesn't exist or other error
    }
  }
}

// Copy PDF files to dist root
for (const { src, dest } of pdfFiles) {
  await cp(src, dest, { force: true })
  console.log(`Copied: ${src} -> ${dest}`)
}

if (pdfFiles.length === 0) {
  console.log('No CV PDF files found to move')
}