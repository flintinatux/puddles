const compose = require('ramda/src/compose')
const when    = require('ramda/src/when')

const { actionable } = require('../lib/util')

const wrapHooks = dispatch => (_, vnode) => {
  const data = vnode.data, hook = data && data.hook
  if (hook) {
    for (let h in hook) {
      hook[h] = compose(when(actionable, dispatch), hook[h])
    }
  }
}

module.exports = dispatch => ({
  create: wrapHooks(dispatch),
  update: wrapHooks(dispatch)
})
