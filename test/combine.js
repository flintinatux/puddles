// const { expect } = require('chai')

// const { add, always: K, assoc } = require('ramda')

// const { action, combine, handle } = require('..')

// // count reducer

// const count = handle(0, {
//   ADD: add
// })

// count.add = action('ADD')

// // pet reducer

// const petInit = { hungry: true }

// const pet = handle(petInit, {
//   FEED: assoc('hungry', false)
// })

// pet.feed = K(action('FEED', null))

// // then combine them

// const reducer = combine({ count, pet })

// describe('p.combine', () => {
//   let state

//   beforeEach(() => {
//     state = reducer(undefined, {})
//   })

//   it('inits a state object with keys matching the reducer map', () => {
//     expect(state).to.eql({ count: 0, pet: { hungry: true } })
//   })

//   it('calls every child reducer and gathers results', () => {
//     state = reducer(state, count.add(2))
//     expect(state).to.eql({ count: 2, pet: { hungry: true } })

//     state = reducer(state, pet.feed())
//     expect(state).to.eql({ count: 2, pet: { hungry: false } })
//   })
// })
