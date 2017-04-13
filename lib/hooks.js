const compose = require('ramda/src/compose')
const when    = require('ramda/src/when')

const { arrInvoker, present } = require('./util')

const wrapHooks = dispatch => (_, vnode) => {
  const { data: { hook } } = vnode
  if (hook) {
    for (var name in hook) {
      hook[name] = compose(when(present, dispatch), arrInvoker(hook[name]))
    }
  }
}

module.exports = dispatch => ({
  create: wrapHooks(dispatch),
  update: wrapHooks(dispatch)
})
