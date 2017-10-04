const {
  assocPath, converge, curry, curryN, identity, merge, pipe, unless
} = require('tinyfunk')

const fullPath = require('./fullPath')

const go = curry((opts, event) => {
  event.preventDefault()
  if (opts.attrs.href === fullPath()) return
  opts.actions.route.go(opts.attrs.href)
})

const ignore = curry((opts, event) =>
  typeof history.pushState !== 'function'
  || event.button
  || event.metaKey
  || event.altKey
  || event.ctrlKey
  || event.shiftKey
  || opts.attrs.target === '_blank'
  || event.currentTarget.origin !== location.origin
)

const link = actions => {
  const hook = linkify(actions)
  return { create: hook, destroy: hook, update: hook }
}

const linkify = curryN(2, (actions, old, vnode) => {
  vnode = vnode || old
  const { data: { link } } = vnode
  if (!link) return

  const addLinks = pipe(
    merge({ actions }),
    assocPath(['attrs', 'href'], link.href),
    converge(assocPath(['on', 'click']), [ onclick, identity ])
  )

  vnode.data = addLinks(vnode.data)
})

const onclick = converge(unless, [ ignore, go ])

module.exports = link
