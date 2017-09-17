const curry = require('./curry')

// apply : (* -> a) -> [*] -> a
const apply = (f, args) =>
  f.apply(null, args)

module.exports = curry(apply)
