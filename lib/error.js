const { curry } = require('./funky')

// error : String -> Error -> Action
const error = (type, payload) => ({ type, payload, error: true })

module.exports = curry(error)
