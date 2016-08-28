const tap = require('ramda/src/tap')

exports.error = tap(console.error.bind(console))

exports.log = tap(console.log.bind(console))

exports.forkable = x => x && typeof x.fork === 'function'
exports.thenable = x => x && typeof x.then === 'function'
