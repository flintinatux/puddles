const compose   = require('ramda/src/compose')
const concat    = require('ramda/src/concat')
const flyd      = require('flyd')
const h         = require('snabbdom/h')
const pathToReg = require('path-to-regexp')

const action = require('./action')
const handle = require('./handle')

const { hasOwnProperty } = Object.prototype

const prefix = '#!',
      hash = e => location.hash.slice(prefix.length),
      url  = flyd.stream(hash())

window.addEventListener('hashchange', compose(url, hash))

exports.href = concat(prefix)

const ROUTE_CHANGED = 'puddles/route/ROUTE_CHANGED'

exports.reducer = handle({}, {
  [ ROUTE_CHANGED ]: (_, route) => route
})

exports.router = (initial, routes={}) => {
  const matchRoute = url => {
    const path = url()

    if (!path) {
      location.hash = prefix + initial
      return
    }

    for (var pattern in routes) {
      var keys = [],
          re = pathToReg(pattern, keys),
          m  = re.exec(path),
          params = {}

      if (m) {
        for (var i = 1; i < m.length; i++) {
          var key  = keys[i - 1],
              prop = key.name,
              val  = decodeURIComponent(m[i])

          if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
            params[prop] = val
          }
        }

        return { params, path, pattern }
      }
    }

    console.error('Route not found: %s', path)
  }

  const route = flyd.combine(matchRoute, [url])
  const routeChanged = action(ROUTE_CHANGED)

  const attach = dispatch => {
    dispatch(routeChanged(route() || {}))
    route.map(compose(dispatch, routeChanged))
  }

  return state =>
    h('div#root', [
      h('div#router', { redux: { create: attach } }, [
        state.route.pattern ? routes[state.route.pattern](state) : ''
      ])
    ])
}
