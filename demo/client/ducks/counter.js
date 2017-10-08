const { add, concat, evolve } = require('tinyfunk')
const p = require('../../..')

const ns = concat('demo/counter/')

const ADD = ns('ADD')

const init = {
  count: 0
}

const addToCount = (state, step) =>
  evolve({ count: add(step) }, state)

exports.reducer = p.handle(init, {
  [ ADD ]: addToCount
})

exports.actions = {
  add: p.action(ADD)
}
