const apply   = require('./apply')
const compose = require('./compose')
const curry   = require('./curry')
const juxt    = require('./juxt')

// converge : (b... -> c) -> [(a -> b)] -> a -> c
const converge = (after, fs) =>
  compose(apply(after), juxt(fs))

module.exports = curry(converge)
