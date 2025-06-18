#!/usr/bin/env node

const markdownFilename = process.argv[2]
const markdownFile = require('fs').readFileSync(markdownFilename, 'utf8')
const { parseForAi } = require('../src/parse-for-ai')
const parsed = parseForAi(markdownFile)
console.log(JSON.stringify(parsed, null, 2) + '\n')
