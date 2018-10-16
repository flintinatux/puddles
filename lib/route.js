const h = require('snabbdom/h').default

const { curry, match, replace, zipObj } = require('tinyfunk')

const action   = require('./action')
const handle   = require('./handle')

const { fullPath, locationHash } = require('./location')

const BACK = 'puddles/route/BACK'
const GO   = 'puddles/route/GO'

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

const navigate = curry((routes, hash, state, path) => {
  if (!hash) history.pushState({}, '', path)
  return matchRoute(routes, state, path)
})

const pathToRegexp = pattern =>
  new RegExp('^' + pattern.replace(/:[^\/]+?\+/g, '(.*?)').replace(/:[^\/]+/g, '([^\\/]+)') + '\/?$')

// route :: Object -> Object
const route = (routes, hash) => {
  const curr = hash ? locationHash() : fullPath()
  const init = matchRoute(routes, {}, curr)

  const reducer = handle(init, {
    [ BACK ]: matchRoute(routes),
    [ GO   ]: navigate(routes, hash)
  })

  return {
    actions: { route: { back, go } },
    reducers: { route: reducer },
    view: view(routes)
  }
}

const view = curry((routes, actions, state) => {
  const { route: { pattern } } = state

  return h('div#root', [
    pattern ? routes[pattern](actions, state) : ''
  ])
})

module.exports = route
