const h = require('snabbdom/h').default

const {
  apply, compose, keys, map, mapObj, merge, prepend, tap, thrush, unit
} = require('tinyfunk')

const combine  = require('./combine')
const init     = require('./init')
const route    = require('./route')
const throttle = require('./throttle')
const thunk    = require('./thunk')

const { fullPath, locationHash } = require('./location')

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

  let hash       = false
  let hashchange = unit
  let onpopstate = unit
  let unsub      = unit
  let up         = true

  const dispatch = tap(axn => up && flow(axn))

  if (routes) {
    hash = /^#/.test(keys(routes)[0])
    const router = route(routes, hash)

    actions  = merge(actions, router.actions)
    reducers = merge(reducers, router.reducers)
    view     = router.view

    if (hash) {
      hashchange = compose(dispatch, actions.route.go, locationHash)
      addEventListener('hashchange', hashchange)
    } else {
      onpopstate = compose(dispatch, actions.route.back, fullPath)
      addEventListener('popstate', onpopstate)
    }
  }

  const reducer = combine(reducers)

  let state = reducer(void 0, {})

  const getState = () => state

  const wrapped = mapObj(wrap(dispatch), actions)

  const patch = init(wrapped, hash)

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
    removeEventListener('hashchange', hashchange)
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
