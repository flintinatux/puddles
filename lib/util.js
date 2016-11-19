const flyd = require('flyd')
const tap  = require('ramda/src/tap')

const caf   = window.cancelAnimationFrame  || window.clearTimeout,
      raf   = window.requestAnimationFrame || window.setTimeout,
      frame = 16

exports.actionable = x =>
  x && (typeof x === 'function' || x.type && x.payload !== undefined)

exports.arrInvoker = arr => () => {
  if (!arr.length) return
  return arr.length === 2
    ? arr[0](arr[1])
    : arr[0].apply(undefined, arr.slice(1))
}

exports.error = tap(console.error.bind(console))

exports.forkable = x => x && typeof x.fork === 'function'

exports.log = tap(console.log.bind(console))

exports.runnable = x => x && typeof x.run === 'function'

exports.thenable = x => x && typeof x.then === 'function'

exports.throttle = s => {
  var id, last = 0
  return flyd.combine((s, self) => {
    if (raf === window.requestAnimationFrame || new Date() - last > frame) {
      caf(id)
      id = raf(() => {
        last = new Date()
        self(s())
      }, frame)
    }
  }, [ s ])
}
