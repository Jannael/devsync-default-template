import { readFile, writeFile } from 'node:fs/promises'

// Copy preview-DEVSYNC.json to DEVSYNC.json
try {
  const previewContent = await readFile('./preview-DEVSYNC.json', 'utf-8')
  await writeFile('./DEVSYNC.json', previewContent, 'utf-8')
  console.log('Copied preview-DEVSYNC.json to DEVSYNC.json')
} catch (error) {
  console.error('Error copying preview-DEVSYNC.json:', error.message)
}
