const curry = require('./curry')

// partial : (* -> a) -> [b] -> (* -> a)
const partial = (f, args) =>
  f.bind(null, ...args)

module.exports = curry(partial)
