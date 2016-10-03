const attrs    = require('snabbdom/modules/attributes')
const classes  = require('snabbdom/modules/class')
const compose  = require('ramda/src/compose')
const flyd     = require('flyd')
const I        = require('ramda/src/identity')
const { init } = require('snabbdom')
const props    = require('snabbdom/modules/props')
const style    = require('snabbdom/modules/style')

const action = require('./action')
const batch  = require('./batch')
const events = require('./events')
const hooks  = require('./hooks')
const { error, forkable, runnable, thenable } = require('./util')

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
  init([ attrs, classes, events(dispatch), hooks(dispatch), props, style ])

const reduceWith = reducer => (dispatch, state) => {
  if (typeof dispatch() === 'function') {
    dispatch()(dispatch, state)
    return
  }

  const { type, payload } = dispatch()

  if (type === batch.type) {
    payload.forEach(dispatch)
  } else if (forkable(payload)) {
    payload.map(action(type)).fork(error, dispatch)
  } else if (runnable(payload)) {
    payload.map(compose(dispatch, action(type))).run()
  } else if (thenable(payload)) {
    payload.then(action(type)).then(dispatch).catch(error)
  } else {
    return reducer(state(), dispatch())
  }
}

module.exports = mount
