const curry = require('ramda/src/curry')
const p     = require('../../..')

const Layout = require('./layout')

const Counter = (actions, state) => {
  const { counter: { add } }   = actions
  const { counter: { count } } = state

  return p('div.counter', [
    p('input', {
      attrs: { readonly: true },
      props: { value: count }
    }),
    p('button', { on: { click: [ add, -1 ] } }, '-'),
    p('button', { on: { click: [ add,  1 ] } }, '+')
  ])
}

module.exports = Layout(curry(Counter))
