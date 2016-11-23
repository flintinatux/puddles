const compose = require('crocks/funcs/compose')
const curryN  = require('ramda/src/curryN')
const flyd    = require('flyd')
const tap     = require('ramda/src/tap')

const caf   = global.cancelAnimationFrame  || global.clearTimeout,
      raf   = global.requestAnimationFrame || global.setTimeout,
      frame = 16

exports.actionable = x =>
  x && (typeof x === 'function' || x.type && x.payload !== undefined)

exports.arrInvoker = arr => (...args) =>
  Array.isArray(arr)
    ? arr[0].apply(null, arr.slice(1), ...args)
    : arr(...args)

exports.error = tap(console.error.bind(console))

exports.forkable = x => x && typeof x.fork === 'function'

exports.log = tap(console.log.bind(console))

exports.runnable = x => x && typeof x.run === 'function'

exports.thenable = x => x && typeof x.then === 'function'

exports.throttle = s => {
  var id, last = 0
  return flyd.combine((s, self) => {
    if (raf === global.requestAnimationFrame || new Date() - last > frame) {
      caf(id)
      id = raf(() => {
        last = new Date()
        self(s())
      }, frame)
    }
  }, [ s ])
}

const wrapHandler = exports.wrapHandler = curryN(2, (dispatch, handler) =>
  typeof handler === 'function'
    ? compose(dispatch, handler)
    : typeof handler[0] === 'function'
      ? [ compose(dispatch, handler[0]), ...handler.slice(1) ]
      : handler.map(wrapHandler(dispatch)))
