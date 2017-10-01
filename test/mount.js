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

  const Home = (actions, state) =>
    p('div#home')

  const Layout = Child => (actions, state) =>
    p('div#layout', [
      p('div.nav', [
        p('a', { link: { href: '/'        } }, 'Home'),
        p('a', { link: { href: '/counter' } }, 'Counter'),
        p('a', { link: { href: '/foo/123' } }, 'Detail')
      ]),
      p('div.content', [
        Child(actions, state)
      ])
    ])

  const routes = {
    '/':        Layout(Home),
    '/counter': Layout(Counter),
    '/foo/:id': Layout(Detail)
  }

  let dispatch, getState, store, view

  afterEach(() =>
    redraw.reset()
  )

  describe('with basic options', () => {
    beforeEach(done => {
      const root = document.createElement('div')
      document.body.appendChild(root)
      view = Counter
      store = p.mount({ actions, reducers, root, view })
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

    it('mounts the view', () =>
      expect(document.body.firstChild.id).to.equal('counter')
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
      const root = document.createElement('div')
      document.body.appendChild(root)
      view = Counter
      store = p.mount({ actions, middleware, reducers, root, view })
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
})
