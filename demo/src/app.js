const assoc = require('ramda/src/assoc')
const p     = require('../..')

const ducks = require('./ducks')

const router = p.route('/hello', {
  '/hello': require('./views/hello')
})

const actions  = assoc('route', router.actions, ducks.actions)
const reducer  = p.combine(assoc('route', router.reducer, ducks.reducers))
const root     = document.body.querySelector('#root')
const { view } = router

const { dispatch } = p.mount({ actions, reducer, root, view })
