import compose from 'ramda/src/compose'
import events  from 'snabbdom/modules/eventlisteners'

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
    on[name] = compose(dispatch, fn)
  }
  events[hook](oldVnode, vnode)
}

export default dispatch => ({
  create: wrap('create', dispatch),
  update: wrap('update', dispatch)
})
