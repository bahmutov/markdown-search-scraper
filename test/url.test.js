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
