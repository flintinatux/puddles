const compose  = require('crocks/helpers/compose')
const curry    = require('crocks/helpers/curry')
const identity = require('crocks/combinators/identity')
const map      = require('ramda/src/map')
const property = require('prop-factory')
const thrush   = require('crocks/combinators/reverseApply')

const mount = opts => {
  if (!requestAnimationFrame) require('raf/polyfill')

  const {
    actions    = {},
    middleware = [],
    reducer    = identity,
    root,
    view
  } = opts

  const elm = property(root)

  const getState = property(reducer(undefined, {}))

  const update = axn => {
    getState(reducer(getState(), axn))
    render()
  }

  const dispatch = axn =>
    flow(axn)

  const store = { dispatch, getState }

  const wrapped = map(wrap(dispatch), actions)

  const flow = middleware.length
    ? compose(...map(thrush(store), middleware))(update)
    : update

  const render = throttle(function _render() {
    elm(patch(elm(), view(wrapped, getState())))
  })

  return { dispatch, getState, teardown }
}

const throttle = f => {
  let args
  let lock = false

  const exec = () => {
    f.apply(null, args)
    lock = false
  }

  const throttled = () => {
    args = Array.prototype.slice.call(arguments)
    if (!lock) {
      requestAnimationFrame(exec)
      lock = true
    }
  }

  return throttled
}

const wrap = curry((dispatch, action) =>
  typeof action === 'function'
    ? compose(dispatch, action)
    : map(wrap(dispatch), action)
)

module.exports = mount
