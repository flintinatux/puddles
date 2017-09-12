const compose = require('ramda/src/compose')
const curry   = require('ramda/src/curry')
const path    = require('ramda/src/path')

const p = require('../../..')

const targetVal = path(['target', 'value'])

const Hello = (actions, state) => {
  const { hello: { setName } } = actions
  const { hello: { name } }    = state

  return p('div#root', [
    p('input', {
      attrs: { placeholder: 'Enter name' },
      on: { input: compose(setName, targetVal) },
      props: { value: name }
    }),

    p('h3', `Hello, ${name || 'world'}!`)
  ])
}

module.exports = curry(Hello)
