const { mapObj, prop } = require('tinyfunk')

const ducks = {
  counter: require('./counter'),
  hello:   require('./hello')
}

exports.actions  = mapObj(prop('actions'), ducks)
exports.reducers = mapObj(prop('reducer'), ducks)
