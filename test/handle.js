const { expect } = require('chai')

const p = require('..')

const init = 0

const reducer = p.handle(init, {
  ADD: (count, step, error) => error ? step : count + step
})

describe('p.handle', function() {
  var state

  beforeEach(function() {
    state = reducer(undefined, {})
  })

  it('initializes the state for you', function() {
    expect(state).to.equal(0)
  })

  it('handles specified actions', function() {
    state = reducer(state, p.action('ADD', 2))
    expect(state).to.equal(2)
  })

  it('ignores unspecified actions', function() {
    state = reducer(state, p.action('SUB', 2))
    expect(state).to.equal(0)
  })

  it('passes true as third arg for error actions', function() {
    const err = new Error('an error')
    state = reducer(state, p.error('ADD', err))
    expect(state).to.equal(err)
  })
})
