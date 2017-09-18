const curry = require('ramda/src/curry')
const p     = require('../../..')

const Layout = (Child, actions, state) =>
  p('div.layout', [
    p('div.nav', [
      p.link({ actions, attrs: { href: '/hello' } }, 'Hello'),
      p('span', { props: { innerHTML: '&nbsp;&nbsp;' } }),
      p.link({ actions, attrs: { href: '/counter' } }, 'Counter'),
      p('span', { props: { innerHTML: '&nbsp;&nbsp;' } }),
      p.link({ actions, attrs: { href: '/bad' } }, 'Bad')
    ]),
    p('br'),
    p('div.content', [
      Child(actions, state)
    ])
  ])

module.exports = curry(Layout)
