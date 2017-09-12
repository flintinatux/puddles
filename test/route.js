const { expect } = require('chai')
const h = require('snabbdom/h').default
const { path } = require('ramda')

const href     = require('../lib/href')
const combine  = require('../lib/combine')
const mount    = require('../lib/mount')
const route    = require('../lib/route')
const { spy, wait } = require('./lib/util')

const child = path(['children', 0])

const reducer = combine({ route: route.reducer })

const home = ({ route }) =>
  h('div.home', {
    class: { active: route.path === '/home' }
  })

const user = ({ route }) =>
  h('div.user', route.params.name)

describe('p.route', function() {
  var current, root, router, state

  beforeEach(function (done) {
    const view = route('/home', {
      '/home': home,
      '/user/:name': user
    })

    const elm = document.createElement('div'),
          res = mount(elm, view, reducer)
    root  = res.root
    state = res.state

    router  = root.map(child)
    current = router.map(child)

    wait(done)
  })

  it('creates a root elem with selector `div#root`', function() {
    expect(root().sel).to.equal('div#root')
  })

  it('creates a single child with selector `div#router`', function() {
    expect(router().sel).to.equal('div#router')
  })

  it('nests the current view inside the #router elem', function() {
    expect(current().sel).to.equal('div.home')
  })

  it('defaults to the initial path', function() {
    expect(state().route.path).to.equal('/home')
  })

  it('passes full state down to current view', function() {
    expect(current().elm.classList.contains('active')).to.be.true
  })

  describe('when route changes to a registered pattern', function() {
    const name = 'flintinatux'

    beforeEach(function (done) {
      location.hash = href(`/user/${name}`)
      wait(done)
    })

    it('swaps the current view', function() {
      expect(current().sel).to.equal('div.user')
    })

    it('matches route params', function() {
      expect(state().route.params.name).to.equal(name)
      expect(current().text).to.equal(name)
    })
  })

  describe('when new route does not match any patterns', function() {
    var _error

    const notFound = () =>
      location.hash = href('/not-found')

    beforeEach(function (done) {
      _error = console.error
      console.error = spy()
      expect(notFound).to.not.throw()
      wait(done)
    })

    afterEach(function() {
      console.error = _error
    })

    it('logs an error', function() {
      expect(console.error.calls[0].args[0]).to.contain('Route not found')
    })

    it('stays put', function() {
      expect(state().route.path).to.equal('/home')
    })
  })
})
