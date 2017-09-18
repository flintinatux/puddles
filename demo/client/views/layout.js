const curry = require('ramda/src/curry')
const p     = require('../../..')

const style = { marginRight: '10px' }

const Layout = (Child, actions, state) =>
  p('div.layout', [
    p('div.nav', [
      p('a', { link: { href: '/hello' }, style }, 'Hello'),
      p('a', { link: { href: '/counter' }, style }, 'Counter'),
      p('a', { link: { href: '/bad' }, style }, 'Bad')
    ]),
    p('br'),
    p('div.content', [
      Child(actions, state)
    ])
  ])

module.exports = curry(Layout)
