const h = require('snabbdom/h').default

const {
  apply, compose, identity, map, mapObj, merge, prepend, tap, thrush
} = require('tinyfunk')

const combine  = require('./combine')
const fullPath = require('./fullPath')
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

  let onpopstate = identity
  let unsub      = identity
  let up         = true

  const dispatch = tap(axn => up && flow(axn))

  if (routes) {
    const router = route(routes)
    actions      = merge(actions, router.actions)
    onpopstate   = compose(dispatch, actions.route.back, fullPath)
    reducers     = merge(reducers, router.reducers)
    view         = router.view
    addEventListener('popstate', onpopstate)
  }

  const reducer = combine(reducers)

  let state = reducer(void 0, {})

  const getState = () => state

  const wrapped = mapObj(wrap(dispatch), actions)

  const patch = init(wrapped)

  const render = throttle(() => {
    root = patch(root, view(wrapped, state))
  })

  const timeTravel = msg => {
    if (msg.type === 'DISPATCH') {
      state = JSON.parse(msg.state)
      render()
    }
  }

  const tools = dev && DevTools && DevTools.connect()

  if (tools) {
    tools.init(state)
    unsub = tools.subscribe(timeTravel)
  }

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
    removeEventListener('popstate', onpopstate)
    unsub()
    up = false
  }

  render()

  return { dispatch, getState, teardown }
}

const wrap = dispatch => action =>
  typeof action === 'function'
    ? compose(dispatch, action)
    : mapObj(wrap(dispatch), action)

module.exports = mount
