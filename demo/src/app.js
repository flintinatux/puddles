const assoc = require('ramda/src/assoc')
const p     = require('../..')
const thunk = require('redux-thunk').default

const ducks = require('./ducks')

const router = p.route('/hello', {
  '/counter': require('./views/counter'),
  '/hello':   require('./views/hello')
})

const actions    = assoc('route', router.actions, ducks.actions)
const reducer    = p.combine(assoc('route', router.reducer, ducks.reducers))
const middleware = [ thunk ]
const root       = document.body.querySelector('#root')
const { view }   = router

const { dispatch } = p.mount({ actions, middleware, reducer, root, view })
