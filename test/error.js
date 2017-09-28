const { expect } = require('chai')

const p = require('..')

describe('p.error', () => {
  const type    = 'TYPE'
  const payload = new Error('this is an error')

  it('creates an FSA-style action representing an error', () =>
    expect(p.error(type, payload)).to.eql({ type, payload, error: true })
  )

  it('is curried', () =>
    expect(p.error(type)(payload)).to.eql({ type, payload, error: true })
  )
})
