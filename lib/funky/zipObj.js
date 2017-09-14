const curry = require('./curry')

// zipObj : [k] -> [v] -> { k: v }
const zipObj = (keys, vals) => {
  const res = {}
  for (let i = 0; i < keys.length; i++) res[keys[i]] = vals[i]
  return res
}

module.exports = curry(zipObj)
