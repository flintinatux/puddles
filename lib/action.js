const { curry } = require('./funky')

const action = (type, payload) => ({ type, payload })

module.exports = curry(action)
