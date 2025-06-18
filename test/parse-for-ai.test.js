const { parseForAi, extractText } = require('../src/parse-for-ai')
const stripIndent = require('strip-indent').default

const test = require('ava')
const { readFileSync } = require('fs')
const { join } = require('path')

const example1 = readFileSync(
  join(__dirname, 'fixtures', 'ai', 'example1.md'),
  'utf8',
)

const example2 = readFileSync(
  join(__dirname, 'fixtures', 'ai', 'example2.md'),
  'utf8',
)

const example3 = readFileSync(
  join(__dirname, 'fixtures', 'ai', 'example3.md'),
  'utf8',
)

test('extractText', (t) => {
  const md = stripIndent(`
      foo
      bar

      \`\`\`js
      // this is a comment
      const x = 1;
      \`\`\`
  `)
  const text = extractText(md)
  const expected = stripIndent(`
      foo
      bar
      this is a comment
  `).trim()
  t.is(
    text,
    expected,
    'should extract text without code blocks but with comments',
  )
})

test('AI example1', (t) => {
  t.plan(3)
  const parsed = parseForAi(example1)
  // console.log(parsed)
  t.true(Array.isArray(parsed), 'parsed should be an array')
  t.deepEqual(
    Object.keys(parsed[0]),
    ['text', 'content', 'url'],
    'first record has keys',
  )
  t.snapshot(parsed)
})

test('AI example1 with url', (t) => {
  t.plan(3)
  const parsed = parseForAi(example1, null, null, 'http://example.com')
  // console.log(parsed)
  t.true(Array.isArray(parsed), 'parsed should be an array')
  t.deepEqual(
    Object.keys(parsed[0]),
    ['text', 'content', 'url'],
    'first record has keys',
  )
  t.snapshot(parsed)
})

test('AI example2', (t) => {
  t.plan(3)
  const parsed = parseForAi(example2, null, null, 'http://example.com')
  // console.log(parsed)
  t.true(Array.isArray(parsed), 'parsed should be an array')
  t.is(parsed.length, 2, 'two records')
  t.snapshot(parsed)
})

test('AI example3 without HTML comments', (t) => {
  t.plan(1)
  const parsed = parseForAi(example3)
  // console.log(parsed)
  // should not have any HTML comments in the cleaned text
  // but can have HTML comments in the original content
  t.snapshot(parsed)
})
