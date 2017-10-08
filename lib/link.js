const {
  assocPath, compose, converge, curry, curryN, identity, merge, unless
} = require('tinyfunk')

const fullPath = require('./fullPath')

const external = new RegExp(`//(?!${location.host})`,'i')
const origin   = /(?:https?:)?\/\/[^\/]+/i

const go = curry((opts, event) => {
  event.preventDefault()
  const href = opts.attrs.href.replace(origin, '') || '/'
  if (href !== fullPath()) opts.actions.route.go(href)
})

const ignore = curry((opts, event) =>
  event.button   ||
  event.metaKey  ||
  event.altKey   ||
  event.ctrlKey  ||
  event.shiftKey ||
  opts.attrs.target === '_blank' ||
  external.test(opts.attrs.href)
)

const link = actions => {
  const hook = linkify(actions)
  return { create: hook, destroy: hook, update: hook }
}

const linkify = curryN(2, (actions, old, vnode) => {
  vnode = vnode || old
  const { attrs } = vnode.data
  if (attrs && attrs.href)
    vnode.data = compose(listen, merge({ actions }))(vnode.data)
})

const onclick = converge(unless, [ ignore, go ])

const listen = converge(assocPath(['on', 'click']), [ onclick, identity ])

module.exports = link
