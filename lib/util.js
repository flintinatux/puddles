const compose = require('ramda/src/compose')
const curryN  = require('ramda/src/curryN')
const flyd    = require('flyd')
const tap     = require('ramda/src/tap')

exports.arrInvoker = arr => (...args) =>
  Array.isArray(arr)
    ? arr[0].apply(null, arr.slice(1), ...args)
    : arr(...args)

exports.error = tap(console.error.bind(console))

exports.forkable = x =>
  typeof x.fork === 'function'

exports.log = tap(console.log.bind(console))

exports.present = x =>
  x !== undefined && x !== null

exports.runnable = x =>
  typeof x.run === 'function'

exports.thenable = x =>
  typeof x.then === 'function'

exports.thunked = x =>
  typeof x === 'function'

exports.throttle = s => {
  var id
  return flyd.combine((s, self) => {
    cancelAnimationFrame(id)
    id = requestAnimationFrame(self.bind(null, s()))
  }, [ s ])
}

const wrapHandler = exports.wrapHandler = curryN(2, (dispatch, handler) =>
  typeof handler === 'function'
    ? compose(dispatch, handler)
    : typeof handler[0] === 'function'
      ? [ compose(dispatch, handler[0]), ...handler.slice(1) ]
      : handler.map(wrapHandler(dispatch)))
