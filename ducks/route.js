const concat = require('ramda/src/concat')

const action = require('../lib/action')
const handle = require('../lib/handle')

const prefix = concat('puddles/route/')

const NAVIGATE = prefix('NAVIGATE')

const reducer = handle({}, {
  [ NAVIGATE ]: (_, route) => route
})

reducer.NAVIGATE = NAVIGATE
reducer.navigate = action(NAVIGATE)

module.exports = reducer
