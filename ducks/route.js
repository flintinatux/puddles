const concat = require('ramda/src/concat')

const action = require('../lib/action')
const handle = require('../lib/handle')

const prefix = concat('puddles/route/')

const ROUTE_CHANGED = prefix('ROUTE_CHANGED')

const reducer = handle({}, {
  [ ROUTE_CHANGED ]: (_, route) => route
})

reducer.ROUTE_CHANGED = ROUTE_CHANGED
reducer.routeChanged  = action(ROUTE_CHANGED)

module.exports = reducer
