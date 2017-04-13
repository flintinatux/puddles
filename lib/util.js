const allPass = require('ramda/src/allPass')
const anyPass = require('ramda/src/anyPass')
const compose = require('ramda/src/compose')
const curryN  = require('ramda/src/curryN')
const flyd    = require('flyd')
const tap     = require('ramda/src/tap')

const arrInvoker = arr => (...args) =>
  Array.isArray(arr)
    ? arr[0].apply(null, arr.slice(1), ...args)
    : arr(...args)

const error = tap(console.error.bind(console))

const fluxStandard = x =>
  x.type && x.payload !== undefined

const forkable = x =>
  x && typeof x.fork === 'function'

const log = tap(console.log.bind(console))

const present = x =>
  x !== undefined && x !== null

const runnable = x =>
  x && typeof x.run === 'function'

const thenable = x =>
  x && typeof x.then === 'function'

const thunked = x =>
  x && typeof x === 'function'

const actionable = allPass([
  present,
  anyPass([
    thunked,
    forkable,
    runnable,
    thenable,
    fluxStandard
  ])
])

const throttle = s => {
  var id
  return flyd.combine((s, self) => {
    cancelAnimationFrame(id)
    id = requestAnimationFrame(self.bind(null, s()))
  }, [ s ])
}

const wrapHandler = curryN(2, (dispatch, handler) =>
  typeof handler === 'function'
    ? compose(dispatch, handler)
    : typeof handler[0] === 'function'
      ? [ compose(dispatch, handler[0]), ...handler.slice(1) ]
      : handler.map(wrapHandler(dispatch)))

module.exports = {
  actionable,
  arrInvoker,
  error,
  fluxStandard,
  forkable,
  log,
  present,
  runnable,
  thenable,
  thunked,
  throttle,
  wrapHandler
}
