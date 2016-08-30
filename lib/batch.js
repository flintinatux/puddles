const compose = require('ramda/src/compose')
const of      = require('ramda/src/of')
const not     = require('ramda/src/not')
const when    = require('ramda/src/when')

const action = require('./action')

const type  = 'puddles/actions/BATCH',
      toAry = when(compose(not, Array.isArray), of),
      batch = compose(action(type), toAry)

batch.type = type

module.exports = batch
