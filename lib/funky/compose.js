const pipe = require('./pipe')

// compose : ((y -> z), ..., (a -> b)) -> a -> z
const compose = (...fs) =>
  pipe(...fs.reverse())

module.exports = compose
