const action = require('./action')

const type  = 'puddles/actions/BATCH'

const batch = x =>
  action(type, Array.isArray(x) ? x : [x])

batch.type = type

module.exports = batch
