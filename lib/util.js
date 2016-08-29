const tap  = require('ramda/src/tap')

exports.actionable = x =>
  x && (typeof x === 'function' || x.type && x.payload !== undefined)

exports.error = tap(console.error.bind(console))

exports.forkable = x => x && typeof x.fork === 'function'

exports.log = tap(console.log.bind(console))

exports.thenable = x => x && typeof x.then === 'function'
