import fs from 'fs'
import path from 'path'

const filePath = '../../src/app/layout.tsx'
const absolutePath = path.resolve(__dirname, filePath)

const data = "\nexport const dynamic = 'force-dynamic'\n"
fs.appendFile(absolutePath, data, () => true)
