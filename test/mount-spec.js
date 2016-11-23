/* jshint expr: true */

const { compose } = require('crocks')
const { expect }  = require('chai')
const { jsdom }   = require('jsdom')
const h = require('snabbdom/h')

const action = require('../lib/action')
const handle = require('../lib/handle')
const mount  = require('../lib/mount')

global.document = jsdom()

const raf = fn =>
  setTimeout(fn, 60)

const reducer = handle(0, {
  INC: (count, step) => count + step
})

const view = state =>
  h('div.foo', {
    on: { click: [ action('INC'), 2 ] }
  }, state)

describe('p.mount', function () {
  var dispatch, root, state, teardown

  beforeEach(function (done) {
    const elm = document.createElement('div'),
          res = mount(elm, view, reducer)
    dispatch  = res.dispatch
    root      = res.root
    state     = res.state
    teardown  = res.teardown
    raf(done)
  });

  it('returns dispatch, state, and root vnode streams', function () {
    expect(dispatch).to.be.a('function')
    expect(root).to.be.a('function')
    expect(state).to.be.a('function')

    expect(state()).to.equal(0)
    dispatch(action('INC', 2))
    expect(state()).to.equal(2)

    expect(root().sel).to.equal('div.foo')
  });

  it('mounts the view', function () {
    expect(root().elm.classList.contains('foo')).to.be.true
  });

  it('redraws after actions are dispatched', function (done) {
    expect(root().text).to.equal(0)
    dispatch(action('INC', 2))
    raf(() => {
      expect(root().text).to.equal(2)
      done()
    })
  });

  it('composes event handlers with the dispatch function', function () {
    expect(state()).to.equal(0)
    root().elm.click()
    expect(state()).to.equal(2)
  });

  describe('when called without a reducer', function () {
    beforeEach(function (done) {
      const elm = document.createElement('div'),
            res = mount(elm, view)
      root  = res.root
      state = res.state
      raf(done)
    });

    it('defaults the reducer to Identity', function () {
      expect(state()).to.be.undefined
      root().elm.click()
      expect(state()).to.be.undefined
    });
  });
});
