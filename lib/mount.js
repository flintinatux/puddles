const attrs    = require('snabbdom/modules/attributes').default
const classes  = require('snabbdom/modules/class').default
const events   = require('snabbdom/modules/eventlisteners').default
const { init } = require('snabbdom')
const props    = require('snabbdom/modules/props').default
const style    = require('snabbdom/modules/style').default

const {
  compose, identity, map, mapObj, throttle, thrush
} = require('./funky')

const thunk = require('./thunk')

const DevTools = global.__REDUX_DEVTOOLS_EXTENSION__

const mount = opts => {
  const {
    actions    = {},
    dev        = true,
    middleware = [],
    reducer    = identity,
    root,
    view
  } = opts

  let elm   = root
  let state = reducer(undefined, {})

  const dispatch = axn => flow(axn)

  const getState = () => state

  const wrapped = mapObj(wrap(dispatch), actions)

  const render = throttle(() => {
    elm = patch(elm, view(wrapped, state))
  })

  const tools = dev && DevTools && DevTools.connect()
  tools && tools.init(state)

  const update = axn => {
    state = reducer(state, axn)
    render()
    tools && tools.send(axn, state)
  }

  const store = { dispatch, getState }

  const flow = compose(...map(thrush(store), [ thunk, ...middleware ]))(update)

  render()

  return { dispatch, getState }
}

const patch = init([ attrs, classes, events, props, style ])

const wrap = dispatch => action =>
  typeof action === 'function'
    ? compose(dispatch, action)
    : mapObj(wrap(dispatch), action)

module.exports = mount
