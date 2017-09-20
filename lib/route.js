const h = require('snabbdom/h').default

const { compose, constant, curry, match, replace, zipObj } = require('tinyfunk')

const action   = require('./action')
const handle   = require('./handle')
const fullPath = require('./fullPath')

const BACK = 'puddles/route/BACK'
const GO   = 'puddles/route/GO'

const attach = constant(dispatch =>
  addEventListener('popstate', compose(dispatch, popstate))
)

const back = action(BACK)
const go   = action(GO)

const matchRoute = curry((routes, state, path) => {
  for (let pattern in routes) {
    const vals = match(pathToRegexp(pattern), path)
    if (vals.length) {
      const keys = match(/:[^\/]+/g, pattern).map(replace(/:|\./g, ''))
      const params = zipObj(keys, vals.slice(1).map(decodeURIComponent))
      return { params, path, pattern }
    }
  }
  console.error('Route not found: %s', path)
  return state
})

const navigate = curry((routes, state, path) => {
  history.pushState({}, '', path)
  return matchRoute(routes, state, path)
})

const pathToRegexp = pattern =>
  new RegExp('^' + pattern.replace(/:[^\/]+?\+/g, '(.*?)').replace(/:[^\/]+/g, '([^\\/]+)') + '\/?$')

const popstate = compose(back, fullPath)

// route : Object -> Object
const route = routes => {
  const init = matchRoute(routes, {}, fullPath())

  const reducer = handle(init, {
    [ BACK ]: matchRoute(routes),
    [ GO   ]: navigate(routes)
  })

  return {
    actions: { route: { attach, go } },
    reducers: { route: reducer },
    view: view(routes)
  }
}

const view = curry((routes, actions, state) => {
  const { route: { attach } }  = actions
  const { route: { pattern } } = state

  return h('div#root', [
    h('div#router', { hook: { create: attach } }, [
      pattern ? routes[pattern](actions, state) : ''
    ])
  ])
})

module.exports = curry(route)
