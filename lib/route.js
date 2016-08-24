const compose   = require('ramda/src/compose')
const concat    = require('ramda/src/concat')
const flyd      = require('flyd')
const h         = require('snabbdom/h')
const pathToReg = require('path-to-regexp')

const reducer = require('../ducks/route')

const { hasOwnProperty } = Object.prototype,
      { routeChanged } = reducer,
      prefix = '#!'

const hash = e => location.hash.slice(prefix.length)

const route = (initial, routes={}) => {
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

  const url = flyd.stream(hash())

  window.addEventListener('hashchange', compose(url, hash))

  const route = flyd.combine(matchRoute, [url])

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

route.href = concat(prefix)
route.reducer = reducer

module.exports = route
