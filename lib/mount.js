const attrs    = require('snabbdom/modules/attributes').default
const classes  = require('snabbdom/modules/class').default
const composeB = require('crocks/combinators/composeB')
const curry    = require('ramda/src/curry')
const events   = require('snabbdom/modules/eventlisteners').default
const flyd     = require('flyd')
const h        = require('snabbdom/h').default
const I        = require('ramda/src/identity')
const { init } = require('snabbdom')
const map      = require('ramda/src/map')
const merge    = require('ramda/src/merge')
const props    = require('snabbdom/modules/props').default
const style    = require('snabbdom/modules/style').default

const action = require('./action')
const error  = require('./error')

const {
  fluxStandard,
  forkable,
  functor,
  runnable,
  thenable,
  thunked,
  throttle
} = require('./util')

const mount = ({ actions={}, reducer=I, root: elm, view }) => {
  const dispatch = flyd.stream()
  const state    = flyd.combine(reduceWith(reducer), [ dispatch ])

  state(reducer(undefined, {}))

  actions = map(composeB(map(composeB(dispatch)), merge({})), actions)
  const root = flyd.scan(patch, elm, throttle(state).map(view(actions)))

  function teardown() {
    root(patch(root(), h('div')))
    dispatch.end(true)
  }

  return { dispatch, root, state, teardown }
}

const patch = init([ attrs, classes, events, props, style ])

const reduceWith = curry((reducer, dispatch, state) => {
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

  if (functor(axn)) {
    axn.map(dispatch)
    return
  }

  if(!fluxStandard(axn)) return

  const { type, payload } = axn

  const dispatchAction = composeB(dispatch, action(type))
  const dispatchError  = composeB(dispatch, error(type))

  if (forkable(payload)) {
    payload.fork(dispatchError, dispatchAction)
  } else if (runnable(payload)) {
    dispatchAction(payload.run())
  } else if (thenable(payload)) {
    payload.then(dispatchAction, dispatchError)
  } else {
    return reducer(state(), axn)
  }
})

module.exports = mount
