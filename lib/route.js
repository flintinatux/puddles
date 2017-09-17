const h = require('snabbdom/h').default

const {
  compose, constant, curry, match, prop, replace, zipObj
} = require('./funky')

const action = require('./action')
const handle = require('./handle')

const HASHCHANGE = 'puddles/route/HASHCHANGE'

const attach = constant(dispatch =>
  global.addEventListener('hashchange', compose(dispatch, hashchange))
)

const hash = url => {
  const i = url.indexOf('#')
  return i > -1 ? url.slice(i) : ''
}

const hashchange = compose(action(HASHCHANGE), prop('newURL'))

const navigate = curry((routes, state, url) => {
  const path = hash(url)
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

const pathToRegexp = pattern =>
  new RegExp('^' + pattern.replace(/:[^\/]+?\.{3}/g, '(.*?)').replace(/:[^\/]+/g, '([^\\/]+)') + '\/?$')

const route = (initial, routes) => {
  if (!hash(location.href)) location.hash = initial

  const nav = navigate(routes)

  const init = nav({}, location.href)

  const reducer = handle(init, {
    [ HASHCHANGE ]: nav
  })

  return {
    actions: { route: { attach } },
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
