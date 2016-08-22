import compose from 'ramda/src/compose'
import Debug   from 'debug'
import tap     from 'ramda/src/tap'

const stringify = x =>
  typeof x === 'function' ? `[function ${x.name}]` : JSON.stringify(x)

export const debug = label => tap(compose(Debug(label), stringify))

export const error = tap(console.error.bind(console))

export const log = tap(console.log.bind(console))

export const forkable = x => x && typeof x.fork === 'function'
export const thenable = x => x && typeof x.then === 'function'
