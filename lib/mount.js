const {
  compose, identity, map, mapObj, thrush
} = require('tinyfunk')

const init     = require('./init')
const throttle = require('./throttle')
const thunk    = require('./thunk')

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

  const patch = init(wrapped)

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

const wrap = dispatch => action =>
  typeof action === 'function'
    ? compose(dispatch, action)
    : mapObj(wrap(dispatch), action)

module.exports = mount
