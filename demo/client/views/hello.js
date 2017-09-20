const { compose, curry, path } = require('tinyfunk')
const p = require('../../..')

const Layout = require('./layout')

const targetVal = path(['target', 'value'])

const Hello = (actions, state) => {
  const { hello: { setName } } = actions
  const { hello: { name } }    = state

  return p('div.hello', [
    p('input', {
      attrs: { placeholder: 'Enter name' },
      on: { input: compose(setName, targetVal) },
      props: { value: name }
    }),

    p('h3', `Hello, ${name || 'world'}!`)
  ])
}

module.exports = Layout(curry(Hello))
