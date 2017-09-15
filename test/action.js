const { expect } = require('chai')

const { action } = require('..')

describe('p.action', () => {
  const type    = 'TYPE'
  const payload = 'payload'

  describe('when supplied with a type and payload', () => {
    const axn = action(type, payload)

    it('creates an FSA-style action', () => {
      expect(axn).to.eql({ type, payload })
    })
  })

  describe('when supplied with just a type', () => {
    const axn = action(type)(payload)

    it('curries to form an action creator', () => {
      expect(axn).to.eql({ type, payload })
    })
  })
})
