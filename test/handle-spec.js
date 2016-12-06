const { expect } = require('chai')

const action = require('../lib/action')
const error  = require('../lib/error')
const handle = require('../lib/handle')

const init = 0

const reducer = handle(init, {
  ADD: (count, step, error) => error ? step : count + step
})

describe('p.handle', function () {
  var state

  beforeEach(function () {
    state = reducer(undefined, {})
  });

  it('initializes the state for you', function () {
    expect(state).to.equal(0)
  });

  it('handles specified actions', function () {
    state = reducer(state, action('ADD', 2))
    expect(state).to.equal(2)
  });

  it('ignores unspecified actions', function () {
    state = reducer(state, action('SUB', 2))
    expect(state).to.equal(0)
  });

  it('passes true as third arg for error actions', function () {
    const err = new Error('an error')
    state = reducer(state, error('ADD', err))
    expect(state).to.equal(err)
  });
});
