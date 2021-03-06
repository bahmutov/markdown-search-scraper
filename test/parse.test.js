const { parse } = require('../src/parse')

const test = require('ava')
const { readFileSync } = require('fs')
const { join } = require('path')

const example1 = readFileSync(
  join(__dirname, 'fixtures', 'example1.md'),
  'utf8',
)

const example2 = readFileSync(
  join(__dirname, 'fixtures', 'example2.md'),
  'utf8',
)

const example3 = readFileSync(
  join(__dirname, 'fixtures', 'example3.md'),
  'utf8',
)

const example4 = readFileSync(
  join(__dirname, 'fixtures', 'example4.md'),
  'utf8',
)

test('example1', (t) => {
  t.plan(1)
  const parsed = parse(example1)
  t.snapshot(parsed)
})

test('example2', (t) => {
  t.plan(1)
  const parsed = parse(example2)
  // we want to make sure the anchor links
  // were parsed and only the text remains
  // and the links themselves were removed
  t.snapshot(parsed)
})

test('code blocks', (t) => {
  t.plan(1)
  const parsed = parse(example3)
  // no code blocks
  t.snapshot(parsed)
})

test('nested url', (t) => {
  t.plan(1)
  const parsed = parse(example4)
  t.snapshot(parsed)
})
