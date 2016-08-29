const compose = require('ramda/src/compose')
const map     = require('ramda/src/map')
const when    = require('ramda/src/when')

const { actionable } = require('../lib/util')

module.exports = dispatch => ({
  create: (_, vnode) => {
    const data = vnode.data, hook = data && data.hook
    if (hook) {
      data.hook = map(h => compose(when(actionable, dispatch), h), hook)
    }
  }
})
