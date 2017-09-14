const curry = require('./curry')

const { slice } = Array.prototype

// nAry : Number -> (* -> a) -> (* -> a)
const nAry = (n, f) =>
  function _aried() {
    const args = n > 0 ? slice.call(arguments, 0, n) : []
    return f.apply(null, args)
  }

module.exports = curry(nAry)
