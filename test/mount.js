const { expect } = require('chai')
const spy        = require('@articulate/spy')

const p = require('..')
const { wait } = require('./lib/util')

describe('p.mount', () => {
  const actions = {
    counter: {
      add: p.action('ADD')
    }
  }

  const redraw = spy()

  const reducers = {
    counter: p.handle(0, {
      ADD: (a, b) => a + b
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

  describe('with a plain view', () => {
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
  })
})
