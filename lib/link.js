const h = require('snabbdom/h').default

const { assocPath, converge, curry, unless } = require('./funky')

const fullPath = require('./fullPath')

const ignore = curry((opts, event) =>
  typeof history.pushState !== 'function'
  || event.button !== 0
  || event.metaKey
  || event.altKey
  || event.ctrlKey
  || event.shiftKey
  || opts.attrs.target === '_blank'
  || event.currentTarget.origin !== location.origin
)

const go = curry((opts, event) => {
  event.preventDefault()
  if (opts.attrs.href === fullPath()) return
  opts.actions.route.go(opts.attrs.href)
})

// link : (Object, [Vnode]) -> Vnode
const link = (opts, children=[]) =>
  h('a', assocPath(['on','click'], onclick(opts), opts), children)

const onclick = converge(unless, [ ignore, go ])

module.exports = link
