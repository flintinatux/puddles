const curry = require('./curry')

// match : RegExp -> String -> [String | Undefined]
const match = (regexp, string) =>
  string.match(regexp) || []

module.exports = curry(match)
