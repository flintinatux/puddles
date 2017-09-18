const merge = require('ramda/src/merge')
const p     = require('../..')

const ducks = require('./ducks')

const router = p.route({
  '/':        require('./views/hello'),
  '/counter': require('./views/counter'),
  '/hello':   require('./views/hello'),
  '/:404+':   require('./views/not-found')
})

const actions  = merge(ducks.actions, router.actions)
const reducer  = p.combine(merge(ducks.reducers, router.reducers))
const root     = document.body.querySelector('#root')
const { view } = router

p.mount({ actions, reducer, root, view })
