const { Async, IO } = require('crocks')
const { expect } = require('chai')
const h = require('snabbdom/h').default

const action = require('../lib/action')
const handle = require('../lib/handle')
const mount  = require('../lib/mount')

const { spy, wait } = require('./lib/util')

const add = action('ADD')

const reducer = handle(0, {
  ADD: (count, step, error) => error ? step : count + step
})

const view = state =>
  h('div.foo', {
    on: { click: [ add, 2 ] }
  }, state)

describe('p.mount', function() {
  var dispatch, root, state, teardown

  beforeEach(function (done) {
    const elm = document.createElement('div')
    const res = mount(elm, view, reducer)
    dispatch  = res.dispatch
    root      = res.root
    state     = res.state
    teardown  = res.teardown
    expect(state()).to.equal(0)
    wait(done)
  })

  afterEach(function() {
    teardown()
  })

  it('returns a dispatch stream', function() {
    expect(dispatch).to.be.a('function')
    dispatch(add(2))
    expect(state()).to.equal(2)
  })

  it('returns a state stream', function() {
    expect(state).to.be.a('function')
    expect(state()).to.equal(0)
  })

  it('returns a root vnode stream', function() {
    expect(root).to.be.a('function')
    expect(root().sel).to.equal('div.foo')
  })

  describe('returns a teardown function, that when called', function() {
    beforeEach(function() {
      expect(teardown).to.be.a('function')
      teardown()
    })

    it('patches the root to be an empty div', function() {
      expect(root().sel).to.equal('div')
      expect(root().children).to.be.undefined
    })

    it('ends all the streams', function() {
      expect(dispatch.end()).to.be.true
      expect(root.end()).to.be.true
      expect(state.end()).to.be.true
      dispatch(add(2))
      expect(state()).to.equal(0)
    })
  })

  it('mounts the view', function() {
    expect(root().elm.classList.contains('foo')).to.be.true
  })

  it('redraws after actions are dispatched', function (done) {
    expect(root().text).to.equal(0)
    dispatch(add(2))
    wait(() => {
      expect(root().text).to.equal(2)
      done()
    })
  })

  it('throttles redraws', function (done) {
    const redraw = spy()
    root.map(redraw)
    expect(redraw.calls.length).to.equal(1) // to initialize stream
    dispatch(add(2))
    dispatch(add(3))
    wait(() => {
      expect(redraw.calls.length).to.equal(2) // only one redraw
      done()
    })
  })

  it('composes event handlers with the dispatch function', function() {
    root().elm.click()
    expect(state()).to.equal(2)
  })

  it('runs dispatched thunk functions', function (done) {
    const thunk = (d, s) => {
      d(add(2))
      wait(() => {
        expect(s()).to.equal(2)
        done()
      })
    }
    dispatch(thunk)
  })

  it('forks dispatched forkables', function (done) {
    const forkable = Async((rej, res) => {
      res(add(2))
    })
    dispatch(forkable)
    wait(() => {
      expect(state()).to.equal(2)
      done()
    })
  })

  it('runs dispatched runnables', function (done) {
    const runnable = IO(() => add(2))
    dispatch(runnable)
    wait(() => {
      expect(state()).to.equal(2)
      done()
    })
  })

  it('resolves dispatched thenables', function (done) {
    const thenable = new Promise(res => res(add(2)))
    dispatch(thenable)
    wait(() => {
      expect(state()).to.equal(2)
      done()
    })
  })

  it('maps over dispatched functors', function() {
    dispatch([ add(2), add(3) ])
    expect(state()).to.equal(5)
  })

  describe('when a forkable payload is resolved', function() {
    beforeEach(function() {
      dispatch(add(Async((rej, res) => res(2))))
    })

    it('dispatches a new action with resolved value', function() {
      expect(state()).to.equal(2)
    })
  })

  describe('when a forkable payload is rejected', function() {
    const err = new Error('an error')

    beforeEach(function() {
      dispatch(add(Async(rej => rej(err))))
    })

    it('dispatches a matching error action', function() {
      expect(state()).to.equal(err)
    })
  })

  describe('when a runnable payload is supplied', function() {
    beforeEach(function() {
      dispatch(add(IO(() => 2)))
    })

    it('runs and dispatches a new action with the result', function() {
      expect(state()).to.equal(2)
    })
  })

  describe('when a thenable payload is resolved', function() {
    beforeEach(function (done) {
      dispatch(add(new Promise(res => res(2))))
      wait(done)
    })

    it('dispatches a new action with the resolved value', function() {
      expect(state()).to.equal(2)
    })
  })

  describe('when a thenable payload is rejected', function() {
    const err = new Error('an error')

    beforeEach(function (done) {
      dispatch(add(new Promise((res, rej) => rej(err))))
      wait(done)
    })

    it('dispatches a matching error action', function() {
      expect(state()).to.equal(err)
    })
  })

  describe('when called without a reducer', function() {
    beforeEach(function (done) {
      const elm = document.createElement('div')
      const res = mount(elm, view)
      root  = res.root
      state = res.state
      expect(state()).to.be.undefined
      wait(done)
    })

    it('defaults the reducer to Identity', function() {
      root().elm.click()
      expect(state()).to.be.undefined
    })
  })
})
