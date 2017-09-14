const map  = require('ramda/src/map')
const prop = require('ramda/src/prop')

const ducks = {
  counter: require('./counter'),
  hello:   require('./hello')
}

exports.actions  = map(prop('actions'), ducks)
exports.reducers = map(prop('reducer'), ducks)
