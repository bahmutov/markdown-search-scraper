#!/usr/bin/env node

const markdownFilename = process.argv[2]
if (!markdownFilename) {
  console.error('Usage: markdown-scrape-for-ai <markdown-file>')
  process.exit(1)
}

const markdownFile = require('fs').readFileSync(markdownFilename, 'utf8')
const { parseForAi } = require('../src/parse-for-ai')
const parsed = parseForAi(markdownFile)
console.log(JSON.stringify(parsed, null, 2) + '\n')
