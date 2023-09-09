import fs from 'fs'
import path from 'path'

const filePath = '../../src/app/layout.tsx'
const absolutePath = path.resolve(__dirname, filePath)

fs.readFile(absolutePath, 'utf8', (err, data) => {
  if (err) return

  const lines = data.split('\n')

  lines.pop()
  lines.pop()

  fs.writeFile(absolutePath, lines.join('\n'), () => true)
})
