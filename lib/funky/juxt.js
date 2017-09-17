const curry  = require('./curry')
const map    = require('./map')
const thrush = require('./thrush')

// juxt : [(a -> b)] -> a -> [b]
const juxt = (fs, x) =>
  map(thrush(x), fs)

module.exports = curry(juxt)
