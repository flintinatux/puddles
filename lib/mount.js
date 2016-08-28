const attrs    = require('snabbdom/modules/attributes')
const classes  = require('snabbdom/modules/class')
const flyd     = require('flyd')
const I        = require('ramda/src/identity')
const { init } = require('snabbdom')
const props    = require('snabbdom/modules/props')
const style    = require('snabbdom/modules/style')

const action = require('./action')
const events = require('./events')
const hooks  = require('./hooks')
const { error, forkable, thenable } = require('./util')

const mount = (root, view, reducer=I) => {
  const dispatch = flyd.stream()
  const state = flyd.combine(reduceWith(reducer), [dispatch])
  state(reducer(undefined, {}))
  flyd.scan(patch(dispatch), root, state.map(view))

  function teardown() {
    patch(dispatch)(root, '')
    dispatch.end(true)
  }

  return { dispatch, state, teardown }
}

const patch = dispatch =>
  init([ attrs, classes, events(dispatch), props, style, hooks(dispatch) ])

const reduceWith = reducer => (dispatch, state) => {
  if (typeof dispatch() === 'function') {
    dispatch()(dispatch, state)
    return
  }

  const { type, payload } = dispatch()
  if (!type) return

  if (forkable(payload)) {
    payload.map(action(type)).fork(error, dispatch)
  } else if (thenable(payload)) {
    payload.then(action(type)).then(dispatch).catch(error)
  } else {
    return reducer(state(), dispatch())
  }
}

module.exports = mount
