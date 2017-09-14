const curry = require('ramda/src/curry')
const p     = require('../../..')

const Layout = (Child, actions, state) =>
  p('div.layout', [
    p('div.nav', [
      p('a', { attrs: { href: p.href('/hello') } }, 'Hello'),
      p('span', { props: { innerHTML: '&nbsp;&nbsp;' } }),
      p('a', { attrs: { href: p.href('/counter') } }, 'Counter')
    ]),
    p('br'),
    p('div.content', [
      Child(actions, state)
    ])
  ])

module.exports = curry(Layout)
