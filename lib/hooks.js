const compose = require('ramda/src/compose')
const when    = require('ramda/src/when')

const { actionable, arrInvoker } = require('../lib/util')

const wrapHooks = dispatch => (_, vnode) => {
  const data = vnode.data, hook = data && data.hook
  if (hook) {
    for (var name in hook) {
      var fn = hook[name]
      if (Array.isArray(fn)) fn = arrInvoker(fn)
      hook[name] = compose(when(actionable, dispatch), fn)
    }
  }
}

module.exports = dispatch => ({
  create: wrapHooks(dispatch),
  update: wrapHooks(dispatch)
})
