// store : a -> a -> a
const store = value =>
  function _store() {
    if (arguments.length) value = arguments[0]
    return value
  }

module.exports = store
