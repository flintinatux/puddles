const curry = require('./curry')

// map : Functor f => (a -> b) -> f a -> f b
const map = (f, functor) =>
  functor.map(f)

module.exports = curry(map)
