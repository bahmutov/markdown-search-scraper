const { parseForAi, extractText } = require('../src/parse-for-ai')
const stripIndent = require('strip-indent').default

const test = require('ava')
const { readFileSync } = require('fs')
const { join } = require('path')

const example1 = readFileSync(
  join(__dirname, 'fixtures', 'ai', 'example1.md'),
  'utf8',
)

test.only('extractText', (t) => {
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

      // this is a comment
  `)
  t.is(
    text,
    expected,
    'should extract text without code blocks but with comments',
  )
})

test('AI example1', (t) => {
  t.plan(0)
  const parsed = parseForAi(example1)
  console.log(parsed)
  return
  t.true(Array.isArray(parsed), 'parsed should be an array')
  t.deepEqual(
    Object.keys(parsed[0]),
    ['type', 'content', 'hierarchy', 'url'],
    'first record has keys',
  )
  t.snapshot(parsed)
})
