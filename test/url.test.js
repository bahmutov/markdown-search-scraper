const test = require('ava')
const { replaceMarkdownUrls } = require('../src/md-utils')

test('one url', (t) => {
  t.plan(1)
  const md = '![foo](https://example.com)'
  const replaced = replaceMarkdownUrls(md)
  t.is(replaced, 'foo')
})

test('two urls', (t) => {
  t.plan(1)
  const md = 'first ![foo](https://example.com) then [bar](https://example.com)'
  const replaced = replaceMarkdownUrls(md)
  t.is(replaced, 'first foo then bar')
})

test('nested link', (t) => {
  t.plan(1)
  const md =
    '# markdown-search-scraper [![ci](https://github.com/bahmutov/markdown-search-scraper/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bahmutov/markdown-search-scraper/actions/workflows/ci.yml)'
  // run the replace url twice to get the "ci" from the link
  const replaced = replaceMarkdownUrls(replaceMarkdownUrls(md))
  t.is(replaced, '# markdown-search-scraper ci')
})
