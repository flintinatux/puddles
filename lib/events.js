const compose = require('ramda/src/compose')
const events  = require('snabbdom/modules/eventlisteners')
const when    = require('ramda/src/when')

const { actionable } = require('../lib/util')

const arrInvoker = arr => e => {
  if (!arr.length) return
  return arr.length === 2
    ? arr[0](arr[1])
    : arr[0].apply(undefined, arr.slice(1))
}

const wrap = (hook, dispatch) => (oldVnode, vnode) => {
  const on = vnode.data.on = vnode.data.on || {}
  for (var name in on) {
    var fn = on[name]
    if (Array.isArray(fn)) fn = arrInvoker(fn)
    on[name] = compose(when(actionable, dispatch), fn)
  }
  events[hook](oldVnode, vnode)
}

module.exports = dispatch => ({
  create: wrap('create', dispatch),
  update: wrap('update', dispatch)
})
