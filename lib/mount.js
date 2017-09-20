const { compose, map, mapObj, merge, thrush } = require('tinyfunk')

const combine  = require('./combine')
const init     = require('./init')
const route    = require('./route')
const throttle = require('./throttle')
const thunk    = require('./thunk')

const DevTools = global.__REDUX_DEVTOOLS_EXTENSION__

const mount = opts => {
  let {
    actions    = {},
    dev        = true,
    middleware = [],
    reducers   = {},
    root,
    routes,
    view
  } = opts

  if (routes) {
    const router = route(routes)
    actions  = merge(actions, router.actions)
    reducers = merge(reducers, router.reducers)
    view     = router.view
  }

  const reducer = combine(reducers)

  let state = reducer(undefined, {})

  const dispatch = axn => flow(axn)

  const getState = () => state

  const wrapped = mapObj(wrap(dispatch), actions)

  const patch = init(wrapped)

  const render = throttle(() => {
    root = patch(root, view(wrapped, state))
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
