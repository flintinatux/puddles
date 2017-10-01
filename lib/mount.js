const h = require('snabbdom/h').default

const {
  apply, compose, map, mapObj, merge, prepend, thrush
} = require('tinyfunk')

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

  let router

  if (routes) {
    router   = route(routes)
    actions  = merge(actions, router.actions)
    reducers = merge(reducers, router.reducers)
    view     = router.view
  }

  const reducer = combine(reducers)

  let state = reducer(void 0, {})
  let up    = true

  const dispatch = axn => up && flow(axn)

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

  const flow = apply(compose)(
    map(thrush(store), prepend(thunk, middleware))
  )(update)

  const teardown = () => {
    patch(root, h('div'))
    up = false
    router && router.teardown()
  }

  render()

  return { dispatch, getState, teardown }
}

const wrap = dispatch => action =>
  typeof action === 'function'
    ? compose(dispatch, action)
    : mapObj(wrap(dispatch), action)

module.exports = mount
