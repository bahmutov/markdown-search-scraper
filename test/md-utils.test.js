const { removeSingleTicks, removeBold } = require('../src/md-utils')

const test = require('ava')

test('removes single ticks', (t) => {
  t.plan(1)
  const removed = removeSingleTicks('this is `hello` example')
  t.is(removed, 'this is hello example')
})

test('removes **', (t) => {
  t.plan(1)
  const removed = removeBold('this is **Note:** text')
  t.is(removed, 'this is Note: text')
})
