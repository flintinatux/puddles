const concat = require('ramda/src/concat')

const { prefix } = require('./route')

module.exports = concat(prefix)
