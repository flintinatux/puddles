const { expect } = require('chai')
const promise    = require('redux-promise')
const spy        = require('@articulate/spy')

const p = require('..')

const wait = fn =>
  setTimeout(fn, 32)

describe('p.mount', () => {
  const actions = {
    counter: {
      add:     p.action('ADD'),
      promise: a => Promise.resolve(a).then(p.action('RESET')),
      thunk:   a => dispatch => dispatch(p.action('RESET', a))
    }
  }

  const middleware = [ promise ]

  const redraw = spy()

  const reducers = {
    counter: p.handle(0, {
      ADD:   (a, b) => a + b,
      RESET: (a, b) => b
    })
  }

  const Counter = (actions, state) => {
    const { counter: { add } } = actions
    redraw()

    return p('div#counter', [
      p('input#count', {
        attrs: { readonly: true },
        props: { value: state.counter }
      }),
      p('button#minus', { on: { click: [ add, -1 ]} }, '-'),
      p('button#plus',  { on: { click: [ add,  1 ]} }, '+')
    ])
  }

  const Detail = (actions, state) =>
    p('div#detail', [
      p('div#id', state.route.params.id)
    ])

  const Home = () =>
    p('div#home')

  const Layout = Child => (actions, state) =>
    p('div#layout', [
      p('div.nav', [
        p('a#link-home',    { link: { href: '/'        } }, 'Home'),
        p('a#link-counter', { link: { href: '/counter' } }, 'Counter'),
        p('a#link-detail',  { link: { href: '/foo/123' } }, 'Detail'),
        p('a#link-bad',     { link: { href: '/bad'     } }, 'Bad')
      ]),
      p('div.content', [
        Child(actions, state)
      ])
    ])

  const NotFound = () =>
    p('div#not-found')

  const routes = {
    '/':        Layout(Home),
    '/counter': Layout(Counter),
    '/foo/:id': Layout(Detail),
    '/:404+':   Layout(NotFound)
  }

  let dispatch, getState, root, store

  beforeEach(() => {
    root = document.createElement('div')
    document.body.appendChild(root)
  })

  afterEach(() => {
    redraw.reset()
    store.teardown()
  })

  describe('with basic options', () => {
    beforeEach(done => {
      store = p.mount({ actions, reducers, root, view: Counter })
      dispatch = store.dispatch
      getState = store.getState
      wait(done)
    })

    it('returns a store with a dispatch function', () => {
      expect(dispatch).to.be.a('function')
      dispatch(actions.counter.add(2))
      expect(getState()).to.eql({ counter: 2 })
    })

    it('returns a store with a getState function', () => {
      expect(getState).to.be.a('function')
      expect(getState()).to.eql({ counter: 0 })
    })

    it('returns a store with a teardown function', () => {
      expect(store.teardown).to.be.a('function')
      store.teardown()
      expect(document.getElementById('counter')).not.to.exist
      dispatch(actions.counter.add(2))
      expect(getState()).to.eql({ counter: 0 })
    })

    it('mounts the view', () =>
      expect(document.getElementById('counter')).to.exist
    )

    it('redraws after actions are dispatched', done => {
      const elm = document.getElementById('count')
      expect(elm.value).to.equal('0')
      dispatch(actions.counter.add(2))
      wait(() => {
        expect(elm.value).to.equal('2')
        done()
      })
    })

    it('throttles redraws', done => {
      expect(redraw.calls.length).to.equal(1)
      dispatch(actions.counter.add(2))
      dispatch(actions.counter.add(2))
      wait(() => {
        expect(redraw.calls.length).to.equal(2)
        done()
      })
    })

    it('composes actions with dispatch', done => {
      const elm = document.getElementById('count')
      expect(elm.value).to.equal('0')
      document.getElementById('plus').click()
      wait(() => {
        expect(elm.value).to.equal('1')
        done()
      })
    })

    it('includes thunk middleware', () => {
      expect(getState().counter).to.equal(0)
      dispatch(actions.counter.thunk(5))
      expect(getState().counter).to.equal(5)
    })
  })

  describe('with additional middleware', () => {
    beforeEach(done => {
      store = p.mount({ actions, middleware, reducers, root, view: Counter })
      dispatch = store.dispatch
      getState = store.getState
      wait(done)
    })

    it('prepends thunk middleware', () => {
      expect(getState().counter).to.equal(0)
      dispatch(actions.counter.thunk(5))
      expect(getState().counter).to.equal(5)
    })

    it('uses the supplied middleware', done => {
      expect(getState().counter).to.equal(0)
      dispatch(actions.counter.promise(5))
      wait(() => {
        expect(getState().counter).to.equal(5)
        done()
      })
    })
  })

  describe('with routes supplied', () => {
    beforeEach(done => {
      store = p.mount({ actions, reducers, root, routes })
      dispatch = store.dispatch
      getState = store.getState
      wait(done)
    })

    it('adds a route reducer', () =>
      expect(getState().route).to.eql({
        params: {},
        path: '/',
        pattern: '/'
      })
    )

    it('renders the current route', () =>
      expect(document.getElementById('home')).to.exist
    )

    it('wires up link.href with pushState', done => {
      document.getElementById('link-counter').click()
      wait(() => {
        expect(location.href).to.equal('/counter')
        expect(document.getElementById('counter')).to.exist
        done()
      })
    })

    it('parses route params', done => {
      document.getElementById('link-detail').click()
      wait(() => {
        expect(location.href).to.equal('/foo/123')
        expect(getState().route.params.id).to.equal('123')
        expect(document.getElementById('id').innerHTML).to.equal('123')
        done()
      })
    })

    it('multi-matches with the + symbol', done => {
      document.getElementById('link-bad').click()
      wait(() => {
        expect(location.href).to.equal('/bad')
        expect(getState().route.pattern).to.equal('/:404+')
        expect(document.getElementById('not-found')).to.exist
        done()
      })
    })

    it('listens for popstate to navigate back', done => {
      document.getElementById('link-counter').click()
      wait(() => {
        expect(getState().route.path).to.equal('/counter')
        location.href = '/'
        const event = document.createEvent('Event')
        event.initEvent('popstate', true, true)
        dispatchEvent(event)
        wait(() => {
          expect(getState().route.path).to.equal('/')
          done()
        })
      })
    })
  })
})
