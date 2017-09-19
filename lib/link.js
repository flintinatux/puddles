const {
  assocPath, converge, curry, identity, merge, pipe, unless
} = require('tinyfunk')

const fullPath = require('./fullPath')

const go = curry((opts, event) => {
  event.preventDefault()
  if (opts.attrs.href === fullPath()) return
  opts.actions.route.go(opts.attrs.href)
})

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

const link = actions => ({
  create:  linkify(actions),
  destroy: linkify(actions),
  update:  linkify(actions)
})

const linkify = curry((actions, old, vnode) => {
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
