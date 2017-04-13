const events = require('snabbdom/modules/eventlisteners').default

const { wrapHandler } = require('../lib/util')

const wrapEvents = (hook, dispatch) => (oldVnode, vnode) => {
  const { data: { on } } = vnode
  if (on) {
    for (var name in on) {
      on[name] = wrapHandler(dispatch, on[name])
    }
  }
  events[hook](oldVnode, vnode)
}

module.exports = dispatch => ({
  create: wrapEvents('create', dispatch),
  update: wrapEvents('update', dispatch)
})
