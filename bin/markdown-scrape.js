#!/usr/bin/env node

const markdownFilename = process.argv[2]
if (!markdownFilename) {
  console.error('Usage: markdown-scrape <markdown-file>')
  process.exit(1)
}
const markdownFile = require('fs').readFileSync(markdownFilename, 'utf8')
const { parse } = require('../src/parse')
const parsed = parse(markdownFile)
console.log(JSON.stringify(parsed, null, 2) + '\n')
