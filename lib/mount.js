const attrs    = require('snabbdom/modules/attributes').default
const classes  = require('snabbdom/modules/class').default
const compose  = require('ramda/src/compose')
const flyd     = require('flyd')
const h        = require('snabbdom/h').default
const I        = require('ramda/src/identity')
const { init } = require('snabbdom')
const props    = require('snabbdom/modules/props').default
const style    = require('snabbdom/modules/style').default

const action = require('./action')
const batch  = require('./batch')
const error  = require('./error')
const events = require('./events')
const hooks  = require('./hooks')

const {
  fluxStandard,
  forkable,
  runnable,
  thenable,
  thunked,
  throttle
} = require('./util')

const mount = (elm, view, reducer=I) => {
  const dispatch = flyd.stream()
  const state = flyd.combine(reduceWith(reducer), [dispatch])
  state(reducer(undefined, {}))
  const root = flyd.scan(patch(dispatch), elm, throttle(state).map(view))

  function teardown() {
    root(patch(dispatch)(root(), h('div')))
    dispatch.end(true)
  }

  return { dispatch, root, state, teardown }
}

const patch = dispatch =>
  init([ attrs, classes, events(dispatch), hooks(dispatch), props, style ])

const reduceWith = reducer => (dispatch, state) => {
  const axn = dispatch()

  if (!axn) return

  if (thunked(axn)) {
    axn(dispatch, state)
    return
  }

  if (forkable(axn)) {
    axn.fork(dispatch, dispatch)
    return
  }

  if (runnable(axn)) {
    dispatch(axn.run())
    return
  }

  if (thenable(axn)) {
    axn.then(dispatch)
    return
  }

  if(!fluxStandard(axn)) return

  const { type, payload } = axn

  const dispatchAction = compose(dispatch, action(type))
  const dispatchError  = compose(dispatch, error(type))

  if (type === batch.type) {
    payload.forEach(dispatch)
  } else if (forkable(payload)) {
    payload.fork(dispatchError, dispatchAction)
  } else if (runnable(payload)) {
    dispatchAction(payload.run())
  } else if (thenable(payload)) {
    payload.then(dispatchAction, dispatchError)
  } else {
    return reducer(state(), axn)
  }
}

module.exports = mount
