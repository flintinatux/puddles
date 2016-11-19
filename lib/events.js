const compose = require('ramda/src/compose')
const events  = require('snabbdom/modules/eventlisteners')
const when    = require('ramda/src/when')

const { actionable, arrInvoker } = require('../lib/util')

const wrapEvents = (hook, dispatch) => (oldVnode, vnode) => {
  const data = vnode.data, on = data && data.on
  if (on) {
    for (var name in on) {
      var fn = on[name]
      if (Array.isArray(fn)) fn = arrInvoker(fn)
      on[name] = compose(when(actionable, dispatch), fn)
    }
  }
  events[hook](oldVnode, vnode)
}

module.exports = dispatch => ({
  create: wrapEvents('create', dispatch),
  update: wrapEvents('update', dispatch)
})
