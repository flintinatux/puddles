import attrs    from 'snabbdom/modules/attributes'
import classes  from 'snabbdom/modules/class'
import flyd     from 'flyd'
import I        from 'ramda/src/identity'
import { init } from 'snabbdom'
import props    from 'snabbdom/modules/props'
import style    from 'snabbdom/modules/style'

import { debug, error, forkable, thenable } from './util'
import events from './events'
import hooks  from './hooks'

const mount = (root, { reducer=I, view }) => {
  const dispatch = flyd.stream()
  const state = flyd.combine(reduceWith(reducer), [dispatch])
  state(reducer(undefined, {}))
  dispatch.map(debug('dispatch'))
  state.map(debug('state'))
  flyd.scan(patch(dispatch), root, state.map(view))

  function teardown() {
    patch(dispatch)(root, '')
    dispatch.end(true)
  }

  return { dispatch, teardown }
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

export default mount
