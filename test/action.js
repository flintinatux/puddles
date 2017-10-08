const { expect } = require('chai')

const p = require('..')

describe('p.action', () => {
  const type    = 'TYPE'
  const payload = 'payload'

  it('creates an FSA-style action', () =>
    expect(p.action(type, payload)).to.eql({ type, payload })
  )

  it('is curried', () =>
    expect(p.action(type)(payload)).to.eql({ type, payload })
  )
})
