const { curry } = require('tinyfunk')
const p = require('../../..')

const style = { marginRight: '10px' }

const Layout = (Child, actions, state) =>
  p('div.layout', [
    p('div.nav', [
      p('a', { attrs: { href: '/hello' }, style }, 'Hello'),
      p('a', { attrs: { href: '/counter' }, style }, 'Counter'),
      p('a', { attrs: { href: '/bad' }, style }, 'Bad'),
      p('a', { attrs: { href: '//localhost:3000' }, style }, 'Internal'),
      p('a', { attrs: { href: 'https://google.com' }, style }, 'External')
    ]),
    p('br'),
    p('div.content', [
      Child(actions, state)
    ])
  ])

module.exports = curry(Layout)
