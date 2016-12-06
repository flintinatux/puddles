const { expect } = require('chai')

const { add, always: K, assoc } = require('ramda')

const action  = require('../lib/action')
const combine = require('../lib/combine')
const handle  = require('../lib/handle')

// count reducer

const count = handle(0, {
  ADD: add
})

count.add = action('ADD')

// ui reducer

const petInit = { hungry: true }

const pet = handle(petInit, {
  FEED: assoc('hungry', false)
})

pet.feed = K(action('FEED', null))

// then combine them

const reducer = combine({ count, pet })

describe('p.combine', function () {
  var state

  beforeEach(function () {
    state = reducer(undefined, {})
  });

  it('inits a state object with keys matching the reducer map', function () {
    expect(state.count).to.equal(0)
    expect(state.pet).to.equal(petInit)
  });

  it('calls every child reducer and gathers results', function () {
    state = reducer(state, count.add(2))
    expect(state.count).to.equal(2)
    state = reducer(state, pet.feed())
    expect(state.pet.hungry).to.be.false
  });
});
