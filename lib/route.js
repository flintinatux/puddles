const compose = require('ramda/src/compose')
const curryN  = require('ramda/src/curryN')
const flyd    = require('flyd')
const h       = require('snabbdom/h').default
const K       = require('ramda/src/always')
const match   = require('ramda/src/match')
const replace = require('ramda/src/replace')
const zipObj  = require('ramda/src/zipObj')

const reducer = require('../ducks/route')

const { navigate } = reducer,
      prefix = '#!'

const hash = () => location.hash.slice(prefix.length)

const pathToRegexp = pattern =>
  new RegExp('^' + pattern.replace(/:[^\/]+?\.{3}/g, '(.*?)').replace(/:[^\/]+/g, '([^\\/]+)') + '\/?$')

const route = curryN(2, (initial, routes={}) => {
  const matchRoute = url => {
    const path = url()

    if (!path) {
      location.hash = prefix + initial
      return
    }

    for (let pattern in routes) {
      const vals = match(pathToRegexp(pattern), path)
      if (vals.length) {
        const keys = match(/:[^\/]+/g, pattern).map(replace(/:|\./g, ''))
        const params = zipObj(keys, vals.slice(1).map(decodeURIComponent))
        return { params, path, pattern }
      }
    }

    console.error('Route not found: %s', path)
  }

  const url = flyd.stream(hash())

  global.addEventListener('hashchange', compose(url, hash))

  const route = flyd.combine(matchRoute, [url])

  const attach = dispatch => {
    dispatch(navigate(route() || { params: {} }))
    route.map(compose(dispatch, navigate))
  }

  return state =>
    h('div#root', [
      h('div#router', { hook: { create: K(attach) } }, [
        state.route.pattern ? routes[state.route.pattern](state) : ''
      ])
    ])
})

route.reducer = reducer
route.prefix  = prefix

module.exports = route
