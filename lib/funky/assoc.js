const curry = require('./curry')

// assoc : String -> a -> { k: v } -> { k: v }
const assoc = (prop, val, obj) => {
  const res = Object.assign({}, obj)
  res[prop] = val
  return res
}

module.exports = curry(assoc)
