const compose = require('ramda/src/compose')
const Debug   = require('debug')
const tap     = require('ramda/src/tap')

const stringify = x =>
  typeof x === 'function' ? `[function ${x.name}]` : JSON.stringify(x)

exports.debug = label => tap(compose(Debug(label), stringify))

exports.error = tap(console.error.bind(console))

exports.log = tap(console.log.bind(console))

exports.forkable = x => x && typeof x.fork === 'function'
exports.thenable = x => x && typeof x.then === 'function'
