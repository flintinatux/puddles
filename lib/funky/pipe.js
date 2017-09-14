const flip   = require('./flip')
const reduce = require('./reduce')
const thrush = require('./thrush')

// pipe : ((a -> b), ..., (y -> z)) -> a -> z
const pipe = (...fs) =>
  flip(reduce(thrush))(fs)

module.exports = pipe
