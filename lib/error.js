const { curry } = require('./funky')

const error = (type, payload) => ({ type, payload, error: true })

module.exports = curry(error)
