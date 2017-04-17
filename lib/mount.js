const attrs    = require('snabbdom/modules/attributes').default
const classes  = require('snabbdom/modules/class').default
const compose  = require('ramda/src/compose')
const curryN   = require('ramda/src/curryN')
const flyd     = require('flyd')
const h        = require('snabbdom/h').default
const I        = require('ramda/src/identity')
const { init } = require('snabbdom')
const props    = require('snabbdom/modules/props').default
const style    = require('snabbdom/modules/style').default
const when     = require('ramda/src/when')

const action = require('./action')
const error  = require('./error')
const events = require('./events')
const hooks  = require('./hooks')

const {
  actionable,
  fluxStandard,
  forkable,
  functor,
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
  const axn     = dispatch(),
        guarded = when(actionable, dispatch)

  if (!axn) return

  if (thunked(axn)) {
    axn(guarded, state)
    return
  }

  if (forkable(axn)) {
    axn.fork(guarded, guarded)
    return
  }

  if (runnable(axn)) {
    guarded(axn.run())
    return
  }

  if (thenable(axn)) {
    axn.then(guarded)
    return
  }

  if (functor(axn)) {
    axn.map(guarded)
    return
  }

  if(!fluxStandard(axn)) return

  const { type, payload } = axn

  const dispatchAction = compose(dispatch, action(type))
  const dispatchError  = compose(dispatch, error(type))

  if (forkable(payload)) {
    payload.fork(dispatchError, dispatchAction)
  } else if (runnable(payload)) {
    dispatchAction(payload.run())
  } else if (thenable(payload)) {
    payload.then(dispatchAction, dispatchError)
  } else {
    return reducer(state(), axn)
  }
}

module.exports = curryN(2, mount)
